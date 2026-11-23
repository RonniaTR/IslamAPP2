import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CloudRain, Wind, UserRound, Flame, Undo2, Sun, BatteryLow, HelpCircle, ArrowUpRight, BookOpen } from 'lucide-react';
import { localAyet } from '../../services/localRehber';

// 🧭 HÂL PUSULASI — "Kalbinden ne geçiyor?"
// Sohbetin girişinde sekiz köşeli yıldızın çevresine dizilmiş sekiz hâl. Birine dokununca:
//  · ortadaki mühür o hâlin rengine bürünür,
//  · altına o hâle uygun üç soru açılır (dokununca doğrudan sorulur),
//  · "Önce bir ayet" düğmesi cihazdaki meal paketinden, kaynağıyla tek ayet getirir (internetsiz, yapay zekâsız).
// Asistan hüküm vermez; sorular "kaynağıyla" ister ve ağır durumlarda bir insana yönlendirir.

const ZUMRUT = '#0F5C46';
const ALTIN = '#D8B76A';

export const HALLER = [
  { id: 'daral', ad: 'Daraldım', ara: 'daraldım', Icon: CloudRain, renk: '#4F6D8F',
    sorular: ['İçim daralıyor; Peygamberimizin sıkıntılı anlarda okuduğu dualar nelerdi? Kaynaklarıyla yazar mısın?', 'Sıkıntı anında Kur\'an hangi ayetlerle teselli eder? Sure ve ayet numarasıyla söyler misin?', 'Daraldığımda bugün yapabileceğim küçük, sahih bir amel önerir misin?'] },
  { id: 'kaygi', ad: 'Kaygılıyım', ara: 'kaygı', Icon: Wind, renk: '#5B7F77',
    sorular: ['Geleceğe dair kaygıyla tevekkül arasındaki dengeyi kaynaklarıyla anlatır mısın?', 'Kaygılı anlarda okunabilecek sahih dualar hangileri?', '"Deveni bağla, sonra tevekkül et" hadisinin kaynağı ve anlamı nedir?'] },
  { id: 'yalniz', ad: 'Yalnızım', ara: 'yalnız', Icon: UserRound, renk: '#6C5B8F',
    sorular: ['Yalnız hissettiğimde Allah\'ın yakınlığını anlatan ayetler hangileri?', 'Peygamberimizin yalnız kaldığı dönemlerden hangi örnekler var? Kaynaklarıyla anlatır mısın?', 'Yeni dostluklar kurmak için İslam\'ın tavsiyeleri neler?'] },
  { id: 'ofke', ad: 'Öfkeliyim', ara: 'öfke', Icon: Flame, renk: '#9A5B3E',
    sorular: ['Öfkelendiğimde sünnette tavsiye edilen davranışlar neler? Hadis kaynaklarıyla yazar mısın?', 'Öfkeyi yutmanın fazileti hakkında hangi ayet var?', 'Birine kırıldım; affetmek hakkında Kur\'an ne der?'] },
  { id: 'pisman', ad: 'Pişmanım', ara: 'pişman', Icon: Undo2, renk: '#7A6A3A',
    sorular: ['Tövbenin şartları nelerdir? Kaynaklarıyla açıklar mısın?', 'Allah\'ın rahmetinden ümit kesmemeyi anlatan ayet hangisi?', 'Birine hakkım geçtiyse helallik nasıl istenir?'] },
  { id: 'sukur', ad: 'Şükür doluyum', ara: 'şükür', Icon: Sun, renk: '#A9873C',
    sorular: ['Şükrün dille, kalple ve amelle nasıl yapıldığını kaynaklarıyla anlatır mısın?', 'Sevinçli bir haber aldığımda okunacak dua var mı?', '"Şükrederseniz artırırım" ayeti hangi surede geçiyor?'] },
  { id: 'yorgun', ad: 'Yorgunum', ara: 'yorul sabır', Icon: BatteryLow, renk: '#4A6E5A',
    sorular: ['Yorgunluk ve bıkkınlık anlarında sabırla ilgili ayetler hangileri?', 'Peygamberimizin dinlenmeye ve uykuya dair sünnetleri neler?', 'İbadette gevşediğimde yeniden başlamak için ne önerirsin?'] },
  { id: 'merak', ad: 'Merak ediyorum', ara: 'kalp huzur', Icon: HelpCircle, renk: '#2E6F8E',
    sorular: ['Bugün öğrenebileceğim kısa ve sahih bir hadis paylaşır mısın?', 'İlim öğrenmenin fazileti hakkında hangi ayet ve hadisler var?', 'Kur\'an\'da en çok tekrar edilen dua hangisi?'] },
];

