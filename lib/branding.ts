export const DEFAULT_APP_NAME = 'Fitroh Mail';

export const normalizeAppName = (value: unknown) => {
  if (typeof value !== 'string') return '';
  return value.trim();
};
