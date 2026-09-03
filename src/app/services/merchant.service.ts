import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MerchantService {
  http = inject(HttpClient);
  baseUrl = environment.apiUrl;

  getCategories(categoryId?: string) {
    const payload = categoryId ? { CategoryId: categoryId } : {};
    return this.http.post(`${this.baseUrl}/dev/customer/getCategories`, payload);
  }

  uploadFile(payload: any) {
    return this.http.post(`${this.baseUrl}/dev/merchant/upload-files`, payload);
  }

  getStores(merchantId: string) {
    return this.http.get(`https://os9ew78zs5.execute-api.eu-west-2.amazonaws.com/dev/store/get-merchant-store?merchantId=${merchantId}`);
  }

  addProduct(payload: any) {
    return this.http.post(`https://3e4kg1o844.execute-api.eu-west-2.amazonaws.com/dev/merchant/owner/add-products-to-store-inventory`, payload);
  }

  getMerchantOrders(payload: { MerchantId: string }) {
    return this.http.post(`https://os9ew78zs5.execute-api.eu-west-2.amazonaws.com/dev/orders/get-merchant-orders`, payload);
  }

  getProductList(payload: { MerchantId: string }) {
    return this.http.post(`https://os9ew78zs5.execute-api.eu-west-2.amazonaws.com/dev/products/get-product-list-for-merchant-owner`, payload);
  }

  updateOrder(payload: any) {
    return this.http.post(`https://3e4kg1o844.execute-api.eu-west-2.amazonaws.com/dev/customer/order/order-update`, payload);
  }
}
