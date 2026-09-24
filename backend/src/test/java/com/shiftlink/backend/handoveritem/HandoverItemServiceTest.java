package com.shiftlink.backend.handoveritem;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verifyNoInteractions;

import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.shiftlink.backend.handover.HandoverService;
import com.shiftlink.backend.location.LocationService;
import com.shiftlink.backend.shiftassignment.ShiftAssignmentRepository;
import com.shiftlink.backend.user.UserRepository;

@ExtendWith(MockitoExtension.class)
class HandoverItemServiceTest {

    @Mock
    private HandoverItemRepository handoverItemRepository;

    @Mock
    private HandoverService handoverService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private LocationService locationService;

    @Mock
    private ShiftAssignmentRepository shiftAssignmentRepository;

    @InjectMocks
    private HandoverItemService handoverItemService;

    @Test
    void carryOpenItemsRejectsSameSourceAndTargetShift() {
        UUID userId = UUID.randomUUID();
        UUID companyId = UUID.randomUUID();
        UUID locationId = UUID.randomUUID();
        UUID shiftId = UUID.randomUUID();

        assertThatThrownBy(() ->
            handoverItemService.carryOpenItems(
                userId,
                companyId,
                locationId,
                shiftId,
                shiftId
            )
        )
            .isInstanceOf(
                InvalidHandoverItemStateException.class
            )
            .hasMessage(
                "Source and target shifts must be different"
            );

        verifyNoInteractions(
            handoverService,
            handoverItemRepository
        );
    }

    @Test
    void carryOpenItemsRejectsDraftSourceHandover() {
        UUID userId = UUID.randomUUID();
        UUID companyId = UUID.randomUUID();
        UUID locationId = UUID.randomUUID();
        UUID sourceShiftId = UUID.randomUUID();
        UUID targetShiftId = UUID.randomUUID();

        com.shiftlink.backend.handover.Handover sourceHandover =
            org.mockito.Mockito.mock(
                com.shiftlink.backend.handover.Handover.class
            );

        com.shiftlink.backend.handover.Handover targetHandover =
            org.mockito.Mockito.mock(
                com.shiftlink.backend.handover.Handover.class
            );

        org.mockito.Mockito.when(
            handoverService.findByShift(
                userId,
                companyId,
                locationId,
                sourceShiftId
            )
        ).thenReturn(sourceHandover);

        org.mockito.Mockito.when(
            handoverService.findByShift(
                userId,
                companyId,
                locationId,
                targetShiftId
            )
        ).thenReturn(targetHandover);

        org.mockito.Mockito.when(
            sourceHandover.getStatus()
        ).thenReturn(
            com.shiftlink.backend.handover.HandoverStatus.DRAFT
        );

        assertThatThrownBy(() ->
            handoverItemService.carryOpenItems(
                userId,
                companyId,
                locationId,
                sourceShiftId,
                targetShiftId
            )
        )
            .isInstanceOf(
                com.shiftlink.backend.handover
                    .InvalidHandoverStateException.class
            )
            .hasMessage(
                "Open items can only be carried from a submitted handover"
            );

        org.mockito.Mockito.verifyNoInteractions(
            handoverItemRepository
        );
    }


    @Test
    void carryOpenItemsRejectsTargetHandoverThatIsNotDraft() {
        UUID userId = UUID.randomUUID();
        UUID companyId = UUID.randomUUID();
        UUID locationId = UUID.randomUUID();
        UUID sourceShiftId = UUID.randomUUID();
        UUID targetShiftId = UUID.randomUUID();

        com.shiftlink.backend.handover.Handover sourceHandover =
            org.mockito.Mockito.mock(
                com.shiftlink.backend.handover.Handover.class
            );

        com.shiftlink.backend.handover.Handover targetHandover =
            org.mockito.Mockito.mock(
                com.shiftlink.backend.handover.Handover.class
            );

        org.mockito.Mockito.when(
            handoverService.findByShift(
                userId,
                companyId,
                locationId,
                sourceShiftId
            )
        ).thenReturn(sourceHandover);

        org.mockito.Mockito.when(
            handoverService.findByShift(
                userId,
                companyId,
                locationId,
                targetShiftId
            )
        ).thenReturn(targetHandover);

        org.mockito.Mockito.when(
            sourceHandover.getStatus()
        ).thenReturn(
            com.shiftlink.backend.handover.HandoverStatus.SUBMITTED
        );

        org.mockito.Mockito.when(
            targetHandover.getStatus()
        ).thenReturn(
            com.shiftlink.backend.handover.HandoverStatus.SUBMITTED
        );

        assertThatThrownBy(() ->
            handoverItemService.carryOpenItems(
                userId,
                companyId,
                locationId,
                sourceShiftId,
                targetShiftId
            )
        )
            .isInstanceOf(
                com.shiftlink.backend.handover
                    .InvalidHandoverStateException.class
            )
            .hasMessage(
                "Open items can only be carried into a draft handover"
            );

        org.mockito.Mockito.verifyNoInteractions(
            handoverItemRepository
        );
    }


