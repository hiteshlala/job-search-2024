import { Sequelize } from 'sequelize';
import User, { initUser } from './models/User';
import Pet, { initPets } from './models/Pet';
import Session, { initSessions } from './models/Session';

export const sequelize = new Sequelize({
  dialect: 'postgres',
  database: 'postgres',
  username: 'posrgres', // note the spelling mistake
  password: '',
  host: '127.0.0.1',
  port: 5432,
});

initUser(sequelize);
initPets(sequelize);
initSessions(sequelize);

User.hasMany(Pet, { foreignKey: 'userId', as: 'pets' });
User.hasMany(Session, { foreignKey: 'userId', as: 'sessions' });
Pet.belongsTo(User, { foreignKey: 'userId', as: 'owner' });
Session.belongsTo(User,{ foreignKey: 'userId', as: 'loggedIn' });

sequelize.sync({ alter: true })
.then((result) => {
  console.log('sequelize ready')
})
.catch(error => {
  console.log('sequelize error', error.message);
});
