package com.shiftlink.backend.shift;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.shiftlink.backend.location.Location;
import com.shiftlink.backend.location.LocationRepository;
import com.shiftlink.backend.membership.CompanyAccessService;

@ExtendWith(MockitoExtension.class)
class ShiftServiceTest {

    @Mock
    private ShiftRepository shiftRepository;

    @Mock
    private LocationRepository locationRepository;

    @Mock
    private CompanyAccessService companyAccessService;

    @Mock
    private Location location;

    @InjectMocks
    private ShiftService shiftService;

    @Test
    void createRejectsInvalidTimeRange() {
        UUID userId = UUID.randomUUID();
        UUID companyId = UUID.randomUUID();
        UUID locationId = UUID.randomUUID();

        OffsetDateTime startsAt =
            OffsetDateTime.parse("2026-09-24T08:00:00Z");

        OffsetDateTime endsAt =
            OffsetDateTime.parse("2026-09-24T07:00:00Z");

        when(
            locationRepository
                .findByIdAndCompany_IdAndActiveTrue(
                    locationId,
                    companyId
                )
        ).thenReturn(Optional.of(location));

        assertThatThrownBy(() ->
            shiftService.create(
                userId,
                companyId,
                locationId,
                "Turno mañana",
                startsAt,
                endsAt
            )
        ).isInstanceOf(InvalidShiftTimeException.class);

        verify(shiftRepository, never()).save(any());
    }

    @Test
    void startRejectsShiftThatIsNotScheduled() {
        UUID userId = UUID.randomUUID();
        UUID companyId = UUID.randomUUID();
        UUID locationId = UUID.randomUUID();
        UUID shiftId = UUID.randomUUID();

        Shift shift = org.mockito.Mockito.mock(Shift.class);

        when(
            locationRepository
                .findByIdAndCompany_IdAndActiveTrue(
                    locationId,
                    companyId
                )
        ).thenReturn(Optional.of(location));

        when(
            shiftRepository.findByIdAndLocation_Id(
                shiftId,
                locationId
            )
        ).thenReturn(Optional.of(shift));

        when(shift.getStatus())
            .thenReturn(ShiftStatus.ACTIVE);

        assertThatThrownBy(() ->
            shiftService.start(
                userId,
                companyId,
                locationId,
                shiftId
            )
        )
            .isInstanceOf(InvalidShiftStateException.class)
            .hasMessage(
                "Solo se puede iniciar un turno programado"
            );

        verify(shiftRepository, never()).save(any());
    }


    @Test
    void completeRejectsShiftThatIsNotActive() {
        UUID userId = UUID.randomUUID();
        UUID companyId = UUID.randomUUID();
        UUID locationId = UUID.randomUUID();
        UUID shiftId = UUID.randomUUID();

        Shift shift = org.mockito.Mockito.mock(Shift.class);

        when(
            locationRepository
                .findByIdAndCompany_IdAndActiveTrue(
                    locationId,
                    companyId
                )
        ).thenReturn(Optional.of(location));

        when(
            shiftRepository.findByIdAndLocation_Id(
                shiftId,
                locationId
            )
        ).thenReturn(Optional.of(shift));

        when(shift.getStatus())
            .thenReturn(ShiftStatus.SCHEDULED);

        assertThatThrownBy(() ->
            shiftService.complete(
                userId,
                companyId,
                locationId,
                shiftId
            )
        )
            .isInstanceOf(InvalidShiftStateException.class)
            .hasMessage(
                "Solo se puede completar un turno activo"
            );

        verify(shiftRepository, never()).save(any());
    }


    @Test
    void cancelRejectsCompletedShift() {
        UUID userId = UUID.randomUUID();
        UUID companyId = UUID.randomUUID();
        UUID locationId = UUID.randomUUID();
        UUID shiftId = UUID.randomUUID();

        Shift shift = org.mockito.Mockito.mock(Shift.class);

        when(
            locationRepository
                .findByIdAndCompany_IdAndActiveTrue(
                    locationId,
                    companyId
                )
        ).thenReturn(Optional.of(location));

        when(
            shiftRepository.findByIdAndLocation_Id(
                shiftId,
                locationId
            )
        ).thenReturn(Optional.of(shift));

        when(shift.getStatus())
            .thenReturn(ShiftStatus.COMPLETED);

        assertThatThrownBy(() ->
            shiftService.cancel(
                userId,
                companyId,
                locationId,
                shiftId
            )
        )
            .isInstanceOf(InvalidShiftStateException.class)
            .hasMessage(
                "Solo se puede cancelar un turno programado o activo"
            );

        verify(shiftRepository, never()).save(any());
    }


    @Test
    void updateRejectsShiftThatIsNotScheduled() {
        UUID userId = UUID.randomUUID();
        UUID companyId = UUID.randomUUID();
        UUID locationId = UUID.randomUUID();
        UUID shiftId = UUID.randomUUID();

        Shift shift = org.mockito.Mockito.mock(Shift.class);

        OffsetDateTime startsAt =
            OffsetDateTime.parse("2026-09-24T08:00:00Z");

        OffsetDateTime endsAt =
            OffsetDateTime.parse("2026-09-24T16:00:00Z");

        when(
            locationRepository
                .findByIdAndCompany_IdAndActiveTrue(
                    locationId,
                    companyId
                )
        ).thenReturn(Optional.of(location));

        when(
            shiftRepository.findByIdAndLocation_Id(
                shiftId,
                locationId
            )
        ).thenReturn(Optional.of(shift));

        when(shift.getStatus())
            .thenReturn(ShiftStatus.ACTIVE);

        assertThatThrownBy(() ->
            shiftService.update(
                userId,
                companyId,
                locationId,
                shiftId,
                "Turno actualizado",
                startsAt,
                endsAt
            )
        )
            .isInstanceOf(InvalidShiftStateException.class)
            .hasMessage(
                "Solo se puede editar un turno programado"
            );

        verify(shiftRepository, never()).save(any());
    }

}