    @Test
    void carryOpenItemsRejectsUserThatDidNotCreateTargetHandover() {
        UUID userId = UUID.randomUUID();
        UUID creatorUserId = UUID.randomUUID();
        UUID companyId = UUID.randomUUID();
        UUID locationId = UUID.randomUUID();
        UUID sourceShiftId = UUID.randomUUID();
        UUID targetShiftId = UUID.randomUUID();

        com.shiftlink.backend.handover.Handover sourceHandover =
            org.mockito.Mockito.mock(
                com.shiftlink.backend.handover.Handover.class
            );

        com.shiftlink.backend.handover.Handover targetHandover =
            org.mockito.Mockito.mock(
                com.shiftlink.backend.handover.Handover.class
            );

        com.shiftlink.backend.user.UserAccount creator =
            org.mockito.Mockito.mock(
                com.shiftlink.backend.user.UserAccount.class
            );

        org.mockito.Mockito.when(
            handoverService.findByShift(
                userId,
                companyId,
                locationId,
                sourceShiftId
            )
        ).thenReturn(sourceHandover);

        org.mockito.Mockito.when(
            handoverService.findByShift(
                userId,
                companyId,
                locationId,
                targetShiftId
            )
        ).thenReturn(targetHandover);

        org.mockito.Mockito.when(
            sourceHandover.getStatus()
        ).thenReturn(
            com.shiftlink.backend.handover.HandoverStatus.SUBMITTED
        );

        org.mockito.Mockito.when(
            targetHandover.getStatus()
        ).thenReturn(
            com.shiftlink.backend.handover.HandoverStatus.DRAFT
        );

        org.mockito.Mockito.when(
            targetHandover.getCreatedBy()
        ).thenReturn(creator);

        org.mockito.Mockito.when(
            creator.getId()
        ).thenReturn(creatorUserId);

        assertThatThrownBy(() ->
            handoverItemService.carryOpenItems(
                userId,
                companyId,
                locationId,
                sourceShiftId,
                targetShiftId
            )
        ).isInstanceOf(
            com.shiftlink.backend.membership
                .CompanyAccessDeniedException.class
        );

        org.mockito.Mockito.verifyNoInteractions(
            handoverItemRepository
        );
    }


    @Test
    void carryOpenItemsDoesNotDuplicateAlreadyCarriedItem() {
        UUID userId = UUID.randomUUID();
        UUID companyId = UUID.randomUUID();
        UUID locationId = UUID.randomUUID();
        UUID sourceShiftId = UUID.randomUUID();
        UUID targetShiftId = UUID.randomUUID();
        UUID sourceHandoverId = UUID.randomUUID();
        UUID targetHandoverId = UUID.randomUUID();
        UUID sourceItemId = UUID.randomUUID();

        com.shiftlink.backend.handover.Handover sourceHandover =
            org.mockito.Mockito.mock(
                com.shiftlink.backend.handover.Handover.class
            );

        com.shiftlink.backend.handover.Handover targetHandover =
            org.mockito.Mockito.mock(
                com.shiftlink.backend.handover.Handover.class
            );

        com.shiftlink.backend.user.UserAccount creator =
            org.mockito.Mockito.mock(
                com.shiftlink.backend.user.UserAccount.class
            );

        HandoverItem sourceItem =
            org.mockito.Mockito.mock(HandoverItem.class);

        org.mockito.Mockito.when(
            handoverService.findByShift(
                userId,
                companyId,
                locationId,
                sourceShiftId
            )
        ).thenReturn(sourceHandover);

        org.mockito.Mockito.when(
            handoverService.findByShift(
                userId,
                companyId,
                locationId,
                targetShiftId
            )
        ).thenReturn(targetHandover);

        org.mockito.Mockito.when(
            sourceHandover.getStatus()
        ).thenReturn(
            com.shiftlink.backend.handover.HandoverStatus.SUBMITTED
        );

        org.mockito.Mockito.when(
            targetHandover.getStatus()
        ).thenReturn(
            com.shiftlink.backend.handover.HandoverStatus.DRAFT
        );

        org.mockito.Mockito.when(
            targetHandover.getCreatedBy()
        ).thenReturn(creator);

        org.mockito.Mockito.when(
            creator.getId()
        ).thenReturn(userId);

        org.mockito.Mockito.when(
            sourceHandover.getId()
        ).thenReturn(sourceHandoverId);

        org.mockito.Mockito.when(
            targetHandover.getId()
        ).thenReturn(targetHandoverId);

        org.mockito.Mockito.when(
            sourceItem.getId()
        ).thenReturn(sourceItemId);

        org.mockito.Mockito.when(
            handoverItemRepository
                .findByHandover_IdAndStatusOrderByCreatedAtAsc(
                    sourceHandoverId,
                    HandoverItemStatus.OPEN
                )
        ).thenReturn(java.util.List.of(sourceItem));

        org.mockito.Mockito.when(
            handoverItemRepository
                .existsByHandover_IdAndCarriedFrom_Id(
                    targetHandoverId,
                    sourceItemId
                )
        ).thenReturn(true);

        java.util.List<HandoverItem> result =
            handoverItemService.carryOpenItems(
                userId,
                companyId,
                locationId,
                sourceShiftId,
                targetShiftId
            );

        org.assertj.core.api.Assertions
            .assertThat(result)
            .isEmpty();

        org.mockito.Mockito.verify(
            handoverItemRepository,
            org.mockito.Mockito.never()
        ).save(
            org.mockito.ArgumentMatchers.any()
        );
    }

}
