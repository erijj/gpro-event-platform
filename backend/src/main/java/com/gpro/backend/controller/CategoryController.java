/**
 * Contrôleur REST pour gérer les catégories.
 * 
 * Ce contrôleur expose des endpoints pour effectuer des opérations CRUD sur les catégories.
 * Il utilise le service CategoryService pour la logique métier.
 */
package com.gpro.backend.controller;

import com.gpro.backend.dto.CategoryDto;
import com.gpro.backend.dto.request.CreateCategoryRequest;
import com.gpro.backend.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    //Le client demande : "Donne-moi toutes les catégories"
    @GetMapping 
    public ResponseEntity<List<CategoryDto>> findAll() {
        return ResponseEntity.ok(categoryService.findAll());
    }

    // Le client demande : "Donne-moi la catégorie avec ID 1"
    @GetMapping("/{id}")
    public ResponseEntity<CategoryDto> findById(@PathVariable Long id) {
        return ResponseEntity.ok(categoryService.findById(id));
    }

    @PostMapping
    public ResponseEntity<CategoryDto> create(@Valid @RequestBody CreateCategoryRequest request) {
        CategoryDto created = categoryService.create(request.getLibelle());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryDto> update(@PathVariable Long id, @Valid @RequestBody CreateCategoryRequest request) {
        CategoryDto updated = categoryService.update(id, request.getLibelle());
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        categoryService.delete(id);
        return ResponseEntity.noContent().build();
    }
}