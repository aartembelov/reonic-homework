import { Injectable, Logger, OnApplicationShutdown, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy, OnApplicationShutdown {
	constructor(private readonly configService: ConfigService) {
		super({
			datasources: {
				db: {
					url: configService.get<string>("DATABASE_URL"),
				},
			},
		});
	}

	async onModuleInit() {
		try {
			await this.$connect();
			Logger.log("Database connected");
		} catch (error) {
			Logger.error("Error connecting to the database:", error);
		}
	}

	async onModuleDestroy() {
		await this.$disconnect();
	}

	async onApplicationShutdown(signal: string) {
		Logger.log(`Received shutdown signal: ${signal}`);
		await this.$disconnect();
	}
}
