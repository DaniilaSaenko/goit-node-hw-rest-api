const fs = require("fs/promises");
const path = require("path");

const contactsPath = path.resolve("models/contacts.json");

const listContacts = async () => {
  try {
    const contactsList = await fs.readFile(contactsPath, "utf8");
    const contacts = JSON.parse(contactsList);
    return contacts;
  } catch (error) {
    console.log(error.message);
  }
};

const getById = async (contactId) => {
  try {
    const list = await listContacts();
    const findContact = list.find((e) => e.id === contactId);
    return findContact;
  } catch (error) {
    console.log(error.message);
  }
};

const removeContact = async (contactId) => {
  try {
    const list = await listContacts();
    const findContact = list.find((e) => e.id === contactId);
    if (!findContact) {
      return undefined;
    }
    const newContacts = list.filter((e) => e.id !== contactId);
    await fs.writeFile(contactsPath, JSON.stringify(newContacts));
    return findContact;
  } catch (error) {
    console.log(error.message);
  }
};

const addContact = async (body) => {
  try {
    const { name, email, phone } = body;
    const contact = {
      id: Date.now().toString(),
      name,
      email,
      phone,
    };
    const list = await listContacts();
    const newContacts = [...list, contact];
    await fs.writeFile(contactsPath, JSON.stringify(newContacts));
    return contact;
  } catch (error) {
    console.log(error.message);
  }
};

const updateContact = async (contactId, body) => {
  try {
    const { name, email, phone } = body;
    const list = await listContacts();
    const [contact] = list.filter((e) => e.id === contactId);
    contact.name = name;
    contact.email = email;
    contact.phone = phone;
    const newContacts = [...list];
    await fs.writeFile(contactsPath, JSON.stringify(newContacts));
    return contact;
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  listContacts,
  getById,
  removeContact,
  addContact,
  updateContact,
};