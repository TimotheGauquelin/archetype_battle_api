-- Tables creation
CREATE TABLE IF NOT EXISTS era (
    id SERIAL PRIMARY KEY,
    label VARCHAR(50) NOT NULL UNIQUE
);

CREATE SEQUENCE archetype_id_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1;

CREATE TABLE IF NOT EXISTS archetype (
    id BIGINT DEFAULT nextval('archetype_id_seq') PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    catchphrase TEXT,
    playstyle_text TEXT,
    is_highlighted BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT FALSE,
    jumbotron_img_url TEXT,
    thumbnail_img_url TEXT,
    in_tcg_date DATE NOT NULL,
    in_ab_date DATE NOT NULL,
    comment TEXT DEFAULT NULL,
    popularity_point BIGINT NOT NULL DEFAULT 0,
    era_id BIGINT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_era FOREIGN KEY (era_id) REFERENCES era (id) ON DELETE SET NULL
);

ALTER TABLE archetype
    ADD CONSTRAINT check_dates_order CHECK (in_tcg_date <= in_ab_date),
    ADD CONSTRAINT check_name_length CHECK (length(name) >= 1 AND length(name) <= 50),
    ADD CONSTRAINT check_popularity_non_negative CHECK (popularity_point >= 0);

CREATE INDEX idx_archetype_name ON archetype(name);
CREATE INDEX idx_archetype_name_lower ON archetype(LOWER(name));

