package com.yanz.tieCellPrint

import android.app.Application
import android.util.Log
import android.widget.Toast
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.load
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.react.flipper.ReactNativeFlipper
import com.facebook.soloader.SoLoader
import com.new_tie_cell.MyAppPackage
import org.opencv.android.OpenCVLoader

class MainApplication : Application(), ReactApplication {

  override val reactNativeHost: ReactNativeHost =
      object : DefaultReactNativeHost(this) {
          override fun getPackages(): List<ReactPackage> =
              PackageList(this).packages.apply {
                  // Packages that cannot be autolinked yet can be added manually here, for example:
                  // packages.add(new MyReactNativePackage());
                  add(MyAppPackage())
              }

        override fun getJSMainModuleName(): String = "index"

        override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

        override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
        override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
      }

  override val reactHost: ReactHost
    get() = getDefaultReactHost(this.applicationContext, reactNativeHost)

  override fun onCreate() {
    super.onCreate()
    SoLoader.init(this, false)
      if (OpenCVLoader.initLocal()) {
          Log.i("LOADED", "OpenCV loaded successfully");
      } else {
          Log.e("LOADED", "OpenCV initialization failed!");
          (Toast.makeText(this, "OpenCV initialization failed!", Toast.LENGTH_LONG)).show();
          return;
      }
      if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      // If you opted-in for the New Architecture, we load the native entry point for this app.
      load()
    }
    ReactNativeFlipper.initializeFlipper(this, reactNativeHost.reactInstanceManager)
  }
}
