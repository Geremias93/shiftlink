package com.shiftlink.backend.handover;

import java.net.URI;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

@RestController
@RequestMapping(
    "/api/companies/{companyId}/locations/{locationId}/shifts/{shiftId}/handover"
)
public class HandoverController {

    private final HandoverService handoverService;

    public HandoverController(
            HandoverService handoverService) {

        this.handoverService = handoverService;
    }

    @PostMapping
    public ResponseEntity<HandoverResponse> create(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID companyId,
            @PathVariable UUID locationId,
            @PathVariable UUID shiftId,
            @Valid @RequestBody CreateHandoverRequest request) {

        UUID userId = UUID.fromString(
            jwt.getSubject()
        );

        Handover handover = handoverService.createDraft(
            userId,
            companyId,
            locationId,
            shiftId,
            request.targetShiftId(),
            request.notes()
        );

        HandoverResponse response =
            HandoverResponse.from(handover);

        return ResponseEntity
            .created(
                URI.create(
                    "/api/companies/"
                    + companyId
                    + "/locations/"
                    + locationId
                    + "/shifts/"
                    + shiftId
                    + "/handover"
                )
            )
            .body(response);
    }


    @GetMapping
    public HandoverResponse findByShift(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID companyId,
            @PathVariable UUID locationId,
            @PathVariable UUID shiftId) {

        UUID userId = UUID.fromString(
            jwt.getSubject()
        );

        Handover handover = handoverService.findByShift(
            userId,
            companyId,
            locationId,
            shiftId
        );

        return HandoverResponse.from(handover);
    }



    @PostMapping("/submit")
    public HandoverResponse submit(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID companyId,
            @PathVariable UUID locationId,
            @PathVariable UUID shiftId) {

        UUID userId = UUID.fromString(
            jwt.getSubject()
        );

        Handover handover = handoverService.submit(
            userId,
            companyId,
            locationId,
            shiftId
        );

        return HandoverResponse.from(handover);
    }



    @PostMapping("/acknowledge")
    public HandoverResponse acknowledge(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID companyId,
            @PathVariable UUID locationId,
            @PathVariable UUID shiftId) {

        UUID userId = UUID.fromString(
            jwt.getSubject()
        );

        Handover handover = handoverService.acknowledge(
            userId,
            companyId,
            locationId,
            shiftId
        );

        return HandoverResponse.from(handover);
    }



    @PatchMapping
    public HandoverResponse updateDraft(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID companyId,
            @PathVariable UUID locationId,
            @PathVariable UUID shiftId,
            @Valid @RequestBody UpdateHandoverRequest request) {

        UUID userId = UUID.fromString(
            jwt.getSubject()
        );

        Handover handover = handoverService.updateDraft(
            userId,
            companyId,
            locationId,
            shiftId,
            request.notes()
        );

        return HandoverResponse.from(handover);
    }

}
