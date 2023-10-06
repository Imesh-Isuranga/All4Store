export class Product {
    constructor(public sku:string,
        public name:string,
        public description:string,
        public unitPrice:number,
        public imageUrl:string,
        public active:boolean,
        public unitInStock:number,
        public dateCreate:Date,
        public lastUpdated:Date){

    }
}
