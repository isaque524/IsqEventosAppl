import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, map, tap } from 'rxjs/operators';
import { Palestrante } from 'src/app/models/Palestrante';
import { PalestranteService } from 'src/app/services/Palestrante.service';

@Component({
  selector: 'app-palestrante-detalhe',
  templateUrl: './palestrante-detalhe.component.html',
  styleUrls: ['./palestrante-detalhe.component.scss']
})
export class PalestranteDetalheComponent implements OnInit {
  public form!: FormGroup;
  public situacaoDoForm = '';
  public corDaDescricao = '';

  constructor(
    private fb: FormBuilder,
    private palestranteService: PalestranteService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService


  ) { }

  ngOnInit() {
    this.validation();
    this.verificaForm();
    this.carregarPalestrante();
  }

  public validation(): void {
    this.form = this.fb.group({
      miniCurriculo: ['']
    })
  }

  public get f(): any {
    return this.form.controls;
  }

  private carregarPalestrante(): void {
    this.spinner.show();

    this.palestranteService
      .getPalestrante()
      .subscribe(
        (palestrante: Palestrante) => {
          this.form.patchValue(palestrante);
        },
        (error: any) => {
          this.toastr.error('Erro ao Carregar o Palestrante', 'Erro')
        }
      )
  }

  private verificaForm(): void {
    this.form.valueChanges
      .pipe(
        map(() => {
          this.situacaoDoForm = 'Minicurrículo está sendo Atualizado!';
          this.corDaDescricao = 'text-warning';
        }),
        debounceTime(2000),
        tap(() => this.spinner.show())
      )
      .subscribe(() => {
        this.palestranteService
          .put({ ...this.form.value })
          .subscribe(
            () => {
              this.situacaoDoForm = 'Minicurrículo foi ataulizado!';
              this.corDaDescricao = 'text-success';

              setTimeout(() => {
                this.situacaoDoForm = 'Minicurrículo foi carregado!';
                this.corDaDescricao = 'text-muted';
              }, 2000);
            },
            () => {
              this.toastr.error('Erro ao tentar atualizar Palestrante', 'Erro');
            }
          )
          .add(() => this.spinner.hide())
      });
  }

}
