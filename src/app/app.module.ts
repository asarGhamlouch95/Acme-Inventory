import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { routes } from './app-routing.module';
import { InventoryComponent } from './inventory/inventory.component';
import { InventoryNavComponent } from './inventory/inventory-nav/inventory-nav.component';
import { ProductsPageComponent } from './inventory/products-page/products-page.component';
import { ProductBoxComponent } from './inventory/products/product-box/product-box.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CartComponent } from './inventory/cart/cart.component';
import { LoaderComponent } from './loader/loader.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
@NgModule({
  declarations: [
    AppComponent,
    InventoryComponent,
    InventoryNavComponent,
    ProductsPageComponent,
    ProductBoxComponent,
    CartComponent,
    LoaderComponent,
  ],
  imports: [
    BrowserModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    RouterModule.forRoot(routes, {
      useHash: false,
      anchorScrolling: 'enabled',
      scrollPositionRestoration: 'enabled',
    }),
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
