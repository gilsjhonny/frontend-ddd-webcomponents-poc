import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';
import { HomePageComponent } from './presentation/pages/Home';

vi.mock('./presentation/componentsRegistry', () => ({
  registerAllComponents: vi.fn(),
}));

describe('Main script', () => {
  let appDiv: HTMLDivElement;

  beforeEach(() => {
    appDiv = document.createElement('div');
    appDiv.id = 'app';
    document.body.appendChild(appDiv);
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('should create and append the HomePageComponent on DOMContentLoaded', async () => {
    const createElementSpy = vi.spyOn(document, 'createElement');

    await import('./main');

    document.dispatchEvent(new Event('DOMContentLoaded'));

    expect(createElementSpy).toHaveBeenCalledWith(HomePageComponent.componentName);
    expect(appDiv.querySelector(HomePageComponent.componentName)).toBeInTheDocument();
  });
});
