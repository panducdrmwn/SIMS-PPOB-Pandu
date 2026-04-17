import { createContext, useContext, useState, useCallback } from "react";

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [modals, setModals] = useState([]);

  const openModal = useCallback((config) => {
    const {
      id = Date.now(),
      content = "",
      footer = null,
      closable = true,
      onClose = null,
    } = config;

    const newModal = {
      id,
      content,
      footer,
      closable,
      onClose,
    };

    setModals((prev) => [...prev, newModal]);
    return id;
  }, []);

  const closeModal = useCallback((id) => {
    setModals((prev) => {
      const modal = prev.find((m) => m.id === id);
      if (modal?.onClose) {
        modal.onClose();
      }
      return prev.filter((m) => m.id !== id);
    });
  }, []);

  const closeAllModals = useCallback(() => {
    setModals([]);
  }, []);

  const updateModal = useCallback((id, updates) => {
    setModals((prev) =>
      prev.map((modal) => (modal.id === id ? { ...modal, ...updates } : modal)),
    );
  }, []);

  const value = {
    modals,
    openModal,
    closeModal,
    closeAllModals,
    updateModal,
  };

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}
