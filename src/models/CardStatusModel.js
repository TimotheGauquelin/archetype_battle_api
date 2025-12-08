import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/Sequelize.js';

/**
 * CardStatus model representing the status of a banlist archetype card
 * @class CardStatus
 * @extends {Model}
 */
class CardStatus extends Model { }

CardStatus.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        label: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },
        limit_count: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true
        }
    },
    {
        sequelize,
        modelName: 'CardStatus',
        tableName: 'card_status',
        timestamps: false,
        underscored: true
    }
);

export default CardStatus;
