package com.shiftlink.backend.location;

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
@RequestMapping("/api/companies/{companyId}/locations")
public class LocationController {

    private final LocationService locationService;

    public LocationController(
            LocationService locationService) {

        this.locationService = locationService;
    }

    @PostMapping
    public ResponseEntity<LocationResponse> create(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID companyId,
            @Valid @RequestBody CreateLocationRequest request) {

        UUID userId = UUID.fromString(
            jwt.getSubject()
        );

        Location location = locationService.create(
            userId,
            companyId,
            request.name(),
            request.address()
        );

        LocationResponse response =
            LocationResponse.from(location);

        return ResponseEntity
            .created(
                URI.create(
                    "/api/companies/"
                    + companyId
                    + "/locations/"
                    + location.getId()
                )
            )
            .body(response);
    }

    @GetMapping
    public List<LocationResponse> findAll(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID companyId) {

        UUID userId = UUID.fromString(
            jwt.getSubject()
        );

        return locationService
            .findAll(userId, companyId)
            .stream()
            .map(LocationResponse::from)
            .toList();
    }
}
