import { Box, Button, Center, Heading, Image, Modal, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Stack, Text, calc, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import toast from 'react-hot-toast'
import { AiOutlineShoppingCart } from 'react-icons/ai'
import { useCart } from '../../context/cart'
import { Link as RouterLink, useNavigate } from "react-router-dom";
import Product from './Product'
import { calculateTotalPrice } from '../../utils/Utils'

function CartProducts() {

    const finalRef = React.useRef(null)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [cart, setCart] = useCart();

    const navigate = useNavigate();

    return (
        <>

            <Button mt={2} className="navbar_cart_icon" onClick={onOpen} >

                <AiOutlineShoppingCart size={20} />
                <Center className="navbar_cart_products_count">{cart?.length}</Center>
            </Button>

            <Modal finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose}  >
                <ModalOverlay />
                <ModalContent >
                    <ModalHeader>Your Products</ModalHeader>
                    <ModalCloseButton />

                    <>
                        <Product />

                        <Stack direction="row" p={2} mb={3} >


                            <Button ml={4} variant='solid' bg={"teal.800"} color="white" _hover={{
                                bg: "teal.900",
                            }} onClick={() => navigate("/checkout")}>
                                Checkout
                            </Button>


                            <Stack mr={4} direction="row" marginLeft="auto">

                                <Text fontSize="lg" fontWeight="bold">
                                    Price :
                                </Text>
                                <Text fontSize="lg" fontWeight="semibold">
                                    Rs. {calculateTotalPrice(cart)}
                                </Text>

                            </Stack>


                        </Stack>
                    </>

                </ModalContent>
            </Modal>
        </>
    )
}

export default CartProducts