import { Box, Button, Center, Flex, Grid, Heading, Image, Modal, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Stack, Text, calc, useDisclosure } from '@chakra-ui/react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { AiOutlineShoppingCart } from 'react-icons/ai'
import { useCart } from '../../context/cart'
import { Link as RouterLink } from "react-router-dom";
import { calculateTotalPrice } from '../../utils/Utils'
import { StarIcon } from '@chakra-ui/icons'
import axios from 'axios'
import { useAuth } from '../../context/auth'

function UserOrders({ Product }) {

    const [rating, setRating] = useState(Product.rating)
    const [auth] = useAuth();

    const handleStarClick = (clickedRating) => {
        setRating(clickedRating);
        updateRating(clickedRating); // Call the parent component's callback with the new rating
    };

    const updateRating = async (clickedRating) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${auth?.user?.token}`  // Assuming Bearer token authentication
                }
            }
            const { data } = await axios.put(
                `order/rating/${Product.id}`,
                {
                    rating: clickedRating
                }, config
            );
            if (data?.success) {
                toast.success(`Product Rated!`);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
        }

    };


    return (
        <Box p={6}>


            <Text fontSize="lg" fontWeight="semibold">Order Date : {Product.createdAt}</Text>

            <Grid
                templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} // Adjust column layout for different screen sizes
                gap={6}
            >

                {Product.products.map((product) => (
                    <>
                        <Box key={product.id} p={4} borderWidth="1px" borderRadius="md" overflow="hidden">
                            <RouterLink
                                to={`/product/single/${product.id}`}
                                role={"group"}
                                display={"block"}
                                p={2}
                                rounded={"md"}
                                _hover={{ bg: "teal.50" }}
                            >
                                <Image mr={5} float="left" src={product?.photo} alt={product.name} height="150px" objectFit="fit" />
                                <Box>

                                    <Text fontSize="lg" fontWeight="semibold">
                                        {product.name}
                                    </Text>
                                    <Text my={2} fontSize="sm" fontWeight="semibold" color="gray.500" textAlign="left">
                                        Rs. {product.price}
                                    </Text>

                                </Box>
                            </RouterLink>

                        </Box>
                    </>
                ))}
            </Grid>


            <Stack mr={4} marginLeft="auto">

                <Text fontSize="lg" fontWeight="semibold">
                    Price : Rs. {calculateTotalPrice(Product.products)}
                </Text>


            </Stack>

            <Stack mr={4} direction="row" marginLeft="auto">

                <Text fontSize="md" fontWeight="semibold">
                    Status :
                </Text>
                <Text fontSize="md" >
                    {Product.status}
                </Text>

            </Stack>


            {Product.status == "delivered" && <Box display='flex' mt='3' alignItems='center' mb={3} >
                {Array(5)
                    .fill('')
                    .map((_, i) => (

                        <StarIcon
                            key={i}
                            color={i < rating ? 'teal.500' : 'gray.300'}
                            onClick={() => handleStarClick(i + 1)} // i + 1 because ratings start from 1
                            cursor="pointer"
                        />
                    ))}


            </Box>
            }

        </Box>
    )
}

export default UserOrders