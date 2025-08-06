import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LanguageSelector } from '../../../components/LanguageSelector';

describe('LanguageSelector component', () => {
  const languages = [
    { code: 'en', name: 'Inglês' },
    { code: 'pt', name: 'Português' },
    { code: 'es', name: 'Espanhol' },
  ];

  const sourceLanguages = [
    { code: 'en', name: 'Inglês' },
    { code: 'pt', name: 'Português' },
  ];

  const setup = (sourceValue = 'pt', targetValue = 'en') => {
    const source = {
      sourceLanguage: sourceValue,
      setSourceLanguage: vi.fn(),
    };
    const target = {
      targetLanguage: targetValue,
      setTargetLanguage: vi.fn(),
    };

    render(
      <LanguageSelector
        languages={languages}
        sourceLanguages={sourceLanguages}
        source={source}
        target={target}
      />
    );

    return { source, target };
  };

  it('renders the heading and labels', () => {
    setup();
    expect(screen.getByRole('heading', { level: 2, name: /configuração/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/idioma de origem/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/idioma de destino/i)).toBeInTheDocument();
  });

  it('shows the correct selected values', () => {
    setup('pt', 'en');
    const sourceSelect = screen.getByLabelText(/idioma de origem/i) as HTMLSelectElement;
    const targetSelect = screen.getByLabelText(/idioma de destino/i) as HTMLSelectElement;

    expect(sourceSelect.value).toBe('pt');
    expect(targetSelect.value).toBe('en');
  });

  it('calls setSourceLanguage on source select change', () => {
    const { source } = setup();
    const sourceSelect = screen.getByLabelText(/idioma de origem/i);

    fireEvent.change(sourceSelect, { target: { value: 'en' } });
    expect(source.setSourceLanguage).toHaveBeenCalledWith('en');
  });

  it('calls setTargetLanguage on target select change', () => {
    const { target } = setup();
    const targetSelect = screen.getByLabelText(/idioma de destino/i);

    fireEvent.change(targetSelect, { target: { value: 'pt' } });
    expect(target.setTargetLanguage).toHaveBeenCalledWith('pt');
  });
});
