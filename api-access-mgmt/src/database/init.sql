CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS access_requests (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	requester_name VARCHAR(120) NOT NULL,
	requester_email VARCHAR(160) NOT NULL,
	application_name VARCHAR(80) NOT NULL,
	access_level VARCHAR(80) NOT NULL,
	business_justification TEXT NOT NULL,
	priority VARCHAR(20) NOT NULL DEFAULT 'medium',
	status VARCHAR(30) NOT NULL DEFAULT 'pending',
	notes TEXT,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT access_requests_status_check CHECK (status IN ('pending', 'in_review', 'approved', 'rejected')),
	CONSTRAINT access_requests_priority_check CHECK (priority IN ('low', 'medium', 'high', 'urgent'))
);

CREATE OR REPLACE FUNCTION set_updated_at_timestamp()
RETURNS TRIGGER AS $$
BEGIN
	NEW.updated_at = CURRENT_TIMESTAMP;
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_access_requests_updated_at ON access_requests;

CREATE TRIGGER trg_access_requests_updated_at
BEFORE UPDATE ON access_requests
FOR EACH ROW
EXECUTE FUNCTION set_updated_at_timestamp();
