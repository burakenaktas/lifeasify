import { create } from 'zustand';
import Chore from '../types/types';

const store = create((set) => ({
  chores: [],
  choreHistory: [],
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
}));

export default store;
