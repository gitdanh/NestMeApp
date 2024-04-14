import { Feather } from "@expo/vector-icons";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { Audio } from "expo-av";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import * as VideoThumbnails from "expo-video-thumbnails";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  SafeAreaView,
  StatusBar,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
const WINDOW_HEIGHT = Dimensions.get("window").height;
const WINDOW_WIDTH = Dimensions.get("window").width;
const closeButtonSize = Math.floor(WINDOW_HEIGHT * 0.032);
const captureSize = Math.floor(WINDOW_HEIGHT * 0.09);

export default function VideoScreen(props) {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [isPreview, setIsPreview] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isFlash, setIsFlash] = useState(false);
  const [isVideoRecording, setIsVideoRecording] = useState(false);
  const [type, setType] = useState(0);
  const [showGallery, setShowGallery] = useState(true);
  const [galleryItems, setGalleryItems] = useState([]);
  const [galleryPickedImage, setGalleryPickedImage] = useState(null);
  const [pickedImages, setPickedImages] = useState([]);
  const cameraRef = useRef();
  const isFocused = useIsFocused();

  useEffect(() => {
    (async () => {
      const cameraPermissions = await Camera.requestCameraPermissionsAsync();
      const galleryPermissions = await MediaLibrary.requestPermissionsAsync();

      const audioPermissions = await Audio.requestPermissionsAsync();

      if (
        cameraPermissions.status === "granted" &&
        audioPermissions.status === "granted" &&
        galleryPermissions.status === "granted"
      ) {
        const getPhotos = await MediaLibrary.getAssetsAsync({
          sortBy: ["creationTime"],
          mediaType: ["photo", "video"],
        });
        setGalleryItems(getPhotos);
        setGalleryPickedImage(getPhotos.assets[0]);
        setPickedImages([getPhotos.assets[0]]);
        setHasPermission(true);
      }
    })();
  }, []);
  const onCameraReady = () => {
    setIsCameraReady(true);
  };
  const takePicture = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.5, base64: true, skipProcessing: true };
      const data = await cameraRef.current.takePictureAsync(options);
      const source = data.uri;
      if (source) {
        props.navigation.navigate("Save", {
          source: [source],
          imageSource: null,
          type,
        });
      }
    }
  };
  const recordVideo = async () => {
    if (cameraRef.current) {
      try {
        const options = {
          maxDuration: 60,
          quality: Camera.Constants.VideoQuality["480p"],
        };

        const videoRecordPromise = cameraRef.current.recordAsync(options);
        if (videoRecordPromise) {
          setIsVideoRecording(true);
          const data = await videoRecordPromise;
          const source = data.uri;
          let imageSource = await generateThumbnail(source);
          props.navigation.navigate("Save", { source, imageSource, type });
        }
      } catch (error) {
        console.warn(error);
      }
    }
  };
  const generateThumbnail = async (source) => {
    try {
      const { uri } = await VideoThumbnails.getThumbnailAsync(source, {
        time: 5000,
      });
      return uri;
    } catch (e) {
      console.warn(e);
    }
  };

  const stopVideoRecording = async () => {
    if (cameraRef.current) {
      setIsVideoRecording(false);
      cameraRef.current.stopRecording();
    }
  };
  const switchCamera = () => {
    if (isPreview) {
      return;
    }
    setCameraType((prevCameraType) =>
      prevCameraType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };
  const handleGoToSaveOnGalleryPick = async () => {
    let loadedAssets = [];
    if (pickedImages.length > 0) {
      for (const pickedImage of pickedImages) {
        const loadedAsset = await MediaLibrary.getAssetInfoAsync(pickedImage);
        loadedAssets.push(loadedAsset.localUri);
      }
    } else {
      const loadedAsset = await MediaLibrary.getAssetInfoAsync(
        galleryPickedImage
      );
      loadedAssets.push(loadedAsset.localUri);
    }

    let type = galleryPickedImage.mediaType == "video" ? 0 : 1;
    let imageSource = null;
    if (type == 0) {
      imageSource = await generateThumbnail(galleryPickedImage.uri);
    }

    props.navigation.navigate("Save", {
      source: loadedAssets,
      type,
      imageSource,
    });
  };

  const renderCaptureControl = () => (
    <View>
      <View
        style={{
          justifyContent: "space-evenly",
          width: "100%",
          alignItems: "center",
          flexDirection: "row",
          backgroundColor: "black",
        }}
      >
        <TouchableOpacity
          disabled={!isCameraReady}
          onPress={() => setIsFlash(!isFlash)}
        >
          <Feather
            style={utils.margin15}
            name={"zap"}
            size={25}
            color="white"
          />
        </TouchableOpacity>
        <TouchableOpacity disabled={!isCameraReady} onPress={switchCamera}>
          <Feather
            style={utils.margin15}
            name="rotate-cw"
            size={25}
            color="white"
          />
        </TouchableOpacity>
        {type == 0 ? (
          <TouchableOpacity
            activeOpacity={0.7}
            disabled={!isCameraReady}
            onLongPress={recordVideo}
            onPressOut={stopVideoRecording}
            style={styles.capture}
          />
        ) : (
          <TouchableOpacity
            activeOpacity={0.7}
            disabled={!isCameraReady}
            onPress={takePicture}
            style={styles.capturePicture}
          />
        )}

        <TouchableOpacity
          disabled={!isCameraReady}
          onPress={() => (type == 1 ? setType(0) : setType(1))}
        >
          <Feather
            style={utils.margin15}
            name={type == 0 ? "camera" : "video"}
            size={25}
            color="white"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowGallery(true)}>
          <Feather
            style={utils.margin15}
            name={"image"}
            size={25}
            color="white"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text style={styles.text}>No access to camera</Text>;
  }

  if (showGallery) {
    return (
      <View style={[container.container, { backgroundColor: "black" }]}>
        <View
          style={{
            paddingLeft: 20,
            paddingRight: 20,
            marginBottom: 20,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <AntDesign
              color={"white"}
              size={27}
              name="close"
              onPress={() => props.navigation.navigate("Home")}
            />
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: "white",
                marginLeft: 15,
              }}
            >
              {" "}
              New Post
            </Text>
          </View>
          <Text
            style={{ fontSize: 16, fontWeight: "500", color: "#0095f6" }}
            onPress={() => handleGoToSaveOnGalleryPick()}
          >
            Next
          </Text>
        </View>
        <View style={[{ aspectRatio: 1 / 1, height: WINDOW_WIDTH }]}>
          <Image
            style={{ flex: 1 }}
            source={{ uri: galleryPickedImage.uri }}
            styles={[{ aspectRatio: 1 / 1, height: WINDOW_WIDTH }]}
            ratio={"1:1"}
          />
        </View>
        <View
          style={{
            justifyContent: "flex-end",
            alignItems: "center",
            marginRight: 20,
            marginVertical: 5,
            flexDirection: "row",
          }}
        >
          <TouchableOpacity
            style={{
              alignItems: "center",
              backgroundColor: "rgba(255, 255, 255, .2);",
              borderRadius: 50,
              borderWidth: 1,
              borderColor: "black",
            }}
            onPress={() => setShowGallery(false)}
          >
            <Feather
              style={{ padding: 10 }}
              name={"camera"}
              size={15}
              color="white"
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flex: 1,
            borderTopWidth: 1,
            borderColor: "#262626",
          }}
        >
          <FlatList
            numColumns={4}
            horizontal={false}
            data={galleryItems.assets}
            contentContainerStyle={{
              flexGrow: 1,
            }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  container.containerImage,
                  {
                    borderLeftWidth: 2,
                    borderRightWidth: 2,
                    borderTopWidth: 2,
                    borderColor: "black",
                  },
                ]}
                onPress={() => {
                  setGalleryPickedImage(item);
                  if (pickedImages.includes(item))
                    setPickedImages((prev) =>
                      prev.filter((image) => image !== item)
                    );
                  else setPickedImages((prev) => [...prev, item]);
                  console.log(pickedImages);
                }}
              >
                <Image style={container.image} source={{ uri: item.uri }} />
                {pickedImages.includes(item) && (
                  <View
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      top: 0,
                      right: 0,
                      backgroundColor: "rgba(4, 3, 3, 0.8)",
                      zIndex: 3,
                    }}
                  >
                    <AntDesign
                      style={{
                        position: "absolute",
                        padding: 10,
                        bottom: 0,
                        right: 0,
                      }}
                      name="checkcircleo"
                      size={20}
                      color="blue"
                    />
                  </View>
                )}
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    );
  }
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        backgroundColor: "black",
        paddingTop: StatusBar.currentHeight || 100,
      }}
    >
      <View style={{ marginLeft: 20, marginBottom: 20 }}>
        <AntDesign
          color={"white"}
          size={30}
          name="close"
          onPress={() => setShowGallery(true)}
        />
      </View>
      <View style={[{ aspectRatio: 1 / 1, height: WINDOW_WIDTH }]}>
        {isFocused ? (
          <Camera
            ref={cameraRef}
            style={{ flex: 1 }}
            type={cameraType}
            flashMode={
              isFlash
                ? Camera.Constants.FlashMode.torch
                : Camera.Constants.FlashMode.off
            }
            styles={[{ aspectRatio: 1 / 1, height: WINDOW_WIDTH }]}
            ratio={"1:1"}
            onCameraReady={onCameraReady}
          />
        ) : null}
      </View>

      <View
        style={[
          {
            flexDirection: "row",
            alignItems: "center",
            flex: 1,
          },
        ]}
      >
        <View>{renderCaptureControl()}</View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  text: {
    color: "#000000",
  },

  capture: {
    backgroundColor: "red",
    borderRadius: 5,
    height: captureSize,
    width: captureSize,
    borderRadius: Math.floor(captureSize / 2),
    marginHorizontal: 31,
  },
  capturePicture: {
    borderWidth: 6,
    borderColor: "gray",
    backgroundColor: "white",
    borderRadius: 5,
    height: captureSize,
    width: captureSize,
    borderRadius: Math.floor(captureSize / 2),
    marginHorizontal: 31,
  },
});

const container = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    //paddingTop: StatusBar.currentHeight || 100,
  },
  containerImage: {
    flex: 1 / 4,
  },
  image: {
    aspectRatio: 1 / 1,
  },
});
const utils = StyleSheet.create({
  margin15: {
    margin: 15,
  },
});
