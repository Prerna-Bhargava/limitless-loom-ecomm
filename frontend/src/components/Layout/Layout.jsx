import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Box } from "@chakra-ui/react";
// import { Helmet } from "react-helmet";

function Layout({ children, title, description, keywords, author }) {
  return (
    <>
     
      <Box minHeight="75vh" position="relative">
        {/* Your page content goes here */}
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={author} />
        <Navbar />
        <main>{children}</main>
      </Box>
      <Footer />

    </>
  );
}

Layout.defaultProps = {
  title: "Ecommerce App - Shop Now",
  description: "MERN Stack Project",
  keywords: "html,css,mern,react,node,python,mongodb",
  author: "Prerna Bhargava",
};

export default Layout;
