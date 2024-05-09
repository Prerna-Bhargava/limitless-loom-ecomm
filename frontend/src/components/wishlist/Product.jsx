import { Box, Button, Center, Heading, Image, Modal, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Stack, Text, calc, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import toast from 'react-hot-toast'
import { AiOutlineShoppingCart } from 'react-icons/ai'
import { useCart } from '../../context/cart'
import { Link as RouterLink } from "react-router-dom";
import { useWishlist } from '../../context/wishlist'

function Product() {

    const [wishlist,setWishlist] = useWishlist();


    return (
        <>


            {wishlist.map((product) => (
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
                        <Stack direction='row' spacing={4} align='center'>

                            <Button colorScheme='red' variant='outline' onClick={() => {
                                // Find the index of the first item with the matching product ID
                                const indexToRemove = wishlist.findIndex((item) => item.id === product.id);

                                if (indexToRemove !== -1) {
                                    const updatedCart = [...wishlist.slice(0, indexToRemove), ...wishlist.slice(indexToRemove + 1)];
                                    setWishlist(updatedCart);
                                    localStorage.setItem("wishlist", JSON.stringify(updatedCart));
                                    toast.success("Item Removed from wishlist");
                                } else {
                                    toast.error("Item not found in wishlist");
                                }
                            }}
                            >
                                Remove
                            </Button>




                        </Stack>

                    </Box>
                </>
            ))}
        </>
    )
}

export default Product