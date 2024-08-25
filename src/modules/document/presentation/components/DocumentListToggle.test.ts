import { describe, it, afterEach, beforeEach, expect, vi } from 'vitest';
import { DocumentListToggle, registerDocumentListToggle } from './DocumentListToggle';

registerDocumentListToggle();

describe('DocumentListToggle', () => {
  let element: DocumentListToggle;

  beforeEach(() => {
    element = document.createElement(DocumentListToggle.componentName) as DocumentListToggle;
    document.body.appendChild(element);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('when the component is rendered', () => {
    it('should render the list and grid buttons in list view', () => {
      const shadowRoot = element.shadowRoot!;

      const listButton = shadowRoot.querySelector('.list-button') as HTMLElement;
      const gridButton = shadowRoot.querySelector('.grid-button') as HTMLElement;

      expect(listButton).toBeInTheDocument();
      expect(gridButton).toBeInTheDocument();
    });

    it('should render the list and grid buttons in grid view', () => {
      element.setAttribute('view', 'grid');

      const shadowRoot = element.shadowRoot!;

      const listButton = shadowRoot.querySelector('.list-button') as HTMLElement;
      const gridButton = shadowRoot.querySelector('.grid-button') as HTMLElement;

      expect(listButton).toBeInTheDocument();
      expect(gridButton).toBeInTheDocument();
    });
  });

  it('should dispatch a "toggle-view" event with the correct detail when list view is selected', () => {
    const shadowRoot = element.shadowRoot!;

    const listButton = shadowRoot.querySelector('.list-button') as HTMLElement;

    const spy = vi.spyOn(element, 'dispatchEvent');
    listButton.click();

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'toggle-view',
        detail: { view: 'list' },
      })
    );
  });

  it('should correctly toggle the view and update internal state', () => {
    const shadowRoot = element.shadowRoot!;

    const listButton = shadowRoot.querySelector('.list-button') as HTMLElement;
    const gridButton = shadowRoot.querySelector('.grid-button') as HTMLElement;

    expect(element['selectedView']).toBe('list');

    gridButton.click();
    expect(element['selectedView']).toBe('grid');

    listButton.click();
    expect(element['selectedView']).toBe('list');
  });
});
