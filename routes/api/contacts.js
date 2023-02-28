const express = require("express");
const {
  getAllContacts,
  getContactByID,
  addContact,
  removeContactById,
  updateContact,
  updateContactStatus,
} = require("../../controllers/contactsControllers");

const { tryCatchWrapper } = require("../../helpers");

const {
  addContactSchema,
  changeContactSchema,
  updateStatusContactSchema,
} = require("../../middleware/validationSchemes");
const { validation } = require("../../middleware/validationBody");

const router = express.Router();

router.get("/", tryCatchWrapper(getAllContacts));

router.get("/:contactId", tryCatchWrapper(getContactByID));

router.post("/", validation(addContactSchema), tryCatchWrapper(addContact));

router.delete("/:contactId", tryCatchWrapper(removeContactById));

router.put(
  "/:contactId",
  validation(changeContactSchema),
  tryCatchWrapper(updateContact)
);

router.put(
  "/:contactId/favorite",
  validation(updateStatusContactSchema),
  tryCatchWrapper(updateContactStatus)
);

module.exports = router;