import { Box, Button, Center, Heading, Image, Modal, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Stack, Text, calc, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import toast from 'react-hot-toast'
import { AiOutlineShoppingCart } from 'react-icons/ai'
import { useCart } from '../../context/cart'
import { Link as RouterLink, useNavigate } from "react-router-dom";
import Product from './Product'
import { useWishlist } from '../../context/wishlist'
import wishlisticon from '../../img/wishlist.png'


function WishlistProducts() {

    const finalRef = React.useRef(null)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [cart, setCart] = useCart();
    const [wishlist,setWishlist] = useWishlist();

    const navigate = useNavigate();

    return (
        <>

            <Button mt={2} className="navbar_cart_icon" onClick={onOpen} >

                <Image src={wishlisticon} width="30px" />
                <Center className="navbar_cart_products_count">{wishlist?.length}</Center>
            </Button>

            <Modal finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose}  >
                <ModalOverlay />
                <ModalContent >
                    <ModalHeader>Your WishList</ModalHeader>
                    <ModalCloseButton />

                    <>
                        <Product />
                    </>

                </ModalContent>
            </Modal>
        </>
    )
}

export default WishlistProducts