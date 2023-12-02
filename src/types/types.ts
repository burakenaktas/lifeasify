import CHORE_STATUSSES from '../helpers/ChoreStatusses';

type Chore = {
  id: number;
  name: string;
  repeatFrequencyDays: number;
  timeEffortMinutes: number;
  note?: string;
  status: keyof typeof CHORE_STATUSSES;
  lastDone: string;
  nextDue: string;
};

export default Chore;
