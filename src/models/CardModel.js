import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/Sequelize';

/**
 * Card model representing game cards
 * @class Card
 * @extends {Model}
 */
class Card extends Model { }

Card.init(
    {
        id: {
            type: DataTypes.STRING(8),
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        img_url: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        level: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                min: 1,
                max: 12
            }
        },
        atk: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        def: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        attribute_id: {
            type: DataTypes.BIGINT,
            allowNull: true,
            references: {
                model: 'attribute',
                key: 'id'
            }
        },
        type_id: {
            type: DataTypes.BIGINT,
            allowNull: true,
            references: {
                model: 'type',
                key: 'id'
            }
        },
        card_type_id: {
            type: DataTypes.BIGINT,
            allowNull: true,
            references: {
                model: 'card_type',
                key: 'id'
            }
        }
    },
    {
        sequelize,
        modelName: 'Card',
        tableName: 'card',
        timestamps: false,
        underscored: true
    }
);

export default Card;
