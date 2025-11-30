import { PipeTransform, Injectable, BadRequestException } from "@nestjs/common";
import Ajv, { ErrorObject, Schema, ValidateFunction } from "ajv";
import addFormats from "ajv-formats";
import { CustomError } from "../../modules/errors/custom-error";

@Injectable()
export class JsonSchemaValidationPipe implements PipeTransform {
	private validate: ValidateFunction;

	constructor(schema: Schema) {
		const ajv = new Ajv({ allErrors: true, strict: false }); // <-- correct
		addFormats(ajv);
		this.validate = ajv.compile(schema);
	}

	transform(value: unknown) {
		const valid = this.validate(value);
		if (!valid && this.validate.errors) {
			const messages = this.validate.errors.map((err: ErrorObject) => {
				const path = err.instancePath || err.schemaPath;
				return `${path}: ${err.message}`;
			});

			throw new CustomError(messages.join("; "));
		}
		return value;
	}
}
