package com.shiftlink.backend.auth;

import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.shiftlink.backend.company.Company;
import com.shiftlink.backend.company.CompanyService;
import com.shiftlink.backend.handover.HandoverService;
import com.shiftlink.backend.handoveritem.HandoverItem;
import com.shiftlink.backend.handoveritem.HandoverItemPriority;
import com.shiftlink.backend.handoveritem.HandoverItemService;
import com.shiftlink.backend.handoveritem.HandoverItemType;
import com.shiftlink.backend.location.Location;
import com.shiftlink.backend.location.LocationService;
import com.shiftlink.backend.membership.Membership;
import com.shiftlink.backend.membership.MembershipRole;
import com.shiftlink.backend.membership.MembershipService;
import com.shiftlink.backend.shift.Shift;
import com.shiftlink.backend.shift.ShiftService;
import com.shiftlink.backend.shiftassignment.ShiftAssignmentService;
import com.shiftlink.backend.user.UserAccount;

@Service
public class DemoSessionService {

    private static final ZoneId DEMO_ZONE =
        ZoneId.of("Europe/Madrid");

    private final DemoSessionMaintenanceService maintenanceService;
    private final AuthService authService;
    private final CompanyService companyService;
    private final LocationService locationService;
    private final MembershipService membershipService;
    private final ShiftService shiftService;
    private final ShiftAssignmentService shiftAssignmentService;
    private final HandoverService handoverService;
    private final HandoverItemService handoverItemService;

    public DemoSessionService(
            DemoSessionMaintenanceService maintenanceService,
            AuthService authService,
            CompanyService companyService,
            LocationService locationService,
            MembershipService membershipService,
            ShiftService shiftService,
            ShiftAssignmentService shiftAssignmentService,
            HandoverService handoverService,
            HandoverItemService handoverItemService) {

        this.maintenanceService = maintenanceService;
        this.authService = authService;
        this.companyService = companyService;
        this.locationService = locationService;
        this.membershipService = membershipService;
        this.shiftService = shiftService;
        this.shiftAssignmentService = shiftAssignmentService;
        this.handoverService = handoverService;
        this.handoverItemService = handoverItemService;
    }

