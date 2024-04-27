import React from 'react'
import axios from 'axios';
import { useGoogleLogin } from '@react-oauth/google';
import { Button, Icon, Image } from '@chakra-ui/react';
import GoogleIconSVG from '../../img/googleIcon.png'


export const GoogleLoginForm = () => {
  const login = useGoogleLogin({
    onSuccess: tokenResponse => {
      console.log(tokenResponse)
      sendAccessTokenToBackend(tokenResponse.access_token)
    },
  });
  const handleCustomLogin = () => {
    login();
  };

  const sendAccessTokenToBackend = (accessToken) => {
    axios.post('/auth/google/callback', {
      access_token: accessToken,
    })
      .then(response => {
        const user = response.data.user;
        localStorage.setItem('jwtToken', user);
        console.log('USER :', user);
        // setJwtToken(receivedJwtToken);
      })
      .catch(error => {
        console.error('Error sending access token to the backend:', error);
      });
  };

  return (
    <>
      {/* <GoogleLogin
        onSuccess={credentialResponse => {
          console.log(jwtDecode(credentialResponse.credential));
          console.log(credentialResponse);

        }}
        onError={() => {
          console.log('Login Failed');
        }}
      /> */}
      <Button style={{ width: "100%" }} variant="outline" onClick={handleCustomLogin}>
        <Image src={GoogleIconSVG} boxSize={7} mr={2} />
        Sign in with Google</Button>
    </>

  )
}
