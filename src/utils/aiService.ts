import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

interface FallDetails {
  location: string;
  cause: string;
  injuries: string;
}

interface FormData {
  cnaName: string;
  incidentDate: string;
  incidentTime: string;
  floor: string;
  shift: string;
  patientName: string;
  roomNumber: string;
  incidentDescription: string;
  patientInjuries: string;
  patientStatement?: string;
  fallDetails: FallDetails;
}

export async function generateAIStatement(formData: FormData): Promise<string> {
  const {
    cnaName,
    incidentDate,
    incidentTime,
    floor,
    shift,
    patientName,
    roomNumber,
    incidentDescription,
    patientInjuries,
    patientStatement,
    fallDetails
  } = formData;

  const formattedDate = new Date(incidentDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const formattedTime = new Date(`2000-01-01T${incidentTime}`).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric'
  });

  const prompt = `
    Please generate a professional but conversational CNA incident report based on the following information:
    
    Date and Time: ${formattedDate} at ${formattedTime}
    CNA Name: ${cnaName}
    Shift: ${shift}
    Floor: ${floor}
    Patient Name: ${patientName}
    Room Number: ${roomNumber}
    Location of Fall: ${fallDetails.location}
    Cause of Fall: ${fallDetails.cause}
    Patient's Statement: ${patientStatement || 'None provided'}
    Observed Injuries: ${patientInjuries}
    Additional Injuries: ${fallDetails.injuries}
    Additional Notes: ${incidentDescription}

    Please write this as a natural, professional first-person narrative that maintains all the important details but flows conversationally. Use proper medical terminology where appropriate. Begin with the date and time, and ensure all key information is included.
  `;

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      max_tokens: 500
    });

    return completion.choices[0].message.content || 'Error generating statement';
  } catch (error) {
    console.error('Error generating AI statement:', error);
    throw new Error('Failed to generate AI statement');
  }
}