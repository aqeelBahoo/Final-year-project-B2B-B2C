import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ApiService } from '../../core/services/api.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  public product_url = environment.server_url + '/products/';

  constructor(private apiService: ApiService, private http: HttpClient) { }

  getAdminallProduct(): Observable<any> {
    return this.apiService.get(this.product_url)
  }

  getSellerallProduct(id): Observable<any> {
    return this.apiService.get(`${this.product_url}?sellerId=${id}`);

  }
  addNewProduct(product_dto): Observable<any> {
    return this.apiService.post(this.product_url, product_dto);

  }

  singleProduct(id) {
    return this.apiService.get(this.product_url + id)
  }
  updateProduct(id, product_dto): Observable<any> {
    return this.apiService.put(this.product_url + id, product_dto);
  }
  deleteProduct(id): Observable<any> {
    return this.apiService.delete(this.product_url + id);
  }
}
