import React from 'react';
import { Link } from 'react-router-dom';
import LegalShell, { Bolum, KAGIT } from './LegalShell';
import { APP_NAME, SUPPORT_EMAIL, PRIVACY_UPDATED } from '../../config/brand';

// 📜 GİZLİLİK POLİTİKASI ve KVKK AYDINLATMA METNİ
// Mağazalar (Google Play "Veri güvenliği", App Store "Gizlilik etiketi") bu sayfanın web adresini ister: /gizlilik
// Metin, kodun BUGÜN yaptığını anlatır. Yeni bir veri akışı eklenirse (analitik, reklam, yeni sunucu) bu sayfa da
// aynı değişiklikte güncellenmelidir; yoksa mağaza beyanı ile uygulama çelişir.
// Hukuki uygunluk için bir avukata okutulması önerilir.

const li = { margin: '4px 0' };
const tablo = { width: '100%', borderCollapse: 'collapse', fontSize: 14, margin: '8px 0' };
const td = { borderTop: `1px solid ${KAGIT.border}`, padding: '8px 6px', verticalAlign: 'top' };
const th = { ...td, textAlign: 'start', color: KAGIT.muted, fontWeight: 700, borderTop: 'none' };

export default function GizlilikPage() {
  const iletisim = SUPPORT_EMAIL
    ? <a href={`mailto:${SUPPORT_EMAIL}`} style={{ color: KAGIT.gold, fontWeight: 700 }}>{SUPPORT_EMAIL}</a>
    : <span>uygulama içindeki Ayarlar → Hesap ve gizlilik bölümü</span>;

  return (
    <LegalShell title="Gizlilik Politikası ve Aydınlatma Metni" testid="gizlilik-page">
      <p style={{ color: KAGIT.muted, fontSize: 14, margin: 0 }}>Yürürlük: {PRIVACY_UPDATED}</p>

      <div style={{ marginTop: 16, padding: 16, borderRadius: 18, background: KAGIT.card, border: `1px solid ${KAGIT.border}`, fontSize: 15.5, lineHeight: 1.65 }}>
        <strong>Kısaca:</strong> {APP_NAME} reklam göstermez, seni izlemez, verini satmaz. Misafir olarak kullanırsan hiçbir kişisel bilgin
        sunucumuza gelmez; her şey telefonunda kalır. Google ya da Apple ile girersen yalnız ilerlemeni yedeklemek için gereken bilgileri
        saklarız ve hesabını dilediğin an uygulamanın içinden silebilirsin.
      </div>

      <Bolum id="kim" title="1. Veri sorumlusu">
        <p>{APP_NAME} uygulaması ve <code>islamapp-5942a.web.app</code> web sürümü bu metnin konusudur. Sorularını ve taleplerini {iletisim} üzerinden iletebilirsin.</p>
      </Bolum>

      <Bolum id="hangi" title="2. Hangi bilgiler, nerede, neden?">
        <table style={tablo}>
          <thead><tr><th style={th}>Bilgi</th><th style={th}>Nerede tutulur</th><th style={th}>Neden</th></tr></thead>
          <tbody>
            <tr><td style={td}>Ad, e-posta, profil fotoğrafı adresi, hesap kimliği (yalnız Google/Apple ile girersen)</td><td style={td}>Google Firebase (Authentication, Firestore)</td><td style={td}>Seni tanımak, ilerlemeni cihazlar arasında korumak</td></tr>
            <tr><td style={td}>Puan, seviye, rozetler, son giriş zamanı</td><td style={td}>Firebase Firestore</td><td style={td}>Oyun ve ilerleme özellikleri</td></tr>
            <tr><td style={td}>Okuma geçmişi, yer imleri, hedefler</td><td style={td}>Firebase Firestore</td><td style={td}>Kaldığın yerden devam etmek</td></tr>
            <tr><td style={td}>Dönüş yolunun yedeği (gün, okunan bölümler)</td><td style={td}>Firebase Firestore</td><td style={td}>Telefon değişse de yolun kaybolmaması. <em>Emanet mektubun yedeklenmez, cihazdan çıkmaz.</em></td></tr>
            <tr><td style={td}>Tercihler, notlar, günlük, mektup, çocuk ilerlemesi, indirilen mealler</td><td style={td}>Yalnız telefonun</td><td style={td}>Uygulamanın çalışması; sunucuya gönderilmez</td></tr>
            <tr><td style={td}>Konum (izin verirsen)</td><td style={td}>Telefonun; vakit hesabı için yaklaşık konum AlAdhan servisine gider</td><td style={td}>Namaz vakitleri ve kıble yönü</td></tr>
            <tr><td style={td}>Yapay zekâ asistanına yazdığın sorular</td><td style={td}>Sunucumuz (Render) ve yapay zekâ hizmet sağlayıcıları</td><td style={td}>Cevap üretmek. Hesap kimliğin gönderilmez.</td></tr>
            <tr><td style={td}>"Bu cevabı bildir" ile gönderdiğin soru-cevap</td><td style={td}>Firebase Firestore</td><td style={td}>Hatalı ya da uygunsuz cevapları düzeltmek. Kimlik içermez.</td></tr>
            <tr><td style={td}>Kandil gecesi "ışık yak" sayacı</td><td style={td}>Firebase Firestore</td><td style={td}>İl başına anonim sayı; kimseyle eşleşmez</td></tr>
          </tbody>
        </table>
      </Bolum>

      <Bolum id="toplamayiz" title="3. Toplamadıklarımız">
        <ul style={{ paddingInlineStart: 22, margin: 0, listStyle: 'disc' }}>
          <li style={li}>Reklam kimliği, reklam ya da izleme (tracking) yazılımı yok.</li>
          <li style={li}>Üçüncü taraf analitik yok. Hata ve kullanım kaydı yalnız telefonunda tutulur; sen paylaşmadıkça bize gelmez.</li>
          <li style={li}>Rehber, fotoğraf, mikrofon kaydı toplanmaz. Sesli soru özelliği telefonunun kendi ses tanımasını kullanır.</li>
          <li style={li}>Ödeme bilgisi alınmaz; uygulama ücretsizdir.</li>
        </ul>
      </Bolum>

      <Bolum id="cocuk" title="4. Çocuklar">
        <p>Çocuk modu bir hesap açtırmaz. Çocuğun adı, simgesi, yıldızları ve ilerlemesi yalnız o telefonda saklanır, hiçbir sunucuya gönderilmez.
          Çocuk modunda reklam, sohbet, yapay zekâ asistanı ve yabancılarla iletişim yoktur. Çocuk bölümünden çıkış ve aile ayarları bir ebeveyn
          sorusuyla korunur. 13 yaşından küçükler hesapla giriş yapmamalıdır; hesabı ebeveyn açar ve yönetir.</p>
      </Bolum>

      <Bolum id="paylasim" title="5. Kimlerle paylaşılır, yurt dışına aktarım">
        <p>Verin satılmaz ve reklam amacıyla paylaşılmaz. Uygulamayı çalıştırmak için şu hizmet sağlayıcılar kullanılır:</p>
        <ul style={{ paddingInlineStart: 22, margin: 0, listStyle: 'disc' }}>
          <li style={li}><strong>Google Firebase</strong> (Google LLC): giriş, veritabanı, web barındırma.</li>
          <li style={li}><strong>Render</strong>: arama ve yapay zekâ asistanının sunucusu.</li>
          <li style={li}><strong>Yapay zekâ sağlayıcıları</strong> (ör. Google Gemini, Groq): yalnız asistana yazdığın metin.</li>
          <li style={li}><strong>İçerik servisleri</strong>: AlAdhan (vakitler), AlQuran Cloud ve Islamic Network (Kur'an metni ve tilavet), QuranEnc (mealler), Unsplash (görseller), Google Fonts (yazı tipleri).
            Bu servisler, her internet isteğinde olduğu gibi cihazının IP adresini görür.</li>
        </ul>
        <p>Bu sağlayıcıların sunucuları Türkiye dışında olabilir. Hesapla giriş yaptığında verilerin, 6698 sayılı KVKK'nın yurt dışına aktarım
          hükümlerine uygun olarak bu sağlayıcılarda işlenir. Misafir kullanımda kişisel veri aktarımı yapılmaz.</p>
      </Bolum>

      <Bolum id="hukuki" title="6. Hukuki sebep ve saklama süresi">
        <p>Hesapla girişte verilerin, seninle kurulan kullanım ilişkisinin ifası ve meşru menfaat (hizmetin güvenli çalışması) hukuki sebeplerine
          dayanarak işlenir. Hesabın açık kaldıkça saklanır; hesabını sildiğinde sunucudaki bütün verilerin derhal silinir. Yedekleme sistemlerindeki
          kopyalar sağlayıcının olağan döngüsünde (en geç 30 gün) kendiliğinden yok olur.</p>
      </Bolum>

      <Bolum id="haklar" title="7. Hakların">
        <p>KVKK'nın 11. maddesi ve GDPR uyarınca verilerinin işlenip işlenmediğini öğrenme, bilgi isteme, düzeltilmesini ya da silinmesini isteme,
          itiraz etme ve zararın giderilmesini talep etme hakların vardır. Taleplerini {iletisim} üzerinden iletebilirsin; en geç 30 gün içinde cevaplanır.</p>
      </Bolum>

      <Bolum id="silme" title="8. Hesabını ve verilerini silme">
        <p>Uygulamada <strong>Ayarlar → Hesap ve gizlilik → Hesabımı sil</strong> yolunu izle. Uygulamaya erişemiyorsan{' '}
          <Link to="/hesap-sil" style={{ color: KAGIT.gold, fontWeight: 700 }}>hesap silme sayfasından</Link> aynı işlemi web'de yapabilirsin.
          Silme geri alınamaz; profilin, puanın, geçmişin, yer imlerin, hedeflerin ve yol yedeğin silinir. Telefonundaki veriler için uygulamayı
          kaldırman ya da aynı ekrandaki "cihazdaki verileri de sil" seçeneği yeterlidir.</p>
      </Bolum>

      <Bolum id="guvenlik" title="9. Güvenlik">
        <p>Bağlantılar şifrelidir (HTTPS). Veritabanı kuralları, bir kullanıcının yalnız kendi verisine erişmesine izin verir.</p>
      </Bolum>

      <Bolum id="degisiklik" title="10. Değişiklikler">
        <p>Bu metin değişirse yürürlük tarihi güncellenir; önemli değişiklikleri uygulama içinde duyururuz.</p>
      </Bolum>
    </LegalShell>
  );
}
