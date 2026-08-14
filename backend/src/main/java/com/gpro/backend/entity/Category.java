package com.gpro.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity //dit à Hibernate "cette classe correspond à une table"
@Table(name = "category")
@Data //génère automatiquement getters, setters, toString(), equals(), hashCode()
@NoArgsConstructor //génère les constructeurs vide et complet (JPA a besoin d'un constructeur vide obligatoirement)
@AllArgsConstructor // génère les constructeurs vide et complet (JPA a besoin d'un constructeur vide obligatoirement)

public class Category {

    @Id //indique à Hibernate que c'est la clé primaire de la table
    @GeneratedValue(strategy = GenerationType.IDENTITY) //indique à Hibernate que la valeur de l'id est générée automatiquement par la base de données correspond au SERIAL
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String libelle;

    @OneToMany(mappedBy = "category") //une catégorie a plusieurs événements ; mappedBy indique que c'est l'entité Event qui possède la clé étrangère
    private List<Event> events;
}