package com.gpro.backend.service;

import com.gpro.backend.dto.RegistrationDto;
import com.gpro.backend.entity.Event;
import com.gpro.backend.entity.Registration;
import com.gpro.backend.entity.User;
import com.gpro.backend.repository.EventRepository;
import com.gpro.backend.repository.RegistrationRepository;
import com.gpro.backend.repository.UserRepository;
import com.gpro.backend.service.exception.BusinessRuleException;
import com.gpro.backend.service.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final UserRepository userRepository;
    private final EventRepository eventRepository;

    public List<RegistrationDto> findByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable avec l'id : " + userId));

        return registrationRepository.findByUser(user).stream()
                .map(RegistrationDto::fromEntity)
                .toList();
    }

    public List<RegistrationDto> findAll() {
        return registrationRepository.findAll().stream()
            .map(RegistrationDto::fromEntity)
            .toList();
    }
    public RegistrationDto findById(Long id) {
         Registration registration = registrationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inscription introuvable avec l'id : " + id));
         return RegistrationDto.fromEntity(registration);
    }

    @Transactional
    public RegistrationDto inscrire(Long userId, Long eventId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable avec l'id : " + userId));

        // Règle 0 : les administrateurs ne s'inscrivent pas aux événements
        if (user.getRole() == User.Role.ROLE_ADMIN) {
            throw new BusinessRuleException("Les administrateurs ne peuvent pas s'inscrire à un événement");
        }

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Événement introuvable avec l'id : " + eventId));

        // Règle 1 : pas de double inscription
        registrationRepository.findByUserAndEvent(user, event).ifPresent(r -> {
            throw new BusinessRuleException("L'utilisateur est déjà inscrit à cet événement");
        });

        // Règle 2 : vérifier qu'il reste des places
        long placesPrises = registrationRepository.countByEvent(event);
        if (placesPrises >= event.getCapaciteMax()) {
            throw new BusinessRuleException("Plus de places disponibles pour cet événement");
        }

        // Création de l'inscription
        Registration registration = new Registration();
        registration.setUser(user);
        registration.setEvent(event);
        registration.setDateInscription(LocalDateTime.now());
        registration.setStatut(Registration.Statut.CONFIRMEE);
        Registration saved = registrationRepository.save(registration);

        // Mise à jour du compteur de places restantes sur l'event
        event.setPlacesRestantes(event.getCapaciteMax() - (int) (placesPrises + 1));
        eventRepository.save(event);

        return RegistrationDto.fromEntity(saved);
    }

    @Transactional
    public void annuler(Long registrationId) {
        Registration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new ResourceNotFoundException("Inscription introuvable avec l'id : " + registrationId));

        registration.setStatut(Registration.Statut.ANNULEE);
        registrationRepository.save(registration);

        // Libérer une place sur l'événement
        Event event = registration.getEvent();
        event.setPlacesRestantes(event.getPlacesRestantes() + 1);
        eventRepository.save(event);
    }
}