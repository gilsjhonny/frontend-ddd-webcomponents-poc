import { describe, it, expect } from 'vitest';
import { DateUtils } from './DateUtils';

describe('DateUtils.humanizeDate', () => {
  it('should return "seconds ago" when the date is less than a minute ago', () => {
    const date = new Date(Date.now() - 30 * 1000); // 30 seconds ago
    expect(DateUtils.humanizeDate(date)).toBe('30 seconds ago');
  });

  it('should return "minutes ago" when the date is less than an hour ago', () => {
    const date = new Date(Date.now() - 5 * 60 * 1000); // 5 minutes ago
    expect(DateUtils.humanizeDate(date)).toBe('5 minutes ago');
  });

  it('should return "hours ago" when the date is less than a day ago', () => {
    const date = new Date(Date.now() - 3 * 60 * 60 * 1000); // 3 hours ago
    expect(DateUtils.humanizeDate(date)).toBe('3 hours ago');
  });

  it('should return "days ago" when the date is less than a week ago', () => {
    const date = new Date(Date.now() - 4 * 24 * 60 * 60 * 1000); // 4 days ago
    expect(DateUtils.humanizeDate(date)).toBe('4 days ago');
  });

  it('should return "weeks ago" when the date is less than a month ago', () => {
    const date = new Date(Date.now() - 2 * 7 * 24 * 60 * 60 * 1000); // 2 weeks ago
    expect(DateUtils.humanizeDate(date)).toBe('2 weeks ago');
  });

  it('should return "months ago" when the date is less than a year ago', () => {
    const date = new Date(Date.now() - 3 * 30 * 24 * 60 * 60 * 1000); // 3 months ago
    expect(DateUtils.humanizeDate(date)).toBe('3 months ago');
  });

  it('should return "years ago" when the date is more than a year ago', () => {
    const date = new Date(Date.now() - 2 * 365 * 24 * 60 * 60 * 1000); // 2 years ago
    expect(DateUtils.humanizeDate(date)).toBe('2 years ago');
  });

  it('should return an empty string when the date is invalid', () => {
    expect(DateUtils.humanizeDate(null as any)).toBe('');
    expect(DateUtils.humanizeDate(undefined as any)).toBe('');
  });
});
