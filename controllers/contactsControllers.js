const { Contact } = require("../models/contacts");
const { httpError } = require("../helpers");

const getAllContacts = async (_, res) => {
  const contacts = await Contact.find({});
  return res.status(200).json({message: contacts,});
};

const getContactByID = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await Contact.findById(contactId);
  if (contact) {
    return res.status(200).json({ message: contact });
  }
  return next(httpError(404, `Contact with ${contactId} not found`));
};


const addContact = async (req, res) => {
  const createdContact = await Contact.create(req.body);
  return res.status(201).json({ message: createdContact });
};

const removeContactById = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndDelete(contactId);
  if (result) {
    return res.status(200).json({ message: `${result.name} deleted` });
  }
  return next(httpError(404, `Contact with ${contactId} not found`));
};


const updateContact = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body);
  if (result) {
    return res.status(200).json({ message: `${result.name} was updated` });
  }
  return next(httpError(404, `Contact with ${contactId} not found`));
};

const updateContactStatus = async (req, res, next) => {
  const { contactId } = req.params;
  const { favorite } = req.body;
  const updatedContact = await Contact.findByIdAndUpdate(
    contactId,
    { favorite },
    { new: true }
  );
  if (updatedContact) {
    return res.status(200).json({ message: updatedContact });
  }
  return next(httpError(404, `Contact with ${contactId} not found`));
};

module.exports = {
  getAllContacts,
  getContactByID, 
  addContact,
  removeContactById,
  updateContact,
  updateContactStatus,
};
