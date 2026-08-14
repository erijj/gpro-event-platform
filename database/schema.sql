-- ============================================
-- GPRO Event Platform — Schéma de base de données
-- PostgreSQL
-- ============================================

DROP TABLE IF EXISTS registration CASCADE;
DROP TABLE IF EXISTS event CASCADE;
DROP TABLE IF EXISTS category CASCADE;
DROP TABLE IF EXISTS "user" CASCADE;

DROP TYPE IF EXISTS user_role;
DROP TYPE IF EXISTS registration_status;

CREATE TYPE user_role AS ENUM ('ROLE_USER', 'ROLE_ADMIN');
CREATE TYPE registration_status AS ENUM ('CONFIRMEE', 'ANNULEE');

CREATE TABLE "user" (
    id         BIGSERIAL PRIMARY KEY,
    nom        VARCHAR(100)  NOT NULL,
    prenom     VARCHAR(100)  NOT NULL,
    email      VARCHAR(150)  NOT NULL UNIQUE,
    password   VARCHAR(255)  NOT NULL,
    role       user_role     NOT NULL DEFAULT 'ROLE_USER',
    created_at TIMESTAMP     NOT NULL DEFAULT NOW()
);

CREATE TABLE category (
    id      BIGSERIAL PRIMARY KEY,
    libelle VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE event (
    id                BIGSERIAL PRIMARY KEY,
    titre             VARCHAR(200)  NOT NULL,
    description       TEXT,
    date_heure        TIMESTAMP     NOT NULL,
    lieu              VARCHAR(200)  NOT NULL,
    capacite_max      INTEGER       NOT NULL CHECK (capacite_max > 0),
    places_restantes  INTEGER       NOT NULL CHECK (places_restantes >= 0),
    image             VARCHAR(255),
    statut            VARCHAR(20)   NOT NULL DEFAULT 'PLANIFIE'
                        CHECK (statut IN ('PLANIFIE', 'EN_COURS', 'TERMINE', 'ANNULE')),
    category_id       BIGINT        NOT NULL,
    created_at        TIMESTAMP     NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_event_category
        FOREIGN KEY (category_id)
        REFERENCES category(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_places_coherentes
        CHECK (places_restantes <= capacite_max)
);

CREATE TABLE registration (
    id                BIGSERIAL            PRIMARY KEY,
    user_id           BIGINT               NOT NULL,
    event_id          BIGINT               NOT NULL,
    date_inscription  TIMESTAMP            NOT NULL DEFAULT NOW(),
    statut            registration_status  NOT NULL DEFAULT 'CONFIRMEE',

    CONSTRAINT fk_registration_user
        FOREIGN KEY (user_id)
        REFERENCES "user"(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_registration_event
        FOREIGN KEY (event_id)
        REFERENCES event(id)
        ON DELETE CASCADE,

    CONSTRAINT uq_user_event UNIQUE (user_id, event_id)
);

CREATE INDEX idx_event_category ON event(category_id);
CREATE INDEX idx_registration_user ON registration(user_id);
CREATE INDEX idx_registration_event ON registration(event_id);
CREATE INDEX idx_event_date ON event(date_heure);
