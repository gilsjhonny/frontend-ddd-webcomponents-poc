import { getByRole, getByText, getByTestId, getByLabelText } from '@testing-library/dom';

export function getByTextFromShadowRoot(shadowRoot: ShadowRoot, text: string, exact: boolean = false) {
  return getByText(shadowRoot as unknown as HTMLElement, text, { exact });
}

export function getByRoleFromShadowRoot(shadowRoot: ShadowRoot, role: string) {
  return getByRole(shadowRoot as unknown as HTMLElement, role);
}

export function getByTestIdFromShadowRoot(shadowRoot: ShadowRoot, testId: string) {
  return getByTestId(shadowRoot as unknown as HTMLElement, testId);
}

export function getByLabelTextFromShadowRoot(shadowRoot: ShadowRoot, text: string) {
  return getByLabelText(shadowRoot as unknown as HTMLElement, text);
}
