import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import b1 from "../../assets/banner/banner1.png";
import b2 from "../../assets/banner/banner2.png";
import b3 from "../../assets/banner/banner3.png";

const Banner = () => {
  return (
    <Carousel autoPlay={true} infiniteLoop={true}>
      <div>
        <img src={b1} />
        <p className="legend">Legend 1</p>
      </div>
      <div>
        <img src={b2} />
        <p className="legend">Legend 2</p>
      </div>
      <div>
        <img src={b3} />
        <p className="legend">Legend 3</p>
      </div>
    </Carousel>
  );
};

export default Banner;
