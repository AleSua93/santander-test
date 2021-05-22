import { useState } from "react";
import ApiService from "../../services/ApiService";
import PastMeetupsList from "./PastMeetupsList/PastMeetupsList";
import UpcomingMeetupsList from "./UpcomingMeetupsList.tsx/UpcomingMeetupsList";

type MeetupsListProps = {
  apiService: ApiService;
}

enum MeetupListTabs {
  UPCOMING = "upcoming",
  PAST = "past"
}

const MeetupsList = ({ apiService}: MeetupsListProps) =>{
  const [activeTab, setActiveTab] = useState<MeetupListTabs>(MeetupListTabs.UPCOMING);

  return(
    <>
      <div className="flex flex-col flex-grow self-stretch">
        <nav className="tabs flex flex-row">
          <button
            className={`tab ${activeTab === MeetupListTabs.UPCOMING ? "tab-active" : ""}`}
            onClick={() => {setActiveTab(MeetupListTabs.UPCOMING)}}
          >
            Upcoming
          </button>
          <button 
            className={`tab ${activeTab === MeetupListTabs.PAST ? "tab-active" : ""}`}
            onClick={() => {setActiveTab(MeetupListTabs.PAST)}}
          >
            Past
          </button>
        </nav>
        <div>
          {activeTab === MeetupListTabs.UPCOMING && <UpcomingMeetupsList apiService={apiService} />}
          {activeTab === MeetupListTabs.PAST && <PastMeetupsList apiService={apiService} />}
        </div>
      </div>
    </>
  )
}

export default MeetupsList;