import { All, Controller } from "@nestjs/common";

@Controller({ path: "/healthcheck" })
export class HealthcheckController {
	@All()
	healthcheck() {
		return { status: "OK" };
	}
}
