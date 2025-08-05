# Friends & Contacts API Documentation

This document provides the complete Node.js API implementation needed for the Friends & Contacts feature in Lifeasify.

## ✨ **Latest Features (Updated)**

- **Priority Sorting**: Contacts sorted by last contact date (oldest first)
- **Add Contact Modal**: Beautiful form with validation
- **Update Last Contact**: Confirmation dialog before updating
- **Responsive Scrollable Design**: Handles unlimited contacts
- **Color-coded Status**: Visual indicators (Green/Yellow/Red)
- **Real-time State Management**: Zustand integration

## Database Schema

### Contact Model (MongoDB/Mongoose)

```javascript
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    contactInfo: {
      type: String,
      required: true,
      trim: true,
    },
    lastContactDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Contact = mongoose.model('Contact', contactSchema);
module.exports = Contact;
```

## API Endpoints

### 1. Get All Contacts (Enhanced with Filtering & Sorting)

```javascript
// GET /api/contacts
app.get('/api/contacts', async (req, res) => {
  try {
    const userId = req.user.id; // Assuming authentication middleware
    const {
      sortBy = 'priority', // 'priority', 'name', 'recent'
      order = 'asc', // 'asc' or 'desc'
      limit = 100,
      offset = 0,
    } = req.query;

    let sortOption = {};

    switch (sortBy) {
      case 'priority':
        // Sort by oldest contact first (priority order)
        sortOption = { lastContactDate: 1 };
        break;
      case 'recent':
        // Sort by most recent contact first
        sortOption = { lastContactDate: -1 };
        break;
      case 'name':
        sortOption = { name: order === 'desc' ? -1 : 1 };
        break;
      default:
        sortOption = { lastContactDate: 1 };
    }

    const contacts = await Contact.find({ userId })
      .sort(sortOption)
      .limit(parseInt(limit))
      .skip(parseInt(offset));

    // Add computed fields for frontend
    const contactsWithStatus = contacts.map((contact) => {
      const daysSinceContact = Math.floor(
        (new Date() - new Date(contact.lastContactDate)) /
          (1000 * 60 * 60 * 24),
      );

      let status = 'green';
      if (daysSinceContact > 180) status = 'red';
      else if (daysSinceContact > 30) status = 'yellow';

      return {
        ...contact.toObject(),
        daysSinceContact,
        status,
        priority:
          daysSinceContact > 180
            ? 'high'
            : daysSinceContact > 30
            ? 'medium'
            : 'low',
      };
    });

    // Get total count for pagination
    const totalCount = await Contact.countDocuments({ userId });

    res.json({
      contacts: contactsWithStatus,
      pagination: {
        total: totalCount,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: totalCount > parseInt(offset) + parseInt(limit),
      },
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({
      error: 'Failed to fetch contacts',
      details:
        process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});
```

### 2. Add New Contact (Enhanced)

```javascript
// POST /api/contacts
app.post('/api/contacts', async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, contactInfo } = req.body;

    // Enhanced validation
    if (!name || !contactInfo) {
      return res.status(400).json({
        error: 'Name and contact info are required',
        field: !name ? 'name' : 'contactInfo',
      });
    }

    const trimmedName = name.trim();
    const trimmedContactInfo = contactInfo.trim();

    // Length validation
    if (trimmedName.length < 2 || trimmedName.length > 50) {
      return res.status(400).json({
        error: 'Name must be between 2 and 50 characters',
        field: 'name',
      });
    }

    if (trimmedContactInfo.length < 3 || trimmedContactInfo.length > 100) {
      return res.status(400).json({
        error: 'Contact info must be between 3 and 100 characters',
        field: 'contactInfo',
      });
    }

    // Check for duplicate contacts for this user
    const existingContact = await Contact.findOne({
      userId,
      $or: [
        { name: { $regex: new RegExp(`^${trimmedName}$`, 'i') } },
        { contactInfo: { $regex: new RegExp(`^${trimmedContactInfo}$`, 'i') } },
      ],
    });

    if (existingContact) {
      return res.status(409).json({
        error: 'A contact with this name or contact info already exists',
        existingContact: {
          name: existingContact.name,
          contactInfo: existingContact.contactInfo,
        },
      });
    }

    // Create new contact
    const contact = new Contact({
      name: trimmedName,
      contactInfo: trimmedContactInfo,
      lastContactDate: new Date(),
      userId,
    });

    await contact.save();

    res.status(201).json({
      message: 'Contact created successfully',
      contact,
    });
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({
      error: 'Failed to create contact',
      details:
        process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});
```

