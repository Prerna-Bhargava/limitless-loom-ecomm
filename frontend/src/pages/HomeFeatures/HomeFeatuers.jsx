import { Box, SimpleGrid, Icon, Text, Stack, Flex, useBreakpointValue, Heading } from "@chakra-ui/react";
import { FcAssistant, FcDonate, FcInTransit } from "react-icons/fc";

const Feature = ({ title, text, icon }) => {
  return (
    <Stack>
      <Flex
        w={16}
        h={16}
        align={"center"}
        justify={"center"}
        color={"white"}
        rounded={"full"}
        bg={"gray.100"}
        mb={1}
      >
        {icon}
      </Flex>
      <Text fontWeight={600}>{title}</Text>
      <Text color={"gray.600"}>{text}</Text>
    </Stack>
  );
};

function HomeFeatuers() {
  const columns = useBreakpointValue({ sm: 3, md: 3 }); // Adjust columns based on screen size

  return (
    <Box p={10}>
      {/* <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}> */}

      <Heading as="h6" mb={3} >

      </Heading>

      <Text mb={3} textAlign="center" fontSize="2xl" fontWeight="bold">Our Features</Text>

      <SimpleGrid columns={columns} spacing={10}>
        <Feature
          icon={<Icon as={FcAssistant} w={10} h={10} />}
          title={"Fastest Delivery"}
          text={
            "Get your orders delivered with lightning speed! Our efficient delivery system ensures that your items reach your doorstep in the shortest possible time, so you can enjoy your purchases without waiting"
          }
        />
        <Feature
          icon={<Icon as={FcDonate} w={10} h={10} />}
          title={"24/7 Support"}
          text={
            "Need assistance at any time of the day? Our dedicated support team is available round the clock to answer your queries, resolve issues, and provide the help you need. Experience peace of mind with our 24/7 support."
          }
        />
        <Feature
          icon={<Icon as={FcInTransit} w={10} h={10} />}
          title={"Exciting Offers"}
          text={
            "Discover amazing deals and discounts with our exciting offers! From seasonal promotions to exclusive member perks, we bring you unbeatable savings on a wide range of products. Don't miss out on these fantastic deals!"
          }
        />
      </SimpleGrid>
    </Box>
  );
}

export default HomeFeatuers;
