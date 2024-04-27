import React from "react";
import { Box, Flex, Grid, Image, Text, VStack, useColorModeValue } from "@chakra-ui/react";
import SingleProduct from "./SingleProduct";

function ProductsBox({ products }) {
    return (
        <Box p={4}
            bg={useColorModeValue("white", "gray.800")}
            boxShadow={"2xl"}
            rounded={"lg"}>
            <Text fontSize={"xl"}
                fontWeight={600} mb={4}>
                {products.group}
            </Text>
            <Grid
                templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                gap={2}
            >
                {products.products.length>0 && <SingleProduct product={products.products[0]}/>}
                {products.products.length>1 && <SingleProduct product={products.products[1]}/>}
            </Grid>

            <Grid
                mt={4}
                templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                gap={4}
            >
                {products.products.length>2 && <SingleProduct product={products.products[2]}/>}
                {products.products.length>3 && <SingleProduct product={products.products[3]}/>}
                
            </Grid>
        </Box>
    );
}

export default ProductsBox;
