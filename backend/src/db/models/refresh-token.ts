import { Model, Optional, DataTypes } from 'sequelize';
import { sequelize } from './index';
import User from './user';

export interface RefreshTokenAttributes {
  id: number;
  token: string;
  validUntil: Date;
};

interface RefreshTokenCreationAttributes
  extends Optional<RefreshTokenAttributes, 'id'> {}

export interface RefreshTokenInstance
  extends Model<RefreshTokenAttributes, RefreshTokenCreationAttributes>,
  RefreshTokenAttributes {
      createdAt?: Date;
      updatedAt?: Date;
    }

const RefreshToken = sequelize.define<RefreshTokenInstance>(
  'RefreshToken',
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
      unique: true,
    },
    token: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    validUntil: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }
);

User.hasOne(RefreshToken);
RefreshToken.belongsTo(User);

export default RefreshToken;