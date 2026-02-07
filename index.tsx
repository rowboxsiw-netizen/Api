/*
  Vercel Deployment Configuration:

  This project is a Single Page Application (SPA) and can be deployed as a static site on Vercel.
  Since we cannot add a vercel.json file, you will need to configure the project in the Vercel UI dashboard:

  1. Framework Preset:
     - Select "Other". Vercel might not auto-detect the setup since there's no package.json.

  2. Build & Development Settings:
     - Build Command: Leave this empty. This project doesn't have a build step; it uses import maps to load dependencies directly in the browser.
     - Output Directory: Leave this empty. Vercel will serve files from the root.
     - Install Command: Leave this empty.

  3. Rewrites for SPA:
     - To ensure client-side routing works correctly, you must add a rewrite rule.
     - Go to Project Settings -> Rewrites.
     - Source: `/(.*)`
     - Destination: `/index.html`

  4. Environment Variables:
     - Go to Project Settings -> Environment Variables.
     - Add all the Firebase configuration keys used in `src/firebase.config.ts`. For example:
       - FIREBASE_API_KEY: your-firebase-api-key
       - FIREBASE_AUTH_DOMAIN: your-project-id.firebaseapp.com
       - ... and so on for all variables.
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
