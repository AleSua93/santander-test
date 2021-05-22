import { Model, Optional, DataTypes } from 'sequelize';
import { sequelize } from './index';
import User from './user';

export interface RoleAttributes {
  id: number;
  name: string;
};

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

Role.belongsToMany(User, { through: 'UserRole' });
User.belongsToMany(Role, { through: 'UserRole' });

export default Role;