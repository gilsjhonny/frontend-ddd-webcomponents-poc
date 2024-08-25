import { registerAddDocumentFormComponent } from './modules/document/presentation/components/AddDocumentForm';
import { registerDocumentCardComponent } from './modules/document/presentation/components/DocumentCard';
import { registerDocumentListComponent } from './modules/document/presentation/components/DocumentList';
import { registerDocumentListToggle } from './modules/document/presentation/components/DocumentListToggle';
import { registerNotificationComponent } from './modules/notification/presentation/components/NotificationsComponent';
import { HomePageComponent, registerHomePageComponent } from './presentation/pages/Home';
import { registerGridIcon } from './shared/components/icons/GridIcon';
import { registerListIcon } from './shared/components/icons/ListIcon';
import { registerModal } from './shared/components/Modal';
import './style.css';

// TODO: Move to a separate file
registerDocumentCardComponent();
registerDocumentListComponent();
registerGridIcon();
registerListIcon();
registerDocumentListToggle();
registerHomePageComponent();
registerNotificationComponent();
registerModal();
registerAddDocumentFormComponent();

document.addEventListener('DOMContentLoaded', () => {
  const app = document.querySelector<HTMLDivElement>('#app')!;
  const homePage = document.createElement(HomePageComponent.componentName);

  app.appendChild(homePage);
});
