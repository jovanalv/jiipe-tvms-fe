import { useState } from "react";

function useModalState(initialStates = {}) {
  const [modals, setModals] = useState(initialStates);

  const openModal = (modalName) => {
    setModals((prev) => ({ ...prev, [modalName]: true }));
  };

  const closeModal = (modalName) => {
    setModals((prev) => ({ ...prev, [modalName]: false }));
  };
  const openModal2 = (modalName) => {
    setModals((prev) => ({ ...prev, [modalName]: true }));
  };

  const closeModal2 = (modalName) => {
    setModals((prev) => ({ ...prev, [modalName]: false }));
  };
  const openModal3 = (modalName) => {
    setModals((prev) => ({ ...prev, [modalName]: true }));
  };

  const closeModal3 = (modalName) => {
    setModals((prev) => ({ ...prev, [modalName]: false }));
  };

  const toggleModal = (modalName) => {
    setModals((prev) => ({ ...prev, [modalName]: !prev[modalName] }));
  };

  return { modals, openModal, closeModal, openModal2, closeModal2, openModal3, closeModal3, toggleModal };
}

export default useModalState;
