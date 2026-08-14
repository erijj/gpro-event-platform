package com.gpro.backend.service;

import com.gpro.backend.dto.CategoryDto;
import com.gpro.backend.entity.Category;
import com.gpro.backend.repository.CategoryRepository;
import com.gpro.backend.service.exception.BusinessRuleException;
import com.gpro.backend.service.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service //
@RequiredArgsConstructor // Lombok génère le constructeur avec les champs "final" -> injection par constructeur
@Transactional(readOnly = true) // par défaut, toutes les méthodes sont en lecture seule
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<CategoryDto> findAll() {
        return categoryRepository.findAll().stream() // on récupère la liste des catégories, on la transforme en DTO et on retourne la liste
                .map(CategoryDto::fromEntity) // on transforme chaque entité Category en DTO CategoryDto
                .toList(); // on retourne la liste des DTO
    }

    public CategoryDto findById(Long id) {
        Category category = categoryRepository.findById(id) 
                .orElseThrow(() -> new ResourceNotFoundException("Catégorie introuvable avec l'id : " + id)); // si la catégorie n'existe pas, on lance une exception
        return CategoryDto.fromEntity(category); //
    }

    @Transactional // écrase le readOnly=true de la classe pour cette méthode
    public CategoryDto create(String libelle) {
        categoryRepository.findByLibelle(libelle).ifPresent(c -> {
            throw new BusinessRuleException("Une catégorie avec ce libellé existe déjà : " + libelle);
        });

        Category category = new Category();
        category.setLibelle(libelle);
        Category saved = categoryRepository.save(category);
        return CategoryDto.fromEntity(saved);
    }

    @Transactional
    public CategoryDto update(Long id, String libelle) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Catégorie introuvable avec l'id : " + id));

        // Vérifier l'unicité du libellé seulement s'il a changé
        if (!category.getLibelle().equals(libelle)) {
            categoryRepository.findByLibelle(libelle).ifPresent(c -> {
                throw new BusinessRuleException("Une catégorie avec ce libellé existe déjà : " + libelle);
            });
        }

        category.setLibelle(libelle);
        Category updated = categoryRepository.save(category);
        return CategoryDto.fromEntity(updated);
    }

    
    @Transactional
    public void delete(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Catégorie introuvable avec l'id : " + id);
        }
        categoryRepository.deleteById(id);
    }
}