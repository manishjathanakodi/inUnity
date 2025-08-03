import type { InputHTMLAttributes } from 'react';

export interface CustomInputProps extends InputHTMLAttributes<HTMLInputElement> {
  'data-testid'?: string;
}

export interface FormFieldProps {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  autoFocus?: boolean;
  'data-testid'?: string;
}