### 3. Update Last Contact Date

```javascript
// PUT /api/contacts/:id/last-contact
app.put('/api/contacts/:id/last-contact', async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const contact = await Contact.findOneAndUpdate(
      { _id: id, userId },
      { lastContactDate: new Date() },
      { new: true },
    );

    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.json(contact);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update contact' });
  }
});
```

### 4. Delete Contact

```javascript
// DELETE /api/contacts/:id
app.delete('/api/contacts/:id', async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const contact = await Contact.findOneAndDelete({ _id: id, userId });

    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete contact' });
  }
});
```

### 5. Update Contact Info

```javascript
// PUT /api/contacts/:id
app.put('/api/contacts/:id', async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { name, contactInfo } = req.body;

    if (!name || !contactInfo) {
      return res
        .status(400)
        .json({ error: 'Name and contact info are required' });
    }

    const contact = await Contact.findOneAndUpdate(
      { _id: id, userId },
      {
        name: name.trim(),
        contactInfo: contactInfo.trim(),
      },
      { new: true },
    );

    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.json(contact);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update contact' });
  }
});
```

## Frontend Service Layer

### Enhanced Contact Service (services/contactService.js)

```javascript
const API_BASE_URL = 'https://api.burak.solutions'; // Your API base URL

class ContactService {
  // Helper method for API calls with error handling
  async apiCall(url, options = {}) {
    const defaultHeaders = {
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      'Content-Type': 'application/json',
    };

    const config = {
      headers: { ...defaultHeaders, ...options.headers },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: 'Network error' }));
        throw new Error(
          errorData.error || `HTTP ${response.status}: ${response.statusText}`,
        );
      }

      // Handle 204 No Content responses
      if (response.status === 204) {
        return null;
      }

      return response.json();
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  }

  // Get all contacts with sorting
  async getContacts() {
    return this.apiCall(`${API_BASE_URL}/api/contacts`);
  }

  // Add new contact with validation
  async addContact(contactData) {
    // Client-side validation
    if (!contactData.name?.trim()) {
      throw new Error('Name is required');
    }
    if (!contactData.contactInfo?.trim()) {
      throw new Error('Contact info is required');
    }
    if (contactData.name.length > 50) {
      throw new Error('Name must be less than 50 characters');
    }
    if (contactData.contactInfo.length > 100) {
      throw new Error('Contact info must be less than 100 characters');
    }

    return this.apiCall(`${API_BASE_URL}/api/contacts`, {
      method: 'POST',
      body: JSON.stringify({
        name: contactData.name.trim(),
        contactInfo: contactData.contactInfo.trim(),
      }),
    });
  }

  // Update last contact date (sets to current date)
  async updateLastContactDate(contactId) {
    if (!contactId) {
      throw new Error('Contact ID is required');
    }

    return this.apiCall(
      `${API_BASE_URL}/api/contacts/${contactId}/last-contact`,
      {
        method: 'PUT',
      },
    );
  }

  // Delete contact (if needed)
  async deleteContact(contactId) {
    if (!contactId) {
      throw new Error('Contact ID is required');
    }

    return this.apiCall(`${API_BASE_URL}/api/contacts/${contactId}`, {
      method: 'DELETE',
    });
  }

  // Update contact info (name and contact info)
  async updateContact(contactId, contactData) {
    if (!contactId) {
      throw new Error('Contact ID is required');
    }

    // Client-side validation
    if (!contactData.name?.trim()) {
      throw new Error('Name is required');
    }
    if (!contactData.contactInfo?.trim()) {
      throw new Error('Contact info is required');
    }

    return this.apiCall(`${API_BASE_URL}/api/contacts/${contactId}`, {
      method: 'PUT',
      body: JSON.stringify({
        name: contactData.name.trim(),
        contactInfo: contactData.contactInfo.trim(),
      }),
    });
  }

  // Bulk update contacts (if needed for batch operations)
  async bulkUpdateContacts(updates) {
    if (!Array.isArray(updates) || updates.length === 0) {
      throw new Error('Updates array is required');
    }

    return this.apiCall(`${API_BASE_URL}/api/contacts/bulk-update`, {
      method: 'PATCH',
      body: JSON.stringify({ updates }),
    });
  }

  // Search contacts by name or contact info
  async searchContacts(query) {
    if (!query?.trim()) {
      return this.getContacts();
    }

    const encodedQuery = encodeURIComponent(query.trim());
    return this.apiCall(
      `${API_BASE_URL}/api/contacts/search?q=${encodedQuery}`,
    );
  }

  // Get contact statistics (for dashboard)
  async getContactStats() {
    return this.apiCall(`${API_BASE_URL}/api/contacts/stats`);
  }
}

export default new ContactService();
```

