package com.shiftlink.backend.handoveritem;

import java.net.URI;
import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

@RestController
@RequestMapping(
    "/api/companies/{companyId}/locations/{locationId}/shifts/{shiftId}/handover/items"
)
public class HandoverItemController {

    private final HandoverItemService handoverItemService;

    public HandoverItemController(
            HandoverItemService handoverItemService) {

        this.handoverItemService = handoverItemService;
    }

    @PostMapping
    public ResponseEntity<HandoverItemResponse> create(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID companyId,
            @PathVariable UUID locationId,
            @PathVariable UUID shiftId,
            @Valid @RequestBody CreateHandoverItemRequest request) {

        UUID userId = UUID.fromString(
            jwt.getSubject()
        );

        HandoverItem item = handoverItemService.create(
            userId,
            companyId,
            locationId,
            shiftId,
            request.type(),
            request.title(),
            request.description(),
            request.priority()
        );

        HandoverItemResponse response =
            HandoverItemResponse.from(item);

        return ResponseEntity
            .created(
                URI.create(
                    "/api/companies/"
                    + companyId
                    + "/locations/"
                    + locationId
                    + "/shifts/"
                    + shiftId
                    + "/handover/items/"
                    + item.getId()
                )
            )
            .body(response);
    }

    @GetMapping
    public List<HandoverItemResponse> findAll(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID companyId,
            @PathVariable UUID locationId,
            @PathVariable UUID shiftId) {

        UUID userId = UUID.fromString(
            jwt.getSubject()
        );

        return handoverItemService
            .findAll(
                userId,
                companyId,
                locationId,
                shiftId
            )
            .stream()
            .map(HandoverItemResponse::from)
            .toList();
    }


    @PostMapping("/{itemId}/resolve")
    public HandoverItemResponse resolve(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID companyId,
            @PathVariable UUID locationId,
            @PathVariable UUID shiftId,
            @PathVariable UUID itemId) {

        UUID userId = UUID.fromString(
            jwt.getSubject()
        );

        HandoverItem item = handoverItemService.resolve(
            userId,
            companyId,
            locationId,
            shiftId,
            itemId
        );

        return HandoverItemResponse.from(item);
    }

}
