import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Box,
  Text,
  Stack,
  FormControl,
  FormLabel,
  Input,
  useColorModeValue,
  Button,
  Select,
  Textarea,

} from "@chakra-ui/react";
import axios from "axios";
import toast from "react-hot-toast";
function ProductForm({ data, setUpdatedData, onSubmit }) {
  const { handleSubmit, formState: { errors } } = useForm();

  const [category, setCategory] = useState(data.category?._id || "");
  const [photo, setPhoto] = useState(data.photo || "");
  const [name, setName] = useState(data.name || "");
  const [id, setId] = useState(data.id || "");
  const [slug, setSlug] = useState(data.category?.slug || "");
  const [description, setDescription] = useState(data.description || "");
  const [price, setPrice] = useState(data.price || "");
  const [quantity, setQuantity] = useState(data.quantity || "");
  const [shipping, setShipping] = useState(data.shipping || false);
  const [categories, setCategories] = useState([]);



  //get all category
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/category/list");
      if (data?.success) {
        setCategories(data?.categories);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something wwent wrong in getting catgeory");
    }
  };

  const handleImageUpload = (e) => {
    console.log("converting image")
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageDataUrl = reader.result;
        console.log("new image ", imageDataUrl)
        setPhoto(imageDataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);


  const handleUpdateProduct = () => {
    // Perform your update API call here using the updated state values
    const updatedProductData = {
      id,
      category,
      photo,
      name,
      description,
      price,
      slug,
      quantity,
      shipping,
    };
    // Perform your update API call with updatedProductData
    console.log("Updated Product Data:", updatedProductData);

    setUpdatedData(updatedProductData)

    onSubmit()
  };

  return (
    <>
      <Box maxW="650px">

        <form onSubmit={handleSubmit(handleUpdateProduct)}>

          <Stack
            gap={1}
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
          >

            <Select
              placeholder="Select a category"

              onChange={(event) => {
                const selectedCategory = categories.find((c) => c.id === event.target.value);
                if (selectedCategory) {
                  setCategory(selectedCategory.id);
                  setSlug(selectedCategory.slug);
                }
              }}
              value={category}
            >
              {categories?.map((c) => (
                <option key={c.slug} value={c.id} name={c.slug}>
                  {c.name}
                </option>
              ))}
            </Select>

            <FormControl id="slug">
              <Input
                isDisabled={true}
                placeholder="Slug"
                focusBorderColor="teal.500"
                type="text"
                value={slug}
              />
            </FormControl>

            <FormControl id="product_image">
              <label for="image-upload" class="custom-file-upload">
                Upload Product Image
              </label>
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                // onChange={(e) => setPhoto(e.target.files[0])}
                onChange={handleImageUpload}
              />
            </FormControl>

            <Stack>
              {photo && (
                <div className="text-center">
                  <img
                    src={photo}
                    alt="product_photo"
                    height={"200px"}
                    className="img img-responsive"
                  />
                </div>
              )}
            </Stack>

            <FormControl id="product_title">
              <Input
                // className="custom_image_input"
                placeholder="Title"
                focusBorderColor="teal.500"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>

            <FormControl id="product_description">
              <Textarea
                placeholder="Description"
                focusBorderColor="teal.500"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormControl>

            <FormControl id="product_price">
              <Input
                placeholder="Price"
                focusBorderColor="teal.500"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </FormControl>

            <FormControl id="product_quantity">
              <Input
                placeholder="Quantity"
                focusBorderColor="teal.500"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </FormControl>

            <Select
              placeholder="Select Shipping"
              onChange={(e) => {
                setShipping(e.target.value);
              }}
              value={shipping}
            >
              <option value="false">No</option>
              <option value="true">Yes</option>
            </Select>

            <Button
              type="submit"
              bg={"teal.800"}
              color={"white"}
              _hover={{
                bg: "teal.900",
              }}
            >
              Update Product
            </Button>


          </Stack>


        </form>


      </Box>
    </>
  );
}

export default ProductForm;
