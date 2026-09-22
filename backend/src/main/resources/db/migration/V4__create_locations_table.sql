CREATE TABLE locations (
    id UUID PRIMARY KEY,
    company_id UUID NOT NULL,
    name VARCHAR(120) NOT NULL,
    address VARCHAR(255),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_locations_company
        FOREIGN KEY (company_id)
        REFERENCES companies(id)
        ON DELETE CASCADE,

    CONSTRAINT uq_locations_company_name
        UNIQUE (company_id, name)
);

CREATE INDEX idx_locations_company_id
    ON locations(company_id);
