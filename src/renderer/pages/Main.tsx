/* eslint-disable no-underscore-dangle */
import dayjs from 'dayjs';
import TodaysChores from '../components/TodaysChores';
// import store from '../../store/store';

function Main() {
  return (
    <div className="h-screen w-screen pb-14 flex flex-col justify-center items-center bg-gradient-to-b from-gray-900 to-black">
      <div className="mt-6">{dayjs().format('DD MMM YYYY')}</div>

      <TodaysChores />
    </div>
  );
}

export default Main;
