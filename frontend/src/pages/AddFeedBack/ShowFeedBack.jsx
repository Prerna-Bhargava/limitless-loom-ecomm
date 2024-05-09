import { ChevronDownIcon, StarIcon } from '@chakra-ui/icons'
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Button, Divider, Menu, MenuButton, MenuItem, MenuList, Stack, Text } from '@chakra-ui/react'
import React from 'react'

function ShowFeedBack({ comment }) {

    // comment = [
    //     {
    //         "username": "Prerna Bhargava",
    //         "message": "Awesome Product"
    //     },
    //     {
    //         "username": "Test User",
    //         "message": "Time on Delivery"
    //     },
    //     {
    //         "username": "Test User",
    //         "message": "Time on Delivery"
    //     },
    //     {
    //         "username": "Test User",
    //         "message": "Time on Delivery"
    //     },
    //     {
    //         "username": "Test User",
    //         "message": "Time on Delivery"
    //     }
    // ]
    return (
        <Box mb={4}>

            <Accordion allowToggle>

                <AccordionItem width="70%">
                    {/* <h2> */}
                    <AccordionButton border="2px solid #319795" color="#319795" variant="outline" borderRadius="10px" >
                        <Box as='span' flex='1' textAlign='left'>
                            View Feedback
                        </Box>
                        <AccordionIcon />
                    </AccordionButton>
                    {/* </h2> */}
                    <AccordionPanel pb={4}>
                        <Text fontSize="lg" textAlign="center" fontWeight="bold"> Customer FeedBack</Text>
                        <Stack maxHeight="350px" overflowY="scroll">
                            {comment?.map((com) => (
                                <Box my={2}>

                                    <Text fontSize="sm" fontWeight="semibold">
                                        {com.username}
                                    </Text>

                                    <Text my={2} fontSize="m" fontWeight="semibold" color="gray.500" textAlign="left">
                                        {com.message}
                                    </Text>
                                    <Divider />
                                </Box>
                            ))}
                        </Stack>


                    </AccordionPanel>
                </AccordionItem>

            </Accordion>


        </Box>
    )
}

export default ShowFeedBack