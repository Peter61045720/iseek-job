export enum JobSearchDate {
  NONE,
  ALL,
  LAST_DAY,
  THREE_DAYS,
  ONE_WEEK,
}

export const JobSearchDateDescriptions: Record<JobSearchDate | string, string> = {
  [JobSearchDate.NONE]: 'None',
  [JobSearchDate.ALL]: 'All',
  [JobSearchDate.LAST_DAY]: 'Last 24 Hours',
  [JobSearchDate.THREE_DAYS]: 'Last 3 Days',
  [JobSearchDate.ONE_WEEK]: 'Last week',
};
