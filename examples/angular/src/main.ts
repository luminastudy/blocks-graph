import { bootstrapApplication } from '@angular/platform-browser'
import { AppComponent } from './app/app.component'

/**
 * Angular 19 Entry Point:
 * Uses standalone components (no NgModule required)
 *
 * The application uses the BlocksGraphComponent wrapper for clean,
 * Angular-style integration with @Input/@Output decorators
 */
bootstrapApplication(AppComponent).catch(err => console.error(err))
