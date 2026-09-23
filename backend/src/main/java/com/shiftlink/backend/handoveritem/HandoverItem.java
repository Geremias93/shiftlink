package com.shiftlink.backend.handoveritem;

import java.time.OffsetDateTime;
import java.util.UUID;

import com.shiftlink.backend.handover.Handover;
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
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "handover_items")
public class HandoverItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "handover_id", nullable = false)
    private Handover handover;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private HandoverItemType type;

    @Column(nullable = false, length = 160)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private HandoverItemPriority priority =
        HandoverItemPriority.MEDIUM;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private HandoverItemStatus status =
        HandoverItemStatus.OPEN;

    @Column(name = "resolved_at")
    private OffsetDateTime resolvedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resolved_by_user_id")
    private UserAccount resolvedBy;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    protected HandoverItem() {
    }

    public HandoverItem(
            Handover handover,
            HandoverItemType type,
            String title,
            String description,
            HandoverItemPriority priority) {

        this.handover = handover;
        this.type = type;
        this.title = title;
        this.description = description;
        this.priority = priority;
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

    public Handover getHandover() {
        return handover;
    }

    public HandoverItemType getType() {
        return type;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public HandoverItemPriority getPriority() {
        return priority;
    }

    public HandoverItemStatus getStatus() {
        return status;
    }

    public void setStatus(HandoverItemStatus status) {
        this.status = status;
    }

    public OffsetDateTime getResolvedAt() {
        return resolvedAt;
    }

    public void setResolvedAt(OffsetDateTime resolvedAt) {
        this.resolvedAt = resolvedAt;
    }

    public UserAccount getResolvedBy() {
        return resolvedBy;
    }

    public void setResolvedBy(UserAccount resolvedBy) {
        this.resolvedBy = resolvedBy;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }
}
