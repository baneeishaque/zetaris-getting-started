package com.example.eurostatcrud.repository;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.stereotype.Repository;

import com.example.eurostatcrud.domain.SeriesNote;

@Repository
public class InMemorySeriesNoteRepository implements SeriesNoteRepository {

    private final ConcurrentHashMap<Long, SeriesNote> notes = new ConcurrentHashMap<>();
    private final AtomicLong sequence = new AtomicLong();

    @Override
    public List<SeriesNote> findAll() {
        return List.copyOf(notes.values());
    }

    @Override
    public Optional<SeriesNote> findById(long id) {
        return Optional.ofNullable(notes.get(id));
    }

    @Override
    public Optional<SeriesNote> findByPeriod(String period) {
        return notes.values().stream()
                .filter(note -> note.period().equals(period))
                .findFirst();
    }

    @Override
    public boolean existsByPeriod(String period) {
        return findByPeriod(period).isPresent();
    }

    @Override
    public synchronized SeriesNote save(SeriesNote note) {
        long id = note.id() == null ? sequence.incrementAndGet() : note.id();
        SeriesNote saved = new SeriesNote(
                id,
                note.period(),
                note.noteText(),
                note.tag(),
                note.rating(),
                note.pinned(),
                note.createdAt(),
                note.updatedAt());
        notes.put(id, saved);
        return saved;
    }

    @Override
    public synchronized void deleteById(long id) {
        notes.remove(id);
    }

    @Override
    public long count() {
        return notes.size();
    }

    @Override
    public synchronized void clear() {
        notes.clear();
        sequence.set(0);
    }
}
