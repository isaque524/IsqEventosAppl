import { Evento } from './Evento';
import { RedeSocial } from './RedeSocial';
import { UserUpdate } from './identity/UserUpdate';

export interface Palestrante {
  id: number;
  minicurriculo: string;
  user: UserUpdate;
  redessociais: RedeSocial[];
  palestranteseventos: Evento[];
}
