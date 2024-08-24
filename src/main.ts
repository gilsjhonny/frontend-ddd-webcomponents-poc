import { registerDocumentCardComponent } from './modules/document/presentation/components/DocumentCard';
import {
  DocumentListComponent,
  registerDocumentListComponent,
} from './modules/document/presentation/components/DocumentList';
import './style.css';

registerDocumentCardComponent();
registerDocumentListComponent();

const app = document.querySelector<HTMLDivElement>('#app')!;

const documentListListView = document.createElement(DocumentListComponent.componentName) as HTMLElement;

const documentListGridView = document.createElement(DocumentListComponent.componentName) as HTMLElement;
documentListListView.setAttribute('data-view-type', 'grid');

app.appendChild(documentListGridView);
app.appendChild(documentListListView);
