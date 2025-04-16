export enum ApplicationStatus {
  NONE,
  APPLIED, //PROCESSING
  ACCEPTED,
  REJECTED,
}

export const ApplicationStatusDescriptions: Record<ApplicationStatus | string, string> = {
  [ApplicationStatus.NONE]: 'None',
  [ApplicationStatus.APPLIED]: 'Applied',
  [ApplicationStatus.ACCEPTED]: 'Accepted',
  [ApplicationStatus.REJECTED]: 'Rejected',
};
