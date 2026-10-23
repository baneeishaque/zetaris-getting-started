package com.example.eurostatcrud.web;

import org.springframework.beans.propertyeditors.CustomNumberEditor;
import org.springframework.beans.propertyeditors.StringTrimmerEditor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.example.eurostatcrud.domain.SeriesNote;
import com.example.eurostatcrud.exception.DuplicateNoteException;
import com.example.eurostatcrud.exception.NoteNotFoundException;
import com.example.eurostatcrud.exception.UnknownPeriodException;
import com.example.eurostatcrud.service.SeriesNoteService;
import com.example.eurostatcrud.web.form.SeriesNoteForm;

import jakarta.validation.Valid;

@Controller
@RequestMapping("/notes")
public class NoteController {

    private final SeriesNoteService noteService;

    public NoteController(SeriesNoteService noteService) {
        this.noteService = noteService;
    }

    @InitBinder
    public void initBinder(WebDataBinder binder) {
        binder.registerCustomEditor(String.class, new StringTrimmerEditor(true));
        binder.registerCustomEditor(Integer.class, new CustomNumberEditor(Integer.class, true));
    }

    @GetMapping
    public String list(Model model) {
        model.addAttribute("notes", noteService.listAll());
        return "notes/list";
    }

    @GetMapping("/new")
    public String createForm(@RequestParam(required = false) String period, Model model) {
        SeriesNoteForm form = new SeriesNoteForm();
        if (period != null && !period.isBlank()) {
            form.setPeriod(period);
        }
        model.addAttribute("form", form);
        addFormModel(model, false, null);
        return "notes/form";
    }

    @PostMapping
    public String create(
            @Valid @ModelAttribute("form") SeriesNoteForm form,
            BindingResult bindingResult,
            Model model,
            RedirectAttributes redirectAttributes) {
        if (bindingResult.hasErrors()) {
            addFormModel(model, false, null);
            return "notes/form";
        }
        try {
            SeriesNote note = noteService.create(form);
            redirectAttributes.addFlashAttribute("message", "Note created for " + note.period() + ".");
            return "redirect:/notes";
        } catch (DuplicateNoteException | UnknownPeriodException ex) {
            bindingResult.rejectValue("period", "note.period", ex.getMessage());
            addFormModel(model, false, null);
            return "notes/form";
        }
    }

    @GetMapping("/{id}/edit")
    public String editForm(@PathVariable long id, Model model) {
        SeriesNote note = noteService.get(id);
        model.addAttribute("form", SeriesNoteForm.from(note));
        addFormModel(model, true, id);
        return "notes/form";
    }

    @PostMapping("/{id}")
    public String update(
            @PathVariable long id,
            @Valid @ModelAttribute("form") SeriesNoteForm form,
            BindingResult bindingResult,
            Model model,
            RedirectAttributes redirectAttributes) {
        if (bindingResult.hasErrors()) {
            addFormModel(model, true, id);
            return "notes/form";
        }
        try {
            noteService.update(id, form);
            redirectAttributes.addFlashAttribute("message", "Note updated.");
            return "redirect:/notes";
        } catch (DuplicateNoteException | UnknownPeriodException ex) {
            bindingResult.rejectValue("period", "note.period", ex.getMessage());
            addFormModel(model, true, id);
            return "notes/form";
        }
    }

    @PostMapping("/{id}/delete")
    public String delete(@PathVariable long id, RedirectAttributes redirectAttributes) {
        try {
            noteService.delete(id);
            redirectAttributes.addFlashAttribute("message", "Note deleted.");
        } catch (NoteNotFoundException ex) {
            redirectAttributes.addFlashAttribute("error", ex.getMessage());
        }
        return "redirect:/notes";
    }

    private void addFormModel(Model model, boolean isEdit, Long id) {
        model.addAttribute("isEdit", isEdit);
        model.addAttribute("noteId", id);
        model.addAttribute("formAction", isEdit ? "/notes/" + id : "/notes");
    }
}
