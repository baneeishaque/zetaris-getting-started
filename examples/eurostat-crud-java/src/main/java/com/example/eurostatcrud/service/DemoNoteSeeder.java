package com.example.eurostatcrud.service;

import java.time.Instant;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import com.example.eurostatcrud.domain.SeriesNote;
import com.example.eurostatcrud.repository.SeriesNoteRepository;

@Component
public class DemoNoteSeeder implements ApplicationRunner {

    private final SeriesNoteRepository repository;
    private final boolean seedNotes;

    public DemoNoteSeeder(
            SeriesNoteRepository repository,
            @Value("${app.demo.seed-notes:true}") boolean seedNotes) {
        this.repository = repository;
        this.seedNotes = seedNotes;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (!seedNotes || repository.count() > 0) {
            return;
        }
        Instant now = Instant.now();
        repository.save(new SeriesNote(
                null, "1997-01", "First observation in the series.", "history", 4, false,
                now.minusSeconds(3), now.minusSeconds(3)));
        repository.save(new SeriesNote(
                null, "2024-01", "Mid-series comparison point.", "comparison", 3, false,
                now.minusSeconds(2), now.minusSeconds(2)));
        repository.save(new SeriesNote(
                null, "2025-07", "Latest observation in the demo dataset.", "latest", 5, true,
                now.minusSeconds(1), now.minusSeconds(1)));
    }
}
