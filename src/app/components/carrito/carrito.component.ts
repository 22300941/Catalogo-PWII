import { Component, computed, signal, OnInit, inject, effect } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { CarritoService } from '../../services/carrito.service';
import { PaypalService } from '../../services/paypal.service';
import { environment } from '../../../enviroments/enviroment';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css'],
})
export class CarritoComponent implements OnInit {
  private carritoService = inject(CarritoService);
  private paypalService = inject(PaypalService);

  carrito = this.carritoService.productos;
  total = computed(() => this.carritoService.total());
  pagando = signal(false);
  mensajePago = signal('');

  constructor() {
    effect(() => {
      if (this.carrito().length > 0) {
        if ((window as any).paypal) {
          this.renderBotonPaypal();
        }
      }
    });
  }

  ngOnInit() {
    this.cargarSDKPaypal();
  }

  cargarSDKPaypal() {
    if (document.getElementById('paypal-sdk')) return;
    const script = document.createElement('script');
    script.id = 'paypal-sdk';
    script.src = `https://www.paypal.com/sdk/js?client-id=${environment.paypalClientId}&currency=MXN&intent=capture`;
    script.onload = () => this.renderBotonPaypal();
    document.body.appendChild(script);
  }

  renderBotonPaypal() {
    setTimeout(() => {
      const contenedor = document.getElementById('paypal-buttons');
      if (!contenedor) return;
      if (contenedor.childElementCount > 0) return;

      (window as any).paypal.Buttons({
        createOrder: () => {
          return this.paypalService.crearOrden({
            items: this.carrito().map(p => ({ nombre: p.name, cantidad: 1, precio: p.price })),
            total: this.total()
          }).toPromise().then((orden: any) => {
            console.log('Orden creada:', orden);
            return orden.id;
          });
        },
        onApprove: (data: any, actions: any) => {
          return this.paypalService.capturarOrden(data.orderID).toPromise().then((details: any) => {
            this.mensajePago.set(`✅ Pago completado`);
            this.carritoService.vaciar();
          });
        },
        onError: (err: any) => {
          this.mensajePago.set(`Error en el pago: ${err}`);
        }
      }).render('#paypal-buttons');
    }, 300);
  }

  quitar(id: number) { this.carritoService.quitar(id); }
  vaciar() { this.carritoService.vaciar(); }
  exportarXML() { this.carritoService.exportarXML(); }
}