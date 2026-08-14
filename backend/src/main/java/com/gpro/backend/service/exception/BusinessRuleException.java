/**
 * Exception levée lorsqu'une règle métier est violée.
 */
package com.gpro.backend.service.exception;

public class BusinessRuleException extends RuntimeException {
    public BusinessRuleException(String message) {
        super(message);
    }
}