export class DocumentException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DocumentException';
  }
}
