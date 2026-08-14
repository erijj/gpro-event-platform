package com.gpro.backend.dto;

import com.gpro.backend.entity.Event;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class EventDto {
    private Long id;
    private String titre;
    private String description;
    private LocalDateTime dateHeure;
    private String lieu;
    private Integer capaciteMax;
    private Integer placesRestantes;
    private String image;
    private String statut;
    private CategoryDto category;

    public static EventDto fromEntity(Event event) {
        EventDto dto = new EventDto();
        dto.setId(event.getId());
        dto.setTitre(event.getTitre());
        dto.setDescription(event.getDescription());
        dto.setDateHeure(event.getDateHeure());
        dto.setLieu(event.getLieu());
        dto.setCapaciteMax(event.getCapaciteMax());
        dto.setPlacesRestantes(event.getPlacesRestantes());
        dto.setImage(event.getImage());
        dto.setStatut(event.getStatut());
        dto.setCategory(CategoryDto.fromEntity(event.getCategory()));
        return dto;
    }
}