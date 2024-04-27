import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
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
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/auth";

function CreateProduct() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState("");
  const [photo, setPhoto] = useState("");
  const [auth] = useAuth()

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

  useEffect(() => {
    getAllCategory();
  }, []);

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

  const clearall = () => {
    console.log("clearing")
    setPhoto("")
    setCategory("")
    setName("")
    setPrice("")
    setQuantity("")
    setDescription("")
    console.log("Values cleared:", { photo, category, name, price, quantity, description });

  }

  //create product function
  const handleCreate = async (e) => {
    e.preventDefault();
    try {

      const config = {
        headers: {
          Authorization: `Bearer ${auth?.user?.token}`  // Assuming Bearer token authentication
        }
      }

      console.log(shipping)
      const { data } = await axios.post(
        "product",
        {
          "name": name,
          "description": description,
          "price": price,
          "quantity": quantity,
          "photo": photo,
          "category": category,
          "shipping": shipping,
          "slug": slug
        }, config
      );
      console.log("data", data);
      if (data?.success) {
        toast.success("Product Created Successfully");
        clearall();
      }
    } catch (error) {
      console.log(error);
      toast.error("something went wrong");
    }
  };

  return (
    <AdminMenu>
      <Box maxW="650px">
        <Text mb={4} fontSize="2xl">
          Create Product
        </Text>
        <form onSubmit={handleCreate}>
          <Stack
            gap={1}
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
          >
            <FormLabel>Add New Product</FormLabel>

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
                <option key={c.id} value={c.id}>
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
              Add Product
            </Button>

            <Button
              type="button"
              colorScheme='teal'
              variant='outline'
              onClick={clearall}
            >
              Clear All
            </Button>

          </Stack>
        </form>
      </Box>
    </AdminMenu>
  );
}

export default CreateProduct;
