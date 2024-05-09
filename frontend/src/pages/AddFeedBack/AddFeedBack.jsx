import { Box, Button, Center, Heading, Image, Modal, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Stack, Text, calc, useDisclosure } from '@chakra-ui/react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { AiOutlineShoppingCart } from 'react-icons/ai'
import { useCart } from '../../context/cart'
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useWishlist } from '../../context/wishlist'
import wishlisticon from '../../img/wishlist.png'
import Form from './Form'


function AddFeedBack({Product}) {



    const finalRef = React.useRef(null)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [cart, setCart] = useCart();
    const [wishlist, setWishlist] = useWishlist();

    const navigate = useNavigate();

    return (
        <>

            <Button bg={"teal.500"}
                  color={"white"}
                  _hover={{
                    bg: "teal.900",
                  }} m={2} ml="auto" className="navbar_cart_icon"  onClick={onOpen} >
                Add FeedBack
            </Button>

            <Modal finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose}  >
                <ModalOverlay />
                <ModalContent >
                    <ModalHeader>Add FeedBack</ModalHeader>
                    <ModalCloseButton />

                    <>
                        <Form Product={Product} onClose={onClose}/>
                    </>

                </ModalContent>
            </Modal>
        </>
    )
}

export default AddFeedBack