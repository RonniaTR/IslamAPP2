# ProGuard kuralları - İslam App

# WebView için JavaScript arayüzünü koru
-keepclassmembers class com.islamapp.WebAppInterface {
    @android.webkit.JavascriptInterface <methods>;
}

# WebView sınıflarını koru
-keepclassmembers class * extends android.webkit.WebViewClient {
    public void *(android.webkit.WebView, java.lang.String, android.graphics.Bitmap);
    public boolean *(android.webkit.WebView, java.lang.String);
    public void *(android.webkit.WebView, java.lang.String);
}

-keepclassmembers class * extends android.webkit.WebChromeClient {
    public void *(android.webkit.WebView, int);
}

# AndroidX kütüphaneleri
-keep class androidx.** { *; }
-dontwarn androidx.**

# Material kütüphanesi
-keep class com.google.android.material.** { *; }
-dontwarn com.google.android.material.**

# Genel Android kuralları
-keepattributes *Annotation*
-keepattributes SourceFile,LineNumberTable
-keep public class * extends java.lang.Exception

# Enum değerlerini koru
-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}
