package com.shiftlink.backend.handover;

import java.util.List;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

public interface HandoverRepository
        extends JpaRepository<Handover, UUID> {

    Optional<Handover> findByShift_Id(
        UUID shiftId
    );

    boolean existsByShift_Id(
        UUID shiftId
    );


    List<Handover> findByTargetShift_IdAndStatusNotOrderByCreatedAtDesc(
        UUID targetShiftId,
        HandoverStatus excludedStatus
    );

}
