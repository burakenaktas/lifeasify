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

interface Contact {
  _id: string;
  name: string;
  contactInfo: string;
  lastContactDate: string;
}

export default Chore;
export type { Contact };
