import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Products } from '../inventory-models/product.model';

// Get product from Localstorage
let products = JSON.parse(localStorage.getItem('compareItem')) || [];

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  public currency: string = 'USD';
  public catalogMode: boolean = false;

  // For toggling filter of detail page in mobile view
  public filterBar: boolean = false;

  constructor(
    private http: HttpClient //private toastrService: ToastrService
  ) {}

  private products(): Observable<Products[]> {
    return this.http.get('assets/data/shop/products.json').pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  public getProducts(): Observable<Products[]> {
    return this.products();
  }

  public getProduct(id: number): Observable<Products> {
    return this.products().pipe(
      map((items) => {
        return items.find((item: Products) => {
          return item.id === id;
        });
      })
    );
  }

  public checkDuplicateInObject(tag, Products) {
    var seenDuplicate = false,
      testObject = {};

    Products.map(function (item) {
      var itemPropertyName = item[tag];
      if (itemPropertyName in testObject) {
        testObject[itemPropertyName].duplicate = true;
        item.duplicate = true;
        seenDuplicate = true;
      } else {
        testObject[itemPropertyName] = item;
        delete item.duplicate;
      }
    });

    return seenDuplicate;
  }

  private tag(): Observable<Products[]> {
    return this.http.get('assets/data/products.json').pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  public getTags(): Observable<Products[]> {
    return this.products();
  }

  public getComapreProducts(): Observable<Products[]> {
    const itemsStream = new Observable((observer) => {
      observer.next(products);
      observer.complete();
    });
    return <Observable<Products[]>>itemsStream;
  }

  // If item is aleready added In compare
  public hasProduct(product: Products): boolean {
    const item = products.find((item) => item.id === product.id);
    return item !== undefined;
  }

  // Add to compare
  public addToCompare(product: Products): Products | boolean {
    var item: Products | boolean = false;
    if (this.hasProduct(product)) {
      item = products.filter((item) => item.id === product.id)[0];
      const index = products.indexOf(item);
    } else {
      if (products.length < 4) products.push(product);
      //else this.toastrService.warning('Maximum 4 products are in compare.');
    }
    localStorage.setItem('compareItem', JSON.stringify(products));
    return item;
  }

  public removeFromCompare(product: Products) {
    if (product === undefined) {
      return;
    }
    const index = products.indexOf(product);
    products.splice(index, 1);
    localStorage.setItem('compareItem', JSON.stringify(products));
  }
}
