import { Prisma } from '@prisma/client';
import { RESULT_CODE_NAME } from '../../constant';

/**
 * CustomError
 * @param code
 * @param option
 * @param option.data
 * @param option.logging
 * @param originalError
 */
export default class CustomError extends Error {
  status: number;
  code: number;
  message: string;
  data?: any;
  context?: string;
  meta?: any;

  constructor(
    code: number,
    option: CustomErrorOption = {},
    originalError?: Error
  ) {
    const codeName = RESULT_CODE_NAME[code] || 'UNKNOWN_ERROR';
    super(codeName);
    Error.captureStackTrace(this, CustomError);

    this.code = code;
    this.message = codeName;
    this.data = option.data;
    this.status = option.status || 400;
    this.context = option.context;

    if (
      originalError instanceof Prisma.PrismaClientKnownRequestError &&
      originalError.meta
    ) {
      this.meta = originalError.meta;
    }
  }
}

interface CustomErrorOption {
  status?: number;
  data?: any;
  context?: string;
  meta?: string;
}
