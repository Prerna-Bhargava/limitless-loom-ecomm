import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import AdminMenu from "../../components/Layout/AdminMenu";
import {
  Box,
  Text,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Divider,
  useColorModeValue,
  Button,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  useDisclosure,

} from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
} from '@chakra-ui/react'
import axios from "axios";
import { toast } from "react-hot-toast";
import CategoryForm from "../../components/forms/CategoryForm";
function CreateCategory() {
  const finalRef = React.useRef(null)
  const { register, handleSubmit, getValues, reset, control, formState: { errors } } = useForm();
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedGroup, setUpdatedGroup] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure()
  //handle Form
  const onSubmit = async categoryData => {
    console.log(categoryData)
    try {
      const { data } = await axios.post("category",
        categoryData,
      );
      if (data?.success) {
        toast.success(`Category ${categoryData.name} is created`)
        getAllCategory();
        reset();
      } else {
        console.log(data.message);
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error);
      toast.error("somthing went wrong in input form");
    }
  };

  //get all cat
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("category/list");
      console.log(data)
      if (data?.success) {
        setCategories(data?.categories);
      }
    } catch (error) {
      console.log(error);
      console.log("Something wwent wrong in getting catgeory");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);


  const handleUpdate = async (e) => {
    try {
      const { data } = await axios.put(
        `category/${selected.id}`,
        {
          name: updatedName,
          group: updatedGroup
        }
      );
      if (data?.success) {
        toast.success(`${updatedName} is updated`);
        setSelected(null);
        setUpdatedName("");
        setUpdatedGroup("")
        getAllCategory();
        onClose()
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    }

  };
  //delete category
  const handleDelete = async (pId) => {
    try {
      const { data } = await axios.delete(
        `category/${pId}`
      );
      if (data.success) {
        toast.success("Category is deleted")
        getAllCategory();
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.error("Somtihing went wrong");
    }
  };

  return (
    <AdminMenu>
      <Box maxW="650px">
        <Text mb={4} fontSize="2xl">
          Manage Categories
        </Text>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack
            gap={1}
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
          >
            <FormControl id="category_name">
              <FormLabel>Add Category Name</FormLabel>
              <Input
                placeholder="Category Name"
                required
                focusBorderColor="teal.500"
                type="text"
                {...register("name", { required: true })}
              />


            </FormControl>

            <FormControl id="category_name">
              <FormLabel>Add Category Group</FormLabel>
              <Input
                placeholder="Category Group Name"
                required
                focusBorderColor="teal.500"
                type="text"
                {...register("group", { required: true })}
              />
            </FormControl>

            <Button
              type="submit"
              bg={"teal.800"}
              mt={3}
              color={"white"}
              _hover={{
                bg: "teal.900",
              }}
            >
              Add Category
            </Button>
          </Stack>
        </form>

        <Stack
          gap={1}
          mt={5}
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Text mb={4} fontSize="1xl">
            List Of Categories
          </Text>
          <TableContainer>
            <Table size="sm">
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th colSpan="2">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {categories?.map((c) => (
                  <>
                    <Tr>
                      <Td key={c._id}>{c.name}</Td>
                      <Td>
                        <Button
                          mr={3}
                          colorScheme="teal"
                          className="btn btn-primary ms-2"
                          onClick={() => {
                            onOpen();
                            setUpdatedName(c.name);
                            setUpdatedGroup(c.group)
                            setSelected(c);
                          }}

                        >
                          Edit
                        </Button>
                        <Button
                          colorScheme="red"
                          className="btn btn-danger ms-2"
                          onClick={() => {
                            handleDelete(c.id);
                          }}
                        >
                          Delete
                        </Button>
                      </Td>
                    </Tr>
                  </>
                ))}
              </Tbody>
            </Table>
          </TableContainer>

        </Stack>

        <Modal finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose}  >
          <ModalOverlay />
          <ModalContent >
            <ModalHeader>Update Category</ModalHeader>
            {/* <ModalCloseButton onClick={() => {
              setVisible(false)
            }} /> */}
            <ModalCloseButton />

            <CategoryForm
              value={updatedName}
              group={updatedGroup}
              setUpdatedGroup={setUpdatedGroup}
              setUpdatedName={setUpdatedName}
              onSubmit={handleUpdate}
            />

          </ModalContent>
        </Modal>

      </Box>
    </AdminMenu>
  );
}

export default CreateCategory;
