const express = require("express");
const {
  postAddContact,
  putChangeContact,
  getContacts,
  getContactByID,
  deleteContact,
} = require("../../controllers/contactsControllers");

const {
  addContactSchema,
  changeContactSchema,
} = require("../middleware/validationSchemes");
const { validation } = require("../middleware/validationBody");

const router = express.Router();

router.get("/", getContacts);

router.get("/:contactId", getContactByID);

router.post("/", validation(addContactSchema), postAddContact);

router.delete("/:contactId", deleteContact);

router.put("/:contactId", validation(changeContactSchema), putChangeContact);

module.exports = router;