package com.shiftlink.backend.handover;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.shiftlink.backend.shift.Shift;
import com.shiftlink.backend.shift.ShiftService;
import com.shiftlink.backend.shiftassignment.ShiftAssignmentRepository;
import com.shiftlink.backend.user.UserRepository;

@ExtendWith(MockitoExtension.class)
class HandoverServiceTest {

    @Mock
    private HandoverRepository handoverRepository;

    @Mock
    private ShiftService shiftService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ShiftAssignmentRepository shiftAssignmentRepository;

    @Mock
    private Shift sourceShift;

    @InjectMocks
    private HandoverService handoverService;

    @Test
    void createDraftRejectsUserNotAssignedToSourceShift() {
        UUID userId = UUID.randomUUID();
        UUID companyId = UUID.randomUUID();
        UUID locationId = UUID.randomUUID();
        UUID sourceShiftId = UUID.randomUUID();
        UUID targetShiftId = UUID.randomUUID();

        when(
            shiftService.findById(
                userId,
                companyId,
                locationId,
                sourceShiftId
            )
        ).thenReturn(sourceShift);

        when(
            shiftAssignmentRepository
                .existsByShift_IdAndMembership_User_IdAndMembership_ActiveTrue(
                    sourceShiftId,
                    userId
                )
        ).thenReturn(false);

        assertThatThrownBy(() ->
            handoverService.createDraft(
                userId,
                companyId,
                locationId,
                sourceShiftId,
                targetShiftId,
                "Notas del relevo"
            )
        )
            .isInstanceOf(
                HandoverShiftAssignmentRequiredException.class
            )
            .hasMessage(
                "Debes estar asignado al turno para crear su relevo"
            );

        verify(handoverRepository, never())
            .existsByShift_Id(any());

        verify(handoverRepository, never())
            .save(any());

        verify(userRepository, never())
            .findById(any());
    }

    @Test
    void createDraftRejectsDuplicateHandover() {
        UUID userId = UUID.randomUUID();
        UUID companyId = UUID.randomUUID();
        UUID locationId = UUID.randomUUID();
        UUID sourceShiftId = UUID.randomUUID();
        UUID targetShiftId = UUID.randomUUID();

        when(
            shiftService.findById(
                userId,
                companyId,
                locationId,
                sourceShiftId
            )
        ).thenReturn(sourceShift);

        when(
            shiftAssignmentRepository
                .existsByShift_IdAndMembership_User_IdAndMembership_ActiveTrue(
                    sourceShiftId,
                    userId
                )
        ).thenReturn(true);

        when(
            handoverRepository.existsByShift_Id(
                sourceShiftId
            )
        ).thenReturn(true);

        assertThatThrownBy(() ->
            handoverService.createDraft(
                userId,
                companyId,
                locationId,
                sourceShiftId,
                targetShiftId,
                "Notas del relevo"
            )
        ).isInstanceOf(
            DuplicateHandoverException.class
        );

        verify(handoverRepository, never())
            .save(any());

        verify(userRepository, never())
            .findById(any());
    }


    @Test
    void createDraftRejectsSameSourceAndTargetShift() {
        UUID userId = UUID.randomUUID();
        UUID companyId = UUID.randomUUID();
        UUID locationId = UUID.randomUUID();
        UUID shiftId = UUID.randomUUID();

        when(
            shiftService.findById(
                userId,
                companyId,
                locationId,
                shiftId
            )
        ).thenReturn(sourceShift);

        when(
            shiftAssignmentRepository
                .existsByShift_IdAndMembership_User_IdAndMembership_ActiveTrue(
                    shiftId,
                    userId
                )
        ).thenReturn(true);

        when(
            handoverRepository.existsByShift_Id(
                shiftId
            )
        ).thenReturn(false);

        assertThatThrownBy(() ->
            handoverService.createDraft(
                userId,
                companyId,
                locationId,
                shiftId,
                shiftId,
                "Notas del relevo"
            )
        )
            .isInstanceOf(
                InvalidHandoverStateException.class
            )
            .hasMessage(
                "El turno de origen y el turno receptor deben ser distintos"
            );

        verify(handoverRepository, never())
            .save(any());

        verify(userRepository, never())
            .findById(any());
    }


