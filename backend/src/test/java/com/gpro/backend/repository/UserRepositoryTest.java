/**
 * testFindByEmail_existant()
   But : Vérifier que la méthode findByEmail() retrouve un utilisateur existant
 * testFindByEmail_inexistant()
   But : Vérifier que la méthode retourne Optional.empty() pour un email inexistant
 * testExistsByEmail()
   But : Vérifier que la méthode existsByEmail() retourne true pour un email existant et false pour un email inexistant
 */





/*package com.gpro.backend.repository;

import com.gpro.backend.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    void testFindByEmail_existant() {
        Optional<User> user = userRepository.findByEmail("sarra.trabelsi@example.com");
        assertThat(user).isPresent();
    }

    @Test
    void testFindByEmail_inexistant() {
        Optional<User> user = userRepository.findByEmail("inexistant@test.com");
        assertThat(user).isEmpty();
    }

    @Test
    void testExistsByEmail() {
        boolean exists = userRepository.existsByEmail("sarra.trabelsi@example.com");
        assertThat(exists).isTrue();
    }
} */
package com.gpro.backend.repository;

import com.gpro.backend.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setNom("Test");
        testUser.setPrenom("Isolation");
        testUser.setEmail("test.isolation." + System.nanoTime() + "@junit.com"); // email unique à chaque run
        testUser.setPassword("hashedpassword");
        testUser.setRole(User.Role.ROLE_USER);
        testUser.setCreatedAt(LocalDateTime.now());

        userRepository.save(testUser);
    }

    @Test
    void testFindByEmail_existant() {
        Optional<User> found = userRepository.findByEmail(testUser.getEmail());
        assertThat(found).isPresent();
        assertThat(found.get().getNom()).isEqualTo("Test");
    }

    @Test
    void testFindByEmail_inexistant() {
        Optional<User> found = userRepository.findByEmail("ne-devrait-jamais-exister@junit.com");
        assertThat(found).isEmpty();
    }

    @Test
    void testExistsByEmail() {
        assertThat(userRepository.existsByEmail(testUser.getEmail())).isTrue();
        assertThat(userRepository.existsByEmail("inexistant@junit.com")).isFalse();
    }
}