package com.shiftlink.backend.membership;

import java.util.Arrays;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CompanyAccessService {

    private final MembershipRepository membershipRepository;

    public CompanyAccessService(
            MembershipRepository membershipRepository) {

        this.membershipRepository = membershipRepository;
    }

    @Transactional(readOnly = true)
    public Membership requireMembership(
            UUID userId,
            UUID companyId) {

        return membershipRepository
            .findByUser_IdAndCompany_IdAndActiveTrue(
                userId,
                companyId
            )
            .orElseThrow(CompanyAccessDeniedException::new);
    }

    @Transactional(readOnly = true)
    public Membership requireAnyRole(
            UUID userId,
            UUID companyId,
            MembershipRole... allowedRoles) {

        Membership membership =
            requireMembership(userId, companyId);

        boolean allowed = Arrays
            .stream(allowedRoles)
            .anyMatch(role -> role == membership.getRole());

        if (!allowed) {
            throw new CompanyAccessDeniedException();
        }

        return membership;
    }
}
