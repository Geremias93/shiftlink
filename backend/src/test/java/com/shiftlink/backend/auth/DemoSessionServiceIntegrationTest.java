package com.shiftlink.backend.auth;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
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
}
