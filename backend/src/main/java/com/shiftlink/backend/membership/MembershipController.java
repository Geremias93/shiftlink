package com.shiftlink.backend.membership;

import java.util.List;
import java.util.UUID;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
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

@RestController
@RequestMapping("/api/companies/{companyId}/members")
public class MembershipController {

    private final MembershipService membershipService;

    public MembershipController(
            MembershipService membershipService) {

        this.membershipService = membershipService;
    }

    @GetMapping
    public List<MembershipResponse> findAll(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID companyId) {

        UUID userId = UUID.fromString(jwt.getSubject());

        return membershipService
            .findAllByCompany(
                userId,
                companyId
            )
            .stream()
            .map(MembershipResponse::from)
            .toList();
    }

    @PostMapping
    public ResponseEntity<MembershipResponse> addMember(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID companyId,
            @Valid @RequestBody AddMembershipRequest request) {

        UUID userId = UUID.fromString(jwt.getSubject());

        Membership membership = membershipService.addMember(
            userId,
            companyId,
            request.email(),
            request.role()
        );

        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(MembershipResponse.from(membership));
    }


    @PatchMapping("/{membershipId}/role")
    public MembershipResponse updateRole(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID companyId,
            @PathVariable UUID membershipId,
            @Valid @RequestBody UpdateMembershipRoleRequest request) {

        UUID userId = UUID.fromString(jwt.getSubject());

        Membership membership = membershipService.updateRole(
            userId,
            companyId,
            membershipId,
            request.role()
        );

        return MembershipResponse.from(membership);
    }



    @PostMapping("/{membershipId}/deactivate")
    public MembershipResponse deactivateMember(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID companyId,
            @PathVariable UUID membershipId) {

        UUID userId = UUID.fromString(jwt.getSubject());

        Membership membership = membershipService.deactivateMember(
            userId,
            companyId,
            membershipId
        );

        return MembershipResponse.from(membership);
    }

}
