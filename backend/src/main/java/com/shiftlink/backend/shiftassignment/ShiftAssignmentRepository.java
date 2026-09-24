package com.shiftlink.backend.shiftassignment;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ShiftAssignmentRepository
        extends JpaRepository<ShiftAssignment, UUID> {

    @EntityGraph(attributePaths = {
        "membership",
        "membership.user",
        "assignedBy"
    })
    List<ShiftAssignment> findByShift_IdOrderByCreatedAtAsc(
        UUID shiftId
    );

    @EntityGraph(attributePaths = {
        "membership",
        "membership.user",
        "assignedBy"
    })
    Optional<ShiftAssignment> findByIdAndShift_Id(
        UUID assignmentId,
        UUID shiftId
    );

    boolean existsByShift_IdAndMembership_Id(
        UUID shiftId,
        UUID membershipId
    );


    boolean existsByShift_IdAndMembership_User_IdAndMembership_ActiveTrue(
        UUID shiftId,
        UUID userId
    );

    @Modifying
    @Query("""
        delete from ShiftAssignment sa
        where sa.membership.id in (
            select m.id
            from Membership m
            where m.company.id = :companyId
        )
        """)
    int deleteByCompanyId(
        @Param("companyId") UUID companyId
    );

}
