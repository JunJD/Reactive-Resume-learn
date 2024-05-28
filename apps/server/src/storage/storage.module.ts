import { Module } from "@nestjs/common";
import type {} from "multer";

import { StorageController } from "./storage.controller";
import { StorageService } from "./storage.service";

@Module({
  imports: [],
  controllers: [StorageController],
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule {}
