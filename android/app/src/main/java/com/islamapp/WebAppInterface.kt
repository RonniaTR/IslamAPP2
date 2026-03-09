package com.islamapp

import android.content.Context
import android.webkit.JavascriptInterface
import android.widget.Toast

/**
 * JavaScript <-> Android köprüsü.
 * Web tarafından window.AndroidBridge.xxx() ile çağrılabilir.
 */
class WebAppInterface(private val context: Context) {

    /** Web tarafından Toast mesajı göster */
    @JavascriptInterface
    fun showToast(message: String) {
        Toast.makeText(context, message, Toast.LENGTH_SHORT).show()
    }

    /** Uygulama sürüm bilgisini döndür */
    @JavascriptInterface
    fun getAppVersion(): String {
        return try {
            val info = context.packageManager.getPackageInfo(context.packageName, 0)
            info.versionName ?: "1.0.0"
        } catch (_: Exception) {
            "1.0.0"
        }
    }

    /** Platform bilgisini döndür */
    @JavascriptInterface
    fun getPlatform(): String = "android"

    /** Cihaz bilgisini döndür */
    @JavascriptInterface
    fun getDeviceInfo(): String {
        return "${android.os.Build.MANUFACTURER} ${android.os.Build.MODEL}"
    }
}
