import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateProductDto, UpdateProductDto } from "@reactive-resume/dto";
import { PrismaService } from "nestjs-prisma";

@Injectable()
export default class ProductsService {
  constructor(private prisma: PrismaService) {}

  async getAllProducts() {
    return this.prisma.product.findMany();
  }

  async getProductById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });
    if (product) {
      return product;
    }
    throw new HttpException("Product not found", HttpStatus.NOT_FOUND);
  }

  async createProduct(product: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        ...product,
        productCode: product.id,
      },
    });
  }

  async updateProduct(id: string, product: UpdateProductDto) {
    try {
      const updatedProduct = await this.prisma.product.update({
        where: { id },
        data: {
          price: product.price,
          productName: product.productName,
        },
      });
      return updatedProduct;
    } catch {
      throw new HttpException("Product not found", HttpStatus.NOT_FOUND);
    }
  }

  async deleteProduct(id: string) {
    try {
      await this.prisma.product.delete({
        where: { id },
      });
    } catch {
      throw new HttpException("Product not found", HttpStatus.NOT_FOUND);
    }
  }
}
