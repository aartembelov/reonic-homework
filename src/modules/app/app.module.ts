import { Module } from "@nestjs/common";
import { InvoicesModule } from "../invoices/invoices.module";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
	imports: [PrismaModule, InvoicesModule],
})
export class AppModule {}
