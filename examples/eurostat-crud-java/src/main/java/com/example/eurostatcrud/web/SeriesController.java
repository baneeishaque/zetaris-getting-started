package com.example.eurostatcrud.web;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.server.ResponseStatusException;

import com.example.eurostatcrud.domain.EurostatSeries;
import com.example.eurostatcrud.domain.SeriesNote;
import com.example.eurostatcrud.service.EurostatService;
import com.example.eurostatcrud.service.SeriesNoteService;

@Controller
@RequestMapping("/series")
public class SeriesController {

    private final EurostatService eurostatService;
    private final SeriesNoteService noteService;

    public SeriesController(EurostatService eurostatService, SeriesNoteService noteService) {
        this.eurostatService = eurostatService;
        this.noteService = noteService;
    }

    @GetMapping
    public String list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "25") int size,
            @RequestParam(required = false) String year,
            Model model) {
        model.addAttribute("page", eurostatService.page(page, size, year));
        model.addAttribute("year", year);
        model.addAttribute("years", eurostatService.years());
        return "series/list";
    }

    @GetMapping("/{period}")
    public String detail(@PathVariable String period, Model model) {
        EurostatSeries series = eurostatService.findByPeriod(period)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "No Eurostat observation exists for period " + period + "."));
        List<SeriesNote> notes = noteService.findByPeriod(period)
                .map(note -> List.of(note))
                .orElseGet(() -> List.of());
        model.addAttribute("series", series);
        model.addAttribute("notes", notes);
        return "series/detail";
    }
}
