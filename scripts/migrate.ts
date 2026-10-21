import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { config } from 'dotenv';
import { neon } from '@neondatabase/serverless';

config({ path: '.env.local' });

async function migrate() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is missing from .env.local.');
  const sql = neon(process.env.DATABASE_URL);
  await sql.query('CREATE TABLE IF NOT EXISTS app_migrations (name text PRIMARY KEY, applied_at timestamp with time zone DEFAULT now() NOT NULL)');
  const migrations = ['0001_admin_foundation', '0002_subcategories', '0003_submission_payments', '0004_tool_details', '0005_tool_markdown', '0006_tool_structured_sections', '0007_tool_use_cases_faqs', '0008_tool_conclusion', '0009_submission_tool_link', '0010_submission_details', '0011_seed_editorial_blogs', '0012_blog_faqs'];
  for (const name of migrations) {
    const applied = await sql.query('SELECT name FROM app_migrations WHERE name = $1 LIMIT 1', [name]);
    if (applied.length) {
      console.log(`${name} already applied.`);
      continue;
    }
    const source = await readFile(resolve(`drizzle/${name}.sql`), 'utf8');
    const statements = source.split('-- statement-breakpoint').map((statement) => statement.trim()).filter(Boolean);
    for (const statement of statements) await sql.query(statement);
    await sql.query('INSERT INTO app_migrations (name) VALUES ($1)', [name]);
    console.log(`Applied ${name} (${statements.length} statements).`);
  }
}

migrate().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
