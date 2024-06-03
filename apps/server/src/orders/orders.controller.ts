import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { User as UserEntity } from "@prisma/client";
import {
  CreateOrderDto,
  FilteringDto,
  PaginatedOrdersResultDto,
  PaginationDto,
  UpdateOrderDto,
} from "@reactive-resume/dto";

import { TwoFactorGuard } from "../auth/guards/two-factor.guard";
import { User } from "../user/decorators/user.decorator";
import OrdersService from "./orders.service";

@Controller("orders")
export default class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  getAllOrders(
    @Query() paginationDto: PaginationDto,
    @Query() filteringDto: FilteringDto,
  ): Promise<PaginatedOrdersResultDto> {
    paginationDto.page = paginationDto.page ? Number(paginationDto.page) : 1;
    paginationDto.limit = paginationDto.limit ? Number(paginationDto.limit) : 10;

    return this.ordersService.getAllOrders(
      {
        ...paginationDto,
        limit: paginationDto.limit > 10 ? 10 : paginationDto.limit,
      },
      filteringDto,
    );
  }

  @Get(":id")
  getOrderById(@Param("id") id: string) {
    return this.ordersService.getOrderById(id);
  }

  @Post()
  @UseGuards(TwoFactorGuard)
  async createOrder(@User() user: UserEntity, @Body() order: CreateOrderDto) {
    return this.ordersService.createOrder(user.id, order);
  }

  @Put(":id")
  @UseGuards(TwoFactorGuard)
  async replaceOrder(
    @User() user: UserEntity,
    @Param("id") id: string,
    @Body() order: UpdateOrderDto,
  ) {
    return this.ordersService.updateOrder(user.id, id, order);
  }

  @Delete(":id")
  async deleteOrder(@Param("id") id: string) {
    return this.ordersService.deleteOrder(id);
  }
}
