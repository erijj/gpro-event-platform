/**
 * Test unitaire du service d'inscription aux événements.
 * 
 * Ce test vérifie le comportement de la méthode inscrire() du service RegistrationService.
 * Il teste les cas suivants :
 * - Inscription réussie
 * - Inscription refusée pour cause de doublon
 * - Inscription refusée pour cause de capacité maximale atteinte
 */
package com.gpro.backend.service;

import com.gpro.backend.dto.RegistrationDto;
import com.gpro.backend.entity.Category;
import com.gpro.backend.entity.Event;
import com.gpro.backend.entity.User;
import com.gpro.backend.repository.CategoryRepository;
import com.gpro.backend.repository.EventRepository;
import com.gpro.backend.repository.UserRepository;
import com.gpro.backend.service.exception.BusinessRuleException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
@Transactional // rollback automatique après chaque test, comme pour @DataJpaTest
class RegistrationServiceTest {

    @Autowired private RegistrationService registrationService;
    @Autowired private UserRepository userRepository;
    @Autowired private EventRepository eventRepository;
    @Autowired private CategoryRepository categoryRepository;

    private User user;
    private Event event;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setNom("Test");
        user.setPrenom("Service");
        user.setEmail("service.test." + System.nanoTime() + "@junit.com");
        user.setPassword("pwd");
        user.setRole(User.Role.ROLE_USER);
        user.setCreatedAt(LocalDateTime.now());
        userRepository.save(user);

        Category category = new Category();
        category.setLibelle("CatServiceTest" + System.nanoTime());
        categoryRepository.save(category);

        event = new Event();
        event.setTitre("Event Service Test");
        event.setDescription("desc");
        event.setDateHeure(LocalDateTime.now().plusDays(3));
        event.setLieu("Sousse");
        event.setCapaciteMax(1); // capacité volontairement petite pour tester la limite
        event.setPlacesRestantes(1);
        event.setStatut("PLANIFIE");
        event.setCategory(category);
        eventRepository.save(event);
    }

    @Test
    void testInscrire_succes() {
        RegistrationDto dto = registrationService.inscrire(user.getId(), event.getId());
        assertThat(dto.getStatut().name()).isEqualTo("CONFIRMEE");
    }

    @Test
    void testInscrire_doublonRefuse() {
        registrationService.inscrire(user.getId(), event.getId());

        assertThatThrownBy(() -> registrationService.inscrire(user.getId(), event.getId()))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("déjà inscrit");
    }

    @Test
    void testInscrire_capaciteMaxRefuse() {
        // 1ère inscription : passe (capacité = 1)
        registrationService.inscrire(user.getId(), event.getId());

        // 2e utilisateur : doit être refusé, plus de places
        User user2 = new User();
        user2.setNom("Test2");
        user2.setPrenom("Service2");
        user2.setEmail("service.test2." + System.nanoTime() + "@junit.com");
        user2.setPassword("pwd");
        user2.setRole(User.Role.ROLE_USER);
        user2.setCreatedAt(LocalDateTime.now());
        userRepository.save(user2);

        assertThatThrownBy(() -> registrationService.inscrire(user2.getId(), event.getId()))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("Plus de places");
    }
}