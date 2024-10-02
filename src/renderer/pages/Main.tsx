/* eslint-disable no-underscore-dangle */
import dayjs from 'dayjs';
import { useState } from 'react';
import { EditNote, AttachMoney } from '@mui/icons-material';
import TodaysChores from '../components/TodaysChores';
import MoneySpending from '../components/MoneySpending';
// import store from '../../store/store';

const SCREENS = [
  { icon: <EditNote />, title: "Today's chores" },
  { icon: <AttachMoney />, title: 'Money spending' },
];

function Main() {
  const [selectedTitle, setSelectedTitle] = useState<string>("Today's chores");

  return (
    <div className="h-screen w-screen pb-14 flex flex-col justify-center items-center">
      <div className="mt-6">{dayjs().format('DD MMM YYYY')}</div>

      {selectedTitle === "Today's chores" && <TodaysChores />}
      {selectedTitle === 'Money spending' && <MoneySpending />}

      <div className="flex items-center w-full justify-between absolute bottom-0">
        {SCREENS.map((screen) => (
          <div
            aria-hidden="true"
            key={screen.title}
            className={`flex flex-col items-center text-xs flex-1 text-center py-1 mt-1 cursor-pointer hover:bg-gray-900  ${
              selectedTitle === screen.title
                ? 'border-t-2 border-gray-600'
                : 'border-t-2 border-transparent'
            }`}
            onClick={() => setSelectedTitle(screen.title)}
          >
            {screen.icon}
            {screen.title}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Main;
