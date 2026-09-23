package com.shiftlink.backend.shift;

import java.net.URI;
import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

@RestController
@RequestMapping(
    "/api/companies/{companyId}/locations/{locationId}/shifts"
)
public class ShiftController {

    private final ShiftService shiftService;

    public ShiftController(ShiftService shiftService) {
        this.shiftService = shiftService;
    }

    @PostMapping
    public ResponseEntity<ShiftResponse> create(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID companyId,
            @PathVariable UUID locationId,
            @Valid @RequestBody CreateShiftRequest request) {

        UUID userId = UUID.fromString(
            jwt.getSubject()
        );

        Shift shift = shiftService.create(
            userId,
            companyId,
            locationId,
            request.name(),
            request.startsAt(),
            request.endsAt()
        );

        ShiftResponse response =
            ShiftResponse.from(shift);

        return ResponseEntity
            .created(
                URI.create(
                    "/api/companies/"
                    + companyId
                    + "/locations/"
                    + locationId
                    + "/shifts/"
                    + shift.getId()
                )
            )
            .body(response);
    }

    @GetMapping
    public List<ShiftResponse> findAll(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID companyId,
            @PathVariable UUID locationId) {

        UUID userId = UUID.fromString(
            jwt.getSubject()
        );

        return shiftService
            .findAll(
                userId,
                companyId,
                locationId
            )
            .stream()
            .map(ShiftResponse::from)
            .toList();
    }

    @GetMapping("/{shiftId}")
    public ShiftResponse findById(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID companyId,
            @PathVariable UUID locationId,
            @PathVariable UUID shiftId) {

        UUID userId = UUID.fromString(
            jwt.getSubject()
        );

        Shift shift = shiftService.findById(
            userId,
            companyId,
            locationId,
            shiftId
        );

        return ShiftResponse.from(shift);
    }





    @PatchMapping("/{shiftId}")
    public ShiftResponse update(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID companyId,
            @PathVariable UUID locationId,
            @PathVariable UUID shiftId,
            @Valid @RequestBody UpdateShiftRequest request) {

        UUID userId = UUID.fromString(
            jwt.getSubject()
        );

        Shift shift = shiftService.update(
            userId,
            companyId,
            locationId,
            shiftId,
            request.name(),
            request.startsAt(),
            request.endsAt()
        );

        return ShiftResponse.from(shift);
    }


    @PostMapping("/{shiftId}/start")
    public ShiftResponse start(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID companyId,
            @PathVariable UUID locationId,
            @PathVariable UUID shiftId) {

        UUID userId = UUID.fromString(
            jwt.getSubject()
        );

        Shift shift = shiftService.start(
            userId,
            companyId,
            locationId,
            shiftId
        );

        return ShiftResponse.from(shift);
    }



    @PostMapping("/{shiftId}/complete")
    public ShiftResponse complete(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID companyId,
            @PathVariable UUID locationId,
            @PathVariable UUID shiftId) {

        UUID userId = UUID.fromString(
            jwt.getSubject()
        );

        Shift shift = shiftService.complete(
            userId,
            companyId,
            locationId,
            shiftId
        );

        return ShiftResponse.from(shift);
    }



    @PostMapping("/{shiftId}/cancel")
    public ShiftResponse cancel(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID companyId,
            @PathVariable UUID locationId,
            @PathVariable UUID shiftId) {

        UUID userId = UUID.fromString(
            jwt.getSubject()
        );

        Shift shift = shiftService.cancel(
            userId,
            companyId,
            locationId,
            shiftId
        );

        return ShiftResponse.from(shift);
    }

}
