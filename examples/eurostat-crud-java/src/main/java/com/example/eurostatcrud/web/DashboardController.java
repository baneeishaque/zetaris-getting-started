package com.example.eurostatcrud.web;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.example.eurostatcrud.service.EurostatService;
import com.example.eurostatcrud.service.SeriesNoteService;

@Controller
public class DashboardController {

    private final EurostatService eurostatService;
    private final SeriesNoteService noteService;

    public DashboardController(EurostatService eurostatService, SeriesNoteService noteService) {
        this.eurostatService = eurostatService;
        this.noteService = noteService;
    }

    @GetMapping("/")
    public String dashboard(Model model) {
        model.addAttribute("summary", eurostatService.summary());
        model.addAttribute("latest", eurostatService.listAll().stream().limit(8).toList());
        model.addAttribute("notes", noteService.listAll().stream().limit(5).toList());
        model.addAttribute("noteCount", noteService.count());
        return "index";
    }
}
