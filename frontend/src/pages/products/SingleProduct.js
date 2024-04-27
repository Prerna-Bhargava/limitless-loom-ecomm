import { Box, Text } from '@chakra-ui/react'
import React from 'react'
import { Link } from 'react-router-dom'

function SingleProduct({ product }) {
    return (
        <Link to={`/product/category/${product.category.slug}`}>
            <Box p={1} rounded="md">
                <Box
                    width="9rem"
                    height="7rem"
                    backgroundImage={product.photo}
                    _hover={{
                        transform: 'scale(1.1)', // Zoom effect
                        transition: 'transform 0.3s ease-in-out' // Smooth transition
                    }}
                    backgroundRepeat='no-repeat'
                    backgroundSize="9rem 7rem"
                >
                </Box>
                <Text fontSize="lg" mt={2}>{product.category.name}</Text>
            </Box>
        </Link>
    )
}

export default SingleProduct

