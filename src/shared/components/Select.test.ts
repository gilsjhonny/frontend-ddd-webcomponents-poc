import { describe, it, afterEach, beforeEach, expect, vi } from 'vitest';
import { registerSelectComponent, SelectComponent } from './Select';

// Register the custom element
registerSelectComponent();

describe('SelectComponent', () => {
  let element: SelectComponent;

  beforeEach(() => {
    element = document.createElement(SelectComponent.componentName) as SelectComponent;
    document.body.appendChild(element);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('when the component is connected to the DOM', () => {
    it('should render the select box with default text', () => {
      const shadowRoot = element.shadowRoot!;
      const selectBox = shadowRoot.querySelector('.select-box');
      const selectedValue = shadowRoot.querySelector('.selected-value') as HTMLElement;

      expect(selectBox).toBeInTheDocument();
      expect(selectedValue.textContent).toBe('Select one...');
    });

    it('should render the options when provided as children', () => {
      element.innerHTML = `
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      `;
      element.connectedCallback(); // Re-run lifecycle method

      const shadowRoot = element.shadowRoot!;
      const optionsWrapper = shadowRoot.querySelector('.options-wrapper') as HTMLElement;
      const options = optionsWrapper.querySelectorAll('.option');

      expect(optionsWrapper).toBeInTheDocument();
      expect(options.length).toBe(2);
      expect(options[0].textContent).toBe('Option 1');
      expect(options[1].textContent).toBe('Option 2');
    });
  });

  describe('when an option is selected', () => {
    it('should dispatch the "onchange" event with the selected value', () => {
      const changeEventSpy = vi.spyOn(element, 'dispatchEvent');

      element.innerHTML = `
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      `;
      element.connectedCallback(); // Re-run lifecycle method

      const shadowRoot = element.shadowRoot!;
      const options = shadowRoot.querySelectorAll('.option') as NodeListOf<HTMLElement>;

      options[1].click();

      expect(changeEventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'onchange',
          detail: { value: '2' },
        })
      );
    });
  });

  describe('disconnectedCallback', () => {
    it('should remove event listeners when the component is disconnected', () => {
      const removeEventListenerSpy = vi.spyOn(element.shadowRoot!.querySelector('.select-box')!, 'removeEventListener');

      element.disconnectedCallback();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('click', element.toggleOpen);
    });
  });
});
