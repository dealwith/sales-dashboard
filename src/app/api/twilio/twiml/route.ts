import { NextResponse } from 'next/server';
import VoiceResponse from 'twilio/lib/twiml/VoiceResponse';

export async function POST() {
  const twiml = new VoiceResponse();
  
  twiml.say({
    voice: 'alice',
  }, 'Hello! This is a call from your CRM system. Please wait while we connect you.');
  
  twiml.pause({ length: 2 });
  
  twiml.say({
    voice: 'alice',
  }, 'You are now connected. This call is being recorded for quality purposes.');

  return new NextResponse(twiml.toString(), {
    headers: {
      'Content-Type': 'text/xml',
    },
  });
}