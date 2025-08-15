import { LeadStatus, Priority } from '@prisma/client';

describe('Lead Management', () => {
  describe('Lead Status Transitions', () => {
    it('should allow valid status transitions', () => {
      const validTransitions = [
        { from: LeadStatus.NEW, to: LeadStatus.CONTACTED },
        { from: LeadStatus.CONTACTED, to: LeadStatus.QUALIFIED },
        { from: LeadStatus.QUALIFIED, to: LeadStatus.PROPOSAL },
        { from: LeadStatus.PROPOSAL, to: LeadStatus.NEGOTIATION },
        { from: LeadStatus.NEGOTIATION, to: LeadStatus.CLOSED_WON },
        { from: LeadStatus.NEGOTIATION, to: LeadStatus.CLOSED_LOST },
      ];

      validTransitions.forEach(({ from, to }) => {
        expect(isValidStatusTransition(from, to)).toBe(true);
      });
    });

    it('should reject invalid status transitions', () => {
      const invalidTransitions = [
        { from: LeadStatus.NEW, to: LeadStatus.CLOSED_WON },
        { from: LeadStatus.CLOSED_WON, to: LeadStatus.NEW },
        { from: LeadStatus.CLOSED_LOST, to: LeadStatus.QUALIFIED },
      ];

      invalidTransitions.forEach(({ from, to }) => {
        expect(isValidStatusTransition(from, to)).toBe(false);
      });
    });
  });

  describe('Lead Validation', () => {
    it('should validate required fields', () => {
      const validLead = {
        title: 'Test Lead',
        status: LeadStatus.NEW,
        priority: Priority.MEDIUM,
        contact: {
          firstName: 'John',
          lastName: 'Doe',
        },
      };

      expect(validateLead(validLead)).toBe(true);
    });

    it('should reject leads without required contact info', () => {
      const invalidLead = {
        title: 'Test Lead',
        status: LeadStatus.NEW,
        priority: Priority.MEDIUM,
        contact: {
          firstName: '',
          lastName: 'Doe',
        },
      };

      expect(validateLead(invalidLead)).toBe(false);
    });

    it('should validate email format when provided', () => {
      const leadWithValidEmail = {
        title: 'Test Lead',
        status: LeadStatus.NEW,
        priority: Priority.MEDIUM,
        contact: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
        },
      };

      const leadWithInvalidEmail = {
        title: 'Test Lead',
        status: LeadStatus.NEW,
        priority: Priority.MEDIUM,
        contact: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'invalid-email',
        },
      };

      expect(validateLead(leadWithValidEmail)).toBe(true);
      expect(validateLead(leadWithInvalidEmail)).toBe(false);
    });
  });

  describe('Priority Handling', () => {
    it('should sort leads by priority correctly', () => {
      const leads = [
        { priority: Priority.LOW },
        { priority: Priority.URGENT },
        { priority: Priority.MEDIUM },
        { priority: Priority.HIGH },
      ];

      const sorted = sortLeadsByPriority(leads);
      expect(sorted.map(l => l.priority)).toEqual([
        Priority.URGENT,
        Priority.HIGH,
        Priority.MEDIUM,
        Priority.LOW,
      ]);
    });
  });
});

function isValidStatusTransition(from: LeadStatus, to: LeadStatus): boolean {
  const validTransitions: { [key in LeadStatus]: LeadStatus[] } = {
    [LeadStatus.NEW]: [LeadStatus.CONTACTED, LeadStatus.CLOSED_LOST],
    [LeadStatus.CONTACTED]: [LeadStatus.QUALIFIED, LeadStatus.CLOSED_LOST],
    [LeadStatus.QUALIFIED]: [LeadStatus.PROPOSAL, LeadStatus.CLOSED_LOST],
    [LeadStatus.PROPOSAL]: [LeadStatus.NEGOTIATION, LeadStatus.CLOSED_LOST],
    [LeadStatus.NEGOTIATION]: [LeadStatus.CLOSED_WON, LeadStatus.CLOSED_LOST],
    [LeadStatus.CLOSED_WON]: [],
    [LeadStatus.CLOSED_LOST]: [],
  };

  return validTransitions[from].includes(to);
}

function validateLead(lead: {
  title?: string;
  contact?: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };
}): boolean {
  if (!lead.title || !lead.contact?.firstName || !lead.contact?.lastName) {
    return false;
  }

  if (lead.contact.email && !isValidEmail(lead.contact.email)) {
    return false;
  }

  return true;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sortLeadsByPriority(leads: { priority: Priority }[]): { priority: Priority }[] {
  const priorityOrder = {
    [Priority.URGENT]: 4,
    [Priority.HIGH]: 3,
    [Priority.MEDIUM]: 2,
    [Priority.LOW]: 1,
  };

  return [...leads].sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
}