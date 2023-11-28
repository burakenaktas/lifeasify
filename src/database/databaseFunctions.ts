import fs from 'fs';
import Chore from '../types/types';

const choresFile = 'chores.json';

const addChoreToDatabase = (chore: Chore) => {
  fs.writeFile(choresFile, JSON.stringify(chores), (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log('Chores datası başarıyla kaydedildi!');
    }
  });
};
