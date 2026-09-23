package com.shiftlink.backend.handoveritem;

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
    "/api/companies/{companyId}/locations/{locationId}/open-items"
)
public class LocationOpenItemController {

    private final HandoverItemService handoverItemService;

    public LocationOpenItemController(
            HandoverItemService handoverItemService) {

        this.handoverItemService = handoverItemService;
    }

    @GetMapping
    public List<HandoverItemResponse> findOpenByLocation(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID companyId,
            @PathVariable UUID locationId) {

        UUID userId = UUID.fromString(jwt.getSubject());

        return handoverItemService
            .findOpenByLocation(
                userId,
                companyId,
                locationId
            )
            .stream()
            .map(HandoverItemResponse::from)
            .toList();
    }
}
