import { Component, OnInit } from '@angular/core';
import { Products } from '../inventory-models/product.model';
import { ProductsService } from '../inventory-services/products.service';

@Component({
  selector: 'app-products-page',
  templateUrl: './products-page.component.html',
  styleUrls: ['./products-page.component.scss'],
})
export class ProductsPageComponent implements OnInit {
  public products: Products[] = [];
  constructor(private productsService: ProductsService) {}

  ngOnInit(): void {
    this.productsService.getProducts().subscribe((products) => {
      this.products = products.slice(0, 8);
    });
  }
}
