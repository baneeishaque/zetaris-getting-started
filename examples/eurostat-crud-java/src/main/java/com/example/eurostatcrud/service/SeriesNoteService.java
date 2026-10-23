package com.example.eurostatcrud.service;

import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.eurostatcrud.domain.SeriesNote;
import com.example.eurostatcrud.exception.DuplicateNoteException;
import com.example.eurostatcrud.exception.NoteNotFoundException;
import com.example.eurostatcrud.exception.UnknownPeriodException;
import com.example.eurostatcrud.repository.SeriesNoteRepository;
import com.example.eurostatcrud.web.form.SeriesNoteForm;

@Service
public class SeriesNoteService {

    private final SeriesNoteRepository repository;
    private final EurostatService eurostatService;

    public SeriesNoteService(SeriesNoteRepository repository, EurostatService eurostatService) {
        this.repository = repository;
        this.eurostatService = eurostatService;
    }

    public List<SeriesNote> listAll() {
        return repository.findAll().stream()
                .sorted(Comparator.comparing(SeriesNote::pinned).reversed()
                        .thenComparing(SeriesNote::updatedAt, Comparator.reverseOrder()))
                .toList();
    }

    public SeriesNote get(long id) {
        return repository.findById(id)
                .orElseThrow(() -> new NoteNotFoundException("Note " + id + " was not found."));
    }

    public SeriesNote create(SeriesNoteForm form) {
        String period = normalizePeriod(form.getPeriod());
        validatePeriodExists(period);
        if (repository.existsByPeriod(period)) {
            throw new DuplicateNoteException("A note already exists for period " + period + ".");
        }
        Instant now = Instant.now();
        SeriesNote note = new SeriesNote(
                null,
                period,
                form.getNoteText().trim(),
                normalizeTag(form.getTag()),
                form.getRating(),
                form.isPinned(),
                now,
                now);
        return repository.save(note);
    }

    public SeriesNote update(long id, SeriesNoteForm form) {
        SeriesNote existing = get(id);
        String period = normalizePeriod(form.getPeriod());
        if (!period.equals(existing.period())) {
            validatePeriodExists(period);
            if (repository.existsByPeriod(period)) {
                throw new DuplicateNoteException("A note already exists for period " + period + ".");
            }
        }
        SeriesNote updated = new SeriesNote(
                existing.id(),
                period,
                form.getNoteText().trim(),
                normalizeTag(form.getTag()),
                form.getRating(),
                form.isPinned(),
                existing.createdAt(),
                Instant.now());
        return repository.save(updated);
    }

    public void delete(long id) {
        if (repository.findById(id).isEmpty()) {
            throw new NoteNotFoundException("Note " + id + " was not found.");
        }
        repository.deleteById(id);
    }

    public Optional<SeriesNote> findByPeriod(String period) {
        return repository.findByPeriod(period);
    }

    public long count() {
        return repository.count();
    }

    private String normalizePeriod(String raw) {
        if (raw == null || raw.isBlank()) {
            throw new UnknownPeriodException("Period is required.");
        }
        String period = raw.trim();
        if (!period.matches("^\\d{4}-(0[1-9]|1[0-2])$")) {
            throw new UnknownPeriodException("Period must be a valid month such as 2025-07.");
        }
        return period;
    }

    private void validatePeriodExists(String period) {
        if (!eurostatService.existsByPeriod(period)) {
            throw new UnknownPeriodException("No Eurostat observation exists for period " + period + ".");
        }
    }

    private String normalizeTag(String tag) {
        return (tag == null || tag.isBlank()) ? null : tag.trim();
    }
}
