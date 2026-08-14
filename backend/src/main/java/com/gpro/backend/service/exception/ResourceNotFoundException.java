/**
 * Exception levée lorsqu'une ressource n'est pas trouvée.
 */
package com.gpro.backend.service.exception;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}