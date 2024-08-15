import { useVideoPlayer, VideoView } from "expo-video";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, ToastAndroid, TouchableHighlight } from "react-native";
import { ApiResponse } from "../types/api";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

export default function VideoPlayer({ data }: { data: ApiResponse }) {
  const ref = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const player = useVideoPlayer(
    {
      uri: data.resolutions["Fast Download"],
      metadata: {
        title: data.title,
      },
    },
    (player) => {
      player.play();
    }
  );

  useEffect(() => {
    const subscription = player.addListener("playingChange", (isPlaying) => {
      setIsPlaying(isPlaying);
    });
    const statusListener = player.addListener(
      "statusChange",
      (data, _, error) => {
        if (error) {
          ToastAndroid.show("Failed to play this video.", ToastAndroid.SHORT);
        }
      }
    );

    return () => {
      subscription.remove();
      statusListener.remove();
      player.release();
    };
  }, [player]);

  return (
    <ThemedView style={styles.contentContainer}>
      <VideoView
        ref={ref}
        style={styles.video}
        player={player}
        allowsFullscreen
        allowsPictureInPicture={false}
        contentFit="cover"
      />
      {player.status !== "error" && (
        <ThemedView style={styles.controls}>
          <TouchableHighlight
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
            onPress={() => {
              player.seekBy(-10);
            }}
          >
            <ThemedText style={styles.btn1}>-10 Sec</ThemedText>
          </TouchableHighlight>
          <TouchableHighlight
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
            onPress={() => {
              player.seekBy(10);
            }}
          >
            <ThemedText style={styles.btn2}>+10 Sec</ThemedText>
          </TouchableHighlight>
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 10,
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  video: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  controls: {
    flexDirection: "row",
    marginTop: 20,
    marginBottom: 10,
    justifyContent: "space-between",
    width: "100%",
    gap: 2,
  },
  btn1: {
    borderColor: "gray",
    borderWidth: 1,
    borderRightWidth: 0,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    padding: 8,
    width: "100%",
    backgroundColor: "red",
    borderRadius: 6,
    textAlignVertical: "center",
  },
  btn2: {
    borderColor: "gray",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    padding: 8,
    width: "100%",
    backgroundColor: "red",
    borderRadius: 6,
    textAlignVertical: "center",
  },
});