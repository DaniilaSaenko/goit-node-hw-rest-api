const express = require("express");
const {
  addContactSchema,
  changeContactSchema,
} = require("../../middleware/validationSchemes");
const { validation } = require("../../middleware/validationBody");
const {
  getContacts,
  getContactByID,  
  postContact,
  putContact,
  deleteContact,
} = require("../../controllers/contactsControllers");



const router = express.Router();

router.get("/", getContacts);

router.get("/:contactId", getContactByID);

router.post("/", validation(addContactSchema), postContact);

router.delete("/:contactId", deleteContact);

router.put("/:contactId", validation(changeContactSchema), putContact);

module.exports = router;