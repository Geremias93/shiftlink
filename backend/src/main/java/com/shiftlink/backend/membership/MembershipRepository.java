package com.shiftlink.backend.membership;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MembershipRepository
        extends JpaRepository<Membership, UUID> {

    List<Membership> findByUser_IdAndActiveTrue(UUID userId);

    @EntityGraph(attributePaths = "user")
    List<Membership> findByCompany_IdAndActiveTrue(UUID companyId);

    @EntityGraph(attributePaths = {"company", "user"})
    Optional<Membership> findByUser_IdAndCompany_IdAndActiveTrue(
        UUID userId,
        UUID companyId
    );

    boolean existsByUser_IdAndCompany_Id(
        UUID userId,
        UUID companyId
    );


    Optional<Membership> findByUser_IdAndCompany_Id(
        UUID userId,
        UUID companyId
    );



    @EntityGraph(attributePaths = "user")
    Optional<Membership> findByIdAndCompany_Id(
        UUID membershipId,
        UUID companyId
    );

}
