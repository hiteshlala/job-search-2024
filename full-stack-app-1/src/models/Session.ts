import { DataTypes, Model, Sequelize } from 'sequelize'

export default class Session extends Model {
  id: number;
  key: string;
  userId: number;
  // https://github.com/sequelize/sequelize/issues/1774
  expires: number;
}

export function initSessions(sequelize: Sequelize) {
  Session.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      key: {
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
      expires: {
        type: DataTypes.BIGINT,
        
      },
    },
    {
      sequelize, 
      modelName: 'Session',
      tableName: 'sessions',
      timestamps: true,
     }
  );
}
