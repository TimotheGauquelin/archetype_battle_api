import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/Sequelize.js';

/**
 * CardType model representing a card type
 * @class CardType
 * @extends {Model}
 */
class CardType extends Model {}

CardType.init({
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
    num_order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    }
}, {
    sequelize,
    modelName: 'CardType',
    tableName: 'card_type',
    timestamps: false,
    underscored: true
});

export default CardType;
