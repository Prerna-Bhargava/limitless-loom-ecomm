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
  Select,
  useDisclosure,
  Modal,
  ModalContent,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton
} from "@chakra-ui/react";

import { TriangleDownIcon, TriangleUpIcon, SearchIcon } from "@chakra-ui/icons";
import { useTable, useSortBy } from "react-table";

import dayjs from "dayjs";
import axios from "axios";
import toast from "react-hot-toast";

function AllOrders() {

  const finalRef = React.useRef(null)

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedData, setSelectedData] = useState({})
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [status, setStatus] = useState()

  let data = filteredProducts;

  const requestSearch = (searchedVal) => {
    const filteredRows = products.filter((row) => {
      const productTitle = row.buyer.name ? row.buyer.name.toLowerCase() : null;
      return productTitle.includes(searchedVal.toLowerCase());
    });
    setFilteredProducts(filteredRows);
  };

  const handleUpdate = async (e) => {
    try {
      const { data } = await axios.put(
        `order/${selectedData.id}`,
        {
          status
        }
      );
      if (data?.success) {
        toast.success(`Updated success`);
        onClose()
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    }

  };

  //get all cat
  const getAllOrders = async () => {
    try {
      const { data } = await axios.get("order/list");
      if (data?.success) {
        setProducts(data?.orders);
        setFilteredProducts(data?.orders);
      }
    } catch (error) {
      console.log(error);
      console.log("Something went wrong in getting orders list");
    }
  };

  useEffect(() => {
    getAllOrders();
  }, []);
  const columns = React.useMemo(
    () => [
      {
        Header: "Image",
        accessor: "image",
        Cell: (props) => (
          <img
            src={props.row.original.products[0].photo}
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
            <Tooltip label={props.row.original.products[0].name}>
              {props.row.original.products[0].name.substr(0, 20)}
            </Tooltip>
            ...
          </>
        ),
      },
      {
        Header: "Buyer",
        accessor: "buyer",
        Cell: (props) => (
          <>
            <Tooltip label={props.row.original.buyer.name}>
              {props.row.original.buyer?.name?.substr(0, 30)}
            </Tooltip>
            ...
          </>
        ),
      },
      {
        Header: "Order Date",
        accessor: "createdAt",
      },
      {
        Header: "Category",
        accessor: "category",
        Cell: (props) => (
          <Tooltip label={props.row.original.products[0].slug}>
            <span>{props.row.original.products[0].slug}</span>
          </Tooltip>
        ),
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: (props) => (
          <Tooltip label={props.row.original.status}>
            <span>{props.row.original.status}</span>
          </Tooltip>
        ),
      },
      {
        Header: "Quantity",
        accessor: "quantity",
        Cell: (props) => (
          <Tooltip label={`${props.row.original.products.length} products`}>
            <span>{props.row.original.products.length}</span>
          </Tooltip>
        ),
      },
      {
        Header: "Edit",
        Cell: (props) => (
          <Button colorScheme="teal" size="xs" onClick={() => {
            onOpen();
            setSelectedData(props.row.original)
            setStatus(props.row.original.status)
          }}>
            Edit Status
          </Button>
        ),
      }
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, useSortBy);

  return (
    <AdminMenu>
      <Box>
        <Text mb={4} fontSize="2xl">
          All Orders List
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
              placeholder="Search Order"
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

          <Stack p={4}>

            <Select
              placeholder="Select the status"

              onChange={(event) => {
                setStatus(event.target.value)
              }}
              value={status}
            >

              <option value="Not process">Not Process</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Deliverd">Deliverd</option>
              <option value="Cancel">Cancel</option>
            </Select>


            <Stack direction="row" marginLeft="auto" >

              <Button
                width="200px"

                bg={"teal.800"}
                color={"white"}
                _hover={{
                  bg: "teal.900",
                }}
                onClick={handleUpdate}
              >
                Update Status
              </Button>
            </Stack>



          </Stack>

        </ModalContent>
      </Modal>

    </AdminMenu>
  );
}

export default AllOrders;
