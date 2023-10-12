import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Purchase } from '../common/purchase';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PymentInfo } from '../common/pyment-info';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private purchaseUrl = 'https://localhost:8080/api/checkout/purchase';

  private paymentIntentUrl = 'https://localhost:8080/api/checkout/payment-intent';

  constructor(private httpClient : HttpClient) { }

  placeOrder(purchase:Purchase) : Observable<any>{
    return this.httpClient.post<Purchase>(this.purchaseUrl,purchase);
  }

  createPaymentIntent(paymentInfo:PymentInfo):Observable<any>{
    return this.httpClient.post<PymentInfo>(this.paymentIntentUrl,paymentInfo);
  }
}
