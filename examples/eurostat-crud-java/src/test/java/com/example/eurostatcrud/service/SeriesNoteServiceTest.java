package com.example.eurostatcrud.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.time.Instant;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.eurostatcrud.domain.SeriesNote;
import com.example.eurostatcrud.exception.DuplicateNoteException;
import com.example.eurostatcrud.exception.NoteNotFoundException;
import com.example.eurostatcrud.exception.UnknownPeriodException;
import com.example.eurostatcrud.repository.SeriesNoteRepository;
import com.example.eurostatcrud.web.form.SeriesNoteForm;

@ExtendWith(MockitoExtension.class)
class SeriesNoteServiceTest {

    @Mock
    private SeriesNoteRepository repository;

    @Mock
    private EurostatService eurostatService;

    @InjectMocks
    private SeriesNoteService service;

    @Test
    void createRejectsUnknownPeriod() {
        when(eurostatService.existsByPeriod("2025-07")).thenReturn(false);

        assertThatThrownBy(() -> service.create(form("2025-07", "text")))
                .isInstanceOf(UnknownPeriodException.class);
    }

    @Test
    void createRejectsDuplicatePeriod() {
        when(eurostatService.existsByPeriod("2025-07")).thenReturn(true);
        when(repository.existsByPeriod("2025-07")).thenReturn(true);

        assertThatThrownBy(() -> service.create(form("2025-07", "text")))
                .isInstanceOf(DuplicateNoteException.class);
    }

    @Test
    void createSavesNormalizedNote() {
        when(eurostatService.existsByPeriod("2025-07")).thenReturn(true);
        when(repository.existsByPeriod("2025-07")).thenReturn(false);
        when(repository.save(any(SeriesNote.class))).thenAnswer(invocation -> {
            SeriesNote note = invocation.getArgument(0);
            return new SeriesNote(
                    1L, note.period(), note.noteText(), note.tag(), note.rating(), note.pinned(),
                    note.createdAt(), note.updatedAt());
        });

        SeriesNoteForm form = form(" 2025-07 ", "  text  ");
        form.setTag("  latest ");
        form.setPinned(true);

        SeriesNote saved = service.create(form);

        assertThat(saved.id()).isEqualTo(1L);
        assertThat(saved.period()).isEqualTo("2025-07");
        assertThat(saved.noteText()).isEqualTo("text");
        assertThat(saved.tag()).isEqualTo("latest");
        assertThat(saved.pinned()).isTrue();
    }

    @Test
    void updateRejectsPeriodChangeToDuplicate() {
        SeriesNote existing = note(1L, "2025-07");
        when(repository.findById(1L)).thenReturn(Optional.of(existing));
        when(eurostatService.existsByPeriod("2025-08")).thenReturn(true);
        when(repository.existsByPeriod("2025-08")).thenReturn(true);

        assertThatThrownBy(() -> service.update(1L, form("2025-08", "text")))
                .isInstanceOf(DuplicateNoteException.class);
    }

    @Test
    void deleteMissingNoteThrows() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.delete(99L))
                .isInstanceOf(NoteNotFoundException.class);
    }

    private SeriesNoteForm form(String period, String noteText) {
        SeriesNoteForm form = new SeriesNoteForm();
        form.setPeriod(period);
        form.setNoteText(noteText);
        return form;
    }

    private SeriesNote note(Long id, String period) {
        Instant now = Instant.now();
        return new SeriesNote(id, period, "text", "tag", 3, false, now, now);
    }
}
