import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { ExtendedMeetup } from "../../interfaces/meetups";
import ApiService from "../../services/ApiService";

type MeetupsListProps = {
  apiService: ApiService;
}

const MeetupsList = ({ apiService}: MeetupsListProps) =>{
  const [meetups, setMeetups] = useState<ExtendedMeetup[] | null>([]);
  const auth = useAuth();

  useEffect(() => {
    refreshMeetups();
  }, []);

  const refreshMeetups = async() => {
    apiService.getUpcomingMeetups(auth && auth?.jwt).then((meetups) => {
      setMeetups(meetups);
    });
  }
  
  const handleMeetupSubscription = async (meetupId: number) => {
    await apiService.subscribeToMeetup(meetupId, auth?.jwt);
    refreshMeetups();
  }

  const handleMeetupUnsubscription = async (meetupId: number) => {
    await apiService.unsubscribeToMeetup(meetupId, auth?.jwt);
    refreshMeetups();
  }

  return(
    <>
      <div className="self-stretch flex-grow bg-white border-2 border-red-200 rounded shadow-md p-3 my-3 md:mx-3">
        <div className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate mb-5">
          Upcoming meetups
        </div>
        <ul className="divide-y-2 divide-gray-300">
        {meetups ?
            meetups.map((meetup, idx) => {
              return <li key={`forecast-${idx}`} className="py-3 flex flex-row justify-between">
                <div className="flex flex-col md:flex-row items-center gap-3">
                  <div><span className="font-bold">Name: </span>{meetup.name}</div>
                  <div><span className="font-bold">Date: </span>{meetup.date}</div>
                  <div><span className="font-bold">Temp: </span>{meetup.tempInCelsius ?? "-"} °C</div>
                  {meetup.isUserSubscribed ?
                    <div className="font-bold text-green-500">Assisting</div> : 
                    <></>
                  }
                </div>
                <div className="flex flex-col justify-center">
                {meetup.isUserSubscribed ? 
                  <button onClick={() => handleMeetupUnsubscription(meetup.id)} className="btn btn-santander">
                    Cancel
                  </button> : 
                  <button onClick={() => handleMeetupSubscription(meetup.id)} className="btn btn-santander">
                    Subscribe
                  </button>
                }
                </div>
              </li>
            })
          :""}
        </ul>
      </div>
    </>
  )
}

export default MeetupsList;