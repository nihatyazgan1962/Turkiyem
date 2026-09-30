const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const androidDir = path.join(rootDir, 'android');
const appDir = path.join(androidDir, 'app');
const mainDir = path.join(appDir, 'src', 'main');
const javaDir = path.join(mainDir, 'java', 'com', 'turkiyem', 'app');
const resDir = path.join(mainDir, 'res');
const valuesDir = path.join(resDir, 'values');
const drawableDir = path.join(resDir, 'drawable');
const mipmapDir = path.join(resDir, 'mipmap');
const assetsDir = path.join(mainDir, 'assets');
const wrapperDir = path.join(androidDir, 'gradle', 'wrapper');

// Create all folders
[
  androidDir,
  appDir,
  mainDir,
  javaDir,
  valuesDir,
  drawableDir,
  mipmapDir,
  assetsDir,
  wrapperDir
].forEach(d => {
  if (!fs.existsSync(d)) {
    fs.mkdirSync(d, { recursive: true });
  }
});

// Copy web assets (index.html, style.css, data.js, app.js) to android assets
['index.html', 'style.css', 'data.js', 'app.js'].forEach(file => {
  const src = path.join(rootDir, file);
  const dest = path.join(assetsDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
  }
});

// Copy gradle wrapper if not already present
const localWrapperJar = path.join(wrapperDir, 'gradle-wrapper.jar');
if (!fs.existsSync(localWrapperJar)) {
  const saatVakitAndroid = 'C:\\Users\\Nihat\\Documents\\Gemini\\SAATVAKİT\\android';
  const wrapperJarSrc = path.join(saatVakitAndroid, 'gradle', 'wrapper', 'gradle-wrapper.jar');
  const gradlewSrc = path.join(saatVakitAndroid, 'gradlew');
  const gradlewBatSrc = path.join(saatVakitAndroid, 'gradlew.bat');

  if (fs.existsSync(wrapperJarSrc)) {
    fs.copyFileSync(wrapperJarSrc, localWrapperJar);
  }
  if (fs.existsSync(gradlewSrc) && !fs.existsSync(path.join(androidDir, 'gradlew'))) {
    fs.copyFileSync(gradlewSrc, path.join(androidDir, 'gradlew'));
  }
  if (fs.existsSync(gradlewBatSrc) && !fs.existsSync(path.join(androidDir, 'gradlew.bat'))) {
    fs.copyFileSync(gradlewBatSrc, path.join(androidDir, 'gradlew.bat'));
  }
}

// 1. gradle-wrapper.properties
fs.writeFileSync(path.join(wrapperDir, 'gradle-wrapper.properties'), `distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\\://services.gradle.org/distributions/gradle-8.14.3-all.zip
networkTimeout=10000
validateDistributionUrl=true
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
`, 'utf8');

// 2. settings.gradle
fs.writeFileSync(path.join(androidDir, 'settings.gradle'), `pluginManagement {
    repositories {
        google {
            content {
                includeGroupByRegex("com\\\\.android.*")
                includeGroupByRegex("com\\\\.google.*")
                includeGroupByRegex("androidx.*")
            }
        }
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}
rootProject.name = "Turkiyem"
include ':app'
`, 'utf8');

// 3. Root build.gradle
fs.writeFileSync(path.join(androidDir, 'build.gradle'), `buildscript {
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:8.13.0'
    }
}

allprojects {
    repositories {
        google()
        mavenCentral()
    }
}

task clean(type: Delete) {
    delete rootProject.buildDir
}
`, 'utf8');

// 4. app/build.gradle
fs.writeFileSync(path.join(appDir, 'build.gradle'), `plugins {
    id 'com.android.application'
}

android {
    namespace 'com.turkiyem.app'
    compileSdk 35

    defaultConfig {
        applicationId "com.turkiyem.app"
        minSdk 24
        targetSdk 35
        versionCode 1
        versionName "1.0.0"

        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
        debug {
            applicationIdSuffix ".debug"
            debuggable true
        }
    }
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_17
        targetCompatibility JavaVersion.VERSION_17
    }
}

dependencies {
    implementation 'androidx.appcompat:appcompat:1.7.0'
    implementation 'com.google.android.material:material:1.12.0'
    implementation 'androidx.webkit:webkit:1.12.1'
}
`, 'utf8');

