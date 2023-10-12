import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { Country } from '../common/country';
import { State } from '../common/state';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class All4StoreService {

  private countriesUrl = 'https://localhost:8080/api/countries';
  private statesUrl = 'https://localhost:8080/api/states';

  constructor(private httpClient:HttpClient) { }

  getCountries():Observable<Country[]>{
    return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
      map(respose=>respose._embedded.countries)
    );
  }

  getStates(theCountryCode:string):Observable<State[]>{
    //search url
    const searcStatehUrl = `${this.statesUrl}/search/findByCountryCode?code=${theCountryCode}`;
    return this.httpClient.get<GetResponseStates>(searcStatehUrl).pipe(
      map(respose=>respose._embedded.states)
    );
  }

  getCreditCardMonths(startMonth:number):Observable<number[]>{
    let data : number[] = [];

    //build an array for "Month" dropdown list
    //-start at current month and loop until
    for(let theMonth = startMonth; theMonth <=12; theMonth++){
      data.push(theMonth);
    }

    return of(data);
  }


  getCreditCardyears():Observable<number[]>{
    let data : number[] = [];

    //-build an array for "Year" downlist list
    //-start at current year and loop for next 10 year
    const startYear:number = new Date().getFullYear();
    const endYear:number=startYear+10;

    for(let theYear = startYear; theYear <= endYear; theYear++){
      data.push(theYear);
    }

    return of(data);
  }
}


//Unwraps the JSON from SPRING DATA REST _embedded entry
interface GetResponseCountries{
  _embedded:{
    countries:Country[];
  }
}

interface GetResponseStates{
  _embedded:{
    states:State[];
  }
}

