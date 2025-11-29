import { PipeTransform, Injectable, BadRequestException } from "@nestjs/common";
import Ajv, { Schema, ValidateFunction } from "ajv";
import addFormats from "ajv-formats";
import fs from "fs";

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
		if (!valid) {
			throw new BadRequestException({ errors: this.validate.errors });
		}
		return value;
	}
}
