// Müslüman Olmak sekmesinin yayınları. Paragraflar bir kez kelimelere ayrılır (dizgi bunu kullanır).
import kitap from './kitap';
import mecmua from './mecmua';
import mecmua2 from './mecmua2';
import { parcala } from '../../pages/musluman/sayfalar';

function hazirla(yayin) {
  yayin.bolumler.forEach((bol) => bol.bloklar.forEach((b) => { if (b.t === 'p' && !b._tokens) b._tokens = parcala(b.x); }));
  return yayin;
}

export const YAYINLAR = { kitap: hazirla(kitap), mecmua: hazirla(mecmua), mecmua2: hazirla(mecmua2) };
export { kitap, mecmua, mecmua2 };
