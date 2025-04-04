import SoloIcon from "../Constants/assets/Solo.png";
import FamIcon from "../Constants/assets/Family-trip.png";
import FriendIcon from "../Constants/assets/Friends.png";
import CoupleIcon from "../Constants/assets/Couple.png";

export const SelectTravelList = [
  {
    id: 1,
    title: "Solo",
    desc: "Embark on a solo adventure of self-discovery",
    icon: SoloIcon,
    people: "1",
  },
  {
    id: 2,
    title: "Couple",
    desc: "A perfect journey for two exploring together",
    icon: CoupleIcon,
    people: "2",
  },
  {
    id: 3,
    title: "Family",
    desc: "An exciting getaway for a group of fun-loving travelers.",
    icon: FamIcon,
    people: "4",
  },
  {
    id: 4,
    title: "Friends",
    desc: "A thrilling expedition for adventure seekers.",
    icon: FriendIcon,
    people: "7",
  },
];

export const SelectBudgetOptions = [
  {
    id: 1,
    title: "Low",
    desc: "0 - 1000 USD",
    icon: "💵",
  },
  {
    id: 2,
    title: "Medium",
    desc: "1000 - 2500 USD",
    icon: "💵",
  },
  {
    id: 3,
    title: "Luxury",
    desc: "2500+ USD",
    icon: "💵",
  },
];

export const AI_PROMPT =
  "Generate Travel plan for Location : {location} for {totalDays} Days for {traveler} with a {budget} budget, give me Hotels options list with HotelName, Hotel address, Price, hotel image url, geo coordinates, rating, descriptions and suggest itinerary with placeName, Place Details, Place Image Url, Geo Coordinates, ticket Pricing, Time travel each of the location for {totalDays} days with each day plan with best time to visit in JSON format.";
