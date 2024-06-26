import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/services/account.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserUpdate } from 'src/app/models/identity/UserUpdate';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {
  public usuario = {} as UserUpdate;
  public file: File;
  public imagemURL = '';

  public get ehPalestrante(): boolean {
    return this.usuario.funcao === 'Palestrante';
  }
  constructor(
    private spinner: NgxSpinnerService,
    private accountService: AccountService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void { }

  public setFormValue(usuario: UserUpdate): void {
    this.usuario = usuario;
    if (this.usuario.imagemURL)
      this.imagemURL = environment.apiUrl + `resources/perfil/${this.usuario.imagemURL}`;
    else
      this.imagemURL = './assets/img/Perfil.jpg';
  }

  onFileChange(ev: any): void {
    const reader = new FileReader();

    reader.onload = (event: any) => (this.imagemURL = event.target.result);

    this.file = ev.target.files;

    reader.readAsDataURL(this.file[0]);

    this.uploadImagem();
  }

  private uploadImagem(): void {
    this.spinner.show();
    this.accountService
      .postUpload(this.file)
      .subscribe(
        () => {
          this.toastr.success('Imagem atualizada com Sucesso', 'Sucesso!');
          window.location.reload();
        },
        (error: any) => {
          this.toastr.error('Erro ao fazer upload de imagem', 'Error!');
        }
      )
      .add(() => this.spinner.hide());
  }
}
