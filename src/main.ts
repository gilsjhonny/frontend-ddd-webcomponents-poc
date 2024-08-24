import { registerDocumentCardComponent } from './modules/document/presentation/components/DocumentCard';
import { registerDocumentListComponent } from './modules/document/presentation/components/DocumentList';
import { registerDocumentListToggle } from './modules/document/presentation/components/DocumentListToggle';
import { HomePageComponent, registerHomePageComponent } from './presentation/pages/Home';
import { registerGridIcon } from './shared/components/icons/GridIcon';
import { registerListIcon } from './shared/components/icons/ListIcon';
import './style.css';

// TODO: Move to a separate file
registerDocumentCardComponent();
registerDocumentListComponent();
registerGridIcon();
registerListIcon();
registerDocumentListToggle();
registerHomePageComponent();

document.addEventListener('DOMContentLoaded', () => {
  const app = document.querySelector<HTMLDivElement>('#app')!;
  const homePage = document.createElement(HomePageComponent.componentName);

  app.appendChild(homePage);
});
