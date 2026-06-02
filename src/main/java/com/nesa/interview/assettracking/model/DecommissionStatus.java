package com.nesa.interview.assettracking.model;

/**
 * Lifecycle of a {@link DecommissionRequest}.
 * A request starts PENDING and is terminal once APPROVED or REJECTED.
 */
public enum DecommissionStatus {
    PENDING,
    APPROVED,
    REJECTED
}
