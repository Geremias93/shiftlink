package com.shiftlink.backend.shiftassignment;

import java.util.List;
import java.util.UUID;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(
    "/api/companies/{companyId}/locations/{locationId}/shifts/{shiftId}/assignments"
)
public class ShiftAssignmentController {

    private final ShiftAssignmentService shiftAssignmentService;

    public ShiftAssignmentController(
            ShiftAssignmentService shiftAssignmentService) {

        this.shiftAssignmentService = shiftAssignmentService;
    }

    @PostMapping
    public ResponseEntity<ShiftAssignmentResponse> assign(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID companyId,
            @PathVariable UUID locationId,
            @PathVariable UUID shiftId,
            @Valid @RequestBody AddShiftAssignmentRequest request) {

        UUID userId = UUID.fromString(jwt.getSubject());

        ShiftAssignment assignment = shiftAssignmentService.assign(
            userId,
            companyId,
            locationId,
            shiftId,
            request.membershipId()
        );

        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(ShiftAssignmentResponse.from(assignment));
    }


    @GetMapping
    public List<ShiftAssignmentResponse> findAll(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID companyId,
            @PathVariable UUID locationId,
            @PathVariable UUID shiftId) {

        UUID userId = UUID.fromString(jwt.getSubject());

        return shiftAssignmentService
            .findAllByShift(
                userId,
                companyId,
                locationId,
                shiftId
            )
            .stream()
            .map(ShiftAssignmentResponse::from)
            .toList();
    }



    @DeleteMapping("/{assignmentId}")
    public ResponseEntity<Void> remove(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID companyId,
            @PathVariable UUID locationId,
            @PathVariable UUID shiftId,
            @PathVariable UUID assignmentId) {

        UUID userId = UUID.fromString(jwt.getSubject());

        shiftAssignmentService.remove(
            userId,
            companyId,
            locationId,
            shiftId,
            assignmentId
        );

        return ResponseEntity.noContent().build();
    }

}
