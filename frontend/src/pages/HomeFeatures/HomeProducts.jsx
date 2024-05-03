import React, { useEffect, useState } from "react";
import ProductCard from "../products/ProductCard";
import {
  Box,
  Checkbox,
  Radio,
  RadioGroup,
  Stack,
  Grid,
  Button,
  Text,
  Divider,
  Flex,
  useBreakpointValue,
  Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/cart";
// import { Prices } from "../components/Prices";

import { AiOutlineReload } from "react-icons/ai";
import Recommended from "../../components/recommendations/Recommended";

function HomeProducts() {
  const navigate = useNavigate();
  const [cart, setCart] = useCart();

  const [filteredProduct, setfilterProduct] = useState([])
  const [ratedProduct, setRatedProduct] = useState([])

  const [categories, setCategories] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [priceFilter, setPriceFilter] = useState([]);

  const [Prices, setPrices] = useState([
    { name: 'less than 300', min: 0, max: 300, array: [0, 300] },
    { name: '300-1000', min: 200, max: 500, array: [300, 1000] },
    { name: '1000-2000', min: 200, max: 500, array: [1000, 2000] },
    { name: '2000-5000', min: 200, max: 500, array: [2000, 5000] },
    { name: 'Above 5000', min: 200, max: 500, array: [5000, 10000000] },
  ]);

  const [loading, setLoading] = useState(false);



  //get all category
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        "category/list"
      );
      if (data?.success) {
        setCategories(data?.categories);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategory();
    getAllProducts();
    getAllTopRatedProducts();

  }, []);
  //get products
  const getAllProducts = async () => {
    console.log("calling prodcts")
    try {
      setLoading(true);
      const { data } = await axios.post(
        "product/trending",
        {
          "page": 1,
          "size": 8,
          "category": categoryFilter,
          "price": priceFilter
        }
      );
      console.log(data)
      setfilterProduct(data.product)
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const getAllTopRatedProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        "product/toprated",
        {
          "page": 1,
          "size": 5,
          "category": categoryFilter,
          "price": priceFilter
        }
      );
      console.log(data)
      setRatedProduct(data.product)
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };


  useEffect(() => {
    getAllProducts();
    getAllTopRatedProducts();
  }, [priceFilter, categoryFilter]);



  const handleCategoryChange = (category) => {
    // Check if the category is already selected
    if (categoryFilter.includes(category)) {
      // If yes, remove it
      setCategoryFilter(categoryFilter.filter(cat => cat !== category));
    } else {
      // If not, add it
      setCategoryFilter([...categoryFilter, category]);
    }

  };

  const isSmallScreen = useBreakpointValue({ base: true, md: false });



  return (
    <>
      {/* <HomeProductFilter /> */}

      <Box className="home_products_page" textAlign="center">

        {loading && <Spinner />}
        {!loading && <Box className="home_products">
          <Text mt={8} fontSize="2xl" ml={8} fontWeight="bold">Top Rated Products</Text>
          {ratedProduct?.map((p) => (
            <ProductCard p={p} setCart={setCart} cart={cart}></ProductCard>
          ))}
        </Box>}

        <Recommended />

        {!loading && <Stack direction={isSmallScreen ? "column" : "row"}>
          <Box flex={3}>
            <Stack direction="column">
              <Box className="home_products">
                <Text mt={8} ml={8} fontSize="2xl" fontWeight="bold">Trending(Most ordered) Products</Text>
                {filteredProduct?.map((p) => (
                  <ProductCard p={p} setCart={setCart} cart={cart}></ProductCard>
                ))}
              </Box>



            </Stack>
          </Box>

          <Box >

            <Stack p={8}>
              <Text fontSize={"3xl"}
                fontWeight={500} mb={4}>
                Products for You
              </Text>
              <Text fontSize="1xl">Filter By Category</Text>
              <Divider />
              {categories?.map((c) => (
                <Checkbox
                  key={c.id}
                  onChange={(e) => handleCategoryChange(c.slug)
                    // handleFilter(e.target.checked, c.id)
                  }
                >
                  {c.name}
                </Checkbox>
              ))}
              {/* price filter */}
              <Text fontSize="1xl">Filter By Price</Text>
              <Divider />
              <RadioGroup onChange={(e) => {
                const priceRange = e.split(",").map(Number);
                setPriceFilter([priceRange[0], priceRange[1]])
              }}>
                <Stack direction="column">
                  {Prices?.map((p) => (
                    <Radio value={p.array.toString()}>{p.name}</Radio>
                  ))}
                </Stack>
              </RadioGroup>
              <Divider />
              <Button
                fontWeight="400"
                colorScheme="teal"
                onClick={() => window.location.reload()}
              >
                Reset Filters
              </Button>
            </Stack>
          </Box>


        </Stack>}



      </Box>
    </>
  );
}

export default HomeProducts;
