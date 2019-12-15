import { Injectable } from '@angular/core';
import { FormBuilder, NumberValueAccessor } from '@angular/forms';
import { ApiService } from 'src/app/core/services/api.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class OrderService {
  // tslint:disable-next-line: variable-name
  public order_url = environment.server_url + '/orders/';

  constructor(private apiService: ApiService, private http: HttpClient) { }

  allOrders(): Observable<any> {
    return this.apiService.get(this.order_url);
  }

  getOrderFilter(lt, gt): Observable<any> {
    return this.apiService.get(`${this.order_url}?date_gte=${lt}&date_lte=${gt}`);
  }

  getBuyerOrders(id: number): Observable<any> {
    return this.apiService.get(`${this.order_url}?userId=${id}`);
  }
  getSellerOrder(id: number): Observable<any> {
    return this.apiService.get(`${this.order_url}?sellerId=${id}`);
  }
}
