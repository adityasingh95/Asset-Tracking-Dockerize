package com.nesa.interview.assettracking.controller;

import com.nesa.interview.assettracking.model.Asset;
import com.nesa.interview.assettracking.repository.AssetRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/assets")
public class AssetController {

    private final AssetRepository assetRepository;

    public AssetController(AssetRepository assetRepository) {
        this.assetRepository = assetRepository;
    }

    @GetMapping
    public List<Asset> getAllAssets() {
        return assetRepository.findAll();
    }

    @PostMapping
    public Asset createAsset(@RequestBody Asset asset) {
        return assetRepository.save(asset);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Asset> getAsset(@PathVariable Long id) {
        return assetRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Asset> patchAsset(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
        return assetRepository.findById(id)
                .map(asset -> {
                    if (updates.containsKey("name")) {
                        asset.setName((String) updates.get("name"));
                    }
                    if (updates.containsKey("type")) {
                        asset.setType((String) updates.get("type"));
                    }
                    if (updates.containsKey("status")) {
                        asset.setStatus((String) updates.get("status"));
                    }
                    return ResponseEntity.ok(assetRepository.save(asset));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Direct deletion is disabled (ADR-004). Decommissioning an asset must go through the
     * decommission-approval flow, so this previously-ungated soft-delete path now returns
     * 405 instead of mutating data. The endpoint is kept (not removed) to preserve the URL
     * contract for any external caller.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAsset(@PathVariable Long id) {
        return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED)
                .body("Direct deletion is disabled. Request decommission via "
                        + "POST /assets-ui/{id}/request-decommission and have it approved.");
    }
}
