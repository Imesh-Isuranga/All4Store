import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItem:CartItem[]=[];

  totalPrice:Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity:Subject<number> = new BehaviorSubject<number>(0);

  //storage : Storage = sessionStorage;//Reference to web browser's session storage
  storage : Storage = localStorage;//Use local storage to get data even browser acccidently closed

  constructor() { 
    //Read data from storage
    let data = JSON.parse(this.storage.getItem('cartItems')!);

    if(data != null){
      this.cartItem = data;

      //compute totals based on the data that is read from storage
      this.computeCartTotals();
    }
  }

  addToCart(theCartItem: CartItem) {
    // Check if we already have the item in our cart
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem | null = null;
  
    if (this.cartItem.length > 0) {
      // Find the item in the cart based on item id
      for (let tempCartItem of this.cartItem) { 
        if (tempCartItem.id == theCartItem.id) {
          existingCartItem = tempCartItem;
          break;
        }
      }
      // Check if we found it
      alreadyExistsInCart = (existingCartItem != null);
    }
  
    if (alreadyExistsInCart) {
      // Check if existingCartItem is not null before accessing its properties
      if (existingCartItem) {
        // Increment the quantity
        existingCartItem.quantity++;
      }
    } else {
      // Just add the item to the array
      this.cartItem.push(theCartItem);
    }

    this.computeCartTotals();
  }

  computeCartTotals(){
    let totalPriceValue:number = 0;
    let totalQuantityValue : number = 0;

    for(let currentCartItem of this.cartItem){
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

    //publish the new values .. all subscribers will receive the new data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    //log cart data just for debugging purposes
    this.logCartData(totalPriceValue,totalQuantityValue);

    //persist cart data
    this.persistCartItems();
  }

  persistCartItems(){
    this.storage.setItem('cartItems',JSON.stringify(this.cartItem));
  }

  logCartData(totalPriceValue:number,totalQuantityValue:number){
    console.log(`Conents of the cart`);
    for(let tempCartItem of this.cartItem){
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(`name: ${tempCartItem.name}, quantity=${tempCartItem.quantity}, unitPrice=${tempCartItem.unitPrice}, subTotalPrice=${subTotalPrice}`);
    }

    console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantity: ${totalQuantityValue}`);
    console.log(`-----`);
  }

  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity--;

    if(theCartItem.quantity==0){
      this.remove(theCartItem);
    }else{
      this.computeCartTotals();
    }
  }
  remove(theCartItem: CartItem) {
    //get index of item in the array
    const itemIndex = this.cartItem.findIndex(tempCartItem=>tempCartItem.id === theCartItem.id);

    //if found, remove the item from the array at the given index
    if(itemIndex>-1){
      this.cartItem.splice(itemIndex,1);
      this.computeCartTotals();
    }
  }
  
}
