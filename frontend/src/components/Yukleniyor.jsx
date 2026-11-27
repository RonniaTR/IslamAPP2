import React from 'react';

// ⏳ YÜKLENİYOR — sayfa parçası ya da oturum beklenirken görünen ekran.
// Asla boş beyaz sayfa olmaz: zemin temanın kendi rengidir (--bg-primary), ortada sekiz köşeli yıldız
// yavaşça döner. Yalnız CSS animasyonu kullanır (ana iş parçacığı meşgulken de akıcıdır).
// Bekleme 250 ms'den kısaysa yıldız hiç görünmez (göz kırpma olmasın diye gecikmeli belirir).
export default function Yukleniyor({ tamEkran = true }) {
  return (
    <div
      data-testid="yukleniyor"
      aria-busy="true"
      aria-label="Yükleniyor"
      style={{
        minHeight: tamEkran ? '100vh' : 240, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg-primary)',
      }}
    >
      <svg className="yuk-yildiz" width="44" height="44" viewBox="0 0 100 100" aria-hidden="true">
        <rect x="22" y="22" width="56" height="56" fill="none" stroke="var(--gold, #C8A55A)" strokeWidth="3" />
        <rect x="22" y="22" width="56" height="56" fill="none" stroke="var(--gold, #C8A55A)" strokeWidth="3" transform="rotate(45 50 50)" />
      </svg>
    </div>
  );
}
