import { Component, computed, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { CarritoService } from '../../services/carrito.service';
import { PaypalService } from '../../services/paypal.service';
import { Product } from '../../models/producto.model';
import { Signal } from '@angular/core';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CurrencyPipe], // NO es CommonModule
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css'],
})
export class CarritoComponent {
  carrito: Signal<Product[]>;
  total = computed(() => this.carritoService.total());
  pagando = signal(false);
  mensajePago = signal('');

  constructor(private carritoService: CarritoService, private paypalService: PaypalService) {
    this.carrito = this.carritoService.productos;
  }

  quitar(id: number) {
    this.carritoService.quitar(id);
  }

  vaciar() {
    this.carritoService.vaciar();
  }

  exportarXML() {
    this.carritoService.exportarXML();
  }

  pagar() {
    this.pagando.set(true);
    this.mensajePago.set('');

    const items = this.carrito().map(p =>({
      nombre: p.name,
      cantidad: 1,
      precio: p.price
    }));

    this.paypalService.crearOrden({items, total: this.total()}).subscribe({
      next: (orden) => {
        this.mensajePago.set('Orden creada con ID: ${orden.id} - Status: ${orden.status}');
        this.pagando.set(false);
      }
    });
  }
}


