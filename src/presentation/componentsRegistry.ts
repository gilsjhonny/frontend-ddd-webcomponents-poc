import { registerAddDocumentFormComponent } from '../modules/document/presentation/components/AddDocumentForm';
import { registerBellIcon } from '../shared/components/icons/BellIcon';
import { registerCaretDownIcon } from '../shared/components/icons/CaretDown';
import { registerDocumentCardComponent } from '../modules/document/presentation/components/DocumentCard';
import { registerDocumentListComponent } from '../modules/document/presentation/components/DocumentList';
import { registerDocumentListToggle } from '../modules/document/presentation/components/DocumentListToggle';
import { registerGridIcon } from '../shared/components/icons/GridIcon';
import { registerHomePageComponent } from './pages/Home';
import { registerListIcon } from '../shared/components/icons/ListIcon';
import { registerModal } from '../shared/components/Modal';
import { registerNotificationComponent } from '../modules/notification/presentation/components/NotificationsComponent';
import { registerSelectComponent } from '../shared/components/Select';

export function registerAllComponents() {
  registerAddDocumentFormComponent();
  registerBellIcon();
  registerCaretDownIcon();
  registerDocumentCardComponent();
  registerDocumentListComponent();
  registerDocumentListToggle();
  registerGridIcon();
  registerHomePageComponent();
  registerListIcon();
  registerModal();
  registerNotificationComponent();
  registerSelectComponent();
}
