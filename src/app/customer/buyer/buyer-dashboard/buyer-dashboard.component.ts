import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-buyer-dashboard',
  templateUrl: './buyer-dashboard.component.html',
  styleUrls: ['./buyer-dashboard.component.scss']
})
export class BuyerDashboardComponent implements OnInit {

  all_products;
  show_checkout: Boolean = false;

  form = new FormGroup({
    search: new FormControl(''),
  })

  constructor(private router: Router, private customerService: CustomerService) { }

  ngOnInit() {
    this.getAllProduct()
  }
  searchProduct() {
    const value = this.form.controls.search.value.trim();
    if (!!value) {
      this.getSearchProduct(value);
    } else {
      this.getAllProduct();

    }
  }

  getAllProduct() {
    this.customerService.allProduct().subscribe(data => {
      this.all_products = data;
      // console.log("ALl Product", this.all_products);
    }, error => {
      console.log("My error", error);
    })
  }
  getSearchProduct(value: string) {
    this.customerService.getSearchProduct(value).subscribe(data => {
      this.all_products = data;
      // console.log("ALl Product", this.all_products);
    }, error => {
      console.log("My error", error);
    })
  }

  buyProduct(product) {
    product.count = 1;
    this.show_checkout = true;
    // this.customerService.quickBuyProduct(id) //We pass to serice from service we can access in another component
    this.addToCart(product);
    this.router.navigateByUrl("/checkout");
  }

  addToCart(product) {
    product.count = 1;
    product.disabled = true;
    this.customerService.addToCart(product);
  }

}
