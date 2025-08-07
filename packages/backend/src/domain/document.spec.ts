import { Document } from "./document";

describe('Document Entity', () => {
  it('should expose originalName and tempPath', () => {
    const doc = new Document('report.pdf', '/tmp/report-123.pdf');

    expect(doc.originalName).toBe('report.pdf');
    expect(doc.tempPath).toBe('/tmp/report-123.pdf');
  });

  it('should return file extension', () => {
    const doc = new Document('invoice.pdf', '/tmp/tmp123.pdf');
    expect(doc.getExtension()).toBe('pdf');
  });

  it('should return empty string if no extension', () => {
    const doc = new Document('noextension', '/tmp/tmp456');
    expect(doc.getExtension()).toBe('noextension');
  });

  it('should return base name without extension', () => {
    const doc = new Document('my.document.name.pdf', '/tmp/tmp789.pdf');
    expect(doc.getBaseName()).toBe('my.document.name');
  });

  it('should return full name if no extension in base', () => {
    const doc = new Document('document', '/tmp/path');
    expect(doc.getBaseName()).toBe('document');
  });
});
