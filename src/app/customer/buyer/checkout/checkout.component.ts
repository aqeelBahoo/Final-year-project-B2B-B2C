import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { Product, User, Order } from '../../../core/models/object-model';
import * as Moment from 'Moment';

declare global {
  interface Window {
    moment: Moment.Moment;
  }
}
window.moment = Moment();
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  single_product_id: number;
  user_id: number;
  individual_product: Array<Product>;
  user_detail: User;
  user_address;
  user_contact_no: Number;
  order_dto: Order;
  user_session_id: any;
  cartList: any[];
  totalAmount: number = 0;

  constructor(private customerService: CustomerService, private router: Router) { }

  ngOnInit() {
    console.log(this.customerService.cartList)
    this.cartList = this.customerService.cartList;
    this.calculateGrandTotal();

    /* this.customerService.currentProduct
      .subscribe(product => {
        this.single_product_id = product
      }
      ) */
    this.user_id = Number(sessionStorage.getItem('user_session_id'));
    // this.productDetail(this.single_product_id);
    this.userAddress(this.user_id);
  }

  /* productDetail(single_product_id) {
    this.customerService.individualProduct(single_product_id).subscribe(data => {
      this.individual_product = data;
      // console.log("One Product", this.individual_product);
    }, error => {
      console.log("My error", error);
    })
  } */
  userAddress(user_id) {
    this.customerService.userDetail(user_id).subscribe(data => {
      // this.user_detail = data.address;
      this.user_address = data.address;
      this.user_contact_no = data.mobNumber;
    }, error => {
      console.log("My error", error);
    })
  }

  calculateGrandTotal() {
    this.totalAmount = 0;
    this.cartList.forEach((pro) => {
      this.totalAmount += parseFloat(pro.count) * parseFloat(pro.dp);
    });
  }

  add(product) {
    product.count = !!product.count ? ++product.count : 1;
    this.calculateGrandTotal();
  }
  sub(product) {
    product.count = !!product.count ? --product.count : 0;
    this.calculateGrandTotal();

  }

  deleteItem(i) {
    this.customerService.cartList.splice(i, 1);
    this.cartList = this.customerService.cartList;
  }

  placeOrder() {
    if (this.cartList.length === 0) {
      return;
    }
    this.user_session_id = JSON.parse(sessionStorage.getItem("user_session_id"))
    const today = Moment();
    let order_dto = {
      userId: this.user_id,
      id: new Date().getTime(),
      contact: this.user_contact_no,
      date: today.format('MM/DD/YYYY'),
      time: today.format("HH:mm:ss"),
      deliveryAddress: {
        id: 0,
        addLine1: this.user_address.addLine1,
        addLine2: this.user_address.addLine2,
        city: this.user_address.city,
        state: this.user_address.state,
        zipCode: Number(this.user_address.zipCode)
      },
      totalAmount: this.totalAmount,
      products: this.cartList
    };
    this.customerService.insertNewOrder(order_dto).subscribe(data => {
      // console.log("Order placed successfully", data);
      alert("Order places successfully")
      this.customerService.cartList = []
      this.totalAmount = 0;
      this.router.navigateByUrl("/buyer-dashboard");
    }, err => {
      alert("Some Error Occured");
    })

    /* order_dto = {
      id: 0,
      userId: this.user_id,
      sellerId: this.user_session_id, //Now it is hard coded, we are not implimented multi seller functionlity
      product: {
        id: this.individual_product.id,
        name: this.individual_product.name,
        uploadPhoto: this.individual_product.uploadPhoto,
        productDesc: this.individual_product.productDesc,
        mrp: this.individual_product.mrp,
        dp: this.individual_product.dp,
        status: this.individual_product.status,
        sellerId: this.user_session_id, //Now it is hard coded, we are not implimented multi seller functionlity

      },
      deliveryAddress: {
        id: 0,
        addLine1: this.user_address.addLine1,
        addLine2: this.user_address.addLine2,
        city: this.user_address.city,
        state: this.user_address.state,
        zipCode: Number(this.user_address.zipCode)
      },
      contact: this.user_contact_no,
      date: today.format('MM/DD/YYYY'),
      time: today.format("HH:mm:ss")
    } */
    // console.log("Place order dto", this.order_dto);


  }

}
