const { Contact } = require('../models');
const { HttpError } = require('../utils');

const getAll = async (_, res) => {
  const contacts = await Contact.find();
  res.status(200).json(contacts);
};

const getById = async (req, res) => {
  const { contactId } = req.params;

  const contact = await Contact.findById(contactId);
  if (!contact) {
    throw new HttpError(404, 'Not found');
  }
  res.status(200).json(contact);
};

const add = async (req, res) => {
  const contact = await Contact.create(req.body);
  res.status(201).json(contact);
};

const removeById = async (req, res) => {
  const { contactId } = req.params;

  const contact = await Contact.findByIdAndRemove(contactId);
  if (!contact) {
    throw new HttpError(404, 'Not found');
  }
  res.status(200).json({ message: 'contact deleted' });
};

const updateById = async (req, res) => {
  const { contactId } = req.params;

  const contact = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });
  if (!contact) {
    throw new HttpError(404, 'Not found');
  }
  res.status(200).json(contact);
};

const updateStatusContact = async (req, res) => {
  const { contactId } = req.params;
  const { favorite } = req.body;
  const contact = await Contact.findByIdAndUpdate(contactId, { favorite }, { new: true });
  if (!contact) {
    throw new HttpError(404, 'Not found');
  }
  res.status(200).json(contact);
};

module.exports = { getAll, getById, add, updateById, removeById, updateStatusContact };
