import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import VideoPlayer from "@/components/VideoPlayer";
import { checkUrlPatterns, replaceNetlocWithNewDomain } from "@/helper/utils";
import { ApiResponse } from "@/types/api";
import * as Linking from "expo-linking";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
} from "react-native";
export interface ApiResponseTypes {
  response: ApiResponse[];
}

const Page = () => {
  const [text, setText] = useState("");
  const inputRef = useRef<TextInput>(null);
  const [data, setData] = useState<ApiResponse | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const clearText = () => {
    setText("");
    if (inputRef && inputRef.current) {
      inputRef.current.clear();
    }
    if (data) {
      setData(null);
    }
  };

  const submit = async (text: string) => {
    const check = checkUrlPatterns(text);
    if (!check) return ToastAndroid.show("Invalid URI.", ToastAndroid.SHORT);
    setIsFetching(true);
    const url = replaceNetlocWithNewDomain(text);
    const req = await fetch(
      "https://ytshorts.savetube.me/api/v1/terabox-downloader",
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:129.0) Gecko/20100101 Firefox/129.0",
          Accept: "application/json, text/plain, */*",
          "Accept-Language": "en-US,en;q=0.5",
          "Content-Type": "application/json",
          "Sec-Fetch-Dest": "empty",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Site": "same-origin",
          Priority: "u=0",
        },
        body: JSON.stringify({ url: url }),
        method: "POST",
      }
    );

    setIsFetching(false);
    if (!req.ok) {
      ToastAndroid.show("Failed to fetch data", ToastAndroid.SHORT);
      return;
    }
    const res: ApiResponseTypes = await req.json();
    setData(res.response[0]);
  };

  const getInitUrl = useCallback(() => {
    const func = async () => {
      const data = await Linking.getInitialURL();
      const check = checkUrlPatterns(text);
      if (!check || !data || data.length < 0) return;
      setText(data);
      submit(data);
    };
    func();
  }, []);

  useEffect(() => {
    const handleUrl = ({ url }: { url: string }) => {
      setText(url);
      submit(url);
    };

    Linking.addEventListener("url", handleUrl);
  }, []);

  useEffect(() => {
    getInitUrl();
  }, []);

  return (
    // <SafeAreaView style={{ flex: 1 }}>
    <ThemedView style={{ flex: 1 }}>
      <StatusBar backgroundColor={"black"} />
      <ThemedText
        style={{
          fontSize: 18,
          textAlign: "center",
          paddingVertical: 10,
          borderBottomColor: "white",
          borderBottomWidth: StyleSheet.hairlineWidth,
          fontWeight: "500",
        }}
      >
        Terabox Player
      </ThemedText>
      <ThemedView style={{ flex: 1, paddingHorizontal: 10 }}>
        <ThemedView style={styles.container}>
          <TextInput
            style={styles.input}
            ref={inputRef}
            value={text}
            onChangeText={setText}
            placeholder="Enter your text here"
            placeholderTextColor={styles.input.color}
          />
          <TouchableOpacity
            onPress={clearText}
            style={{}}
            disabled={isFetching}
          >
            <ThemedText style={styles.btn}>❌</ThemedText>
          </TouchableOpacity>
        </ThemedView>
        <TouchableOpacity onPress={() => submit(text)} style={{}}>
          <ThemedText style={styles.submitBtn}>Play</ThemedText>
        </TouchableOpacity>
        {isFetching ? (
          <ActivityIndicator
            size={30}
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          />
        ) : data ? (
          <VideoPlayer data={data} />
        ) : null}
      </ThemedView>
    </ThemedView>
    // </SafeAreaView>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    gap: 4,
    paddingVertical: 10,
  },
  input: {
    borderColor: "gray",
    color: "white",
    borderWidth: 1,
    padding: 10,
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 6,
  },
  btn: {
    borderColor: "gray",
    color: "white",
    borderWidth: 1,
    padding: 10,
    flex: 1,
    backgroundColor: "transparent",
    borderRadius: 6,
    textAlignVertical: "center",
  },
  submitBtn: {
    borderColor: "gray",
    color: "white",
    textAlign: "center",
    width: "100%",
    borderWidth: 1,
    padding: 10,
    backgroundColor: "green",
    borderRadius: 6,
  },
});
