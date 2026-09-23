CREATE TABLE handovers (
    id UUID PRIMARY KEY,
    shift_id UUID NOT NULL UNIQUE,
    created_by_user_id UUID NOT NULL,
    notes TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    submitted_at TIMESTAMPTZ,
    acknowledged_at TIMESTAMPTZ,
    acknowledged_by_user_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_handovers_shift
        FOREIGN KEY (shift_id)
        REFERENCES shifts(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_handovers_created_by
        FOREIGN KEY (created_by_user_id)
        REFERENCES users(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_handovers_acknowledged_by
        FOREIGN KEY (acknowledged_by_user_id)
        REFERENCES users(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_handovers_status
        CHECK (
            status IN (
                'DRAFT',
                'SUBMITTED',
                'ACKNOWLEDGED'
            )
        )
);

CREATE INDEX idx_handovers_shift_id
    ON handovers(shift_id);

CREATE INDEX idx_handovers_created_by_user_id
    ON handovers(created_by_user_id);
