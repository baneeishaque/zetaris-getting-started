package com.example.eurostatcrud.repository;

import java.util.List;
import java.util.Optional;

import com.example.eurostatcrud.domain.SeriesNote;

public interface SeriesNoteRepository {

    List<SeriesNote> findAll();

    Optional<SeriesNote> findById(long id);

    Optional<SeriesNote> findByPeriod(String period);

    boolean existsByPeriod(String period);

    SeriesNote save(SeriesNote note);

    void deleteById(long id);

    long count();

    void clear();
}
