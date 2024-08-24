import { DocumentListComponent } from '../../modules/document/presentation/components/DocumentList';
import { DocumentListToggle } from '../../modules/document/presentation/components/DocumentListToggle';

export class HomePageComponent extends HTMLElement {
  private listViewType: 'list' | 'grid';

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.listViewType = 'list';
  }

  connectedCallback() {
    this.render();

    this.handleToggleView = this.handleToggleView.bind(this);

    // Listen to the toggle-view event
    this.shadowRoot!.addEventListener('toggle-view', this.handleToggleView);
  }

  disconnectedCallback() {
    this.shadowRoot!.removeEventListener('toggle-view', this.handleToggleView);
  }

  private handleToggleView(event: Event) {
    const customEvent = event as CustomEvent;
    const viewType = customEvent.detail.view;
    this.listViewType = viewType;

    const documentList = this.shadowRoot!.querySelector<DocumentListComponent>(DocumentListComponent.componentName);
    const documentToggle = this.shadowRoot!.querySelector<DocumentListToggle>(DocumentListToggle.componentName);

    if (documentList) {
      documentList.setAttribute('data-view-type', this.listViewType);
    }

    if (documentToggle) {
      console.log('documentToggle', documentToggle);
      documentToggle.setAttribute('data-view-type', this.listViewType);
    }
  }

  private render() {
    this.clearShadowRoot();

    this.shadowRoot!.innerHTML = `
        <style>
          .home-page {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            padding: 16px;
            max-width: 1200px;
            width: 100%;
            margin: 0 auto;
          }

          .header {
            text-align: center;
            margin-bottom: 24px;
          }
        </style>
  
        <div class="home-page">
            <h1 class="header">Document Management</h1>
            <${DocumentListComponent.componentName} data-view-type="${this.listViewType}">
                <div slot="top-left">Sort</div>
                <${DocumentListToggle.componentName} slot="top-right" data-view-type="${this.listViewType}"></${DocumentListToggle.componentName}>
            </${DocumentListComponent.componentName}>
        </div>
      `;
  }

  private clearShadowRoot() {
    this.shadowRoot!.innerHTML = '';
  }

  static get componentName() {
    return 'home-page-component';
  }
}

export function registerHomePageComponent() {
  customElements.define(HomePageComponent.componentName, HomePageComponent);
}
