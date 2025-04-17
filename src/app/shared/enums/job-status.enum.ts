export enum JobStatus {
  INACTIVE,
  ACTIVE,
}

export const ApplicationStatusDescriptions: Record<JobStatus | string, string> = {
  [JobStatus.INACTIVE]: 'Inactive',
  [JobStatus.ACTIVE]: 'Active',
};
