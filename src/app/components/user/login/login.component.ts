import { Router } from '@angular/router';
import { AccountService } from './../../../services/account.service';
import { Component, OnInit } from '@angular/core';
import { UserLogin } from 'src/app/models/identity/UserLogin';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  model = {} as UserLogin;

  constructor(
    private accountService: AccountService,
    private router: Router,
    private toaster: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {}

  public login(): void {
    this.spinner.show();
    this.accountService
      .login(this.model)
      .subscribe(
        () => {
          this.router.navigateByUrl('/dashboard');
        },
        (error: any) => {
          if (error.status == 401)
            this.toaster.error('usuário ou senha invalidos');
          else console.error(error);
        }
      )
      .add(this.spinner.hide());
  }
}
