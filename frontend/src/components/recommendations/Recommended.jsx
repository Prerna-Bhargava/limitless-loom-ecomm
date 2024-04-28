import React, { useEffect, useState } from "react";
import ProductCard from "../../pages/products/ProductCard";
import {
    Box,
    Checkbox,
    Radio,
    RadioGroup,
    Stack,
    Grid,
    Button,
    Text,
    Divider,
    Flex,
    useBreakpointValue,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/cart";
// import { Prices } from "../components/Prices";

import { AiOutlineReload } from "react-icons/ai";
import { useAuth } from "../../context/auth";

function Recommended() {
    const navigate = useNavigate();
    const [cart, setCart] = useCart();
    const [auth] = useAuth();

    const [filteredProduct, setfilterProduct] = useState([])
   
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        getAllProducts();
    }, [auth]);
    //get products
    const getAllProducts = async () => {
        console.log("calling prodcts")
        try {
            setLoading(true);
            const { data } = await axios.get(
                `product/user/list/${auth?.user?.id}`
            );
            console.log(data)
            setfilterProduct(data.product)
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };

    const isSmallScreen = useBreakpointValue({ base: true, md: false });

    return (
        <>

            <Box className="home_products_page">

                {filteredProduct.length > 0 &&
                    <Stack direction={isSmallScreen ? "column" : "row"}>
                        <Box flex={3}>
                            <Stack direction="column">
                                <Box className="home_products">
                                    <Text mt={2}  ml={8} fontSize="2xl" fontWeight="bold">Recommended for you</Text>
                                    {filteredProduct?.map((p) => (
                                        <ProductCard p={p} setCart={setCart} cart={cart}></ProductCard>
                                    ))}
                                </Box>

                            </Stack>

                        </Box>

                    </Stack>
                }

            </Box>
        </>
    );
}

export default Recommended;
