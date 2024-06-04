import { error } from '@angular/compiler/src/util';
import { Router } from '@angular/router';
import { AccountService } from './../../../services/account.service';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControlOptions,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ValidatorField } from 'src/app/helpers/validatorField';
import { User } from 'src/app/models/identity/User';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-registra',
  templateUrl: './registra.component.html',
  styleUrls: ['./registra.component.scss'],
})
export class RegistraComponent implements OnInit {
  user = {} as User;

  form!: FormGroup;

  get f(): any {
    return this.form.controls;
  }

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router,
    private toaster: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.validation();
  }

  private validation(): void {
    const formOptions: AbstractControlOptions = {
      validators: ValidatorField.MustMatch('password', 'confirmePassword'),
    };

    this.form = this.fb.group(
      {
        primeiroNome: ['', Validators.required],
        ultimoNome: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        userName: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(4)]],
        confirmePassword: ['', Validators.required],
      },
      formOptions
    );
  }

  register(): void {
    this.spinner.show();
    this.user = { ...this.form.value };
    this.accountService
      .register(this.user)
      .subscribe(
        () => this.router.navigateByUrl('/dashboard'),
        (error: any) => this.toaster.error(error.error)
      )
      .add(this.spinner.hide());
  }
}
