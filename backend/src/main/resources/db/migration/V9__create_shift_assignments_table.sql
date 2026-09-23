CREATE TABLE shift_assignments (
    id UUID PRIMARY KEY,

    shift_id UUID NOT NULL,
    membership_id UUID NOT NULL,
    assigned_by_user_id UUID NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_shift_assignments_shift
        FOREIGN KEY (shift_id)
        REFERENCES shifts(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_shift_assignments_membership
        FOREIGN KEY (membership_id)
        REFERENCES memberships(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_shift_assignments_assigned_by
        FOREIGN KEY (assigned_by_user_id)
        REFERENCES users(id)
        ON DELETE RESTRICT,

    CONSTRAINT uq_shift_assignments_shift_membership
        UNIQUE (shift_id, membership_id)
);

CREATE INDEX idx_shift_assignments_shift_id
    ON shift_assignments(shift_id);

CREATE INDEX idx_shift_assignments_membership_id
    ON shift_assignments(membership_id);
