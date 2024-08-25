import { DocumentContributor } from './valueObjects/DocumentContributor';
import { DocumentErrors } from './exceptions/DocumentError';
import { DocumentException } from './exceptions/DocumentException';
import { DocumentContributorDTO, DocumentProperties } from './types';
import { SimpleUUIDGenerator } from '../../../shared/utils/SimpleUUIDGenerator';

export class Document {
  private constructor(private readonly properties: DocumentProperties) {}

  /**
   * ============================================
   * Static Factory Methods
   * ============================================
   */
  static createFromProperties(properties: DocumentProperties): Document {
    // Generate ID if not present
    const props = { ...properties };
    if (!props.id) props.id = SimpleUUIDGenerator.generateId();

    // Generate creation date if not present
    if (!props.creationDate) props.creationDate = new Date();

    this.validate(props);

    return new Document(props);
  }

  /**
   * ============================================
   * Public Getters for Document Properties
   * ============================================
   */
  getId(): string {
    return this.properties.id as string; // id is guaranteed to be set in createFromProperties
  }

  getName(): string {
    return this.properties.name;
  }

  getContributors(): DocumentContributorDTO[] {
    return this.properties.contributors.map((contributor) => contributor.toDTO());
  }

  getVersion(): string {
    return this.properties.version;
  }

  getAttachments(): string[] {
    return [...this.properties.attachments];
  }

  getCreationDate(): Date {
    return this.properties.creationDate as Date; // creationDate is guaranteed to be set in createFromProperties
  }

  /**
   * ============================================
   * Public Methods for Modifying Document Properties
   * ============================================
   */
  addContributor(contributor: DocumentContributor): void {
    const isContributorPresent = this.properties.contributors.some((existingContributor) =>
      existingContributor.equals(contributor)
    );

    if (!isContributorPresent) {
      this.properties.contributors.push(contributor);
    }
  }

  addAttachment(attachment: string): void {
    if (!attachment) {
      throw new DocumentException(DocumentErrors.EMPTY_ATTACHMENT);
    }
    this.properties.attachments.push(attachment);
  }

  /**
   * ============================================
   * Private Helper Methods
   * ============================================
   */
  private static validate(properties: DocumentProperties): void {
    if (!properties.name || properties.name.trim() === '') {
      throw new DocumentException(DocumentErrors.INVALID_NAME);
    }
    if (!properties.creationDate) {
      throw new DocumentException(DocumentErrors.INVALID_CREATION_DATE);
    }
    if (!properties.version) {
      throw new DocumentException(DocumentErrors.INVALID_VERSION);
    }
  }
}
