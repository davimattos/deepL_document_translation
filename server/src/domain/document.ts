export class Document {
  constructor(
    public readonly originalName: string,
    public readonly tempPath: string
  ) {}

  getExtension(): string {
    return this.originalName.split('.').pop() || '';
  }

  getBaseName(): string {
    return this.originalName.replace(`.${this.getExtension()}`, '');
  }
}
