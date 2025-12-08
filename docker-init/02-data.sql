INSERT INTO era (id, label) VALUES 
    (1, 'DM'),
    (2, 'GX'),
    (3, '5DS'),
    (4, 'ZEXAL'),
    (5, 'ARC-V'),
    (6, 'VRAINS'),
    (7, 'MODERN'),
    (8, 'CHRONICLES');

INSERT INTO archetype (id, name, playstyle_text, catchphrase, is_highlighted, is_active, in_tcg_date, in_ab_date, popularity_point, era_id) VALUES
    (1, 'Blue Eyes', 'A strong archetype focused on dragons.', 'Slider for Dragon Clan', TRUE, TRUE, '2021-05-01', '2021-06-01', 1000, 1),
    (2, 'Dark Magicien', 'Spellcaster-focused archetype.', 'Slider for Magician Circle', FALSE, TRUE, '2020-09-15', '2020-10-01', 850, 1);

INSERT INTO attribute (id, label) VALUES
    (1, 'LIGHT'),
    (2, 'DARK'),
    (3, 'WATER'),
    (4, 'FIRE'),
    (5, 'EARTH'),
    (6, 'WIND'),
    (7, 'DIVINE');

INSERT INTO type (id, label) VALUES
    (1, 'Aqua'),
    (2, 'Beast'),
    (3, 'Beast-Warrior'),
    (4, 'Creator God'),
    (5, 'Cyberse'),
    (6, 'Dinosaur'),
    (7, 'Divine-Beast'),
    (8, 'Dragon'),
    (9, 'Fairy'),
    (10, 'Fiend'),
    (11, 'Fish'),
    (12, 'Illusion'),
    (13, 'Insect'),
    (14, 'Machine'),
    (15, 'Plant'),
    (16, 'Psychic'),
    (17, 'Pyro'),
    (18, 'Reptile'),
    (19, 'Rock'),
    (20, 'Sea Serpent'),
    (21, 'Spellcaster'),
    (22, 'Thunder'),
    (23, 'Warrior'),
    (24, 'Winged Beast'),
    (25, 'Wyrm'),
    (26, 'Zombie');


INSERT INTO summonmechanic (id, label) VALUES
    (1, 'Special Summon'),
    (2, 'Tribute Summon'),
    (3, 'Fusion Summon'),
    (4, 'Ritual Summon'),
    (5, 'Synchro Summon'),
    (6, 'Xyz Summon'),
    (7, 'Pendulum Summon'),
    (8, 'Link Summon');

INSERT INTO archetype_attribute (archetype_id, attribute_id) VALUES
    (1, 1), -- Blue Eyes - LIGHT
    (2, 2); -- Dark Magician - DARK

INSERT INTO archetype_type (archetype_id, type_id) VALUES
    (1, 8), -- Blue Eyes - Dragon
    (2, 21); -- Dark Magician - Spellcaster

INSERT INTO archetype_summonmechanic (archetype_id, summonmechanic_id) VALUES
    (1, 2), -- Blue Eyes - Tribute Summon
    (2, 2); -- Dark Magician - Tribute Summon

INSERT INTO card_status (id, label, limit_count) VALUES
(1, 'Forbidden', 0),
(2, 'Limited', 1),
(3, 'Semi-Limited', 2),
(4, 'Unlimited', 3);

INSERT INTO card_type (id, label, num_order) VALUES
(1, 'Normal Monster', 1),
(2, 'Normal Tuner Monster', 2),
(3, 'Effect Monster', 3),
(4, 'Tuner Monster', 4),
(5, 'Flip Monster', 5),
(6, 'Flip Effect Monster', 6),
(7, 'Spirit Monster', 7),
(8, 'Union Effect Monster', 8),
(9, 'Gemini Monster', 9),
(16, 'Toon Monster', 10),
(10, 'Pendulum Normal Monster', 11),
(11, 'Pendulum Effect Monster', 12),
(24, 'Pendulum Flip Effect Monster', 13),
(13, 'Pendulum Tuner Effect Monster', 14),
(14, 'Ritual Monster', 15),
(15, 'Ritual Effect Monster', 16),
(12, 'Pendulum Effect Ritual Monster', 17),
(17, 'Fusion Monster', 18),
(25, 'Pendulum Effect Fusion Monster', 19),
(18, 'Synchro Monster', 20),
(19, 'Synchro Tuner Monster', 21),
(20, 'Synchro Pendulum Effect Monster', 22),
(21, 'XYZ Monster', 23),
(22, 'XYZ Pendulum Effect Monster', 24),
(23, 'Link Monster', 25),
(26, 'Normal Spell', 26),
(27, 'Field Spell', 27),
(28, 'Equip Spell', 28),
(29, 'Continuous Spell', 29),
(30, 'Quick-Play Spell', 30),
(31, 'Ritual Spell', 31),
(32, 'Normal Trap', 32),
(33, 'Continuous Trap', 33),
(34, 'Counter Trap', 34);

INSERT INTO role (label) VALUES 
('Admin'),
('User');

INSERT INTO "user" (username, password, email, is_active, is_banned, has_accepted_terms_and_conditions) VALUES
('admin', '$2b$10$example_hash', 'admin@example.com', true, false, true),
('testuser', '$2b$10$example_hash', 'test@example.com', true, false, true),
('inactive_user', '$2b$10$example_hash', 'inactive@example.com', false, false, false);

INSERT INTO user_role (user_id, role_id) VALUES
((SELECT id FROM "user" WHERE username = 'admin'), (SELECT id FROM role WHERE label = 'Admin')),
((SELECT id FROM "user" WHERE username = 'testuser'), (SELECT id FROM role WHERE label = 'User')),
((SELECT id FROM "user" WHERE username = 'inactive_user'), (SELECT id FROM role WHERE label = 'User'));