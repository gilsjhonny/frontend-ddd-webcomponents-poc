import { Document } from '../domain/Document';

export class DocumentViewModel {
  private constructor(private readonly document: Document) {}

  static createFromDomain(document: Document): DocumentViewModel {
    return new DocumentViewModel(document);
  }

  get creationDate(): Date {
    return this.document.getCreationDate();
  }

  get formattedCreationDate(): string {
    return this.formatDate(this.document.getCreationDate());
  }

  get contributorNames(): string[] {
    return this.document.getContributors().map((contributor) => contributor.name);
  }

  get id(): string {
    return this.document.getId();
  }

  get name(): string {
    return this.document.getName();
  }

  get version(): string {
    return this.document.getVersion();
  }

  get attachments(): string[] {
    return this.document.getAttachments();
  }

  private formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}
