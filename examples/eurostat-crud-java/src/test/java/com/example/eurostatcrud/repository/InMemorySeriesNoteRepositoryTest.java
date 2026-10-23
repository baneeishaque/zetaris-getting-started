package com.example.eurostatcrud.repository;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.Instant;

import org.junit.jupiter.api.Test;

import com.example.eurostatcrud.domain.SeriesNote;

class InMemorySeriesNoteRepositoryTest {

    private final InMemorySeriesNoteRepository repository = new InMemorySeriesNoteRepository();

    @Test
    void assignsIncreasingIdsAndFindsByPeriod() {
        SeriesNote first = repository.save(note(null, "2025-07"));
        SeriesNote second = repository.save(note(null, "2025-08"));

        assertThat(first.id()).isEqualTo(1L);
        assertThat(second.id()).isEqualTo(2L);
        assertThat(repository.findByPeriod("2025-07")).contains(first);
    }

    @Test
    void updateKeepsIdAndDeleteRemoves() {
        SeriesNote saved = repository.save(note(null, "2025-07"));
        SeriesNote updated = repository.save(new SeriesNote(
                saved.id(), "2025-08", "updated", null, 2, false, saved.createdAt(), Instant.now()));

        assertThat(updated.id()).isEqualTo(saved.id());
        assertThat(repository.findById(saved.id())).contains(updated);

        repository.deleteById(saved.id());

        assertThat(repository.findById(saved.id())).isEmpty();
    }

    @Test
    void clearResetsSequence() {
        repository.save(note(null, "2025-07"));
        repository.clear();

        assertThat(repository.count()).isZero();
        assertThat(repository.save(note(null, "2025-08")).id()).isEqualTo(1L);
    }

    private SeriesNote note(Long id, String period) {
        Instant now = Instant.now();
        return new SeriesNote(id, period, "text", "tag", 3, false, now, now);
    }
}
