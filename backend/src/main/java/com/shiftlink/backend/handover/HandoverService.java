package com.shiftlink.backend.handover;

import java.time.OffsetDateTime;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.shiftlink.backend.membership.AuthenticatedUserNotFoundException;
import com.shiftlink.backend.membership.CompanyAccessDeniedException;
import com.shiftlink.backend.shift.Shift;
import com.shiftlink.backend.shift.ShiftService;
import com.shiftlink.backend.user.UserAccount;
import com.shiftlink.backend.user.UserRepository;

@Service
public class HandoverService {

    private final HandoverRepository handoverRepository;
    private final ShiftService shiftService;
    private final UserRepository userRepository;

    public HandoverService(
            HandoverRepository handoverRepository,
            ShiftService shiftService,
            UserRepository userRepository) {

        this.handoverRepository = handoverRepository;
        this.shiftService = shiftService;
        this.userRepository = userRepository;
    }

    @Transactional
    public Handover createDraft(
            UUID userId,
            UUID companyId,
            UUID locationId,
            UUID shiftId,
            String notes) {

        Shift shift = shiftService.findById(
            userId,
            companyId,
            locationId,
            shiftId
        );

        if (handoverRepository.existsByShift_Id(shiftId)) {
            throw new DuplicateHandoverException();
        }

        UserAccount creator = userRepository
            .findById(userId)
            .orElseThrow(
                AuthenticatedUserNotFoundException::new
            );

        String normalizedNotes =
            notes == null || notes.isBlank()
                ? null
                : notes.trim();

        Handover handover = new Handover(
            shift,
            creator,
            normalizedNotes
        );

        return handoverRepository.save(handover);
    }


    @Transactional(readOnly = true)
    public Handover findByShift(
            UUID userId,
            UUID companyId,
            UUID locationId,
            UUID shiftId) {

        shiftService.findById(
            userId,
            companyId,
            locationId,
            shiftId
        );

        return handoverRepository
            .findByShift_Id(shiftId)
            .orElseThrow(HandoverNotFoundException::new);
    }



    @Transactional
    public Handover submit(
            UUID userId,
            UUID companyId,
            UUID locationId,
            UUID shiftId) {

        Handover handover = findByShift(
            userId,
            companyId,
            locationId,
            shiftId
        );

        if (handover.getStatus() != HandoverStatus.DRAFT) {
            throw new InvalidHandoverStateException(
                "Only draft handovers can be submitted"
            );
        }

        handover.setStatus(HandoverStatus.SUBMITTED);
        handover.setSubmittedAt(OffsetDateTime.now());

        return handoverRepository.save(handover);
    }



    @Transactional
    public Handover acknowledge(
            UUID userId,
            UUID companyId,
            UUID locationId,
            UUID shiftId) {

        Handover handover = findByShift(
            userId,
            companyId,
            locationId,
            shiftId
        );

        if (handover.getStatus() != HandoverStatus.SUBMITTED) {
            throw new InvalidHandoverStateException(
                "Only submitted handovers can be acknowledged"
            );
        }

        UserAccount acknowledgedBy = userRepository
            .findById(userId)
            .orElseThrow(
                AuthenticatedUserNotFoundException::new
            );

        handover.setStatus(
            HandoverStatus.ACKNOWLEDGED
        );

        handover.setAcknowledgedAt(
            OffsetDateTime.now()
        );

        handover.setAcknowledgedBy(
            acknowledgedBy
        );

        return handoverRepository.save(handover);
    }



    @Transactional
    public Handover updateDraft(
            UUID userId,
            UUID companyId,
            UUID locationId,
            UUID shiftId,
            String notes) {

        Handover handover = findByShift(
            userId,
            companyId,
            locationId,
            shiftId
        );

        if (handover.getStatus() != HandoverStatus.DRAFT) {
            throw new InvalidHandoverStateException(
                "Only draft handovers can be edited"
            );
        }

        if (!handover.getCreatedBy().getId().equals(userId)) {
            throw new CompanyAccessDeniedException();
        }

        String normalizedNotes =
            notes == null || notes.isBlank()
                ? null
                : notes.trim();

        handover.setNotes(normalizedNotes);

        return handoverRepository.save(handover);
    }

}
