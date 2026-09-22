package com.shiftlink.backend.company;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
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
            @Valid @RequestBody CreateCompanyRequest request) {

        Company company = companyService.create(
            request.name(),
            request.slug()
        );

        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(CompanyResponse.from(company));
    }

    @GetMapping
    public List<CompanyResponse> findAll() {
        return companyService.findAll()
            .stream()
            .map(CompanyResponse::from)
            .toList();
    }
}
