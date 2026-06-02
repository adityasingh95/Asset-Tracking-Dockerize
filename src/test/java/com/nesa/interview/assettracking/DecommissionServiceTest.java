package com.nesa.interview.assettracking;

import com.nesa.interview.assettracking.model.Asset;
import com.nesa.interview.assettracking.model.DecommissionRequest;
import com.nesa.interview.assettracking.model.DecommissionStatus;
import com.nesa.interview.assettracking.repository.AssetRepository;
import com.nesa.interview.assettracking.repository.DecommissionRequestRepository;
import com.nesa.interview.assettracking.service.DecommissionService;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/**
 * N-01..N-07: new decommission-approval behaviour at the service/repository layer.
 * Runs against real Postgres (Testcontainers) so the soft-delete on approval is exercised.
 */
@SpringBootTest
class DecommissionServiceTest extends AbstractPostgresTest {

    @Autowired private DecommissionService service;
    @Autowired private AssetRepository assetRepository;
    @Autowired private DecommissionRequestRepository requestRepository;
    @Autowired private EntityManager entityManager;

    private Asset newAsset(String name) {
        Asset a = new Asset();
        a.setName(name);
        a.setType("Server");
        a.setStatus("Active");
        return assetRepository.saveAndFlush(a);
    }

    @Transactional(readOnly = true)
    long rawDeletedCount(Long id) {
        Number n = (Number) entityManager
                .createNativeQuery("SELECT count(*) FROM assets WHERE id = :id AND is_deleted = true")
                .setParameter("id", id)
                .getSingleResult();
        return n.longValue();
    }

    @Test
    void n01_request_createsPending_andLeavesAssetActive() {
        Asset asset = newAsset("N01");

        DecommissionRequest req = service.request(asset.getId(), "End of life", "admin");

        assertThat(req.getId()).isNotNull();
        assertThat(req.getStatus()).isEqualTo(DecommissionStatus.PENDING);
        assertThat(req.getRequestedBy()).isEqualTo("admin");
        assertThat(req.getRequestedAt()).isNotNull();
        // Asset still active (NOT soft-deleted).
        assertThat(assetRepository.findById(asset.getId())).isPresent();
        assertThat(rawDeletedCount(asset.getId())).isZero();
    }

    @Test
    void n02_request_blankReason_isRejected_andCreatesNoRow() {
        Asset asset = newAsset("N02");

        assertThatThrownBy(() -> service.request(asset.getId(), "   ", "admin"))
                .isInstanceOf(IllegalArgumentException.class);

        assertThat(requestRepository.findByAssetIdOrderByRequestedAtDesc(asset.getId())).isEmpty();
    }

    @Test
    void n03_approve_softDeletesAsset_andMarksApproved() {
        Asset asset = newAsset("N03");
        DecommissionRequest req = service.request(asset.getId(), "Decommission", "admin");

        DecommissionRequest decided = service.approve(req.getId(), "approver", "ok");

        assertThat(decided.getStatus()).isEqualTo(DecommissionStatus.APPROVED);
        assertThat(decided.getDecidedBy()).isEqualTo("approver");
        assertThat(decided.getDecidedAt()).isNotNull();
        // Asset soft-deleted: hidden from active views, row remains with is_deleted=true.
        assertThat(assetRepository.findById(asset.getId())).isEmpty();
        assertThat(rawDeletedCount(asset.getId())).isEqualTo(1L);
    }

    @Test
    void n04_reject_leavesAssetActive_andMarksRejected() {
        Asset asset = newAsset("N04");
        DecommissionRequest req = service.request(asset.getId(), "Maybe", "admin");

        DecommissionRequest decided = service.reject(req.getId(), "approver", "not now");

        assertThat(decided.getStatus()).isEqualTo(DecommissionStatus.REJECTED);
        assertThat(decided.getDecidedBy()).isEqualTo("approver");
        assertThat(decided.getDecidedAt()).isNotNull();
        // Asset still active and visible.
        assertThat(assetRepository.findById(asset.getId())).isPresent();
        assertThat(rawDeletedCount(asset.getId())).isZero();
    }

    @Test
    void n05_duplicatePending_isBlocked() {
        Asset asset = newAsset("N05");
        service.request(asset.getId(), "first", "admin");

        assertThatThrownBy(() -> service.request(asset.getId(), "second", "admin"))
                .isInstanceOf(IllegalArgumentException.class);

        // Only one request exists.
        assertThat(requestRepository.findByAssetIdOrderByRequestedAtDesc(asset.getId())).hasSize(1);
    }

    @Test
    void n06_requestAgainstSoftDeletedAsset_isBlocked() {
        Asset asset = newAsset("N06");
        DecommissionRequest req = service.request(asset.getId(), "retire", "admin");
        service.approve(req.getId(), "approver", "done");   // asset now soft-deleted

        assertThatThrownBy(() -> service.request(asset.getId(), "again", "admin"))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void n07_auditHistory_retrievable_evenForApprovedSoftDeletedAsset() {
        Asset asset = newAsset("N07");
        DecommissionRequest req = service.request(asset.getId(), "audit me", "alice");
        service.approve(req.getId(), "bob", "approved comment");

        // Asset is now soft-deleted, but its request history survives (plain Long assetId, ADR-002).
        List<DecommissionRequest> history = service.historyForAsset(asset.getId());
        assertThat(history).hasSize(1);
        DecommissionRequest h = history.get(0);
        assertThat(h.getReason()).isEqualTo("audit me");
        assertThat(h.getRequestedBy()).isEqualTo("alice");
        assertThat(h.getRequestedAt()).isNotNull();
        assertThat(h.getDecidedBy()).isEqualTo("bob");
        assertThat(h.getDecidedAt()).isNotNull();
        assertThat(h.getStatus()).isEqualTo(DecommissionStatus.APPROVED);
        assertThat(h.getDecisionComment()).isEqualTo("approved comment");
    }
}
