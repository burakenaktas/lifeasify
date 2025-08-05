import { useState } from 'react';
import dayjs from 'dayjs';
import { Contact } from '../../types/types';
import store from '../../store/store';

// Mock data
const mockContacts: Contact[] = [
  {
    _id: '1',
    name: 'Sarah Johnson',
    contactInfo: 'sarah.johnson@email.com',
    lastContactDate: dayjs().subtract(15, 'days').format('YYYY-MM-DD'),
  },
  {
    _id: '2',
    name: 'Mike Chen',
    contactInfo: '+1 555 123 4567',
    lastContactDate: dayjs().subtract(45, 'days').format('YYYY-MM-DD'),
  },
  {
    _id: '3',
    name: 'Emma Wilson',
    contactInfo: 'emma.wilson@outlook.com',
    lastContactDate: dayjs().subtract(5, 'days').format('YYYY-MM-DD'),
  },
  {
    _id: '4',
    name: 'Alex Rodriguez',
    contactInfo: '+1 532 987 6543',
    lastContactDate: dayjs().subtract(200, 'days').format('YYYY-MM-DD'),
  },
  {
    _id: '5',
    name: 'David Lee',
    contactInfo: 'david.lee@gmail.com',
    lastContactDate: dayjs().subtract(90, 'days').format('YYYY-MM-DD'),
  },
  {
    _id: '6',
    name: 'Lisa Park',
    contactInfo: '+1 543 456 7890',
    lastContactDate: dayjs().subtract(3, 'days').format('YYYY-MM-DD'),
  },
  {
    _id: '7',
    name: 'James Brown',
    contactInfo: 'james.brown@company.com',
    lastContactDate: dayjs().subtract(22, 'days').format('YYYY-MM-DD'),
  },
  {
    _id: '8',
    name: 'Maria Garcia',
    contactInfo: '+1 555 987 1234',
    lastContactDate: dayjs().subtract(8, 'days').format('YYYY-MM-DD'),
  },
  {
    _id: '9',
    name: 'Robert Smith',
    contactInfo: 'robert.smith@tech.io',
    lastContactDate: dayjs().subtract(120, 'days').format('YYYY-MM-DD'),
  },
  {
    _id: '10',
    name: 'Jennifer Davis',
    contactInfo: '+1 444 555 6789',
    lastContactDate: dayjs().subtract(1, 'days').format('YYYY-MM-DD'),
  },
  {
    _id: '11',
    name: 'Michael Taylor',
    contactInfo: 'michael.taylor@startup.com',
    lastContactDate: dayjs().subtract(300, 'days').format('YYYY-MM-DD'),
  },
  {
    _id: '12',
    name: 'Ashley White',
    contactInfo: '+1 333 444 5555',
    lastContactDate: dayjs().subtract(67, 'days').format('YYYY-MM-DD'),
  },
];

