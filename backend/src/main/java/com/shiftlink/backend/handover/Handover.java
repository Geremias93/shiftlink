package com.shiftlink.backend.handover;

import java.time.OffsetDateTime;
import java.util.UUID;

import com.shiftlink.backend.shift.Shift;
import com.shiftlink.backend.user.UserAccount;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "handovers")
public class Handover {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "shift_id", nullable = false, unique = true)
    private Shift shift;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "target_shift_id")
    private Shift targetShift;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "created_by_user_id", nullable = false)
    private UserAccount createdBy;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private HandoverStatus status = HandoverStatus.DRAFT;

    @Column(name = "submitted_at")
    private OffsetDateTime submittedAt;

    @Column(name = "acknowledged_at")
    private OffsetDateTime acknowledgedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "acknowledged_by_user_id")
    private UserAccount acknowledgedBy;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    protected Handover() {
    }

    public Handover(
            Shift shift,
            UserAccount createdBy,
            String notes) {

        this.shift = shift;
        this.createdBy = createdBy;
        this.notes = notes;
    }

    @PrePersist
    void onCreate() {
        OffsetDateTime now = OffsetDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    void onUpdate() {
        this.updatedAt = OffsetDateTime.now();
    }

    public UUID getId() {
        return id;
    }

    public Shift getShift() {
        return shift;
    }


    public Shift getTargetShift() {
        return targetShift;
    }

    public void setTargetShift(Shift targetShift) {
        this.targetShift = targetShift;
    }

    public UserAccount getCreatedBy() {
        return createdBy;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public HandoverStatus getStatus() {
        return status;
    }

    public void setStatus(HandoverStatus status) {
        this.status = status;
    }

    public OffsetDateTime getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(OffsetDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }

    public OffsetDateTime getAcknowledgedAt() {
        return acknowledgedAt;
    }

    public void setAcknowledgedAt(OffsetDateTime acknowledgedAt) {
        this.acknowledgedAt = acknowledgedAt;
    }

    public UserAccount getAcknowledgedBy() {
        return acknowledgedBy;
    }

    public void setAcknowledgedBy(UserAccount acknowledgedBy) {
        this.acknowledgedBy = acknowledgedBy;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }
}
