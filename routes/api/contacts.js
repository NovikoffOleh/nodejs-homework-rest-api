
const express = require('express');
const Joi = require('joi');

const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require("../../models/contacts");

const { HttpError } = require("../../helpers/index");


const addSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
});

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const result = await listContacts();
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await getContactById(contactId);

    if (!result) {
      throw HttpError(404, `Контакт ${contactId} не занайдено`);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { error } = addSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const result = await addContact(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await removeContact(contactId);
    if (!result) {
      throw HttpError(404, `Контакт ${contactId} не занайдено`);
    }
    res.json({
      message: "Delete success"
    })
  } catch (error) {
    next(error);
  }
});

/*router.put("/:contactId", async (req, res, next) => {
try {
  const { error } = addSchema.validate(req.body);
  if (error) {
    throw HttpError(400, error.message);
  }
  const { contactId } = req.params;
  const result = await updateContact(contactId, req.body);
  if (!result) {
    throw HttpError(404, 'Контакт не знайдено')
  }
  res.json(result);
} catch (error) {
  next(error);
}
});*/
router.put("/:contactId", async (req, res, next) => {
  try {
    const { error } = addSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const { contactId } = req.params;
    const contact = await getContactById(contactId);
    if (!contact) {
      throw HttpError(404, 'Контакт не знайдено')
    }
    const updateContact ={
      ...contact,
      name:req.body.name,
      email:req.body.email,
      phone:req.body.phone,
    };
    const result = await updateContact(contactId, updateContact);
    res.json(result);
  } catch (error) {
    next(error);
  }
  });

module.exports = router;
