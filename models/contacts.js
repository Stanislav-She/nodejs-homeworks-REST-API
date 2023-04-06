const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');

const contactsPath = path.join(__dirname, 'contacts.json');

const listContacts = async () => {
  const contacts = await fs.readFile(contactsPath, 'utf-8');
  return JSON.parse(contacts);
};

const getContactById = async contactId => {
  const contacts = await listContacts();
  const contact = contacts.find(({ id }) => String(id) === String(contactId));
  if (!contact) {
    return null;
  }
  return contact;
};

const removeContact = async contactId => {
  const contacts = await listContacts();
  const idx = contacts.findIndex(({ id }) => String(id) === String(contactId));
  if (idx === -1) {
    return null;
  }
  const contactToRemove = contacts.splice(idx, 1);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 4));
  return contactToRemove;
};

const addContact = async data => {
  const contacts = await listContacts();
  const newContact = { id: crypto.randomUUID(), ...data };
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 4));
  return newContact;
};

const updateContact = async (contactId, data) => {
  const { name, email, phone } = data;

  const contacts = await listContacts();
  const idx = contacts.findIndex(({ id }) => String(id) === String(contactId));
  if (idx === -1) {
    return null;
  }
  if (name) {
    contacts[idx].name = name;
  }
  if (email) {
    contacts[idx].email = email;
  }
  if (phone) {
    contacts[idx].phone = phone;
  }
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 4));
  return contacts[idx];
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
