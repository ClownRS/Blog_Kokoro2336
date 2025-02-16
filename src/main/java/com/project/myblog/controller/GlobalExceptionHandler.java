package com.project.myblog.controller;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public String exceptionHandler(HttpServletResponse resp, Exception e) throws Exception {
        return "redirect:/error.html?status=" + resp.getStatus();
    }
}
