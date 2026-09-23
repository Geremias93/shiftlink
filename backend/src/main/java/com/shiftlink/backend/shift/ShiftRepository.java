package com.shiftlink.backend.shift;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ShiftRepository
        extends JpaRepository<Shift, UUID> {

    List<Shift> findByLocation_IdOrderByStartsAtAsc(
        UUID locationId
    );

    Optional<Shift> findByIdAndLocation_Id(
        UUID shiftId,
        UUID locationId
    );

    List<Shift> findByLocation_IdAndStartsAtBetweenOrderByStartsAtAsc(
        UUID locationId,
        OffsetDateTime from,
        OffsetDateTime to
    );
}
