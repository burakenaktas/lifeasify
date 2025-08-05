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
    const res = await fetch(`https://api.burak.solutions/todays-chores`);
    return res.json();
  });

  const { data: upcomingChores } = useQuery(
    ['chores', 'upcoming'],
    async () => {
      const res = await fetch(`https://api.burak.solutions/upcoming-chores`);
      return res.json();
    },
  );

  const { mutate: completeChore, isLoading: isCheckingToDo } = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(
        `https://api.burak.solutions/complete-chore/${id}`,
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
        // eslint-disable-next-line no-underscore-dangle
        `https://api.burak.solutions/chores/${deletingChore?._id}`,
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
    <div className="w-full h-full overflow-hidden">
      <div className="h-full w-full flex flex-col px-6 overflow-hidden">
        <div className="flex-1 w-full max-w-6xl mx-auto flex flex-col overflow-hidden">
          <div className="text-4xl font-bold mb-6 w-full text-center flex-shrink-0">
            <span className="text-white">Today&apos;s Tasks</span>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden min-h-0">
            {todaysChores?.length > 0 ? (
              <>
                <div className="flex gap-4 items-center justify-between bg-gray-800/60 backdrop-blur-sm text-white rounded-xl py-4 mb-4 px-6 w-full shadow-lg border border-gray-600 flex-shrink-0">
                  <div className="w-44 flex justify-center truncate border-r border-gray-600">
                    <span className="font-semibold text-gray-200">Task</span>
                  </div>
                  <div className="w-44 flex justify-center border-r border-gray-600 truncate">
                    <span className="font-semibold text-gray-200">
                      Duration
                    </span>
                  </div>
                  <div className="w-44 flex justify-center border-r border-gray-600 truncate">
                    <span className="font-semibold text-gray-200">
                      Frequency
                    </span>
                  </div>
                  <div className="w-44 flex justify-center border-r border-gray-600 truncate">
                    <span className="font-semibold text-gray-200">
                      Lifetime
                    </span>
                  </div>
                  <div className="w-44 flex justify-center truncate">
                    <span className="font-semibold text-gray-200">Status</span>
                  </div>
                </div>

                <div className="flex-1 w-full space-y-2 overflow-y-auto pr-2 custom-scrollbar min-h-0">
                  {todaysChores?.map((chore: Chore) => (
                    <Mission
                      // eslint-disable-next-line no-underscore-dangle
                      key={chore._id}
                      mission={chore}
                      checkButtonClicked={checkButtonClicked}
                      setDeletingChore={setDeletingChore}
                      isCheckingToDo={isCheckingToDo}
                      isUpcomingToDo={false}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col justify-center items-center bg-gray-800/30 backdrop-blur-sm rounded-xl p-12 border border-gray-700">
                <div className="text-2xl text-gray-300 mb-3">
                  No tasks for today!
                </div>
                <div className="text-gray-400 text-center">
                  Enjoy your day! 🎉
                </div>
              </div>
            )}
          </div>

          {upcomingChores?.length > 0 && (
            <div className="flex-shrink-0 mt-8">
              <div className="text-3xl font-bold mb-6 w-full text-center">
                <span className="text-white">Upcoming Tasks</span>
              </div>
              <div className="flex gap-4 items-center justify-between bg-gray-800/60 backdrop-blur-sm text-white rounded-xl py-4 mb-4 px-6 w-full shadow-lg border border-gray-600">
                <div className="w-44 flex justify-center truncate border-r border-gray-600">
                  <span className="font-semibold text-gray-200">Task</span>
                </div>
                <div className="w-44 flex justify-center border-r border-gray-600 truncate">
                  <span className="font-semibold text-gray-200">Duration</span>
                </div>
                <div className="w-44 flex justify-center border-r border-gray-600 truncate">
                  <span className="font-semibold text-gray-200">Frequency</span>
                </div>
                <div className="w-44 flex justify-center border-r border-gray-600 truncate">
                  <span className="font-semibold text-gray-200">Due Date</span>
                </div>
                <div className="w-44 flex justify-center truncate">
                  <span className="font-semibold text-gray-200">Status</span>
                </div>
              </div>
              <div className="w-full space-y-2 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                {upcomingChores?.map((chore: Chore) => (
                  <Mission
                    // eslint-disable-next-line no-underscore-dangle
                    key={chore._id}
                    mission={chore}
                    checkButtonClicked={checkButtonClicked}
                    setDeletingChore={setDeletingChore}
                    isCheckingToDo={isCheckingToDo}
                    isUpcomingToDo
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {deletingChore && (
          <div className="fixed top-0 z-50 left-0 w-full h-full bg-black/80 backdrop-blur-sm flex justify-center items-center">
            <div className="bg-gray-900 rounded-xl px-12 py-8 border border-gray-700 shadow-2xl transform transition-all">
              <div className="text-xl border-b border-gray-700 text-center pb-4">
                You are deleting
                <div className="flex justify-center mt-2">
                  <i className="text-purple-400">{deletingChore.name}</i>
                </div>
              </div>
              <div className="flex gap-4 mt-6 justify-end">
                <button
                  type="button"
                  className="bg-red-600 hover:bg-red-700 transition-colors rounded-full px-6 py-2 text-center text-md font-medium"
                  onClick={() => {
                    deleteChore();
                    setDeletingChore(null);
                  }}
                >
                  Yes, delete
                </button>
                <button
                  type="button"
                  className="bg-gray-700 hover:bg-gray-600 transition-colors rounded-full px-6 py-2 text-center text-md font-medium"
                  onClick={() => setDeletingChore(null)}
                >
                  No, I regret
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="absolute bottom-8 w-full flex justify-center items-center">
          <button
            type="button"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all rounded-full px-8 py-3 text-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
            onClick={() => push('/create-chore')}
          >
            Create Chore
          </button>
        </div>
      </div>
    </div>
  );
}

export default TodaysChores;