    @Test
    void submitRejectsUserThatDidNotCreateHandover() {
        UUID userId = UUID.randomUUID();
        UUID creatorUserId = UUID.randomUUID();
        UUID companyId = UUID.randomUUID();
        UUID locationId = UUID.randomUUID();
        UUID shiftId = UUID.randomUUID();

        Handover handover =
            org.mockito.Mockito.mock(Handover.class);

        com.shiftlink.backend.user.UserAccount creator =
            org.mockito.Mockito.mock(
                com.shiftlink.backend.user.UserAccount.class
            );

        when(
            shiftService.findById(
                userId,
                companyId,
                locationId,
                shiftId
            )
        ).thenReturn(sourceShift);

        when(
            handoverRepository.findByShift_Id(shiftId)
        ).thenReturn(java.util.Optional.of(handover));

        when(handover.getCreatedBy())
            .thenReturn(creator);

        when(creator.getId())
            .thenReturn(creatorUserId);

        assertThatThrownBy(() ->
            handoverService.submit(
                userId,
                companyId,
                locationId,
                shiftId
            )
        ).isInstanceOf(
            com.shiftlink.backend.membership
                .CompanyAccessDeniedException.class
        );

        verify(handoverRepository, never())
            .save(any());
    }


    @Test
    void submitRejectsCreatorNotAssignedToSourceShift() {
        UUID userId = UUID.randomUUID();
        UUID companyId = UUID.randomUUID();
        UUID locationId = UUID.randomUUID();
        UUID shiftId = UUID.randomUUID();

        Handover handover =
            org.mockito.Mockito.mock(Handover.class);

        com.shiftlink.backend.user.UserAccount creator =
            org.mockito.Mockito.mock(
                com.shiftlink.backend.user.UserAccount.class
            );

        when(
            shiftService.findById(
                userId,
                companyId,
                locationId,
                shiftId
            )
        ).thenReturn(sourceShift);

        when(
            handoverRepository.findByShift_Id(shiftId)
        ).thenReturn(java.util.Optional.of(handover));

        when(handover.getCreatedBy())
            .thenReturn(creator);

        when(creator.getId())
            .thenReturn(userId);

        when(
            shiftAssignmentRepository
                .existsByShift_IdAndMembership_User_IdAndMembership_ActiveTrue(
                    shiftId,
                    userId
                )
        ).thenReturn(false);

        assertThatThrownBy(() ->
            handoverService.submit(
                userId,
                companyId,
                locationId,
                shiftId
            )
        )
            .isInstanceOf(
                HandoverShiftAssignmentRequiredException.class
            )
            .hasMessage(
                "Debes estar asignado al turno para enviar su relevo"
            );

        verify(handoverRepository, never())
            .save(any());
    }


    @Test
    void acknowledgeRejectsUserNotAssignedToTargetShift() {
        UUID userId = UUID.randomUUID();
        UUID companyId = UUID.randomUUID();
        UUID locationId = UUID.randomUUID();
        UUID sourceShiftId = UUID.randomUUID();
        UUID targetShiftId = UUID.randomUUID();

        Handover handover =
            org.mockito.Mockito.mock(Handover.class);

        Shift targetShift =
            org.mockito.Mockito.mock(Shift.class);

        when(
            shiftService.findById(
                userId,
                companyId,
                locationId,
                sourceShiftId
            )
        ).thenReturn(sourceShift);

        when(
            handoverRepository.findByShift_Id(
                sourceShiftId
            )
        ).thenReturn(
            java.util.Optional.of(handover)
        );

        when(handover.getTargetShift())
            .thenReturn(targetShift);

        when(targetShift.getId())
            .thenReturn(targetShiftId);

        when(
            shiftAssignmentRepository
                .existsByShift_IdAndMembership_User_IdAndMembership_ActiveTrue(
                    targetShiftId,
                    userId
                )
        ).thenReturn(false);

        assertThatThrownBy(() ->
            handoverService.acknowledge(
                userId,
                companyId,
                locationId,
                sourceShiftId
            )
        )
            .isInstanceOf(
                HandoverShiftAssignmentRequiredException.class
            )
            .hasMessage(
                "Debes estar asignado al turno receptor para confirmar el relevo"
            );

        verify(userRepository, never())
            .findById(any());

        verify(handoverRepository, never())
            .save(any());
    }


