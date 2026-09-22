package com.shiftlink.backend.location;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

public interface LocationRepository
        extends JpaRepository<Location, UUID> {

    List<Location> findByCompany_IdAndActiveTrueOrderByNameAsc(
        UUID companyId
    );

    Optional<Location> findByIdAndCompany_IdAndActiveTrue(
        UUID locationId,
        UUID companyId
    );

    boolean existsByCompany_IdAndNameIgnoreCase(
        UUID companyId,
        String name
    );
}
