import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InventoryComponent } from './inventory/inventory.component';
import { CartComponent } from './inventory/cart/cart.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'inventory',
    pathMatch: 'full',
  },
  {
    path: 'inventory',
    component: InventoryComponent,
  },
  {
    path: 'cart',
    component: CartComponent,
  },
  { path: '**', redirectTo: '/404' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      anchorScrolling: 'enabled',
      scrollPositionRestoration: 'enabled',
      initialNavigation: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
