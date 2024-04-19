import { NativeModules } from "react-native";

const { OpenCVModule } = NativeModules;

const processImage = async (uri: string) => {
    const res = await OpenCVModule.processImage(uri);
    return res;
};

const getExtensionFile = async (fileLoc: string): Promise<"image" | "pdf"> => {
    const res = await OpenCVModule.getExtensionFile(fileLoc);
    if (res?.toLowerCase().includes("image")) {
        return 'image'
    }
    else {
        return "pdf"
    }
};

const OpenCV = {
    processImage,
    getExtensionFile
}

export default OpenCV