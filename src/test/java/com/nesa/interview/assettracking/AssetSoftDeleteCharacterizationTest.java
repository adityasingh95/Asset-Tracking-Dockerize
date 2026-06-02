package com.nesa.interview.assettracking;

import com.nesa.interview.assettracking.model.Asset;
import com.nesa.interview.assettracking.repository.AssetRepository;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * C-01 and C-02: lock in the existing soft-delete semantics of the {@link Asset}
 * entity ({@code @SQLDelete} + {@code @SQLRestriction}) against the unchanged code.
 */
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class AssetSoftDeleteCharacterizationTest extends AbstractPostgresTest {

    @Autowired
    private AssetRepository assetRepository;

    @Autowired
    private EntityManager entityManager;

    private Asset persistAsset(String name) {
        Asset asset = new Asset();
        asset.setName(name);
        asset.setType("Laptop");
        asset.setStatus("Active");
        return assetRepository.saveAndFlush(asset);
    }

    @Test
    void c01_softDelete_hidesButDoesNotRemoveRow() {
        Asset asset = persistAsset("C01-Asset");
        Long id = asset.getId();

        assetRepository.deleteById(id);
        assetRepository.flush();
        entityManager.clear();

        // Hidden from normal reads (@SQLRestriction).
        assertThat(assetRepository.findAll())
                .extracting(Asset::getId)
                .doesNotContain(id);

        // Row physically still present with is_deleted = true (native query bypasses the restriction).
        Number remaining = (Number) entityManager
                .createNativeQuery("SELECT count(*) FROM assets WHERE id = :id AND is_deleted = true")
                .setParameter("id", id)
                .getSingleResult();
        assertThat(remaining.longValue()).isEqualTo(1L);
    }

    @Test
    void c02_sqlRestriction_filtersFindById() {
        Asset asset = persistAsset("C02-Asset");
        Long id = asset.getId();

        assertThat(assetRepository.findById(id)).isPresent();

        assetRepository.deleteById(id);
        assetRepository.flush();
        entityManager.clear();

        // @SQLRestriction makes a soft-deleted asset unfetchable through normal finders.
        assertThat(assetRepository.findById(id)).isEmpty();
    }
}
