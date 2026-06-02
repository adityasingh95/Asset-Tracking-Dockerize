package com.nesa.interview.assettracking.controller;

import com.nesa.interview.assettracking.model.DecommissionRequest;
import com.nesa.interview.assettracking.repository.AssetRepository;
import com.nesa.interview.assettracking.service.DecommissionService;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * UI for the decommission-approval workflow: requesting decommission from the dashboard,
 * and the approver view (list pending requests, approve/reject with a comment).
 *
 * <p>CSRF is disabled app-wide, so these POST forms need no token (CLAUDE.md §7).
 * The requester/approver identity comes from the Spring Security principal.
 */
@Controller
public class DecommissionUIController {

    private final DecommissionService decommissionService;
    private final AssetRepository assetRepository;

    public DecommissionUIController(DecommissionService decommissionService,
                                    AssetRepository assetRepository) {
        this.decommissionService = decommissionService;
        this.assetRepository = assetRepository;
    }

    /** Dashboard "Request Decommission" action (UI-01/02, FA-01/02). */
    @PostMapping("/assets-ui/{assetId}/request-decommission")
    public String requestDecommission(@PathVariable Long assetId,
                                      @RequestParam(required = false) String reason,
                                      Authentication auth,
                                      RedirectAttributes ra) {
        try {
            decommissionService.request(assetId, reason, auth.getName());
            ra.addFlashAttribute("message", "Decommission request created for asset " + assetId + ".");
        } catch (IllegalArgumentException e) {
            ra.addFlashAttribute("error", e.getMessage());
        }
        return "redirect:/assets-ui";
    }

    /**
     * Approver view: pending requests to act on (UI-04, FA-04) plus the decision history
     * (FA-09). Asset labels are resolved including soft-deleted assets so approved requests
     * still show the asset they retired.
     */
    @GetMapping("/assets-ui/decommissions")
    public String pending(Model model) {
        List<DecommissionRequest> pending = decommissionService.pendingRequests();
        List<DecommissionRequest> history = decommissionService.decisionHistory();

        // Resolve asset name/type for every referenced asset, including soft-deleted ones (FA-09).
        Set<Long> assetIds = new LinkedHashSet<>();
        pending.forEach(r -> assetIds.add(r.getAssetId()));
        history.forEach(r -> assetIds.add(r.getAssetId()));
        Map<Long, AssetRepository.AssetSummary> assetsById = new HashMap<>();
        if (!assetIds.isEmpty()) {
            for (AssetRepository.AssetSummary s : assetRepository.findSummariesIncludingDeleted(assetIds)) {
                assetsById.put(s.getId(), s);
            }
        }

        model.addAttribute("pending", pending);
        model.addAttribute("history", history);
        model.addAttribute("assetsById", assetsById);
        return "decommissions";
    }

    /** Approve a pending request → soft-delete the asset (FA-05, UI-05). */
    @PostMapping("/assets-ui/decommissions/{requestId}/approve")
    public String approve(@PathVariable Long requestId,
                          @RequestParam(required = false) String comment,
                          Authentication auth,
                          RedirectAttributes ra) {
        try {
            decommissionService.approve(requestId, auth.getName(), comment);
            ra.addFlashAttribute("message", "Request " + requestId + " approved; asset decommissioned.");
        } catch (IllegalArgumentException e) {
            ra.addFlashAttribute("error", e.getMessage());
        }
        return "redirect:/assets-ui/decommissions";
    }

    /** Reject a pending request → asset stays active (FA-06, UI-05). */
    @PostMapping("/assets-ui/decommissions/{requestId}/reject")
    public String reject(@PathVariable Long requestId,
                         @RequestParam(required = false) String comment,
                         Authentication auth,
                         RedirectAttributes ra) {
        try {
            decommissionService.reject(requestId, auth.getName(), comment);
            ra.addFlashAttribute("message", "Request " + requestId + " rejected; asset kept active.");
        } catch (IllegalArgumentException e) {
            ra.addFlashAttribute("error", e.getMessage());
        }
        return "redirect:/assets-ui/decommissions";
    }
}
