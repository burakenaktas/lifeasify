/* eslint-disable no-underscore-dangle */
import { useState } from 'react';
import dayjs from 'dayjs';
import TodaysChores from '../components/TodaysChores';
import FriendsList from '../components/FriendsList';
// import store from '../../store/store';

function Main() {
  const [activeTab, setActiveTab] = useState<'tasks' | 'friends'>('tasks');

  return (
    <div className="h-screen w-screen flex flex-col bg-gradient-to-b from-gray-900 to-black overflow-hidden">
      {/* Header Section */}
      <div className="flex-shrink-0 pt-6 pb-4 px-6 flex flex-col items-center">
        <div className="mb-4">{dayjs().format('DD MMM YYYY')}</div>

        {/* Tab Navigation */}
        <div className="flex bg-gray-800/50 backdrop-blur-sm rounded-xl p-1 border border-gray-700">
          <button
            type="button"
            className={`px-6 py-2 rounded-lg transition-all font-medium ${
              activeTab === 'tasks'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
            }`}
            onClick={() => setActiveTab('tasks')}
          >
            📋 My Tasks
          </button>
          <button
            type="button"
            className={`px-6 py-2 rounded-lg transition-all font-medium ${
              activeTab === 'friends'
                ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg'
                : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
            }`}
            onClick={() => setActiveTab('friends')}
          >
            👥 My Friends
          </button>
        </div>
      </div>

      {/* Scrollable Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'tasks' ? <TodaysChores /> : <FriendsList />}
      </div>
    </div>
  );
}

export default Main;
