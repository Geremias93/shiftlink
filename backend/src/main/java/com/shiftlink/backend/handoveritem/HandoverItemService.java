package com.shiftlink.backend.handoveritem;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.shiftlink.backend.handover.Handover;
import com.shiftlink.backend.handover.HandoverService;
import com.shiftlink.backend.handover.HandoverStatus;
import com.shiftlink.backend.handover.InvalidHandoverStateException;
import com.shiftlink.backend.membership.CompanyAccessDeniedException;
import com.shiftlink.backend.membership.AuthenticatedUserNotFoundException;
import com.shiftlink.backend.user.UserAccount;
import com.shiftlink.backend.user.UserRepository;

@Service
public class HandoverItemService {

    private final HandoverItemRepository handoverItemRepository;
    private final HandoverService handoverService;
    private final UserRepository userRepository;

    public HandoverItemService(
            HandoverItemRepository handoverItemRepository,
            HandoverService handoverService,
            UserRepository userRepository) {

        this.handoverItemRepository = handoverItemRepository;
        this.handoverService = handoverService;
        this.userRepository = userRepository;
    }

    @Transactional
    public HandoverItem create(
            UUID userId,
            UUID companyId,
            UUID locationId,
            UUID shiftId,
            HandoverItemType type,
            String title,
            String description,
            HandoverItemPriority priority) {

        Handover handover = handoverService.findByShift(
            userId,
            companyId,
            locationId,
            shiftId
        );

        if (handover.getStatus() != HandoverStatus.DRAFT) {
            throw new InvalidHandoverStateException(
                "Items can only be added to draft handovers"
            );
        }

        if (!handover.getCreatedBy().getId().equals(userId)) {
            throw new CompanyAccessDeniedException();
        }

        String normalizedTitle = title.trim();

        String normalizedDescription =
            description == null || description.isBlank()
                ? null
                : description.trim();

        HandoverItemPriority effectivePriority =
            priority == null
                ? HandoverItemPriority.MEDIUM
                : priority;

        HandoverItem item = new HandoverItem(
            handover,
            type,
            normalizedTitle,
            normalizedDescription,
            effectivePriority
        );

        return handoverItemRepository.save(item);
    }


    @Transactional(readOnly = true)
    public List<HandoverItem> findAll(
            UUID userId,
            UUID companyId,
            UUID locationId,
            UUID shiftId) {

        Handover handover = handoverService.findByShift(
            userId,
            companyId,
            locationId,
            shiftId
        );

        return handoverItemRepository
            .findByHandover_IdOrderByCreatedAtAsc(
                handover.getId()
            );
    }



    @Transactional
    public HandoverItem resolve(
            UUID userId,
            UUID companyId,
            UUID locationId,
            UUID shiftId,
            UUID itemId) {

        Handover handover = handoverService.findByShift(
            userId,
            companyId,
            locationId,
            shiftId
        );

        HandoverItem item = handoverItemRepository
            .findByIdAndHandover_Id(
                itemId,
                handover.getId()
            )
            .orElseThrow(HandoverItemNotFoundException::new);

        if (item.getStatus() != HandoverItemStatus.OPEN) {
            throw new InvalidHandoverItemStateException(
                "Only open handover items can be resolved"
            );
        }

        UserAccount resolvedBy = userRepository
            .findById(userId)
            .orElseThrow(
                AuthenticatedUserNotFoundException::new
            );

        item.setStatus(HandoverItemStatus.RESOLVED);
        item.setResolvedAt(OffsetDateTime.now());
        item.setResolvedBy(resolvedBy);

        return handoverItemRepository.save(item);
    }



    @Transactional(readOnly = true)
    public List<HandoverItem> findOpen(
            UUID userId,
            UUID companyId,
            UUID locationId,
            UUID shiftId) {

        Handover handover = handoverService.findByShift(
            userId,
            companyId,
            locationId,
            shiftId
        );

        return handoverItemRepository
            .findByHandover_IdAndStatusOrderByCreatedAtAsc(
                handover.getId(),
                HandoverItemStatus.OPEN
            );
    }

}
