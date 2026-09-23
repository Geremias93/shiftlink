package com.shiftlink.backend.handoveritem;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

public interface HandoverItemRepository
        extends JpaRepository<HandoverItem, UUID> {

    List<HandoverItem> findByHandover_IdOrderByCreatedAtAsc(
        UUID handoverId
    );

    List<HandoverItem> findByHandover_IdAndStatusOrderByCreatedAtAsc(
        UUID handoverId,
        HandoverItemStatus status
    );

    Optional<HandoverItem> findByIdAndHandover_Id(
        UUID itemId,
        UUID handoverId
    );


    boolean existsByHandover_IdAndCarriedFrom_Id(
        UUID handoverId,
        UUID carriedFromItemId
    );

}
