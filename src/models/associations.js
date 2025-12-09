import Banlist from './BanlistModel';
import BanlistArchetypeCard from './BanlistArchetypeCardModel';
import Card from './CardModel';
import Archetype from './ArchetypeModel';
import Deck from './DeckModel';
import DeckCard from './DeckCardModel';
import User from './UserModel';
import Role from './RoleModel';
import UserRole from './UserRoleModel';
import CardType from './CardTypeModel';
import Era from './EraModel';
import Attribute from './AttributeModel';
import Type from './TypeModel';
import SummonMechanic from './SummonMechanicModel';
import CardStatus from './CardStatusModel';
import ArchetypeType from './ArchetypeTypeModel';
import ArchetypeAttribute from './ArchetypeAttributeModel';
import ArchetypeSummonMechanic from './ArchetypeSummonMechanicModel';

// Relations Banlist
Banlist.hasMany(BanlistArchetypeCard, {
    foreignKey: 'banlist_id',
    as: 'banlist_cards'
});

// Relations BanlistArchetypeCard
BanlistArchetypeCard.belongsTo(Banlist, {
    foreignKey: 'banlist_id',
    as: 'banlist'
});

BanlistArchetypeCard.belongsTo(Card, {
    foreignKey: 'card_id',
    as: 'card'
});

BanlistArchetypeCard.belongsTo(Archetype, {
    foreignKey: 'archetype_id',
    as: 'archetype'
});

BanlistArchetypeCard.belongsTo(CardStatus, {
    foreignKey: 'card_status_id',
    as: 'card_status'
});

// Relations Card
Card.belongsTo(Attribute, {
    foreignKey: 'attribute_id',
    as: 'attribute'
});

Card.belongsTo(Type, {
    foreignKey: 'type_id',
    as: 'type'
});

Card.belongsTo(CardType, {
    foreignKey: 'card_type_id',
    as: 'card_type'
});

Card.hasMany(DeckCard, {
    foreignKey: 'card_id',
    as: 'deck_cards'
});

Card.hasMany(BanlistArchetypeCard, {
    foreignKey: 'card_id',
    as: 'banlist_entries'
});

// Relations Deck
Deck.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
});

Deck.belongsTo(Archetype, {
    foreignKey: 'archetype_id',
    as: 'archetype'
});

Deck.hasMany(DeckCard, {
    foreignKey: 'deck_id',
    as: 'deck_cards'
});

// Relations DeckCard
DeckCard.belongsTo(Deck, {
    foreignKey: 'deck_id',
    as: 'deck'
});

DeckCard.belongsTo(Card, {
    foreignKey: 'card_id',
    as: 'card'
});

// Relations User
User.hasMany(Deck, {
    foreignKey: 'user_id',
    as: 'decks'
});

User.belongsToMany(Role, {
    through: UserRole,
    foreignKey: 'user_id',
    otherKey: 'role_id',
    as: 'roles'
});

// Relations Role
Role.belongsToMany(User, {
    through: UserRole,
    foreignKey: 'role_id',
    otherKey: 'user_id',
    as: 'users'
});

// Relations Archetype
Archetype.belongsTo(Era, {
    foreignKey: 'era_id',
    as: 'era'
});

Archetype.hasMany(Deck, {
    foreignKey: 'archetype_id',
    as: 'decks'
});

Archetype.hasMany(BanlistArchetypeCard, {
    foreignKey: 'archetype_id',
    as: 'banlist_entries'
});

// Relations Era
Era.hasMany(Archetype, {
    foreignKey: 'era_id',
    as: 'archetypes'
});

// Relations Attribute
Attribute.hasMany(Card, {
    foreignKey: 'attribute_id',
    as: 'cards'
});

// Relations Type
Type.hasMany(Card, {
    foreignKey: 'type_id',
    as: 'cards'
});

// Relations CardType
CardType.hasMany(Card, {
    foreignKey: 'card_type_id',
    as: 'cards'
});

// Relations CardStatus
CardStatus.hasMany(BanlistArchetypeCard, {
    foreignKey: 'card_status_id',
    as: 'banlist_entries'
});

// Associations ArchetypeType
Archetype.hasMany(ArchetypeType, {
    foreignKey: 'archetype_id',
    as: 'archetype_types'
});
ArchetypeType.belongsTo(Archetype, {
    foreignKey: 'archetype_id',
    as: 'archetype'
});
Type.hasMany(ArchetypeType, {
    foreignKey: 'type_id',
    as: 'archetype_types'
});
ArchetypeType.belongsTo(Type, {
    foreignKey: 'type_id',
    as: 'type'
});

// Associations ArchetypeAttribute
Archetype.hasMany(ArchetypeAttribute, {
    foreignKey: 'archetype_id',
    as: 'archetype_attributes'
});
ArchetypeAttribute.belongsTo(Archetype, {
    foreignKey: 'archetype_id',
    as: 'archetype'
});
Attribute.hasMany(ArchetypeAttribute, {
    foreignKey: 'attribute_id',
    as: 'archetype_attributes'
});
ArchetypeAttribute.belongsTo(Attribute, {
    foreignKey: 'attribute_id',
    as: 'attribute'
});

// Associations ArchetypeSummonMechanic
Archetype.hasMany(ArchetypeSummonMechanic, {
    foreignKey: 'archetype_id',
    as: 'archetype_summon_mechanics'
});
ArchetypeSummonMechanic.belongsTo(Archetype, {
    foreignKey: 'archetype_id',
    as: 'archetype'
});
SummonMechanic.hasMany(ArchetypeSummonMechanic, {
    foreignKey: 'summonmechanic_id',
    as: 'archetype_summon_mechanics'
});
ArchetypeSummonMechanic.belongsTo(SummonMechanic, {
    foreignKey: 'summonmechanic_id',
    as: 'summon_mechanic'
});

export {
    Banlist,
    BanlistArchetypeCard,
    Card,
    Archetype,
    Deck,
    DeckCard,
    User,
    Role,
    UserRole,
    CardType,
    Era,
    Attribute,
    Type,
    SummonMechanic,
    CardStatus,
    ArchetypeType,
    ArchetypeAttribute,
    ArchetypeSummonMechanic
};
