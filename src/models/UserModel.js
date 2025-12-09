import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/Sequelize.js';
import bcrypt from 'bcryptjs';
import pkg from 'jsonwebtoken';
import { CustomError } from '../utils/CustomError.js';
const { sign } = pkg;

class User extends Model {}

User.init({
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    username: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            len: {
                args: [3, 30],
                msg: 'Username must be between 3 and 30 characters'
            }
        }
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    reset_password_token: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    is_banned: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    has_accepted_terms_and_conditions: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
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
    modelName: 'User',
    tableName: 'user',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true,
    hooks: {
        beforeCreate: async (user) => {
            if (user.get('password')) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = bcrypt.hash(user.get('password'), salt);
                user.set('password', hashedPassword);
            }
        },
    }
});

export default User;
