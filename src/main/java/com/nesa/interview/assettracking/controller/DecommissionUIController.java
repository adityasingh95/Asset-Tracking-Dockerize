package com.nesa.interview.assettracking.controller;

import com.nesa.interview.assettracking.model.Asset;
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

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

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

    /** Approver view: all pending requests with their asset details (UI-04, FA-04). */
    @GetMapping("/assets-ui/decommissions")
    public String pending(Model model) {
        List<DecommissionRequest> pending = decommissionService.pendingRequests();
        Map<Long, Asset> assetsById = new LinkedHashMap<>();
        for (DecommissionRequest req : pending) {
            assetRepository.findById(req.getAssetId())
                    .ifPresent(a -> assetsById.put(req.getAssetId(), a));
        }
        model.addAttribute("pending", pending);
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
