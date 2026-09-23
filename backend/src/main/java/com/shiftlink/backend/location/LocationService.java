package com.shiftlink.backend.location;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.shiftlink.backend.company.Company;
import com.shiftlink.backend.membership.CompanyAccessService;
import com.shiftlink.backend.membership.Membership;
import com.shiftlink.backend.membership.MembershipRole;

@Service
public class LocationService {

    private final LocationRepository locationRepository;
    private final CompanyAccessService companyAccessService;

    public LocationService(
            LocationRepository locationRepository,
            CompanyAccessService companyAccessService) {

        this.locationRepository = locationRepository;
        this.companyAccessService = companyAccessService;
    }

    @Transactional
    public Location create(
            UUID userId,
            UUID companyId,
            String name,
            String address) {

        Membership membership =
            companyAccessService.requireAnyRole(
                userId,
                companyId,
                MembershipRole.OWNER,
                MembershipRole.MANAGER
            );

        String normalizedName = name.trim();

        if (locationRepository.existsByCompany_IdAndNameIgnoreCase(
                companyId,
                normalizedName)) {

            throw new DuplicateLocationNameException(
                normalizedName
            );
        }

        Company company = membership.getCompany();

        String normalizedAddress =
            address == null || address.isBlank()
                ? null
                : address.trim();

        Location location = new Location(
            company,
            normalizedName,
            normalizedAddress
        );

        return locationRepository.save(location);
    }

    @Transactional(readOnly = true)
    public List<Location> findAll(
            UUID userId,
            UUID companyId) {

        companyAccessService.requireMembership(
            userId,
            companyId
        );

        return locationRepository
            .findByCompany_IdAndActiveTrueOrderByNameAsc(
                companyId
            );
    }

    @Transactional(readOnly = true)
    public Location findById(
            UUID userId,
            UUID companyId,
            UUID locationId) {

        companyAccessService.requireMembership(
            userId,
            companyId
        );

        return locationRepository
            .findByIdAndCompany_IdAndActiveTrue(
                locationId,
                companyId
            )
            .orElseThrow(LocationNotFoundException::new);
    }

}
