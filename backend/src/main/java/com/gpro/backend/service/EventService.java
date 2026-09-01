package com.gpro.backend.service;

import com.gpro.backend.dto.EventDto;
import com.gpro.backend.entity.Category;
import com.gpro.backend.entity.Event;
import com.gpro.backend.repository.CategoryRepository;
import com.gpro.backend.repository.EventRepository;
import com.gpro.backend.service.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EventService {

    private final EventRepository eventRepository;
    private final CategoryRepository categoryRepository;

    public List<EventDto> findAll() {
        return eventRepository.findAll().stream()
                .map(EventDto::fromEntity)
                .toList();
    }

    public List<EventDto> findUpcoming() {
        return eventRepository.findByDateHeureAfter(LocalDateTime.now()).stream()
                .map(EventDto::fromEntity)
                .toList();
    }

    public EventDto findById(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Événement introuvable avec l'id : " + id));
        return EventDto.fromEntity(event);
    }

    @Transactional
    public EventDto create(String titre, String description, LocalDateTime dateHeure,
                            String lieu, Integer capaciteMax, String image, Long categoryId) {

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Catégorie introuvable avec l'id : " + categoryId));

        Event event = new Event();
        event.setTitre(titre);
        event.setDescription(description);
        event.setDateHeure(dateHeure);
        event.setLieu(lieu);
        event.setCapaciteMax(capaciteMax);
        event.setPlacesRestantes(capaciteMax); // à la création, toutes les places sont disponibles
        event.setImage(image);
        event.setStatut("PLANIFIE");
        event.setCategory(category);

        Event saved = eventRepository.save(event);
        return EventDto.fromEntity(saved);
    }

@Transactional
public EventDto update(Long id, String titre, String description, LocalDateTime dateHeure,
                        String lieu, Integer capaciteMax, String image, Long categoryId, String statut) {

    Event event = eventRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Événement introuvable avec l'id : " + id));

    Category category = categoryRepository.findById(categoryId)
            .orElseThrow(() -> new ResourceNotFoundException("Catégorie introuvable avec l'id : " + categoryId));

    event.setTitre(titre);
    event.setDescription(description);
    event.setDateHeure(dateHeure);
    event.setLieu(lieu);
    event.setImage(image);
    event.setCategory(category);

    if (statut != null && !statut.isBlank()) {
        event.setStatut(statut);
    }

    // Si la capacité max change, on ajuste placesRestantes en conséquence
    // pour ne pas perdre les inscriptions déjà comptabilisées
    if (!capaciteMax.equals(event.getCapaciteMax())) {
        int placesDejaPrises = event.getCapaciteMax() - event.getPlacesRestantes();
        event.setCapaciteMax(capaciteMax);
        event.setPlacesRestantes(Math.max(0, capaciteMax - placesDejaPrises));
    }

    Event updated = eventRepository.save(event);
    return EventDto.fromEntity(updated);
}

@Transactional
public void delete(Long id) {
    Event event = eventRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Événement introuvable avec l'id : " + id));
    eventRepository.delete(event);
}
}