### Usage Examples

```javascript
// In your component
import contactService from '../services/contactService';

// Add contact with error handling
try {
  const newContact = await contactService.addContact({
    name: 'John Doe',
    contactInfo: 'john@example.com',
  });
  console.log('Contact added:', newContact);
} catch (error) {
  console.error('Failed to add contact:', error.message);
  // Show user-friendly error message
}

// Update last contact date
try {
  await contactService.updateLastContactDate(contactId);
  console.log('Contact updated successfully');
} catch (error) {
  console.error('Failed to update contact:', error.message);
}

// Search contacts
try {
  const results = await contactService.searchContacts('john');
  console.log('Search results:', results);
} catch (error) {
  console.error('Search failed:', error.message);
}
```

## React Query Integration

### Complete FriendsList Component with Real API Integration

```javascript
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import dayjs from 'dayjs';
import { Contact } from '../../types/types';
import contactService from '../../services/contactService';

function FriendsList() {
  const queryClient = useQueryClient();

  // Component State
  const [showConfirmDialog, setShowConfirmDialog] = useState<string | null>(null);
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
  });

  // Add contact mutation
  const addContactMutation = useMutation(contactService.addContact, {
    onSuccess: () => {
      queryClient.invalidateQueries('contacts');
      setShowAddContact(false);
      setNewContact({ name: '', contactInfo: '' });
    },
    onError: (error) => {
      console.error('Failed to add contact:', error);
      // You can add toast notification here
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
      onError: (error) => {
        console.error('Failed to update contact:', error);
      },
    },
  );

  // Delete contact mutation (if needed)
  const deleteContactMutation = useMutation(contactService.deleteContact, {
    onSuccess: () => {
      queryClient.invalidateQueries('contacts');
    },
  });

  // Sort contacts by priority: longest time since last contact first
  const sortedContacts = [...contacts].sort((a, b) => {
    const dateA = dayjs(a.lastContactDate);
    const dateB = dayjs(b.lastContactDate);
    return dateA.isBefore(dateB) ? -1 : dateA.isAfter(dateB) ? 1 : 0;
  });

  // Color coding based on last contact date
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

  // Format last contact date for display
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

  // Handle add contact with validation
  const handleAddContact = () => {
    if (newContact.name.trim() && newContact.contactInfo.trim()) {
      addContactMutation.mutate({
        name: newContact.name.trim(),
        contactInfo: newContact.contactInfo.trim(),
      });
    }
  };

  // Handle contact update with confirmation
  const handleContactUpdate = (contactId: string) => {
    setShowConfirmDialog(contactId);
  };

  const confirmContactUpdate = (contactId: string) => {
    updateContactMutation.mutate(contactId);
  };

  // Loading and error states
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white">Loading contacts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-400">Failed to load contacts</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-hidden">
      <div className="h-full w-full flex flex-col px-6 overflow-hidden">
        <div className="flex-1 w-full max-w-6xl mx-auto flex flex-col overflow-hidden min-h-0">
          {/* Header with Add Friend Button */}
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

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden min-h-0">
            {sortedContacts?.length > 0 ? (
              <>
                {/* Table Header */}
                <div className="flex gap-4 items-center justify-between bg-gray-800/60 backdrop-blur-sm text-white rounded-xl py-4 mb-4 px-6 w-full shadow-lg border border-gray-600 flex-shrink-0">
                  <div className="w-48 flex justify-center truncate border-r border-gray-600">
                    <span className="font-semibold text-gray-200">Name</span>
                  </div>
                  <div className="w-48 flex justify-center border-r border-gray-600 truncate">
                    <span className="font-semibold text-gray-200">Contact Info</span>
                  </div>
                  <div className="w-48 flex justify-center border-r border-gray-600 truncate">
                    <span className="font-semibold text-gray-200">Last Contact</span>
                  </div>
                  <div className="w-32 flex justify-center truncate">
                    <span className="font-semibold text-gray-200">Update</span>
                  </div>
                </div>

                {/* Scrollable Contact List */}
                <div className="flex-1 w-full space-y-2 overflow-y-auto pr-2 custom-scrollbar min-h-0">
                  {sortedContacts.map((contact: Contact) => (
                    <div
                      key={contact._id}
                      className={`flex gap-4 items-center justify-between backdrop-blur-sm text-white rounded-xl py-4 px-6 w-full shadow-lg border transition-all hover:scale-[1.01] ${getContactStatusColor(contact.lastContactDate)}`}
                    >
                      <div className="w-48 flex justify-center truncate">
                        <span className="font-medium">{contact.name}</span>
                      </div>
                      <div className="w-48 flex justify-center truncate">
                        <span className="text-sm">{contact.contactInfo}</span>
                      </div>
                      <div className="w-48 flex justify-center truncate">
                        <span className="text-sm">{getStatusText(contact.lastContactDate)}</span>
                      </div>
                      <div className="w-32 flex justify-center">
                        <button
                          type="button"
                          onClick={() => handleContactUpdate(contact._id)}
                          className="bg-blue-600 hover:bg-blue-700 transition-all duration-200 rounded-lg px-4 py-2 text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105 flex items-center gap-1"
                          disabled={updateContactMutation.isLoading}
                        >
                          <span>✓</span>
                          {updateContactMutation.isLoading ? 'Updating...' : 'Update'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Priority Explanation */}
                <div className="mt-4 text-center text-sm text-gray-400 flex-shrink-0">
                  <span>Sorted by priority: People you haven't connected with the longest appear first</span>
                </div>
              </>
            ) : (
              /* Empty State */
              <div className="flex-1 flex flex-col justify-center items-center bg-gray-800/30 backdrop-blur-sm rounded-xl p-12 border border-gray-700">
                <div className="text-2xl text-gray-300 mb-3">No friends yet!</div>
                <div className="text-gray-400 text-center leading-relaxed">
                  Start building your network by adding friends and tracking your connections! 👥
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

        {/* Update Confirmation Dialog */}
        {showConfirmDialog && (
          <div className="fixed top-0 z-50 left-0 w-full h-full bg-black/80 backdrop-blur-sm flex justify-center items-center">
            <div className="bg-gray-900 rounded-xl px-12 py-8 border border-gray-700 shadow-2xl transform transition-all">
              <div className="text-xl border-b border-gray-700 text-center pb-4">
                <div className="text-purple-400 mb-2">Confirmation</div>
                Did you really connect with this person today?
                <div className="flex justify-center mt-2">
                  <i className="text-blue-400">
                    {sortedContacts?.find((c: Contact) => c._id === showConfirmDialog)?.name}
                  </i>
                </div>
              </div>
              <div className="flex gap-4 mt-6 justify-end">
                <button
                  type="button"
                  className="bg-green-600 hover:bg-green-700 transition-colors rounded-full px-6 py-2 text-center text-md font-medium"
                  onClick={() => confirmContactUpdate(showConfirmDialog)}
                  disabled={updateContactMutation.isLoading}
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

        {/* Add Contact Dialog */}
        {showAddContact && (
          <div className="fixed top-0 z-50 left-0 w-full h-full bg-black/80 backdrop-blur-sm flex justify-center items-center">
            <div className="bg-gray-900 rounded-xl px-12 py-8 border border-gray-700 shadow-2xl transform transition-all max-w-md w-full mx-4">
              <div className="text-xl border-b border-gray-700 text-center pb-4 mb-6">
                <div className="text-green-400">Add New Friend</div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={newContact.name}
                    onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter friend's name"
                    maxLength={50}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Contact Info *
                  </label>
                  <input
                    type="text"
                    value={newContact.contactInfo}
                    onChange={(e) => setNewContact({ ...newContact, contactInfo: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Email or phone number"
                    maxLength={100}
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
```

