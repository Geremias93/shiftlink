package com.shiftlink.backend.handover;

import java.util.List;
import java.util.UUID;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(
    "/api/companies/{companyId}/locations/{locationId}/shifts/{shiftId}/incoming-handovers"
)
public class IncomingHandoverController {

    private final HandoverService handoverService;

    public IncomingHandoverController(
            HandoverService handoverService) {

        this.handoverService = handoverService;
    }

    @GetMapping
    public List<HandoverResponse> findAll(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID companyId,
            @PathVariable UUID locationId,
            @PathVariable UUID shiftId) {

        UUID userId = UUID.fromString(
            jwt.getSubject()
        );

        return handoverService
            .findIncomingByShift(
                userId,
                companyId,
                locationId,
                shiftId
            )
            .stream()
            .map(HandoverResponse::from)
            .toList();
    }
}
