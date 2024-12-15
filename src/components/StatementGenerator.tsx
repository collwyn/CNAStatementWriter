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

export function generateStatement(formData: FormData): string {
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

  let statement = `On ${formattedDate} at ${formattedTime}, I, ${cnaName}, was working the ${shift} shift on the ${floor} floor. `;

  statement += `During my rounds, I found ${patientName} in room ${roomNumber} ${fallDetails.location}. `;

  if (fallDetails.cause) {
    statement += `${fallDetails.cause} `;
  }

  if (patientStatement) {
    statement += `When asked about the incident, the patient stated: "${patientStatement}" `;
  }

  if (patientInjuries) {
    statement += `Upon examination, I observed the following: ${patientInjuries}. `;
  }

  if (fallDetails.injuries) {
    statement += `Additionally, ${fallDetails.injuries}. `;
  }

  if (incidentDescription) {
    statement += incidentDescription;
  }

  return statement
    .replace(/\s+/g, ' ')
    .replace(/\s+\./g, '.')
    .replace(/\s+,/g, ',')
    .trim();
}