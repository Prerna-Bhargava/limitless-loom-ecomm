import React, { useEffect, useState } from "react";
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
  Tooltip,
  chakra,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalContent,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";

import { TriangleDownIcon, TriangleUpIcon, SearchIcon } from "@chakra-ui/icons";
import { useTable, useSortBy } from "react-table";
import axios from "axios";
import ProductForm from "../../components/forms/ProductForm";
import toast from "react-hot-toast";
import { useAuth } from "../../context/auth";

const productsData = [
  {
    image: "https://bit.ly/3YuRSIU",
    name: `APPLE iPhone 13 (Starlight, 128 GB)`,
    category: "Phone",
    id: "1",
  },
  {
    image: "https://bit.ly/3IQJKN6",
    name: `APPLE iPhone 13 (Midnight, 128 GB)`,
    category: "Phone",
    id: "2",
  },
  {
    image: "https://bit.ly/3IVH54Z",
    name: `RedmiBook Pro Core i5 11th Gen - (8 GB/512 GB SSD/Windows 11
Home) Thin and Light Laptop (15.6 inch, Charcoal Gray, 1.8
kg, With MS Office)`,
    category: "Laptop",
    id: "3",
  },
  {
    image: "https://bit.ly/3JlhJPd",
    name: `ASUS TUF Gaming F15 Core i5 10th Gen - (8 GB/512 GB SSD/Windows 11 Home/4 GB Graphics/NVIDIA GeForce GTX 1650/144 Hz) FX506LHB-HN358W Gaming Laptop  (15.6 inch, Black Plastic, 2.30 kg)`,
    category: "Laptop",
    id: "4",
  },
  {
    image: "https://bit.ly/3ZxsJig",
    name: `Realme Pad Mini 3 GB RAM 32 GB ROM 8.7 inch with Wi-Fi+4G Tablet (Grey)`,
    category: "Tablet",
    id: "5",
  },
];

function Products() {
  const finalRef = React.useRef(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [productupdatedData, updateProductData] = useState({})
  const [auth] = useAuth()


  let data = filteredProducts;

  const requestSearch = (searchedVal) => {
    const filteredRows = products.filter((row) => {
      const productTitle = row.name ? row.name.toLowerCase() : null;
      return productTitle.includes(searchedVal.toLowerCase());
    });
    console.log("filtered ", filteredRows)
    setFilteredProducts(filteredRows);
    console.log(filteredProducts)
  };


  const handleUpdate = async (e) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${auth?.user?.token}`  // Assuming Bearer token authentication
        }
      }
      const { data } = await axios.put(
        `product/${productupdatedData.id}`,
        productupdatedData, config
      );
      if (data?.success) {
        toast.success(`${productupdatedData.name} is updated`);
        updateProductData({});
        getAllProduct();
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
      const config = {
        headers: {
          Authorization: `Bearer ${auth?.user?.token}`  // Assuming Bearer token authentication
        }
      }
      const { data } = await axios.delete(
        `product/${pId}`, config
      );
      if (data.success) {
        toast.success("Product is deleted")
        getAllProduct();
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.error("Something went wrong");
    }
  };


  const columns = React.useMemo(
    () => [
      {
        Header: "Image",
        accessor: "image",
        Cell: (props) => (
          <img
            src={props.row.original.photo}
            width="50px"
            alt="product_image"
          />
        ),
        disableSortBy: true,
      },
      {
        Header: "Title",
        accessor: "title",
        Cell: (props) => (
          <>
            <Tooltip label={props.row.original.name}>
              {props.row.original.name.substr(0, 40)}
            </Tooltip>
            ...
          </>
        ),
      },
      {
        Header: "Category",
        accessor: "category",
        Cell: (props) => (
          <>
            <Tooltip label={props.row.original.category.name}>
              {props.row.original.category.name}
            </Tooltip>
            ...
          </>
        ),
      },
      {
        Header: "View",
        Cell: (props) => (
          <Button colorScheme="teal" size="xs" onClick={() => {
            onOpen();
            updateProductData(props.row.original)
          }}>
            Edit/View Info
          </Button>
        ),
      },
      {
        Header: "Delete",
        Cell: (props) => (
          <Button colorScheme="red" size="xs" onClick={() => {
            handleDelete(props.row.original.id)
          }}>
            Delete Product
          </Button>
        ),
      },
    ],
    []
  );


  //get all cat
  const getAllProduct = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${auth?.user?.token}`  // Assuming Bearer token authentication
      }
    }
    try {
      const { data } = await axios.get("product/list", config);
      console.log("prod", data)
      if (data?.success) {
        setProducts(data?.product);
        setFilteredProducts(data?.product);
      }
    } catch (error) {
      console.log(error);
      console.log("Something wwent wrong in getting products list");
    }
  };

  useEffect(() => {
    getAllProduct();
  }, []);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, useSortBy);

  return (
    <AdminMenu>
      <Box>
        <Text mb={4} fontSize="2xl">
          All Products List
        </Text>
        <Stack
          gap={1}
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <InputGroup maxW="350px">
            <InputLeftElement
              pointerEvents="none"
              children={<SearchIcon color="gray.300" />}
            />
            <Input
              focusBorderColor="teal.500"
              type="text"
              placeholder="Search Product"
              onChange={(e) => requestSearch(e.target.value)}
            />
          </InputGroup>

          <TableContainer>
            <Table {...getTableProps()}>
              <Thead>
                {headerGroups.map((headerGroup) => (
                  <Tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <Th
                        {...column.getHeaderProps(
                          column.getSortByToggleProps()
                        )}
                      >
                        {column.render("Header")}
                        <chakra.span pl="4">
                          {column.isSorted ? (
                            column.isSortedDesc ? (
                              <TriangleDownIcon aria-label="sorted descending" />
                            ) : (
                              <TriangleUpIcon aria-label="sorted ascending" />
                            )
                          ) : null}
                        </chakra.span>
                      </Th>
                    ))}
                  </Tr>
                ))}
              </Thead>
              <Tbody {...getTableBodyProps()}>
                {rows.map((row) => {
                  prepareRow(row);

                  return (
                    <Tr {...row.getRowProps()}>
                      {row.cells.map((cell) => (
                        <Td>{cell.render("Cell")}</Td>
                      ))}
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableContainer>
        </Stack>
      </Box>

      <Modal finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose}  >
        <ModalOverlay />
        <ModalContent >
          <ModalHeader>Update Product</ModalHeader>
          <ModalCloseButton />

          <ProductForm
            data={productupdatedData}
            setUpdatedData={updateProductData}
            onSubmit={handleUpdate}
          />

        </ModalContent>
      </Modal>

    </AdminMenu>
  );
}

export default Products;
