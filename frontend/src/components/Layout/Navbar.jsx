import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
  Divider,
  Input,
  InputGroup,
  InputLeftElement,
  Center,
  Avatar,
} from "@chakra-ui/react";
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";

import { Link as RouterLink, useNavigate } from "react-router-dom";

import { SearchIcon } from "@chakra-ui/icons";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useCart } from "../../context/cart";
import React, { useState } from "react";
import axios from "axios";
import CartProducts from "../cart/CartProducts";
import { useAuth } from "../../context/auth";
import Profile from "../profile/Profile";

function Navbar() {
  const { isOpen, onToggle } = useDisclosure();
  const [categories, setCategories] = React.useState([]);
  const [visible, setVisible] = useState(false)
  const [cart] = useCart();
  const [auth] = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("category/list");
        setCategories(response.data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);


  return (
    <Box>
      <Flex
        bg={useColorModeValue("white", "gray.800")}
        color={useColorModeValue("gray.600", "white")}
        minH={"60px"}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor={useColorModeValue("gray.200", "gray.900")}
        align={"center"}
      >
        <Flex
          flex={{ base: 1, md: "auto" }}
          ml={{ base: -2 }}
          display={{ base: "flex", md: "none" }}
        >
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={"ghost"}
            aria-label={"Toggle Navigation"}
          />
        </Flex>
        {/* <Flex flex={{ base: 1 }} justify={{ base: "center", md: "start" }}> */}
        <Flex flex={{ base: 1 }} justify={{ base: "center", md: "start" }}>

          <Center>
            <Text
              textAlign={useBreakpointValue({ base: "center", md: "left" })}
              fontFamily={"heading"}
              color={useColorModeValue("gray.800", "white")}
            >
              Limitless Loom
            </Text>
          </Center>


          <Flex display={{ base: "none", md: "flex" }} ml={10}>
            <DesktopNav categories={categories} />
          </Flex>

          {!auth?.user && !auth.user.admin == 1 &&
            <Box onClick={() => setVisible(true)}>
              <Text onClick={() => {navigate("/admin")}} _hover={{
                "cursor": "pointer"
              }} fontSize="md" fontWeight="semibold" ml={8} my={4}>Admin Panel</Text>
            </Box>
          }
        </Flex>


        <Stack mr={5} display={{ base: "none", md: "inline-flex" }}>
          <form>
            <Stack direction="row">
              <InputGroup maxW="350px">
                <Input
                  focusBorderColor="teal.500"
                  type="text"
                  placeholder="Search Product"
                />
                <IconButton
                  type="submit"
                  mx={3}
                  colorScheme="teal"
                  aria-label="Search database"
                  onClick={(e) => {
                    console.log(e)
                  }}
                  icon={<SearchIcon />}
                />
              </InputGroup>
            </Stack>
          </form>
        </Stack>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={"flex-end"}
          direction={"row"}
          spacing={6}
        >
          <RouterLink to="/login">
            <Button
              sx={{ marginTop: "10px" }}
              display={{ base: "none", md: "inline-flex" }}
              fontSize={"sm"}
              fontWeight={400}
              variant={"link"}
            >
              Sign In
            </Button>
          </RouterLink>
          <RouterLink to="/register">
            <Button
              display={{ base: "none", md: "inline-flex" }}
              fontSize={"sm"}
              fontWeight={400}
              color={"white"}
              bg={"teal.800"}
              _hover={{
                bg: "teal.900",
              }}
            >
              Sign Up
            </Button>
          </RouterLink>
          {auth?.user &&
            <Box onClick={() => setVisible(true)}>
              <Avatar src='https://bit.ly/broken-link' size="sm" />
              <Profile setVisible={setVisible} visible={visible} />
            </Box>
          }

        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav categories={categories} />
      </Collapse>
    </Box>
  );
}