/** Sekiz köşeli yıldız (iki kare). */
function Yildiz({ boyut, renk, dolgu = 'none', kalinlik = 1.4 }) {
  return (
    <svg width={boyut} height={boyut} viewBox="0 0 100 100" aria-hidden style={{ position: 'absolute', inset: 0, margin: 'auto' }}>
      <rect x="18" y="18" width="64" height="64" fill={dolgu} stroke={renk} strokeWidth={kalinlik} />
      <rect x="18" y="18" width="64" height="64" fill={dolgu} stroke={renk} strokeWidth={kalinlik} transform="rotate(45 50 50)" />
    </svg>
  );
}

export default function HalPusulasi({ onSor }) {
  const [secili, setSecili] = useState(null);
  const [ayet, setAyet] = useState(null);
  const [mesgul, setMesgul] = useState(false);
  const hal = HALLER.find((h) => h.id === secili);
  const R = 118; // yörünge yarıçapı

  const sec = (h) => { setSecili(secili === h.id ? null : h.id); setAyet(null); };
  const ayetGetir = async () => {
    if (!hal || mesgul) return;
    setMesgul(true);
    const r = await localAyet(hal.ara).catch(() => null);
    setMesgul(false);
    const list = r && r.results ? r.results : [];
    setAyet(list.length ? list[Math.floor(Math.random() * list.length)] : { yok: true });
  };

  return (
    <section data-testid="hal-pusulasi" aria-label="Kalbinden ne geçiyor?" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
      <div style={{ position: 'relative', width: 2 * R + 92, height: 2 * R + 64, maxWidth: '100%' }}>
        {/* yörünge */}
        <svg aria-hidden width="100%" height="100%" viewBox={`0 0 ${2 * R + 92} ${2 * R + 64}`} style={{ position: 'absolute', inset: 0 }}>
          <circle cx={R + 46} cy={R + 32} r={R} fill="none" stroke="rgba(216,183,106,0.22)" strokeDasharray="2 6" />
          <circle cx={R + 46} cy={R + 32} r={R - 48} fill="none" stroke="rgba(216,183,106,0.12)" />
          {hal && (() => {
            const i = HALLER.indexOf(hal); const a = (i / 8) * 2 * Math.PI - Math.PI / 2;
            return <motion.line key={hal.id} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.35 }}
              x1={R + 46} y1={R + 32} x2={R + 46 + Math.cos(a) * (R - 26)} y2={R + 32 + Math.sin(a) * (R - 26)} stroke={ALTIN} strokeWidth="1.2" strokeOpacity="0.7" />;
          })()}
        </svg>

        {/* orta mühür */}
        <motion.div
          animate={{ backgroundColor: hal ? hal.renk : ZUMRUT, rotate: hal ? 22.5 : 0 }}
          transition={{ type: 'spring', stiffness: 120, damping: 14 }}
          style={{ position: 'absolute', left: R + 46 - 58, top: R + 32 - 58, width: 116, height: 116, clipPath: 'polygon(50% 0%, 64% 15%, 85% 15%, 85% 36%, 100% 50%, 85% 64%, 85% 85%, 64% 85%, 50% 100%, 36% 85%, 15% 85%, 15% 64%, 0% 50%, 15% 36%, 15% 15%, 36% 15%)', boxShadow: '0 0 40px rgba(216,183,106,0.3)' }}
        />
        <Yildiz boyut={124} renk={ALTIN} kalinlik={1.2} />
        <div style={{ position: 'absolute', left: R + 46 - 50, top: R + 32 - 50, width: 100, height: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: '#FFF8E6', pointerEvents: 'none' }}>
          <AnimatePresence mode="wait">
            {hal ? (
              <motion.span key={hal.id} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <hal.Icon size={22} color={ALTIN} />
                <span style={{ fontFamily: '"Fraunces", serif', fontSize: 13, fontWeight: 700, lineHeight: 1.15 }}>{hal.ad}</span>
              </motion.span>
            ) : (
              <motion.span key="soru" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ fontFamily: '"Fraunces", serif', fontSize: 13.5, fontWeight: 700, lineHeight: 1.2 }}>
                Kalbinden<br />ne geçiyor?
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* sekiz hâl */}
        {HALLER.map((h, i) => {
          const a = (i / 8) * 2 * Math.PI - Math.PI / 2;
          const x = R + 46 + Math.cos(a) * R; const y = R + 32 + Math.sin(a) * R;
          const on = secili === h.id;
          return (
            <motion.button
              key={h.id}
              type="button"
              data-testid={`hal-${h.id}`}
              aria-pressed={on}
              onClick={() => sec(h)}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: secili && !on ? 0.55 : 1, scale: on ? 1.08 : 1 }}
              transition={{ delay: secili ? 0 : 0.05 * i, type: 'spring', stiffness: 200, damping: 16 }}
              whileTap={{ scale: 0.94 }}
              style={{ position: 'absolute', left: x - 44, top: y - 26, width: 88, height: 52, borderRadius: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, cursor: 'pointer',
                background: on ? h.renk : 'rgba(255,255,255,0.06)', border: `1px solid ${on ? ALTIN : 'rgba(255,255,255,0.12)'}`, color: '#FFF', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
            >
              <h.Icon size={17} strokeWidth={1.8} color={on ? '#FFF8E6' : ALTIN} aria-hidden />
              <span style={{ fontSize: 11.5, fontWeight: 600, lineHeight: 1.1 }}>{h.ad}</span>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {hal && (
          <motion.div key={hal.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }}
            style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {hal.sorular.map((q, i) => (
              <motion.button key={q} type="button" data-testid={`hal-soru-${i}`} onClick={() => onSor(q, hal)}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.06 * i }}
                style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '12px 14px', borderRadius: 16, textAlign: 'start', cursor: 'pointer',
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(216,183,106,0.25)', borderInlineStart: `3px solid ${hal.renk}`, color: '#FFF', fontSize: 13.5, lineHeight: 1.4 }}>
                <span style={{ flex: 1 }}>{q}</span>
                <ArrowUpRight size={16} color={ALTIN} aria-hidden style={{ flexShrink: 0 }} />
              </motion.button>
            ))}
            <button type="button" onClick={ayetGetir} disabled={mesgul}
              style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 999, border: `1px solid ${ALTIN}`, background: 'transparent', color: ALTIN, fontSize: 12.5, fontWeight: 700, cursor: 'pointer' }}>
              <BookOpen size={14} aria-hidden /> {mesgul ? 'Aranıyor…' : 'Önce bir ayet oku'}
            </button>
            {ayet && (
              <motion.article initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                style={{ background: '#FBF8F0', color: '#1A1A1A', borderRadius: 18, padding: '14px 16px', border: '1px solid #D9CDAE' }}>
                {ayet.yok ? (
                  <p style={{ margin: 0, fontSize: 13, color: '#5C4B2A' }}>Meal paketi henüz cihaza inmedi. İnternet varken bir kez Kur'an bölümünü açman yeterli.</p>
                ) : (<>
                  <p style={{ margin: 0, fontFamily: '"Literata", serif', fontSize: 15.5, lineHeight: 1.6 }}>{ayet.meal}</p>
                  <p style={{ margin: '8px 0 0', fontSize: 11.5, color: '#5C4B2A' }}>{ayet.ref}</p>
                </>)}
              </motion.article>
            )}
            <p style={{ margin: '2px 2px 0', fontSize: 11, color: 'rgba(255,255,255,0.5)', lineHeight: 1.45 }}>
              Asistan hüküm vermez, kaynak gösterir. İçinden çıkamadığın bir durumdaysan bir yakınınla, bir hocayla ya da bir uzmanla konuş.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
