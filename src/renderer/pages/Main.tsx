/* eslint-disable no-underscore-dangle */
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import classNames from 'classnames';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import ConvertMinutes from '../../helpers/ConvertMinutes';
import { getChoreStatus } from '../../helpers/ChoreStatusses';
import Chore from '../../types/types';
// import store from '../../store/store';

function Main() {
  const push = useNavigate();
  const queryClient = useQueryClient();
  // const chores = store((state) => state.chores);
  // const setChores = store((state) => state.chores);

  const { data: todaysChores } = useQuery('chores', async () => {
    const res = await fetch(`http://localhost:8000/todays-chores`);
    return res.json();
  });

  const { mutate: completeChore, isLoading: isCheckingToDo } = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(
        `http://localhost:8000/complete-chore/${id}`,
      );

      // eslint-disable-next-line consistent-return
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries('chores');
    },
  });

  const checkButtonClicked = (id: string) => {
    completeChore(id);
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="mt-2">{dayjs().format('DD MMM YYYY')}</div>
      <h1 className="text-4xl mb-4">Today's chores</h1>
      <div className="flex flex-col justify-center items-center">
        {todaysChores?.map((chore: Chore) => {
          const isCompleted = getChoreStatus(chore).label === 'Done';
          return (
            <div
              key={chore._id}
              className="flex gap-4 items-center justify-between hover:bg-gray-700 rounded-full py-2 px-4"
            >
              <input
                type="checkbox"
                disabled={isCheckingToDo}
                checked={isCompleted}
                onChange={() => checkButtonClicked(chore._id)}
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
              <div
                className={classNames(
                  'rounded-full w-32 text-center',
                  // eslint-disable-next-line no-nested-ternary
                  getChoreStatus(chore).color,
                )}
              >
                {getChoreStatus(chore).label}
              </div>
            </div>
          );
        })}
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
