import { ArgumentsHost, HttpStatus, ExceptionFilter as NestExceptionFilter } from "@nestjs/common";
import { CustomError } from "../../modules/errors/custom-error";

export class ExceptionFilter implements NestExceptionFilter {
	catch(exception: unknown, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse();

		const responseBody = {
			message: "Unknown error",
		};

		if (exception instanceof CustomError) {
			responseBody.message = exception.message;
		}

		response.code(HttpStatus.BAD_REQUEST).send(responseBody);
	}
}
