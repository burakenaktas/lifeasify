import { create } from 'zustand';
import Chore, { Contact } from '../types/types';

const store = create((set) => ({
  chores: [],
  choreHistory: [],
  contacts: [],
  addChore: (chore: Chore) =>
    set((state: any) => ({ chores: [...state.chores, chore] })),
  removeChore: (chore: Chore) =>
    set((state: any) => ({
      chores: state.chores.filter((c: Chore) => c !== chore),
    })),
  editChore: ({ chore, newChore }: { chore: Chore; newChore: Chore }) =>
    set((state: any) => ({
      chores: state.chores.map((c: Chore) => (c === chore ? newChore : c)),
    })),
  doneChore: (chore: Chore) =>
    set((state: any) => ({
      choreHistory: [...state.choreHistory, chore],
    })),
  setChoreHistory: (choreHistory: Chore[]) =>
    set(() => ({
      choreHistory,
    })),
  setChores: (chores: Chore[]) =>
    set(() => ({
      chores,
    })),
  addContact: (contact: Contact) =>
    set((state: any) => ({ contacts: [...state.contacts, contact] })),
  removeContact: (contact: Contact) =>
    set((state: any) => ({
      contacts: state.contacts.filter((c: Contact) => c !== contact),
    })),
  updateContactLastMeeting: (contactId: string, newDate: string) =>
    set((state: any) => ({
      contacts: state.contacts.map((c: Contact) =>
        // eslint-disable-next-line no-underscore-dangle
        c._id === contactId ? { ...c, lastContactDate: newDate } : c,
      ),
    })),
  setContacts: (contacts: Contact[]) =>
    set(() => ({
      contacts,
    })),
}));

export default store;
