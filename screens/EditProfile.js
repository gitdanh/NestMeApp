import React, { useEffect, useRef, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import {
  Dimensions,
  Text,
  TextInput,
  View,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  Modal,
  SafeAreaView,
  ScrollView,
  FlatList,
  StatusBar,
} from "react-native";
import IconMaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { container, form } from "../styles/authStyle";
import PrimaryButton from "../components/button/PrimaryButton";
import { useSelector, useDispatch } from "react-redux";
import { getAvatarSource } from "../utils/getImageSource";
import IconMaterial from "react-native-vector-icons/MaterialIcons";
import IconFeather from "react-native-vector-icons/Feather";
import AntDesign from "react-native-vector-icons/AntDesign";
import { Audio } from "expo-av";
import { Camera, CameraView } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { updateUserProfile } from "../services/userService";
import usePrivateHttpClient from "../axios/private-http-hook";
import { updateUserProfileFields } from "../store/redux/slices/authSlice";
import {
  getDownloadURL,
  ref,
  storage,
  uploadBytesResumable,
} from "../configs/firebase";

const WINDOW_HEIGHT = Dimensions.get("window").height;
const WINDOW_WIDTH = Dimensions.get("window").width;
const closeButtonSize = Math.floor(WINDOW_HEIGHT * 0.032);
const captureSize = Math.floor(WINDOW_HEIGHT * 0.09);

export default function EditProfile(props) {
  const { privateRequest } = usePrivateHttpClient();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.authenticate);

  const [avatar, setAvatar] = useState(user.avatar);
  const [fullname, setFullname] = useState(user.fullname);
  const [bio, setBio] = useState(user.bio);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraType, setCameraType] = useState("back");
  const [isPreview, setIsPreview] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isFlash, setIsFlash] = useState(false);
  const [isVideoRecording, setIsVideoRecording] = useState(false);
  const [type, setType] = useState(1);
  const [showGallery, setShowGallery] = useState(true);
  const [galleryItems, setGalleryItems] = useState([]);
  const [galleryScrollRef, setGalleryScrollRef] = useState(null);
  const [galleryPickedImage, setGalleryPickedImage] = useState(null);
  const cameraRef = useRef();
  const isFocused = useIsFocused();
  const [bioModified, setBioModified] = useState(false);
  const [uploadProfileImgLoading, setUploadProfileImgLoading] = useState(false);
  const [updateProfileLoading, setUpdateProfileLoading] = useState(false);

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
        setAvatar(source);
        setIsModalVisible(false);
        // props.navigation.navigate('Save', { source, imageSource: null, type })
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
      prevCameraType === "back" ? "front" : "back"
    );
  };
  const handleGoToSaveOnGalleryPick = async () => {
    let type = galleryPickedImage.mediaType == "video" ? 0 : 1;

    const loadedAsset = await MediaLibrary.getAssetInfoAsync(
      galleryPickedImage
    );
    let imageSource = null;
    if (type == 0) {
      imageSource = await generateThumbnail(galleryPickedImage.uri);
    }

    setAvatar(loadedAsset.localUri);
    setIsModalVisible(false);
    onFileSelect(loadedAsset.localUri);
    // props.navigation.navigate('Save', {
    //     source: loadedAsset.localUri,
    //     type,
    //     imageSource
    // })
  };

  const onFileSelect = async (image) => {
    setUploadProfileImgLoading(true);

    const name = Date.now() + Math.random();
    const storageRef = ref(storage, `images/${name}`);
    const response = await fetch(image);
    const blob = await response.blob();
    const uploadTask = uploadBytesResumable(storageRef, blob);

    const uploadPromise = new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          console.log(error);
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((url) => {
              console.log(url);
              resolve(url);
            })
            .catch((error) => {
              console.log(error);
              reject(error);
            });
        }
      );
    });

    try {
      const url = await uploadPromise;

      const urlString = url.toString();
      const respone = await updateUserProfile(
        { profile_picture: urlString },
        privateRequest
      );
      if (respone?.message !== null) {
        dispatch(updateUserProfileFields({ avatar: urlString }));
        setUploadProfileImgLoading(false);
      }
    } catch (err) {
      console.error(err);
      setUploadProfileImgLoading(false);
    }
  };

  const removePhoto = async () => {
    setUploadProfileImgLoading(true);
    try {
      const respone = await updateUserProfile(
        { profile_picture: "" },
        privateRequest
      );
      if (respone?.message !== null) {
        dispatch(updateUserProfileFields({ avatar: "" }));
        setUploadProfileImgLoading(false);
      }
    } catch (err) {
      console.error(err);
      setUploadProfileImgLoading(false);
    }
  };

  const updateBio = async () => {
    setUpdateProfileLoading(true);
    try {
      const respone = await updateUserProfile(
        { full_name: fullname, user_info: { bio: bio } },
        privateRequest
      );
      if (respone?.message !== null) {
        dispatch(updateUserProfileFields({ fullname: fullname, bio: bio }));
        setBioModified(false);
        setUpdateProfileLoading(false);
      }
    } catch (err) {
      console.error(err);
      setUpdateProfileLoading(false);
    }
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
          <IconFeather
            style={utils.margin15}
            name={"zap"}
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
        <TouchableOpacity disabled={!isCameraReady} onPress={switchCamera}>
          <IconFeather
            style={utils.margin15}
            name="rotate-cw"
            size={25}
            color="white"
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <View style={container.center}>
        <View style={container.formCenter}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior="position"
            keyboardVerticalOffset={-150}
          >
            <View style={{ flexDirection: "row" }}>
              <IconMaterialCommunityIcons
                color={"white"}
                size={30}
                name="keyboard-backspace"
                style={{ marginRight: 10 }}
                onPress={() => props.navigation.goBack()}
              />
              <Text style={{ fontSize: 24, fontWeight: "500", color: "white" }}>
                {" "}
                {user.username}
              </Text>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Image
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  margin: 10,
                }}
                source={getAvatarSource(avatar)}
              />
              <Text
                style={{ fontSize: 16, fontWeight: "500", color: "#0095f6" }}
                onPress={() => setIsModalVisible(true)}
              >
                Change your avatar
              </Text>
            </View>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "500",
                color: "white",
                padding: 10,
              }}
            >
              Full name
            </Text>
            <TextInput
              style={form.textInput}
              value={fullname}
              onChangeText={(val) => {
                setFullname(val);
                setBioModified(true);
              }}
            />
            <Text
              style={{
                fontSize: 16,
                fontWeight: "500",
                color: "white",
                padding: 10,
              }}
            >
              Bio
            </Text>
            <TextInput
              style={[
                form.textInput,
                { minHeight: 150, textAlignVertical: "top", marginBottom: 20 },
              ]}
              placeholder="Bio"
              multiline={true}
              placeholderTextColor="gray"
              value={bio}
              onChangeText={(val) => {
                setBio(val);
                setBioModified(true);
              }}
            />

            <PrimaryButton
              onPress={updateBio}
              isLoading={updateProfileLoading}
              disabled={!bioModified}
            >
              Confirm
            </PrimaryButton>
          </KeyboardAvoidingView>
        </View>
        <Modal
          visible={isModalVisible}
          onRequestClose={() => setIsModalVisible(false)}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "black",
              borderTopColor: "#262626",
              borderTopWidth: 5,
            }}
          >
            <View
              style={{
                paddingLeft: 20,
                paddingRight: 20,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "#262626",
                paddingTop: 10,
                paddingBottom: 15,
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
                  onPress={() => setIsModalVisible(false)}
                />
              </View>
              {showGallery && (
                <Text
                  style={{ fontSize: 16, fontWeight: "500", color: "#0095f6" }}
                  onPress={handleGoToSaveOnGalleryPick}
                >
                  Next
                </Text>
              )}
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 5,
                position: "absolute",
                zIndex: 2,
                bottom: 0,
              }}
            >
              <View
                style={{
                  width: "50%",
                  paddingTop: 15,
                  borderTopWidth: showGallery === true ? 1 : 0,
                  borderBlockColor: "white",
                }}
              >
                <TouchableOpacity
                  onPress={() => setShowGallery(true)}
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <IconMaterial color={"gray"} size={25} name="grid-on" />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  width: "50%",
                  paddingTop: 15,
                  borderTopWidth: showGallery === false ? 1 : 0,
                  borderBlockColor: "white",
                }}
              >
                <TouchableOpacity
                  onPress={() => setShowGallery(false)}
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <IconFeather color={"gray"} size={25} name="camera" />
                </TouchableOpacity>
              </View>
            </View>
            {hasPermission === null ? (
              <View />
            ) : hasPermission === false ? (
              <Text style={styles.text}>No access to camera</Text>
            ) : showGallery ? (
              <SafeAreaView style={{ flex: 1, marginBottom: 49 }}>
                <ScrollView
                  ref={(ref) => setGalleryScrollRef(ref)}
                  style={[container.container, { backgroundColor: "black" }]}
                >
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
                      flex: 1,
                      borderTopWidth: 1,
                      borderColor: "#262626",
                    }}
                  >
                    <FlatList
                      scrollEnabled={false}
                      numColumns={3}
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
                            galleryScrollRef.scrollTo({
                              x: 0,
                              y: 0,
                              animated: true,
                            });
                            setGalleryPickedImage(item);
                          }}
                        >
                          <Image
                            style={container.image}
                            source={{ uri: item.uri }}
                          />
                        </TouchableOpacity>
                      )}
                    />
                  </View>
                </ScrollView>
              </SafeAreaView>
            ) : (
              <View
                style={{
                  flex: 1,
                  flexDirection: "column",
                  backgroundColor: "black",
                }}
              >
                <View style={[{ aspectRatio: 1 / 1, height: WINDOW_WIDTH }]}>
                  {isFocused ? (
                    <CameraView
                      ref={cameraRef}
                      style={{ flex: 1 }}
                      facing={cameraType}
                      flash="auto"
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
            )}
          </View>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
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

const utils = StyleSheet.create({
  margin15: {
    margin: 15,
  },
});
