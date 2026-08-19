package com.gpro.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class BackendApplicationTests {

	@Test
	void contextLoads() {
	}

}
/* 
package com.gpro.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;

@SpringBootTest
class BackendApplicationTests {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    void generatePasswordHash() {
        String hash = passwordEncoder.encode("password123");

        System.out.println("========================================");
        System.out.println("BCrypt hash : " + hash);
        System.out.println("========================================");

        System.out.println(
            "Verification : " +
            passwordEncoder.matches("password123", hash)
        );
    }
}
*/