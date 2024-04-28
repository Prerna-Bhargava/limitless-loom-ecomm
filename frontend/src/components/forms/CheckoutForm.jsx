import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
    Box,
    Text,
    Stack,
    FormControl,
    FormLabel,
    Input,
    useColorModeValue,
    Button,
    Select,
    Textarea,
    Divider,
    RadioGroup,
    Radio,
    Spinner,

} from "@chakra-ui/react";
import axios from "axios";
import toast from "react-hot-toast";
import { calculateTotalPrice } from "../../utils/Utils";
import { useCart } from "../../context/cart";
import { useAuth } from "../../context/auth";
function CheckoutForm() {
    const { handleSubmit, formState: { errors } } = useForm();

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState("");
    const [userId, setId] = useState("");
    const [city, setCity] = useState("");
    const [address, setAddress] = useState("");
    const [pin, setPin] = useState("");
    const [payment, setPayment] = React.useState('COD')

    const [cart,setCart] = useCart()
    const [auth] = useAuth()

    useEffect(() => {
        if (auth?.user) {
            console.log(auth)
            setId(auth.user.id)
        }
    }, []);

    const clearall = () => {
        setAddress("")
        setEmail("")
        setPin("")
        setPayment("")
        setCity("")
    }

    const totalPrice = calculateTotalPrice(cart)
    const placeOrder = async () => {
        const productIds = cart.map(product => product.id);
        const ProductData = {
            email,
            address,
            pin,
            city,
            totalPrice,
            user: userId,
            products: productIds

        };
        console.log("Checkout Product Data:", ProductData);

        setLoading(true)
        try {

            const config = {
                headers: {
                  Authorization: `Bearer ${auth?.user?.token}`  // Assuming Bearer token authentication
                }
              }

            let url = `/order/create`
            const { data } = await axios.post(url, ProductData,config);
            console.log("data = ", data)
            if (data?.success) {
                toast.success("Order placed!");
            }

            clearall();
            setCart([])
            localStorage.removeItem("cart")
            // const { data } = await axios.get('/order/list')
            // console.log(data)
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message || "Internal server error")
        }
        setLoading(false)

    };

    return (
        <>
            <Box maxW="650px">

                {loading && <Spinner />}
                <Text fontSize="lg" fontWeight="semibold" ml={8} my={4}>Shipping Details</Text>
                <form onSubmit={handleSubmit(placeOrder)}>

                    <Stack
                        gap={1}
                        rounded={"lg"}
                        bg={useColorModeValue("white", "gray.700")}
                        boxShadow={"lg"}
                        px={8}
                        pb={8}
                    >




                        <FormControl id="product_email">
                            <Input
                                // className="custom_image_input"
                                placeholder="Email"
                                focusBorderColor="teal.500"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </FormControl>

                        <FormControl id="product_city">
                            <Input
                                placeholder="City"
                                focusBorderColor="teal.500"
                                type="text"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                            />
                        </FormControl>

                        <FormControl id="product_address">
                            <Textarea
                                placeholder="Address"
                                focusBorderColor="teal.500"
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </FormControl>

                        <FormControl id="product_pincode">
                            <Input
                                placeholder="Pin Code"
                                focusBorderColor="teal.500"
                                type="number"
                                value={pin}
                                onChange={(e) => setPin(e.target.value)}
                            />
                        </FormControl>

                        <Text fontSize="lg" textAlign="left" fontWeight="semibold" ml={8} my={4}>Billing Details</Text>

                        <RadioGroup onChange={setPayment} value={payment}>
                            <Stack direction='row'>
                                <Radio value='COD'>Cash On Delivery</Radio>

                            </Stack>
                        </RadioGroup>


                        <Button
                            mt={3}
                            type="submit"
                            bg={"teal.800"}
                            color={"white"}
                            _hover={{
                                bg: "teal.900",
                            }}
                        >
                            Place Order
                        </Button>


                    </Stack>


                </form>


            </Box>
        </>
    );
}

export default CheckoutForm;
