package com.shiftlink.backend.shiftassignment;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.shiftlink.backend.membership.CompanyAccessService;
import com.shiftlink.backend.membership.Membership;
import com.shiftlink.backend.membership.MembershipRepository;
import com.shiftlink.backend.shift.Shift;
import com.shiftlink.backend.shift.ShiftService;
import com.shiftlink.backend.user.UserRepository;

@ExtendWith(MockitoExtension.class)
class ShiftAssignmentServiceTest {

    @Mock
    private ShiftAssignmentRepository shiftAssignmentRepository;

    @Mock
    private ShiftService shiftService;

    @Mock
    private CompanyAccessService companyAccessService;

    @Mock
    private MembershipRepository membershipRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private Shift shift;

    @Mock
    private Membership membership;

    @InjectMocks
    private ShiftAssignmentService shiftAssignmentService;

    @Test
    void assignRejectsDuplicateAssignment() {
        UUID requesterUserId = UUID.randomUUID();
        UUID companyId = UUID.randomUUID();
        UUID locationId = UUID.randomUUID();
        UUID shiftId = UUID.randomUUID();
        UUID membershipId = UUID.randomUUID();

        when(
            shiftService.findById(
                requesterUserId,
                companyId,
                locationId,
                shiftId
            )
        ).thenReturn(shift);

        when(
            membershipRepository.findByIdAndCompany_Id(
                membershipId,
                companyId
            )
        ).thenReturn(Optional.of(membership));

        when(membership.isActive()).thenReturn(true);

        when(
            shiftAssignmentRepository
                .existsByShift_IdAndMembership_Id(
                    shiftId,
                    membershipId
                )
        ).thenReturn(true);

        assertThatThrownBy(() ->
            shiftAssignmentService.assign(
                requesterUserId,
                companyId,
                locationId,
                shiftId,
                membershipId
            )
        ).isInstanceOf(
            DuplicateShiftAssignmentException.class
        );

        verify(userRepository, never()).findById(any());
        verify(shiftAssignmentRepository, never()).save(any());
    }

    @Test
    void assignRejectsInactiveMembership() {
        UUID requesterUserId = UUID.randomUUID();
        UUID companyId = UUID.randomUUID();
        UUID locationId = UUID.randomUUID();
        UUID shiftId = UUID.randomUUID();
        UUID membershipId = UUID.randomUUID();

        when(
            shiftService.findById(
                requesterUserId,
                companyId,
                locationId,
                shiftId
            )
        ).thenReturn(shift);

        when(
            membershipRepository.findByIdAndCompany_Id(
                membershipId,
                companyId
            )
        ).thenReturn(Optional.of(membership));

        when(membership.isActive()).thenReturn(false);

        assertThatThrownBy(() ->
            shiftAssignmentService.assign(
                requesterUserId,
                companyId,
                locationId,
                shiftId,
                membershipId
            )
        ).isInstanceOf(
            InactiveShiftAssignmentMembershipException.class
        );

        verify(
            shiftAssignmentRepository,
            never()
        ).existsByShift_IdAndMembership_Id(
            shiftId,
            membershipId
        );

        verify(userRepository, never()).findById(any());
        verify(shiftAssignmentRepository, never()).save(any());
    }


    @Test
    void assignStopsWhenRequesterLacksManagementRole() {
        UUID requesterUserId = UUID.randomUUID();
        UUID companyId = UUID.randomUUID();
        UUID locationId = UUID.randomUUID();
        UUID shiftId = UUID.randomUUID();
        UUID membershipId = UUID.randomUUID();

        org.mockito.Mockito.doThrow(
            new com.shiftlink.backend.membership.CompanyAccessDeniedException()
        )
            .when(companyAccessService)
            .requireAnyRole(
                requesterUserId,
                companyId,
                com.shiftlink.backend.membership.MembershipRole.OWNER,
                com.shiftlink.backend.membership.MembershipRole.MANAGER
            );

        assertThatThrownBy(() ->
            shiftAssignmentService.assign(
                requesterUserId,
                companyId,
                locationId,
                shiftId,
                membershipId
            )
        ).isInstanceOf(
            com.shiftlink.backend.membership.CompanyAccessDeniedException.class
        );

        org.mockito.Mockito.verifyNoInteractions(
            shiftService,
            membershipRepository,
            userRepository,
            shiftAssignmentRepository
        );
    }

}
