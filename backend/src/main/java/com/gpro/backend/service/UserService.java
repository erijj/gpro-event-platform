package com.gpro.backend.service;

import com.gpro.backend.dto.UserDto;
import com.gpro.backend.entity.User;
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
public class UserService {

    private final UserRepository userRepository;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    public List<UserDto> findAll() {
        return userRepository.findAll().stream()
                .map(UserDto::fromEntity)
                .toList();
    }

    public UserDto findById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable avec l'id : " + id));
        return UserDto.fromEntity(user);
    }

    @Transactional
    public UserDto create(String nom, String prenom, String email, String rawPassword, User.Role role) {
        if (userRepository.existsByEmail(email)) {
            throw new BusinessRuleException("Un compte existe déjà avec cet email : " + email);
        }

        User user = new User();
        user.setNom(nom);
        user.setPrenom(prenom);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(rawPassword));
        user.setRole(role);
        user.setCreatedAt(LocalDateTime.now());

        User saved = userRepository.save(user);
        return UserDto.fromEntity(saved);
    }
    @Transactional
public UserDto update(Long id, String nom, String prenom, String email, User.Role role) {
    User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable avec l'id : " + id));

    // Vérifier l'unicité de l'email seulement si l'email a changé
    if (!user.getEmail().equals(email) && userRepository.existsByEmail(email)) {
        throw new BusinessRuleException("Un compte existe déjà avec cet email : " + email);
    }

    user.setNom(nom);
    user.setPrenom(prenom);
    user.setEmail(email);
    user.setRole(role);

    User updated = userRepository.save(user);
    return UserDto.fromEntity(updated);
}

@Transactional
public void delete(Long id) {
    User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable avec l'id : " + id));
    userRepository.delete(user);
}
}