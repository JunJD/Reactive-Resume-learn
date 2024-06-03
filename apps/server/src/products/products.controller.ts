import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { CreateProductDto, UpdateProductDto } from "@reactive-resume/dto";

import ProductsService from "./products.service";

@Controller("products")
export default class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  getAllProducts() {
    return this.productsService.getAllProducts();
  }

  @Get(":id")
  getProductById(@Param("id") id: string) {
    return this.productsService.getProductById(id);
  }

  @Post()
  async createProduct(@Body() product: CreateProductDto) {
    console.log(product, "product");
    return this.productsService.createProduct(product);
  }

  @Put(":id")
  async replaceProduct(@Param("id") id: string, @Body() product: UpdateProductDto) {
    return this.productsService.updateProduct(id, product);
  }

  @Delete(":id")
  async deleteProduct(@Param("id") id: string) {
    return this.productsService.deleteProduct(id);
  }
}
