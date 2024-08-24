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
      const notification = new Notification(mockData);

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
      notification = new Notification(mockData);
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

  describe('Static Method: createFromResponse', () => {
    it('should correctly create a Notification instance from a response object', () => {
      const response = {
        Timestamp: '2023-08-24T10:00:00Z',
        UserID: 'user123',
        UserName: 'John Doe',
        DocumentID: 'doc456',
        DocumentTitle: 'Sample Document',
      };

      const notification = Notification.createFromResponse(response);

      expect(notification.getTimestamp()).toEqual(new Date(response.Timestamp));
      expect(notification.getUserId()).toBe(response.UserID);
      expect(notification.getUserName()).toBe(response.UserName);
      expect(notification.getDocumentId()).toBe(response.DocumentID);
      expect(notification.getDocumentTitle()).toBe(response.DocumentTitle);
    });

    it('should handle different response formats correctly', () => {
      const response = {
        Timestamp: '2024-01-01T12:00:00Z',
        UserID: 'user789',
        UserName: 'Jane Doe',
        DocumentID: 'doc999',
        DocumentTitle: 'Another Document',
      };

      const notification = Notification.createFromResponse(response);

      expect(notification.getTimestamp()).toEqual(new Date(response.Timestamp));
      expect(notification.getUserId()).toBe(response.UserID);
      expect(notification.getUserName()).toBe(response.UserName);
      expect(notification.getDocumentId()).toBe(response.DocumentID);
      expect(notification.getDocumentTitle()).toBe(response.DocumentTitle);
    });
  });
});
