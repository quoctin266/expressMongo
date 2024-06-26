import { Request, Response } from "express";
import PaymentService from "./payment.service";

export default class PaymentController {
  static async addCart(req: Request, res: Response) {
    const { id } = req.params;
    const { courses }: { courses: string[] } = req.body;

    let result = await PaymentService.addToCart(id, courses);

    res.status(result.status).json(result);
  }

  static async getCart(req: Request, res: Response) {
    const { id } = req.params;

    let result = await PaymentService.getCart(id);

    res.status(result.status).json(result);
  }

  static async removeFromCart(req: Request, res: Response) {
    const { userId, courseId } = req.params;

    let result = await PaymentService.deleteFromCart(userId, courseId);

    res.status(result.status).json(result);
  }

  static async createOrder(req: Request, res: Response) {
    const { userId, coursesId } = req.body;

    let result = await PaymentService.createOrder(userId, coursesId);

    res.status(result.status).json(result);
  }

  static async confirmOrder(req: Request, res: Response) {
    const { orderId, totalPrice, paymentMethod } = req.body;

    let result = await PaymentService.confirmOrder(
      orderId as string,
      +totalPrice as number,
      paymentMethod as string
    );

    res.status(result.status).json(result);
  }

  static async checkOut(req: Request, res: Response) {
    const { orderId, totalPrice, mobile } = req.query as any;

    await PaymentService.checkOut(
      orderId as string,
      +totalPrice as number,
      mobile as boolean,
      res
    );
  }

  static async processTransaction(req: Request, res: Response) {
    const { payerId, paymentId, price, orderId } = req.query as any;

    await PaymentService.processTransaction(
      payerId as string,
      paymentId as string,
      +price as number,
      orderId as string
    );
  }

  static async getOrder(req: Request, res: Response) {
    const { id } = req.params;

    let result = await PaymentService.getOrder(id);

    res.status(result.status).json(result);
  }

  static async updateOrderStatus(req: Request, res: Response) {
    const { id } = req.params;

    let result = await PaymentService.updateOrderStatus(id);

    res.status(result.status).json(result);
  }

  static async sendMail(req: Request, res: Response) {
    const { orderId } = req.params;

    await PaymentService.sendMail(orderId);

    res.status(200).json("ok");
  }
}
