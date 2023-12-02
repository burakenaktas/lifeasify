import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import classNames from 'classnames';
import { useQuery } from 'react-query';
import ConvertMinutes from '../../helpers/ConvertMinutes';
import CHORE_STATUSSES from '../../helpers/ChoreStatusses';
import Chore from '../../types/types';
// import store from '../../store/store';

function Main() {
  const push = useNavigate();
  // const chores = store((state) => state.chores);
  // const setChores = store((state) => state.chores);

  const { data: todaysChores } = useQuery('chores', async () => {
    const res = await fetch(`http://localhost:8000/todays-chores`);
    console.log(res);
    return res.json();
  });

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="mt-2">{dayjs().format('DD MMM YYYY')}</div>
      <h1 className="text-4xl mb-4">Today's chores</h1>
      <div className="flex flex-col justify-center items-center">
        {todaysChores?.map((chore: Chore) => (
          <div
            key={chore.id}
            className="flex gap-4 my-1 items-center justify-between"
          >
            <input
              type="checkbox"
              checked={CHORE_STATUSSES[chore.status].isDone}
            />
            <div className="w-44">{chore.name}</div>
            <div className="w-44">{chore.timeEffortMinutes} minutes</div>
            <div className="w-44">
              {chore.repeatFrequencyDays} days to the next
            </div>
            <div className="w-44 truncate">
              {ConvertMinutes(
                (chore.timeEffortMinutes * 75 * 365) /
                  chore.repeatFrequencyDays,
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
