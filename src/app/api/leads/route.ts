import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { LeadStatus, Priority } from '@prisma/client';

export async function GET() {
  try {
    const leads = await db.lead.findMany({
      include: {
        contact: true,
        notes: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(leads);
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, source, value, priority, contact } = body;

    const lead = await db.lead.create({
      data: {
        title,
        source,
        value,
        priority: priority as Priority,
        status: LeadStatus.NEW,
        contact: {
          create: {
            firstName: contact.firstName,
            lastName: contact.lastName,
            email: contact.email,
            phone: contact.phone,
            company: contact.company,
            position: contact.position,
          },
        },
      },
      include: {
        contact: true,
      },
    });

    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 });
  }
}