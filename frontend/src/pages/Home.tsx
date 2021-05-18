import React, { useEffect, useState } from "react";
import MeetupsList from "../components/MeetupsList/MeetupsList";
import { Meetup } from "../interfaces/meetups";
import ApiService from "../services/ApiService";

type HomePageProps = {
  apiService: ApiService;
}

const Home =({ apiService }: HomePageProps) =>{
  const [meetups, setMeetups] = useState<Meetup[] | null>([]);

  useEffect(() => {
    apiService.getUpcomingMeetups().then((meetups) => {
      setMeetups(meetups);
    });
  }, []);

  return(
    <>
      <div className="flex flex-col items-start md:flex-row p-5">
        <MeetupsList meetups={meetups} />
      </div>
    </>
  )
}

export default Home;