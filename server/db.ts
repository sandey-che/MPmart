import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

const dbUrl = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_KPemzYc3USq9@ep-summer-rain-a1sntanu-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
if (!dbUrl) {
  throw new Error("DATABASE_URL must be set.");
}
export const pool = new Pool({ connectionString: dbUrl });
export const db = drizzle({ client: pool, schema });