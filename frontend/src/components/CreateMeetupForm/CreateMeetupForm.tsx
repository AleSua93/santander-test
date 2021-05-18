import React, { SyntheticEvent, useState } from "react";
import { Meetup } from "../../interfaces/meetups";
import ApiService from "../../services/ApiService";

type CreateMeetupFormProps = {
  apiService: ApiService;
}

const CreateMeetupForm = ({ apiService }: CreateMeetupFormProps) =>{
  const [currentDate] = useState<Date>(new Date());

  const [formData, setFormData] = useState<Meetup>({
    name: "",
    numPeople: 1,
    date: currentDate.toISOString().split("T")[0],
    estimatedBeerPacks: 0
  })

  const handleSubmit = async (ev: SyntheticEvent) => {
    ev.preventDefault();

    apiService.createMeetup(formData);
  }

  const handleNameChange = async (ev: SyntheticEvent<HTMLInputElement>) => {
    ev.preventDefault();

    setFormData({
      ...formData,
      name: ev.currentTarget.value
    })
  }

  const handleDateChange = async (ev: SyntheticEvent<HTMLInputElement>) => {
    ev.preventDefault();

    setFormData({
      ...formData,
      date: ev.currentTarget.value
    })
  }

  const handleNumPeopleChange = async (ev: SyntheticEvent<HTMLInputElement>) => {
    ev.preventDefault();

    const newNumPeople = parseInt(ev.currentTarget.value);

    setFormData({
      ...formData,
      numPeople: newNumPeople
    })
  }

  const getEstimatedBeerPacks = async (ev: SyntheticEvent) => {
    ev.preventDefault();

    const estimatedBeerPacks = await apiService.getNumberOfBeerPacks(formData.date, formData.numPeople);

    if (!estimatedBeerPacks) {
      setFormData({
        ...formData,
        estimatedBeerPacks: -1
      })
      return;
    }

    setFormData({
      ...formData,
      estimatedBeerPacks: estimatedBeerPacks
    })
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
            <input
              type="text"
              name="name"
              className="p-1 shadow border border-red-700 rounded focus:outline-none focus:shadow-outline" 
              value={formData.name}
              onChange={handleNameChange}
              required
            />
          </label>
          <label>
            <span className="mr-2">Estimated attendees</span>
            <input
              type="number"
              name="num-people"
              className="p-1 shadow border border-red-700 rounded focus:outline-none focus:shadow-outline" 
              value={formData.numPeople}
              onChange={handleNumPeopleChange}
              min={1}
              required
            />
          </label>
          <label>
            <span className="mr-2">Date</span>
            <input
              type="date"
              name="date"
              min={currentDate.toISOString().split("T")[0]}
              value={formData.date}
              onChange={handleDateChange}
              className="p-1 shadow border border-red-700 rounded focus:outline-none focus:shadow-outline" 
              required
            />
          </label>
          <div className="flex flex-column items-center mr-2">
            <div className="mr-5">
              Estimated 6-packs needed: {formData.estimatedBeerPacks >= 0 ? formData.estimatedBeerPacks : "N/A"}
            </div>
            <button className="btn btn-santander" onClick={getEstimatedBeerPacks}>Refresh</button>
          </div>
          <button type="submit" className="btn btn-santander">Create new meetup</button>
        </form>
        </div>
      </div>
    </>
  )
}

export default CreateMeetupForm;