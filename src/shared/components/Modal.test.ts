import { it, expect, describe, beforeEach } from 'vitest';
import { ModalComponent, registerModal } from './Modal';
import { getByRoleFromShadowRoot, getByTestIdFromShadowRoot } from '../../tests/shadow-dom-utils';

registerModal();

describe('SimpleModal', () => {
  let element: ModalComponent;

  beforeEach(() => {
    element = document.createElement(ModalComponent.componentName) as ModalComponent;
    document.body.appendChild(element);
  });

  it('should render the modal', () => {
    expect(getByRoleFromShadowRoot(element.shadowRoot!, 'dialog')).toBeInTheDocument();
    expect(getByTestIdFromShadowRoot(element.shadowRoot!, ModalComponent.TEST_IDS.CLOSE_BUTTON)).toBeInTheDocument();
    expect(getByTestIdFromShadowRoot(element.shadowRoot!, ModalComponent.TEST_IDS.CONTENT)).toBeInTheDocument();
  });
});
