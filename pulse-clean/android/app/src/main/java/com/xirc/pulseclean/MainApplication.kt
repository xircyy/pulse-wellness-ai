package com.xirc.pulseclean

import android.app.Application
import android.content.res.Configuration
import android.media.Image
import java.nio.ByteBuffer
import kotlin.math.max

import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.ReactHost
import com.facebook.react.common.ReleaseLevel
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint

import expo.modules.ApplicationLifecycleDispatcher
import expo.modules.ExpoReactHostFactory

// THE CLAUDE FIX: Explicitly using the re-exported package path
import com.mrousavy.camera.frameprocessors.FrameProcessorPlugin
import com.mrousavy.camera.frameprocessors.FrameProcessorPluginRegistry
import com.mrousavy.camera.frameprocessors.VisionCameraProxy
import com.mrousavy.camera.frameprocessors.Frame 

class MainApplication : Application(), ReactApplication {

  override val reactHost: ReactHost by lazy {
    ExpoReactHostFactory.getDefaultReactHost(
      context = applicationContext,
      packageList = PackageList(this).packages.apply {}
    )
  }

  override fun onCreate() {
    super.onCreate()
    
    // Registering the plugin sitting right below this class
    FrameProcessorPluginRegistry.addFrameProcessorPlugin("getAverageRedness") { proxy, options -> 
        RednessPlugin(proxy, options) 
    }

    DefaultNewArchitectureEntryPoint.releaseLevel = try {
      ReleaseLevel.valueOf(BuildConfig.REACT_NATIVE_RELEASE_LEVEL.uppercase())
    } catch (e: IllegalArgumentException) {
      ReleaseLevel.STABLE
    }
    loadReactNative(this)
    ApplicationLifecycleDispatcher.onApplicationCreate(this)
  }

  override fun onConfigurationChanged(newConfig: Configuration) {
    super.onConfigurationChanged(newConfig)
    ApplicationLifecycleDispatcher.onConfigurationChanged(this, newConfig)
  }
}

// PLUGIN COMPONENT: Merged here to avoid Git/Sync Unresolved Reference errors
class RednessPlugin(proxy: VisionCameraProxy, options: Map<String, Any>?) : FrameProcessorPlugin() {
    
    // MATCHING V4 SIGNATURE: Matches (Frame, Map?, Any?) precisely
    override fun callback(frame: Frame, arguments: Map<String, Any>?): Any? {
        
        // SAFE IMAGE ACCESS: V4 internal wrapper check
        val image = frame.image ?: return 0.0
        val planes = image.planes
        if (planes.isEmpty()) return 0.0

        // HARDWARE SAFE PATH: Plane 0 (Y-Plane/Brightness) to prevent V-Plane crashes
        val yBuffer: ByteBuffer = planes[0].buffer
        val ySize = yBuffer.remaining()
        if (ySize == 0) return 0.0

        var totalBrightness: Long = 0
        var count = 0
        val step = max(1, ySize / 1000)

        var i = 0
        while (i < ySize) {
            // Unsigned byte handling
            totalBrightness += (yBuffer.get(i).toInt() and 0xFF).toLong()
            count++
            i += step
        }

        if (count == 0) return 0.0
        return totalBrightness.toDouble() / count
    }
}