import { createClient } from "@libsql/client";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export default client;

export async function query<T = any>(sql: string, args: any[] = []): Promise<T[]> {
  const result = await client.execute({ sql, args });
  return result.rows as T[];
}

export async function execute(sql: string, args: any[] = []) {
  return client.execute({ sql, args });
}
