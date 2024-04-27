import React from "react";
import Layout from "../components/Layout/Layout";
import HomeCarousel from "./HomeFeatures/HomeCarousel";
import HomeFeatures from "./HomeFeatures/HomeFeatuers";
import HomeProducts from "./HomeFeatures/HomeProducts";
import { Box, Flex, Stack, Toast } from "@chakra-ui/react";
import ProductCard from "./products/ProductCard";
import ProductsBox from "./products/ProductsBox";
import FourBoxesLayout from "./products/FourBoxesLayout";


function Home() {
  return (
    <Layout title="Home Page">

      <HomeCarousel />
      <Stack mx={4} spacing={4} direction={{ lg: "row", md: "column", base: "column" }}>
       
        <Box flex={{ lg: 3, md: "100%", base: "100%" }}>
          <HomeProducts />
          <FourBoxesLayout />
          <HomeFeatures />

        </Box>
        {/* <Box flex={1}>
          <HomeFeatures />
        </Box> */}
      </Stack>

    </Layout>
  );
}

export default Home;
