import { DataTypes, Model, Sequelize } from 'sequelize'

export default class Pet extends Model {
  id: number;
  name: string;
  userId: number;
  images: string[];
  age: number;
  description: string;
}

export function initPets(sequelize: Sequelize) {
  Pet.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      images: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
        validate: {
          validateIsArray(value) {
            if (!Array.isArray(value)) {
              throw new Error('Images must be an array of strings');
            }
          },
        },
      },
      age: {
        type: DataTypes.INTEGER,
      },
      description: {
        type: DataTypes.STRING,
      },
      checkedOutBy: {
        type: DataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        },
      }
    },
    {
      sequelize, 
      modelName: 'Pet',
      tableName: 'pets',
      timestamps: true,
     }
  );
}
