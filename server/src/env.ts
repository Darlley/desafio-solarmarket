import { z } from "zod";

const envSchema = z.object({
	APP_URL: z.string().url(),
	APP_PORT: z.coerce.number().default(3000),
	DATABASE_URL: z.string().url(),
});

const env = envSchema.parse(process.env);

export default env;
