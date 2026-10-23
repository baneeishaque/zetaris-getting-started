package com.example.eurostatcrud.web;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.model;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.view;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.example.eurostatcrud.domain.EurostatSeries;
import com.example.eurostatcrud.domain.PageResult;
import com.example.eurostatcrud.service.EurostatService;
import com.example.eurostatcrud.service.SeriesNoteService;

@ExtendWith(MockitoExtension.class)
class SeriesControllerTest {

    @Mock
    private EurostatService eurostatService;

    @Mock
    private SeriesNoteService noteService;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(new SeriesController(eurostatService, noteService))
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void listsSeries() throws Exception {
        PageResult<EurostatSeries> page = new PageResult<>(
                List.of(new EurostatSeries("2025-07", 5.0)), 0, 25, 1, 1, false, false);
        when(eurostatService.page(0, 25, null)).thenReturn(page);
        when(eurostatService.years()).thenReturn(List.of("2025"));

        mockMvc.perform(get("/series"))
                .andExpect(status().isOk())
                .andExpect(view().name("series/list"))
                .andExpect(model().attribute("page", page))
                .andExpect(model().attributeExists("years"));
    }

    @Test
    void rendersDetail() throws Exception {
        when(eurostatService.findByPeriod("2025-07"))
                .thenReturn(Optional.of(new EurostatSeries("2025-07", 5.0)));
        when(noteService.findByPeriod("2025-07")).thenReturn(Optional.empty());

        mockMvc.perform(get("/series/2025-07"))
                .andExpect(status().isOk())
                .andExpect(view().name("series/detail"))
                .andExpect(model().attributeExists("series"))
                .andExpect(model().attributeExists("notes"));
    }

    @Test
    void missingDetailReturnsNotFound() throws Exception {
        when(eurostatService.findByPeriod("1999-01")).thenReturn(Optional.empty());

        mockMvc.perform(get("/series/1999-01"))
                .andExpect(status().isNotFound());
    }
}
