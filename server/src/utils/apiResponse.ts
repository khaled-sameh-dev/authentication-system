// src/common/utils/api-response.ts
import { Response } from "express";

export interface IResponseMeta {
  timestamp: string;
  [key: string]: unknown;
}

export interface IApiResponse<T> {
  success: boolean;
  statusCode: number;
  message?: string;
  data?: T;
  meta?: IResponseMeta;
}

export class ApiResponse {

  public static send<T>(
    res: Response,
    statusCode: number,
    data?: T,
    message?: string,
    meta?: Omit<IResponseMeta, "timestamp">,
  ): Response {
    const responsePayload: IApiResponse<T> = {
      success: true,
      statusCode,
      ...(message && { message }),
      ...(data !== undefined && { data }),
      meta: {
        timestamp: new Date().toISOString(),
        ...meta,
      },
    };

    return res.status(statusCode).json(responsePayload);
  }


  public static success<T>(
    res: Response,
    data?: T,
    message?: string,
    meta?: Omit<IResponseMeta, "timestamp">,
  ): Response {
    return ApiResponse.send(res, 200, data, message, meta);
  }


  public static created<T>(
    res: Response,
    data?: T,
    message = "Resource created successfully",
  ): Response {
    return ApiResponse.send(res, 201, data, message);
  }

}
