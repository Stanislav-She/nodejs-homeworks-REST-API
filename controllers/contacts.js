const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require('../models/contacts');

const getAll = async (req, res) => {
  const contacts = await listContacts();
  res.status(200).json(contacts);
};

const getById = async (req, res) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);
  if (!contact) {
    const error = new Error('Not found');
    error.status = 404;
    throw error;
  }
  res.status(200).json(contact);
};

const add = async (req, res) => {
  const contact = await addContact(req.body);
  res.status(201).json(contact);
};

const removeById = async (req, res) => {
  const { contactId } = req.params;
  const contact = await removeContact(contactId);
  if (!contact) {
    const error = new Error('Not found');
    error.status = 404;
    throw error;
  }
  res.status(200).json({ message: 'contact deleted' });
};

const updateById = async (req, res) => {
  const { contactId } = req.params;
  const contact = await updateContact(contactId, req.body);
  if (!contact) {
    const error = new Error('Not found');
    error.status = 404;
    throw error;
  }
  res.status(200).json(contact);
};

module.exports = { getAll, getById, add, updateById, removeById };
