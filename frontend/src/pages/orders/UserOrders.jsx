import { Box, Button, Center, Flex, Grid, Heading, Image, Modal, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Stack, Text, calc, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import toast from 'react-hot-toast'
import { AiOutlineShoppingCart } from 'react-icons/ai'
import { useCart } from '../../context/cart'
import { Link as RouterLink } from "react-router-dom";
import { calculateTotalPrice } from '../../utils/Utils'

function UserOrders({ Product }) {


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


        </Box>
    )
}

export default UserOrders