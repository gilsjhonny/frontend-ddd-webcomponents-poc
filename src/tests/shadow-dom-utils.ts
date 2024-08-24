import { getByText } from '@testing-library/dom';

export function getByTextFromShadowRoot(shadowRoot: ShadowRoot, text: string, exact: boolean = false) {
  return getByText(shadowRoot as unknown as HTMLElement, text, { exact });
}
