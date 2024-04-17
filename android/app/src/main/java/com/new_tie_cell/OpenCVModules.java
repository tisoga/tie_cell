package com.new_tie_cell;
import android.content.res.AssetManager;
import android.graphics.Bitmap;
import android.util.Log;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.googlecode.tesseract.android.TessBaseAPI;

import org.opencv.android.Utils;
import org.opencv.core.Mat;
import org.opencv.core.Rect;
import org.opencv.core.Size;
import org.opencv.imgcodecs.Imgcodecs;
import org.opencv.imgproc.Imgproc;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

public class OpenCVModules extends ReactContextBaseJavaModule {
    OpenCVModules(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName(){
        return "OpenCVModule";
    }

    @ReactMethod
    public void processImage(String imageLocation, Promise promise){
        Map<String, CoordinatesData> coordinatesMap = new HashMap<>();
        WritableMap resultMap = new WritableNativeMap();
        coordinatesMap.put("tanggal_status", new CoordinatesData(new int[]{100,152,296,83}, new String[] {"transaksi","berhasil","gagal"}));
        coordinatesMap.put("admin_nominal", new CoordinatesData(new int[]{30, 876, 437, 48}, new String[] {}));
        coordinatesMap.put("jenis_transaksi", new CoordinatesData(new int[]{32, 734, 437, 36}, new String[] {}));
        coordinatesMap.put("tujuan", new CoordinatesData(new int[]{113, 616, 343, 96}, new String[] {}));
        coordinatesMap.put("sumber", new CoordinatesData(new int[]{112, 473, 346, 96}, new String[] {"sumber","dana"}));
        coordinatesMap.put("no_ref", new CoordinatesData(new int[]{30, 371, 437, 37}, new String[] {}));
        coordinatesMap.put("total", new CoordinatesData(new int[]{121, 270, 240, 99}, new String[] {"total", "transaksi"}));
        coordinatesMap.put("sumber_rek", new CoordinatesData(new int[]{107, 534, 181, 34}, new String[] {}));

        String dataPath = getReactApplicationContext().getFilesDir().getAbsolutePath() + "/tesseract";
        copyAssets(dataPath);
        Mat image = imagePreProcessing(imageLocation);
        TessBaseAPI tess = new TessBaseAPI();
        tess.init(dataPath, "eng");
        for (Map.Entry<String, CoordinatesData> entry : coordinatesMap.entrySet()){
            String keyValue = entry.getKey();
            int[] coordinates = entry.getValue().coordinates;
            String[] ignoreKeyword = entry.getValue().ignoreKeyword;
            Rect rect = new Rect(coordinates[0], coordinates[1], coordinates[2], coordinates[3]);
            Mat roi = new Mat(image, rect);
            String textResult = textProcessing(tess, roi, dataPath);
            List<String> cleanedTextList = cleanText(textResult, ignoreKeyword);
            resultMap.putString(keyValue, cleanedTextList.toString());
        }
        tess.recycle();
        promise.resolve(resultMap);
    }

    private Mat imagePreProcessing(String imageLocation){
        Mat image = Imgcodecs.imread(imageLocation);
        Imgproc.resize(image, image, new Size(500, (image.height() * 500) / image.width()));
        Imgproc.cvtColor(image, image, Imgproc.COLOR_BGR2GRAY);
        return image;
    }

    private String textProcessing(TessBaseAPI tess,Mat image, String dataPath){
        Bitmap bitmap = convertMatToBitmap(image);
        tess.setImage(bitmap);
        String extractedText = tess.getUTF8Text();
        return extractedText;
    }

    private Bitmap convertMatToBitmap(Mat mat){
        Bitmap bitmap = Bitmap.createBitmap(mat.cols(), mat.rows(), Bitmap.Config.ARGB_8888);
        Utils.matToBitmap(mat, bitmap);
        return bitmap;
    }

    private List<String> cleanText(String resultText, String[] ignoreKeywords){
        List<String> xz = new ArrayList<>();
        Map<String, List<String>> result = new HashMap<>();

        String[] lines = resultText.split("\n");
        for (String line : lines) {
            // Skip empty lines
            if (line.isEmpty()) {
                continue;
            }

            // Convert line to lowercase
            String lower = line.toLowerCase();

            // Calculate the count of ignore_keywords
            int count = 0;
            for (String keyword : ignoreKeywords) {
                count += countOccurrences(lower, keyword);
            }

            // If none of the ignore keywords are found, add the line to the list
            if (count == 0) {
                xz.add(line);
            }
        }
        return xz;
    }

    private int countOccurrences(String text, String keyword) {
        // This method calculates the number of occurrences of a keyword in a text
        int count = 0;
        int index = text.indexOf(keyword);
        while (index != -1) {
            count++;
            index = text.indexOf(keyword, index + 1);
        }
        return count;
    }

    class CoordinatesData {
        int[] coordinates;
        String[] ignoreKeyword;

        CoordinatesData(int[] coordinates, String[] ignoreKeyword){
            this.coordinates = coordinates;
            this.ignoreKeyword = ignoreKeyword;
        }
    }

    private void copyAssets(String dataPath){
        AssetManager am = getReactApplicationContext().getAssets();
        File tessdataDir = new File(dataPath, "tessdata");
        Log.d("tessdata", dataPath);
        if (!tessdataDir.exists()) {
            tessdataDir.mkdirs();
        }

        try {
            for (String assetName : am.list("")) {
                if (assetName.endsWith(".traineddata")) {
                    InputStream in = am.open("" + assetName);
                    File outFile = new File(tessdataDir, assetName);
                    OutputStream out = new FileOutputStream(outFile);
                    copyFile(in, out);
                    in.close();
                    out.flush();
                    out.close();
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void copyFile(InputStream in, OutputStream out) throws IOException {
        byte[] buffer = new byte[1024];
        int read;
        while ((read = in.read(buffer)) != -1) {
            out.write(buffer, 0, read);
        }
    }


}