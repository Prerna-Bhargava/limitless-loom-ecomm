import { Box, Button, FormControl, FormErrorMessage, FormLabel, Input, Stack } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

function Form({ Product, onClose }) {

    const [message, setMessage] = useState("");
    const [name, setName] = useState("");
    const [messageError, setMessageError] = useState("");
    const [nameError, setNameError] = useState("");


    useEffect(() => {
        console.log(Product)

        let getUser = JSON.parse(localStorage.getItem("auth"))

        console.log(getUser)
        setName(getUser?.name)

    }, [])




    const clearall = () => {
        setMessage("")
        setName("")
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!message) {
            setMessageError("Message is required");
            return;
        }


        try {

            let id = Product._id.$oid
            let userid = JSON.parse(localStorage.getItem("auth"))?.id

            console.log(id)
            const res = await axios.post("user/feedback", {
                name,
                message,
                id,
                userid

            });

            toast.success("Thank you for the valuable FeedBack!")
        } catch (error) {
            console.log(error);
            toast.error("Error sending feedback");
        }
    };

    return (
        <Box m={4}>

            <Stack spacing={4}>
                <FormControl id="Message" isInvalid={nameError} isRequired>
                    <FormLabel>Name</FormLabel>
                    <Input focusBorderColor="teal.500" type="text" disabled={true} value={name} onChange={(e) => { setName(e.target.value); setNameError("") }} />
                    <FormErrorMessage>{nameError}</FormErrorMessage>
                </FormControl>

                <FormControl id="Message" isInvalid={messageError} isRequired>
                    <FormLabel>FeedBack</FormLabel>
                    <Input focusBorderColor="teal.500" type="text" value={message} onChange={(e) => { setMessage(e.target.value); setMessageError("") }} />
                    <FormErrorMessage>{messageError}</FormErrorMessage>
                </FormControl>
                <Stack spacing={10}>

                    <Button
                        bg={"teal.800"}
                        color={"white"}
                        _hover={{
                            bg: "teal.900",
                        }}
                        onClick={(e) => { handleSubmit(e) }}
                    >
                        Send FeedBack
                    </Button>




                </Stack>
            </Stack>
        </Box>
    )
}

export default Form