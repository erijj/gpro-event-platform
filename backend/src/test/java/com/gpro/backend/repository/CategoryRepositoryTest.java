
/**
 * But : Vérifier que la méthode findByLibelle() retrouve bien une catégorie existante en base
 * testFindByLibelle_inexistant() Vérifier que la méthode retourne Optional.empty() quand on cherche un libellé qui n'existe pas
 */

/*package com.gpro.backend.repository;

import com.gpro.backend.entity.Category;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class CategoryRepositoryTest {

    @Autowired 
    private CategoryRepository categoryRepository;

    @Test
    void testFindByLibelle_existant() {
        Optional<Category> category = categoryRepository.findByLibelle("LIBELLE_A_REMPLACER");
        assertThat(category).isPresent();
    }

    @Test
    void testFindByLibelle_inexistant() {
        Optional<Category> category = categoryRepository.findByLibelle("Inexistant123");
        assertThat(category).isEmpty();
    }
} */


package com.gpro.backend.repository;

import com.gpro.backend.entity.Category;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class CategoryRepositoryTest {

    @Autowired
    private CategoryRepository categoryRepository;

    private Category testCategory;

    @BeforeEach
    void setUp() {
        testCategory = new Category();
        testCategory.setLibelle("CategorieTest" + System.nanoTime());
        categoryRepository.save(testCategory);
    }

    @Test
    void testFindByLibelle_existant() {
        Optional<Category> found = categoryRepository.findByLibelle(testCategory.getLibelle());
        assertThat(found).isPresent();
    }

    @Test
    void testFindByLibelle_inexistant() {
        Optional<Category> found = categoryRepository.findByLibelle("CategorieInexistante999");
        assertThat(found).isEmpty();
    }
}