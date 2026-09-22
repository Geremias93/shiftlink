package com.shiftlink.backend.company;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.shiftlink.backend.membership.AuthenticatedUserNotFoundException;
import com.shiftlink.backend.membership.Membership;
import com.shiftlink.backend.membership.MembershipRepository;
import com.shiftlink.backend.membership.MembershipRole;
import com.shiftlink.backend.user.UserAccount;
import com.shiftlink.backend.user.UserRepository;

@Service
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;
    private final MembershipRepository membershipRepository;

    public CompanyService(
            CompanyRepository companyRepository,
            UserRepository userRepository,
            MembershipRepository membershipRepository) {

        this.companyRepository = companyRepository;
        this.userRepository = userRepository;
        this.membershipRepository = membershipRepository;
    }

    @Transactional
    public Company create(
            String name,
            String slug,
            UUID ownerUserId) {

        if (companyRepository.existsBySlug(slug)) {
            throw new DuplicateCompanySlugException(slug);
        }

        UserAccount owner = userRepository
            .findById(ownerUserId)
            .orElseThrow(AuthenticatedUserNotFoundException::new);

        Company company = companyRepository.save(
            new Company(name, slug)
        );

        Membership membership = new Membership(
            owner,
            company,
            MembershipRole.OWNER
        );

        membershipRepository.save(membership);

        return company;
    }

    @Transactional(readOnly = true)
    public List<Company> findAll() {
        return companyRepository.findAll();
    }
}
