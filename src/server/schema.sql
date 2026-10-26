-- ==============================================================================
-- Sajid Innovations — PostgreSQL / Neon Database Schema
-- Table: inquiries
-- Migration-safe: Uses IF NOT EXISTS and preserves all existing inquiry fields
-- ==============================================================================

CREATE TABLE IF NOT EXISTS inquiries (
  id VARCHAR(64) PRIMARY KEY,
  ref_id VARCHAR(32) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  company VARCHAR(255),
  title VARCHAR(255) NOT NULL,
  service_category VARCHAR(100) NOT NULL,
  problem_description TEXT NOT NULL,
  target_users TEXT,
  desired_solution TEXT,
  requested_features TEXT,
  existing_url VARCHAR(500),
  budget_range VARCHAR(100),
  timeline VARCHAR(100),
  preferred_contact VARCHAR(50) DEFAULT 'email',
  additional_details TEXT,
  consent BOOLEAN DEFAULT TRUE,
  status VARCHAR(50) DEFAULT 'new',
  internal_notes TEXT,
  follow_up_date VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indices for rapid administrative querying, search, and filtering
CREATE INDEX IF NOT EXISTS idx_inquiries_ref_id ON inquiries(ref_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_service_category ON inquiries(service_category);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_email ON inquiries(email);

-- ==============================================================================
-- Table: revoked_tokens
-- Stores SHA-256 hashes of explicitly logged-out session tokens across distributed
-- Vercel serverless instances, preventing token reuse until natural expiration.
-- ==============================================================================

CREATE TABLE IF NOT EXISTS revoked_tokens (
  token_hash VARCHAR(64) PRIMARY KEY,
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_revoked_tokens_expires_at ON revoked_tokens(expires_at);
