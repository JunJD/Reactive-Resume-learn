import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Logger } from "@nestjs/common";
import {
  CreateOrderDto,
  FilteringDto,
  PaginatedOrdersResultDto,
  PaginationDto,
  UpdateOrderDto,
} from "@reactive-resume/dto";
import { delay } from "@reactive-resume/utils";
import { PrismaService } from "nestjs-prisma";

import { AlipayService } from "../alipay/alipay.service";
import { TRADE_STATUS } from "../alipay/common/constants";

@Injectable()
export default class OrdersService {
  constructor(
    private prisma: PrismaService,
    private alipayServer: AlipayService,
  ) {}

  private static getFilterQuery(filteringDto: FilteringDto) {
    const filters: Partial<FilteringDto> = {};

    if (filteringDto.id) {
      filters.id = filteringDto.id;
    }

    if (filteringDto.orderCode) {
      filters.orderCode = filteringDto.orderCode;
    }

    if (filteringDto.orderType) {
      filters.orderType = filteringDto.orderType;
    }

    if (filteringDto.orderStatus) {
      filters.orderStatus = filteringDto.orderStatus;
    }

    return filters;
  }

  async getAllOrders(
    paginationDto: PaginationDto,
    filteringDto: FilteringDto,
  ): Promise<PaginatedOrdersResultDto> {
    const skippedItems = (paginationDto.page - 1) * paginationDto.limit;

    const filters = OrdersService.getFilterQuery(filteringDto);

    const [orders, totalCount] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        where: filters,
        skip: skippedItems,
        take: paginationDto.limit,
        orderBy: {
          id: "desc",
        },
      }),
      this.prisma.order.count({
        where: filters,
      }),
    ]);

    return {
      totalCount,
      page: paginationDto.page,
      limit: paginationDto.limit,
      data: orders as UpdateOrderDto[],
    };
  }

  async getOrderById(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });
    if (order) {
      return order;
    }
    throw new HttpException("Order not found", HttpStatus.NOT_FOUND);
  }

  async createOrder(userId: string, order: CreateOrderDto) {
    return await this.prisma.$transaction(async (prisma) => {
      const newOrder = await prisma.order.create({
        data: {
          ...order,
          orderCode: order.id,
          userId,
        },
      });
      const newPayment = await this.alipayServer.preCreateOrder(order);
      const paymentRecord = await prisma.payment.create({
        data: {
          orderId: order.id,
          tradeNo: newPayment.traceId,
          qrCode: newPayment.qrCode,
          traceId: newPayment.traceId,
          amount: order.totalPrice,
          status: order.orderStatus,
        },
      });
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.pollPayResult(userId, order);
      return { ...newOrder, paymentInfo: paymentRecord };
    });
  }

  async updateOrder(userId: string, id: string, order: UpdateOrderDto) {
    try {
      const updatedOrder = await this.prisma.order.update({
        where: { userId, id },
        data: order,
      });
      return updatedOrder;
    } catch {
      throw new HttpException("Order not found", HttpStatus.NOT_FOUND);
    }
  }

  async deleteOrder(id: string) {
    try {
      const deletedOrder = await this.prisma.order.delete({
        where: { id },
      });
      return deletedOrder;
    } catch {
      throw new HttpException("Order not found", HttpStatus.NOT_FOUND);
    }
  }

  async pollPayResult(useId: string, order: CreateOrderDto) {
    let tradeStatus;
    const startTime = Date.now();
    const overtime = 1 * 60 * 1000; /**1min */
    const delayTime = 3 * 1000; /**3s */

    await this.updateOrder(useId, order.id, {
      ...order,
      orderStatus: "PROCESSING",
    });

    while (tradeStatus !== TRADE_STATUS.TRADE_SUCCESS && Date.now() - startTime <= overtime) {
      Logger.debug(tradeStatus, TRADE_STATUS.TRADE_SUCCESS);
      Logger.debug(Date.now() - startTime <= overtime, "Date.now() - startTime <= overtime");
      await delay(delayTime);
      const result = await this.alipayServer.queryByAliPay(order.id);
      const { code, buyerLogonId, buyerPayAmount, tradeStatus: _tradeStatus } = result;
      Logger.debug(code, buyerLogonId, buyerPayAmount, _tradeStatus);
      tradeStatus = _tradeStatus;
    }

    await this.updateOrder(useId, order.id, {
      ...order,
      orderStatus: tradeStatus === TRADE_STATUS.TRADE_SUCCESS ? "SHIPPED" : "CANCELLED",
    });
  }
}
