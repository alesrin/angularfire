import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Importar Firebase y Firestore
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { ItemListComponent } from './components/item-list/item-list.component';
import { FormsModule } from '@angular/forms';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCEvfGB2Eem2ZkewzBM7gIDuX5DUb6D1gM",
  authDomain: "angularfire-562d6.firebaseapp.com",
  projectId: "angularfire-562d6",
  storageBucket: "angularfire-562d6.firebasestorage.app",
  messagingSenderId: "431636654425",
  appId: "1:431636654425:web:b5f089e94ff4332c6e4448"
};

@NgModule({
  declarations: [
    AppComponent,
    ItemListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(firebaseConfig)), // Inicializar Firebase
    provideFirestore(() => getFirestore()), // Inicializar Firestore,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
