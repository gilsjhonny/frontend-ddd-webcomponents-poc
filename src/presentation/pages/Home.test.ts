import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';
import { HomePageComponent, registerHomePageComponent } from './Home';
import { DocumentListComponent } from '../../modules/document/presentation/components/DocumentList';
import { DocumentListToggle } from '../../modules/document/presentation/components/DocumentListToggle';
import { NotificationsComponent } from '../../modules/notification/presentation/components/NotificationsComponent';
import { AddDocumentFormComponent } from '../../modules/document/presentation/components/AddDocumentForm';
import { ModalComponent } from '../../shared/components/Modal';

// Register the custom element
registerHomePageComponent();

describe('HomePageComponent', () => {
  let element: HomePageComponent;

  beforeEach(() => {
    // Create the component instance
    element = document.createElement(HomePageComponent.componentName) as HomePageComponent;
    document.body.appendChild(element);
  });

  afterEach(() => {
    // Clean up after each test
    document.body.innerHTML = '';
  });

  it('should render the component correctly', () => {
    const shadowRoot = element.shadowRoot!;
    expect(shadowRoot.querySelector('.home-page')).toBeInTheDocument();
    expect(shadowRoot.querySelector(NotificationsComponent.componentName)).toBeInTheDocument();
    expect(shadowRoot.querySelector(DocumentListComponent.componentName)).toBeInTheDocument();
    expect(shadowRoot.querySelector(DocumentListToggle.componentName)).toBeInTheDocument();
    expect(shadowRoot.querySelector(AddDocumentFormComponent.componentName)).toBeInTheDocument();
  });

  it('should open the modal when add document button is clicked', () => {
    const modal = element.shadowRoot!.querySelector(ModalComponent.componentName) as ModalComponent;

    element['handleAddDocumentClick']();

    expect(modal.getAttribute('open')).not.toBeNull();
  });

  it('should close the modal when handleModalClose is called', () => {
    const modal = element.shadowRoot!.querySelector(ModalComponent.componentName) as ModalComponent;
    modal.setAttribute('open', '');

    element['handleModalClose']();

    expect(modal.getAttribute('open')).toBeNull();
  });

  it('should toggle the view type when handleToggleView is called', () => {
    const mockEvent = new CustomEvent('toggle-view', {
      detail: { view: 'grid' },
    });

    element['handleToggleView'](mockEvent);

    expect(element['listViewType']).toBe('grid');
  });

  it('should update sort criteria when handleSortCriteriaChange is called', () => {
    const mockEvent = new CustomEvent('onchange', {
      detail: { value: 'name' },
    });

    element['handleSortCriteriaChange'](mockEvent);

    expect(element['sortCriteria']).toBe('name');
  });
});
