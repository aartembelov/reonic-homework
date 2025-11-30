import { Module } from "@nestjs/common";
import { InvoicesModule } from "../invoices/invoices.module";
import { PrismaModule } from "../prisma/prisma.module";
import { HealthcheckModule } from "../healthcheck/healthcheck.module";

@Module({
	imports: [HealthcheckModule, PrismaModule, InvoicesModule],
})
export class AppModule {}
