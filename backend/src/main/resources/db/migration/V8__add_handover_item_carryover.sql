ALTER TABLE handover_items
ADD COLUMN carried_from_item_id UUID;

ALTER TABLE handover_items
ADD CONSTRAINT fk_handover_items_carried_from
    FOREIGN KEY (carried_from_item_id)
    REFERENCES handover_items(id)
    ON DELETE SET NULL;

ALTER TABLE handover_items
ADD CONSTRAINT uq_handover_items_carryover
    UNIQUE (handover_id, carried_from_item_id);

CREATE INDEX idx_handover_items_carried_from
    ON handover_items(carried_from_item_id);
