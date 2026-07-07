# İslam App - Android WebView Projesi

## Proje Yapısı

```
android/
├── build.gradle.kts                    # Proje seviyesi Gradle yapılandırması
├── settings.gradle.kts                 # Modül ayarları
├── gradle.properties                   # Gradle özellikleri
├── gradlew / gradlew.bat              # Gradle wrapper
├── gradle/wrapper/
│   └── gradle-wrapper.properties       # Wrapper sürüm ayarı
└── app/
    ├── build.gradle.kts                # Uygulama Gradle yapılandırması
    ├── proguard-rules.pro              # ProGuard kuralları (release build)
    └── src/main/
        ├── AndroidManifest.xml         # Uygulama manifest dosyası
        ├── java/com/islamapp/
        │   ├── SplashActivity.kt       # Açılış ekranı
        │   ├── MainActivity.kt         # Ana WebView ekranı
        │   └── WebAppInterface.kt      # JS <-> Android köprüsü
        ├── assets/
        │   ├── error.html              # Hata sayfası
        │   ├── offline.html            # Çevrimdışı sayfası
        │   └── [web build dosyaları]   # ← Buraya web build'i kopyalanacak
        └── res/
            ├── layout/
            │   ├── activity_splash.xml # Splash ekranı layout'u
            │   └── activity_main.xml   # Ana ekran layout'u
            ├── drawable/               # Vektör ikonlar
            ├── mipmap-anydpi-v26/      # Adaptive ikon tanımları
            ├── values/                 # Renkler, stringler, temalar (açık mod)
            ├── values-night/           # Karanlık mod teması
            └── xml/
                └── file_paths.xml      # FileProvider yolları
```

---

## 1. Web Build Dosyalarını Yerleştirme

React projesini derleyip çıktıyı `assets` klasörüne kopyalayın:

```bash
# 1) Frontend klasörüne git
cd frontend

# 2) Bağımlılıkları yükle
npm install

# 3) Production build al
npm run build

# 4) Build çıktısını Android assets klasörüne kopyala
cp -r build/* ../android/app/src/main/assets/
```

> **ÖNEMLİ:** `assets` klasöründe `index.html` dosyası bulunmalıdır. 
> Uygulama `file:///android_asset/index.html` adresini yükler.

### API Bağlantısı Hakkında

Web uygulaması backend API'ye bağlanıyorsa, `api.js` dosyasındaki API URL'sini 
gerçek sunucu adresinize güncellemeniz gerekir. Yerel geliştirme için Android 
emülatörde `10.0.2.2` kullanabilirsiniz:

```javascript
// Emülatör için:
const API_URL = "http://10.0.2.2:5000";

// Gerçek sunucu için:
const API_URL = "https://api.siteniz.com";
```

---

## 2. Projeyi Android Studio'da Açma

1. **Android Studio**'yu açın (Arctic Fox veya üzeri sürüm)
2. **File → Open** menüsünden `android/` klasörünü seçin
3. Gradle sync işleminin tamamlanmasını bekleyin
4. SDK yöneticisinden **API 34** SDK'sının yüklü olduğundan emin olun

> İlk açılışta Gradle bağımlılıkları indirilir, bu biraz zaman alabilir.

---

## 3. Debug APK Oluşturma

### Android Studio üzerinden:
1. **Build → Build Bundle(s) / APK(s) → Build APK(s)** menüsüne tıklayın
2. APK dosyası şurada oluşur:
   ```
   android/app/build/outputs/apk/debug/app-debug.apk
   ```

### Komut satırından:
```bash
cd android
./gradlew assembleDebug
```

APK dosyası: `app/build/outputs/apk/debug/app-debug.apk`

---

## 4. Release APK Oluşturma

### Öncelikle bir keystore oluşturun:
```bash
keytool -genkey -v \
  -keystore islamapp-release.jks \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -alias islamapp
```

### Keystore bilgilerini tanımlayın:

