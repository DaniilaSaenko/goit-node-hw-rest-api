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
const validateBody = require("../../middleware/validateBody");
const { auth } = require("../../middleware/auth");


const router = express.Router();

router.get("/", tryCatchWrapper(auth), tryCatchWrapper(getAllContacts));

router.get(
  "/:contactId",
  tryCatchWrapper(auth),
  tryCatchWrapper(getContactByID)
);

router.post(
  "/",
  tryCatchWrapper(auth),
  validateBody(addContactSchema),
  tryCatchWrapper(addContact)
);

router.delete("/:contactId", tryCatchWrapper(auth), tryCatchWrapper(removeContactById));

router.put(
  "/:contactId",
  tryCatchWrapper(auth),
  validateBody(changeContactSchema),
  tryCatchWrapper(updateContact)
);

router.put(
  "/:contactId/favorite",
  tryCatchWrapper(auth),
  validateBody(updateStatusContactSchema),
  tryCatchWrapper(updateContactStatus)
);

module.exports = router;