// 5. AndroidManifest.xml
fs.writeFileSync(path.join(mainDir, 'AndroidManifest.xml'), `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:allowBackup="true"
        android:icon="@drawable/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@drawable/ic_launcher"
        android:supportsRtl="true"
        android:hardwareAccelerated="true"
        android:theme="@style/Theme.Turkiyem">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|screenSize|keyboardHidden|screenLayout"
            android:windowSoftInputMode="adjustResize"
            android:theme="@style/Theme.Turkiyem">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>
`, 'utf8');

// 6. strings.xml & colors.xml & themes.xml
fs.writeFileSync(path.join(valuesDir, 'strings.xml'), `<resources>
    <string name="app_name">TÜRKİYEM</string>
</resources>
`, 'utf8');

fs.writeFileSync(path.join(valuesDir, 'colors.xml'), `<resources>
    <color name="primary_red">#E30A17</color>
    <color name="primary_red_dark">#A5000B</color>
    <color name="dark_bg">#0C0D12</color>
    <color name="white">#FFFFFF</color>
</resources>
`, 'utf8');

fs.writeFileSync(path.join(valuesDir, 'themes.xml'), `<resources xmlns:tools="http://schemas.android.com/tools">
    <style name="Theme.Turkiyem" parent="Theme.MaterialComponents.DayNight.NoActionBar">
        <item name="colorPrimary">@color/primary_red</item>
        <item name="colorPrimaryVariant">@color/primary_red_dark</item>
        <item name="colorOnPrimary">@color/white</item>
        <item name="android:statusBarColor">@color/primary_red_dark</item>
        <item name="android:navigationBarColor">@color/dark_bg</item>
        <item name="android:windowBackground">@color/dark_bg</item>
    </style>
</resources>
`, 'utf8');

// 7. Icon XML (Vector Drawable)
fs.writeFileSync(path.join(drawableDir, 'ic_launcher.xml'), `<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp"
    android:height="108dp"
    android:viewportWidth="108"
    android:viewportHeight="108">
    <path
        android:fillColor="#E30A17"
        android:pathData="M0,0h108v108h-108z"/>
    <!-- Crescent Out -->
    <path
        android:fillColor="#FFFFFF"
        android:pathData="M44,54m-20,0a20,20 0,1 1,40 0a20,20 0,1 1,-40 0"/>
    <!-- Crescent In -->
    <path
        android:fillColor="#E30A17"
        android:pathData="M48,54m-16,0a16,16 0,1 1,32 0a16,16 0,1 1,-32 0"/>
    <!-- Star -->
    <path
        android:fillColor="#FFFFFF"
        android:pathData="M66,54 L61.5,50 L63.5,55.5 L59,52 L64,52 Z"/>
</vector>
`, 'utf8');

// 8. MainActivity.java
fs.writeFileSync(path.join(javaDir, 'MainActivity.java'), `package com.turkiyem.app;

import android.annotation.SuppressLint;
import android.content.res.Configuration;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.activity.OnBackPressedCallback;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {

    private WebView webView;

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

        // Hardware acceleration
        webView.setLayerType(View.LAYER_TYPE_HARDWARE, null);
        webView.setBackgroundColor(Color.parseColor("#0C0D12"));

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                return false;
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
                    webView.evaluateJavascript("if (document.getElementById('detailModal') && document.getElementById('detailModal').classList.contains('active')) { app.closeModal(); true; } else { false; }", value -> {
                        if (!"true".equals(value)) {
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
`, 'utf8');

console.log('Android projesi başarıyla hazırlandı!');
