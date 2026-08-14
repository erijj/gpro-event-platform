package com.gpro.backend.dto.request;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CreateEventRequest {

    @NotBlank(message = "Le titre est obligatoire")
    private String titre;

    private String description;

    @NotNull(message = "La date/heure est obligatoire")
    @Future(message = "La date de l'événement doit être dans le futur")
    private LocalDateTime dateHeure;

    @NotBlank(message = "Le lieu est obligatoire")
    private String lieu;

    @NotNull(message = "La capacité maximale est obligatoire")
    @Positive(message = "La capacité doit être positive")
    private Integer capaciteMax;

    private String image;

    @NotNull(message = "La catégorie est obligatoire")
    private Long categoryId;
}