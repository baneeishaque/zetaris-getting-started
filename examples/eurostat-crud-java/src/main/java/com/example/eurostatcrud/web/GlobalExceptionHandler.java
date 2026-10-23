package com.example.eurostatcrud.web;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.ModelAndView;

import com.example.eurostatcrud.exception.EurostatDataAccessException;
import com.example.eurostatcrud.exception.NoteNotFoundException;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(EurostatDataAccessException.class)
    public ModelAndView handleEurostat(EurostatDataAccessException ex) {
        return error(HttpStatus.SERVICE_UNAVAILABLE, "Zetaris unavailable", ex.getMessage());
    }

    @ExceptionHandler(NoteNotFoundException.class)
    public ModelAndView handleNoteNotFound(NoteNotFoundException ex) {
        return error(HttpStatus.NOT_FOUND, "Note not found", ex.getMessage());
    }

    private ModelAndView error(HttpStatus status, String error, String message) {
        ModelAndView mav = new ModelAndView("error");
        mav.setStatus(status);
        mav.addObject("status", status.value());
        mav.addObject("error", error);
        mav.addObject("message", message);
        return mav;
    }
}
