import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderHistory } from '../common/order-history';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {

  private orderUrl = 'https://localhost:8080/api/orders';

  constructor(private httpClient:HttpClient) { }

  getOrderHistory(theEmail:string):Observable<GetresponseOrderHistory>{
    //need to build URL based on the customer email
    const orderHistoryUrl = `${this.orderUrl}/search/findByCustomerEmailOrdOrderByDateCreatedDesc?email=${theEmail}`;

    return this.httpClient.get<GetresponseOrderHistory>(orderHistoryUrl);
  }
}

interface GetresponseOrderHistory{
  _embedded:{
    orders:OrderHistory[];
  }
}
