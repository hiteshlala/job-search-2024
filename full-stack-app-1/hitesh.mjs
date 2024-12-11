import crypto from 'node:crypto';
import fs from 'node:fs';
import { Sequelize, Model, DataTypes } from 'sequelize';

// tar -xzvf myfile.tar.gz

export const sequelize = new Sequelize({
  dialect: 'postgres',
  database: 'postgres',
  username: 'posrgres', // note the spelling mistake
  password: '',
  host: '127.0.0.1',
  port: 5432,
  // logging: false,
});

class User extends Model {}
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
class Pet extends Model {}
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

User.hasMany(Pet, { foreignKey: 'userId', as: 'pets' });
Pet.belongsTo(User, { foreignKey: 'userId', as: 'owner' });

const names = fs.readFileSync('/usr/share/dict/propernames', { encoding: 'utf8' }).split('\n');
const numNames = 1309;


const imgDir = '/Users/hiteshlala/Programming/Cat-faces-dataset/dataset-part1';
const numImages = 10000;

const img = (num) => `cat_${num}.png`;

const assets = '/Users/hiteshlala/Programming/job-search-2024/full-stack-app-1/frontend/public/images'
// const assets = '/Users/hiteshlala/Programming/job-search-2024/full-stack-app-1/static/images';

const hash = (password) => {
  const salt = 5897;
  return crypto.createHash('sha256').update(`${password}${salt}`).digest('hex');
}
// console.log(hash('this is a string'));

const users = ['hitesh', 'seema', 'preethi', 'nagin', 'jasu'];
const setupUsers = async () => {
  for(let i = 0; i < users.length; i++) {
    const user = await User.create({
      name: users[i],
      password: hash(users[i]),
    });
  }
}
setupUsers().then(() => console.log('setup users')).catch(console.log);

const createSomePets = async () => {
  for(let i = 0; i < users.length; i++) {
    // the key for each user is (i + 1)
    const noPets = Math.floor(Math.random() * 8);
    for(let p = 0; p < noPets; p++) {
      const imagName = `${crypto.randomUUID()}.png`;
      fs.copyFileSync(
        `${imgDir}/${img(Math.floor(Math.random() * numImages))}`,
        `${assets}/${imagName}` 
      );
      
      await Pet.create({
        name: names[Math.floor(Math.random() * numNames)],
        userId: i+1,
        images: [`images/${imagName}`],
      });
    }
  }
};
// createSomePets().then(() => console.log('setup pets')).catch(console.log);

const test = async () => {
  const name = 'nagin';
  const user = await User.findOne({
    where: { 
      name,
      password: hash(name)
    },
  });
  // console.log(user);

  const pets = (await user.getPets()).map((pet) => ({ 
    images: pet.images,
    name: pet.name,
    age: pet.age,
    description: pet.description,
    checkedOutBy: pet.checkedOutBy,
  }));
  console.log(pets);

  await sequelize.close();
};
// test().catch(console.log)