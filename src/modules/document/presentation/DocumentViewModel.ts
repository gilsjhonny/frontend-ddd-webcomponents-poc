import { DateUtils } from '../../../shared/utils/DateUtils';
import { Document } from '../domain/Document';

export class DocumentViewModel {
  private constructor(private readonly document: Document) {}

  /**
   * ============================================
   * Static Factory Methods
   * ============================================
   */

  static createFromDomain(document: Document): DocumentViewModel {
    return new DocumentViewModel(document);
  }

  /**
   * ============================================
   * Public Getters for Document Properties
   * ============================================
   */

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

  get creationDate(): Date {
    return this.document.getCreationDate();
  }

  get formattedCreationDate(): string | null {
    return this.formatDate(this.document.getCreationDate());
  }

  get contributorNames(): string[] {
    return this.document.getContributors().map((contributor) => contributor.name);
  }

  /**
   * ============================================
   * Public Utility Methods
   * ============================================
   */

  creationDateHumanized(): string {
    if (!this.creationDate) return '';

    return DateUtils.humanizeDate(this.creationDate);
  }

  /**
   * ============================================
   * Private Helper Methods
   * ============================================
   */

  private formatDate(date: Date | null): string {
    if (!date) return '';

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}
