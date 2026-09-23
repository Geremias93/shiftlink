CREATE TABLE shifts (
    id UUID PRIMARY KEY,
    location_id UUID NOT NULL,
    name VARCHAR(120) NOT NULL,
    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'SCHEDULED',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_shifts_location
        FOREIGN KEY (location_id)
        REFERENCES locations(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_shifts_dates
        CHECK (ends_at > starts_at),

    CONSTRAINT chk_shifts_status
        CHECK (
            status IN (
                'SCHEDULED',
                'ACTIVE',
                'COMPLETED',
                'CANCELLED'
            )
        )
);

CREATE INDEX idx_shifts_location_id
    ON shifts(location_id);

CREATE INDEX idx_shifts_location_starts_at
    ON shifts(location_id, starts_at);