## Additional API Endpoints

### 6. Search Contacts

```javascript
// GET /api/contacts/search?q=searchTerm
app.get('/api/contacts/search', async (req, res) => {
  try {
    const userId = req.user.id;
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return res
        .status(400)
        .json({ error: 'Search query must be at least 2 characters' });
    }

    const searchRegex = new RegExp(q.trim(), 'i');
    const contacts = await Contact.find({
      userId,
      $or: [{ name: searchRegex }, { contactInfo: searchRegex }],
    }).sort({ lastContactDate: 1 });

    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
});
```

### 7. Get Contact Statistics

```javascript
// GET /api/contacts/stats
app.get('/api/contacts/stats', async (req, res) => {
  try {
    const userId = req.user.id;

    const totalContacts = await Contact.countDocuments({ userId });

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);

    const recentContacts = await Contact.countDocuments({
      userId,
      lastContactDate: { $gte: thirtyDaysAgo },
    });

    const staleContacts = await Contact.countDocuments({
      userId,
      lastContactDate: { $lt: sixMonthsAgo },
    });

    res.json({
      total: totalContacts,
      recent: recentContacts, // contacted within 30 days
      stale: staleContacts, // not contacted for 6+ months
      percentageRecent:
        totalContacts > 0
          ? Math.round((recentContacts / totalContacts) * 100)
          : 0,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get statistics' });
  }
});
```

