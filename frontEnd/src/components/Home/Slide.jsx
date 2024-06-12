import React from 'react';

export default function Slide() {
  return (
    <div className="carousel w-full max-h-96">
      <div id="slide1" className="carousel-item relative w-full">
        <img 
          src="https://i.ibb.co/pbpjF4G/pexels-pavel-danilyuk-7108344.jpg" 
          className="w-full h-full object-cover" 
        />
        <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
          <a href="#slide3" className="btn btn-circle">❮</a> 
          <a href="#slide2" className="btn btn-circle">❯</a>
        </div>  
      </div> 
      <div id="slide2" className="carousel-item relative w-full">
        <img 
          src="https://i.ibb.co/hLppRZr/front-view-back-school-covid-concept.jpg" 
          className="w-full h-full object-cover" 
        />
        <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
          <a href="#slide1" className="btn btn-circle">❮</a> 
          <a href="#slide3" className="btn btn-circle">❯</a>
        </div>
      </div> 
      <div id="slide3" className="carousel-item relative w-full">
        <img 
          src="https://i.ibb.co/w4RCf3r/48271.jpg" 
          className="w-full h-full object-cover" 
        />
        <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
          <a href="#slide2" className="btn btn-circle">❮</a> 
          <a href="#slide1" className="btn btn-circle">❯</a>
        </div>
      </div> 
    </div>
  );
}
