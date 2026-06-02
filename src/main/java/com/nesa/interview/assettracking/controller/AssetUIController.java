package com.nesa.interview.assettracking.controller;

import com.nesa.interview.assettracking.model.Asset;
import com.nesa.interview.assettracking.model.DecommissionRequest;
import com.nesa.interview.assettracking.repository.AssetRepository;
import com.nesa.interview.assettracking.service.DecommissionService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Set;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/assets-ui")
public class AssetUIController {

    private final AssetRepository assetRepository;
    private final DecommissionService decommissionService;

    public AssetUIController(AssetRepository assetRepository,
                            DecommissionService decommissionService) {
        this.assetRepository = assetRepository;
        this.decommissionService = decommissionService;
    }

    @GetMapping
    public String listAssets(Model model) {
        model.addAttribute("assets", assetRepository.findAll());
        model.addAttribute("newAsset", new Asset());
        // Derive "pending decommission" from open requests (one query) for the dashboard badge (FA-03).
        Set<Long> pendingAssetIds = decommissionService.pendingRequests().stream()
                .map(DecommissionRequest::getAssetId)
                .collect(Collectors.toSet());
        model.addAttribute("pendingAssetIds", pendingAssetIds);
        return "assets";
    }

    @PostMapping("/add")
    public String addAsset(@ModelAttribute Asset newAsset) {
        assetRepository.save(newAsset);
        return "redirect:/assets-ui";
    }

    @GetMapping("/edit/{id}")
    public String editAsset(@PathVariable Long id, Model model) {
        Asset asset = assetRepository.findById(id).orElseThrow();
        model.addAttribute("asset", asset);
        return "edit-asset";
    }

    // The old GET /assets-ui/delete/{id} soft-delete route is retired: deletion now goes through
    // the decommission-approval flow (DecommissionUIController). Removing it eliminates the
    // ungated UI path to soft-delete (ADR-004 / CLAUDE.md §5).
}
