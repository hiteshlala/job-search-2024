import { DataTypes, Model, Sequelize } from 'sequelize'

export default class Pet extends Model {
  id: number;
  name: string;
  userId: number;
  image: string;
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
      image: {
        type: DataTypes.STRING,
        defaultValue: '',
      },
      age: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      description: {
        type: DataTypes.STRING,
        defaultValue: '',
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
