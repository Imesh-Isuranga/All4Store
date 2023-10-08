import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { All4StoreService } from 'src/app/services/all4-store.service';
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

  constructor(private formBuilder:FormBuilder,
    private all4Service:All4StoreService){
    
  }

  ngOnInit(): void {
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
        cardType : new FormControl('',[Validators.required]),
        nameOnCard : new FormControl('',[Validators.required,Validators.minLength(2),All4StoreValidators.notOnlyWhitespace]),
        cardNumber : new FormControl('',[Validators.required,Validators.pattern('[0-9]{16}')]),
        securityCode : new FormControl('',[Validators.required,Validators.pattern('[0-9]{3}')]),
        expirationMonth : [''],
        expirationYear : ['']
      }),
    });

    //populate credit card months

    const startMonth:number = new Date().getMonth();
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

    

    //populate countries
    this.all4Service.getCountries().subscribe(
      data=>{
        console.log("Retrieve countries: " + JSON.stringify(data));
        this.countries = data;
      }
    );
  }

  onSubmit(){
    console.log("Handling the submit btn");

    if(this.checkoutFormGroup.invalid){
      this.checkoutFormGroup.markAllAsTouched();
    }

    console.log(this.checkoutFormGroup!.get('customer')!.value); 
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
