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
import { useNavigate } from "react-router-dom";
function ProfileForm({ id, name, email, address }) {
    const { handleSubmit, formState: { errors } } = useForm();

    const [loading, setLoading] = useState("");
    const [namenew, setName] = useState(name);
    const [addressnew, setAddress] = useState(address);

    const navigate = useNavigate();


    const [cart] = useCart()
    const [auth] = useAuth()


    const totalPrice = calculateTotalPrice(cart)
    const updateProfile = async () => {
        const ProductData = {
            email: email,
            address: addressnew,
            name: namenew

        };

        setLoading(true)
        try {
            let url = `/user/profile/${id}`
            const { data } = await axios.put(url, ProductData);
            console.log("data = ", data)
            if (data?.success) {
                toast.success("Profile Updared!");
                localStorage.setItem("auth", JSON.stringify(data.user));

            }

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
                <form onSubmit={handleSubmit(updateProfile)}>
                    <Stack
                        gap={1}
                        rounded={"lg"}
                        bg={useColorModeValue("white", "gray.700")}
                        boxShadow={"lg"}
                        px={8}
                        pb={8}
                    >

                        <FormControl id="user_email" >
                            <Input
                                placeholder="Email"
                                focusBorderColor="teal.500"
                                type="email"
                                value={email}
                                disabled={true}
                            />
                        </FormControl>


                        <FormControl id="user_name" my={4}>
                            <Input
                                placeholder="User Name"
                                focusBorderColor="teal.500"
                                type="text"
                                value={namenew}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </FormControl>

                        <FormControl id="user_address" mb={2}>
                            <Textarea
                                placeholder="Address"
                                focusBorderColor="teal.500"
                                type="text"
                                value={addressnew}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </FormControl>


                        <Stack direction='row' spacing={4} align='center'>

                            <Button type="submit" colorScheme='teal' variant='outline' >
                                Update Profile
                            </Button>
                            <Button type="button" variant='solid' bg={"teal.800"} color="white" _hover={{
                                bg: "teal.900",
                            }} onClick={() => {
                                navigate("/myOrders")
                            }}>
                                View Orders
                            </Button>

                            <Button type="button" colorScheme='teal' variant='outline' onClick={()=>localStorage.removeItem("auth")} >
                                Log Out
                            </Button>

                        </Stack>





                    </Stack>


                </form>


            </Box>
        </>
    );
}

export default ProfileForm;
