const { Contact } = require('../models');
const { HttpError } = require('../utils');

const getAll = async (req, res) => {
  const { _id } = req.user;
  const { page = 1, limit = 20, favorite } = req.query;
  const skip = (page - 1) * limit;
  const contacts = await Contact.find(favorite ? { owner: _id, favorite } : { owner: _id }, '', {
    skip,
    limit: +limit,
  }).populate('owner', 'email');
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
  const { _id: owner } = req.user;
  const newContact = await Contact.create({ ...req.body, owner });
  res.status(201).json(newContact.name);
};

const removeById = async (req, res) => {
  const { contactId } = req.params;
  const removeContact = await Contact.findByIdAndRemove(contactId);
  if (!removeContact) {
    throw new HttpError(404, 'Not found');
  }
  res.status(200).json({ message: 'contact deleted' });
};

const updateById = async (req, res) => {
  const { contactId } = req.params;

  const updateContact = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });
  if (!updateContact) {
    throw new HttpError(404, 'Not found');
  }
  res.status(200).json(updateContact);
};

const updateStatusContact = async (req, res) => {
  const { contactId } = req.params;
  const { favorite } = req.body;
  const updateContact = await Contact.findByIdAndUpdate(contactId, { favorite }, { new: true });
  if (!updateContact) {
    throw new HttpError(404, 'Not found');
  }
  res.status(200).json(updateContact);
};

module.exports = { getAll, getById, add, updateById, removeById, updateStatusContact };
