import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import { useLocation, useParams } from 'react-router-dom';
import { Box, Button, Divider, Flex, Grid, Heading, Image, Input, Radio, RadioGroup, Spinner, Stack, Text, useBreakpointValue } from '@chakra-ui/react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Link as RouterLink } from "react-router-dom";
import { StarIcon } from '@chakra-ui/icons';
import { useCart } from '../../context/cart';


function SearchProducts() {
    const [cart, setCart] = useCart();
    const [Products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const search_param = queryParams.get('param');

    const getAllProducts = async () => {
        setLoading(true)
        try {
            let url = ''
            url = `/product/search?search_param=${search_param}`

            const { data } = await axios.get(url);
            console.log("data = ", data)
            if (data?.success) {
                setProducts(data?.product);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message || "Internal server error")
        }
        setLoading(false)
    };

    useEffect(() => {
        console.log("searching ")
        if (!search_param || search_param.length < 2) {
            toast(
                "Please enter atleast 2 letters to start searching",
                {
                    style: {
                        background: "yellow",
                        color: "black",
                    },
                }
            );

        } else
            getAllProducts();
    }, [search_param]);


    const isSmallScreen = useBreakpointValue({ base: true, md: false });
    const mxValue = useBreakpointValue({ base: 5, md: 20 });


    return (
        <Layout title={`Search Products`}>
            <Box textAlign="center" minWidth="300px" mx={mxValue} mb={20} >

                <Heading as='h2' size='lg' color="teal.800" my={3}>
                    Showing Search Results for {search_param}
                </Heading>

                <Box h="35px">
                    {loading && <Spinner />}

                </Box>

                {!loading && Products.length<1 &&  <Heading as='h4' size='md' color="teal.800" my={3}>
                    Oops! No matching products found.
                </Heading>}

                <Stack direction={isSmallScreen ? "column" : "row"} >

                    <Grid templateColumns={{
                        base: "repeat(1, 1fr)",
                        md: "repeat(2, 1fr)",
                        lg: "repeat(3, 1fr)",
                    }} mx="auto" gap={4}>
                        {Products.map((product) => (
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

export default SearchProducts;
