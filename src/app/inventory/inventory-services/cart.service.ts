import { Injectable, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, Subscriber } from 'rxjs';
import { CartItem } from '../inventory-models/cart.model';
import { Products } from '../inventory-models/product.model';
import { ProductsService } from './products.service';
import { map } from 'rxjs/operators';

let products = JSON.parse(localStorage.getItem('cartItem')) || [];
@Injectable({
  providedIn: 'root',
})
export class CartService {
  public cartItems: BehaviorSubject<CartItem[]> = new BehaviorSubject([]);
  public observer: Subscriber<{}>;
  private itemsInCart: CartItem[] = [];
  @Output() stock: EventEmitter<boolean> = new EventEmitter();

  public itemList: Products[];
  constructor(
    //private route: ActivatedRoute,
    private productService: ProductsService,
    private toastr: ToastrService
  ) {
    this.cartItems.subscribe((products) => (products = products));
    this.itemList = [];
  }

  // Get Products
  public getItems(): Observable<CartItem[]> {
    const itemsStream = new Observable((observer) => {
      observer.next(products);
      observer.complete();
    });
    return <Observable<CartItem[]>>itemsStream;
  }

  public calculateStockCounts(product: CartItem, quantity): CartItem | Boolean {
    let qty = product.quantity + quantity;
    let stock = product.product.stock;
    if (stock < qty) {
      this.stock.emit(false);
      return false;
    }
    this.stock.emit(true);
    return true;
  }

  public addToCart(product: Products, quantity: number): CartItem | boolean {
    var item: CartItem | boolean = false;
    let hashItem = products.find((items, index) => {
      if (items.product.id == product.id) {
        let qty = products[index].quantity + quantity;
        let stock = this.calculateStockCounts(products[index], quantity);
        if (!stock) this.toastr.error('Sorry We have no more in stock');
        if (qty != 0 && stock) {
          this.toastr.success('Item Added to cart ' + product.name);
          products[index]['quantity'] = qty;
          localStorage.setItem('cartItem', JSON.stringify(products));
        }
        return true;
      }
    });

    if (!hashItem) {
      item = { product: product, quantity: quantity };
      products.push(item);
    }
    localStorage.setItem('cartItem', JSON.stringify(products));
    return item;
  }

  public removeFromCart(item: CartItem) {
    if (item === undefined) return false;
    const index = products.indexOf(item);
    products.splice(index, 1);
    localStorage.setItem('cartItem', JSON.stringify(products));
  }
  public removeAllFromCart() {
    products.length = 0;
  }

  public updateCartQuantity(
    product: Products,
    quantity: number
  ): CartItem | boolean {
    return products.find((items, index) => {
      if (items.product.id == product.id) {
        let qty = products[index].quantity + quantity;
        let stock = this.calculateStockCounts(products[index], quantity);
        if (!stock) this.toastr.error('Sorry We have no more in stock');
        if (qty != 0 && stock) {
          products[index]['quantity'] = qty;
        }
        if (qty === 0)
          this.toastr.error(
            "Quantity Can't be Zero! If You don't want this product please remove it!"
          );
        localStorage.setItem('cartItem', JSON.stringify(products));
        return true;
      }
    });
  }
  public getTotalAmount(): Observable<number> {
    return this.cartItems.pipe(
      map((product: CartItem[]) => {
        return products.reduce((prev, curr: CartItem) => {
          return prev + curr.product.price * curr.quantity;
        }, 0);
      })
    );
  }
}
