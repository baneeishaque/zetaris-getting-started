package com.example.eurostatcrud;

import static org.hamcrest.Matchers.containsString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import com.example.eurostatcrud.domain.EurostatSeries;
import com.example.eurostatcrud.repository.EurostatRepository;

@SpringBootTest
@ActiveProfiles("test")
class EurostatCrudApplicationTests {

    @Autowired
    private WebApplicationContext context;

    @MockitoBean
    private EurostatRepository eurostatRepository;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(context).build();
    }

    @Test
    void dashboardRenders() throws Exception {
        when(eurostatRepository.findAll())
                .thenReturn(List.of(new EurostatSeries("2025-07", 5.0)));

        mockMvc.perform(get("/"))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("Eurostat unemployment, Poland")))
                .andExpect(content().string(containsString("2025-07")));
    }

    @Test
    void seriesAndNotePagesRender() throws Exception {
        when(eurostatRepository.findAll())
                .thenReturn(List.of(new EurostatSeries("2025-07", 5.0)));
        when(eurostatRepository.findByPeriod("2025-07"))
                .thenReturn(Optional.of(new EurostatSeries("2025-07", 5.0)));

        mockMvc.perform(get("/series")).andExpect(status().isOk());
        mockMvc.perform(get("/series/2025-07")).andExpect(status().isOk());
        mockMvc.perform(get("/notes")).andExpect(status().isOk());
        mockMvc.perform(get("/notes/new")).andExpect(status().isOk());
    }
}
