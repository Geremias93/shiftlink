package com.shiftlink.backend.company;

import java.util.List;
import java.util.UUID;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/companies")
public class CompanyController {

    private final CompanyService companyService;

    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    @PostMapping
    public ResponseEntity<CompanyResponse> create(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody CreateCompanyRequest request) {

        UUID userId = UUID.fromString(jwt.getSubject());

        Company company = companyService.create(
            request.name(),
            request.slug(),
            userId
        );

        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(CompanyResponse.from(company));
    }

    @GetMapping
    public List<CompanyResponse> findAll(
            @AuthenticationPrincipal Jwt jwt) {

        UUID userId = UUID.fromString(jwt.getSubject());

        return companyService
            .findAllForUser(userId)
            .stream()
            .map(CompanyResponse::from)
            .toList();
    }

    @GetMapping("/{companyId}")
    public CompanyResponse findById(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID companyId) {

        UUID userId = UUID.fromString(jwt.getSubject());

        Company company = companyService.findByIdForUser(
            userId,
            companyId
        );

        return CompanyResponse.from(company);
    }

}
