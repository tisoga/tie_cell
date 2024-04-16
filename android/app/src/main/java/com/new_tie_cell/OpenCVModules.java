package com.new_tie_cell;
import android.util.Log;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

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
    public void processImage(){
        Map<String, CoordinatesData> coordinatesMap = new HashMap<>();
        coordinatesMap.put("tanggal_status", new CoordinatesData(new int[]{100,152,296,83}, new String[] {"transaksi","berhasil","gagal"}));
        coordinatesMap.put("admin_nominal", new CoordinatesData(new int[]{30, 876, 437, 48}, new String[] {}));
        coordinatesMap.put("jenis_transaksi", new CoordinatesData(new int[]{32, 734, 437, 36}, new String[] {}));
        coordinatesMap.put("tujuan", new CoordinatesData(new int[]{32, 734, 437, 36}, new String[] {}));
        coordinatesMap.put("sumber", new CoordinatesData(new int[]{112, 473, 346, 96}, new String[] {"sumber","dana"}));
        coordinatesMap.put("no_ref", new CoordinatesData(new int[]{30, 371, 437, 37}, new String[] {}));
        coordinatesMap.put("total", new CoordinatesData(new int[]{121, 270, 240, 99}, new String[] {"total", "transaksi"}));
        coordinatesMap.put("sumber_rek", new CoordinatesData(new int[]{107, 534, 181, 34}, new String[] {}));

        for (Map.Entry<String, CoordinatesData> entry : coordinatesMap.entrySet()){
            String keyValue = entry.getKey();
            int[] coordinates = entry.getValue().coordinates;
            String[] ignoreKeyword = entry.getValue().ignoreKeyword;
        }
    }

    class CoordinatesData {
        int[] coordinates;
        String[] ignoreKeyword;

        CoordinatesData(int[] coordinates, String[] ignoreKeyword){
            this.coordinates = coordinates;
            this.ignoreKeyword = ignoreKeyword;
        }
    }
}