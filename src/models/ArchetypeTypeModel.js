import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/Sequelize';

/**
 * Model representing a type inside an archetype
 * @class ArchetypeType
 * @extends {Model}
 */
class ArchetypeType extends Model {}

ArchetypeType.init(
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
        type_id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            allowNull: false,
            references: {
                model: 'type',
                key: 'id'
            }
        }
    },
    {
        sequelize,
        modelName: 'ArchetypeType',
        tableName: 'archetype_type',
        timestamps: false,
        underscored: true
    }
);

export default ArchetypeType;
