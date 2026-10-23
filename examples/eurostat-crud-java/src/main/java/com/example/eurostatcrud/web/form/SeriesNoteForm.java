package com.example.eurostatcrud.web.form;

import com.example.eurostatcrud.domain.SeriesNote;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class SeriesNoteForm {

    private Long id;

    @NotBlank(message = "Period is required.")
    @Pattern(regexp = "^\\d{4}-(0[1-9]|1[0-2])$", message = "Period must be a valid month such as 2025-07.")
    private String period;

    @NotBlank(message = "Note text is required.")
    @Size(max = 2000, message = "Note text must be at most 2000 characters.")
    private String noteText;

    @Size(max = 32, message = "Tag must be at most 32 characters.")
    private String tag;

    @Min(value = 1, message = "Rating must be between 1 and 5.")
    @Max(value = 5, message = "Rating must be between 1 and 5.")
    private Integer rating;

    private boolean pinned;

    public static SeriesNoteForm from(SeriesNote note) {
        SeriesNoteForm form = new SeriesNoteForm();
        form.setId(note.id());
        form.setPeriod(note.period());
        form.setNoteText(note.noteText());
        form.setTag(note.tag());
        form.setRating(note.rating());
        form.setPinned(note.pinned());
        return form;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPeriod() {
        return period;
    }

    public void setPeriod(String period) {
        this.period = period;
    }

    public String getNoteText() {
        return noteText;
    }

    public void setNoteText(String noteText) {
        this.noteText = noteText;
    }

    public String getTag() {
        return tag;
    }

    public void setTag(String tag) {
        this.tag = tag;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public boolean isPinned() {
        return pinned;
    }

    public void setPinned(boolean pinned) {
        this.pinned = pinned;
    }
}
