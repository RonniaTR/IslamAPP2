package com.islamapp

import android.Manifest
import android.annotation.SuppressLint
import android.app.Activity
import android.content.ActivityNotFoundException
import android.content.Intent
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.net.ConnectivityManager
import android.net.Network
import android.net.NetworkCapabilities
import android.net.NetworkRequest
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.Environment
import android.provider.MediaStore
import android.view.KeyEvent
import android.view.View
import android.view.WindowInsetsController
import android.webkit.*
import android.widget.FrameLayout
import android.widget.ProgressBar
import android.widget.Toast
import androidx.activity.result.ActivityResultLauncher
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.core.content.FileProvider
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout
import java.io.File
import java.io.IOException
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private lateinit var progressBar: ProgressBar
    private lateinit var swipeRefresh: SwipeRefreshLayout
    private lateinit var errorContainer: FrameLayout
    private lateinit var errorWebView: WebView

    private var fileUploadCallback: ValueCallback<Array<Uri>>? = null
    private var cameraPhotoPath: String? = null

    private var customView: View? = null
    private var customViewCallback: WebChromeClient.CustomViewCallback? = null

    private val fileChooserLauncher: ActivityResultLauncher<Intent> =
        registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
            handleFileChooserResult(result.resultCode, result.data)
        }

    private val permissionLauncher: ActivityResultLauncher<Array<String>> =
        registerForActivityResult(ActivityResultContracts.RequestMultiplePermissions()) { permissions ->
            // İzinler alındıktan sonra gerekli işlemler
        }

    companion object {
        private const val HOME_URL = "file:///android_asset/index.html"
        private const val ERROR_URL = "file:///android_asset/error.html"
        private const val OFFLINE_URL = "file:///android_asset/offline.html"
    }

    // ─── Yaşam Döngüsü ──────────────────────────────────────────

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        initViews()
        setupSwipeRefresh()
        setupWebView()
        registerNetworkCallback()
        requestPermissions()

        if (savedInstanceState != null) {
            webView.restoreState(savedInstanceState)
        } else {
            loadApp()
        }
    }

    override fun onSaveInstanceState(outState: Bundle) {
        super.onSaveInstanceState(outState)
        webView.saveState(outState)
    }

    override fun onResume() {
        super.onResume()
        webView.onResume()
        applyImmersiveMode()
    }

    override fun onPause() {
        super.onPause()
        webView.onPause()
    }

    override fun onDestroy() {
        webView.destroy()
        super.onDestroy()
    }

    // ─── Görünüm Başlatma ────────────────────────────────────────

    private fun initViews() {
        webView = findViewById(R.id.webView)
        progressBar = findViewById(R.id.progressBar)
        swipeRefresh = findViewById(R.id.swipeRefresh)
        errorContainer = findViewById(R.id.errorContainer)
        errorWebView = findViewById(R.id.errorWebView)
    }

    private fun setupSwipeRefresh() {
        swipeRefresh.setColorSchemeResources(
            R.color.primary,
            R.color.primary_dark,
            R.color.accent
        )
        swipeRefresh.setOnRefreshListener {
            if (isNetworkAvailable()) {
                webView.reload()
            } else {
                showOfflinePage()
                swipeRefresh.isRefreshing = false
            }
        }
    }

    // ─── WebView Yapılandırması ──────────────────────────────────

    @SuppressLint("SetJavaScriptEnabled")
    private fun setupWebView() {
        webView.settings.apply {
            // Temel ayarlar
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = true
            allowFileAccess = true
            allowContentAccess = true

            // Önbellek ayarları
            cacheMode = WebSettings.LOAD_DEFAULT
            setSupportZoom(true)
            builtInZoomControls = true
            displayZoomControls = false

            // Medya ayarları
            mediaPlaybackRequiresUserGesture = false
            loadWithOverviewMode = true
            useWideViewPort = true

            // Metin ayarları
            textZoom = 100

            // Karışık içerik (HTTPS sayfada HTTP kaynaklar)
            mixedContentMode = WebSettings.MIXED_CONTENT_NEVER_ALLOW

            // Geolocation
            setGeolocationEnabled(true)
        }

        // JavaScript arayüzü ekle
        webView.addJavascriptInterface(WebAppInterface(this), "AndroidBridge")

        // WebViewClient ayarla
        webView.webViewClient = object : WebViewClient() {

            override fun onPageStarted(view: WebView?, url: String?, favicon: Bitmap?) {
                super.onPageStarted(view, url, favicon)
                progressBar.visibility = View.VISIBLE
                errorContainer.visibility = View.GONE
            }

            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                progressBar.visibility = View.GONE
                swipeRefresh.isRefreshing = false
            }

            override fun onReceivedError(
                view: WebView?,
                request: WebResourceRequest?,
                error: WebResourceError?
            ) {
                super.onReceivedError(view, request, error)
                // Sadece ana frame hatalarını ele al
                if (request?.isForMainFrame == true) {
                    showErrorPage()
                }
            }

            override fun shouldOverrideUrlLoading(
                view: WebView?,
                request: WebResourceRequest?
            ): Boolean {
                val url = request?.url?.toString() ?: return false

                // Dahili URL'ler WebView'da açılsın
                if (url.startsWith("file:///android_asset/") ||
                    url.startsWith("http://localhost") ||
                    url.startsWith("http://10.0.2.2")
                ) {
                    return false
                }

                // Tel, e-posta, harita vb. intent'leriyle aç
                if (url.startsWith("tel:") || url.startsWith("mailto:") ||
                    url.startsWith("geo:") || url.startsWith("sms:")
                ) {
                    try {
                        startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url)))
                    } catch (_: ActivityNotFoundException) {
                        Toast.makeText(
                            this@MainActivity,
                            "Bu bağlantıyı açacak uygulama bulunamadı",
                            Toast.LENGTH_SHORT
                        ).show()
                    }
                    return true
                }

                // Harici bağlantılar için kullanıcıya sor
                if (url.startsWith("http://") || url.startsWith("https://")) {
                    showExternalLinkDialog(url)
                    return true
                }

                return false
            }
        }

        // WebChromeClient ayarla
        webView.webChromeClient = object : WebChromeClient() {

            override fun onProgressChanged(view: WebView?, newProgress: Int) {
                progressBar.progress = newProgress
                if (newProgress == 100) {
                    progressBar.visibility = View.GONE
                }
            }

            override fun onShowFileChooser(
                webView: WebView?,
                filePathCallback: ValueCallback<Array<Uri>>?,
                fileChooserParams: FileChooserParams?
            ): Boolean {
                fileUploadCallback?.onReceiveValue(null)
                fileUploadCallback = filePathCallback
                openFileChooser(fileChooserParams)
                return true
            }

            // Tam ekran video desteği
            override fun onShowCustomView(view: View?, callback: CustomViewCallback?) {
                customView?.let {
                    callback?.onCustomViewHidden()
                    return
                }
                customView = view
                customViewCallback = callback
                errorContainer.addView(view)
                errorContainer.visibility = View.VISIBLE
                webView.visibility = View.GONE
            }

            override fun onHideCustomView() {
                customView?.let {
                    errorContainer.removeView(it)
                    customView = null
                    customViewCallback?.onCustomViewHidden()
                    customViewCallback = null
                    errorContainer.visibility = View.GONE
                    webView.visibility = View.VISIBLE
                }
            }

            override fun onGeolocationPermissionsShowPrompt(
                origin: String?,
                callback: GeolocationPermissions.Callback?
            ) {
                callback?.invoke(origin, true, false)
            }

            override fun onPermissionRequest(request: PermissionRequest?) {
                request?.grant(request.resources)
            }
        }

        // WebView hata ayıklama (sadece debug build)
        if (BuildConfig.DEBUG) {
            WebView.setWebContentsDebuggingEnabled(true)
        }
    }

    // ─── Uygulama Yükleme ────────────────────────────────────────

    private fun loadApp() {
        if (isNetworkAvailable() || isLocalAsset()) {
            webView.loadUrl(HOME_URL)
        } else {
            showOfflinePage()
        }
    }

    private fun isLocalAsset(): Boolean {
        return try {
            assets.open("index.html").close()
            true
        } catch (_: IOException) {
            false
        }
    }

    // ─── Hata ve Çevrimdışı Sayfaları ────────────────────────────

    private fun showErrorPage() {
        runOnUiThread {
            errorContainer.visibility = View.VISIBLE
            errorWebView.settings.javaScriptEnabled = true
            errorWebView.loadUrl(ERROR_URL)
            errorWebView.webViewClient = object : WebViewClient() {
                override fun shouldOverrideUrlLoading(
                    view: WebView?,
                    request: WebResourceRequest?
                ): Boolean {
                    val url = request?.url?.toString()
                    if (url == "app://retry") {
                        hideErrorPage()
                        loadApp()
                        return true
                    }
                    return false
                }
            }
        }
    }

    private fun showOfflinePage() {
        runOnUiThread {
            errorContainer.visibility = View.VISIBLE
            errorWebView.settings.javaScriptEnabled = true
            errorWebView.loadUrl(OFFLINE_URL)
            errorWebView.webViewClient = object : WebViewClient() {
                override fun shouldOverrideUrlLoading(
                    view: WebView?,
                    request: WebResourceRequest?
                ): Boolean {
                    val url = request?.url?.toString()
                    if (url == "app://retry") {
                        hideErrorPage()
                        loadApp()
                        return true
                    }
                    return false
                }
            }
        }
    }

    private fun hideErrorPage() {
        errorContainer.visibility = View.GONE
    }

    // ─── Ağ Kontrolü ─────────────────────────────────────────────

    private fun isNetworkAvailable(): Boolean {
        val cm = getSystemService(CONNECTIVITY_SERVICE) as ConnectivityManager
        val network = cm.activeNetwork ?: return false
        val caps = cm.getNetworkCapabilities(network) ?: return false
        return caps.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
    }

    private fun registerNetworkCallback() {
        val cm = getSystemService(CONNECTIVITY_SERVICE) as ConnectivityManager
        val request = NetworkRequest.Builder()
            .addCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
            .build()

        cm.registerNetworkCallback(request, object : ConnectivityManager.NetworkCallback() {
            override fun onAvailable(network: Network) {
                runOnUiThread {
                    if (errorContainer.visibility == View.VISIBLE) {
                        hideErrorPage()
                        loadApp()
                    }
                }
            }

            override fun onLost(network: Network) {
                runOnUiThread {
                    if (!isLocalAsset()) {
                        showOfflinePage()
                    }
                }
            }
        })
    }

    // ─── Dosya Yükleme ───────────────────────────────────────────

    private fun openFileChooser(params: WebChromeClient.FileChooserParams?) {
        val acceptTypes = params?.acceptTypes ?: arrayOf("*/*")
        val isCapture = params?.isCaptureEnabled == true

        val intents = mutableListOf<Intent>()

        // Kamera intent'i
        if (acceptTypes.any { it.contains("image") } || isCapture) {
            val cameraIntent = createCameraIntent()
            if (cameraIntent != null) intents.add(cameraIntent)
        }

        // Dosya seçici
        val fileIntent = Intent(Intent.ACTION_GET_CONTENT).apply {
            addCategory(Intent.CATEGORY_OPENABLE)
            type = if (acceptTypes.isNotEmpty() && acceptTypes[0].isNotEmpty()) {
                acceptTypes[0]
            } else {
                "*/*"
            }
            if (acceptTypes.size > 1) {
                putExtra(Intent.EXTRA_MIME_TYPES, acceptTypes)
            }
        }

        val chooserIntent = Intent.createChooser(fileIntent, "Dosya Seç")
        if (intents.isNotEmpty()) {
            chooserIntent.putExtra(Intent.EXTRA_INITIAL_INTENTS, intents.toTypedArray())
        }

        fileChooserLauncher.launch(chooserIntent)
    }

    private fun createCameraIntent(): Intent? {
        return try {
            val photoFile = createImageFile()
            val photoUri = FileProvider.getUriForFile(
                this,
                "${applicationContext.packageName}.fileprovider",
                photoFile
            )
            cameraPhotoPath = photoUri.toString()
            Intent(MediaStore.ACTION_IMAGE_CAPTURE).apply {
                putExtra(MediaStore.EXTRA_OUTPUT, photoUri)
            }
        } catch (_: IOException) {
            null
        }
    }

    @Throws(IOException::class)
    private fun createImageFile(): File {
        val timeStamp = SimpleDateFormat("yyyyMMdd_HHmmss", Locale.getDefault()).format(Date())
        val storageDir = getExternalFilesDir(Environment.DIRECTORY_PICTURES)
        return File.createTempFile("IMG_${timeStamp}_", ".jpg", storageDir)
    }

    private fun handleFileChooserResult(resultCode: Int, data: Intent?) {
        if (resultCode != Activity.RESULT_OK) {
            fileUploadCallback?.onReceiveValue(null)
            fileUploadCallback = null
            return
        }

        val results: Array<Uri>? = when {
            data?.dataString != null -> arrayOf(Uri.parse(data.dataString))
            cameraPhotoPath != null -> arrayOf(Uri.parse(cameraPhotoPath))
            else -> null
        }

        fileUploadCallback?.onReceiveValue(results)
        fileUploadCallback = null
        cameraPhotoPath = null
    }

    // ─── İzin Yönetimi ───────────────────────────────────────────

    private fun requestPermissions() {
        val permissions = mutableListOf<String>()

        if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA)
            != PackageManager.PERMISSION_GRANTED
        ) {
            permissions.add(Manifest.permission.CAMERA)
        }

        if (ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO)
            != PackageManager.PERMISSION_GRANTED
        ) {
            permissions.add(Manifest.permission.RECORD_AUDIO)
        }

        if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION)
            != PackageManager.PERMISSION_GRANTED
        ) {
            permissions.add(Manifest.permission.ACCESS_FINE_LOCATION)
        }

        if (permissions.isNotEmpty()) {
            permissionLauncher.launch(permissions.toTypedArray())
        }
    }

    // ─── Harici Bağlantı Diyaloğu ───────────────────────────────

    private fun showExternalLinkDialog(url: String) {
        AlertDialog.Builder(this, R.style.AlertDialogTheme)
            .setTitle("Harici Bağlantı")
            .setMessage("Bu bağlantı tarayıcıda açılacaktır. Devam etmek istiyor musunuz?")
            .setPositiveButton("Aç") { _, _ ->
                startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url)))
            }
            .setNegativeButton("İptal", null)
            .show()
    }

    // ─── Tam Ekran Modu ──────────────────────────────────────────

    private fun applyImmersiveMode() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            window.insetsController?.apply {
                systemBarsBehavior =
                    WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
            }
        }
    }

    // ─── Geri Tuşu Yönetimi ─────────────────────────────────────

    override fun onKeyDown(keyCode: Int, event: KeyEvent?): Boolean {
        if (keyCode == KeyEvent.KEYCODE_BACK) {
            // Tam ekran video oynatılıyorsa kapat
            if (customView != null) {
                webView.webChromeClient?.onHideCustomView()
                return true
            }
            // Hata sayfası gösteriliyorsa gizle
            if (errorContainer.visibility == View.VISIBLE) {
                hideErrorPage()
                return true
            }
            // WebView geri gidebiliyorsa geri git
            if (webView.canGoBack()) {
                webView.goBack()
                return true
            }
        }
        return super.onKeyDown(keyCode, event)
    }
}
