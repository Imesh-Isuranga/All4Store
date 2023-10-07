import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number=1;
  searchMode:boolean=false;

  //new properties for pagination
  thePageNumber:number = 1;
  thePageSize:number = 5;
  theTotalElements:number = 0;
  
  previousKeyword:string = "";

  constructor(private productService: ProductService,
    private cartService:CartService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if (this.searchMode) {
      this.handleSearchProduct();
    } else {
      this.handleListProduct();
    }
  }

  handleSearchProduct(){
    const thekeyword:string = this.route.snapshot.paramMap.get('keyword')!;

    //if we have a different keyword than previous
    //then set thePageNumber to 1

    if(this.previousKeyword != thekeyword){
      this.thePageNumber = 1;
    }

    this.previousKeyword = thekeyword;

    console.log(`keyword=${thekeyword}, thePageNumber=${this.thePageNumber}`);


    this.productService.searchProductsPaginate(this.thePageNumber-1,
      this.thePageNumber,
      thekeyword).subscribe(this.processResult())

  }

  handleListProduct(){
    //check if "id" parameter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id')
    if (hasCategoryId) {
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    } else {
      this.currentCategoryId = 1;
    }

    //
    //check if we have a different category than previous
    //Note:Angular will reuse a component if it is currently being viewed
    //

    //if we have a different category id than previous
    //then set thePageNumber back to 1
    if(this.previousCategoryId != this.currentCategoryId){
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;

    console.log(`CurrentCatogoryId=${this.currentCategoryId},PageNum=${this.thePageNumber}`)


    /*this.productService.getProductList(this.currentCategoryId).subscribe(
      data => {
        this.products = data;
      }
    )*/

    this.productService.getProductListPaginate(this.thePageNumber-1,
                                                this.thePageSize,
                                                this.currentCategoryId)
                                                .subscribe(
                                                  this.processResult()
                                                );
  }

  updatePageSize(pageSize:string){
    this.thePageSize = +pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }

  processResult(){
    return (data:any)=>{
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    }
  }

  addToCart(theProduct:Product){
    console.log(`Add to Cart ${theProduct.name}, and ${theProduct.unitPrice}`);

    const theCartItem = new CartItem(theProduct);
    this.cartService.addToCart(theCartItem);
  }
}
