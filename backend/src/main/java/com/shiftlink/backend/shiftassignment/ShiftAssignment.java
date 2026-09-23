package com.shiftlink.backend.shiftassignment;

import java.time.OffsetDateTime;
import java.util.UUID;

import com.shiftlink.backend.membership.Membership;
import com.shiftlink.backend.shift.Shift;
import com.shiftlink.backend.user.UserAccount;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "shift_assignments")
public class ShiftAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "shift_id", nullable = false)
    private Shift shift;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "membership_id", nullable = false)
    private Membership membership;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "assigned_by_user_id", nullable = false)
    private UserAccount assignedBy;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    protected ShiftAssignment() {
    }

    public ShiftAssignment(
            Shift shift,
            Membership membership,
            UserAccount assignedBy) {

        this.shift = shift;
        this.membership = membership;
        this.assignedBy = assignedBy;
    }

    @PrePersist
    void onCreate() {
        this.createdAt = OffsetDateTime.now();
    }

    public UUID getId() {
        return id;
    }

    public Shift getShift() {
        return shift;
    }

    public Membership getMembership() {
        return membership;
    }

    public UserAccount getAssignedBy() {
        return assignedBy;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }
}
