import { Heading } from '@chakra-ui/react'
import React from 'react'
import Layout from '../../components/Layout/Layout'

function NotFound() {
    return (
        <Layout>
            <Heading p={8} size="md">404 Requested Path Not Found</Heading>
        </Layout>

    )
}

export default NotFound