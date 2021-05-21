export interface Meetup {
  name: string;
  numPeople: number;
  date: string;
  estimatedBeerPacks: number;
  tempInCelsius?: number;
}

export interface ExtendedMeetup extends Meetup {
  id: number;
  isUserSubscribed: boolean;
}
