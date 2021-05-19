import { Model, Optional, DataTypes } from 'sequelize';
import { sequelize } from './index';
import User from './user';
import UserRole from './user-role';

export interface RoleAttributes {
  id: number;
  name: string;
};

/*
  We have to declare the AuthorCreationAttributes to
  tell Sequelize and TypeScript that the property id,
  in this case, is optional to be passed at creation time
*/
interface RoleCreationAttributes
  extends Optional<RoleAttributes, 'id'> {}

export interface RoleInstance
  extends Model<RoleAttributes, RoleCreationAttributes>,
  RoleAttributes {
      createdAt?: Date;
      updatedAt?: Date;
    }

const Role = sequelize.define<RoleInstance>(
  'Role',
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
      unique: true,
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
  }
);

Role.belongsToMany(User, { through: UserRole });

export default Role;