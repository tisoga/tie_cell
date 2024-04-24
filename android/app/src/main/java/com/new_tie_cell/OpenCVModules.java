package com.new_tie_cell;
import android.content.Context;
import android.content.res.AssetManager;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.net.Uri;
import android.provider.DocumentsContract;
import android.provider.MediaStore;
import android.provider.OpenableColumns;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
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
import java.util.UUID;

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
        Context context = getReactApplicationContext();
        Map fileData = getFileData(context, Uri.parse(imageLocation));
        String dataPath = context.getFilesDir().getAbsolutePath() + "/tesseract";
        copyAssets(context, dataPath);
        WritableMap resultMap = new WritableNativeMap();
        TessBaseAPI tess = new TessBaseAPI();
        tess.init(dataPath, "eng+ind");
        Uri cacheFileLoc = copyFileToLocalStorage(context, Uri.parse(imageLocation), (String) fileData.get("FIELD_NAME"));
        Mat image = imagePreProcessing(cacheFileLoc.getPath());

        String bankName = getBankInvoiceType(image, tess, dataPath);
        Map<String, CoordinatesData> coordinatesMap = getCoordinate(bankName);
        resultMap.putString("bankName", bankName);

        for (Map.Entry<String, CoordinatesData> entry : coordinatesMap.entrySet()){
            String keyValue = entry.getKey();
            int[] coordinates = entry.getValue().coordinates;
            String[] ignoreKeyword = entry.getValue().ignoreKeyword;
            Rect rect = new Rect(coordinates[0], coordinates[1], coordinates[2], coordinates[3]);
            Mat roi = new Mat(image, rect);
            String textResult = textProcessing(tess, roi, dataPath);
            WritableArray cleanedTextList = cleanText(textResult, ignoreKeyword);
            resultMap.putArray(keyValue, cleanedTextList);
        }
        tess.recycle();
        File imageCache = new File(cacheFileLoc.getPath());
        imageCache.delete();
        promise.resolve(resultMap);
    }

    @ReactMethod
    public void getExtensionFile(String file_loc, Promise promise){
        Context context = getReactApplicationContext();
        Map fileData = getFileData(context, Uri.parse(file_loc));
        promise.resolve(fileData.get("FIELD_TYPE"));
    }

    public String getBankInvoiceType(Mat image, TessBaseAPI tess, String dataPath){
        int[] cordLocBank = new int[]{22, 69, 169, 50};
        Rect rect = new Rect(cordLocBank[0], cordLocBank[1], cordLocBank[2], cordLocBank[3]);
        Mat roi = new Mat(image, rect);
        String textResult = textProcessing(tess, roi, dataPath);
        String textClean = textResult.replace("\n", "").replace("\r", "").replace("«", "");
        Log.d("bankName", textClean);
        if(textClean.toLowerCase().contains("permatabank")){
            return "permata";
        }
        else{
            return "bri";
        }
    }

    private Map getCoordinate(String bank) {
        Map<String, CoordinatesData> coordinatesMap = new HashMap<>();
        if (bank == "permata") {
            coordinatesMap.put("transfer_type", new CoordinatesData(new int[]{19, 215, 454, 100}, new String[]{"transfer"}));
            coordinatesMap.put("amount", new CoordinatesData(new int[]{21, 328, 451, 103}, new String[]{"amount","jumlah"}));
            coordinatesMap.put("tujuan", new CoordinatesData(new int[]{21, 449, 449, 146}, new String[]{"to","ke"}));
            coordinatesMap.put("sumber", new CoordinatesData(new int[]{17, 610, 463, 147}, new String[]{"from", "dari"}));
            coordinatesMap.put("jenis_transaksi", new CoordinatesData(new int[]{19, 776, 456, 76}, new String[]{"transfer","type"}));
            coordinatesMap.put("ref_tgl", new CoordinatesData(new int[]{18, 960, 461, 162}, new String[]{"reference", "referensi"}));
        } else {
            coordinatesMap.put("tanggal_status", new CoordinatesData(new int[]{100, 152, 296, 83}, new String[]{"transaksi", "berhasil", "gagal"}));
            coordinatesMap.put("admin_nominal", new CoordinatesData(new int[]{30, 876, 437, 48}, new String[]{}));
            coordinatesMap.put("jenis_transaksi", new CoordinatesData(new int[]{32, 734, 437, 36}, new String[]{}));
            coordinatesMap.put("tujuan", new CoordinatesData(new int[]{113, 616, 343, 96}, new String[]{}));
            coordinatesMap.put("sumber", new CoordinatesData(new int[]{112, 473, 346, 96}, new String[]{"sumber", "dana"}));
            coordinatesMap.put("no_ref", new CoordinatesData(new int[]{30, 371, 437, 37}, new String[]{}));
            coordinatesMap.put("total", new CoordinatesData(new int[]{121, 270, 240, 99}, new String[]{"total", "transaksi"}));
            coordinatesMap.put("sumber_rek", new CoordinatesData(new int[]{107, 534, 181, 34}, new String[]{}));
        }
        return coordinatesMap;
    }

    private Uri copyFileToLocalStorage(Context context, Uri uri, String fileName){
        File dir = context.getCacheDir();
        dir = new File(dir, UUID.randomUUID().toString());
        try{
            boolean didCreateDir = dir.mkdir();
            if (!didCreateDir) {
                throw new IOException("failed to create directory at " + dir.getAbsolutePath());
            }
            File destFile = new File(dir, fileName);
            Uri copyPath = copyFile(context, uri, destFile);
            return copyPath;
        }
        catch (Exception e){
            e.printStackTrace();
            Log.d("errorLog", "desc", e);
            return uri;
        }
    }

    public static Map getFileData(Context context, Uri uri){
        Map<String, String> fileData = new HashMap<>();

        fileData.put("FIELD_TYPE", context.getContentResolver().getType(uri));
        try (Cursor cursor = context.getContentResolver().query(uri, null, null, null, null, null)) {
            if (cursor != null && cursor.moveToFirst()) {
                int displayNameIndex = cursor.getColumnIndex(OpenableColumns.DISPLAY_NAME);
                if (!cursor.isNull(displayNameIndex)) {
                    String fileName = cursor.getString(displayNameIndex);
                    fileData.put("FIELD_NAME", fileName);
                } else {
                    fileData.put("FIELD_NAME", null);
                }
                int mimeIndex = cursor.getColumnIndex(DocumentsContract.Document.COLUMN_MIME_TYPE);
                if (!cursor.isNull(mimeIndex)) {
                    fileData.put("FIELD_TYPE", cursor.getString(mimeIndex));
                }
                int sizeIndex = cursor.getColumnIndex(OpenableColumns.SIZE);
                if (cursor.isNull(sizeIndex)) {
                    fileData.put("FIELD_SIZE", "size");
                } else {
                    fileData.put("FIELD_SIZE", Long.toString(cursor.getLong(sizeIndex)));
                }
            }
        }
        return fileData;
    }

    public static Uri copyFile(Context context, Uri uri, File destFile) throws IOException {
        try(InputStream inputStream = context.getContentResolver().openInputStream(uri);
            FileOutputStream outputStream = new FileOutputStream(destFile)) {
            byte[] buf = new byte[8192];
            int len;
            while ((len = inputStream.read(buf)) > 0) {
                outputStream.write(buf, 0, len);
            }
            return Uri.fromFile(destFile);
        }
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

    private WritableArray cleanText(String resultText, String[] ignoreKeywords){
        Map<String, List<String>> result = new HashMap<>();
        WritableArray array = Arguments.createArray();

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
                array.pushString(line);
            }
        }
        return array;
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

    private void copyAssets(Context context, String dataPath){
        AssetManager am = context.getAssets();
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