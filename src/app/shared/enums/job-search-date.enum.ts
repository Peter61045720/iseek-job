export enum JobSearchDate {
  ALL,
  LAST_DAY,
  THREE_DAYS,
  ONE_WEEK,
  ONE_MONTH,
}

export const JobSearchDateDescriptions: Record<JobSearchDate | string, string> = {
  [JobSearchDate.ALL]: 'All',
  [JobSearchDate.LAST_DAY]: 'Last 24 Hours',
  [JobSearchDate.THREE_DAYS]: 'Last 3 Days',
  [JobSearchDate.ONE_WEEK]: 'Last week',
  [JobSearchDate.ONE_MONTH]: 'Last month',
};
