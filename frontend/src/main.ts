import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    // HTTP Client para requisições
    provideHttpClient(),
    
    // Router para navegação
    provideRouter(routes),
    
    // Animações do Angular Material
    provideAnimations(),
    
    // Módulos do Material que precisam ser importados globalmente
    importProvidersFrom(
      MatSnackBarModule,
      MatDialogModule
    )
  ]
}).catch(err => console.error(err));