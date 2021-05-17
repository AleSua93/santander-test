import React, { SyntheticEvent, useEffect, useState } from "react";

const CreateMeetupForm = () =>{
  const [currentDate] = useState<Date>(new Date());
  const [estimatedSixPacks, setEstimatedSixPacks] = useState<number | null>(null);

  const handleSubmit = async (ev: SyntheticEvent) => {
    ev.preventDefault();

    console.log("submitting data...");
  }

  const handleDateChange = async (ev: SyntheticEvent<HTMLInputElement>) => {
    console.log(`date changed to ${ev.currentTarget.value}`);
  }

  return(
    <>
      <div className="flex-grow mb-auto bg-white border-2 border-red-200 rounded shadow-md p-3 m-3">
        <div className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate mb-5">
          Create new meetup
        </div>
        <div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <label>
            <span className="mr-2">Meetup name</span>
            <input type="text" name="name" className="p-1 shadow border border-red-700 rounded focus:outline-none focus:shadow-outline" />
          </label>
          <label>
            <span className="mr-2">Estimated attendees</span>
            <input type="number" name="num-people" className="p-1 shadow border border-red-700 rounded focus:outline-none focus:shadow-outline" />
          </label>
          <label>
            <span className="mr-2">Date</span>
            <input
              type="date"
              name="date"
              min={currentDate.toISOString().split("T")[0]}
              onChange={handleDateChange}
              className="p-1 shadow border border-red-700 rounded focus:outline-none focus:shadow-outline" 
            />
          </label>
          <div className="mr-2">Estimated 6-packs needed: {estimatedSixPacks}</div>
          <input type="submit" value="Create new meetup" className="btn btn-santander"/>
        </form>
        </div>
      </div>
    </>
  )
}

export default CreateMeetupForm;