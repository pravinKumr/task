import { DatePipe } from '@angular/common';
import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  addUserForm: FormGroup;
  addFromToForm: FormGroup;
  paymentMethodForm: FormGroup
  addUserFormSubmitted = false;
  addFromToSubmitted = false;
  paymentMethodSubmitted = false;
  userData = [];
  finalUserData = [];
  errorUserData = 0;
  userForm = 1;
  fromCity = '';
  toCity = '';
  sameCityError = 0;
  minDate = new Date();
  maxDate = new Date();
  fromToCity = {};
  paymentMethod = '';
  paymentType = '';

  constructor(private formBuilder: FormBuilder, private datePipe: DatePipe) {
    this.minDate.setDate(this.minDate.getDate());
    this.maxDate.setDate(this.maxDate.getDate() - 29);
  }

  ngOnInit() {
    this.addFromToForm = this.formBuilder.group({
      fromCity: ['', [Validators.required]],
      toCity: ['', [Validators.required]],
      date: ['', [Validators.required]],
    });

    this.addUserForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      mobile: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(10)]],
      dob: ['', [Validators.required]],
    });

    this.paymentMethodForm = this.formBuilder.group({
      paymentType: ['', [Validators.required]],
      cardNo: ['', [Validators.required, Validators.maxLength(12), Validators.minLength(12)]],
      pin: ['', [Validators.required, Validators.maxLength(3), Validators.minLength(3)]],
    });
  }

  // Add from to form validate control
  get addFromToFormvalidateControl() {
    return this.addFromToForm.controls;
  }
  // Add from to form validate control end

  // Add user form validate control
  get addUserFormvalidateControl() {
    return this.addUserForm.controls;
  }
  // Add user form validate control end

  // Payment method form validate control
  get addPaymentMethodFormvalidateControl() {
    return this.paymentMethodForm.controls;
  }
  // Payment method form validate control end

  // Enter only numbers
  validateNumber(event) {
    event = (event) ? event : window.event;
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  // Enter only numbers

  // From To city form
  selectFromCity(value) {
    this.fromCity = value;
    this.sameCityError = 0;
  }

  selectToCity(value) {
    this.toCity = value;
    this.sameCityError = 0;
  }

  addFromTo(value) {
    this.addFromToSubmitted = true;
    if ((this.fromCity == this.toCity) && this.fromCity != '' && this.toCity != '') {
      this.sameCityError = 1;
      return;
    }
    if (this.addFromToForm.invalid) {
      return;
    } else {
      this.fromToCity = {from: value.fromCity, to: value.toCity, date: this.datePipe.transform(value.date, 'dd MMM yyyy')};
      this.sameCityError = 1;
      this.userForm = 2;
      this.addFromToSubmitted = false;
    }
  }
  // From To city form end

  // Add user data
  addUserData(value) {
    this.addUserFormSubmitted = true;
    if (this.addUserForm.invalid) {
      return;
    } else {
      this.userData.push({
        name: value.name,
        mobile: value.mobile,
        dob: this.datePipe.transform(value.dob, 'dd MMM yyyy')
      })
      this.errorUserData = 0;
      this.addUserForm.reset();
      this.addUserFormSubmitted = false;
    }
  }

  nextPaymentMethod() {
    if (this.userData.length == 0) {
      this.errorUserData = 1;
      return;
    } else {
      this.errorUserData = 0;
      this.userForm = 3;
      this.finalUserData = [];
    }
  }
  // Add user data end

  // Delete user data
  deleteUserData(index) {
    for (let i = 0; i < this.userData.length; i++) {
      if (i == index) {
        this.userData.splice(this.userData.indexOf(this.userData[i]), 1);
      }
    }
  }
  // Delete user data end
 
  // Book ticket
  selectMethod(value) {
    this.paymentType = value;
  }

  bookTicket(value) {
    this.paymentMethodSubmitted = true;
    if (this.paymentMethodForm.invalid) {
      return;
    } else {
      var a = {paymentType: value.paymentType, cardNo: value.cardNo, pin: value.pin};
      var b = {user: this.userData}
      var c = {...a, ...b, ...this.fromToCity};
      this.finalUserData.push(c);
      this.clearForm();
    }
  }
  // Book ticket end

  // Clear Form
  clearForm() {
    this.addFromToForm.reset();
    this.paymentMethodForm.reset();
    this.addFromToSubmitted = false;
    this.paymentMethodSubmitted = false;
    this.errorUserData = 0;
    this.userForm = 1;
    this.toCity = '';
    this.fromCity = '';
    this.paymentType = '';
    this.userData = [];
    this.finalUserData = [];
  }
  // Clear Form End
}
