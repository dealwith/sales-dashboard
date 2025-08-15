'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Phone, Mail } from 'lucide-react';
import Link from 'next/link';

const statusColors = {
  NEW: 'bg-blue-100 text-blue-800',
  CONTACTED: 'bg-yellow-100 text-yellow-800',
  QUALIFIED: 'bg-green-100 text-green-800',
  PROPOSAL: 'bg-purple-100 text-purple-800',
  NEGOTIATION: 'bg-orange-100 text-orange-800',
  CLOSED_WON: 'bg-green-500 text-white',
  CLOSED_LOST: 'bg-red-100 text-red-800',
};

interface Lead {
  id: string;
  title: string;
  status: string;
  value: number | null;
  priority: string;
  contact: {
    id: string;
    firstName: string;
    lastName: string;
    company: string | null;
    phone: string | null;
    email: string | null;
  };
}

interface LeadsListProps {
  leads: Lead[];
}

export default function LeadsList({ leads }: LeadsListProps) {
  const [loadingCall, setLoadingCall] = useState<string | null>(null);

  const handleCall = async (contactId: string, phoneNumber: string) => {
    setLoadingCall(contactId);
    try {
      const response = await fetch('/api/calls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contactId,
          phoneNumber,
        }),
      });

      if (response.ok) {
        alert('Call initiated successfully!');
      } else {
        const error = await response.json();
        alert(`Failed to make call: ${error.error}`);
      }
    } catch {
      alert('Failed to make call. Please check your Twilio configuration.');
    } finally {
      setLoadingCall(null);
    }
  };

  if (leads.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">No leads yet</p>
        <Link href="/leads/new">
          <Button>Create your first lead</Button>
        </Link>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Contact</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Value</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {leads.map((lead) => (
          <TableRow key={lead.id}>
            <TableCell>
              <div>
                <div className="font-medium">
                  {lead.contact.firstName} {lead.contact.lastName}
                </div>
                <div className="text-sm text-gray-500">
                  {lead.contact.company}
                </div>
              </div>
            </TableCell>
            <TableCell>{lead.title}</TableCell>
            <TableCell>
              <Badge 
                className={statusColors[lead.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}
              >
                {lead.status}
              </Badge>
            </TableCell>
            <TableCell>
              {lead.value ? `$${lead.value.toLocaleString()}` : '-'}
            </TableCell>
            <TableCell>
              <Badge variant={lead.priority === 'HIGH' ? 'destructive' : 'secondary'}>
                {lead.priority}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                {lead.contact.phone && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleCall(lead.contact.id, lead.contact.phone!)}
                    disabled={loadingCall === lead.contact.id}
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                )}
                {lead.contact.email && (
                  <Button size="sm" variant="outline">
                    <Mail className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}