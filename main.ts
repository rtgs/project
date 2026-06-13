import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { MarketplaceComponent } from './app/app';

bootstrapApplication(MarketplaceComponent, appConfig)
  .catch((err) => console.error(err));
