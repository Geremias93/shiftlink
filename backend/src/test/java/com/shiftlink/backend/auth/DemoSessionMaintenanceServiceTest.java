package com.shiftlink.backend.auth;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

import java.time.OffsetDateTime;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.shiftlink.backend.company.CompanyRepository;
import com.shiftlink.backend.membership.MembershipRepository;
import com.shiftlink.backend.shiftassignment.ShiftAssignmentRepository;
import com.shiftlink.backend.user.UserRepository;

@ExtendWith(MockitoExtension.class)
class DemoSessionMaintenanceServiceTest {

    @Mock
    private CompanyRepository companyRepository;

    @Mock
    private MembershipRepository membershipRepository;

    @Mock
    private ShiftAssignmentRepository shiftAssignmentRepository;

    @Mock
    private UserRepository userRepository;

    @Test
    void rejectsCreationWhenRateLimitIsReached() {

        DemoSessionMaintenanceService service =
            new DemoSessionMaintenanceService(
                companyRepository,
                membershipRepository,
                shiftAssignmentRepository,
                userRepository,
                4,
                50,
                1,
                10
            );

        when(
            companyRepository
                .findBySlugStartingWithAndCreatedAtBefore(
                    eq("demo-"),
                    any(OffsetDateTime.class)
                )
        ).thenReturn(List.of());

        when(
            companyRepository.countBySlugStartingWith(
                "demo-"
            )
        ).thenReturn(0L);

        assertThat(service.reserveCreationSlot())
            .isTrue();

        assertThat(service.reserveCreationSlot())
            .isFalse();
    }
}
