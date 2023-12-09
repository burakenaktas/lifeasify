// eslint-disable-next-line import/no-cycle
import CHORE_STATUSSES from '../helpers/ChoreStatusses';

type Chore = {
  _id: string;
  name: string;
  repeatFrequencyDays: number;
  timeEffortMinutes: number;
  note?: string;
  status: keyof typeof CHORE_STATUSSES;
  lastDone: string;
  nextDue: string;
  isOneTime: boolean;
};

export default Chore;
