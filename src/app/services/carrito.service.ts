import { Injectable, signal } from '@angular/core';
import { Product } from '../models/producto.model';

@Injectable({ providedIn: 'root' })
export class CarritoService {
  // Lista reactiva del carrito
  private productosSignal = signal<Product[]>([]);

  // Exponer como readonly
  productos = this.productosSignal.asReadonly();

  agregar(producto: Product) {
    this.productosSignal.update(lista => [...lista, producto]);
  }

  quitar(id: number) {
    this.productosSignal.update(lista => lista.filter(p => p.id !== id));
  }

  vaciar() {
    this.productosSignal.set([]);
  }

  total(): number {
    return this.productosSignal().reduce((acc, p) => acc + p.price, 0);
  }

exportarXML() {
  const productos = this.productosSignal();
  const fecha = new Date().toLocaleDateString();
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<Recibo>\n`;
  xml += `  <Fecha>${fecha}</Fecha>\n`;
  xml += `  <Cliente>Dana Gabriela Garín Gómez</Cliente>\n`; // Citando al alumno [cite: 4]
  
  for (const p of productos) {
    xml += `  <Pedido>\n`;
    xml += `    <Producto>${this.escapeXml(p.name)}</Producto>\n`;
    xml += `    <PrecioUnitario>${p.price}</PrecioUnitario>\n`;
    xml += `    <TotalLínea>${p.price}</TotalLínea>\n`; // Asumiendo cantidad 1 por click
    xml += `  </Pedido>\n`;
  }
  
  xml += `  <Impuesto>${this.total() * 0.16}</Impuesto>\n`;
  xml += `  <Total>${this.total() * 1.16}</Total>\n`;
  xml += `</Recibo>`;

    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'recibo.xml';
    a.click();

    URL.revokeObjectURL(url);
  }

  private escapeXml(value: string): string {
    return value
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&apos;');
  }
}

