export interface Meetup {
  name: string;
  numPeople: number;
  date: string;
  estimatedBeerPacks: number;
  tempInCelsius?: number;
}

export interface MeetupWithId {
  id: number;
  name: string;
  numPeople: number;
  date: string;
  estimatedBeerPacks: number;
  tempInCelsius?: number;
  Users: {id: number}[]
}
