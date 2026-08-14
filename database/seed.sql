/*
 * Database seed script for the event management application.
 * This script populates the database with initial data for categories, users, events, and registrations.
 */
INSERT INTO category (libelle) VALUES
    ('Conférence'),
    ('Atelier'),
    ('Webinaire'),
    ('Compétition');

INSERT INTO "user" (nom, prenom, email, password, role) VALUES
    ('Ben Salah', 'Ahmed', 'ahmed.bensalah@example.com', 'password_hash_1', 'ROLE_ADMIN'),
    ('Trabelsi', 'Sarra', 'sarra.trabelsi@example.com', 'password_hash_2', 'ROLE_USER'),
    ('Gharbi', 'Mohamed', 'mohamed.gharbi@example.com', 'password_hash_3', 'ROLE_USER');

INSERT INTO event (titre, description, date_heure, lieu, capacite_max, places_restantes, category_id, statut) VALUES
    ('Conférence IA & Emploi', 'Impact de l''IA sur le marché du travail', '2026-09-15 09:00:00', 'Sfax, Salle A', 100, 100, 1, 'PLANIFIE'),
    ('Atelier Spring Boot', 'Introduction pratique à Spring Boot', '2026-09-20 14:00:00', 'Sfax, Salle B', 30, 30, 2, 'PLANIFIE'),
    ('Webinaire Angular avancé', 'RxJS et gestion d''état', '2026-09-25 18:00:00', 'En ligne', 200, 200, 3, 'PLANIFIE');

INSERT INTO registration (user_id, event_id, statut) VALUES
    (2, 1, 'CONFIRMEE'),
    (3, 1, 'CONFIRMEE'),
    (2, 2, 'CONFIRMEE');

UPDATE event SET places_restantes = places_restantes - 2 WHERE id = 1;
UPDATE event SET places_restantes = places_restantes - 1 WHERE id = 2;
