import { createContext, useState, useEffect } from "react";
import ContactService from "../services/contactService"; // Import API
import {
  getContacts,
  createContact,
  deleteContact,
} from "../services/contactService";

export const ContactContext = createContext();

export const ContactProvider = ({ children }) => {
  const [contacts, setContacts] = useState([]);

  // 🔹 Hàm lấy danh sách contact từ API
  const fetchContacts = async () => {
    try {
      const data = await getContacts();
      setContacts(data || []);
    } catch (error) {
      console.error("Lỗi khi tải danh sách contact:", error);
    }
  };

  useEffect(() => {
    fetchContacts(); // Gọi API khi component mount
  }, []);

  const addContact = async (contact) => {
    await createContact(contact);
    fetchContacts(); // Cập nhật danh sách
  };

  const deleteContact = async (id) => {
    await deleteContact(id);
    fetchContacts(); // Cập nhật danh sách
  };

  return (
    <ContactContext.Provider
      value={{ contacts, addContact, deleteContact, fetchContacts }}
    >
      {children}
    </ContactContext.Provider>
  );
};
