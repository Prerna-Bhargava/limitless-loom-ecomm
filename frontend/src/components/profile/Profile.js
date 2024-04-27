import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react'
import React from 'react'
import ProfileForm from '../forms/ProfileForm'
import { useAuth } from '../../context/auth';

function Profile({ visible, setVisible }) {
    const [auth] = useAuth();
    return (
        <>
            <Modal isOpen={visible} onClose={() => setVisible(false)}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>My Profile</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>

                        <ProfileForm {...auth.user} />
                    </ModalBody>

                </ModalContent>
            </Modal>
        </>
    )
}

export default Profile