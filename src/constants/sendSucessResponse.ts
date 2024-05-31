import { Response } from 'express';
import HttpStatusCodes from './HttpStatusCodes';

export const sendSuccessResponse = (
  res: Response,
  status: HttpStatusCodes,
  data: object | undefined | void | null | number,
) => {
  return res.status(200).json({ success: true, status, data });
};
