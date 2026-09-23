package com.shiftlink.backend.handoveritem;

import java.time.OffsetDateTime;
import java.util.UUID;

public record HandoverItemResponse(
    UUID id,
    UUID handoverId,

    UUID carriedFromItemId,
    HandoverItemType type,
    String title,
    String description,
    HandoverItemPriority priority,
    HandoverItemStatus status,
    OffsetDateTime resolvedAt,
    UUID resolvedByUserId,
    OffsetDateTime createdAt,
    OffsetDateTime updatedAt
) {

    public static HandoverItemResponse from(
            HandoverItem item) {

        UUID carriedFromItemId =
            item.getCarriedFrom() == null
                ? null
                : item.getCarriedFrom().getId();

        UUID resolvedByUserId =
            item.getResolvedBy() == null
                ? null
                : item.getResolvedBy().getId();

        return new HandoverItemResponse(
            item.getId(),
            item.getHandover().getId(),
            carriedFromItemId,
            item.getType(),
            item.getTitle(),
            item.getDescription(),
            item.getPriority(),
            item.getStatus(),
            item.getResolvedAt(),
            resolvedByUserId,
            item.getCreatedAt(),
            item.getUpdatedAt()
        );
    }
}
