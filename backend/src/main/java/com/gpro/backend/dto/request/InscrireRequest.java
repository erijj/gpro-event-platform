package com.gpro.backend.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class InscrireRequest {

    @NotNull(message = "L'id de l'utilisateur est obligatoire")
    private Long userId;

    @NotNull(message = "L'id de l'événement est obligatoire")
    private Long eventId;
}