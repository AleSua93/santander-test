import { Model, Optional, DataTypes } from 'sequelize';
import { sequelize } from './index';
import Role from './role';
import UserRole from './user-role';

export interface UserAttributes {
  id: number;
  username: string;
  email: string;
  password: string;
};

/*
  We have to declare the AuthorCreationAttributes to
  tell Sequelize and TypeScript that the property id,
  in this case, is optional to be passed at creation time
*/
interface UserCreationAttributes
  extends Optional<UserAttributes, 'id'> {}

export interface UserInstance
  extends Model<UserAttributes, UserCreationAttributes>,
  UserAttributes {
      createdAt?: Date;
      updatedAt?: Date;
    }

const User = sequelize.define<UserInstance>(
  'User',
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
      unique: true,
    },
    username: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING,
    }
  }
);

User.belongsToMany(Role, { through: UserRole });

export default User;