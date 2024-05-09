import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import { useLocation, useParams } from 'react-router-dom';
import { Box, Button, Divider, Flex, Grid, Heading, IconButton, Image, Input, Radio, RadioGroup, Spinner, Stack, Text, useBreakpointValue } from '@chakra-ui/react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Link as RouterLink } from "react-router-dom";
import { StarIcon } from '@chakra-ui/icons';
import { useCart } from '../../context/cart';
import { useWishlist } from '../../context/wishlist';
import wishlisticon from "../../img/wishlist.png"


function ProductCategory() {
  const { category } = useParams();
  const [cart, setCart] = useCart();
  const [wishlist,setWishlist] = useWishlist();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const queryValue = queryParams.get('search');


  localStorage.setItem("search", JSON.stringify([...JSON.parse(localStorage.getItem("search") || '[]'), category]));


  const [Products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [Prices, setPrices] = useState([]);
  const [mindefaultValue, setMinDefaultValue] = useState(0);
  const [maxdefaultValue, setMaxDefaultValue] = useState(0);

  const getAllProducts = async (sort = "none") => {
    setLoading(true)
    try {
      let url = ''
      console.log(queryValue)

      if (queryValue) {
        url = `/product/list/slug/${category}?sort=${sort}&search=${queryValue}`
      } else {
        url = `/product/list/slug/${category}?sort=${sort}`
      }
      const { data } = await axios.get(url);
      console.log("data = ", data)
      if (data?.success) {
        setProducts(data?.product);
        setFilteredProducts(data?.product);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message || "Internal server error")
    }
    setLoading(false)
  };

  const getPrice = async () => {
    try {
      const { data } = await axios.get(
        `/price/range/${category}`
      );

      if (data?.success) {
        let pricedata = data?.price_ranges
        setPrices(pricedata);

        const defaultValue1 = Math.round(Number(pricedata && pricedata.length > 0 && pricedata[0]?.array ? pricedata[0].array[0] : 0));
        const defaultValue2 = Math.round(Number(pricedata && pricedata.length > 0 && pricedata[pricedata.length - 1]?.array ? pricedata[pricedata.length - 1].array[1] : 0));
        setMinDefaultValue(defaultValue1)
        setMaxDefaultValue(defaultValue2)
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message || "Internal server error")
    }
  };

  useEffect(() => {
    getAllProducts();
    getPrice();
  }, [category]);

  useEffect(() => {
    getAllProducts();
  }, [queryValue]);

  const handleMinInputChange = (event) => {
    const newValue = Number(event.target.value);
    setMinDefaultValue(newValue)
    setFilteredProducts(Products.filter((c) => c.price >= newValue && c.price <= maxdefaultValue));
  };

  const handleMaxInputChange = (event) => {
    const newValue = event.target.value;
    setMaxDefaultValue(newValue);
    setFilteredProducts(Products.filter((c) => c.price <= newValue && c.price >= mindefaultValue));

  };

  const isSmallScreen = useBreakpointValue({ base: true, md: false });
  const mxValue = useBreakpointValue({ base: 5, md: 20 });


  return (
    <Layout title={`Products in ${category}`}>
      <Box textAlign="center" minWidth="300px" mx={mxValue} mb={20} >

        <Heading as='h2' size='lg' color="teal.800" my={3}>
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </Heading>

        <Box h="35px">
          {loading && <Spinner />}

        </Box>

        <Stack direction={isSmallScreen ? "column" : "row"} >

          <Box order={isSmallScreen ? 2 : 1} >

            <Box marginLeft={isSmallScreen ? "1rem" : "-2rem"}>
              <Text fontSize={"3xl"}
                fontWeight={500} mb={4}>
                Products for You
              </Text>

              {/* price filter */}
              <Text fontSize="1xl" my={2} textAlign="left" fontWeight="semibold">Filter By Price</Text>
              <Divider />
              <RadioGroup onChange={(e) => {
                console.log(e)
                const priceRange = e.split(",").map(Number);
                setFilteredProducts(Products.filter((c) => c.price >= priceRange[0] && c.price <= priceRange[1]));
              }}>
                <Stack direction="column">
                  {Prices?.map((p) => (
                    <Radio value={p.array.toString()}>{p.name}</Radio>
                  ))}
                </Stack>
              </RadioGroup>

              <Box my={4}>

                <Text fontSize="1xl" my={2} textAlign="left" fontWeight="semibold">Filter By Custom Price</Text>
                <Divider />

                <Stack direction="row" my={2}>
                  <Text mt={1} >Min</Text>
                  <Input value={mindefaultValue} onChange={handleMinInputChange} />

                  <Text mt={1}>Max</Text>
                  <Input value={maxdefaultValue} onChange={handleMaxInputChange} />


                </Stack>
              </Box>

              {/*sort filter */}
              <Text fontSize="1xl" my={2} textAlign="left" fontWeight="semibold">Sort By Price</Text>
              <Divider />
              <RadioGroup onChange={(e) => {
                getAllProducts(e)
              }}>
                <Stack direction="column">
                  <Radio value="desc">High to Low</Radio>
                  <Radio value="asc">Low to High</Radio>
                  <Radio value="none">Reset</Radio>

                </Stack>
              </RadioGroup>
              <Divider />
              <Button
                my={5}
                fontWeight="400"
                colorScheme="teal"
                onClick={() => window.location.reload()}
              >
                Reset Filters
              </Button>
            </Box>
          </Box>

          <Grid order={isSmallScreen ? 1 : 2} flex={3} templateColumns={{
            base: "repeat(1, 1fr)",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          }} mx="auto" gap={4}>
            {filteredProducts.map((product) => (
              <RouterLink
                to={`/product/single/${product.id}`}
                role={"group"}
                display={"block"}

                rounded={"md"}
                _hover={{ bg: "teal.50" }}
              >
                <Box key={product.id} p={4} borderWidth="1px" borderRadius="md" overflow="hidden">
                  <Image src={product?.photo} _hover={{
                    transform: 'scale(1.1)',
                    transition: 'transform 0.3s ease-in-out' // Smooth transition
                  }} style={{ "margin": "auto" }} alt={product.name} height="150px" objectFit="fit" />
                  <Text mt={2} fontSize="lg" fontWeight="semibold">
                    {product.name}
                  </Text>
                  <Text fontSize="sm" fontWeight="semibold" color="gray.500" textAlign="left">
                    Rs. {product.price}
                  </Text>
                  <Text fontSize="sm" overflow="hidden" textAlign="left" textOverflow="ellipsis" color="gray.500">
                    {product.description.length > 150
                      ? `${product.description.slice(0, 150)}...`
                      : product.description}
                  </Text>

                  <Box display='flex' mt='3' alignItems='center' mb={3} >
                    {Array(5)
                      .fill('')
                      .map((_, i) => (
                        <StarIcon
                          key={i}
                          color={i < product.rating ? 'teal.500' : 'gray.300'}
                        />
                      ))}


                  </Box>

                  <Stack direction='row' spacing={4} align='center'>

                    <IconButton onClick={() => {
                      setWishlist([...wishlist, product]);
                      localStorage.setItem("wishlist", JSON.stringify([...wishlist, product]));
                      toast.success("Item Added to wishlist");
                    }} icon={<Image src={wishlisticon} width="30px" />} />



                    <Button colorScheme='teal' variant='outline' onClick={() => {
                      setCart([...cart, product]);
                      localStorage.setItem("cart", JSON.stringify([...cart, product]));
                      toast.success("Item Added to cart");
                    }}>
                      Add to Cart
                    </Button>
                    <Button variant='solid' bg={"teal.800"} color="white" _hover={{
                      bg: "teal.900",
                    }}>
                      Buy Now
                    </Button>

                  </Stack>

                </Box>
              </RouterLink>
            ))}
          </Grid>
        </Stack>

      </Box>
    </Layout>
  );
}

export default ProductCategory;
