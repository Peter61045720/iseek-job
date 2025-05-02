export enum Education {
  NONE,
  PRIMARY_SCHOOL,
  VOCATIONAL_SCHOOL, //Szakiskola / szakmunkás képző
  HIGH_SCHOOL, //Középiskola
  HIGHER_VOCATIONAL_EDUCATION, // Felsőoktatási szakképzés
  COLLEGE, //Főiskola
  UNIVERSITY, //Egyetem
}

export const EducationDescriptions: Record<Education | string, string> = {
  [Education.NONE]: 'None',
  [Education.PRIMARY_SCHOOL]: 'Primary School',
  [Education.VOCATIONAL_SCHOOL]: 'Vocational school / vocational training',
  [Education.HIGH_SCHOOL]: 'High School',
  [Education.HIGHER_VOCATIONAL_EDUCATION]: 'Higher education vocational training',
  [Education.COLLEGE]: 'College',
  [Education.UNIVERSITY]: 'University',
};
