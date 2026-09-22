package com.shiftlink.backend.company;

import java.time.OffsetDateTime;
import java.util.UUID;

public record CompanyResponse(
    UUID id,
    String name,
    String slug,
    boolean active,
    OffsetDateTime createdAt,
    OffsetDateTime updatedAt
) {

    public static CompanyResponse from(Company company) {
        return new CompanyResponse(
            company.getId(),
            company.getName(),
            company.getSlug(),
            company.isActive(),
            company.getCreatedAt(),
            company.getUpdatedAt()
        );
    }
}
