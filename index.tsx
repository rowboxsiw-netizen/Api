/*
  ================================================================================
  === URGENT: VERCEL DEPLOYMENT INSTRUCTIONS & TROUBLESHOOTING                 ===
  ================================================================================

  This project is a "no-build" static Single Page Application (SPA).
  It MUST be configured correctly in Vercel to avoid build failures.

  The error `ERESOLVE unable to resolve dependency tree` in your Vercel logs
  means Vercel is trying to run `npm install`. This is INCORRECT for this project.
  It happens if you select the "Node.js" framework preset by mistake.

  --- TO FIX THIS, YOU MUST CONFIGURE VERCEL AS FOLLOWS: ---

  1. Framework Preset:
     - In your Vercel Project Settings, set the Framework Preset to "Other".

  2. Build & Development Settings:
     - Build Command:    -> MUST BE EMPTY <-
     - Output Directory: -> MUST BE EMPTY <-
     - Install Command:  -> MUST BE EMPTY <-
       (This is the most critical step to prevent the `npm install` error)

  3. Rewrites for SPA Routing:
     - Go to Project Settings -> Rewrites.
     - Source: `/(.*)`
     - Destination: `/index.html`

  4. Environment Variables:
     - Go to Project Settings -> Environment Variables.
     - Add your Firebase configuration keys (e.g., FIREBASE_API_KEY).
*/
import '@angular/compiler';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';

import { AppComponent } from './src/app.component';
import { APP_ROUTES } from './src/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(APP_ROUTES, withHashLocation()),
    provideHttpClient(),
  ],
}).catch((err) => console.error(err));

// AI Studio always uses an `index.tsx` file for all project types.
