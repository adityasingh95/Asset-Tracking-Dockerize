package com.nesa.interview.assettracking.repository;

import com.nesa.interview.assettracking.model.Asset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface AssetRepository extends JpaRepository<Asset, Long> {

    /**
     * Lightweight asset summaries by id, **including soft-deleted assets**. Used to label
     * decommission history (FA-09): an approved request's asset is soft-deleted and therefore
     * hidden from normal finders by {@code @SQLRestriction} — a native query bypasses that
     * entity-level filter so the name/type can still be shown.
     */
    @Query(value = "SELECT id AS id, name AS name, type AS type FROM assets WHERE id IN (:ids)",
            nativeQuery = true)
    List<AssetSummary> findSummariesIncludingDeleted(@Param("ids") Collection<Long> ids);

    /** Projection for {@link #findSummariesIncludingDeleted}. */
    interface AssetSummary {
        Long getId();
        String getName();
        String getType();
    }
}
