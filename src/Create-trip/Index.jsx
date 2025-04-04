import React, { useEffect, useState } from "react";
import axios from "axios";
import cancelIcon from "../assets/close.png";
import { AI_PROMPT, SelectBudgetOptions, SelectTravelList } from "@/Constants/Options";
import { Button } from "../components/ui/button";
import { chatSession } from "@/Service/AIModel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";

function CreateTrip() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [formData, setFormData] = useState([]);
  const [openDailog, setOpenDailog] = useState(false)
  const [error, setError] = useState("");

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const login = useGoogleLogin({
    onSuccess: (codeResp) => GetUserProfile(codeResp),
    onError: (error) => console.log(error)
  })

  const OnGenerateTrip = async() => {
    console.log("OnGenerateTrip called");
    
  const storedUser = localStorage.getItem("user");

  if (!storedUser) {
    console.log("User not found, opening dialog...");
    setOpenDailog(true);
    console.log("Dialog should be open:", openDailog);
    return;
  }

    let newErrors = {};
  
    if (!formData?.noOfDays) {
      newErrors.noOfDays = "Please enter the number of days.";
    } else if (formData.noOfDays >= 7) {
      newErrors.noOfDays = "Please plan a trip for 7 days or less.";
    }
  
    if (!formData?.location) {
      newErrors.location = "Location is required.";
    }
    if (!formData?.budget) {
      newErrors.budget = "Budget is required.";
    }
    if (!formData?.Traveler) {
      newErrors.Traveler = "Traveler selection is required.";
    }
  
    setError(newErrors);
  
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    
    const FINAL_PROMPT = AI_PROMPT.replace(
      "{location}",
      formData?.location?.properties?.formatted
    )
      .replace("{totalDays}", formData?.noOfDays)
      .replace("{traveler}", formData?.Traveler)
      .replace("{budget}", formData?.budget)
      .replace("{totalDays}", formData?.noOfDays);

    console.log(FINAL_PROMPT);

    const result = await chatSession.sendMessage(FINAL_PROMPT);
    console.log(result?.response?.text());
   
  };
  
  const GetUserProfile = (tokenInfo) => {
    console.log("Google Login Success:", tokenInfo); 
    axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`,{
      headers:{
        Authorization:`Bearer ${tokenInfo?.access_token}`,
        Accept:'Application/json'
      }
    }).then((resp)=>{
      console.log(resp);
      localStorage.setItem('user',JSON.stringify(resp.data));
      setOpenDailog(false);
      OnGenerateTrip();
    })
  }

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  
   
    if (error[name]) {
      setError((prevErrors) => {
        const updatedErrors = { ...prevErrors };
        delete updatedErrors[name];
        return updatedErrors;
      });
    }
  };
  
  
  const fetchPlaces = async (input) => {
    if (!input) return;

    const apiKey = import.meta.env.VITE_GEOAPIFY_API_KEY;
    const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${input}&apiKey=${apiKey}`;

    try {
      const response = await axios.get(url);
      setSuggestions(response.data.features);
    } catch (error) {
      console.error("Error fetching places:", error);
    }
  };

  return (
    <div className="sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10">
      <h2 className="font-bold text-3xl">
        Tell us about your travel preferences
      </h2>
      <p className="mt-3 text-gray-500 text-base">
        Provide a few details, and our trip planner will create a personalized
        itinerary tailored to you.
      </p>

      <div className="mt-8 flex flex-col">
        <h2 className="text-xl font-medium mb-4">
          What is your destination of choice?
        </h2>
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              fetchPlaces(e.target.value);
            }}
            placeholder="Search for a city..."
            className="border p-2 w-full pr-8 rounded"
          />

          {query && (
            <img
              src={cancelIcon}
              alt="Cancel"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 cursor-pointer opacity-60 hover:opacity-100"
              onClick={() => {
                setQuery("");
                setSuggestions([]);
              }}
            />
          )}
        </div>

        {suggestions.length > 0 && (
          <ul className="border mt-2 bg-white shadow-md rounded">
            {suggestions.map((place, index) => (
              <li
                key={index}
                className="p-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => {
                  setQuery(place.properties.formatted);
                  setSuggestions([]);
                  handleInputChange("location", place);
                }}
              >
                {place.properties.formatted}
              </li>
            ))}
          </ul>
        )}
        {error.location && (
          <p className="text-red-500 text-sm mt-2">{error.location}</p>
        )}
      </div>
      <div>
        <h2 className="text-xl my-4 font-medium mt-8">
          How many days are you planning your trip?
        </h2>
        <input
          className="border p-2 w-full rounded"
          type="number"
          placeholder={"Ex.5"}
          min="0"
          onChange={(e) => handleInputChange("noOfDays", e.target.value)}
        />
        {error.noOfDays && (
          <p className="text-red-500 text-sm mt-2">{error.noOfDays}</p>
        )}
      </div>
      <div className="my-8">
        <h2 className="text-xl my-4 font-medium">What is your Budget?</h2>
        <div className="grid grid-cols-3 gap-4">
          {SelectBudgetOptions.map((item, index) => (
            <div
              key={index}
              onClick={() => handleInputChange("budget", item.title)}
              className={`p-4 border cursor-pointer rounded-lg hover:shadow-md text-center ${
                formData?.budget == item.title && "shadow-md border-black"
              }`}
            >
              <h2 className="text-4xl mb-4">{item.icon}</h2>
              <h2 className="font-bold text-lg">{item.title}</h2>
              <h2 className="text-sm text-gray-600">{item.desc}</h2>
            </div>
          ))}
        </div>
        {error.budget && (
          <p className="text-red-500 text-sm mt-2">{error.budget}</p>
        )}
      </div>

      <div className="my-8">
        <h2 className="text-xl my-4 font-medium">
          Who do you plan on traveling with on your next adventure?
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {SelectTravelList.map((item, index) => (
            <div
              key={index}
              onClick={() => handleInputChange("Traveler", item.people)}
              className={`p-4 border cursor-pointer rounded-lg hover:shadow-md text-center flex flex-col items-center ${
                formData?.Traveler == item.people && "shadow-md border-black"
              }`}
            >
              <img
                className="w-16 h-16 mb-3"
                src={item.icon}
                alt={item.title}
              />
              <h2 className="font-bold text-lg mb-1">{item.title}</h2>
              <h2 className="text-sm text-gray-600">{item.desc}</h2>
            </div>
          ))}
        </div>
        {error.Traveler && (
          <p className="text-red-500 text-sm mt-2">{error.Traveler}</p>
        )}
      </div>
      <div className="my-8 flex justify-end">
        {/* <Button onClick={OnGenerateTrip}>Generate Trip</Button> */}
        <button className="p-2 pr-4 pl-4 rounded-sm bg-black font-semibold text-white" onClick={OnGenerateTrip}>Generate Trip</button>
      </div>
      {openDailog && (
      <Dialog open={openDailog} onOpenChange={setOpenDailog}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription>
              <DialogTitle className="font-bold text-[32px] mt-4 mb-4 text-black items-center flex justify-center">Let's Start with TravelX</DialogTitle>
              <p className="w-[450px] text-center">To access all the functionalities and services, please log in to your account first.</p>
              <Button onClick={login} variant="outline" className={"w-full mt-4 flex gap-2 items-center border-1 border-black"}><FcGoogle className="h-24 w-24"/>Continue with Google</Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      )}
    </div>
  );
}

export default CreateTrip;
