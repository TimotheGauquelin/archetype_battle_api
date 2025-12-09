import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/Sequelize';

/**
 * Archetype model representing a group of card
 * @class Archetype
 * @extends {Model}
 */
class Archetype extends Model { }

Archetype.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
            len: [1, 50]
        }
    },
    catchphrase: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    playstyle_text: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    is_highlighted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    jumbotron_img_url: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    thumbnail_img_url: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    in_tcg_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    in_ab_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null
    },
    popularity_point: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0
        }
    },
    era_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
            model: 'era',
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
    modelName: 'Archetype',
    tableName: 'archetype',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true
});

export default Archetype;
