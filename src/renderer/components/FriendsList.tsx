import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import dayjs from 'dayjs';
import { Contact } from '../../types/types';
import contactService from '../../services/contactService';

function FriendsList() {
  const queryClient = useQueryClient();

  const [showConfirmDialog, setShowConfirmDialog] = useState<string | null>(
    null,
  );
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    contactInfo: '',
  });

  // Fetch contacts with React Query
  const {
    data: contacts = [],
    isLoading,
    error,
  } = useQuery('contacts', contactService.getContacts, {
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: 1, // Reduce retries for faster feedback
    retryDelay: 1000, // 1 second delay between retries
  });

  // Add contact mutation
  const addContactMutation = useMutation(contactService.addContact, {
    onSuccess: () => {
      queryClient.invalidateQueries('contacts');
      setShowAddContact(false);
      setNewContact({ name: '', contactInfo: '' });
    },
    onError: (err: Error) => {
      // eslint-disable-next-line no-console
      console.error('Failed to add contact:', err);
      // eslint-disable-next-line no-alert
      alert(`Failed to add contact: ${err.message}`);
    },
  });

  // Update last contact date mutation
  const updateContactMutation = useMutation(
    contactService.updateLastContactDate,
    {
      onSuccess: () => {
        queryClient.invalidateQueries('contacts');
        setShowConfirmDialog(null);
      },
      onError: (err: Error) => {
        // eslint-disable-next-line no-console
        console.error('Failed to update contact:', err);
        // eslint-disable-next-line no-alert
        alert(`Failed to update contact: ${err.message}`);
      },
    },
  );

  // Contacts are already sorted by priority from the backend
  const sortedContacts = contacts || [];

  const getContactStatusColor = (lastContactDate: string) => {
    const daysSinceLastContact = dayjs().diff(dayjs(lastContactDate), 'days');

    if (daysSinceLastContact <= 30) {
      return 'bg-green-500/20 text-green-300 border-green-500/30';
    }
    if (daysSinceLastContact <= 180) {
      return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    }
    return 'bg-red-500/20 text-red-300 border-red-500/30';
  };

  const getStatusText = (lastContactDate: string) => {
    const daysSinceLastContact = dayjs().diff(dayjs(lastContactDate), 'days');

    if (daysSinceLastContact === 0) {
      return 'Today';
    }
    if (daysSinceLastContact === 1) {
      return '1 day ago';
    }
    if (daysSinceLastContact <= 30) {
      return `${daysSinceLastContact} days ago`;
    }
    if (daysSinceLastContact <= 60) {
      const months = Math.floor(daysSinceLastContact / 30);
      return `${months} month${months > 1 ? 's' : ''} ago`;
    }
    if (daysSinceLastContact <= 180) {
      const months = Math.floor(daysSinceLastContact / 30);
      return `${months} months ago`;
    }
    const months = Math.floor(daysSinceLastContact / 30);
    return `${months} months ago`;
  };

  const handleContactUpdate = (contactId: string) => {
    setShowConfirmDialog(contactId);
  };

  const confirmContactUpdate = (contactId: string) => {
    updateContactMutation.mutate(contactId);
  };

  const handleAddContact = () => {
    if (newContact.name.trim() && newContact.contactInfo.trim()) {
      addContactMutation.mutate({
        name: newContact.name.trim(),
        contactInfo: newContact.contactInfo.trim(),
      });
    }
  };

  // Loading and error states
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white text-lg">Loading contacts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="text-red-400 text-lg">Unable to connect to server</div>
        <div className="text-gray-400 text-sm text-center max-w-md">
          Make sure your backend server is running on localhost:3001 or update
          the API URL in contactService.ts
        </div>
        <button
          type="button"
          onClick={() => queryClient.invalidateQueries('contacts')}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

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
                  {sortedContacts?.map((contact: Contact) => (
                    <div
                      // eslint-disable-next-line no-underscore-dangle
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
                          // eslint-disable-next-line no-underscore-dangle
                          onClick={() => handleContactUpdate(contact._id)}
                          className="bg-blue-600 hover:bg-blue-700 transition-all duration-200 rounded-lg px-4 py-2 text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={updateContactMutation.isLoading}
                        >
                          <span>✓</span>
                          {updateContactMutation.isLoading
                            ? 'Updating...'
                            : 'Update'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Priority explanation */}
                <div className="mt-4 text-center text-sm text-gray-400 flex-shrink-0">
                  <span>
                    Sorted by priority: People you haven&apos;t connected with
                    the longest appear first
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
                        // eslint-disable-next-line no-underscore-dangle
                        (c: Contact) => c._id === showConfirmDialog,
                      )?.name
                    }
                  </i>
                </div>
              </div>
              <div className="flex gap-4 mt-6 justify-end">
                <button
                  type="button"
                  className="bg-green-600 hover:bg-green-700 transition-colors rounded-full px-6 py-2 text-center text-md font-medium disabled:opacity-50"
                  onClick={() => confirmContactUpdate(showConfirmDialog)}
                  disabled={updateContactMutation.isLoading}
                >
                  {updateContactMutation.isLoading
                    ? 'Updating...'
                    : 'Yes, I did'}
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
                  {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
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
                  {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
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
                    !newContact.name.trim() ||
                    !newContact.contactInfo.trim() ||
                    addContactMutation.isLoading
                  }
                >
                  {addContactMutation.isLoading ? 'Adding...' : 'Add Friend'}
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
