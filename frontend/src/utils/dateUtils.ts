import moment from 'moment';

export const formatRelativeTime = (date: string | Date): string => {
  try {
    return moment(date).fromNow();
  } catch {
    return 'Unknown time';
  }
};

export const formatLocalDate = (date: string | Date): string => {
  try {
    return moment(date).format('L');
  } catch {
    return 'Invalid date';
  }
};

export const formatFullDateTime = (date: string | Date): string => {
  try {
    return moment(date).format('MMMM D, YYYY h:mm A');
  } catch {
    return 'Invalid date';
  }
};

export const formatShortDateTime = (date: string | Date): string => {
  try {
    return moment(date).format('MMM D, YYYY h:mm A');
  } catch {
    return 'Invalid date';
  }
};

export const formatTime = (date: string | Date): string => {
  try {
    return moment(date).format('h:mm A');
  } catch {
    return 'Invalid time';
  }
};

export const isToday = (date: string | Date): boolean => {
  try {
    return moment(date).isSame(moment(), 'day');
  } catch {
    return false;
  }
};

export const isYesterday = (date: string | Date): boolean => {
  try {
    return moment(date).isSame(moment().subtract(1, 'day'), 'day');
  } catch {
    return false;
  }
};

export const formatSmartDate = (date: string | Date): string => {
  try {
    const momentDate = moment(date);

    if (momentDate.isSame(moment(), 'day')) {
      return 'Today';
    }

    if (momentDate.isSame(moment().subtract(1, 'day'), 'day')) {
      return 'Yesterday';
    }

    if (momentDate.isAfter(moment().subtract(7, 'days'))) {
      return momentDate.fromNow();
    }

    return momentDate.format('MMM D, YYYY');
  } catch {
    return 'Invalid date';
  }
};
