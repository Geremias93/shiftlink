package com.shiftlink.backend.company;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CompanyService {

    private final CompanyRepository companyRepository;

    public CompanyService(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    @Transactional
    public Company create(String name, String slug) {
        if (companyRepository.existsBySlug(slug)) {
            throw new IllegalArgumentException("A company with this slug already exists");
        }

        Company company = new Company(name, slug);

        return companyRepository.save(company);
    }

    @Transactional(readOnly = true)
    public List<Company> findAll() {
        return companyRepository.findAll();
    }
}
