package com.turkiyem.app;

import android.annotation.SuppressLint;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.Intent;
import android.content.res.Configuration;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;
import androidx.activity.OnBackPressedCallback;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {

    private WebView webView;

    public class WebAppInterface {
        @JavascriptInterface
        public void openMap(String query) {
            runOnUiThread(() -> {
                try {
                    String mapUrl = "https://www.google.com/maps/search/?api=1&query=" + Uri.encode(query);
                    Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(mapUrl));
                    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    startActivity(intent);
                } catch (Exception e) {
                    try {
                        Intent geoIntent = new Intent(Intent.ACTION_VIEW, Uri.parse("geo:0,0?q=" + Uri.encode(query)));
                        geoIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                        startActivity(geoIntent);
                    } catch (Exception ex) {
                        Toast.makeText(MainActivity.this, "Harita uygulaması açılamadı.", Toast.LENGTH_SHORT).show();
                    }
                }
            });
        }

        @JavascriptInterface
        public void searchWeb(String query) {
            runOnUiThread(() -> {
                try {
                    String searchUrl = "https://www.google.com/search?q=" + Uri.encode(query);
                    Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(searchUrl));
                    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    startActivity(intent);
                } catch (Exception e) {
                    Toast.makeText(MainActivity.this, "Arama sayfası açılamadı.", Toast.LENGTH_SHORT).show();
                }
            });
        }

        @JavascriptInterface
        public void copyText(String text) {
            runOnUiThread(() -> {
                try {
                    ClipboardManager clipboard = (ClipboardManager) getSystemService(Context.CLIPBOARD_SERVICE);
                    ClipData clip = ClipData.newPlainText("Köy Bilgisi", text);
                    if (clipboard != null) {
                        clipboard.setPrimaryClip(clip);
                        Toast.makeText(MainActivity.this, "Köy bilgileri panoya kopyalandı!", Toast.LENGTH_SHORT).show();
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            });
        }
    }

    @Override
    @SuppressLint("SetJavaScriptEnabled")
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Status bar & navigation bar styling
        Window window = getWindow();
        window.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
        window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
        window.setStatusBarColor(Color.parseColor("#A5000B"));
        window.setNavigationBarColor(Color.parseColor("#0C0D12"));

        webView = new WebView(this);
        setContentView(webView);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setLoadsImagesAutomatically(true);
        settings.setLoadWithOverviewMode(true);
        settings.setUseWideViewPort(true);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);

        webView.setLayerType(View.LAYER_TYPE_HARDWARE, null);
        webView.setBackgroundColor(Color.parseColor("#0C0D12"));

        // JavaScript Native Interface
        webView.addJavascriptInterface(new WebAppInterface(), "Android");

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                String url = request.getUrl().toString();
                if (url.startsWith("file:///android_asset/")) {
                    return false;
                }
                try {
                    Intent intent = new Intent(Intent.ACTION_VIEW, android.net.Uri.parse(url));
                    startActivity(intent);
                } catch (Exception e) {
                    e.printStackTrace();
                }
                return true;
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                if (url.startsWith("file:///android_asset/")) {
                    return false;
                }
                try {
                    Intent intent = new Intent(Intent.ACTION_VIEW, android.net.Uri.parse(url));
                    startActivity(intent);
                } catch (Exception e) {
                    e.printStackTrace();
                }
                return true;
            }
        });

        webView.setWebChromeClient(new WebChromeClient());

        // Load Turkish Republic offline assets
        webView.loadUrl("file:///android_asset/index.html");

        // Back button handler
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                if (webView.canGoBack()) {
                    webView.goBack();
                } else {
                    // Try closing open modal in JavaScript first
                    webView.evaluateJavascript("if (document.getElementById('detailModal') && document.getElementById('detailModal').classList.contains('active')) { app.closeDetailModal(); 'true'; } else if (document.getElementById('settingsModal') && document.getElementById('settingsModal').classList.contains('active')) { app.closeSettings(); 'true'; } else { 'false'; }", value -> {
                        if (!"\"true\"".equals(value) && !"true".equals(value)) {
                            setEnabled(false);
                            getOnBackPressedDispatcher().onBackPressed();
                        }
                    });
                }
            }
        });
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (webView != null) webView.onResume();
    }

    @Override
    protected void onPause() {
        super.onPause();
        if (webView != null) webView.onPause();
    }

    @Override
    protected void onDestroy() {
        if (webView != null) webView.destroy();
        super.onDestroy();
    }
}
