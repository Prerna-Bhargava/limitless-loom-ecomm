import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import axios from 'axios';
import { useAuth } from '../../context/auth';
import UserOrders from './UserOrders';
import { Divider } from '@chakra-ui/react';

function Myorders() {

    const [auth] = useAuth()
    const [Products, setProducts] = useState([])
    const [id, setId] = useState("")


    const getAllOrders = async () => {
        try {
            const { data } = await axios.get(`order/list/${id}`);
            console.log(data.orders)
            if (data?.success) {
                setProducts(data?.orders);
            }
        } catch (error) {
            console.log(error);
            console.log("Something went wrong in getting orders list");
        }
    };

    useEffect(() => {
        setId(auth?.user?.id)
        if (id) {
            getAllOrders();
        }
    }, [id]);

    return (
        <Layout title="Orders">

            {Products.map((product) => (
                <>
                    <UserOrders Product={product} />
                    <Divider />
                </>
            ))}

        </Layout>
    )
}

export default Myorders