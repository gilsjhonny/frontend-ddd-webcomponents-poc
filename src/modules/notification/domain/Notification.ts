import { NotificationProperties } from './types';

export class Notification {
  private timestamp: Date;
  private userId: string;
  private userName: string;
  private documentId: string;
  private documentTitle: string;

  constructor({ timestamp, userId, userName, documentId, documentTitle }: NotificationProperties) {
    this.timestamp = timestamp;
    this.userId = userId;
    this.userName = userName;
    this.documentId = documentId;
    this.documentTitle = documentTitle;
  }

  // Getters
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

  public static createFromResponse(response: any): Notification {
    return new Notification({
      timestamp: new Date(response.Timestamp),
      userId: response.UserID,
      userName: response.UserName,
      documentId: response.DocumentID,
      documentTitle: response.DocumentTitle,
    });
  }
}
