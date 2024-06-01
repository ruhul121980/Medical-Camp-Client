import React from 'react';

export default function Slide() {
  return (
    <div className="carousel w-full max-h-96">
      <div id="slide1" className="carousel-item relative w-full">
        <img src="https://i.ibb.co/G7z9QB2/vecteezy-close-up-carpenter-working-carving-wood-ai-generative-32417434.jpg" className="w-full h-auto" />
        <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
          <a href="#slide3" className="btn btn-circle">❮</a> 
          <a href="#slide2" className="btn btn-circle">❯</a>
        </div>
      </div> 
      <div id="slide2" className="carousel-item relative w-full">
        <img src="https://i.ibb.co/f957Zd6/vecteezy-exquisite-craftsmanship-traditional-russian-birch-bark-products-24069183.jpg" className="w-full h-auto" />
        <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
          <a href="#slide1" className="btn btn-circle">❮</a> 
          <a href="#slide3" className="btn btn-circle">❯</a>
        </div>
      </div> 
      <div id="slide3" className="carousel-item relative w-full">
        <img src="https://i.ibb.co/y8qpFzp/vecteezy-ai-gerado-trabalhos-manuais-propaganda-fundo-com-copia-de-37245072.jpg" className="w-full h-auto" />
        <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
          <a href="#slide2" className="btn btn-circle">❮</a> 
          <a href="#slide1" className="btn btn-circle">❯</a>
        </div>
      </div> 
    </div>
  );
}
