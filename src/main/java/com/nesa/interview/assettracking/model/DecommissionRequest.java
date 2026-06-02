package com.nesa.interview.assettracking.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

import java.time.Instant;

/**
 * A request to decommission (soft-delete) an {@link Asset}, with its audit trail.
 *
 * <p>The asset is referenced by a plain {@code Long assetId} rather than a JPA association,
 * so the request — and its history — remains viewable after the asset is soft-deleted
 * (a {@code @ManyToOne Asset} would be hidden by {@code @SQLRestriction}). See ADR-002.
 */
@Entity
@Table(name = "decommission_requests")
@Data
public class DecommissionRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** FK value to {@code assets.id} (not a JPA association — see ADR-002). */
    private Long assetId;

    @Enumerated(EnumType.STRING)
    private DecommissionStatus status = DecommissionStatus.PENDING;

    @Column(nullable = false)
    private String reason;

    /** Authentication#getName() of the requester. */
    private String requestedBy;

    private Instant requestedAt;

    /** Null until a decision is made. */
    private String decidedBy;

    /** Null until a decision is made. */
    private Instant decidedAt;

    @Column(length = 1000)
    private String decisionComment;
}
