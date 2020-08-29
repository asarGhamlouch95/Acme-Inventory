import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CartItem } from '../inventory-models/cart.model';
import { CartService } from '../inventory-services/cart.service';
import { ProductsService } from '../inventory-services/products.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  public cartItems: Observable<CartItem[]> = of([]);
  public shoppingCartItems: CartItem[] = [];

  constructor(
    private productsService: ProductsService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.cartItems = this.cartService.getItems();
    this.cartItems.subscribe(
      (shoppingCartItems) => (this.shoppingCartItems = shoppingCartItems)
    );
  }

  // Increase Product Quantity
  public increment(product: any, quantity: number = 1) {
    this.cartService.updateCartQuantity(product, quantity);
  }

  // Decrease Product Quantity
  public decrement(product: any, quantity: number = -1) {
    this.cartService.updateCartQuantity(product, quantity);
  }
  sendEmail() {}
  // Get Total
  public getTotal(): Observable<number> {
    return this.cartService.getTotalAmount();
  }

  // Remove cart items
  public removeItem(item: CartItem) {
    this.cartService.removeFromCart(item);
  }

  public removeAllItems() {
    this.cartService.removeAllFromCart();
  }
}
