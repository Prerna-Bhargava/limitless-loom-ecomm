import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Center, Checkbox, Container, Divider, Flex, Grid, Heading, Image, ListItem, Radio, RadioGroup, Spinner, Square, Stack, Text, UnorderedList, useColorModeValue } from '@chakra-ui/react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { StarIcon } from '@chakra-ui/icons';
import { useCart } from '../../context/cart';

function ProductById() {
    const { id } = useParams();
    const [cart, setCart] = useCart();
    const navigate = useNavigate();
    const [Products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)

    const getSingleProduct = async () => {
        setLoading(true)
        try {
            let url = `/product/list/${id}`
            const { data } = await axios.get(url);
            console.log("data = ", data)
            if (data?.success) {
                setProducts(data?.product);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message || "Internal server error")
        }
        setLoading(false)
    };

    useEffect(() => {
        getSingleProduct();
    }, [id]);

    return (
        <Layout >
            <Box textAlign="center" h="20px" m={3} >

                {loading && <Spinner />}


            </Box>

            <Flex mb={5} color='white' flexDir={['column', 'row']}>

                <Box flex={['1', null, 'initial']} display='flex' alignItems='center' justifyContent='center' minW='50%'>
                    <Image src={Products.photo} maxWidth="500px" minWidth="100px" _hover={{
                        transform: 'scale(1.2)', // Zoom effect
                        transition: 'transform 0.3s ease-in-out' // Smooth transition
                    }} />

                </Box>

                <Box flex={['1', null, 'initial']} m={3} color='black' minW='50%' >
                    <Heading as='h2' size='lg'>
                        {Products.name}
                    </Heading>
                    <Divider mt={3} />

                    <Box display='flex' mt='3' alignItems='center' mb={3} >
                        {Array(5)
                            .fill('')
                            .map((_, i) => (
                                <StarIcon
                                    key={i}
                                    color={i < Products.rating ? 'teal.500' : 'gray.300'}
                                />
                            ))}

                    </Box>

                    <Box mb={1}>
                        Rs.
                        <Heading as='span' color='gray.600' size='sm'>
                            {Products.price}
                        </Heading>
                        /-
                    </Box>

                    <Box mb={1}>
                        <Heading as="span" size='xs'>
                            Shipping Charges:
                        </Heading>
                        <Box as='span' color='gray.600' fontSize='sm' ml={1}>
                            {Products.shipping ? "true" : "false"}
                        </Box>
                    </Box>
                    <Box mb={3}>
                        <Heading as="span" size='xs'>
                            Quantity:
                        </Heading>
                        <Box as='span' color='gray.600' fontSize='sm' ml={1}>
                            {Products.quantity}
                        </Box>
                    </Box>


                    <Heading as="h2" size='sm'>
                        About this item
                    </Heading>

                    <UnorderedList mb={4}>
                        {Products?.description?.split(/[|\.]/).map(item => item.trim()).filter(item => item && item !== '.').map((item, index) => (
                            <ListItem key={index}>{item}</ListItem>
                        ))}
                    </UnorderedList>


                    <Stack direction='row' spacing={4} align='center'>

                        <Button colorScheme='teal' variant='outline' onClick={() => {
                            setCart([...cart, Products]);
                            localStorage.setItem("cart", JSON.stringify([...cart, Products]));
                            toast.success("Item Added to cart");
                        }}>
                            Add to Cart
                        </Button>
                        <Button variant='solid' bg={"teal.800"} color="white" _hover={{
                            bg: "teal.900",
                        }} onClick={() => {
                            setCart([...cart, Products]);
                            localStorage.setItem("cart", JSON.stringify([...cart, Products]));
                            navigate("/checkout")
                        }}>
                            Buy Now
                        </Button>

                    </Stack>
                </Box>

            </Flex>



        </Layout>
    );
}

export default ProductById;
