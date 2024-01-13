/* eslint-disable no-underscore-dangle */
import dayjs from 'dayjs';
import { useState } from 'react';
import TodaysChores from '../components/TodaysChores';

// import store from '../../store/store';

const TITLES = ["Today's chores", 'Monthly spending'];

function Main() {
  const [selectedTitle, setSelectedTitle] = useState<string>("Today's chores");

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="mt-2">{dayjs().format('DD MMM YYYY')}</div>

      <div className="flex items-center mb-4 w-full justify-between">
        {TITLES.map((title) => (
          <div
            key={title}
            className={`text-2xl flex-1 text-center py-1 mt-1 rounded-t-lg cursor-pointer hover:bg-gray-700  ${
              selectedTitle === title
                ? 'border-b-4 border-blue-600'
                : 'border-b-4 border-transparent'
            }`}
            onClick={() => setSelectedTitle(title)}
          >
            {title}
          </div>
        ))}
      </div>

      {selectedTitle === "Today's chores" && <TodaysChores />}
    </div>
  );
}

export default Main;
