import { Injectable, InternalServerErrorException, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createId } from "@paralleldrive/cuid2";
import * as qiniu from "qiniu";
import sharp from "sharp";

import { Config } from "../config/schema";

// Objects are stored under the following path in the bucket:
// "<bucketName>/<userId>/<type>/<fileName>",
// where `userId` is a unique identifier (cuid) for the user,
// where `type` can either be "pictures", "previews" or "resumes",
// and where `fileName` is a unique identifier (cuid) for the file.

type ImageUploadType = "pictures" | "previews";
type DocumentUploadType = "resumes";
export type UploadType = ImageUploadType | DocumentUploadType;

@Injectable()
export class StorageService implements OnModuleInit {
  private readonly logger = new Logger(StorageService.name);

  private bucketName: string;
  private accessKey: string;
  private secretKey: string;
  private domain: string;
  private mac: qiniu.auth.digest.Mac;
  private config: qiniu.conf.Config;
  private bucketManager: qiniu.rs.BucketManager;

  constructor(private readonly configService: ConfigService<Config>) {}

  onModuleInit() {
    this.bucketName = this.configService.getOrThrow<string>("STORAGE_BUCKET");
    this.accessKey = this.configService.getOrThrow<string>("QINIU_ACCESS_KEY");
    this.secretKey = this.configService.getOrThrow<string>("QINIU_SECRET_KEY");
    this.domain = this.configService.getOrThrow<string>("QINIU_DOMAIN");

    this.mac = new qiniu.auth.digest.Mac(this.accessKey, this.secretKey);
    this.config = new qiniu.conf.Config({ zone: qiniu.zone.Zone_z0 }); // you may need to configure this based on your region
    this.bucketManager = new qiniu.rs.BucketManager(this.mac, this.config);

    this.logger.log("Successfully initialized Qiniu storage service.");
  }

  async bucketExists(): Promise<void> {
    return new Promise((resolve, reject) => {
      void this.bucketManager.getBucketInfo(this.bucketName, (err, respBody, respInfo) => {
        if (err) {
          reject(err);
        }
        if (respInfo.statusCode === 200) {
          resolve();
        } else if (respInfo.statusCode === 612) {
          reject(new InternalServerErrorException("Bucket does not exist."));
        } else {
          reject(
            new InternalServerErrorException(
              `Error checking bucket existence: ${respInfo.statusCode}`,
            ),
          );
        }
      });
    });
  }

  async uploadObject(
    userId: string,
    type: UploadType,
    buffer: Buffer,
    filename: string = createId(),
  ) {
    const extension = type === "resumes" ? "pdf" : "jpg";
    const filepath = `${userId}/${type}/${filename}.${extension}`;
    const uploadToken = this.generateUploadToken(filepath);

    try {
      if (extension === "jpg") {
        buffer = await sharp(buffer)
          .resize({ width: 600, height: 600, fit: sharp.fit.outside })
          .jpeg({ quality: 80 })
          .toBuffer();
      }

      const formUploader = new qiniu.form_up.FormUploader(this.config);
      const putExtra = new qiniu.form_up.PutExtra();
      const result = await this.uploadToQiniu(
        formUploader,
        uploadToken,
        filepath,
        buffer,
        putExtra,
      );

      return `${this.domain}/${result.key}`;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException("There was an error while uploading the file.");
    }
  }

  private generateUploadToken(key: string): string {
    const options = {
      scope: `${this.bucketName}:${key}`,
      expires: 3600,
    };
    const putPolicy = new qiniu.rs.PutPolicy(options);
    return putPolicy.uploadToken(this.mac);
  }

  private uploadToQiniu(
    formUploader: qiniu.form_up.FormUploader,
    uploadToken: string,
    key: string,
    buffer: Buffer,
    putExtra: qiniu.form_up.PutExtra,
  ): Promise<{ key: string }> {
    return new Promise((resolve, reject) => {
      void formUploader.put(uploadToken, key, buffer, putExtra, (err, body, info) => {
        if (err) {
          reject(err);
        }
        if (info.statusCode === 200) {
          resolve(body);
        } else {
          reject(new Error(`Qiniu upload failed with status code: ${info.statusCode}`));
        }
      });
    });
  }

  async deleteObject(userId: string, type: UploadType, filename: string): Promise<void> {
    const extension = type === "resumes" ? "pdf" : "jpg";
    const filepath = `${userId}/${type}/${filename}.${extension}`;

    try {
      await this.deleteFromQiniu(filepath);
      return;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        `There was an error while deleting the document at the specified path: ${filepath}.`,
      );
    }
  }

  private deleteFromQiniu(key: string): Promise<void> {
    return new Promise((resolve, reject) => {
      void this.bucketManager.delete(this.bucketName, key, (err, _, respInfo) => {
        if (err) {
          reject(err);
        }
        if (respInfo.statusCode === 200) {
          resolve();
        } else {
          reject(new Error(`Qiniu delete failed with status code: ${respInfo.statusCode}`));
        }
      });
    });
  }

  async deleteFolder(prefix: string): Promise<void> {
    try {
      const filesToDelete = await this.listObjects(prefix);
      await this.deleteMultipleObjects(filesToDelete);
      return;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        `There was an error while deleting the folder at the specified path: ${this.bucketName}/${prefix}.`,
      );
    }
  }

  private listObjects(prefix: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      void this.bucketManager.listPrefix(this.bucketName, { prefix }, (err, respBody, respInfo) => {
        if (err) {
          reject(err);
        }
        if (respInfo.statusCode === 200) {
          const files = respBody.items.map((item: { key: string }) => item.key);
          resolve(files);
        } else {
          reject(new Error(`Qiniu list failed with status code: ${respInfo.statusCode}`));
        }
      });
    });
  }

  private deleteMultipleObjects(keys: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
      const deleteOperations = keys.map((key) => qiniu.rs.deleteOp(this.bucketName, key));
      void this.bucketManager.batch(deleteOperations, (err, _, respInfo) => {
        if (err) {
          reject(err);
        }
        if (respInfo.statusCode === 200 || respInfo.statusCode === 298) {
          // 298 is partial success
          resolve();
        } else {
          reject(new Error(`Qiniu batch delete failed with status code: ${respInfo.statusCode}`));
        }
      });
    });
  }
}
