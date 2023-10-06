import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Product } from '../common/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:8080/api/products';

  constructor(private httpClient : HttpClient) { }

  getProductList():Observable<Product[]>{
    return this.httpClient.get<getResponse>(this.baseUrl).pipe(
      map(response => response._embedded.products)
    );
  }
}

interface getResponse{
  _embedded:{
    products:Product[];
  }
}
