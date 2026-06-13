import { BootstrapContext, bootstrapApplication } from '@angular/platform-browser';
import { MarketplaceComponent } from './app/app';
import { config } from './app/app.config.server';

const bootstrap = (context: BootstrapContext) =>
    bootstrapApplication(MarketplaceComponent, config, context);

export default bootstrap;