    @Test
    void acknowledgeRejectsSelfAcknowledgement() {
        UUID userId = UUID.randomUUID();
        UUID companyId = UUID.randomUUID();
        UUID locationId = UUID.randomUUID();
        UUID sourceShiftId = UUID.randomUUID();
        UUID targetShiftId = UUID.randomUUID();

        Handover handover =
            org.mockito.Mockito.mock(Handover.class);

        Shift targetShift =
            org.mockito.Mockito.mock(Shift.class);

        com.shiftlink.backend.user.UserAccount creator =
            org.mockito.Mockito.mock(
                com.shiftlink.backend.user.UserAccount.class
            );

        when(
            shiftService.findById(
                userId,
                companyId,
                locationId,
                sourceShiftId
            )
        ).thenReturn(sourceShift);

        when(
            handoverRepository.findByShift_Id(
                sourceShiftId
            )
        ).thenReturn(
            java.util.Optional.of(handover)
        );

        when(handover.getTargetShift())
            .thenReturn(targetShift);

        when(targetShift.getId())
            .thenReturn(targetShiftId);

        when(
            shiftAssignmentRepository
                .existsByShift_IdAndMembership_User_IdAndMembership_ActiveTrue(
                    targetShiftId,
                    userId
                )
        ).thenReturn(true);

        when(handover.getStatus())
            .thenReturn(HandoverStatus.SUBMITTED);

        when(handover.getCreatedBy())
            .thenReturn(creator);

        when(creator.getId())
            .thenReturn(userId);

        assertThatThrownBy(() ->
            handoverService.acknowledge(
                userId,
                companyId,
                locationId,
                sourceShiftId
            )
        ).isInstanceOf(
            HandoverSelfAcknowledgementException.class
        );

        verify(userRepository, never())
            .findById(any());

        verify(handoverRepository, never())
            .save(any());
    }


    @Test
    void updateDraftRejectsHandoverThatIsNotDraft() {
        UUID userId = UUID.randomUUID();
        UUID companyId = UUID.randomUUID();
        UUID locationId = UUID.randomUUID();
        UUID shiftId = UUID.randomUUID();

        Handover handover =
            org.mockito.Mockito.mock(Handover.class);

        when(
            shiftService.findById(
                userId,
                companyId,
                locationId,
                shiftId
            )
        ).thenReturn(sourceShift);

        when(
            handoverRepository.findByShift_Id(
                shiftId
            )
        ).thenReturn(
            java.util.Optional.of(handover)
        );

        when(handover.getStatus())
            .thenReturn(HandoverStatus.SUBMITTED);

        assertThatThrownBy(() ->
            handoverService.updateDraft(
                userId,
                companyId,
                locationId,
                shiftId,
                "Notas modificadas"
            )
        )
            .isInstanceOf(
                InvalidHandoverStateException.class
            )
            .hasMessage(
                "Only draft handovers can be edited"
            );

        verify(handoverRepository, never())
            .save(any());
    }


    @Test
    void updateDraftRejectsUserThatDidNotCreateHandover() {
        UUID userId = UUID.randomUUID();
        UUID creatorUserId = UUID.randomUUID();
        UUID companyId = UUID.randomUUID();
        UUID locationId = UUID.randomUUID();
        UUID shiftId = UUID.randomUUID();

        Handover handover =
            org.mockito.Mockito.mock(Handover.class);

        com.shiftlink.backend.user.UserAccount creator =
            org.mockito.Mockito.mock(
                com.shiftlink.backend.user.UserAccount.class
            );

        when(
            shiftService.findById(
                userId,
                companyId,
                locationId,
                shiftId
            )
        ).thenReturn(sourceShift);

        when(
            handoverRepository.findByShift_Id(
                shiftId
            )
        ).thenReturn(
            java.util.Optional.of(handover)
        );

        when(handover.getStatus())
            .thenReturn(HandoverStatus.DRAFT);

        when(handover.getCreatedBy())
            .thenReturn(creator);

        when(creator.getId())
            .thenReturn(creatorUserId);

        assertThatThrownBy(() ->
            handoverService.updateDraft(
                userId,
                companyId,
                locationId,
                shiftId,
                "Notas modificadas"
            )
        ).isInstanceOf(
            com.shiftlink.backend.membership
                .CompanyAccessDeniedException.class
        );

        verify(handoverRepository, never())
            .save(any());
    }


    @Test
    void findIncomingByShiftExcludesDraftHandovers() {
        UUID userId = UUID.randomUUID();
        UUID companyId = UUID.randomUUID();
        UUID locationId = UUID.randomUUID();
        UUID shiftId = UUID.randomUUID();

        when(
            shiftService.findById(
                userId,
                companyId,
                locationId,
                shiftId
            )
        ).thenReturn(sourceShift);

        when(
            handoverRepository
                .findByTargetShift_IdAndStatusNotOrderByCreatedAtDesc(
                    shiftId,
                    HandoverStatus.DRAFT
                )
        ).thenReturn(java.util.List.of());

        handoverService.findIncomingByShift(
            userId,
            companyId,
            locationId,
            shiftId
        );

        verify(handoverRepository)
            .findByTargetShift_IdAndStatusNotOrderByCreatedAtDesc(
                shiftId,
                HandoverStatus.DRAFT
            );
    }

}