CREATE TABLE IF NOT EXISTS attribute (
    id SERIAL PRIMARY KEY,
    label VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS summonmechanic (
    id SERIAL PRIMARY KEY,
    label VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS type (
    id SERIAL PRIMARY KEY,
    label VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS role (
    id SERIAL PRIMARY KEY,
    label VARCHAR(50) NOT NULL UNIQUE  
);

CREATE TABLE IF NOT EXISTS "user" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NULL,
    reset_password_token TEXT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    is_active BOOLEAN NOT NULL DEFAULT FALSE,
    is_banned BOOLEAN NOT NULL DEFAULT FALSE,
    has_accepted_terms_and_conditions BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT username_length_check CHECK (length(username) >= 3 AND length(username) <= 30),
    CONSTRAINT email_format_check CHECK (
        email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    )
);

CREATE TABLE IF NOT EXISTS user_role (
    user_id UUID NOT NULL,
    role_id BIGINT NOT NULL,
    CONSTRAINT pk_user_role PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES "user" (id) ON DELETE CASCADE,
    CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES role (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS deck (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    label VARCHAR(200) NOT NULL,
    comment TEXT,
    archetype_id BIGINT NOT NULL,
    user_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_archetype FOREIGN KEY (archetype_id) REFERENCES archetype (id) ON DELETE CASCADE,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES "user" (id) ON DELETE CASCADE
);

ALTER TABLE deck
    ADD CONSTRAINT check_label_length CHECK (length(label) >= 1 AND length(label) <= 200);

CREATE INDEX idx_deck_user_id ON deck(user_id);

CREATE TABLE IF NOT EXISTS card_type (
    id SERIAL PRIMARY KEY,
    label VARCHAR(50) NOT NULL UNIQUE,
    num_order INT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS card (
    id VARCHAR(8) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    img_url TEXT NOT NULL,
    description TEXT NULL,
    level INT NULL,
    atk INT NULL,
    def INT NULL,
    attribute_id BIGINT NULL,
    type_id BIGINT NULL,
    card_type_id BIGINT NULL,
    CONSTRAINT fk_card_attribute FOREIGN KEY (attribute_id) REFERENCES attribute(id) ON DELETE SET NULL,
    CONSTRAINT fk_card_type FOREIGN KEY (type_id) REFERENCES type(id) ON DELETE SET NULL,
    CONSTRAINT fk_card_card_type FOREIGN KEY (card_type_id) REFERENCES card_type(id) ON DELETE SET NULL
);

CREATE INDEX idx_card_name_lower ON card(LOWER(name));
CREATE INDEX idx_card_level ON card(level);
CREATE INDEX idx_card_atk ON card(atk);
CREATE INDEX idx_card_def ON card(def);
CREATE INDEX idx_card_attribute_id ON card(attribute_id);
CREATE INDEX idx_card_type_id ON card(type_id);
CREATE INDEX idx_card_card_type_id ON card(card_type_id);

ALTER TABLE card
    ADD CONSTRAINT check_level_range CHECK (level IS NULL OR (level >= 1 AND level <= 12));

CREATE TABLE IF NOT EXISTS banlist (
    id SERIAL PRIMARY KEY,
    label VARCHAR(200) NOT NULL UNIQUE,
    release_date TIMESTAMP NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT FALSE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS card_status (
    id SERIAL PRIMARY KEY,
    label VARCHAR(50) NOT NULL UNIQUE,
    limit_count INT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS deck_card (
    deck_id UUID NOT NULL,
    card_id VARCHAR(8) NOT NULL,
    quantity INT NOT NULL,
    CONSTRAINT pk_deck_card PRIMARY KEY (deck_id, card_id),
    CONSTRAINT fk_deck FOREIGN KEY (deck_id) REFERENCES deck (id) ON DELETE CASCADE,
    CONSTRAINT fk_card FOREIGN KEY (card_id) REFERENCES card (id) ON DELETE CASCADE
);

ALTER TABLE deck_card 
    ADD CONSTRAINT check_quantity_positive CHECK (quantity > 0),
    ADD CONSTRAINT check_quantity_max CHECK (quantity <= 3); 

CREATE INDEX idx_deck_card_deck_id ON deck_card(deck_id);
CREATE INDEX idx_deck_card_card_id ON deck_card(card_id);

CREATE TABLE IF NOT EXISTS archetype_type (
    archetype_id BIGINT NOT NULL,
    type_id BIGINT NOT NULL,
    CONSTRAINT pk_archetype_type PRIMARY KEY (archetype_id, type_id),
    CONSTRAINT fk_archetype FOREIGN KEY (archetype_id) REFERENCES archetype (id) ON DELETE CASCADE,
    CONSTRAINT fk_type FOREIGN KEY (type_id) REFERENCES type (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS archetype_attribute (
    archetype_id BIGINT NOT NULL,
    attribute_id BIGINT NOT NULL,
    CONSTRAINT pk_archetype_attribute PRIMARY KEY (archetype_id, attribute_id),
    CONSTRAINT fk_archetype FOREIGN KEY (archetype_id) REFERENCES archetype (id) ON DELETE CASCADE,
    CONSTRAINT fk_attribute FOREIGN KEY (attribute_id) REFERENCES attribute (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS archetype_summonmechanic (
    archetype_id BIGINT NOT NULL,
    summonmechanic_id BIGINT NOT NULL,
    CONSTRAINT pk_archetype_summonmechanic PRIMARY KEY (archetype_id, summonmechanic_id),
    CONSTRAINT fk_archetype FOREIGN KEY (archetype_id) REFERENCES archetype (id) ON DELETE CASCADE,
    CONSTRAINT fk_summonmechanic FOREIGN KEY (summonmechanic_id) REFERENCES summonmechanic (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS banlist_archetype_card (
    id SERIAL PRIMARY KEY,
    banlist_id BIGINT NOT NULL,
    archetype_id BIGINT NULL,
    card_id VARCHAR(8) NOT NULL,
    card_status_id BIGINT NOT NULL,
    explanation_text TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_banlist FOREIGN KEY (banlist_id) REFERENCES banlist (id) ON DELETE CASCADE,
    CONSTRAINT fk_archetype FOREIGN KEY (archetype_id) REFERENCES archetype (id) ON DELETE CASCADE,
    CONSTRAINT fk_card FOREIGN KEY (card_id) REFERENCES card (id) ON DELETE CASCADE,
    CONSTRAINT fk_card_status FOREIGN KEY (card_status_id) REFERENCES card_status (id) ON DELETE CASCADE
);

CREATE INDEX idx_banlist_archetype_card_banlist_id ON banlist_archetype_card(banlist_id);
CREATE INDEX idx_banlist_archetype_card_card_id ON banlist_archetype_card(card_id);
CREATE INDEX idx_banlist_archetype_card_archetype_id ON banlist_archetype_card(archetype_id);

-- Functions and Triggers
CREATE OR REPLACE FUNCTION check_username_constraints() 
RETURNS TRIGGER AS $$
BEGIN
    IF LENGTH(NEW.username) < 3 OR LENGTH(NEW.username) > 30 THEN
        RAISE EXCEPTION 'The username must contain between 3 and 30 characters.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to check the username before insert or update
CREATE TRIGGER check_username_before_insert_or_update
BEFORE INSERT OR UPDATE ON "user"
FOR EACH ROW
EXECUTE FUNCTION check_username_constraints();

-- Function to check the password update
CREATE OR REPLACE FUNCTION enforce_password_not_null()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.password IS NULL AND OLD.password IS NOT NULL THEN
        RAISE EXCEPTION 'The password cannot be empty after the first modification';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to check the password update
CREATE TRIGGER password_update_check
BEFORE UPDATE ON "user"
FOR EACH ROW
EXECUTE FUNCTION enforce_password_not_null();

-- Function to check the archetype requirements
CREATE OR REPLACE FUNCTION check_archetype_requirements()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'UPDATE' THEN
        IF (SELECT COUNT(*) FROM archetype_attribute WHERE archetype_id = NEW.id) < 1 THEN
            RAISE EXCEPTION 'The archetype must have at least one attribute.';
        END IF;

        IF (SELECT COUNT(*) FROM archetype_type WHERE archetype_id = NEW.id) < 1 THEN
            RAISE EXCEPTION 'The archetype must have at least one type.';
        END IF;

        IF (SELECT COUNT(*) FROM archetype_summonmechanic WHERE archetype_id = NEW.id) < 1 THEN
            RAISE EXCEPTION 'The archetype must have at least one summonmechanic.';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to check the archetype requirements
DROP TRIGGER IF EXISTS archetype_requirements_check ON archetype;
CREATE TRIGGER archetype_requirements_check
BEFORE UPDATE ON archetype
FOR EACH ROW
EXECUTE FUNCTION check_archetype_requirements();

-- Trigger to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_archetype_updated_at
    BEFORE UPDATE ON archetype
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deck_updated_at
    BEFORE UPDATE ON deck
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_banlist_updated_at
    BEFORE UPDATE ON banlist
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_banlist_archetype_card_updated_at
    BEFORE UPDATE ON banlist_archetype_card
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_updated_at
    BEFORE UPDATE ON "user"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_user_is_active ON "user" (is_active);
CREATE INDEX IF NOT EXISTS idx_user_is_banned ON "user" (is_banned);
CREATE INDEX IF NOT EXISTS idx_user_created_at ON "user" (created_at);