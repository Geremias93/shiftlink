package com.shiftlink.backend.auth;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.shiftlink.backend.company.Company;
import com.shiftlink.backend.company.CompanyService;
import com.shiftlink.backend.security.JwtService;
import com.shiftlink.backend.user.UserAccount;

@SpringBootTest(properties = {
    "app.demo.max-active-sessions=1000",
    "app.demo.max-sessions-per-window=1000",
    "app.demo.rate-window-minutes=10"
})
@Transactional
class DemoSessionServiceIntegrationTest {

    @Autowired
    private DemoSessionService demoSessionService;

    @Autowired
    private CompanyService companyService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private DemoSessionMaintenanceService maintenanceService;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
    void createsIndependentDemoSessions() {

        UserAccount firstUser =
            demoSessionService.createDemoSession();

        UserAccount secondUser =
            demoSessionService.createDemoSession();

        List<Company> firstCompanies =
            companyService.findAllForUser(firstUser.getId());

        List<Company> secondCompanies =
            companyService.findAllForUser(secondUser.getId());

        assertThat(firstUser.getId())
            .isNotEqualTo(secondUser.getId());

        assertThat(firstUser.getEmail())
            .startsWith("demo-")
            .endsWith("@shiftlink.dev")
            .isNotEqualTo(secondUser.getEmail());

        assertThat(firstCompanies).hasSize(1);
        assertThat(secondCompanies).hasSize(1);

        Company firstCompany = firstCompanies.getFirst();
        Company secondCompany = secondCompanies.getFirst();

        assertThat(firstCompany.getId())
            .isNotEqualTo(secondCompany.getId());

        assertThat(firstCompany.getSlug())
            .startsWith("demo-")
            .isNotEqualTo(secondCompany.getSlug());

        String firstToken =
            jwtService.generateToken(firstUser);

        String secondToken =
            jwtService.generateToken(secondUser);

        assertThat(firstToken)
            .isNotEqualTo(secondToken);
    }
    @Test
    @Transactional(propagation = Propagation.NOT_SUPPORTED)
    void cleansExpiredDemoWithShiftAssignments() {

        UserAccount demoUser =
            demoSessionService.createDemoSession();

        Company company =
            companyService
                .findAllForUser(demoUser.getId())
                .getFirst();

        String shortId =
            company.getSlug().substring(
                "demo-".length(),
                "demo-".length() + 12
            );

        int updated = jdbcTemplate.update(
            "update companies set created_at = ? where id = ?",
            OffsetDateTime
                .now(ZoneOffset.UTC)
                .minusHours(5),
            company.getId()
        );

        Long assignmentsBefore = jdbcTemplate.queryForObject(
            """
            select count(*)
            from shift_assignments sa
            join memberships m
              on m.id = sa.membership_id
            where m.company_id = ?
            """,
            Long.class,
            company.getId()
        );

        Long generatedUsersBefore = jdbcTemplate.queryForObject(
            """
            select count(*)
            from users
            where email like ?
            """,
            Long.class,
            "%-" + shortId + "@shiftlink.dev"
        );

        assertThat(updated).isEqualTo(1);
        assertThat(assignmentsBefore).isPositive();
        assertThat(generatedUsersBefore).isEqualTo(3L);

        assertThat(
            maintenanceService.reserveCreationSlot()
        ).isTrue();

        Long companyCount = jdbcTemplate.queryForObject(
            "select count(*) from companies where id = ?",
            Long.class,
            company.getId()
        );

        Long generatedUsersAfter = jdbcTemplate.queryForObject(
            """
            select count(*)
            from users
            where email like ?
            """,
            Long.class,
            "%-" + shortId + "@shiftlink.dev"
        );

        assertThat(companyCount).isZero();
        assertThat(generatedUsersAfter).isZero();
    }

}
