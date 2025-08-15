import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { CallStatus } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const callSid = formData.get('CallSid') as string;
    const callStatus = formData.get('CallStatus') as string;
    const duration = formData.get('CallDuration') as string;
    // const direction = formData.get('Direction') as string;

    const statusMap: { [key: string]: CallStatus } = {
      'initiated': CallStatus.INITIATED,
      'ringing': CallStatus.RINGING,
      'in-progress': CallStatus.IN_PROGRESS,
      'completed': CallStatus.COMPLETED,
      'busy': CallStatus.BUSY,
      'no-answer': CallStatus.NO_ANSWER,
      'failed': CallStatus.FAILED,
    };

    const call = await db.call.findUnique({
      where: { twilioCallSid: callSid },
    });

    if (call) {
      await db.call.update({
        where: { twilioCallSid: callSid },
        data: {
          status: statusMap[callStatus] || CallStatus.FAILED,
          duration: duration ? parseInt(duration) : null,
          endTime: callStatus === 'completed' ? new Date() : undefined,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating call status:', error);
    return NextResponse.json({ error: 'Failed to update call status' }, { status: 500 });
  }
}