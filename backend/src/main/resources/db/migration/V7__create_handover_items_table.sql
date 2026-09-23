CREATE TABLE handover_items (
    id UUID PRIMARY KEY,
    handover_id UUID NOT NULL,
    type VARCHAR(20) NOT NULL,
    title VARCHAR(160) NOT NULL,
    description TEXT,
    priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    status VARCHAR(20) NOT NULL DEFAULT 'OPEN',
    resolved_at TIMESTAMPTZ,
    resolved_by_user_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_handover_items_handover
        FOREIGN KEY (handover_id)
        REFERENCES handovers(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_handover_items_resolved_by
        FOREIGN KEY (resolved_by_user_id)
        REFERENCES users(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_handover_items_type
        CHECK (
            type IN (
                'INCIDENT',
                'TASK'
            )
        ),

    CONSTRAINT chk_handover_items_priority
        CHECK (
            priority IN (
                'LOW',
                'MEDIUM',
                'HIGH'
            )
        ),

    CONSTRAINT chk_handover_items_status
        CHECK (
            status IN (
                'OPEN',
                'RESOLVED'
            )
        )
);

CREATE INDEX idx_handover_items_handover_id
    ON handover_items(handover_id);

CREATE INDEX idx_handover_items_status
    ON handover_items(status);
