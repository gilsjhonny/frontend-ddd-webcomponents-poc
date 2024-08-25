import { registerAllComponents } from './presentation/componentsRegistry';
import { HomePageComponent } from './presentation/pages/Home';

import './style.css';

registerAllComponents();

document.addEventListener('DOMContentLoaded', () => {
  const app = document.querySelector<HTMLDivElement>('#app')!;
  const homePage = document.createElement(HomePageComponent.componentName);

  app.appendChild(homePage);
});
