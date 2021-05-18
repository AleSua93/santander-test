import { Meetup } from "../../interfaces/meetups";

type MeetupsListProps = {
  meetups: Meetup[] | null;
}

const MeetupsList = (props: MeetupsListProps) =>{
  return(
    <>
      <div className="flex-grow bg-white border-2 border-red-200 rounded shadow-md p-3 m-3">
        <div className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate mb-5">
          Upcoming meetups
        </div>
        <ul className="divide-y-2 divide-gray-300">
        {props.meetups ?
            props.meetups.map((meetup, idx) => {
              return <li key={`forecast-${idx}`} className="py-2 flex gap-3">
                  <div><span className="font-bold">Name: </span>{meetup.name}</div>
                  <div><span className="font-bold">Date: </span>{meetup.date}</div>
                  <div><span className="font-bold">Temp: </span>{meetup.tempInCelsius ?? "-"} °C</div>
              </li>
            })
          :""}
        </ul>
      </div>
    </>
  )
}

export default MeetupsList;