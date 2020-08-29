import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CartItem } from '../inventory-models/cart.model';
import { CartService } from '../inventory-services/cart.service';
import { ProductsService } from '../inventory-services/products.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  public cartItems: Observable<CartItem[]> = of([]);
  public shoppingCartItems: CartItem[] = [];
  isEmailSent: boolean;
  EmailForm: FormGroup;
  emailData: String;

  constructor(
    public productsService: ProductsService,
    private cartService: CartService,
    private http: HttpClient,
    private toastr: ToastrService,
    private builder: FormBuilder
  ) {}

  ngOnInit() {
    this.cartItems = this.cartService.getItems();
    this.cartItems.subscribe(
      (shoppingCartItems) => (this.shoppingCartItems = shoppingCartItems)
    );
    this.EmailForm = this.builder.group({
      Email: new FormControl('', [
        Validators.compose([Validators.required, Validators.email]),
      ]),
    });
  }

  // Increase Product Quantity
  public increment(product: any, quantity: number = 1) {
    this.cartService.updateCartQuantity(product, quantity);
  }

  // Decrease Product Quantity
  public decrement(product: any, quantity: number = -1) {
    this.cartService.updateCartQuantity(product, quantity);
  }
  sendEmail() {
    //don't forget to run the node.js file (node src/server.js) or else the email won't be sent
    this.emailData = this.EmailForm.get('Email').value;
    this.http
      .post(
        'http://localhost:3000/sendEmail',
        new HttpParams().set('data', JSON.stringify(this.emailData)),
        { headers: new HttpHeaders() }
      )
      .subscribe(() => {
        this.isEmailSent = true;
        this.EmailForm.reset();
        this.removeAllItems();
        this.toastr.success(
          "Thank you, We Received Your order. We'll get back to you shortly!"
        );
      });
  }
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
