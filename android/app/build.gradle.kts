import java.util.Properties
import java.io.FileInputStream

plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

// ── İMZALAMA ──────────────────────────────────────────────────
// Yayın imzası android/keystore.properties dosyasından okunur.
// Bu dosya .gitignore'dadır; ASLA depoya eklenmez.
// Şablon için keystore.properties.example dosyasına bakın.
val keystorePropertiesFile = rootProject.file("keystore.properties")
val keystoreProperties = Properties().apply {
    if (keystorePropertiesFile.exists()) load(FileInputStream(keystorePropertiesFile))
}
val hasSigning = keystoreProperties.getProperty("storeFile") != null

android {
    namespace = "com.islamapp"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.islamapp"
        minSdk = 24
        targetSdk = 35
        // Her Play yüklemesinde versionCode ARTMALIDIR.
        versionCode = 1
        versionName = "1.0.0"
        resourceConfigurations += listOf("tr", "en", "ar")
    }

    signingConfigs {
        if (hasSigning) {
            create("release") {
                storeFile = rootProject.file(keystoreProperties.getProperty("storeFile"))
                storePassword = keystoreProperties.getProperty("storePassword")
                keyAlias = keystoreProperties.getProperty("keyAlias")
                keyPassword = keystoreProperties.getProperty("keyPassword")
            }
        }
    }

    buildTypes {
        debug {
            isDebuggable = true
            applicationIdSuffix = ".debug"
        }
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            // keystore.properties varsa yayın imzasıyla, yoksa imzasız derlenir
            if (hasSigning) signingConfig = signingConfigs.getByName("release")
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }

    buildFeatures {
        viewBinding = true
    }

    // AAB dil bölmesi kapalı: dil seçimi uygulama içinde (app_lang) yapılır,
    // Play'in cihaz diline göre kaynak budaması istenmez.
    bundle {
        language {
            enableSplit = false
        }
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.appcompat:appcompat:1.6.1")
    implementation("com.google.android.material:material:1.11.0")
    implementation("androidx.constraintlayout:constraintlayout:2.1.4")
    implementation("androidx.swiperefreshlayout:swiperefreshlayout:1.1.0")
    implementation("androidx.webkit:webkit:1.10.0")
    implementation("androidx.core:core-splashscreen:1.0.1")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.7.0")
}
