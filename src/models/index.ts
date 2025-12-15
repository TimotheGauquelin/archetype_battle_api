import sequelize from '../../config/Sequelize';
import './associations';

export const syncDatabase = async (force = false): Promise<void> => {
  try {
    await sequelize.sync({ force });
    console.log('Base de données synchronisée avec succès');
  } catch (error) {
    console.error('Erreur lors de la synchronisation de la base de données:', error);
    throw error;
  }
};

export const testConnection = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('Connexion à la base de données établie avec succès');
  } catch (error) {
    console.error('Impossible de se connecter à la base de données:', error);
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
  ArchetypeSummonMechanic,
} from './associations.js';



