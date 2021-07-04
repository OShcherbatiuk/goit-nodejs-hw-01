const fs = require("fs/promises");
const path = require("path");
const { v4 } = require("uuid");

const contactsPath = path.join(__dirname, "./db/contacts.json");

async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath);
    const contacts = JSON.parse(data);
    return contacts;
  } catch (error) {
    error.mesage = "Cannot read data";
    throw error;
  }
}

async function getContactById(contactId) {
  try {
    const contacts = await listContacts();
    const findContact = contacts.find((item) => item.id == contactId);
    if (!findContact) {
      throw new Error("Incorrect ID");
    }

    return findContact;
  } catch (error) {
    error.message = "Contact not found";
    throw error;
  }
}

async function removeContact(contactId) {
  try {
    const contacts = await listContacts();
    const index = contacts.findIndex((item) => item.id == contactId);
    if (index === -1) {
      throw new Error("Incorrect ID");
    }
    const filteredContacts = contacts.filter((item) => item.id != contactId);
    await updateContactsList(filteredContacts);
    return filteredContacts;
  } catch (error) {
    error.message = "Contact not found";
    throw error;
  }
}

async function addContact(name, email, phone) {
  const newContact = { id: v4(), name, email, phone };
  try {
    const contacts = await listContacts();
    const newContacts = [...contacts, newContact];

    await updateContactsList(newContacts);
    return newContact;
  } catch (error) {
    throw error;
  }
}

async function updateContactsList(contacts) {
  const str = JSON.stringify(contacts);
  try {
    await fs.writeFile(contactsPath, str);
  } catch (error) {
    throw error;
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
