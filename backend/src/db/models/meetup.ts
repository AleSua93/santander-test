import { Model, Optional, DataTypes } from 'sequelize';
import { sequelize } from './index';
import Sequelize from 'sequelize';
import User, { UserInstance } from './user';

export interface MeetupAttributes {
  id: number;
  name: string;
  date: string;
  numPeople: number;
  estimatedBeerPacks?: number;
  tempInCelsius?: number;
};

interface MeetupCreationAttributes
  extends Optional<MeetupAttributes, 'id'> {}

export interface MeetupInstance
  extends Model<MeetupAttributes, MeetupCreationAttributes>,
  MeetupAttributes {
      createdAt?: Date;
      updatedAt?: Date;
      getSubscriptions: Sequelize.BelongsToManyGetAssociationsMixin<UserInstance>;
      addSubscription: Sequelize.BelongsToManyAddAssociationMixin<MeetupInstance, number>;
      hasSubscription: Sequelize.BelongsToManyHasAssociationMixin<MeetupInstance, number>;
      removeSubscription: Sequelize.BelongsToManyRemoveAssociationMixin<MeetupInstance, number>;
      hasCheckin: Sequelize.BelongsToManyHasAssociationMixin<MeetupInstance, number>;
      removeCheckin: Sequelize.BelongsToManyRemoveAssociationMixin<MeetupInstance, number>;
      addCheckin: Sequelize.BelongsToManyAddAssociationMixin<MeetupInstance, number>;
    }

const Meetup = sequelize.define<MeetupInstance>(
  'Meetup',
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
    date: {
      allowNull: false,
      type: DataTypes.DATEONLY
    },
    numPeople: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    estimatedBeerPacks: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    tempInCelsius: {
      allowNull: true,
      type: DataTypes.DECIMAL,
    }
  }
);

Meetup.belongsToMany(User, { through: 'Subscriptions', as: 'subscriptions' });
Meetup.belongsToMany(User, { through: 'Checkins', as: 'checkins' });
User.belongsToMany(Meetup, { through: 'Subscriptions' });
User.belongsToMany(Meetup, { through: 'Checkins' });

export default Meetup;