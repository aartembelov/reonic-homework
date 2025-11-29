import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { AppModule } from "./modules/app/app.module";
import { Logger } from "@nestjs/common";

const main = async () => {
	const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

	app.enableShutdownHooks();

	const port = Number(process.env.PORT!);
	await app.listen(port, "0.0.0.0");

	Logger.log("Listening to port: ", port);
};

main().catch((error) => {
	console.error(error);
});
