import { Modal } from "react-bootstrap";

interface CustomModalProps {
  showModal: boolean;
  handleModal: () => void;
  modalTitle: string;
  children?: any;
  size?: "lg" | "sm" | "xl";
}

const CustomModal: React.FC<CustomModalProps> = (props) => {
  const { showModal, handleModal, modalTitle, children, size } = props;

  return (
    <Modal show={showModal} size={size ?? null} onHide={handleModal}>
      <Modal.Header className="modal-header-block">
        <Modal.Title className="modal-title-heading">
          <span>{modalTitle}</span>
          <div className="close-modal-btn" onClick={handleModal} />
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body-block">{children}</Modal.Body>
    </Modal>
  );
};

export default CustomModal;
