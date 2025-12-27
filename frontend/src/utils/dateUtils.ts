import moment from 'moment';

/**
 * Utility functions for date and time formatting using moment.js
 */

/**
 * Format date to relative time (e.g., "2 hours ago", "3 days ago")
 */
export const formatRelativeTime = (date: string | Date): string => {
  try {
    return moment(date).fromNow();
  } catch {
    return 'Unknown time';
  }
};

/**
 * Format date to localized date string (e.g., "12/25/2024")
 */
export const formatLocalDate = (date: string | Date): string => {
  try {
    return moment(date).format('L');
  } catch {
    return 'Invalid date';
  }
};

/**
 * Format date to full date and time (e.g., "December 25, 2024 3:30 PM")
 */
export const formatFullDateTime = (date: string | Date): string => {
  try {
    return moment(date).format('MMMM D, YYYY h:mm A');
  } catch {
    return 'Invalid date';
  }
};

/**
 * Format date to short date and time (e.g., "Dec 25, 2024 3:30 PM")
 */
export const formatShortDateTime = (date: string | Date): string => {
  try {
    return moment(date).format('MMM D, YYYY h:mm A');
  } catch {
    return 'Invalid date';
  }
};

/**
 * Format date to time only (e.g., "3:30 PM")
 */
export const formatTime = (date: string | Date): string => {
  try {
    return moment(date).format('h:mm A');
  } catch {
    return 'Invalid time';
  }
};

/**
 * Check if date is today
 */
export const isToday = (date: string | Date): boolean => {
  try {
    return moment(date).isSame(moment(), 'day');
  } catch {
    return false;
  }
};

/**
 * Check if date is yesterday
 */
export const isYesterday = (date: string | Date): boolean => {
  try {
    return moment(date).isSame(moment().subtract(1, 'day'), 'day');
  } catch {
    return false;
  }
};

/**
 * Get smart formatted date (Today, Yesterday, or relative time)
 */
export const formatSmartDate = (date: string | Date): string => {
  try {
    const momentDate = moment(date);
    
    if (momentDate.isSame(moment(), 'day')) {
      return 'Today';
    }
    
    if (momentDate.isSame(moment().subtract(1, 'day'), 'day')) {
      return 'Yesterday';
    }
    
    // If within the last week, show relative time
    if (momentDate.isAfter(moment().subtract(7, 'days'))) {
      return momentDate.fromNow();
    }
    
    // Otherwise show formatted date
    return momentDate.format('MMM D, YYYY');
  } catch {
    return 'Invalid date';
  }
};