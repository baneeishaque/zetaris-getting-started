package com.example.eurostatcrud.web;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.flash;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.model;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.redirectedUrl;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.view;

import java.time.Instant;
import java.util.List;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;

import com.example.eurostatcrud.domain.SeriesNote;
import com.example.eurostatcrud.service.SeriesNoteService;

@ExtendWith(MockitoExtension.class)
class NoteControllerTest {

    @Mock
    private SeriesNoteService noteService;

    private MockMvc mockMvc;
    private LocalValidatorFactoryBean validator;

    @BeforeEach
    void setUp() {
        validator = new LocalValidatorFactoryBean();
        validator.afterPropertiesSet();
        mockMvc = MockMvcBuilders.standaloneSetup(new NoteController(noteService))
                .setControllerAdvice(new GlobalExceptionHandler())
                .setValidator(validator)
                .build();
    }

    @AfterEach
    void tearDown() {
        validator.close();
    }

    @Test
    void listsNotes() throws Exception {
        when(noteService.listAll()).thenReturn(List.of(note(1L, "2025-07")));

        mockMvc.perform(get("/notes"))
                .andExpect(status().isOk())
                .andExpect(view().name("notes/list"))
                .andExpect(model().attributeExists("notes"));
    }

    @Test
    void rejectsInvalidPeriod() throws Exception {
        mockMvc.perform(post("/notes")
                        .param("period", "2025-13")
                        .param("noteText", "text"))
                .andExpect(status().isOk())
                .andExpect(view().name("notes/form"))
                .andExpect(model().attributeHasFieldErrors("form", "period"));

        verifyNoInteractions(noteService);
    }

    @Test
    void rejectsBlankNoteText() throws Exception {
        mockMvc.perform(post("/notes")
                        .param("period", "2025-07")
                        .param("noteText", " "))
                .andExpect(status().isOk())
                .andExpect(view().name("notes/form"))
                .andExpect(model().attributeHasFieldErrors("form", "noteText"));

        verifyNoInteractions(noteService);
    }

    @Test
    void createsValidNote() throws Exception {
        when(noteService.create(any())).thenReturn(note(1L, "2025-07"));

        mockMvc.perform(post("/notes")
                        .param("period", "2025-07")
                        .param("noteText", "text")
                        .param("tag", "latest")
                        .param("rating", "5")
                        .param("pinned", "true"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/notes"))
                .andExpect(flash().attributeExists("message"));
    }

    @Test
    void rendersEditForm() throws Exception {
        when(noteService.get(1L)).thenReturn(note(1L, "2025-07"));

        mockMvc.perform(get("/notes/1/edit"))
                .andExpect(status().isOk())
                .andExpect(view().name("notes/form"))
                .andExpect(model().attribute("isEdit", true))
                .andExpect(model().attribute("formAction", "/notes/1"))
                .andExpect(model().attributeExists("form"));
    }

    @Test
    void updatesValidNote() throws Exception {
        when(noteService.update(any(Long.class), any())).thenReturn(note(1L, "2025-07"));

        mockMvc.perform(post("/notes/1")
                        .param("period", "2025-07")
                        .param("noteText", "updated")
                        .param("rating", "3"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/notes"))
                .andExpect(flash().attributeExists("message"));
    }

    @Test
    void deletesNote() throws Exception {
        doNothing().when(noteService).delete(1L);

        mockMvc.perform(post("/notes/1/delete"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/notes"))
                .andExpect(flash().attributeExists("message"));
    }

    private SeriesNote note(Long id, String period) {
        Instant now = Instant.now();
        return new SeriesNote(id, period, "text", "tag", 3, false, now, now);
    }
}
