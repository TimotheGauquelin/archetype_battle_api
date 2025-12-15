import sequelize from '../../config/Sequelize';
import './associations';

export const syncDatabase = async (force = false) => {
    try {
        await sequelize.sync({ force });
        console.info('Database synchronized successfully');
    } catch (error) {
        console.error('Error synchronizing the database:', error);
        throw error;
    }
};

export const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.info('Database connection established successfully');
    } catch (error) {
        console.error('Error connecting to the database:', error);
        throw error;
    }
};

export {
    User,
    Role,
    UserRole,
    Deck,
    DeckCard,
    Card,
    Archetype,
    Era,
    Attribute,
    Type,
    SummonMechanic,
    CardType,
    Banlist,
    CardStatus,
    BanlistArchetypeCard,
    ArchetypeType,
    ArchetypeAttribute,
    ArchetypeSummonMechanic
} from './associations.js'; 