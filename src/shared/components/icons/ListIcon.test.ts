import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';
import { ListIcon, registerListIcon } from './ListIcon';

registerListIcon();

describe('ListIcon', () => {
  let element: ListIcon;

  beforeEach(() => {
    element = document.createElement(ListIcon.componentName) as ListIcon;
    document.body.appendChild(element);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('when the component is connected to the DOM', () => {
    it('should render the SVG with default width and height', () => {
      const shadowRoot = element.shadowRoot!;
      const svgElement = shadowRoot.querySelector('svg') as SVGElement;

      expect(svgElement).toBeInTheDocument();
      expect(svgElement.getAttribute('width')).toBeNull();
      expect(svgElement.getAttribute('height')).toBeNull();
      const styleElement = shadowRoot.querySelector('style') as HTMLStyleElement;
      expect(styleElement.textContent).toContain('width: 24px');
      expect(styleElement.textContent).toContain('height: 24px');
    });
  });

  describe('when the width and height attributes are set', () => {
    it('should render the SVG with the specified width and height', () => {
      element.setAttribute('width', '48px');
      element.setAttribute('height', '48px');

      const shadowRoot = element.shadowRoot!;
      const styleElement = shadowRoot.querySelector('style') as HTMLStyleElement;

      expect(styleElement.textContent).toContain('width: 48px');
      expect(styleElement.textContent).toContain('height: 48px');
    });

    it('should re-render the SVG when width or height attribute changes', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const renderSpy = vi.spyOn(element as any, 'render');

      element.setAttribute('width', '32px');
      expect(renderSpy).toHaveBeenCalled();

      element.setAttribute('height', '32px');
      expect(renderSpy).toHaveBeenCalled();
    });
  });

  describe('attributeChangedCallback', () => {
    it('should re-render when the width attribute changes', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const renderSpy = vi.spyOn(element as any, 'render');
      element.setAttribute('width', '50px');

      expect(renderSpy).toHaveBeenCalledTimes(1);
      expect(element.shadowRoot!.querySelector('style')!.textContent).toContain('width: 50px');
    });

    it('should re-render when the height attribute changes', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const renderSpy = vi.spyOn(element as any, 'render');
      element.setAttribute('height', '50px');

      expect(renderSpy).toHaveBeenCalledTimes(1);
      expect(element.shadowRoot!.querySelector('style')!.textContent).toContain('height: 50px');
    });
  });

  describe('observedAttributes', () => {
    it('should observe the width and height attributes', () => {
      expect(ListIcon.observedAttributes).toEqual(['width', 'height']);
    });
  });
});
