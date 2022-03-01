import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  Image,
  Link,
} from '@chakra-ui/react';

interface ModalViewImageProps {
  isOpen: boolean;
  onClose: () => void;
  imgUrl: string;
}

export function ModalViewImage({
  isOpen,
  onClose,
  imgUrl,
}: ModalViewImageProps): JSX.Element {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay>
        <ModalContent background="pGray.800">
          <ModalBody padding="0px">
            <Image src={imgUrl} width="100%" maxW="900px" maxH="600px" />
          </ModalBody>
          <ModalFooter height="32px" justifyContent="flex-start" px="10px">
            <Link href={imgUrl} isExternal fontSize={14}>
              Abrir original
            </Link>
          </ModalFooter>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
}
