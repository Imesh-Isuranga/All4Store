import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItem:CartItem[]=[];

  totalPrice:Subject<number> = new Subject<number>();
  totalQuantity:Subject<number> = new Subject<number>();

  constructor() { }

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
  
}
