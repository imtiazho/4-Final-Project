import React from "react";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import b1 from "../../assets/brands/amazon.png";
import b2 from "../../assets/brands/amazon_vector.png";
import b3 from "../../assets/brands/casio.png";
import b4 from "../../assets/brands/moonstar.png";
import b5 from "../../assets/brands/randstad.png";
import b6 from "../../assets/brands/start-people 1.png";
import b7 from "../../assets/brands/start.png";
import { Autoplay } from 'swiper/modules';

const Brands = () => {
  return (
    <Swiper
      slidesPerView={4}
      centeredSlides={true}
      spaceBetween={30}
      grabCursor={true}
      loop={true}
      autoplay={{
        delay: 1000,
        disableOnInteraction: false,
      }}
      modules={[Autoplay]}
      className="mySwiper"
    >
      <SwiperSlide>
        <img src={b1} alt="" />
      </SwiperSlide>
      <SwiperSlide>
        <img src={b2} alt="" />
      </SwiperSlide>
      <SwiperSlide>
        <img src={b3} alt="" />
      </SwiperSlide>
      <SwiperSlide>
        <img src={b4} alt="" />
      </SwiperSlide>
      <SwiperSlide>
        <img src={b5} alt="" />
      </SwiperSlide>
      <SwiperSlide>
        <img src={b6} alt="" />
      </SwiperSlide>
      <SwiperSlide>
        <img src={b7} alt="" />
      </SwiperSlide>
    </Swiper>
  );
};

export default Brands;
