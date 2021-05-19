import { Model, Optional, DataTypes } from 'sequelize';
import { sequelize } from './index';
import Role from './role';
import User from './user';

export interface UserRoleAttributes {
  id: number;
  userId: number;
  roleId: number;
};

/*
  We have to declare the AuthorCreationAttributes to
  tell Sequelize and TypeScript that the property id,
  in this case, is optional to be passed at creation time
*/
interface UserRoleCreationAttributes
  extends Optional<UserRoleAttributes, 'id'> {}

export interface UserRoleInstance
  extends Model<UserRoleAttributes, UserRoleCreationAttributes>,
  UserRoleAttributes {
      createdAt?: Date;
      updatedAt?: Date;
    }

const UserRole = sequelize.define<UserRoleInstance>(
  'UserRole',
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
      unique: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id'
      }
    },
    roleId: {
      type: DataTypes.INTEGER,
      references: {
        model: Role,
        key: 'id'
      }
    }
  }, {
    tableName: 'UserRole'
  }
);

export default UserRole;