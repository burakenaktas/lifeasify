import Chore from '../../../types/types';
import ConvertMinutes from '../../../helpers/ConvertMinutes';
import classNames from 'classnames';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { getChoreStatus } from '../../../helpers/ChoreStatusses';

type MissionFProps = {
  mission: Chore;
  checkButtonClicked: (id: string) => void;
  setDeletingChore: (chore: Chore) => void;
  isCheckingToDo: boolean;
};

function Mission({
  mission,
  checkButtonClicked,
  setDeletingChore,
  isCheckingToDo,
}: MissionFProps) {
  const isCompleted = getChoreStatus(mission).label === 'Done';

  return (
    <div
      key={mission._id}
      className="flex gap-4 items-center justify-between hover:bg-gray-800 rounded-full py-1 my-1 px-4 mr-4"
    >
      <input
        type="checkbox"
        disabled={isCheckingToDo}
        checked={isCompleted}
        onChange={() => checkButtonClicked(mission._id)}
      />
      <div className="w-44 truncate">{mission.name}</div>
      <div className="w-44 truncate">{mission.timeEffortMinutes} minutes</div>
      <div className="w-44 truncate">
        {mission.isOneTime
          ? "Doesn't repeat"
          : `Repeats every ${
              mission.repeatFrequencyDays === 1
                ? 'single'
                : mission.repeatFrequencyDays
            } days`}
      </div>
      <div className="w-44 truncate">
        {ConvertMinutes(
          mission.isOneTime
            ? mission.timeEffortMinutes
            : (mission.timeEffortMinutes * 75 * 365) /
                mission.repeatFrequencyDays,
        )}
      </div>
      <div className="text-white w-32 truncate flex items-center justify-center">
        <div
          className={classNames(
            'rounded-full w-2 h-2 mr-2',
            // eslint-disable-next-line no-nested-ternary
            getChoreStatus(mission).color,
          )}
        />
        {getChoreStatus(mission).label}
      </div>
      <div className="flex">
        {/* TODO: Add edit chore functionality */}
        {/* <div
      aria-hidden="true"
      className="cursor-pointer"
      onClick={() => push('/')}
    >
      <EditIcon />
    </div> */}
        <div
          aria-hidden="true"
          className="cursor-pointer"
          onClick={() => setDeletingChore(mission)}
        >
          <DeleteOutlineOutlinedIcon className="text-red-600" />
        </div>
      </div>
    </div>
  );
}

export default Mission;
