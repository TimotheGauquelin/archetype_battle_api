import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/Sequelize';

/**
 * Deck model representing user cards deck
 * @class Deck
 * @extends {Model}
 */
class Deck extends Model { }

Deck.init({
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    label: {
        type: DataTypes.STRING(200),
        allowNull: false,
        validate: {
            len: [1, 200]
        }
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    archetype_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: 'archetype',
            key: 'id'
        }
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'user',
            key: 'id'
        }
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    sequelize,
    modelName: 'Deck',
    tableName: 'deck',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true
});

export default Deck;