function FriendsList() {
  const [showConfirmDialog, setShowConfirmDialog] = useState<string | null>(
    null,
  );
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    contactInfo: '',
  });
  const contacts = store((state: any) => state.contacts);
  const updateContactLastMeeting = store(
    (state: any) => state.updateContactLastMeeting,
  );
  const addContact = store((state: any) => state.addContact);
  const setContacts = store((state: any) => state.setContacts);

  // Initialize mock data if no contacts exist
  if (contacts.length === 0) {
    setContacts(mockContacts);
  }

  // Sort contacts by priority: longest time since last contact first
  const sortedContacts = [...(contacts || [])].sort((a, b) => {
    const dateA = dayjs(a.lastContactDate);
    const dateB = dayjs(b.lastContactDate);
    return dateA.isBefore(dateB) ? -1 : dateA.isAfter(dateB) ? 1 : 0;
  });

  const getContactStatusColor = (lastContactDate: string) => {
    const daysSinceLastContact = dayjs().diff(dayjs(lastContactDate), 'days');

    if (daysSinceLastContact <= 30) {
      return 'bg-green-500/20 text-green-300 border-green-500/30';
    } else if (daysSinceLastContact <= 180) {
      return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    } else {
      return 'bg-red-500/20 text-red-300 border-red-500/30';
    }
  };

  const getStatusText = (lastContactDate: string) => {
    const daysSinceLastContact = dayjs().diff(dayjs(lastContactDate), 'days');

    if (daysSinceLastContact === 0) {
      return 'Today';
    } else if (daysSinceLastContact === 1) {
      return '1 day ago';
    } else if (daysSinceLastContact <= 30) {
      return `${daysSinceLastContact} days ago`;
    } else if (daysSinceLastContact <= 60) {
      const months = Math.floor(daysSinceLastContact / 30);
      return `${months} month${months > 1 ? 's' : ''} ago`;
    } else if (daysSinceLastContact <= 180) {
      const months = Math.floor(daysSinceLastContact / 30);
      return `${months} months ago`;
    } else {
      const months = Math.floor(daysSinceLastContact / 30);
      return `${months} months ago`;
    }
  };

  const handleContactUpdate = (contactId: string) => {
    setShowConfirmDialog(contactId);
  };

  const confirmContactUpdate = (contactId: string) => {
    updateContactLastMeeting(contactId, dayjs().format('YYYY-MM-DD'));
    setShowConfirmDialog(null);
  };

  const handleAddContact = () => {
    if (newContact.name.trim() && newContact.contactInfo.trim()) {
      const contact: Contact = {
        _id: Date.now().toString(),
        name: newContact.name.trim(),
        contactInfo: newContact.contactInfo.trim(),
        lastContactDate: dayjs().format('YYYY-MM-DD'),
      };
      addContact(contact);
      setNewContact({ name: '', contactInfo: '' });
      setShowAddContact(false);
    }
  };

  return (
    <div className="w-full h-full overflow-hidden">
      <div className="h-full w-full flex flex-col px-6 overflow-hidden">
        <div className="flex-1 w-full max-w-6xl mx-auto flex flex-col overflow-hidden min-h-0">
          <div className="flex items-center justify-between w-full mb-6 flex-shrink-0">
            <div className="text-4xl font-bold text-center flex-1">
              <span className="text-white">Friends & Connections</span>
            </div>
            <button
              type="button"
              onClick={() => setShowAddContact(true)}
              className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 transition-all rounded-full px-6 py-3 text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
            >
              <span className="text-lg">+</span>
              Add Friend
            </button>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden min-h-0">
            {sortedContacts?.length > 0 ? (
              <>
                <div className="flex gap-4 items-center justify-between bg-gray-800/60 backdrop-blur-sm text-white rounded-xl py-4 mb-4 px-6 w-full shadow-lg border border-gray-600 flex-shrink-0">
                  <div className="w-48 flex justify-center truncate border-r border-gray-600">
                    <span className="font-semibold text-gray-200">Name</span>
                  </div>
                  <div className="w-48 flex justify-center border-r border-gray-600 truncate">
                    <span className="font-semibold text-gray-200">
                      Contact Info
                    </span>
                  </div>
                  <div className="w-48 flex justify-center border-r border-gray-600 truncate">
                    <span className="font-semibold text-gray-200">
                      Last Contact
                    </span>
                  </div>
                  <div className="w-32 flex justify-center truncate">
                    <span className="font-semibold text-gray-200">Update</span>
                  </div>
                </div>

                <div className="flex-1 w-full space-y-2 overflow-y-auto pr-2 custom-scrollbar min-h-0">
                  {sortedContacts?.map((contact: Contact, index: number) => (
                    <div
                      key={contact._id}
                      className={`flex gap-4 items-center justify-between backdrop-blur-sm text-white rounded-xl py-4 px-6 w-full shadow-lg border transition-all hover:scale-[1.01] ${getContactStatusColor(
                        contact.lastContactDate,
                      )}`}
                    >
                      <div className="w-48 flex justify-center truncate">
                        <span className="font-medium">{contact.name}</span>
                      </div>
                      <div className="w-48 flex justify-center truncate">
                        <span className="text-sm">{contact.contactInfo}</span>
                      </div>
                      <div className="w-48 flex justify-center truncate">
                        <span className="text-sm">
                          {getStatusText(contact.lastContactDate)}
                        </span>
                      </div>
                      <div className="w-32 flex justify-center">
                        <button
                          type="button"
                          onClick={() => handleContactUpdate(contact._id)}
                          className="bg-blue-600 hover:bg-blue-700 transition-all duration-200 rounded-lg px-4 py-2 text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105 flex items-center gap-1"
                        >
                          <span>✓</span>
                          Update
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Priority explanation */}
                <div className="mt-4 text-center text-sm text-gray-400 flex-shrink-0">
                  <span>
                    Sorted by priority: People you haven't connected with the
                    longest appear first
                  </span>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col justify-center items-center bg-gray-800/30 backdrop-blur-sm rounded-xl p-12 border border-gray-700">
                <div className="text-2xl text-gray-300 mb-3">
                  No friends yet!
                </div>
                <div className="text-gray-400 text-center leading-relaxed">
                  Start building your network by adding friends and tracking
                  your connections! 👥
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddContact(true)}
                  className="mt-6 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 transition-all rounded-full px-8 py-3 text-md font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Add Your First Friend
                </button>
              </div>
            )}
          </div>
        </div>

        {showConfirmDialog && (
          <div className="fixed top-0 z-50 left-0 w-full h-full bg-black/80 backdrop-blur-sm flex justify-center items-center">
            <div className="bg-gray-900 rounded-xl px-12 py-8 border border-gray-700 shadow-2xl transform transition-all">
              <div className="text-xl border-b border-gray-700 text-center pb-4">
                <div className="text-purple-400 mb-2">Confirmation</div>
                Did you really connect with this person today?
                <div className="flex justify-center mt-2">
                  <i className="text-blue-400">
                    {
                      sortedContacts?.find(
                        (c: Contact) => c._id === showConfirmDialog,
                      )?.name
                    }
                  </i>
                </div>
              </div>
              <div className="flex gap-4 mt-6 justify-end">
                <button
                  type="button"
                  className="bg-green-600 hover:bg-green-700 transition-colors rounded-full px-6 py-2 text-center text-md font-medium"
                  onClick={() => confirmContactUpdate(showConfirmDialog)}
                >
                  Yes, I did
                </button>
                <button
                  type="button"
                  className="bg-gray-700 hover:bg-gray-600 transition-colors rounded-full px-6 py-2 text-center text-md font-medium"
                  onClick={() => setShowConfirmDialog(null)}
                >
                  No, cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {showAddContact && (
          <div className="fixed top-0 z-50 left-0 w-full h-full bg-black/80 backdrop-blur-sm flex justify-center items-center">
            <div className="bg-gray-900 rounded-xl px-12 py-8 border border-gray-700 shadow-2xl transform transition-all max-w-md w-full mx-4">
              <div className="text-xl border-b border-gray-700 text-center pb-4 mb-6">
                <div className="text-green-400">Add New Friend</div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={newContact.name}
                    onChange={(e) =>
                      setNewContact({ ...newContact, name: e.target.value })
                    }
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter friend's name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Contact Info
                  </label>
                  <input
                    type="text"
                    value={newContact.contactInfo}
                    onChange={(e) =>
                      setNewContact({
                        ...newContact,
                        contactInfo: e.target.value,
                      })
                    }
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Email or phone number"
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-6 justify-end">
                <button
                  type="button"
                  className="bg-green-600 hover:bg-green-700 transition-colors rounded-full px-6 py-2 text-center text-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleAddContact}
                  disabled={
                    !newContact.name.trim() || !newContact.contactInfo.trim()
                  }
                >
                  Add Friend
                </button>
                <button
                  type="button"
                  className="bg-gray-700 hover:bg-gray-600 transition-colors rounded-full px-6 py-2 text-center text-md font-medium"
                  onClick={() => {
                    setShowAddContact(false);
                    setNewContact({ name: '', contactInfo: '' });
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FriendsList;
