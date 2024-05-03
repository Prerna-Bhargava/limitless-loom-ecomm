import React, { useState } from "react";
import { Box, Grid, Spinner, Text } from "@chakra-ui/react";
import ProductsBox from "./ProductsBox";
import toast from "react-hot-toast";
import axios from "axios";

function FourBoxesLayout() {
  // Sample data for the boxes
  const [loading, setLoading] = useState(false)
  const [boxesData, setBoxesData] = useState([])

  const getSingleProduct = async () => {
    setLoading(true)
    try {
      let url = `/category/group`
      const { data } = await axios.get(url);
      if (data?.success) {
        setBoxesData(data.data)
        setLoading(false)

      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message || "Internal server error")
      setLoading(false)

    }
  };

  React.useEffect(() => {
    getSingleProduct();
  }, []);

  return (
    <Box p={2} textAlign="center" >

      <Grid
        templateColumns={`repeat(auto-fit, minmax(300px, 1fr))`}
        gap={4}
        autoRows="1fr"
      >
        {boxesData.map((box, idx) => (

          <ProductsBox products={box} />
        ))}
      </Grid>
    </Box>
  );
}

export default FourBoxesLayout;