const DesktopNav = ({ categories }) => {
  const linkColor = useColorModeValue("gray.600", "gray.200");
  const linkHoverColor = useColorModeValue("gray.800", "white");
  const popoverContentBgColor = useColorModeValue("white", "gray.800");
  const [cart] = useCart();

  return (
    <Stack direction={"row"} spacing={4}>
      {NAV_ITEMS.map((navItem) => (
        <Center key={navItem.label}>
          <Popover trigger={"hover"} placement={"bottom-start"}>
            <PopoverTrigger>
              <RouterLink
                p={2}
                to={navItem.href ?? ""}
                fontSize={"sm"}
                color={linkColor}
                _hover={{
                  textDecoration: "none",
                  color: linkHoverColor,
                }}
              >
                {navItem.label}
              </RouterLink>
            </PopoverTrigger>

            {categories && navItem.label == "Categories" && (
              <PopoverContent
                border={0}
                boxShadow={"xl"}
                bg={popoverContentBgColor}
                p={4}
                rounded={"xl"}
                minW={"sm"}
              >
                <Stack>
                  {categories.map((child) => (
                    <>
                      <DesktopSubNav key={child.name} {...child} />
                    </>
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Center>
      ))}
      <CartProducts cart={cart} />


    </Stack>
  );
};

const DesktopSubNav = ({ name, slug, subLabel }) => {


  return (
    <RouterLink
      to={`/product/category/${slug}`}
      role={"group"}
      display={"block"}
      p={2}
      rounded={"md"}
      _hover={{ bg: useColorModeValue("teal.50", "gray.900") }}
    >
      <Stack direction={"row"} align={"center"}>
        <Box>
          <Text
            transition={"all .3s ease"}
            _groupHover={{ color: "teal.400" }}
            fontWeight={500}
          >
            {name}
          </Text>
          <Text fontSize={"sm"}>{subLabel}</Text>
        </Box>
        <Flex
          transition={"all .3s ease"}
          transform={"translateX(-10px)"}
          opacity={0}
          _groupHover={{ opacity: "100%", transform: "translateX(0)" }}
          justify={"flex-end"}
          align={"center"}
          flex={1}
        >
          <Icon color={"teal.400"} w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </RouterLink>
  );
};

const MobileNav = ({ categories }) => {
  const [cart] = useCart();
  const [auth] = useAuth()
  const [visible, setVisible] = useState(false)

  return (
    <Stack
      borderBottom="1px solid #ced6e0"
      bg={useColorModeValue("white", "gray.800")}
      p={4}
      display={{ md: "none" }}
    >
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} categories={categories} />
      ))}

      <CartProducts cart={cart} />

      <Divider />

      <Stack
        flex={{ base: 1, md: 0 }}
        pt={2}
        justifyContent={"left"}
        direction={"column"}
        spacing={6}
      >
        <Stack direction="row" margin={"0px 0px -10px"}>
          <RouterLink to="/login">
            <Button
              sx={{ margin: "10px 0px 0px 0px" }}
              fontSize={"sm"}
              fontWeight={400}
              variant={"link"}
            >
              Sign In
            </Button>
          </RouterLink>
          <RouterLink to="/register">
            <Button
              fontSize={"sm"}
              fontWeight={400}
              color={"white"}
              bg={"teal.800"}
              _hover={{
                bg: "teal.900",
              }}
            >
              Sign Up
            </Button>
          </RouterLink>

          {auth?.user &&
            <Box onClick={() => setVisible(true)}>
              <Avatar src='https://bit.ly/broken-link' size="sm" />
              <Profile setVisible={setVisible} visible={visible} />
            </Box>
          }

        </Stack>
        <Divider />
        <Stack margin="10px 0px 0px 0px!important">
          <InputGroup maxW="350px">
            <form>
              <Stack direction="row">
                <Input
                  focusBorderColor="teal.500"
                  type="text"
                  placeholder="Search Product"
                />
                <IconButton
                  type="submit"
                  mx={3}
                  colorScheme="teal"
                  aria-label="Search database"

                  icon={<SearchIcon />}
                />
              </Stack>
            </form>
          </InputGroup>
        </Stack>
      </Stack>
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href, categories }) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={Link}
        href={href ?? "#"}
        justify={"space-between"}
        align={"center"}
        _hover={{
          textDecoration: "none",
        }}
      >
        <Text color={useColorModeValue("gray.600", "gray.200")}>{label}</Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={"all .25s ease-in-out"}
            transform={isOpen ? "rotate(180deg)" : ""}
            w={6}
            h={6}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: "0!important" }}>
        <Stack
          borderLeft={1}
          borderStyle={"solid"}
          borderColor={useColorModeValue("gray.200", "gray.700")}
          align={"start"}
        >
          {categories &&
            categories.map((child) => (
              <RouterLink key={child.name} py={2} to={`/product/category/${child.slug}`}>
                {child.name}
              </RouterLink>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

const NAV_ITEMS = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Contact",
    href: "/contact",
  },
  {
    label: "Categories",
    children: [
    ],
  },
];

export default Navbar;
