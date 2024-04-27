import React from "react";
import { Box, IconButton, useBreakpointValue } from "@chakra-ui/react";
import toast from 'react-hot-toast'
import { BiLeftArrowAlt, BiRightArrowAlt } from "react-icons/bi";
import Slider from "react-slick";
import { useState,useEffect } from "react";
import axios from "axios";

// Settings for the slider
const settings = {
  dots: true,
  arrows: false,
  fade: true,
  infinite: true,
  autoplay: true,
  speed: 500,
  autoplaySpeed: 5000,
  slidesToShow: 1,
  slidesToScroll: 1,
};

export default function Carousel() {
  const [slider, setSlider] = React.useState(null);
  const [cards,setCards] = useState(["https://bit.ly/3ITGAs6"])

  const top = useBreakpointValue({ base: "45%", md: "50%" });
  const side = useBreakpointValue({ base: "2%", md: "10px" });


  // get latest offers images
  // form function
  const fetchImages = async (e) => {
   
    setCards([
      "https://m.media-amazon.com/images/I/61P7hqIHrdL._SX3000_.jpg",
      "https://bit.ly/3L83TBc",
      "https://m.media-amazon.com/images/I/61zAjw4bqPL._SX3000_.jpg",
      "https://m.media-amazon.com/images/I/61CiqVTRBEL._SX3000_.jpg"
    ])
    // try {
    //   const res = await axios.get(" /advertisements");
    //   console.log(res)

    //   if (res && res.data.success) {
    //     setCards(res.data);
    //   } else {
    //     toast.error(res.data.message);
    //   }
    // } catch (error) {
    //   console.log(error);
    //   toast.error("Something went wrong");
    // }
  };
 
  useEffect(() => {
    fetchImages()
  }, [])


  return (
    <Box position={"relative"} height="350px" width={"full"} overflow={"hidden"}>
      {/* for arrows css */}
      <link
        rel="stylesheet"
        type="text/css"
        charSet="UTF-8"
        href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
      />
      <link
        rel="stylesheet"
        type="text/css"
        href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
      />
      {/* Left Icon */}
      <IconButton
        className="banner_left_arrow"
        aria-label="left-arrow"
        position="absolute"
        left={side}
        top={top}
        transform={"translate(0%, -50%)"}
        zIndex={2}
        onClick={() => slider?.slickPrev()}
      >
        <BiLeftArrowAlt />
      </IconButton>
      {/* Right Icon */}
      <IconButton
        className="banner_right_arrow"
        aria-label="right-arrow"
        position="absolute"
        right={side}
        top={top}
        transform={"translate(0%, -50%)"}
        zIndex={2}
        onClick={() => slider?.slickNext()}
      >
        <BiRightArrowAlt />
      </IconButton>
      {/* Slider */}
      <Slider {...settings} ref={(slider) => setSlider(slider)}>
        {cards.map((url, index) => (
          <img src={url} alt="banner_image" />
        ))}
      </Slider>
    </Box>
  );
}
