import { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { PastMeetup, UpcomingMeetup } from "../../../interfaces/meetups";
import ApiService from "../../../services/ApiService";

type PastMeetupsListProps = {
  apiService: ApiService;
}

const PastMeetupsList = ({ apiService }: PastMeetupsListProps) =>{
  const [meetups, setMeetups] = useState<PastMeetup[]>([]);
  const auth = useAuth();

  useEffect(() => {
    refreshMeetups();
  }, []);

  const refreshMeetups = async() => {
    apiService.getPastMeetups(auth && auth?.jwt).then((meetups) => {
      setMeetups(meetups);
    });
  }

  return(
    <>
      <div className="self-stretch flex-grow bg-white border-2 border-red-200 rounded shadow-md p-3">
        <div className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate mb-5">
          Past meetups
        </div>
        <ul className="divide-y-2 divide-gray-300">
        {meetups ?
            meetups.map((meetup, idx) => {
              return <li key={`forecast-${idx}`} className="py-3 flex flex-row justify-between">
                <div className="flex flex-col md:flex-row items-center gap-3">
                  <div><span className="font-bold">Name: </span>{meetup.name}</div>
                  <div><span className="font-bold">Date: </span>{meetup.date}</div>
                  <div><span className="font-bold">Temp: </span>{meetup.tempInCelsius ?? "-"} °C</div>
                  {meetup.didUserAssist ?
                    <div className="font-bold text-green-500">Checked in!</div> : 
                    <></>
                  }
                </div>
                <div className="flex flex-col justify-center">
                {meetup.didUserAssist ? 
                  <button onClick={() => console.log(meetup.id)} className="btn btn-santander">
                    Cancel
                  </button> : 
                  <button onClick={() => console.log(meetup.id)} className="btn btn-santander">
                    Check-in
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

export default PastMeetupsList;