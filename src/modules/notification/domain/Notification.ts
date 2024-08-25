import { NotificationProperties } from './types';

export class Notification {
  private timestamp: Date;
  private userId: string;
  private userName: string;
  private documentId: string;
  private documentTitle: string;

  private constructor({ timestamp, userId, userName, documentId, documentTitle }: NotificationProperties) {
    this.timestamp = timestamp;
    this.userId = userId;
    this.userName = userName;
    this.documentId = documentId;
    this.documentTitle = documentTitle;
  }

  /**
   * ============================================
   * Static Factory Methods
   * ============================================
   */

  static createFromProperties(properties: NotificationProperties): Notification {
    return new Notification(properties);
  }

  /**
   * ============================================
   * Public Getters for Document Properties
   * ============================================
   */
  public getTimestamp(): Date {
    return this.timestamp;
  }

  public getUserId(): string {
    return this.userId;
  }

  public getUserName(): string {
    return this.userName;
  }

  public getDocumentId(): string {
    return this.documentId;
  }

  public getDocumentTitle(): string {
    return this.documentTitle;
  }
}
