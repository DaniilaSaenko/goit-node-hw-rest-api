const { Contact } = require("../models/contacts");
const { httpError } = require("../helpers");

const getAllContacts = async (req, res, next) => {
  const { _id } = req.user;
  const contacts = await Contact.find({ owner: _id });
  return res.status(200).json({
    message: contacts,
  });
};

const getContactByID = async (req, res, next) => {
  const { contactId } = req.params;
  const { _id } = req.user;
  const contact = await Contact.findById(contactId);
  if (String(contact.owner) === String(_id)) {
    return res.status(200).json({ message: contact });
  }
  return next(httpError(404, `Contact with ${contactId} not found`));
};


const addContact = async (req, res, next) => {
  const { name, email, phone } = req.body;
  const { _id } = req.user;
  const createdContact = await Contact.create({
    name,
    email,
    phone,
    owner: _id,
  });
  return res.status(201).json({ message: createdContact });
};

const removeContactById = async (req, res, next) => {
  const { contactId } = req.params;
  const { _id } = req.user;
  const result = await Contact.findByIdAndDelete(contactId, { owner: _id });
  if (result) {
    return res.status(200).json({ message: `${result.name} deleted` });
  }
  return next(httpError(404, `Contact with ${contactId} not found`));
};


const updateContact = async (req, res, next) => {
  const { contactId } = req.params;
  const { _id } = req.user;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, {
    owner: _id,
  });
  if (result) {
    return res.status(200).json({ message: `${result.name} was updated` });
  }
  return next(httpError(404, `Contact with ${contactId} not found`));
};

const updateContactStatus = async (req, res, next) => {
  const { contactId } = req.params;
  const { favorite } = req.body;
  const { _id } = req.user;
  const updatedContact = await Contact.findByIdAndUpdate(
    contactId,
    { favorite },
    { owner: _id, favorite },
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
