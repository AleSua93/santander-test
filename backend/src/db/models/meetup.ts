import { Model, Optional, DataTypes } from 'sequelize';
import { sequelize } from './index';

export interface MeetupAttributes {
  id: number;
  name: string;
  date: string;
  numPeople: number;
  estimatedBeerPacks: number;
  tempInCelsius?: number;
};

/*
  We have to declare the AuthorCreationAttributes to
  tell Sequelize and TypeScript that the property id,
  in this case, is optional to be passed at creation time
*/
interface MeetupCreationAttributes
  extends Optional<MeetupAttributes, 'id'> {}

interface MeetupInstance
  extends Model<MeetupAttributes, MeetupCreationAttributes>,
  MeetupAttributes {
      createdAt?: Date;
      updatedAt?: Date;
    }


// ... instances code

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
      type: DataTypes.TEXT,
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
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    tempInCelsius: {
      allowNull: true,
      type: DataTypes.DECIMAL,
    }
  }
);

export default Meetup;