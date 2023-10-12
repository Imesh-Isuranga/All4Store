import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { PymentInfo } from 'src/app/common/pyment-info';
import { State } from 'src/app/common/state';
import { All4StoreService } from 'src/app/services/all4-store.service';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { All4StoreValidators } from 'src/app/validators/all4-store-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit{

  checkoutFormGroup!: FormGroup;
  totalPrice : number = 0;
  totalQuantity : number = 0;

  creditCardYears : number[] = [];
  creditCardMonths : number[] = [];

  countries:Country[]=[];

  shippingAddressState:State[]=[];
  billingAddressState:State[]=[];

  //initialize Stripe API
  stripe = Stripe({Your_Publishable_key});

  paymentInfo:PymentInfo = new PymentInfo(); 
  cardElement:any;
  displayError:any = "";

  isDisabled:boolean=false;

  constructor(private formBuilder:FormBuilder,
    private all4Service:All4StoreService,
    private cartService:CartService,
    private checkoutService:CheckoutService,
    private router:Router){
    
  }

  ngOnInit(): void {

    //setup Stripe payment form
    this.setupStripePaymentForm();

    this.reviewCartDetails();

    this.checkoutFormGroup = this.formBuilder.group({
      customer : this.formBuilder.group({
        firstName : new FormControl('',[Validators.required,Validators.minLength(2),All4StoreValidators.notOnlyWhitespace]),
        lastName : new FormControl('',[Validators.required,Validators.minLength(2),All4StoreValidators.notOnlyWhitespace]),
        email : new FormControl('',
        [Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAddress : this.formBuilder.group({
        street : new FormControl('',[Validators.required,Validators.minLength(2),All4StoreValidators.notOnlyWhitespace]),
        city : new FormControl('',[Validators.required,Validators.minLength(2),All4StoreValidators.notOnlyWhitespace]),
        state : new FormControl('',[Validators.required]),
        country : new FormControl('',[Validators.required]),
        zipcode : new FormControl('',[Validators.required,Validators.minLength(2),All4StoreValidators.notOnlyWhitespace])
      }),
      billingAddress : this.formBuilder.group({
        street : [''],
        city : [''],
        state : [''],
        country : [''],
        zipcode : ['']
      }),
      creditCard : this.formBuilder.group({
        /*cardType : new FormControl('',[Validators.required]),
        nameOnCard : new FormControl('',[Validators.required,Validators.minLength(2),All4StoreValidators.notOnlyWhitespace]),
        cardNumber : new FormControl('',[Validators.required,Validators.pattern('[0-9]{16}')]),
        securityCode : new FormControl('',[Validators.required,Validators.pattern('[0-9]{3}')]),
        expirationMonth : [''],
        expirationYear : ['']
        */
      }),
    });

    //populate credit card months

  /*  const startMonth:number = new Date().getMonth();
    console.log("startMonth "+startMonth);

    this.all4Service.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieve credit card months "+ JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );

    //populate credit card years

    this.all4Service.getCreditCardyears().subscribe(
      data => {
        console.log("Retrieve credit card years "+ JSON.stringify(data));
        this.creditCardYears = data;
      }
    );
    */

    

    //populate countries
    this.all4Service.getCountries().subscribe(
      data=>{
        console.log("Retrieve countries: " + JSON.stringify(data));
        this.countries = data;
      }
    );
  }

  setupStripePaymentForm() {
    //get a handle to stripe elements
    var elements = this.stripe.elements();

    //Create a card element ..and hide the zip-code field
    this.cardElement = elements.create('card',{hidePostalCode:true});

    //Add an instance of card UI component into the 'card-element' div
    this.cardElement.mount('#card-element');

    //Add event binding for the 'change' event on the card element
    this.cardElement.on('change',(event:any)=>{
      //get a handle to card-errors element
      this.displayError = document.getElementById('card-errors');

      if(event.complete){
        this.displayError.textContent = "";
      }else if(event.error){
        //show validation error to customer
        this.displayError.textContent = event.error.message;
      }
    });

  }

  reviewCartDetails() {
    //subscribe to cartService.totalQuantity
    this.cartService.totalQuantity.subscribe(
      totalQuantity => this.totalQuantity=totalQuantity
    );

    //subscribe to cartService.totalPrice
    this.cartService.totalPrice.subscribe(
      totalPrice => this.totalPrice=totalPrice
    );
  }

  onSubmit(){
    console.log("Handling the submit btn");

    if(this.checkoutFormGroup.invalid){
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
    //set up order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    //get cart items
    const cartItems = this.cartService.cartItem;

    //create orderItems from cartItems
    //-long way
    /*
    let orderItems:OrderItem[] = [];
    for(let i=0; i<cartItems.length; i++){
      orderItems[i] = new OrderItem(cartItems[i]);
    }*/

    //-short way of doing same thing
    let orderItems:OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));

    //set up purchase
    let purchase = new Purchase();

    //populate purchase - customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;
    
    //populate purchase - shipping address
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState : State = JSON.parse(JSON.stringify(purchase.shippingAddress?.state));
    const shippingCountry : Country = JSON.parse(JSON.stringify(purchase.shippingAddress?.country));
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    //populate purchase - billing address
    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState : State = JSON.parse(JSON.stringify(purchase.billingAddress?.state));
    const billingCountry : Country = JSON.parse(JSON.stringify(purchase.billingAddress?.country));
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;


    //populate purchase - order and orderItems
    purchase.order = order;
    purchase.orderItems = orderItems;

    //complete payment info
    this.paymentInfo.amount = Math.round(this.totalPrice*100);
    this.paymentInfo.currency = "USD";
    this.paymentInfo.receiptEmail = purchase.customer.email;

    //if valid form then
    // - create payment intent
    // - confirm card payment
    // - place order
    if(!this.checkoutFormGroup.invalid && this.displayError.textContent === ""){
      this.isDisabled = true;
      this.checkoutService.createPaymentIntent(this.paymentInfo).subscribe(
        (paymentIntentResponse)=>{
          this.stripe.confirmCardPayment(paymentIntentResponse.client_secret,
            {
              payment_method:{
                card:this.cardElement,

                billing_details:{
                  email:purchase.customer.email,
                  name:`${purchase.customer.firstName} ${purchase.customer.lastName}`,
                  address:{
                    line1:purchase.billingAddress.street,
                    city:purchase.billingAddress.city,
                    state:purchase.billingAddress.state,
                    postal_code:purchase.billingAddress.zipCode,
                    country:this.billingAddressCountry?.value.code
                  }
                }
              }
            },{handleAction:false}
            ).then((result:any)=>{
              if(result.error){
                //inform the customer there was an error
                alert(`There was an error: ${result.error.message}`);
                this.isDisabled = false;
              }else{
                //call REST API via the CheckoutService
                this.checkoutService.placeOrder(purchase).subscribe({
                  next:(response:any)=>{
                    alert(`Your order has been recieved.\nOrder tracking number: ${response.orderTrackingNumber}`)

                    //reset cart
                    this.resetCart();
                    this.isDisabled = false;
                  },
                  error:(err:any)=>{
                    alert(`There was an error: ${err.message}`);
                    this.isDisabled=false;
                  }
                })
              }
            })
        }
      );
    }else{
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    //call REST API via the CheckoutService
 /*   this.checkoutService.placeOrder(purchase).subscribe({
        next:response => {
          alert(`Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`);

          //reset Card
          this.resetCart();
        },
        error:err=>{
          alert(`There was an error: ${err.message}`);
        }
      }
    );*/

  }


  resetCart() {
    //reset cart data
    this.cartService.cartItem=[];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
    this.cartService.persistCartItems();//updates storage with latest state of the cart

    //reset the form
    this.checkoutFormGroup.reset();

    //navigate back to the products page
    this.router.navigateByUrl("/products");
  }

  get firstName(){return this.checkoutFormGroup.get('customer.firstName');}
  get lastName(){return this.checkoutFormGroup.get('customer.lastName');}
  get email(){return this.checkoutFormGroup.get('customer.email');}


  get shippingAddressStreet(){return this.checkoutFormGroup.get('shippingAddress.street');}
  get shippingAddressCity(){return this.checkoutFormGroup.get('shippingAddress.city');}
  get shippingAddressStatet(){return this.checkoutFormGroup.get('shippingAddress.state');}
  get shippingAddressZipCode(){return this.checkoutFormGroup.get('shippingAddress.zipcode');}
  get shippingAddressCountry(){return this.checkoutFormGroup.get('shippingAddress.country');}


  get billingAddressStreet(){return this.checkoutFormGroup.get('shippingAddress.street');}
  get billingAddressCity(){return this.checkoutFormGroup.get('shippingAddress.city');}
  get billingAddressStatet(){return this.checkoutFormGroup.get('shippingAddress.state');}
  get billingAddressZipCode(){return this.checkoutFormGroup.get('shippingAddress.zipcode');}
  get billingAddressCountry(){return this.checkoutFormGroup.get('shippingAddress.country');}

  get creditCardType(){return this.checkoutFormGroup.get('creditCard.cardType');}
  get creditCardNameOnCard(){return this.checkoutFormGroup.get('creditCard.nameOnCard');}
  get creditCardNumber(){return this.checkoutFormGroup.get('creditCard.cardNumber');}
  get creditCardSecurityCode(){return this.checkoutFormGroup.get('creditCard.securityCode');}

  copyShippingAddressToBillingAddress(event: any){
    if(event.target.checked){
      this.checkoutFormGroup.controls['billingAddress']
      .setValue(this.checkoutFormGroup.controls['shippingAddress'].value)

      //bug fix for status
      this.billingAddressState = this.shippingAddressState;
    }else{
      this.checkoutFormGroup.controls['billingAddress'].reset();
      //bug fix for status
      this.billingAddressState = [];
    }
  }

  handleMonthsAndYears(){
    const creaditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear : number = new Date().getFullYear();
    const selectedYear : number = Number(creaditCardFormGroup?.value.expirationYear);

    //if the current year equal the selected year,then start with the current month

    let startMonth:number;

    if(currentYear === selectedYear){
      startMonth = new Date().getMonth();
    }else{
      startMonth = 1;
    }

    this.all4Service.getCreditCardMonths(startMonth).subscribe(
      data=>{
        console.log("Retrieve credit card months "+JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );
  }

  getStates(formGroupName:string){
    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup?.value.country.code;
    const countryName = formGroup?.value.country.name;

    console.log(`${formGroupName} country code:  ${countryCode}`);
    console.log(`${formGroupName} country name:  ${countryName}`);

    this.all4Service.getStates(countryCode).subscribe(
      data=>{
        if(formGroupName === 'shippingAddress'){
          this.shippingAddressState = data;
        }else{
          this.billingAddressState = data;
        }

        //select first item by default
        formGroup?.get('state')?.setValue(data[0]);
      }
    );
  }

}
