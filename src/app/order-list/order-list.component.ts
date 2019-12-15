import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderService } from '../shared/services/order.service';
import { Product } from '../core/models/object-model';
import * as Moment from 'Moment';
declare var jQuery: any;


@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {

  all_product_data;
  addEditProductForm: FormGroup;
  addEditProduct: boolean = false;//for form validation
  popup_header: string;
  add_product: boolean;
  edit_product: boolean;
  grandTotal: number = 0

  product_data;
  user_role;
  product_dto: Product;

  single_product_data;
  edit_product_id;
  constructor(private formBuilder: FormBuilder, private router: Router, private orderService: OrderService) { }


  ngOnInit() {
    this.addEditProductForm = this.formBuilder.group({
      name: ['', Validators.required],
      uploadPhoto: ['', Validators.required],
      productDesc: ['', Validators.required],
      mrp: ['', Validators.required],
      dp: ['', Validators.required],
      status: ['', Validators.required]
    })
    this.user_role = sessionStorage.getItem("role");
    const user_session_id = sessionStorage.getItem("user_session_id")

    if (this.user_role === 'admin') {
      this.getAllProduct();
    }
    else if (this.user_role === 'buyer') {
      this.getBuyerOrders(user_session_id);
    }
    else if (this.user_role === 'seller') {
      this.getSellerOrder(user_session_id);
    }
  }
  print() {
    window.print();
  }

  getOrders(value: string) {
    this.grandTotal = 0
    if (value == 'all') {
      this.getAllProduct();
    }
    else if (value === 'today') {
      this.getToday()
    }
    else if (value === 'week') {
      this.getWeek()
    }
    else if (value === 'month') {
      this.getMonth()
    }
  }

  getToday() {
    console.log('----Today', Moment().format('MM/DD/YYYY'));
    let todayDateTime: any = Moment().format('MM/DD/YYYY');
    todayDateTime = new Date(todayDateTime).getTime()
    this.orderService.getOrderFilter(todayDateTime, new Date().getTime())
      .subscribe((data) => {
        this.all_product_data = data;
        this.calculateGrandTotal()
      });
  }
  getWeek() {
    console.log('----Today', Moment().format('MM/DD/YYYY'));
    let sevenDaysBeforeTime: any = Moment().subtract(7, 'days').format('MM/DD/YYYY');
    console.log('----last Week', sevenDaysBeforeTime);
    sevenDaysBeforeTime = new Date(sevenDaysBeforeTime).getTime();
    //  console.log('------Last Week ', sevenDaysBefore.format('MM/DD/YYYY'));
    // console.log('----======', new Date(sevenDaysBefore.format('MM/DD/YYYY')).toLocaleDateString());
    this.orderService.getOrderFilter(sevenDaysBeforeTime, new Date().getTime())
      .subscribe((data) => {
        this.all_product_data = data;
        this.calculateGrandTotal()

      });
  }
  getMonth() {
    console.log('----Today', Moment().format('MM/DD/YYYY'));
    let sevenDaysBeforeTime: any = Moment().subtract(1, 'month').format('MM/DD/YYYY');
    console.log('----last Month', sevenDaysBeforeTime);
    sevenDaysBeforeTime = new Date(sevenDaysBeforeTime).getTime();
    //  console.log('------Last Week ', sevenDaysBefore.format('MM/DD/YYYY'));
    // console.log('----======', new Date(sevenDaysBefore.format('MM/DD/YYYY')).toLocaleDateString());
    this.orderService.getOrderFilter(sevenDaysBeforeTime, new Date().getTime())
      .subscribe((data) => {
        this.all_product_data = data;
        this.calculateGrandTotal()

      });
  }

  /*  today() {
     const today = Moment();
     // const sevenDaysBefore = Moment().subtract(7, 'days');
     console.log('Today is ' + today.format("HH:mm:ss"));
     //  18/07/2019
   }
   week() {
     const sevenDaysBefore = Moment().subtract(7, 'days');
     console.log(sevenDaysBefore.format('MM/DD/YYYY'));
 
   }
  */
  get rf() { return this.addEditProductForm.controls; }

  calculateGrandTotal() {
    this.all_product_data.forEach(order => {
      this.grandTotal += order.totalAmount;
    });
  }

  getAllProduct() {
    this.orderService.allOrders().subscribe(data => {
      this.all_product_data = data;
      this.calculateGrandTotal()

    }, error => {
      console.log("My error", error);
    });
  }
  getBuyerOrders(id) {
    this.orderService.getBuyerOrders(id).subscribe(data => {
      this.all_product_data = data;
      this.calculateGrandTotal()

    }, error => {
      console.log("My error", error);
    });
  }
  getSellerOrder(id) {
    this.orderService.getSellerOrder(id).subscribe(data => {
      this.all_product_data = data;
      this.calculateGrandTotal()

    }, error => {
      console.log("My error", error);
    });
  }
  addProductPopup() {
    this.add_product = true;
    this.edit_product = false;
    this.popup_header = "Add New Product";
    this.addEditProductForm.reset();
  }

  /* addNewProduct() {
    this.addEditProduct = true;
    if (this.addEditProductForm.invalid) {
      // alert('Error!! :-)\n\n' + JSON.stringify(this.addEditUserForm.value))
      return;
    }
    this.product_data = this.addEditProductForm.value;
    this.product_dto = {
      id: 0,
      name: this.product_data.name,
      uploadPhoto: this.product_data.uploadPhoto,
      productDesc: this.product_data.productDesc,
      mrp: this.product_data.mrp,
      dp: this.product_data.dp,
      status: this.product_data.status
    }
    this.product_service.addNewProduct(this.product_dto).subscribe(data => {
      // console.log(data);
      jQuery('#addEditProductModal').modal('toggle');
      this.getAllProduct();
    }, err => {
      alert("Some Error Occured");
    })
  }

  editProductPopup(id) {
    this.add_product = false;
    this.edit_product = true;
    this.popup_header = "Edit Product";
    this.addEditProductForm.reset();
    this.product_service.singleProduct(id).subscribe(data => {
      this.single_product_data = data;
      this.edit_product_id = data.id;
      // console.log("single_product_data", this.single_product_data)
      this.addEditProductForm.setValue({
        name: this.single_product_data.name,
        // uploadPhoto: '',
        uploadPhoto: this.single_product_data.uploadPhoto,
        productDesc: this.single_product_data.productDesc,
        mrp: this.single_product_data.mrp,
        dp: this.single_product_data.dp,
        status: this.single_product_data.status
      })
    })
  }

  updateProduct() {
    this.addEditProduct = true;
    if (this.addEditProductForm.invalid) {
      // alert('Error!! :-)\n\n' + JSON.stringify(this.addEditUserForm.value))
      return;
    }
    this.product_data = this.addEditProductForm.value;
    this.product_dto = {
      id: 0,
      name: this.product_data.name,
      uploadPhoto: this.product_data.uploadPhoto,
      productDesc: this.product_data.productDesc,
      mrp: this.product_data.mrp,
      dp: this.product_data.dp,
      status: this.product_data.status
    }
    this.product_service.updateProduct(this.edit_product_id, this.product_dto).subscribe(data => {
      // console.log(data);
      jQuery('#addEditProductModal').modal('toggle');
      this.getAllProduct();
    }, err => {
      alert("Some Error Occured");
    })
  }

  deleteProduct(id) {
    let r = confirm("Do you want to delete the product ID: " + id + "?");
    if (r == true) {
      this.product_service.deleteProduct(id).subscribe(data => {
        console.log("deleted successfully", data);
        this.getAllProduct();
      }, err => {
        alert("Some Error Occured");
      })
    } else {
      alert("You pressed Cancel!");
    }

  } */

}
