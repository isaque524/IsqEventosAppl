import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { PaginatedResult, Pagination } from 'src/app/models/Pagination';
import { Palestrante } from 'src/app/models/Palestrante';
import { PalestranteService } from 'src/app/services/Palestrante.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-palestrantes-listar',
  templateUrl: './palestrantes-listar.component.html',
  styleUrls: ['./palestrantes-listar.component.scss']
})
export class PalestrantesListarComponent implements OnInit {

  public palestrantes: Palestrante[] = [];
  public eventoId = 0;
  public pagination = {} as Pagination;

  constructor(private palestranteService: PalestranteService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private route: Router) { }


  public ngOnInit(): void {
    this.pagination = {
      currentPage: 1,
      itemsPerPage: 3,
      totalItems: 1,
    } as Pagination;
    this.carregarPalestrantes();
  }

  termoBuscaChanged: Subject<string> = new Subject<string>();



  public filtrarPalestrantes(evt: any): void {
    if (this.termoBuscaChanged.observers.length === 0) {
      this.termoBuscaChanged
        .pipe(debounceTime(2000))
        .subscribe((filtrarPor) => {
          this.spinner.show();
          this.palestranteService.getPalestrantes(
            this.pagination.currentPage,
            this.pagination.itemsPerPage,
            filtrarPor
          )
            .subscribe(
              (paginatedResult: PaginatedResult<Palestrante[]>) => {
                this.palestrantes = paginatedResult.result;
                this.pagination = paginatedResult.pagination;
              },
              (error: any) => {
                this.spinner.hide();
                this.toastr.error('Erro ao Carregar os Palestrante', 'Erro!');
              }
            )
            .add(() => this.spinner.hide());
        });
    }
    this.termoBuscaChanged.next(evt.value);
  }

  public getImagemURL(imagemName: string): string {
    if (imagemName)
      return environment.apiUrl + `resources/perfil/${imagemName}`;
    else
      return './assets/img/Perfil.jpg';
  }


  public carregarPalestrantes(): void {
    this.spinner.show();

    this.palestranteService.getPalestrantes(this.pagination.currentPage, this.pagination.itemsPerPage)
      .subscribe(
        (paginatedResult: PaginatedResult<Palestrante[]>) => {
          this.palestrantes = paginatedResult.result;
          this.pagination = paginatedResult.pagination;
        },
        (error: any) => {
          this.toastr.error('Erro ao Carregar os Palestrantes', 'Erro!');
          this.spinner.hide();
        }
      )
      .add(() => this.spinner.hide());
  }

}
