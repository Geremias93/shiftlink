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

    @Transactional(readOnly = true)
    public Shift findById(
            UUID userId,
            UUID companyId,
            UUID locationId,
            UUID shiftId) {

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
            .findByIdAndLocation_Id(
                shiftId,
                locationId
            )
            .orElseThrow(ShiftNotFoundException::new);
    }





    @Transactional
    public Shift update(
            UUID userId,
            UUID companyId,
            UUID locationId,
            UUID shiftId,
            String name,
            OffsetDateTime startsAt,
            OffsetDateTime endsAt) {

        companyAccessService.requireAnyRole(
            userId,
            companyId,
            MembershipRole.OWNER,
            MembershipRole.MANAGER
        );

        Shift shift = findById(
            userId,
            companyId,
            locationId,
            shiftId
        );

        if (shift.getStatus() != ShiftStatus.SCHEDULED) {
            throw new InvalidShiftStateException(
                "Solo se puede editar un turno programado"
            );
        }

        if (!endsAt.isAfter(startsAt)) {
            throw new InvalidShiftTimeException();
        }

        shift.setName(name.trim());
        shift.setStartsAt(startsAt);
        shift.setEndsAt(endsAt);

        return shiftRepository.save(shift);
    }

    @Transactional
    public Shift start(
            UUID userId,
            UUID companyId,
            UUID locationId,
            UUID shiftId) {

        companyAccessService.requireAnyRole(
            userId,
            companyId,
            MembershipRole.OWNER,
            MembershipRole.MANAGER
        );

        Shift shift = findById(
            userId,
            companyId,
            locationId,
            shiftId
        );

        if (shift.getStatus() != ShiftStatus.SCHEDULED) {
            throw new InvalidShiftStateException(
                "Solo se puede iniciar un turno programado"
            );
        }

        shift.setStatus(ShiftStatus.ACTIVE);

        return shiftRepository.save(shift);
    }



    @Transactional
    public Shift complete(
            UUID userId,
            UUID companyId,
            UUID locationId,
            UUID shiftId) {

        companyAccessService.requireAnyRole(
            userId,
            companyId,
            MembershipRole.OWNER,
            MembershipRole.MANAGER
        );

        Shift shift = findById(
            userId,
            companyId,
            locationId,
            shiftId
        );

        if (shift.getStatus() != ShiftStatus.ACTIVE) {
            throw new InvalidShiftStateException(
                "Solo se puede completar un turno activo"
            );
        }

        shift.setStatus(ShiftStatus.COMPLETED);

        return shiftRepository.save(shift);
    }



    @Transactional
    public Shift cancel(
            UUID userId,
            UUID companyId,
            UUID locationId,
            UUID shiftId) {

        companyAccessService.requireAnyRole(
            userId,
            companyId,
            MembershipRole.OWNER,
            MembershipRole.MANAGER
        );

        Shift shift = findById(
            userId,
            companyId,
            locationId,
            shiftId
        );

        if (shift.getStatus() != ShiftStatus.SCHEDULED
                && shift.getStatus() != ShiftStatus.ACTIVE) {

            throw new InvalidShiftStateException(
                "Solo se puede cancelar un turno programado o activo"
            );
        }

        shift.setStatus(ShiftStatus.CANCELLED);

        return shiftRepository.save(shift);
    }

}
