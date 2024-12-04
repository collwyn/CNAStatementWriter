import React from "react";

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

// Helper function to capitalize first letter of a sentence
const capitalizeFirstLetter = (str: string): string => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Helper function to ensure sentence ends with proper punctuation
const ensureProperPunctuation = (str: string): string => {
  if (!str) return str;
  const trimmed = str.trim();
  if (!['.', '!', '?'].includes(trimmed.slice(-1))) {
    return trimmed + '.';
  }
  return trimmed;
};

// Helper function to format the shift name
const formatShift = (shift: string): string => {
  const shifts = {
    day: "day shift",
    evening: "evening shift",
    night: "night shift"
  };
  return shifts[shift as keyof typeof shifts] || shift;
};

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

  let statement = `On ${formattedDate} at ${formattedTime}, I, ${cnaName}, was working the ${formatShift(shift)} on the ${floor} floor. `;

  // Construct the fall location sentence
  statement += `During my rounds, I found ${patientName} in room ${roomNumber} ${
    fallDetails.location ? `in the ${fallDetails.location}` : ""
  }. `;

  // Add the cause of the fall if provided
  if (fallDetails.cause) {
    statement += `${capitalizeFirstLetter(ensureProperPunctuation(fallDetails.cause))} `;
  }

  // Add patient's statement if provided
  if (patientStatement) {
    statement += `When asked about the incident, ${patientName} stated: "${ensureProperPunctuation(patientStatement)}" `;
  }

  // Add observed injuries
  if (patientInjuries) {
    statement += `Upon examination, I observed the following injuries: ${ensureProperPunctuation(patientInjuries)} `;
  }

  // Add additional injuries from fall details if different from patient injuries
  if (fallDetails.injuries && fallDetails.injuries.toLowerCase() !== patientInjuries.toLowerCase()) {
    statement += `Additional assessment revealed: ${ensureProperPunctuation(fallDetails.injuries)} `;
  }

  // Add any additional incident description
  if (incidentDescription) {
    statement += capitalizeFirstLetter(ensureProperPunctuation(incidentDescription)) + " ";
  }

  // Clean up any double spaces and ensure proper sentence endings
  return statement
    .replace(/\s+/g, ' ')
    .replace(/\s+\./g, '.')
    .replace(/\s+,/g, ',')
    .trim();
}