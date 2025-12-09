import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/Sequelize';

/**
 * Model representing a summon mechanic inside an archetype
 * @class ArchetypeSummonMechanic
 * @extends {Model}
 */
class ArchetypeSummonMechanic extends Model {}

ArchetypeSummonMechanic.init(
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
        summonmechanic_id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            allowNull: false,
            references: {
                model: 'summonmechanic',
                key: 'id'
            }
        }
    },
    {
        sequelize,
        modelName: 'ArchetypeSummonMechanic',
        tableName: 'archetype_summonmechanic',
        timestamps: false,
        underscored: true
    }
);

export default ArchetypeSummonMechanic;
