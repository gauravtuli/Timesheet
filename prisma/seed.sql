-- Optional: quick start with one admin and two clients (only for SQLite/local dev)
-- Update the admin email to your own @themavericksindia.com account after first run.
-- You can run this with: npx prisma db execute --file=prisma/seed.sql

-- insert a default setting to enable frontend
INSERT OR REPLACE INTO Setting (key, value) VALUES ('frontend_enabled', 'true');
