const API_BASE_URL = 'https://api.burak.solutions'; // Your API base URL - change when backend is ready
const USE_MOCK_DATA = true; // Set to false when backend is ready

interface ContactData {
  name: string;
  contactInfo: string;
}

interface ContactResponse {
  _id: string;
  name: string;
  contactInfo: string;
  lastContactDate: string;
  userId: string;
  daysSinceContact?: number;
  status?: string;
  priority?: string;
}

interface ContactsResponse {
  contacts: ContactResponse[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

class ContactService {
  private userId = 'default'; // Simple user handling as per backend

  private mockContacts: ContactResponse[] = [];

  // Helper method for API calls with error handling
  // eslint-disable-next-line class-methods-use-this
  async apiCall(url: string, options: Record<string, any> = {}): Promise<any> {
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const config: Record<string, any> = {
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
      // eslint-disable-next-line no-console
      console.error('API call failed:', error);
      throw error;
    }
  }

  // Get all contacts with sorting
  getContacts = async (): Promise<ContactResponse[]> => {
    if (USE_MOCK_DATA) {
      // Return empty array initially for testing
      return this.mockContacts;
    }

    const response: ContactsResponse = await this.apiCall(
      `${API_BASE_URL}/api/contacts?userId=${this.userId}&sortBy=priority`,
    );
    return response.contacts || [];
  };

  // Add new contact with validation
  addContact = async (contactData: ContactData): Promise<ContactResponse> => {
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

    if (USE_MOCK_DATA) {
      // Mock implementation for testing
      const newContact: ContactResponse = {
        _id: Date.now().toString(),
        name: contactData.name.trim(),
        contactInfo: contactData.contactInfo.trim(),
        lastContactDate: new Date().toISOString().split('T')[0],
        userId: this.userId,
      };
      this.mockContacts.push(newContact);
      return newContact;
    }

    const response = await this.apiCall(`${API_BASE_URL}/api/contacts`, {
      method: 'POST',
      body: JSON.stringify({
        name: contactData.name.trim(),
        contactInfo: contactData.contactInfo.trim(),
        userId: this.userId,
      }),
    });

    return response.contact;
  };

  // Update last contact date (sets to current date)
  updateLastContactDate = async (
    contactId: string,
  ): Promise<ContactResponse> => {
    if (!contactId) {
      throw new Error('Contact ID is required');
    }

    if (USE_MOCK_DATA) {
      // Mock implementation for testing
      const contactIndex = this.mockContacts.findIndex(
        // eslint-disable-next-line no-underscore-dangle
        (c) => c._id === contactId,
      );
      if (contactIndex === -1) {
        throw new Error('Contact not found');
      }

      const [todayDate] = new Date().toISOString().split('T');
      this.mockContacts[contactIndex].lastContactDate = todayDate;
      return this.mockContacts[contactIndex];
    }

    return this.apiCall(
      `${API_BASE_URL}/api/contacts/${contactId}/last-contact`,
      {
        method: 'PUT',
        body: JSON.stringify({
          userId: this.userId,
        }),
      },
    );
  };

  // Delete contact (if needed)
  deleteContact = async (contactId: string): Promise<void> => {
    if (!contactId) {
      throw new Error('Contact ID is required');
    }

    if (USE_MOCK_DATA) {
      const contactIndex = this.mockContacts.findIndex(
        // eslint-disable-next-line no-underscore-dangle
        (c) => c._id === contactId,
      );
      if (contactIndex === -1) {
        throw new Error('Contact not found');
      }
      this.mockContacts.splice(contactIndex, 1);
      return;
    }

    await this.apiCall(
      `${API_BASE_URL}/api/contacts/${contactId}?userId=${this.userId}`,
      {
        method: 'DELETE',
      },
    );
  };

  // Update contact info (name and contact info)
  updateContact = async (
    contactId: string,
    contactData: ContactData,
  ): Promise<ContactResponse> => {
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

    if (USE_MOCK_DATA) {
      // eslint-disable-next-line no-underscore-dangle
      const contactIndex = this.mockContacts.findIndex(
        // eslint-disable-next-line no-underscore-dangle
        (c) => c._id === contactId,
      );
      if (contactIndex === -1) {
        throw new Error('Contact not found');
      }

      this.mockContacts[contactIndex] = {
        ...this.mockContacts[contactIndex],
        name: contactData.name.trim(),
        contactInfo: contactData.contactInfo.trim(),
      };

      return this.mockContacts[contactIndex];
    }

    return this.apiCall(`${API_BASE_URL}/api/contacts/${contactId}`, {
      method: 'PUT',
      body: JSON.stringify({
        name: contactData.name.trim(),
        contactInfo: contactData.contactInfo.trim(),
        userId: this.userId,
      }),
    });
  };

  // Search contacts by name or contact info
  searchContacts = async (query: string): Promise<ContactResponse[]> => {
    if (!query?.trim()) {
      return this.getContacts();
    }

    if (USE_MOCK_DATA) {
      const searchTerm = query.trim().toLowerCase();
      return this.mockContacts.filter(
        (contact) =>
          contact.name.toLowerCase().includes(searchTerm) ||
          contact.contactInfo.toLowerCase().includes(searchTerm),
      );
    }

    const encodedQuery = encodeURIComponent(query.trim());
    return this.apiCall(
      `${API_BASE_URL}/api/contacts/search?q=${encodedQuery}&userId=${this.userId}`,
    );
  };

  // Get contact statistics (for dashboard)
  getContactStats = async (): Promise<{
    total: number;
    recent: number;
    stale: number;
    percentageRecent: number;
  }> => {
    if (USE_MOCK_DATA) {
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);

      const recent = this.mockContacts.filter(
        (contact) => new Date(contact.lastContactDate) >= thirtyDaysAgo,
      ).length;

      const stale = this.mockContacts.filter(
        (contact) => new Date(contact.lastContactDate) < sixMonthsAgo,
      ).length;

      const total = this.mockContacts.length;

      return {
        total,
        recent,
        stale,
        percentageRecent: total > 0 ? Math.round((recent / total) * 100) : 0,
      };
    }

    return this.apiCall(
      `${API_BASE_URL}/api/contacts/stats?userId=${this.userId}`,
    );
  };
}

export default new ContactService();
