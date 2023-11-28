import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import classNames from 'classnames';
import ConvertMinutes from '../../helpers/ConvertMinutes';
import CHORE_STATUSSES from '../../helpers/ChoreStatusses';
import Chore from '../../types/types';
import store from '../../store/store';

function Main() {
  const push = useNavigate();
  const chores = store((state) => state.chores);
  const setChores = store((state) => state.chores);

  const todaysChores: Chore[] = [
    {
      id: 0,
      label: 'Take out the trash',
      redoAfterDays: 2,
      timeEffortMinute: 10,
      status: 'DONE',
      lastDone: '',
      nextDue: '28-11-2023',
    },
    {
      id: 1,
      label: 'Do the dishes',
      redoAfterDays: 2,
      timeEffortMinute: 10,
      status: 'NOT_DONE',
      lastDone: '',
      nextDue: '28-11-2023',
    },
    {
      id: 2,
      label: 'Love the dishes',
      redoAfterDays: 2,
      timeEffortMinute: 10,
      status: 'AFTER_DEADLINE',
      lastDone: '',
      nextDue: '28-11-2023',
    },
  ];

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="mt-2">{dayjs().format('DD MMM YYYY')}</div>
      <h1 className="text-4xl mb-4">Today's chores</h1>
      <div className="flex flex-col justify-center items-center">
        {todaysChores.map((chore) => (
          <div
            key={chore.id}
            className="flex gap-4 my-1 items-center justify-between"
          >
            <input
              type="checkbox"
              checked={CHORE_STATUSSES[chore.status].isDone}
            />
            <div className="w-44">{chore.label}</div>
            <div className="w-44">{chore.timeEffortMinute} minutes</div>
            <div className="w-44">{chore.redoAfterDays} days to the next</div>
            <div className="w-44 truncate">
              {ConvertMinutes(
                (chore.timeEffortMinute * 75 * 365) / chore.redoAfterDays,
              )}
            </div>
            <div className="w-44">
              <div
                className={classNames(
                  'rounded-full w-32 text-center',
                  // eslint-disable-next-line no-nested-ternary
                  CHORE_STATUSSES[chore.status].color,
                )}
              >
                {CHORE_STATUSSES[chore.status].label}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        className="bg-blue-600 rounded-full px-6 py-1 absolute bottom-20 text-xl cursor-pointer hover:bg-blue-700"
        onClick={() => push('/create-chore')}
      >
        Create Chore
      </div>
    </div>
  );
}

export default Main;
