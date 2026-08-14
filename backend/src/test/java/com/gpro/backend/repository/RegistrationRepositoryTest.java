/**
 * testFindByUserAndEvent_existant() 
 But : Vérifier qu'on peut retrouver une inscription spécifique en donnant son utilisateur et son événement .Vérification : L'inscription doit être trouvée et son statut doit être "CONFIRMEE"
 * testCountByEvent() 
 But : Vérifier que le comptage des inscriptions pour un événement fonctionne
 * testFindByUser() 
 But : Vérifier qu'on peut retrouver toutes les inscriptions d'un utilisateur donné

*/

/*package com.gpro.backend.repository;

import com.gpro.backend.entity.Event;
import com.gpro.backend.entity.Registration;
import com.gpro.backend.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class RegistrationRepositoryTest {

    @Autowired
    private RegistrationRepository registrationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EventRepository eventRepository;

    @Test
    void testFindByUserAndEvent_existant() {
        User user = userRepository.findById(2L).orElseThrow(); 
        Event event = eventRepository.findById(1L).orElseThrow(); 

        Optional<Registration> registration = registrationRepository.findByUserAndEvent(user, event);
        assertThat(registration).isPresent();
    }

    @Test
    void testCountByEvent() {
        Event event = eventRepository.findById(1L).orElseThrow(); 
        long count = registrationRepository.countByEvent(event);
        assertThat(count).isGreaterThan(0);
    }

    @Test
    void testFindByUser() {
        User user = userRepository.findById(2L).orElseThrow(); 
        List<Registration> registrations = registrationRepository.findByUser(user);
        assertThat(registrations).isNotEmpty();
    }
}
*/
package com.gpro.backend.repository;

import com.gpro.backend.entity.Category;
import com.gpro.backend.entity.Event;
import com.gpro.backend.entity.Registration;
import com.gpro.backend.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class RegistrationRepositoryTest {

    @Autowired
    private RegistrationRepository registrationRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private EventRepository eventRepository;
    @Autowired
    private CategoryRepository categoryRepository;

    private User testUser;
    private Event testEvent;
    private Registration testRegistration;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setNom("Test");
        testUser.setPrenom("Registration");
        testUser.setEmail("test.registration." + System.nanoTime() + "@junit.com");
        testUser.setPassword("hashed");
        testUser.setRole(User.Role.ROLE_USER);
        testUser.setCreatedAt(LocalDateTime.now());
        userRepository.save(testUser);

        Category category = new Category();
        category.setLibelle("CategorieRegistrationTest" + System.nanoTime());
        categoryRepository.save(category);

        testEvent = new Event();
        testEvent.setTitre("Event Registration Test");
        testEvent.setDescription("desc");
        testEvent.setDateHeure(LocalDateTime.now().plusDays(5));
        testEvent.setLieu("Sousse");
        testEvent.setCapaciteMax(30);
        testEvent.setPlacesRestantes(30);
        testEvent.setStatut("PLANIFIE");
        testEvent.setCategory(category);
        eventRepository.save(testEvent);

        testRegistration = new Registration();
        testRegistration.setUser(testUser);
        testRegistration.setEvent(testEvent);
        testRegistration.setDateInscription(LocalDateTime.now());
        testRegistration.setStatut(Registration.Statut.CONFIRMEE);
        registrationRepository.save(testRegistration);
    }

    @Test
    void testFindByUserAndEvent_existant() {
        Optional<Registration> found = registrationRepository.findByUserAndEvent(testUser, testEvent);
        assertThat(found).isPresent();
        assertThat(found.get().getStatut()).isEqualTo(Registration.Statut.CONFIRMEE);
    }

    @Test
    void testCountByEvent() {
        long count = registrationRepository.countByEvent(testEvent);
        assertThat(count).isEqualTo(1);
    }

    @Test
    void testFindByUser() {
        List<Registration> registrations = registrationRepository.findByUser(testUser);
        assertThat(registrations).hasSize(1);
    }
}