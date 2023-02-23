const {
  listContacts,
  getById,
  removeContact,
  addContact,
  updateContact,
} = require("../models/contacts");

const getContacts = async (req, res) => {
  const data = await listContacts();
  res.status(200).json({ message: data });
};

const getContactByID = async (req, res) => {
  try {
    const { contactId } = req.params;
    const data = await getById(contactId);
    if (data) {
      res.status(200).json({ message: data });
    } else {
      res.status(404).json({ message: "Not Found" });
    }
  } catch (error) {
    res.status(404).json({ message: "Not Found" });
  }
};

const postContact = async (req, res) => {
  const data = await addContact(req.body);
  res.status(201).json({ message: data });
};

const putContact = async (req, res) => {
  const { contactId } = req.params;
  const data = await updateContact(contactId, req.body);
  if (data) {
    res.status(201).json({ message: data });
  } else {
    res.status(404).json({ message: "Not Found" });
  }
};

const deleteContact = async (req, res) => {
  try {
    const { contactId } = req.params;
    const data = await removeContact(contactId);
    if (data) {
      res.status(200).json({ message: "contact deleted" });
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  postContact,
  putContact,
  getContacts,
  getContactByID,
  deleteContact,
};