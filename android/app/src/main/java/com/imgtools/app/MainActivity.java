package com.imgtools.app;

import android.os.Bundle;
import android.webkit.DownloadListener;
import android.webkit.WebView;
import android.os.Environment;
import android.util.Base64;
import android.widget.Toast;
import java.io.File;
import java.io.FileOutputStream;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        WebView webView = this.getBridge().getWebView();
        if (webView != null) {
            webView.setDownloadListener(new DownloadListener() {
                @Override
                public void onDownloadStart(String url, String userAgent, String contentDisposition, String mimetype, long contentLength) {
                    try {
                        if (url.startsWith("data:image")) {
                            String[] parts = url.split(",");
                            if (parts.length > 1) {
                                byte[] imageBytes = Base64.decode(parts[1], Base64.DEFAULT);
                                File path = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS);
                                String fileName = "imgtools_" + System.currentTimeMillis() + ".png";
                                File file = new File(path, fileName);
                                FileOutputStream os = new FileOutputStream(file);
                                os.write(imageBytes);
                                os.flush();
                                os.close();
                                Toast.makeText(getApplicationContext(), "Saved to Downloads: " + fileName, Toast.LENGTH_LONG).show();
                            }
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                        Toast.makeText(getApplicationContext(), "Saved to Device!", Toast.LENGTH_SHORT).show();
                    }
                }
            });
        }
    }
}
