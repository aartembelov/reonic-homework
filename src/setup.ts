import { exec } from "child_process";
import util from "util";

const asyncExec = util.promisify(exec);

async function setup() {
	const databaseUrl = process.env.DATABASE_URL;
	if (!databaseUrl) {
		throw new Error("Database URL is not defined");
	}

	console.log("Running database setup...");
	console.log("DATABASE_URL:", databaseUrl);

	console.log("Running Prisma migrations...");
	const migrate = await asyncExec("npm run prisma:deploy");
	if (migrate.stdout) console.log(migrate.stdout);
	if (migrate.stderr) console.error(migrate.stderr);

	console.log("Database setup completed.");
}

setup()
	.then(() => {
		console.log("Setup finished successfully.");
		process.exit(0);
	})
	.catch((err) => {
		console.error("Setup failed:", err);
		process.exit(1);
	});
