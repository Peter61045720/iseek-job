import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'iseek-job',
        appId: '1:991026128496:web:49daba50550fcfb97df6b5',
        storageBucket: 'iseek-job.firebasestorage.app',
        apiKey: 'AIzaSyBeR8zwA7_dzpjgOSkbS9PGaPpf_ve-Akg',
        authDomain: 'iseek-job.firebaseapp.com',
        messagingSenderId: '991026128496',
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
  ],
};
