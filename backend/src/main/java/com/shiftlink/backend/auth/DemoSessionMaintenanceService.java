package com.shiftlink.backend.auth;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.shiftlink.backend.company.Company;
import com.shiftlink.backend.company.CompanyRepository;
import com.shiftlink.backend.membership.MembershipRepository;
import com.shiftlink.backend.shiftassignment.ShiftAssignmentRepository;
import com.shiftlink.backend.user.UserAccount;
import com.shiftlink.backend.user.UserRepository;

@Service
public class DemoSessionMaintenanceService {

    private static final String DEMO_SLUG_PREFIX = "demo-";

    private final CompanyRepository companyRepository;
    private final MembershipRepository membershipRepository;
    private final ShiftAssignmentRepository shiftAssignmentRepository;
    private final UserRepository userRepository;

    private final long ttlHours;
    private final long maxActiveSessions;
    private final int maxSessionsPerWindow;
    private final long rateWindowMinutes;

    private final Deque<Instant> recentCreations =
        new ArrayDeque<>();

    public DemoSessionMaintenanceService(
            CompanyRepository companyRepository,
            MembershipRepository membershipRepository,
            ShiftAssignmentRepository shiftAssignmentRepository,
            UserRepository userRepository,
            @Value("${app.demo.ttl-hours:4}") long ttlHours,
            @Value("${app.demo.max-active-sessions:50}")
            long maxActiveSessions,
            @Value("${app.demo.max-sessions-per-window:10}")
            int maxSessionsPerWindow,
            @Value("${app.demo.rate-window-minutes:10}")
            long rateWindowMinutes) {

        this.companyRepository = companyRepository;
        this.membershipRepository = membershipRepository;
        this.shiftAssignmentRepository = shiftAssignmentRepository;
        this.userRepository = userRepository;
        this.ttlHours = ttlHours;
        this.maxActiveSessions = maxActiveSessions;
        this.maxSessionsPerWindow = maxSessionsPerWindow;
        this.rateWindowMinutes = rateWindowMinutes;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public synchronized boolean reserveCreationSlot() {

        cleanupExpiredDemos();

        if (companyRepository.countBySlugStartingWith(
                DEMO_SLUG_PREFIX) >= maxActiveSessions) {

            return false;
        }

        Instant now = Instant.now();
        Instant windowStart = now.minus(
            rateWindowMinutes,
            ChronoUnit.MINUTES
        );

        while (!recentCreations.isEmpty()
                && recentCreations.peekFirst()
                    .isBefore(windowStart)) {

            recentCreations.removeFirst();
        }

        if (recentCreations.size() >= maxSessionsPerWindow) {
            return false;
        }

        recentCreations.addLast(now);

        return true;
    }

    private void cleanupExpiredDemos() {

        OffsetDateTime cutoff = OffsetDateTime
            .now(ZoneOffset.UTC)
            .minusHours(ttlHours);

        List<Company> expiredCompanies =
            companyRepository
                .findBySlugStartingWithAndCreatedAtBefore(
                    DEMO_SLUG_PREFIX,
                    cutoff
                );

        for (Company company : expiredCompanies) {
            deleteDemoCompany(company);
        }
    }

    private void deleteDemoCompany(Company company) {

        String shortId = extractShortId(company.getSlug());

        List<UserAccount> generatedUsers =
            membershipRepository
                .findUsersByCompanyId(company.getId())
                .stream()
                .filter(user ->
                    isGeneratedDemoUser(
                        user.getEmail(),
                        shortId
                    )
                )
                .toList();

        shiftAssignmentRepository.deleteByCompanyId(
            company.getId()
        );

        companyRepository.delete(company);
        companyRepository.flush();

        if (!generatedUsers.isEmpty()) {
            userRepository.deleteAll(generatedUsers);
            userRepository.flush();
        }
    }

    private String extractShortId(String slug) {

        if (slug == null
                || !slug.startsWith(DEMO_SLUG_PREFIX)) {
            return null;
        }

        String sessionId =
            slug.substring(DEMO_SLUG_PREFIX.length());

        if (sessionId.length() < 12) {
            return null;
        }

        return sessionId.substring(0, 12);
    }

    private boolean isGeneratedDemoUser(
            String email,
            String shortId) {

        if (email == null || shortId == null) {
            return false;
        }

        return email.equals(
                "demo-" + shortId + "@shiftlink.dev")
            || email.equals(
                "empleado-" + shortId + "@shiftlink.dev")
            || email.equals(
                "laura-" + shortId + "@shiftlink.dev");
    }
}
