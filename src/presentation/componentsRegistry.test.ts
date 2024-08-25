import { describe, it, expect, vi } from 'vitest';
import * as AddDocumentFormModule from '../modules/document/presentation/components/AddDocumentForm';
import * as BellIconModule from '../shared/components/icons/BellIcon';
import * as CaretDownIconModule from '../shared/components/icons/CaretDown';
import * as DocumentCardModule from '../modules/document/presentation/components/DocumentCard';
import * as DocumentListModule from '../modules/document/presentation/components/DocumentList';
import * as DocumentListToggleModule from '../modules/document/presentation/components/DocumentListToggle';
import * as GridIconModule from '../shared/components/icons/GridIcon';
import * as HomePageModule from './pages/Home';
import * as ListIconModule from '../shared/components/icons/ListIcon';
import * as ModalModule from '../shared/components/Modal';
import * as NotificationsComponentModule from '../modules/notification/presentation/components/NotificationsComponent';
import * as SelectModule from '../shared/components/Select';
import { registerAllComponents } from './componentsRegistry';

describe('registerAllComponents', () => {
  it('should call all component registration functions', () => {
    // Spy on all registration functions
    const addDocumentFormSpy = vi.spyOn(AddDocumentFormModule, 'registerAddDocumentFormComponent');
    const bellIconSpy = vi.spyOn(BellIconModule, 'registerBellIcon');
    const caretDownIconSpy = vi.spyOn(CaretDownIconModule, 'registerCaretDownIcon');
    const documentCardSpy = vi.spyOn(DocumentCardModule, 'registerDocumentCardComponent');
    const documentListSpy = vi.spyOn(DocumentListModule, 'registerDocumentListComponent');
    const documentListToggleSpy = vi.spyOn(DocumentListToggleModule, 'registerDocumentListToggle');
    const gridIconSpy = vi.spyOn(GridIconModule, 'registerGridIcon');
    const homePageSpy = vi.spyOn(HomePageModule, 'registerHomePageComponent');
    const listIconSpy = vi.spyOn(ListIconModule, 'registerListIcon');
    const modalSpy = vi.spyOn(ModalModule, 'registerModal');
    const notificationsComponentSpy = vi.spyOn(NotificationsComponentModule, 'registerNotificationComponent');
    const selectComponentSpy = vi.spyOn(SelectModule, 'registerSelectComponent');

    registerAllComponents();

    // Assert that each registration function was called
    expect(addDocumentFormSpy).toHaveBeenCalled();
    expect(bellIconSpy).toHaveBeenCalled();
    expect(caretDownIconSpy).toHaveBeenCalled();
    expect(documentCardSpy).toHaveBeenCalled();
    expect(documentListSpy).toHaveBeenCalled();
    expect(documentListToggleSpy).toHaveBeenCalled();
    expect(gridIconSpy).toHaveBeenCalled();
    expect(homePageSpy).toHaveBeenCalled();
    expect(listIconSpy).toHaveBeenCalled();
    expect(modalSpy).toHaveBeenCalled();
    expect(notificationsComponentSpy).toHaveBeenCalled();
    expect(selectComponentSpy).toHaveBeenCalled();

    vi.restoreAllMocks();
  });
});
