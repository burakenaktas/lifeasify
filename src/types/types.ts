import CHORE_STATUSSES from '../helpers/ChoreStatusses';

type Chore = {
  id: number;
  label: string;
  redoAfterDays: number;
  timeEffortMinute: number;
  status: keyof typeof CHORE_STATUSSES;
  lastDone: string;
  nextDue: string;
};

export default Chore;
