import dayjs from 'dayjs';
import classNames from 'classnames';
import ConvertMinutes from '../../helpers/ConvertMinutes';
import CHORE_STATUSSES from '../../helpers/ChoreStatusses';
import Chores from '../../types/types';

function Main() {
  const todaysChores: Chores[] = [
    {
      id: 0,
      label: 'Take out the trash',
      redoAfterDays: 2,
      timeNeedMinutes: 10,
      status: 'DONE',
    },
    {
      id: 1,
      label: 'Do the dishes',
      redoAfterDays: 2,
      timeNeedMinutes: 10,
      status: 'NOT_DONE',
    },
    {
      id: 2,
      label: 'Love the dishes',
      redoAfterDays: 2,
      timeNeedMinutes: 10,
      status: 'AFTER_DEADLINE',
    },
  ];

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="mt-2">{dayjs().format('DD MMM YYYY')}</div>
      <h1 className="text-4xl mb-4">Today's chores </h1>
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
            <div className="w-44">{chore.timeNeedMinutes} minutes</div>
            <div className="w-44">{chore.redoAfterDays} days to the next</div>
            <div className="w-44 truncate">
              {ConvertMinutes(
                (chore.timeNeedMinutes * 75 * 365) / chore.redoAfterDays,
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
    </div>
  );
}

export default Main;
