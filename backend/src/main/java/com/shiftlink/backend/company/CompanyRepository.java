package com.shiftlink.backend.company;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CompanyRepository extends JpaRepository<Company, UUID> {

    Optional<Company> findBySlug(String slug);

    boolean existsBySlug(String slug);

    long countBySlugStartingWith(String prefix);

    List<Company> findBySlugStartingWithAndCreatedAtBefore(
        String prefix,
        OffsetDateTime createdBefore
    );
}
