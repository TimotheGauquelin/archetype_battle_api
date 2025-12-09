import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/Sequelize';

/**
 * Model representing an attribute inside an archetype
 * @class ArchetypeAttribute
 * @extends {Model}
 */
class ArchetypeAttribute extends Model {}

ArchetypeAttribute.init(
    {
        archetype_id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            allowNull: false,
            references: {
                model: 'archetype',
                key: 'id'
            }
        },
        attribute_id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            allowNull: false,
            references: {
                model: 'attribute',
                key: 'id'
            }
        }
    },
    {
        sequelize,
        modelName: 'ArchetypeAttribute',
        tableName: 'archetype_attribute',
        timestamps: false,
        underscored: true
    }
);

export default ArchetypeAttribute;
