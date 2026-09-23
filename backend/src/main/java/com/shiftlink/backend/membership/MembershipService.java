package com.shiftlink.backend.membership;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.shiftlink.backend.user.UserAccount;
import com.shiftlink.backend.user.UserRepository;

@Service
public class MembershipService {

    private final MembershipRepository membershipRepository;
    private final CompanyAccessService companyAccessService;
    private final UserRepository userRepository;

    public MembershipService(
            MembershipRepository membershipRepository,
            CompanyAccessService companyAccessService,
            UserRepository userRepository) {

        this.membershipRepository = membershipRepository;
        this.companyAccessService = companyAccessService;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<Membership> findAllByCompany(
            UUID userId,
            UUID companyId) {

        companyAccessService.requireAnyRole(
            userId,
            companyId,
            MembershipRole.OWNER,
            MembershipRole.MANAGER
        );

        return membershipRepository
            .findByCompany_IdAndActiveTrue(companyId);
    }


    @Transactional
    public Membership addMember(
            UUID requesterUserId,
            UUID companyId,
            String email,
            MembershipRole role) {

        Membership requesterMembership =
            companyAccessService.requireAnyRole(
                requesterUserId,
                companyId,
                MembershipRole.OWNER,
                MembershipRole.MANAGER
            );

        if (role == MembershipRole.OWNER) {
            throw new InvalidMembershipRoleException(
                "No se puede añadir un nuevo propietario mediante este endpoint"
            );
        }

        if (requesterMembership.getRole() == MembershipRole.MANAGER
                && role != MembershipRole.EMPLOYEE) {

            throw new CompanyAccessDeniedException();
        }

        String normalizedEmail = email.trim();

        UserAccount targetUser = userRepository
            .findByEmailIgnoreCase(normalizedEmail)
            .orElseThrow(
                () -> new MembershipUserNotFoundException(
                    normalizedEmail
                )
            );

        Membership existingMembership = membershipRepository
            .findByUser_IdAndCompany_Id(
                targetUser.getId(),
                companyId
            )
            .orElse(null);

        if (existingMembership != null) {

            if (existingMembership.isActive()) {
                throw new MembershipAlreadyActiveException();
            }

            existingMembership.setRole(role);
            existingMembership.setActive(true);

            return membershipRepository.save(
                existingMembership
            );
        }

        Membership membership = new Membership(
            targetUser,
            requesterMembership.getCompany(),
            role
        );

        return membershipRepository.save(membership);
    }

}