### 8. Bulk Update Contacts

```javascript
// PATCH /api/contacts/bulk-update
app.patch('/api/contacts/bulk-update', async (req, res) => {
  try {
    const userId = req.user.id;
    const { updates } = req.body;

    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({ error: 'Updates array is required' });
    }

    const results = [];
    for (const update of updates) {
      const { contactId, lastContactDate } = update;

      if (!contactId) continue;

      const contact = await Contact.findOneAndUpdate(
        { _id: contactId, userId },
        { lastContactDate: lastContactDate || new Date() },
        { new: true },
      );

      if (contact) {
        results.push(contact);
      }
    }

    res.json({
      message: `Updated ${results.length} contacts`,
      contacts: results,
    });
  } catch (error) {
    res.status(500).json({ error: 'Bulk update failed' });
  }
});
```

## Environment Variables

Add these to your `.env` file:

```bash
# Database
MONGODB_URI=mongodb://localhost:27017/lifeasify
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lifeasify

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# API Port
PORT=3001

# CORS Origins (for development)
CORS_ORIGIN=http://localhost:4343

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100  # Max requests per window

# Validation
MAX_CONTACTS_PER_USER=1000
MIN_NAME_LENGTH=2
MAX_NAME_LENGTH=50
MIN_CONTACT_INFO_LENGTH=3
MAX_CONTACT_INFO_LENGTH=100
```

## Express Server Setup

### Basic server.js

```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  }),
);
app.use(express.json());

// Database connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Import routes (create these files)
const contactRoutes = require('./routes/contacts');
const authRoutes = require('./routes/auth');

// Use routes
app.use('/api/contacts', contactRoutes);
app.use('/api/auth', authRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## Authentication Middleware

### auth.js middleware

```javascript
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1]; // Bearer TOKEN

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = authMiddleware;
```

## Package.json Dependencies

Add these to your Node.js API package.json:

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.0.0",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "jsonwebtoken": "^9.0.0",
    "bcryptjs": "^2.4.3",
    "express-rate-limit": "^6.7.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.22"
  }
}
```

## Testing the API

### Sample curl commands:

```bash
# Get all contacts
curl -X GET http://localhost:3001/api/contacts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Add new contact
curl -X POST http://localhost:3001/api/contacts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","contactInfo":"john@example.com"}'

# Update last contact date
curl -X PUT http://localhost:3001/api/contacts/CONTACT_ID/last-contact \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Deployment Notes

1. **Database**: Use MongoDB Atlas for production
2. **Environment**: Set all environment variables in your hosting platform
3. **CORS**: Update CORS origins for production domains
4. **Rate Limiting**: Consider adding rate limiting for production
5. **Validation**: Add input validation with libraries like Joi or express-validator
6. **Logging**: Add proper logging with Winston or similar

This documentation provides everything needed to implement the Friends & Contacts API backend for your Lifeasify application.
