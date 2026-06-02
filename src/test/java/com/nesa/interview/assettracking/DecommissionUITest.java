package com.nesa.interview.assettracking;

import com.nesa.interview.assettracking.model.Asset;
import com.nesa.interview.assettracking.model.DecommissionRequest;
import com.nesa.interview.assettracking.model.DecommissionStatus;
import com.nesa.interview.assettracking.repository.AssetRepository;
import com.nesa.interview.assettracking.repository.DecommissionRequestRepository;
import com.nesa.interview.assettracking.service.DecommissionService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.redirectedUrl;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Phase 5 UI wiring, incl. N-08 (dashboard marks an asset with a pending request).
 */
@SpringBootTest
@AutoConfigureMockMvc
class DecommissionUITest extends AbstractPostgresTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private AssetRepository assetRepository;
    @Autowired private DecommissionRequestRepository requestRepository;
    @Autowired private DecommissionService decommissionService;

    private Asset newAsset(String name) {
        Asset a = new Asset();
        a.setName(name);
        a.setType("Laptop");
        a.setStatus("Active");
        return assetRepository.saveAndFlush(a);
    }

    @Test
    @WithMockUser(username = "admin")
    void n08_dashboard_marksAssetWithPendingRequest() throws Exception {
        Asset pendingAsset = newAsset("UI-Pending");
        Asset plainAsset = newAsset("UI-Plain");

        // Create a pending request for the first asset via the UI endpoint.
        mockMvc.perform(post("/assets-ui/" + pendingAsset.getId() + "/request-decommission")
                        .param("reason", "retire it"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/assets-ui"));

        String html = mockMvc.perform(get("/assets-ui"))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        // Badge shown; the non-pending asset still offers a request form.
        assertThat(html).contains("Pending decommission");
        assertThat(html).contains("/assets-ui/" + plainAsset.getId() + "/request-decommission");
        // The pending asset must NOT offer a second request form (FA-07 / no duplicate).
        assertThat(html).doesNotContain("/assets-ui/" + pendingAsset.getId() + "/request-decommission");
    }

    @Test
    @WithMockUser(username = "admin")
    void requestEndpoint_blankReason_showsErrorFlash_andCreatesNoRequest() throws Exception {
        Asset asset = newAsset("UI-Blank");

        mockMvc.perform(post("/assets-ui/" + asset.getId() + "/request-decommission")
                        .param("reason", "   "))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/assets-ui"));

        assertThat(requestRepository.findByAssetIdOrderByRequestedAtDesc(asset.getId())).isEmpty();
    }

    @Test
    @WithMockUser(username = "approver")
    void approveEndpoint_softDeletesAsset() throws Exception {
        Asset asset = newAsset("UI-Approve");
        DecommissionRequest req = new DecommissionRequest();
        req.setAssetId(asset.getId());
        req.setStatus(DecommissionStatus.PENDING);
        req.setReason("retire");
        req.setRequestedBy("admin");
        req.setRequestedAt(java.time.Instant.now());
        req = requestRepository.saveAndFlush(req);

        mockMvc.perform(post("/assets-ui/decommissions/" + req.getId() + "/approve")
                        .param("comment", "ok"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/assets-ui/decommissions"));

        assertThat(assetRepository.findById(asset.getId())).isEmpty();   // soft-deleted
        assertThat(requestRepository.findById(req.getId()).orElseThrow().getStatus())
                .isEqualTo(DecommissionStatus.APPROVED);
    }

    @Test
    @WithMockUser(username = "admin")
    void approverView_loads() throws Exception {
        mockMvc.perform(get("/assets-ui/decommissions"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "admin")
    void restDelete_isDisabled_returns405_andDoesNotSoftDelete() throws Exception {
        Asset asset = newAsset("NoRestDelete");

        mockMvc.perform(delete("/assets/" + asset.getId()))
                .andExpect(status().isMethodNotAllowed());

        // Still active — the ungated REST delete path no longer soft-deletes (ADR-004).
        assertThat(assetRepository.findById(asset.getId())).isPresent();
    }

    @Test
    @WithMockUser(username = "admin")
    void decisionHistory_showsApprovedRequest_forSoftDeletedAsset() throws Exception {
        Asset asset = newAsset("HistAsset");
        DecommissionRequest req = decommissionService.request(asset.getId(), "retire", "alice");
        decommissionService.approve(req.getId(), "bob", "approved");   // asset now soft-deleted

        String html = mockMvc.perform(get("/assets-ui/decommissions"))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        // FA-09: the approved (now soft-deleted) asset's name is still shown in history.
        assertThat(html).contains("Decision history");
        assertThat(html).contains("HistAsset");
        assertThat(html).contains("APPROVED");
    }
}
