import { describe, it, expect, beforeEach, vi } from "vitest";
import { CustomError } from "../../errors/custom-error";
import { CustomersDomainService } from "../customers.domain.service";
import { CreateInvoiceDto } from "../interfaces/dtos/create-invoice-dto.interface";
import { InvoicesDomainService } from "../invoices.domain.service";
import { generateMock } from "../../../test/unit-testing/mocks/object.utils";
import { InvoiceStatus } from "../interfaces/invoice.interface";
import { generateCreateInvoiceDto } from "../../../test/unit-testing/mocks/create-invoice-dto.mock";

describe("InvoicesDomainService", () => {
	let service: InvoicesDomainService;
	let customersDomainService: CustomersDomainService;

	const mockCustomerDto = { name: "Acme Corp", email: "acme@example.com" };
	const mockCustomerEntity = { publicId: "cus_123", ...mockCustomerDto };

	beforeEach(() => {
		customersDomainService = {
			fromCreateCustomerDto: vi.fn().mockReturnValue(mockCustomerEntity),
		} as unknown as CustomersDomainService;

		service = new InvoicesDomainService(customersDomainService);
	});

	describe("fromCreateInvoiceDto", () => {
		const cases = [
			{ name: "succeeds when invoice is valid", dto: generateCreateInvoiceDto(), expectError: false },
			{
				name: "fails when invalid item total",
				dto: generateCreateInvoiceDto({
					items: [{ description: "Item 1", quantity: 2, unitPrice: 100, total: 999 }],
				}),
				expectError: true,
			},
			{ name: "fails when subtotal mismatch", dto: generateCreateInvoiceDto({ subtotal: 999 }), expectError: true },
			{ name: "fails when total mismatch", dto: generateCreateInvoiceDto({ total: 999 }), expectError: true },
			{
				name: "fails when issueDate after dueDate",
				dto: generateCreateInvoiceDto({ issueDate: new Date("2024-02-01") }),
				expectError: true,
			},
		];

		cases.forEach(({ name, dto, expectError }) => {
			it(name, () => {
				const validationResult = (service as any).validate(dto);
				if (expectError) {
					expect(validationResult).toBeInstanceOf(CustomError);
				} else {
					expect(validationResult).toBeUndefined();
				}
			});
		});
	});
});
