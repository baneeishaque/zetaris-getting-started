package com.example.eurostatcrud.domain;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

public record SeriesNote(
        Long id,
        String period,
        String noteText,
        String tag,
        Integer rating,
        boolean pinned,
        Instant createdAt,
        Instant updatedAt) {

    private static final DateTimeFormatter DISPLAY =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm").withZone(ZoneId.systemDefault());

    public Long getId() {
        return id;
    }

    public String getPeriod() {
        return period;
    }

    public String getNoteText() {
        return noteText;
    }

    public String getTag() {
        return tag;
    }

    public Integer getRating() {
        return rating;
    }

    public boolean isPinned() {
        return pinned;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public String getCreatedAtDisplay() {
        return DISPLAY.format(createdAt);
    }

    public String getUpdatedAtDisplay() {
        return DISPLAY.format(updatedAt);
    }
}
