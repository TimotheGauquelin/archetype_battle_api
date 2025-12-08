-- Create user admin if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'admin') THEN
        CREATE USER admin WITH PASSWORD 'Azerty123!';
    END IF;
END
$$;

GRANT ALL PRIVILEGES ON DATABASE ab TO admin;
GRANT ALL PRIVILEGES ON SCHEMA public TO admin;
