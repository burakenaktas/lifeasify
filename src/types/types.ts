import CHORE_STATUSSES from '../helpers/ChoreStatusses';

type Chores = {
  id: number;
  label: string;
  redoAfterDays: number;
  timeNeedMinutes: number;
  status: keyof typeof CHORE_STATUSSES;
};

export default Chores;
