import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ExternalLink } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useTx } from '../i18n';
import { TYPOGRAPHY, SHADOWS } from '../styles/designTokens';
import sources from '../data/sources.json';

// 📜 Kaynaklar ve lisanslar — Ayarlar › Hakkında
// Bütün veri data/sources.json'dan gelir; bu sayfaya elle kaynak yazılmaz.

function Link({ href, children, color }) {
  if (!href) return null;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-[12px] font-semibold underline break-all" style={{ color }}>
      {children} <ExternalLink size={11} />
    </a>
  );
}

export default function LicensesPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const tt = useTx();

  const Card = ({ title, children }) => (
    <section className="rounded-[20px] p-4" style={{ background: theme.surface, border: `1px solid ${theme.cardBorder}`, boxShadow: SHADOWS.sm }}>
      <h2 className="text-[13px] font-bold uppercase tracking-wide mb-3" style={{ color: theme.textSecondary }}>{title}</h2>
      <div className="flex flex-col gap-3">{children}</div>
    </section>
  );
  const Item = ({ name, lines = [], url }) => (
    <div>
      <p className="text-[14px] font-semibold" style={{ color: theme.textPrimary }}>{name}</p>
      {lines.filter(Boolean).map((l, i) => (
        <p key={i} className="text-[12px] leading-relaxed" style={{ color: theme.textSecondary }}>{l}</p>
      ))}
      <Link href={url} color={theme.textPrimary}>{url?.replace(/^https?:\/\//, '')}</Link>
    </div>
  );

  const q = sources.quranText;
  const onay = sources.diyanetOnayi;

  return (
    <div className="min-h-screen pb-24" style={{ background: theme.bg }} data-testid="licenses-page">
      <div className="flex items-center px-4 pt-6 pb-6 sticky top-0 z-10" style={{ background: theme.bg }}>
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5">
          <ChevronLeft size={24} style={{ color: theme.textPrimary }} />
          <span className="font-extrabold text-xl tracking-tight" style={{ color: theme.textPrimary, fontFamily: TYPOGRAPHY.fonts.heading }}>
            {tt('Kaynaklar ve lisanslar')}
          </span>
        </button>
      </div>

      <div className="px-4 flex flex-col gap-4">
        <Card title={tt('Diyanet onayı')}>
          <Item
            name={onay.tarih ? `${tt('Onay tarihi ve sayısı')}: ${onay.tarih} · ${onay.sayi}` : tt('Onay süreci devam ediyor')}
            lines={[onay.not]}
          />
        </Card>

        <Card title={tt("Kur'an metni")}>
          <Item name={q.ad} lines={[`${q.saglayici} · ${q.lisans}`, q.not]} url={q.url} />
        </Card>

        <Card title={tt('Mealler')}>
          {Object.values(sources.translations).map((m) => (
            <Item key={m.key} name={m.ad} lines={[m.yayinci, `${tt('Kaynak')}: ${m.kaynak} · ${tt('Sürüm')}: ${m.surum}`]} url={m.url} />
          ))}
          <div>
            <p className="text-[12px] font-semibold mb-1" style={{ color: theme.textPrimary }}>{tt('Yeniden yayın şartları (QuranEnc.com)')}</p>
            <ul className="list-disc ps-5">
              {sources.quranEncSartlari.map((s, i) => (
                <li key={i} className="text-[12px] leading-relaxed" style={{ color: theme.textSecondary }}>{s}</li>
              ))}
            </ul>
          </div>
        </Card>

        <Card title={tt('Sesler')}>
          {sources.audio.map((a) => (
            <Item key={a.ad} name={a.ad} lines={[`${a.kari} · ${a.saglayici}`, a.not]} url={a.url} />
          ))}
          <Item name={sources.generatedAudio.ad} lines={[sources.generatedAudio.not]} />
        </Card>

        <Card title={tt('Diğer içerik')}>
          <Item name={sources.hadith.ad} lines={[sources.hadith.not]} />
          <Item name={sources.siyer.ad} lines={[sources.siyer.not]} />
          <Item name={sources.ai.ad} lines={[sources.ai.not]} />
        </Card>

        <Card title={tt('Görseller')}>
          {(sources.images || []).map((g) => (
            <Item key={g.ad} name={g.ad} lines={[`${g.saglayici} · ${g.lisans}`, g.not]} url={g.url} />
          ))}
        </Card>

        <Card title={tt('Yazı tipleri')}>
          {sources.fonts.map((f) => (
            <Item key={f.ad} name={f.ad} lines={[f.lisans]} url={f.url} />
          ))}
        </Card>

        <p className="text-[11px] text-center pb-4" style={{ color: theme.textSecondary }}>
          {tt('Bir kaynakta hata görürseniz lütfen bildirin.')} · {tt('Son güncelleme')}: {sources.guncelleme}
        </p>
      </div>
    </div>
  );
}
