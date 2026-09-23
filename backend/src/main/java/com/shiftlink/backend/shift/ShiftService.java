package com.shiftlink.backend.shift;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.shiftlink.backend.location.Location;
import com.shiftlink.backend.location.LocationNotFoundException;
import com.shiftlink.backend.location.LocationRepository;
import com.shiftlink.backend.membership.CompanyAccessService;
import com.shiftlink.backend.membership.MembershipRole;

@Service
public class ShiftService {

    private final ShiftRepository shiftRepository;
    private final LocationRepository locationRepository;
    private final CompanyAccessService companyAccessService;

    public ShiftService(
            ShiftRepository shiftRepository,
            LocationRepository locationRepository,
            CompanyAccessService companyAccessService) {

        this.shiftRepository = shiftRepository;
        this.locationRepository = locationRepository;
        this.companyAccessService = companyAccessService;
    }

    @Transactional
    public Shift create(
            UUID userId,
            UUID companyId,
            UUID locationId,
            String name,
            OffsetDateTime startsAt,
            OffsetDateTime endsAt) {

        companyAccessService.requireAnyRole(
            userId,
            companyId,
            MembershipRole.OWNER,
            MembershipRole.MANAGER
        );

        Location location = locationRepository
            .findByIdAndCompany_IdAndActiveTrue(
                locationId,
                companyId
            )
            .orElseThrow(LocationNotFoundException::new);

        if (!endsAt.isAfter(startsAt)) {
            throw new InvalidShiftTimeException();
        }

        Shift shift = new Shift(
            location,
            name.trim(),
            startsAt,
            endsAt
        );

        return shiftRepository.save(shift);
    }

    @Transactional(readOnly = true)
    public List<Shift> findAll(
            UUID userId,
            UUID companyId,
            UUID locationId) {

        companyAccessService.requireMembership(
            userId,
            companyId
        );

        locationRepository
            .findByIdAndCompany_IdAndActiveTrue(
                locationId,
                companyId
            )
            .orElseThrow(LocationNotFoundException::new);

        return shiftRepository
            .findByLocation_IdOrderByStartsAtAsc(
                locationId
            );
    }
}
