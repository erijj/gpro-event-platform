
/**
 * But : Vérifier que la méthode findByCategory() retourne tous les événements d'une catégorie donnée
 * testFindByDateHeureAfter_neRetourneQueLeFutur() But : Vérifier que la méthode findByDateHeureAfter() ne retourne que les événements dont la date est postérieure à celle donnée en paramètre
 */

/*package com.gpro.backend.repository;

import com.gpro.backend.entity.Category;
import com.gpro.backend.entity.Event;
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
class EventRepositoryTest {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Test
    void testFindByCategory() {
        Optional<Category> category = categoryRepository.findByLibelle("Conférence");
        assertThat(category).isPresent();

        List<Event> events = eventRepository.findByCategory(category.get());
        assertThat(events).isNotEmpty();
    }

    @Test
    void testFindByDateHeureAfter_dateAncienne() {
        // Une date très ancienne : tous les events du seed doivent ressortir
        List<Event> events = eventRepository.findByDateHeureAfter(LocalDateTime.of(2000, 1, 1, 0, 0));
        assertThat(events).isNotEmpty();
    }

    @Test
    void testFindByDateHeureAfter_dateFuture() {
        // Une date très future : aucun event ne devrait ressortir
        List<Event> events = eventRepository.findByDateHeureAfter(LocalDateTime.of(2099, 1, 1, 0, 0));
        assertThat(events).isEmpty();
    }
}
*/
package com.gpro.backend.repository;

import com.gpro.backend.entity.Category;
import com.gpro.backend.entity.Event;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class EventRepositoryTest {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    private Category testCategory;
    private Event pastEvent;
    private Event futureEvent;

    @BeforeEach
    void setUp() {
        testCategory = new Category();
        testCategory.setLibelle("CategorieEventTest" + System.nanoTime());
        categoryRepository.save(testCategory);

        pastEvent = new Event();
        pastEvent.setTitre("Event Passé");
        pastEvent.setDescription("desc");
        pastEvent.setDateHeure(LocalDateTime.now().minusDays(10));
        pastEvent.setLieu("Sousse");
        pastEvent.setCapaciteMax(50);
        pastEvent.setPlacesRestantes(50);
        pastEvent.setStatut("TERMINE");
        pastEvent.setCategory(testCategory);
        eventRepository.save(pastEvent);

        futureEvent = new Event();
        futureEvent.setTitre("Event Futur");
        futureEvent.setDescription("desc");
        futureEvent.setDateHeure(LocalDateTime.now().plusDays(10));
        futureEvent.setLieu("Sousse");
        futureEvent.setCapaciteMax(100);
        futureEvent.setPlacesRestantes(100);
        futureEvent.setStatut("PLANIFIE");
        futureEvent.setCategory(testCategory);
        eventRepository.save(futureEvent);
    }

    @Test
    void testFindByCategory() {
        List<Event> events = eventRepository.findByCategory(testCategory);
        assertThat(events).hasSize(2);
    }

    @Test
    void testFindByDateHeureAfter_neRetourneQueLeFutur() {
        List<Event> events = eventRepository.findByDateHeureAfter(LocalDateTime.now());
        assertThat(events)
            .extracting(Event::getTitre)
            .contains("Event Futur")           // notre event de test doit apparaître
            .doesNotContain("Event Passé");    // notre event passé ne doit jamais apparaître
    }
}