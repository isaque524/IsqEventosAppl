import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Evento } from 'src/app/models/Evento';
import { EventoService } from 'src/app/services/evento.service';

@Component({
  selector: 'app-evento-lista',
  templateUrl: './evento-lista.component.html',
  styleUrls: ['./evento-lista.component.scss'],
})
export class EventoListaComponent implements OnInit {
  public eventos: Evento[] = [];
  public eventosFiltrados: Evento[] = [];
  public eventoId = 0;
  public larguraImagem = 150;
  public margemImagem = 2;
  public exibirImagem: boolean = true;
  private _filtroLista: string = '';

  modalRef?: BsModalRef;

  public get filtroLista(): string {
    return this._filtroLista;
  }

  public set filtroLista(value: string) {
    this._filtroLista = value;
    this.eventosFiltrados = this.filtroLista
      ? this.filtrarEventos(this.filtroLista)
      : this.eventos;
  }

  public filtrarEventos(filtrarPor: string): any {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      (evento: { tema: string; local: string }) =>
        evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1 ||
        evento.local.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }

  constructor(
    private eventoService: EventoService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.spinner.show();
    this.carregarEventos();
  }

  public alterarValorImagem(): void {
    this.exibirImagem = !this.exibirImagem;
  }

  public carregarEventos(): void {
    this.eventoService.getEventos().subscribe({
      next: (_eventos: Evento[]) => {
        (this.eventos = _eventos), (this.eventosFiltrados = this.eventos);
      },
      error: (error: any) => {
        this.toastr.error('Erro ao Carregar os Eventos', 'Erro!');
        this.spinner.hide();
      },
      complete: () => this.spinner.hide(),
    });
  }

  openModal(event: any, template: TemplateRef<any>, eventoId: number) {
    event.stopPropagation();
    this.eventoId = eventoId;
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  confirm(): void {
    this.modalRef?.hide();
    this.spinner.show();

    this.eventoService
      .deleteEvento(this.eventoId)
      .subscribe(
        (result: any) => {
          if (result.message === 'Deletado') {
            this.toastr.success(
              'O Evento foi deletado com Sucesso.',
              'Deletado!'
            );
            this.carregarEventos();
          }
        },
        (error: any) => {
          console.error(error);
          this.toastr.error('Erro ao tentar deletar os Eventos', 'Erro!');
        }
      )
      .add(() => this.spinner.hide());
  }

  decline(): void {
    this.modalRef?.hide();
  }

  detalheEvento(id: number): void {
    this.route.navigate([`eventos/detalhe/${id}`]);
  }
}
