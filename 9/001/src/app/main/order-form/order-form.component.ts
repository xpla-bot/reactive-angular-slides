import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IProduct } from '../../shared/models/product';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { of } from 'rxjs/observable/of';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.scss']
})
export class OrderFormComponent implements OnInit {

  @Input() products: IProduct[];
  @Output() orderSubmit = new EventEmitter();

  public orderForm: FormGroup;
  public formSubmit$ = new BehaviorSubject(false);
  public checkAsyncErrors$;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.orderForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      product: ['', Validators.required]
    });

    this.checkAsyncErrors$ = this.orderForm.valueChanges
      .debounceTime(1000)
      .switchMap(() => of({error: 'Some async error!'}));

    this.formSubmit$
      .withLatestFrom(this.orderForm.valueChanges, (_, values) => values)
      .filter(() => !this.orderForm.invalid)
      .subscribe((values) => this.orderSubmit.next(values));
  }

}
