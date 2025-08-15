import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { makeCall } from '@/lib/twilio';

export async function POST(request: NextRequest) {
  try {
    const { contactId, phoneNumber } = await request.json();

    if (!contactId || !phoneNumber) {
      return NextResponse.json({ error: 'Contact ID and phone number required' }, { status: 400 });
    }

    const contact = await db.contact.findUnique({
      where: { id: contactId },
    });

    if (!contact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    const twilioCall = await makeCall(phoneNumber, contactId);

    const call = await db.call.create({
      data: {
        twilioCallSid: twilioCall.sid,
        direction: 'outbound',
        status: 'INITIATED',
        startTime: new Date(),
        contactId: contactId,
      },
      include: {
        contact: true,
      },
    });

    return NextResponse.json(call, { status: 201 });
  } catch (error) {
    console.error('Error making call:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to make call' 
    }, { status: 500 });
  }
}