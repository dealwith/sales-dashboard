import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

if (!accountSid || !authToken || !twilioPhoneNumber) {
  console.warn('Twilio credentials not configured. Call functionality will be disabled.');
}

export const twilioClient = accountSid && authToken ? twilio(accountSid, authToken) : null;

export const makeCall = async (toNumber: string, _contactId: string) => {
  if (!twilioClient || !twilioPhoneNumber) {
    throw new Error('Twilio not configured');
  }

  try {
    const call = await twilioClient.calls.create({
      to: toNumber,
      from: twilioPhoneNumber,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/twilio/twiml`,
      statusCallback: `${process.env.NEXT_PUBLIC_BASE_URL}/api/twilio/status`,
      statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
      statusCallbackMethod: 'POST',
      recordingStatusCallback: `${process.env.NEXT_PUBLIC_BASE_URL}/api/twilio/recording`,
      recordingStatusCallbackMethod: 'POST',
      record: true,
    });

    return call;
  } catch (error) {
    console.error('Error making call:', error);
    throw error;
  }
};