package com.nesa.interview.assettracking;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.redirectedUrlPattern;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * C-03, C-04, C-05: lock in the existing web-layer behaviour (partial PATCH,
 * create+list, auth gate) against the unchanged code.
 */
@SpringBootTest
@AutoConfigureMockMvc
class AssetEndpointCharacterizationTest extends AbstractPostgresTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private long createAsset(String name, String type, String status) throws Exception {
        String body = objectMapper.writeValueAsString(Map.of("name", name, "type", type, "status", status));
        MvcResult result = mockMvc.perform(post("/assets")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andReturn();
        return objectMapper.readTree(result.getResponse().getContentAsString()).get("id").asLong();
    }

    @Test
    @WithMockUser(username = "admin")
    void c03_patch_partialUpdate_changesOnlyProvidedField() throws Exception {
        long id = createAsset("C03-Asset", "Server", "Active");

        mockMvc.perform(patch("/assets/" + id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\":\"Retired\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("Retired"))
                .andExpect(jsonPath("$.name").value("C03-Asset"))   // untouched
                .andExpect(jsonPath("$.type").value("Server"));     // untouched
    }

    @Test
    @WithMockUser(username = "admin")
    void c04_create_thenList_includesNewAsset() throws Exception {
        long id = createAsset("C04-Asset", "Monitor", "Active");

        mockMvc.perform(get("/assets"))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("C04-Asset")))
                .andExpect(content().string(containsString("\"id\":" + id)));
    }

    @Test
    void c05_authGate_unauthenticatedDashboardRedirectsToLogin() throws Exception {
        mockMvc.perform(get("/assets-ui"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrlPattern("**/auth/login"));
    }

    @Test
    @WithMockUser(username = "admin")
    void c05_authGate_authenticatedDashboardSucceeds() throws Exception {
        MvcResult result = mockMvc.perform(get("/assets-ui"))
                .andExpect(status().isOk())
                .andReturn();
        assertThat(result.getResponse().getContentAsString()).contains("Asset Tracking Dashboard");
    }
}
