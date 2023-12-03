import dayjs from 'dayjs';
// eslint-disable-next-line import/no-cycle
import Chore from '../types/types';

const CHORE_STATUSSES = {
  DONE: { label: 'Done', color: 'bg-green-500', isDone: true },
  NOT_DONE: { label: 'Not Done', color: 'bg-blue-500' },
  AFTER_DEADLINE: { label: 'After Deadline', color: 'bg-red-500' },
};

export const getChoreStatus = (
  chore: Chore,
): { label: string; color: string; isDone?: boolean } => {
  if (chore.status === 'DONE') return CHORE_STATUSSES.DONE;

  if (dayjs(chore.nextDue).format('YYYY-MM-DD') < dayjs().format('YYYY-MM-DD'))
    return CHORE_STATUSSES.AFTER_DEADLINE;

  return CHORE_STATUSSES.NOT_DONE;
};

export default CHORE_STATUSSES;
