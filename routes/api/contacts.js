const express = require('express');

const { getAll, getById, add, updateById, removeById } = require('../../controllers/contacts');
const { contactSchema } = require('../../schemas');
const { validation, ctrlWrapper } = require('../../middelwares');

const router = express.Router();

router.get('/', ctrlWrapper(getAll));

router.get('/:contactId', ctrlWrapper(getById));

router.post('/', validation(contactSchema), ctrlWrapper(add));

router.delete('/:contactId', ctrlWrapper(removeById));

router.put('/:contactId', validation(contactSchema), ctrlWrapper(updateById));

module.exports = router;
