package com.shiftlink.backend.shiftassignment;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.shiftlink.backend.membership.CompanyAccessService;
import com.shiftlink.backend.membership.Membership;
import com.shiftlink.backend.membership.MembershipRepository;
import com.shiftlink.backend.membership.MembershipRole;
import com.shiftlink.backend.shift.Shift;
import com.shiftlink.backend.shift.ShiftService;
import com.shiftlink.backend.user.UserAccount;
import com.shiftlink.backend.user.UserRepository;
import com.shiftlink.backend.membership.AuthenticatedUserNotFoundException;

@Service
public class ShiftAssignmentService {

    private final ShiftAssignmentRepository shiftAssignmentRepository;
    private final ShiftService shiftService;
    private final CompanyAccessService companyAccessService;
    private final MembershipRepository membershipRepository;
    private final UserRepository userRepository;

    public ShiftAssignmentService(
            ShiftAssignmentRepository shiftAssignmentRepository,
            ShiftService shiftService,
            CompanyAccessService companyAccessService,
            MembershipRepository membershipRepository,
            UserRepository userRepository) {

        this.shiftAssignmentRepository = shiftAssignmentRepository;
        this.shiftService = shiftService;
        this.companyAccessService = companyAccessService;
        this.membershipRepository = membershipRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public ShiftAssignment assign(
            UUID requesterUserId,
            UUID companyId,
            UUID locationId,
            UUID shiftId,
            UUID membershipId) {

        companyAccessService.requireAnyRole(
            requesterUserId,
            companyId,
            MembershipRole.OWNER,
            MembershipRole.MANAGER
        );

        Shift shift = shiftService.findById(
            requesterUserId,
            companyId,
            locationId,
            shiftId
        );

        Membership membership = membershipRepository
            .findByIdAndCompany_Id(
                membershipId,
                companyId
            )
            .orElseThrow(
                ShiftAssignmentMembershipNotFoundException::new
            );

        if (!membership.isActive()) {
            throw new InactiveShiftAssignmentMembershipException();
        }

        if (shiftAssignmentRepository
                .existsByShift_IdAndMembership_Id(
                    shiftId,
                    membershipId
                )) {

            throw new DuplicateShiftAssignmentException();
        }

        UserAccount assignedBy = userRepository
            .findById(requesterUserId)
            .orElseThrow(
                AuthenticatedUserNotFoundException::new
            );

        ShiftAssignment assignment = new ShiftAssignment(
            shift,
            membership,
            assignedBy
        );

        return shiftAssignmentRepository.save(assignment);
    }


    @Transactional(readOnly = true)
    public List<ShiftAssignment> findAllByShift(
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

        return shiftAssignmentRepository
            .findByShift_IdOrderByCreatedAtAsc(
                shiftId
            );
    }



    @Transactional
    public void remove(
            UUID requesterUserId,
            UUID companyId,
            UUID locationId,
            UUID shiftId,
            UUID assignmentId) {

        companyAccessService.requireAnyRole(
            requesterUserId,
            companyId,
            MembershipRole.OWNER,
            MembershipRole.MANAGER
        );

        shiftService.findById(
            requesterUserId,
            companyId,
            locationId,
            shiftId
        );

        ShiftAssignment assignment = shiftAssignmentRepository
            .findByIdAndShift_Id(
                assignmentId,
                shiftId
            )
            .orElseThrow(ShiftAssignmentNotFoundException::new);

        shiftAssignmentRepository.delete(assignment);
    }

}