`android/` klasöründe `local.properties` dosyasına ekleyin (git'e eklemeyin!):
```properties
RELEASE_STORE_FILE=../islamapp-release.jks
RELEASE_STORE_PASSWORD=şifreniz
RELEASE_KEY_ALIAS=islamapp
RELEASE_KEY_PASSWORD=şifreniz
```

### app/build.gradle.kts dosyasına signing config ekleyin:

`android { }` bloğunun içine:
```kotlin
signingConfigs {
    create("release") {
        val props = java.util.Properties()
        val localPropsFile = rootProject.file("local.properties")
        if (localPropsFile.exists()) {
            props.load(localPropsFile.inputStream())
            storeFile = file(props["RELEASE_STORE_FILE"] as String)
            storePassword = props["RELEASE_STORE_PASSWORD"] as String
            keyAlias = props["RELEASE_KEY_ALIAS"] as String
            keyPassword = props["RELEASE_KEY_PASSWORD"] as String
        }
    }
}
```

`buildTypes` içindeki `release` bloğuna ekleyin:
```kotlin
signingConfig = signingConfigs.getByName("release")
```

### Release APK oluşturun:
```bash
cd android
./gradlew assembleRelease
```

APK dosyası: `app/build/outputs/apk/release/app-release.apk`

---

## 5. İmzalı APK Oluşturma (Android Studio)

1. **Build → Generate Signed Bundle / APK** menüsüne tıklayın
2. **APK** seçeneğini seçin, **Next** tıklayın
3. Keystore bilgilerini girin:
   - **Key store path:** Oluşturduğunuz `.jks` dosyasının yolu
   - **Key store password:** Keystore şifreniz
   - **Key alias:** `islamapp`
   - **Key password:** Anahtar şifreniz
4. **Next** tıklayın
5. Build type olarak **release** seçin
6. **Finish** tıklayın

> Google Play Store'a yüklemek için **Android App Bundle (.aab)** 
> formatını tercih edin.

---

## 6. APK'yı Telefona Yükleme

### USB ile:
```bash
# Cihazın bağlı olduğundan emin olun
adb devices

# Debug APK yükle
adb install app/build/outputs/apk/debug/app-debug.apk

# Release APK yükle
adb install app/build/outputs/apk/release/app-release.apk
```

### Dosya transferi ile:
1. APK dosyasını telefona kopyalayın (USB, e-posta, bulut depolama vb.)
2. Telefonda **Ayarlar → Güvenlik → Bilinmeyen kaynaklara izin ver** seçeneğini açın
3. Dosya yöneticisinde APK'yı bulun ve yükleyin

### Android Studio'dan doğrudan:
1. USB ile telefonu bağlayın
2. Telefonda **Geliştirici seçenekleri → USB hata ayıklama** açın
3. Android Studio'da **Run → Run 'app'** tıklayın veya ▶ (Play) butonuna basın

---

## Uygulama Özellikleri

| Özellik | Durum |
|---------|-------|
| JavaScript desteği | ✅ |
| DOM/Local Storage | ✅ |
| Dosya yükleme | ✅ |
| Kamera desteği | ✅ |
| Mikrofon desteği | ✅ |
| Konum desteği | ✅ |
| Splash ekranı | ✅ |
| İlerleme çubuğu | ✅ |
| Çevrimdışı algılama | ✅ |
| Hata sayfası | ✅ |
| Çekip yenileme | ✅ |
| Karanlık mod | ✅ |
| Geri tuşu navigasyonu | ✅ |
| Tam ekran video | ✅ |
| Harici bağlantı diyaloğu | ✅ |
| Donanım hızlandırma | ✅ |
| WebView önbelleği | ✅ |
| ProGuard (release) | ✅ |
| Ekran döndürme desteği | ✅ |
| Debug WebView | ✅ (debug build) |

---

## Gereksinimler

- **Android Studio** Hedgehog (2023.1+) veya üzeri
- **JDK 17** veya üzeri
- **Android SDK 34**
- **Kotlin 1.9+**
- **Gradle 8.4+**
