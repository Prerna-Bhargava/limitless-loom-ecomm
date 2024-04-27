import React, { useEffect } from 'react'
import Layout from '../../components/Layout/Layout'
import { Box, Stack, Text } from '@chakra-ui/react'
import Product from '../../components/cart/Product'
import { calculateTotalPrice } from '../../utils/Utils'
import { useCart } from '../../context/cart'
import CheckoutForm from '../../components/forms/CheckoutForm'
import { useAuth } from '../../context/auth'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

function Checkout() {
    const [cart] = useCart();
    const [auth] = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!auth.user || !auth.user.token) {
            toast.error("Please login first!")
            navigate('/login')
        }

    }, [auth])

    return (
        <Layout title="checkout" >
            <Stack mx={4} spacing={4} width="80%" margin="auto" direction={{ lg: "row", md: "column", base: "column" }}>

                <Box flex={{ lg: 1, md: "100%", base: "100%" }}>
                    <Product />
                    <Stack mr={4} direction="row" >

                        <Text fontSize="lg" fontWeight="bold">
                            Price :
                        </Text>
                        <Text fontSize="lg" fontWeight="semibold">
                            Rs. {calculateTotalPrice(cart)}
                        </Text>

                    </Stack>
                </Box>

                {/* <Box maxWidth="500px"> */}
                <Box flex={{ lg: 1, md: "100%", base: "100%" }}>

                    <CheckoutForm />
                </Box>
            </Stack>
        </Layout>
    )
}

export default Checkout