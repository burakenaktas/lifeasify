import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useState } from 'react';
import Chore from '../../types/types';
import Mission from './Missions/Mission';

function TodaysChores() {
  const push = useNavigate();
  const queryClient = useQueryClient();
  // const chores = store((state) => state.chores);
  // const setChores = store((state) => state.chores);

  const [deletingChore, setDeletingChore] = useState<Chore | null>(null);

  const { data: todaysChores } = useQuery('chores', async () => {
    const res = await fetch(
      `https://api.theonlypsychologist.com/todays-chores`,
    );
    return res.json();
  });

  const { data: upcomingChores } = useQuery(
    ['chores', 'upcoming'],
    async () => {
      const res = await fetch(
        `https://api.theonlypsychologist.com/upcoming-chores`,
      );
      return res.json();
    },
  );

  const { mutate: completeChore, isLoading: isCheckingToDo } = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(
        `https://api.theonlypsychologist.com/complete-chore/${id}`,
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
        `https://api.theonlypsychologist.com/chores/${deletingChore?._id}`,
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
    <div className="container h-full">
      <div className="relative h-full w-full flex flex-col items-center">
        <div className="flex flex-col h-full justify-center items-center">
          <div className="text-2xl mb-4 w-full text-center text-white">
            Today&apos;s Tasks
          </div>

          {todaysChores?.length > 0 ? (
            <>
              <div className="flex gap-4 items-center justify-between bg-gray-200 text-black rounded-full py-1 my-1 px-4 mr-4">
                <div className="w-44  flex justify-center truncate border-r border-black">
                  Task
                </div>
                <div className="w-44 flex justify-center border-r border-black truncate">
                  It takes
                </div>
                <div className="w-44 flex justify-center border-r border-black truncate">
                  Repeats every
                </div>
                <div className="w-44 flex justify-center border-r border-black truncate">
                  It'll take in a life
                </div>
                <div className="w-44 flex justify-center truncate">Status</div>
              </div>

              {todaysChores?.map((chore: Chore) => {
                return (
                  <Mission
                    mission={chore}
                    checkButtonClicked={checkButtonClicked}
                    setDeletingChore={setDeletingChore}
                    isCheckingToDo={isCheckingToDo}
                  />
                );
              })}
            </>
          ) : (
            <div className="flex flex-col justify-center items-center">
              No chores for today! Enjoy your day!
            </div>
          )}
        </div>

        {upcomingChores?.length > 0 ? (
          <div className="flex flex-col h-full justify-center items-center">
            <div className="text-2xl mb-4 w-full text-center text-white">
              Upcoming Tasks
            </div>
            <div className="flex gap-4 items-center justify-between bg-gray-200 text-black rounded-full py-1 my-1 px-4 mr-4">
              <div className="w-44  flex justify-center truncate border-r border-black">
                Task
              </div>
              <div className="w-44 flex justify-center border-r border-black truncate">
                It takes
              </div>
              <div className="w-44 flex justify-center border-r border-black truncate">
                Repeats every
              </div>
              <div className="w-44 flex justify-center border-r border-black truncate">
                When
              </div>
              <div className="w-44 flex justify-center truncate">Status</div>
            </div>
            {upcomingChores?.map((chore: Chore) => {
              return (
                <Mission
                  mission={chore}
                  checkButtonClicked={checkButtonClicked}
                  setDeletingChore={setDeletingChore}
                  isCheckingToDo={isCheckingToDo}
                  isUpcomingToDo={true}
                />
              );
            })}
          </div>
        ) : null}

        {deletingChore && (
          <div className="fixed top-0 z-50 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center">
            <div className="bg-black rounded-lg px-12 py-6">
              <div className="text-lg border-b border-gray-800 text-center pb-2">
                You are deleting
                <div className="flex justify-center">
                  <i>{deletingChore.name}</i>c
                </div>
              </div>
              <div className="flex gap-4 mt-4 justify-end">
                <div
                  aria-hidden="true"
                  className="bg-red-600 rounded-full px-4 py-1 text-center text-md cursor-pointer hover:bg-red-700"
                  onClick={() => {
                    deleteChore();
                    setDeletingChore(null);
                  }}
                >
                  Yes, delete
                </div>
                <div
                  aria-hidden="true"
                  className="bg-gray-600 rounded-full px-4 py-1 text-center text-md cursor-pointer hover:bg-gray-700"
                  onClick={() => setDeletingChore(null)}
                >
                  No, I regret
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="absolute bottom-0 w-full flex justify-center items-center">
          <div
            aria-hidden="true"
            className="bg-gray-800 rounded-md px-6 py-1 my-2 text-lg cursor-pointer hover:bg-gray-900"
            onClick={() => push('/create-chore')}
          >
            Create Chore
          </div>
        </div>
      </div>
    </div>
  );
}

export default TodaysChores;
