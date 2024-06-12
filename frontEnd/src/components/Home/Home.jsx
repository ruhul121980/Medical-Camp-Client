import React from "react";
import Slide from "./Slide";
import PopularCamps from "./PopularCamps";
import Feedback from "./Feedback";
import Frequently from "./Frequently";


export default function Home() {
  return (
    <div>
      <div className="">
      <Slide />
      <div className="max-w-4xl mx-auto">
      <PopularCamps></PopularCamps>
      </div>
      <Feedback></Feedback>
      </div>
      <Frequently></Frequently>
     
      
      
    </div>
  );
}
