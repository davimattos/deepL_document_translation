import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, vi, expect } from 'vitest';

import { FileDropzone } from '../../../components/FileDropzone';
import React from 'react';

describe('FileDropzone', () => {
  const mockHandleDrop = vi.fn();
  const mockHandleDragOver = vi.fn();
  const mockHandleFileSelect = vi.fn();
  const mockHandleExecutedFile = vi.fn();
  const mockRef = { current: { click: vi.fn() } };

  const allowedExtensions = ['.docx', '.pdf', '.txt'];

  it('should render the empty dropzone with instructions and button', () => {
    render(
      <FileDropzone
        handleDrop={mockHandleDrop}
        handleDragOver={mockHandleDragOver}
        file={null}
        fileInputRef={mockRef as any}
        handleFileSelect={mockHandleFileSelect}
        allowedExtensions={allowedExtensions}
        handleExecutedFile={mockHandleExecutedFile}
      />
    );

    expect(screen.getByRole('heading', { name: /carregar documento/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /selecionar arquivo/i })).toBeInTheDocument();
    expect(screen.getByText(/extensões suportadas/i)).toBeInTheDocument();

    // snapshot da versão vazia
    expect(document.body).toMatchSnapshot();
  });

  it('should open file input when "Selecionar Arquivo" button is clicked', () => {
    const inputRef: any = React.createRef<HTMLInputElement>();

    render(
      <FileDropzone
        handleDrop={mockHandleDrop}
        handleDragOver={mockHandleDragOver}
        file={null}
        fileInputRef={inputRef}
        handleFileSelect={mockHandleFileSelect}
        allowedExtensions={allowedExtensions}
        handleExecutedFile={mockHandleExecutedFile}
      />
    );

    expect(inputRef.current).not.toBeNull();

    const clickSpy = vi.spyOn(inputRef.current!, 'click');

    const button = screen.getByRole('button', { name: /selecionar arquivo/i });
    fireEvent.click(button);
    expect(clickSpy).toHaveBeenCalled();
    clickSpy.mockRestore();
  });

  it('should render selected file information', () => {
    const fakeFile = new File(['dummy content'], 'documento.pdf', { type: 'application/pdf' });

    render(
      <FileDropzone
        handleDrop={mockHandleDrop}
        handleDragOver={mockHandleDragOver}
        file={fakeFile}
        fileInputRef={mockRef as any}
        handleFileSelect={mockHandleFileSelect}
        allowedExtensions={allowedExtensions}
        handleExecutedFile={mockHandleExecutedFile}
      />
    );

    expect(screen.getByRole('heading', { name: /arquivo selecionado/i })).toBeInTheDocument();
    expect(screen.getByText('documento.pdf')).toBeInTheDocument();
    expect(screen.getByText(/selecionar outro arquivo/i)).toBeInTheDocument();

    // snapshot da versão com arquivo
    expect(document.body).toMatchSnapshot();
  });

  it('should call handleExecutedFile when "Selecionar outro arquivo" is clicked', () => {
    const fakeFile = new File(['dummy content'], 'exemplo.txt', { type: 'text/plain' });

    render(
      <FileDropzone
        handleDrop={mockHandleDrop}
        handleDragOver={mockHandleDragOver}
        file={fakeFile}
        fileInputRef={mockRef as any}
        handleFileSelect={mockHandleFileSelect}
        allowedExtensions={allowedExtensions}
        handleExecutedFile={mockHandleExecutedFile}
      />
    );

    const button = screen.getByRole('button', { name: /selecionar outro arquivo/i });
    fireEvent.click(button);
    expect(mockHandleExecutedFile).toHaveBeenCalled();
  });
});
