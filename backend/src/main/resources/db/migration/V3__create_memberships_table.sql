CREATE TABLE memberships (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    company_id UUID NOT NULL,
    role VARCHAR(20) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_memberships_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_memberships_company
        FOREIGN KEY (company_id)
        REFERENCES companies(id)
        ON DELETE CASCADE,

    CONSTRAINT uq_memberships_user_company
        UNIQUE (user_id, company_id),

    CONSTRAINT chk_memberships_role
        CHECK (role IN ('OWNER', 'MANAGER', 'EMPLOYEE'))
);

CREATE INDEX idx_memberships_user_id
    ON memberships(user_id);

CREATE INDEX idx_memberships_company_id
    ON memberships(company_id);
