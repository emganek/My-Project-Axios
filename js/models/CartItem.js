function CartItem (_product, _quantity){
    this.product = _product;
    this.quantity = _quantity;
    
    //Tính ra tổng tiền phải trả trên một sản phẩm
    this.totalPrice = function(){
        return this.product.price * this.quantity;
    }
}