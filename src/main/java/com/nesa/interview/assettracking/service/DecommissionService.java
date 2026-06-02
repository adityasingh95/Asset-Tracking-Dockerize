package com.nesa.interview.assettracking.service;

import com.nesa.interview.assettracking.model.Asset;
import com.nesa.interview.assettracking.model.DecommissionRequest;
import com.nesa.interview.assettracking.model.DecommissionStatus;
import com.nesa.interview.assettracking.repository.AssetRepository;
import com.nesa.interview.assettracking.repository.DecommissionRequestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

/**
 * All decommission-approval business rules live here, so the controllers stay thin.
 *
 * <p>Guards: V-01 (reason required), V-04 (no request for an already soft-deleted asset),
 * V-05 (no duplicate PENDING). On approval the existing soft-delete is reused
 * ({@code assetRepository.deleteById}) rather than any new delete query (ADR-001 / FA-05).
 */
@Service
public class DecommissionService {

    private final AssetRepository assetRepository;
    private final DecommissionRequestRepository requestRepository;

    public DecommissionService(AssetRepository assetRepository,
                               DecommissionRequestRepository requestRepository) {
        this.assetRepository = assetRepository;
        this.requestRepository = requestRepository;
    }

    /**
     * Create a PENDING request for an asset. The asset is NOT soft-deleted here (FA-01).
     *
     * @throws IllegalArgumentException if the reason is blank (V-01), the asset is not an
     *         active asset / already decommissioned (V-04), or a PENDING request already
     *         exists for it (V-05).
     */
    @Transactional
    public DecommissionRequest request(Long assetId, String reason, String requester) {
        if (reason == null || reason.isBlank()) {
            throw new IllegalArgumentException("A reason is required to request decommission.");
        }
        // V-04: @SQLRestriction hides soft-deleted assets, so "not found among active" == cannot request.
        Asset asset = assetRepository.findById(assetId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Asset " + assetId + " is not an active asset (not found or already decommissioned)."));
        // V-05: no duplicate pending request.
        if (requestRepository.existsByAssetIdAndStatus(asset.getId(), DecommissionStatus.PENDING)) {
            throw new IllegalArgumentException(
                    "Asset " + asset.getId() + " already has a pending decommission request.");
        }

        DecommissionRequest req = new DecommissionRequest();
        req.setAssetId(asset.getId());
        req.setStatus(DecommissionStatus.PENDING);
        req.setReason(reason.trim());
        req.setRequestedBy(requester);
        req.setRequestedAt(Instant.now());
        return requestRepository.save(req);
    }

    /**
     * Approve a PENDING request: mark it APPROVED with decision metadata and reuse the
     * existing soft-delete on the asset (FA-05, ADR-001).
     */
    @Transactional
    public DecommissionRequest approve(Long requestId, String approver, String comment) {
        DecommissionRequest req = loadPending(requestId);
        req.setStatus(DecommissionStatus.APPROVED);
        req.setDecidedBy(approver);
        req.setDecidedAt(Instant.now());
        req.setDecisionComment(comment);
        requestRepository.save(req);

        // Reuse the existing @SQLDelete soft-delete; do not write a new delete query.
        assetRepository.deleteById(req.getAssetId());
        return req;
    }

    /**
     * Reject a PENDING request: mark it REJECTED with decision metadata. The asset is
     * left active and visible (FA-06, V-02).
     */
    @Transactional
    public DecommissionRequest reject(Long requestId, String approver, String comment) {
        DecommissionRequest req = loadPending(requestId);
        req.setStatus(DecommissionStatus.REJECTED);
        req.setDecidedBy(approver);
        req.setDecidedAt(Instant.now());
        req.setDecisionComment(comment);
        return requestRepository.save(req);
    }

    /** All requests currently awaiting a decision (approver view, FA-04). */
    @Transactional(readOnly = true)
    public List<DecommissionRequest> pendingRequests() {
        return requestRepository.findByStatus(DecommissionStatus.PENDING);
    }

    /** Decision history for one asset, newest first (FA-09). */
    @Transactional(readOnly = true)
    public List<DecommissionRequest> historyForAsset(Long assetId) {
        return requestRepository.findByAssetIdOrderByRequestedAtDesc(assetId);
    }

    private DecommissionRequest loadPending(Long requestId) {
        DecommissionRequest req = requestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Request " + requestId + " not found."));
        if (req.getStatus() != DecommissionStatus.PENDING) {
            throw new IllegalArgumentException(
                    "Request " + requestId + " is already " + req.getStatus() + ".");
        }
        return req;
    }
}
