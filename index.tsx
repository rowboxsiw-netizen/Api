/*
  ================================================================================
  === URGENT VERCEL DEPLOYMENT FIX: READ CAREFULLY                             ===
  ================================================================================

  Hello! The error you're seeing (`ERESOLVE`) is a Vercel configuration problem,
  NOT a code problem. The solutions you found (updating package.json, using
  --legacy-peer-deps) WILL NOT WORK because this project has NO `package.json`
  and NO build step. It's a special "no-build" setup.

  Vercel is failing because it *thinks* it needs to run `npm install`.
  You must tell it not to.

  --- PLEASE FOLLOW THESE STEPS EXACTLY IN YOUR VERCEL PROJECT SETTINGS ---

  1.  **FRAMEWORK PRESET:**
      - Set this to -> "Other"

  2.  **BUILD & DEVELOPMENT SETTINGS:**
      - Build Command:    -> LEAVE THIS FIELD COMPLETELY EMPTY <-
      - Output Directory: -> LEAVE THIS FIELD COMPLETELY EMPTY <-
      - Install Command:  -> LEAVE THIS FIELD COMPLETELY EMPTY <-
        (This is the most critical step. If this field is not empty,
         the deployment will fail with the `ERESOLVE` error.)

  3.  **REWRITES (for SPA routing):**
      - Go to your project's "Settings" -> "Rewrites".
      - Source: `/(.*)`
      - Destination: `/index.html`

  4.  **ENVIRONMENT VARIABLES:**
      - Add your Firebase keys here (e.g., FIREBASE_API_KEY).

  Following these instructions will resolve the deployment error.
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
