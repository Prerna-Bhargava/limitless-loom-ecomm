import { React, useState } from 'react';
import toast from 'react-hot-toast'
import {Flex,Box,FormControl,FormErrorMessage,FormLabel,Input,Checkbox,Stack,Link,Button,Heading,Text,useColorModeValue,Spinner} from "@chakra-ui/react";
import Layout from "../../components/Layout/Layout";
import axios from "axios"
import { useAuth } from "../../context/auth";

import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { GoogleLoginForm } from './GoogleLoginForm';

function Login() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [auth, setAuth] = useAuth();
  const [emailError, setEmailError] = useState(""); // New state for email error
  const [passwordError, setPasswordError] = useState(""); // New state for password error

  const navigate = useNavigate();
  const location = useLocation();

  const clearall = ()=>{
      setEmail("")
      setPassword("")
  }

  // form function
  const handleSubmit = async (e) => {
    console.log(email, password, auth)
    e.preventDefault();
    if (!email) {
      setEmailError("Email is required");
      return;
    }

    if (!password) {
      setPasswordError("Password is required");
      return;
    }
    setLoading(true)
    try {
      const res = await axios.post("auth/login", {
        email,
        password,
      });
      if (res && res.status==200) {
        toast.success(res.data && res.data.message);
        console.log("login response ",res.data)
        clearall()
        setAuth({
          ...auth,
          user: res?.data,
          token: res?.data?.token,
        });
        console.log(auth)
        localStorage.setItem("auth", JSON.stringify(res.data));
        // navigate(location.state || "/");
        navigate("/");

      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message || "Internal server error");
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
              Sign In
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
              <FormControl id="password" isInvalid={passwordError} isRequired>
                <FormLabel>Password</FormLabel>
                <Input focusBorderColor="teal.500" type="password" value={password} onChange={(e) => { setPassword(e.target.value); setPasswordError("") }} />
                <FormErrorMessage>{passwordError}</FormErrorMessage>
              </FormControl>
              <Stack spacing={10}>
                <Stack
                  direction={{ base: "column", sm: "row" }}
                  align={"start"}
                  justify={"space-between"}
                >
                  <Checkbox colorScheme="teal">Remember me</Checkbox>
                  <RouterLink to='/forgetPassword'>
                    <Text
                      color="teal.800"
                      fontWeight="bold"
                      display="inline-block"
                    >
                      Forgot password?
                    </Text>
                  </RouterLink>
                </Stack>
                <Button
                  bg={"teal.800"}
                  color={"white"}
                  _hover={{
                    bg: "teal.900",
                  }}
                  mb={-8}
                  onClick={(e) => { handleSubmit(e) }}
                >
                  Email Sign In
                </Button>

                <Text mb={-8} style={{"textAlign":"center"}}>or</Text>

      
                <GoogleLoginForm />

              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </Layout>
  );
}

export default Login;
