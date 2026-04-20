import { Routes } from '@angular/router';
import { CatalogoComponent} from './components/catalogo/catalogo.component';
import { CarritoComponent } from './components/carrito/carrito.component';
import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';

export const routes: Routes = [
  { path: '', component: CatalogoComponent },
  { path: 'carrito', component: CarritoComponent },
  { path: '**', redirectTo: '' },
];

export const appConfig : ApplicationConfig = {
  providers: [provideHttpClient()]
}

