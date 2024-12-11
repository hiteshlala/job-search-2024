import { DataTypes, Model, Sequelize } from 'sequelize'

export default class User extends Model {
  id: number;
  name: string;
  password: string;
  getPets: () => any[];
  pets: any[];
}

export function initUser(sequelize: Sequelize) {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
      }
    },
    { 
      sequelize, 
      modelName: 'User',
      tableName: 'users',
      timestamps: true,
    }
  )
}


