import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/Sequelize';

/**
 * UserRole model representing the relationship between users and roles
 * @class UserRole
 * @extends {Model}
 */
class UserRole extends Model {}

UserRole.init({
    user_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'user',
            key: 'id'
        }
    },
    role_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'role',
            key: 'id'
        }
    }
}, {
    sequelize,
    modelName: 'UserRole',
    tableName: 'user_role',
    timestamps: false,
    underscored: true
});

export default UserRole;
