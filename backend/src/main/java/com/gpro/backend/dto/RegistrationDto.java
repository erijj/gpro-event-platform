package com.gpro.backend.dto;

import com.gpro.backend.entity.Registration;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class RegistrationDto {
    private Long id;
    private Long userId;
    private String userNomComplet;
    private Long eventId;
    private String eventTitre;
    private LocalDateTime dateInscription;
    private Registration.Statut statut;

    public static RegistrationDto fromEntity(Registration registration) {
        RegistrationDto dto = new RegistrationDto();
        dto.setId(registration.getId());
        dto.setUserId(registration.getUser().getId());
        dto.setUserNomComplet(registration.getUser().getPrenom() + " " + registration.getUser().getNom());
        dto.setEventId(registration.getEvent().getId());
        dto.setEventTitre(registration.getEvent().getTitre());
        dto.setDateInscription(registration.getDateInscription());
        dto.setStatut(registration.getStatut());
        return dto;
    }
}