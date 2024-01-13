import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useState } from 'react';
import classNames from 'classnames';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ConvertMinutes from '../../helpers/ConvertMinutes';
import { getChoreStatus } from '../../helpers/ChoreStatusses';
import Chore from '../../types/types';

function TodaysChores() {
  const push = useNavigate();
  const queryClient = useQueryClient();
  // const chores = store((state) => state.chores);
  // const setChores = store((state) => state.chores);

  const [deletingChore, setDeletingChore] = useState<Chore | null>(null);

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

  const { mutate: deleteChore, isLoading: isDeletingChore } = useMutation({
    mutationFn: async () => {
      if (isDeletingChore) return;

      const response = await fetch(
        `http://localhost:8000/chores/${deletingChore?._id}`,
        {
          method: 'DELETE',
        },
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
    <div className="container">
      <div className="relative w-full flex flex-col items-center max-h-96 overflow-scroll">
        <div className="flex flex-col justify-center items-center">
          {todaysChores?.length > 0 ? (
            todaysChores?.map((chore: Chore) => {
              const isCompleted = getChoreStatus(chore).label === 'Done';
              return (
                <div
                  key={chore._id}
                  className={
                    'flex gap-4 items-center justify-between hover:bg-gray-700 rounded-full py-1 my-1 px-4 mr-4'
                  }
                >
                  <input
                    type="checkbox"
                    disabled={isCheckingToDo}
                    checked={isCompleted}
                    onChange={() => checkButtonClicked(chore._id)}
                  />
                  <div className="w-44 truncate">{chore.name}</div>
                  <div className="w-44">{chore.timeEffortMinutes} minutes</div>
                  <div className="w-44">
                    {chore.isOneTime
                      ? "Doesn't repeat"
                      : `Repeats every ${
                          chore.repeatFrequencyDays === 1
                            ? 'single'
                            : chore.repeatFrequencyDays
                        } days`}
                  </div>
                  <div className="w-44 truncate">
                    {ConvertMinutes(
                      chore.isOneTime
                        ? chore.timeEffortMinutes
                        : (chore.timeEffortMinutes * 75 * 365) /
                            chore.repeatFrequencyDays,
                    )}
                  </div>
                  <div
                    className={classNames(
                      'rounded-full w-32 text-center text-white',
                      // eslint-disable-next-line no-nested-ternary
                      getChoreStatus(chore).color,
                    )}
                  >
                    {getChoreStatus(chore).label}
                  </div>
                  <div className="flex">
                    <div className="cursor-pointer" onClick={() => push('/')}>
                      <EditIcon />
                    </div>
                    <div
                      className="cursor-pointer"
                      onClick={() => setDeletingChore(chore)}
                    >
                      <DeleteOutlineOutlinedIcon className="text-red-600" />
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-xl mt-8 text-center">
              No chores for today! Enjoy your day!
            </div>
          )}
        </div>

        {deletingChore && (
          <div className="fixed top-0 z-50 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center">
            <div className="bg-black rounded-lg px-12 py-6">
              <div className="text-lg border-b border-gray-800 text-center pb-2">
                Are you sure about deleting the chore named
                <div className="flex justify-center">
                  <div className="text-yellow-300 flex">
                    {deletingChore.name}
                  </div>
                  ?
                </div>
              </div>
              <div className="flex gap-4 mt-4 justify-end">
                <div
                  className="bg-red-600 rounded-full px-4 py-1 text-center text-md cursor-pointer hover:bg-red-700"
                  onClick={() => {
                    deleteChore(deletingChore._id);
                    setDeletingChore(null);
                  }}
                >
                  Yes, delete
                </div>
                <div
                  className="bg-gray-600 rounded-full px-4 py-1 text-center text-md cursor-pointer hover:bg-gray-700"
                  onClick={() => setDeletingChore(null)}
                >
                  No, I regret
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="w-full flex justify-center items-center">
        <div
          className="bg-blue-600 rounded-full px-6 py-1 my-2 text-xl cursor-pointer hover:bg-blue-700"
          onClick={() => push('/create-chore')}
        >
          Create Chore
        </div>
      </div>
    </div>
  );
}

export default TodaysChores;
