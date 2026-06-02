package com.nesa.interview.assettracking.repository;

import com.nesa.interview.assettracking.model.DecommissionRequest;
import com.nesa.interview.assettracking.model.DecommissionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DecommissionRequestRepository extends JpaRepository<DecommissionRequest, Long> {

    /** Duplicate-pending guard (V-05). */
    boolean existsByAssetIdAndStatus(Long assetId, DecommissionStatus status);

    /** Approver view — all requests in a given state (e.g. PENDING). FA-04. */
    List<DecommissionRequest> findByStatus(DecommissionStatus status);

    /** History for one asset, most recent first. FA-09. */
    List<DecommissionRequest> findByAssetIdOrderByRequestedAtDesc(Long assetId);
}
