import { Model, Optional, DataTypes } from 'sequelize';
import { sequelize } from './index';
import Sequelize from 'sequelize';
import { RoleInstance } from './role';
import { MeetupInstance } from './meetup';
import { RefreshTokenInstance } from './refresh-token';

export interface UserAttributes {
  id: number;
  username: string;
  email: string;
  password: string;
};

interface UserCreationAttributes
  extends Optional<UserAttributes, 'id'> {}

export interface UserInstance
  extends Model<UserAttributes, UserCreationAttributes>,
  UserAttributes {
      createdAt?: Date;
      updatedAt?: Date;
      getRoles: Sequelize.BelongsToManyGetAssociationsMixin<RoleInstance>;
      getMeetups: Sequelize.BelongsToManyGetAssociationsMixin<MeetupInstance>;
      addMeetup: Sequelize.BelongsToManyAddAssociationMixin<UserInstance, MeetupInstance>;
      createRefreshToken: Sequelize.HasOneCreateAssociationMixin<RefreshTokenInstance>;
      getRefreshToken: Sequelize.HasOneGetAssociationMixin<RefreshTokenInstance>;
      setRefreshToken: Sequelize.HasOneSetAssociationMixin<UserInstance, RefreshTokenInstance>;
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

export default User;