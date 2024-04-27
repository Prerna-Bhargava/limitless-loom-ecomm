import { React, useState } from 'react';
import toast from 'react-hot-toast'
import {
    Flex,
    Box,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    Checkbox,
    Stack,
    Link,
    Button,
    Heading,
    Text,
    useColorModeValue,
    Spinner,
} from "@chakra-ui/react";
import Layout from "../../components/Layout/Layout";
import axios from "axios"
import { useAuth } from "../../context/auth";

import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";

function ForgetPassword() {
    const [email, setEmail] = useState("");
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState("");
    const [auth, setAuth] = useAuth();
    const [emailError, setEmailError] = useState(""); // New state for email error
    const [passwordError, setPasswordError] = useState(""); // New state for password error
    const [answerError, setAnsError] = useState("");
    const HARDCODED_SECRET_QUESTION = 'What is your favorite brand?';
    const navigate = useNavigate();
    const location = useLocation();

    
    const clearall = ()=>{
        setEmail("")
        setAnswer("")
        setPassword("")
    }

    const handleSubmit = async (e) => {
        console.log(email, password, auth)
        e.preventDefault();
        if (!email) {
            setEmailError("Email is required");
            return;
        }
        if (!answer) {
            setAnsError("Password is required");
            return;
        }

        if (!password) {
            setPasswordError("Password is required");
            return;
        }
        setLoading(true)
        try {
            const res = await axios.post("auth/resetPassword", {
                email,
                password,
                answer
            });
            console.log(res)

            if (res && res.status==200) {
                toast.success(res.data && res.data.message);
                clearall()
                setAuth({
                    ...auth,
                    user: res?.data?.email,
                    token: res?.data?.token,
                });
                console.log(auth)
                localStorage.setItem("auth", JSON.stringify(res.data));
                navigate("/");
            } else {
                toast.error(res.data.message || "Internal server error");
            }
        } catch (error) {
            console.log("error is ",error);
            toast.error(error.response.data.message);
        }
        setLoading(false)
    };
    return (
        <Layout title="Login">
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
                        {loading && <Spinner />}
                    </Box>

                    <Stack align={"center"}>
                        <Heading fontSize={"4xl"} textAlign="center">
                            Reset Password
                        </Heading>
                    </Stack>
                    <Box
                        rounded={"lg"}
                        bg={useColorModeValue("white", "gray.700")}
                        boxShadow={"lg"}
                        p={8}
                    >
                        <Stack spacing={4}>
                            <FormControl id="email" isInvalid={emailError} isRequired>
                                <FormLabel>Email address</FormLabel>
                                <Input focusBorderColor="teal.500" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setEmailError("") }} />
                                <FormErrorMessage>{emailError}</FormErrorMessage>
                            </FormControl>
                            <FormControl id="answer" isRequired isInvalid={answerError}>
                                <FormLabel>{HARDCODED_SECRET_QUESTION}</FormLabel>
                                <Input focusBorderColor="teal.500" type="text" value={answer} onChange={(e) => { setAnswer(e.target.value); setAnsError("") }} />
                                <FormErrorMessage>{answerError}</FormErrorMessage>
                            </FormControl>
                            <FormControl id="password" isInvalid={passwordError} isRequired>
                                <FormLabel>New Password</FormLabel>
                                <Input  focusBorderColor="teal.500" type="password" value={password} onChange={(e) => { setPassword(e.target.value); setPasswordError("") }} />
                                <FormErrorMessage>{passwordError}</FormErrorMessage>
                            </FormControl>
                            <Stack spacing={10}>
                                <Button
                                    bg={"teal.800"}
                                    color={"white"}
                                    _hover={{
                                        bg: "teal.900",
                                    }}
                                    mt={2}
                                    onClick={(e) => { handleSubmit(e) }}
                                >
                                    Reset Password
                                </Button>
                            </Stack>
                        </Stack>
                    </Box>
                </Stack>
            </Flex>
        </Layout>
    );
}

export default ForgetPassword;
