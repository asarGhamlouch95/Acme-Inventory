import { Component, Input, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Products } from '../../inventory-models/product.model';
import { CartService } from '../../inventory-services/cart.service';
import { ProductsService } from '../../inventory-services/products.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-box',
  templateUrl: './product-box.component.html',
  styleUrls: ['./product-box.component.scss'],
})
export class ProductBoxComponent implements OnInit {
  @Input() products: Products;
  closeResult: string;
  public counter: number = 1;
  available_stock: boolean = true;

  constructor(
    private cartService: CartService,
    public productsService: ProductsService,
    private modalService: NgbModal,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {}

  public addToCart(product: Products, quantity: number = 1) {
    this.cartService.stock.subscribe((emitedVal) => {
      this.available_stock = emitedVal;
    });

    this.cartService.addToCart(product, quantity);
  }
  open(content, id) {
    this.productsService
      .getProduct(id)
      .subscribe((product) => (this.products = product));
    this.modalService
      .open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  public increment() {
    this.counter += 1;
  }

  public decrement() {
    if (this.counter > 1) {
      this.counter -= 1;
    }
  }
}
