import { create } from 'zustand';
import Chore from '../types/types';

const store = create((set) => ({
  chores: [],
  choreHistory: [],
  addChore: (chore: Chore) =>
    set((state) => ({ chores: [...state.chores, chore] })),
  removeChore: (chore: Chore) =>
    set((state) => ({
      chores: state.chores.filter((c) => c !== chore),
    })),
  editChore: ({ chore, newChore }: { chore: Chore; newChore: Chore }) =>
    set((state) => ({
      chores: state.chores.map((c) => (c === chore ? newChore : c)),
    })),
  doneChore: (chore: Chore) =>
    set((state) => ({
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
}));

export default store;
