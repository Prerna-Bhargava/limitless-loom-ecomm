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

} from "@chakra-ui/react";
function CategoryForm({ value, group, setUpdatedName, setUpdatedGroup, onSubmit }) {
  const { handleSubmit, formState: { errors } } = useForm();

  return (
    <>
      <Box maxW="650px">

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack
            gap={1}
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
          >
            <FormControl id="category_name">
              <FormLabel>Update Category Name</FormLabel>
              <Input
                placeholder="Category Name"
                required
                value={value}
                focusBorderColor="teal.500"
                type="text"
                onChange={(e) => setUpdatedName(e.target.value)}
              />


            </FormControl>

            <FormControl id="category_name" my={3}>
              <FormLabel>Update Category Group</FormLabel>
              <Input
                placeholder="Category Group Name"
                required
                focusBorderColor="teal.500"
                type="text"
                value={group}
                onChange={(e) => setUpdatedGroup(e.target.value)}

              />
            </FormControl>

            <Button
              type="submit"
              bg={"teal.800"}
              color={"white"}
              mt={3}
              _hover={{
                bg: "teal.900",
              }}

            >
              Update Category
            </Button>
          </Stack>
        </form>


      </Box>
    </>
  );
}

export default CategoryForm;
