package com.example.eurostatcrud.exception;

public class EurostatDataAccessException extends RuntimeException {

    public EurostatDataAccessException(String message) {
        super(message);
    }

    public EurostatDataAccessException(String message, Throwable cause) {
        super(message, cause);
    }
}
