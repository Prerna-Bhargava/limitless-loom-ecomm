import { Box, Button, Center, Heading, Image, Modal, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Stack, Text, calc, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import toast from 'react-hot-toast'
import { AiOutlineShoppingCart } from 'react-icons/ai'
import { useCart } from '../../context/cart'
import { Link as RouterLink } from "react-router-dom";

function Product() {

    const [cart, setCart] = useCart();

    function calculateTotalPrice() {
        let totalPrice = 0;
        cart.forEach((product) => {
            totalPrice += product.price;
        });
        return totalPrice.toFixed(2); // Assuming you want to display the total with 2 decimal places
    }

    return (
        <>


            {cart.map((product) => (
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
                                const indexToRemove = cart.findIndex((item) => item.id === product.id);

                                if (indexToRemove !== -1) {
                                    const updatedCart = [...cart.slice(0, indexToRemove), ...cart.slice(indexToRemove + 1)];
                                    setCart(updatedCart);
                                    localStorage.setItem("cart", JSON.stringify(updatedCart));
                                    toast.success("Item Removed from cart");
                                } else {
                                    toast.error("Item not found in cart");
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