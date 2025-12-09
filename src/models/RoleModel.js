import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/Sequelize';

/**
 * Role model representing a user role
 * @class Role
 * @extends {Model}
 */
class Role extends Model {}

Role.init({
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
    modelName: 'Role',
    tableName: 'role',
    timestamps: false,
    underscored: true
});

export default Role;
