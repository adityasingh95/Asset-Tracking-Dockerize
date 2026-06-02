package com.nesa.interview.assettracking.controller;

import com.nesa.interview.assettracking.model.Asset;
import com.nesa.interview.assettracking.repository.AssetRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/assets-ui")
public class AssetUIController {

    private final AssetRepository assetRepository;

    public AssetUIController(AssetRepository assetRepository) {
        this.assetRepository = assetRepository;
    }

    @GetMapping
    public String listAssets(Model model) {
        model.addAttribute("assets", assetRepository.findAll());
        model.addAttribute("newAsset", new Asset());
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

    @GetMapping("/delete/{id}")
    public String deleteAsset(@PathVariable Long id) {
        assetRepository.deleteById(id);
        return "redirect:/assets-ui";
    }
}
