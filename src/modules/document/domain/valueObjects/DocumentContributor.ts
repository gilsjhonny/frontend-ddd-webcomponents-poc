import { DocumentContributorDTO } from '../types';

export class DocumentContributor {
  private constructor(
    private readonly id: string,
    private readonly name: string
  ) {}

  /**
   * ============================================
   * Static Factory Methods
   * ============================================
   */
  static createFromProperties(id: string, name: string): DocumentContributor {
    this.validate(id, name);
    return new DocumentContributor(id, name);
  }

  /**
   * ============================================
   * Public Getters for Contributor Properties
   * ============================================
   */
  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  /**
   * ============================================
   * Public Utility Methods
   * ============================================
   */
  equals(documentContributor: DocumentContributor): boolean {
    return this.id === documentContributor.getId();
  }

  toDTO(): DocumentContributorDTO {
    return {
      id: this.id,
      name: this.name,
    };
  }

  /**
   * ============================================
   * Private Helper Methods
   * ============================================
   */
  private static validate(id: string, name: string): void {
    if (!id || id.trim() === '') {
      throw new Error('DocumentContributor must have a valid id.');
    }
    if (!name || name.trim() === '') {
      throw new Error('DocumentContributor must have a valid name.');
    }
  }
}
