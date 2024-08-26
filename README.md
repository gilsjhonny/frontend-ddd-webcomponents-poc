# Domain-Driven Design (DDD) Architecture in Frontend using Web Components

1. [Introduction](#introduction)
2. [Disclaimer](#disclaimer)
3. [Architecture Overview](#architecture-overview)
   - [Project Structure](#project-structure)
   - [Modules](#modules)
     - [Domain Layer](#domain-layer)
     - [Infrastructure Layer](#infrastructure-layer)
     - [Presentation Layer](#presentation-layer)
   - [Presentation (cross domain)](#presentation-cross-domain)
   - [Shared](#shared)
4. [The Project](#the-project)
   - [Key Features](#key-features)
5. [Conclusion](#conclusion)

## Introduction
I wanted to experiment with applying Domain-Driven Design (DDD) principles to a frontend project using WebComponents. This is my attempt to see how DDD, which is usually more of a backend thing, can be useful on the frontend side of things. I also wanted to challenge myself by building the components entirely from scratch, without relying on any libraries.

In this repo, you'll find a project where I’ve used WebComponents to build UI elements that are both reusable and encapsulated, all while sticking to DDD concepts. The code is heavily based on object-oriented programming (OOP) in TypeScript, which helped in organizing and structuring the domain logic. The goal here was to explore how these architectural ideas could make a frontend project more organized and aligned with the domain logic.

## Disclaimer
Just a heads up: This is a proof of concept (POC) and not intended for production use. I’ve skipped some aspects like using third-party libraries, adding accessibility features, and other best practices to keep the focus on the main ideas. Also, I had to do a lot of reading on WebComponents best practices and DDD. There isn’t a single standard that everyone follows, so what you see here is my personal take after gathering all that info.

## Architecture Overview
The project follows a Domain-Driven Design (DDD) approach, organizing the code into distinct modules that reflect different parts of the domain. Below is an overview of the architecture, explaining the structure and the responsibilities of each layer.

![image](https://github.com/user-attachments/assets/a3584120-1e34-49e3-aecb-1e82283cb6ba)

### Project Structure
```
src/
│
├── modules/
│   ├── document/
│   │   ├── domain/
│   │   │   ├── exceptions/
│   │   │   ├── valueObjects/
│   │   │   ├── Document.ts (entity)
│   │   │   ├── DocumentRepository.ts (interface)
│   │   ├── infrastructure/
│   │   │   ├── DocumentApi.ts
│   │   │   ├── DocumentStore.ts (singleton store)
│   │   │   ├── HttpDocumentRepository.ts
│   │   │   ├── MockDocumentRepository.ts
│   │   ├── presentation/
│   │   │   ├── DocumentController.ts
│   │   │   ├── DocumentViewModel.ts
│   │   │   └── components/ (web components)
│   │
│   └── notification/
│       ├── domain/
│       │   ├── Notification.ts (entity)
│       ├── infrastructure/
│       │   ├── NotificationWebSocket.ts
│       ├── presentation/
│       │   ├── NotificationController.ts
│       │   └── components/
│       │       └── Notification.ts (UI component)
│
├── presentation/ (cross-domain presentation)
│
└── shared/
    ├── components/ (generic UI components)
    └── utils/
```

#### Modules
The project is organized by feature or module (e.g., document), and within each module, you have distinct layers (domain, infrastructure, presentation). This is a form of vertical slicing because each module encapsulates all the necessary layers to handle that particular domain or feature.

##### Domain Layer `(domain/)`:

- `Document.ts`: The core domain entity representing a document.
- `DocumentRepository.ts`: An interface for the repository pattern, defining the methods for persisting and retrieving documents.
- `exceptions/`: Custom exceptions related to the document domain.
- `valueObjects/`: Value objects that define the smaller, immutable parts of a document.

##### Infrastructure Layer `(infrastructure/)`:

- `DocumentApi.ts`: Handles API interactions for document-related data.
- `DocumentStore.ts`: A singleton store that manages the state of documents.
- `HttpDocumentRepository.ts`: An implementation of DocumentRepository that interacts with a backend via HTTP.
- `MockDocumentRepository.ts`: A mock implementation of DocumentRepository for testing or local development.

##### Presentation Layer `(presentation/)`:

- `DocumentController.ts`: Manages the logic between the view and the domain.
- `DocumentViewModel.ts`: Prepares data for display and handles user interactions.
- `components/`: Web components that are part of the document module's UI.

#### Presentation (cross domain)

- `presentation/`: This folder contains components and logic that are used across multiple domains. It allows for shared presentation logic that isn’t specific to any single module.

#### Shared
- `shared/components/`: Contains generic UI components that can be reused across different modules.
- `shared/utils/`: Utility functions and helpers that are used throughout the application.


## Web Components
Even though there's no one "right" way to structure and organize WebComponents, after reading many articles and experimenting, I developed my own approach.

Example Web Component: `MyButton`
Below is a simple example of a button component that can be enabled or disabled based on an attribute:

```javascript
export class MyButton extends HTMLElement {
  private readonly BASE_CLASS_NAME = 'my-button';
  private static readonly DISABLED_ATTRIBUTE = 'disabled';

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  /**
   * ============================================
   * Private Methods
   * ============================================
   */

  private render() {
    this.clearShadowRoot();

    const button = document.createElement('button');
    button.className = this.BASE_CLASS_NAME;
    button.textContent = this.getAttribute('label') || 'Click Me';
    button.disabled = this.hasAttribute(MyButton.DISABLED_ATTRIBUTE);

    this.applyStyles(button);
    this.shadowRoot!.appendChild(button);
  }

  private applyStyles(button: HTMLButtonElement) {
    const style = document.createElement('style');

    style.textContent = `
      .${this.BASE_CLASS_NAME} {
        padding: 10px 20px;
        font-size: 16px;
        cursor: pointer;
        background-color: var(--button-bg-color, #007bff);
        color: var(--button-text-color, #fff);
        border: none;
        border-radius: 4px;
      }

      .${this.BASE_CLASS_NAME}[disabled] {
        background-color: #ccc;
        cursor: not-allowed;
      }
    `;

    this.shadowRoot!.appendChild(style);
  }

  private clearShadowRoot() {
    this.shadowRoot!.innerHTML = '';
  }

  /**
   * ============================================
   * Web Component Lifecycle
   * ============================================
   */

  static get observedAttributes() {
    return [MyButton.DISABLED_ATTRIBUTE, 'label'];
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue !== newValue) {
      this.render();
    }
  }
}

export function registerMyButton() {
  customElements.define('my-button', MyButton);
}
```

- **Class Name**: `MyButton` is the class name of the component. It extends `HTMLElement`, allowing it to be used as a custom `HTML` element.
- **Base Class Name**: `BASE_CLASS_NAME` is used to define a consistent `CSS` class name for the component’s elements.
- **Attributes**: The component listens for a disabled attribute and a label attribute to control whether the button is clickable and what text it displays.
- **Rendering**: The render method constructs the button element, sets its properties (like text and disabled state), and adds it to the shadow DOM.
- **Styling**: The `applyStyles` method injects CSS into the shadow DOM to style the button. It includes styles for both the normal and disabled states.
- **Lifecycle Methods** (Web Components API): The component uses attributeChangedCallback and observedAttributes to react when the disabled or label attributes change, re-rendering the button if necessary.


## The Project
In this project, I built a web app that displays a list of documents a customer has on their account. Each document includes a name, a list of contributors, a version number, and some attachments.

![image](https://github.com/user-attachments/assets/1ad9b9b2-1b72-4947-9f80-1793bd607713)

![image](https://github.com/user-attachments/assets/e90fcac9-1338-4a37-8a0f-707448a4c64d)

### Key Features
- Document Display: The app shows the most recent documents, allowing users to switch between a list view and a grid view.

- Real-Time Notifications: Users receive real-time alerts whenever a new document is created by someone else.

- Document Creation: Users can create new documents, which are instantly added to the document list.

- Sorting Options: Documents can be sorted by name, version, or creation date, giving users flexibility in how they organize their documents.


## Conclusion
Honestly, I’d consider using this kind of architecture when I’m dealing with a frontend that has complex business logic or distinct areas that need to stay separate. If I know a project is going to grow and get more complicated over time, having everything  organized into layers and modules from the start seems like a smart move. That said, I wouldn’t use this architecture for everything. If I’m working on something simple or small I’d probably skip this setup. It adds a level of complexity that might be overkill for a straightforward project, where a simpler approach could get the job done quicker and with less overhead. And if I’m on a tight deadline, I’d definitely lean toward something more streamlined. The initial setup and learning curve of this architecture could slow things down when time is of the essence.


