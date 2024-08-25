import { describe, it, expect, beforeEach } from 'vitest';
import { Notification } from './Notification';

import { NotificationProperties } from './types';

describe('Notification Class', () => {
  const mockData: NotificationProperties = {
    timestamp: new Date('2023-08-24T10:00:00Z'),
    userId: 'user123',
    userName: 'John Doe',
    documentId: 'doc456',
    documentTitle: 'Sample Document',
  };

  describe('Constructor', () => {
    it('should correctly assign values passed to the constructor', () => {
      const notification = Notification.createFromProperties(mockData);

      expect(notification.getTimestamp()).toEqual(mockData.timestamp);
      expect(notification.getUserId()).toBe(mockData.userId);
      expect(notification.getUserName()).toBe(mockData.userName);
      expect(notification.getDocumentId()).toBe(mockData.documentId);
      expect(notification.getDocumentTitle()).toBe(mockData.documentTitle);
    });
  });

  describe('Getters', () => {
    let notification: Notification;

    beforeEach(() => {
      notification = Notification.createFromProperties(mockData);
    });

    it('should return the correct timestamp', () => {
      expect(notification.getTimestamp()).toEqual(mockData.timestamp);
    });

    it('should return the correct userId', () => {
      expect(notification.getUserId()).toBe(mockData.userId);
    });

    it('should return the correct userName', () => {
      expect(notification.getUserName()).toBe(mockData.userName);
    });

    it('should return the correct documentId', () => {
      expect(notification.getDocumentId()).toBe(mockData.documentId);
    });

    it('should return the correct documentTitle', () => {
      expect(notification.getDocumentTitle()).toBe(mockData.documentTitle);
    });
  });
});
