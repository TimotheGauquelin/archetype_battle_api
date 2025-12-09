import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/Sequelize';

/**
 * Type model representing a card type
 * @class Type
 * @extends {Model}
 */
class Type extends Model {}

Type.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    label: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    }
}, {
    sequelize,
    modelName: 'Type',
    tableName: 'type',
    timestamps: false,
    underscored: true
});

export default Type;