    @Transactional
    public UserAccount createDemoSession() {

        if (!maintenanceService.reserveCreationSlot()) {
            throw new DemoSessionLimitException();
        }

        String sessionId = UUID.randomUUID()
            .toString()
            .replace("-", "");

        String shortId = sessionId.substring(0, 12);

        UserAccount demoUser = authService.register(
            new RegisterRequest(
                "demo-" + shortId + "@shiftlink.dev",
                randomPassword(),
                "Usuario",
                "Demo"
            )
        );

        Company company = companyService.create(
            "ShiftLink Demo",
            "demo-" + sessionId,
            demoUser.getId()
        );

        Location location = locationService.create(
            demoUser.getId(),
            company.getId(),
            "Local Getafe Centro",
            "Calle Madrid 10, Getafe"
        );

        UserAccount employee = authService.register(
            new RegisterRequest(
                "empleado-" + shortId + "@shiftlink.dev",
                randomPassword(),
                "Daniel",
                "Ruiz"
            )
        );

        UserAccount laura = authService.register(
            new RegisterRequest(
                "laura-" + shortId + "@shiftlink.dev",
                randomPassword(),
                "Laura",
                "Martín"
            )
        );

        Membership employeeMembership =
            membershipService.addMember(
                demoUser.getId(),
                company.getId(),
                employee.getEmail(),
                MembershipRole.EMPLOYEE
            );

        Membership lauraMembership =
            membershipService.addMember(
                demoUser.getId(),
                company.getId(),
                laura.getEmail(),
                MembershipRole.EMPLOYEE
            );

        Membership ownerMembership =
            membershipService.findCurrentMembership(
                demoUser.getId(),
                company.getId()
            );

        OffsetDateTime now = OffsetDateTime
            .now(DEMO_ZONE)
            .withMinute(0)
            .withSecond(0)
            .withNano(0);

        OffsetDateTime firstStart = now.minusHours(2);
        OffsetDateTime firstEnd = firstStart.plusHours(8);

        OffsetDateTime secondStart = firstEnd;
        OffsetDateTime secondEnd = secondStart.plusHours(8);

        OffsetDateTime thirdStart = secondEnd;
        OffsetDateTime thirdEnd = thirdStart.plusHours(8);

        Shift currentShift = shiftService.create(
            demoUser.getId(),
            company.getId(),
            location.getId(),
            "Turno actual",
            firstStart,
            firstEnd
        );

        Shift nextShift = shiftService.create(
            demoUser.getId(),
            company.getId(),
            location.getId(),
            "Turno siguiente",
            secondStart,
            secondEnd
        );

        Shift laterShift = shiftService.create(
            demoUser.getId(),
            company.getId(),
            location.getId(),
            "Turno posterior",
            thirdStart,
            thirdEnd
        );

        shiftAssignmentService.assign(
            demoUser.getId(),
            company.getId(),
            location.getId(),
            currentShift.getId(),
            employeeMembership.getId()
        );

        shiftAssignmentService.assign(
            demoUser.getId(),
            company.getId(),
            location.getId(),
            nextShift.getId(),
            lauraMembership.getId()
        );

        shiftAssignmentService.assign(
            demoUser.getId(),
            company.getId(),
            location.getId(),
            nextShift.getId(),
            ownerMembership.getId()
        );

        shiftService.start(
            demoUser.getId(),
            company.getId(),
            location.getId(),
            currentShift.getId()
        );

        handoverService.createDraft(
            employee.getId(),
            company.getId(),
            location.getId(),
            currentShift.getId(),
            nextShift.getId(),
            "Turno tranquilo. Revisar la incidencia de la cámara "
                + "frigorífica y confirmar el pedido pendiente "
                + "antes del siguiente turno."
        );

        handoverItemService.create(
            employee.getId(),
            company.getId(),
            location.getId(),
            currentShift.getId(),
            HandoverItemType.INCIDENT,
            "Temperatura inestable en la cámara frigorífica",
            "La cámara ha registrado variaciones de temperatura. "
                + "Revisar el equipo y avisar a mantenimiento "
                + "si vuelve a superar el rango habitual.",
            HandoverItemPriority.HIGH
        );

        HandoverItem completedTask =
            handoverItemService.create(
                employee.getId(),
                company.getId(),
                location.getId(),
                currentShift.getId(),
                HandoverItemType.TASK,
                "Confirmar el pedido pendiente",
                "Comprobar con el proveedor que el pedido previsto "
                    + "está confirmado antes del siguiente turno.",
                HandoverItemPriority.MEDIUM
            );

        handoverService.submit(
            employee.getId(),
            company.getId(),
            location.getId(),
            currentShift.getId()
        );

        handoverService.acknowledge(
            laura.getId(),
            company.getId(),
            location.getId(),
            currentShift.getId()
        );

        handoverItemService.resolve(
            laura.getId(),
            company.getId(),
            location.getId(),
            currentShift.getId(),
            completedTask.getId()
        );

        handoverService.createDraft(
            demoUser.getId(),
            company.getId(),
            location.getId(),
            nextShift.getId(),
            laterShift.getId(),
            "Revisar el cierre de caja y comprobar que la cámara "
                + "frigorífica funciona correctamente antes "
                + "del siguiente turno."
        );

        handoverItemService.create(
            demoUser.getId(),
            company.getId(),
            location.getId(),
            nextShift.getId(),
            HandoverItemType.TASK,
            "Revisar el cierre de caja",
            "Comprobar que el cierre de caja está cuadrado "
                + "antes de entregar el turno.",
            HandoverItemPriority.MEDIUM
        );

        handoverItemService.create(
            demoUser.getId(),
            company.getId(),
            location.getId(),
            nextShift.getId(),
            HandoverItemType.INCIDENT,
            "Temperatura elevada en la cámara frigorífica",
            "Se ha detectado una temperatura superior a la habitual. "
                + "Revisar el equipo y avisar a mantenimiento "
                + "si el problema continúa.",
            HandoverItemPriority.HIGH
        );

        return demoUser;
    }

    private String randomPassword() {
        return UUID.randomUUID().toString() + "Aa1!";
    }
}
