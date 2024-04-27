import { React, useState } from 'react';
import toast from 'react-hot-toast'
import Layout from "../../components/Layout/Layout";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
// import { Button, FormControl, FormLabel, Input, Stack, useColorModeValue } from '@chakra-ui/react';
import { Flex, Box, FormControl, FormErrorMessage, FormLabel, Input, Checkbox, Stack, Link, Button, Heading, Text, useColorModeValue, Spinner } from "@chakra-ui/react";

function Login() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [name, setName] = useState("");
    const [messageError, setMessageError] = useState("");
    const [nameError, setNameError] = useState("");

    const [emailError, setEmailError] = useState(""); // New state for email error


    const navigate = useNavigate();
    const location = useLocation();

    const clearall = () => {
        setEmail("")
        setMessage("")
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            setEmailError("Email is required");
            return;
        }

        if (!name) {
            setNameError("Password is required");
            return;
        }

        if (!message) {
            setMessageError("Message is required");
            return;
        }

        try {
            const mailtoLink = `mailto:prerna172002@gmail.com?from=${email}&subject=${encodeURIComponent("Contact Form Submission")}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\nMessage: ${message}`)}`;
            window.location.href = mailtoLink;
            toast.success("Thank you for the Email. We will get in touch shortly!")
        } catch (error) {
            console.log(error);
            toast.error("Error sending email");
        }
    };

    return (
        <Layout title="Contact Us">
            <Flex
                align={"center"}
                justify={"center"}
                bg={useColorModeValue("gray.50", "gray.800")}
            >
                <Stack spacing={8} width="450px" mx={"auto"} maxW={"lg"} py={12} px={6}>
                    <Box
                        textAlign="center"
                        my={-7}
                        style={{ height: "20px", position: "fixed", left: "50%", transform: "translate(-50%, -50%)" }}
                    >
                    </Box>
                    <Stack align={"center"}>
                        <Heading fontSize={"4xl"} textAlign="center">
                            Contact Us
                        </Heading>
                    </Stack>
                    <Box
                        rounded={"lg"}
                        bg={useColorModeValue("white", "gray.700")}
                        boxShadow={"lg"}
                        p={8}
                    >
                        <Stack spacing={4}>
                            <FormControl id="Message" isInvalid={nameError} isRequired>
                                <FormLabel>Name</FormLabel>
                                <Input focusBorderColor="teal.500" type="text" value={name} onChange={(e) => { setName(e.target.value); setNameError("") }} />
                                <FormErrorMessage>{nameError}</FormErrorMessage>
                            </FormControl>
                            <FormControl id="email" isInvalid={emailError} isRequired>
                                <FormLabel>Email address</FormLabel>
                                <Input focusBorderColor="teal.500" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setEmailError("") }} />
                                <FormErrorMessage>{emailError}</FormErrorMessage>
                            </FormControl>
                            <FormControl id="Message" isInvalid={messageError} isRequired>
                                <FormLabel>Message</FormLabel>
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
                                    Send Email
                                </Button>




                            </Stack>
                        </Stack>
                    </Box>
                </Stack>
            </Flex>
        </Layout>
    );
}

export default Login;
