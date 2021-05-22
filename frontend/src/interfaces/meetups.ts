export interface Meetup {
  name: string;
  numPeople: number;
  date: string;
  estimatedBeerPacks: number;
  tempInCelsius?: number;
}

interface ExtendedMeetup extends Meetup{
  id: number;
}

export interface UpcomingMeetup extends ExtendedMeetup {
  isUserSubscribed: boolean;
}

export interface PastMeetup extends ExtendedMeetup {
  didUserAssist: boolean;
}