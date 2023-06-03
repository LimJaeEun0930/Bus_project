import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { bus_stops } from './busstop_data copy';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const api_url = 'http://api.gwangju.go.kr/xml/arriveInfo';
const serviceKey = "qBLyHIv4CIm4knTDgeP%2F0OwIMc1Zd8H08eAJLLmMpXXnmE39g11IW1ukP%2F17Tqa1vV6Nq2X6vmhxKjLDq6q2fw%3D%3D";

const STORAGE_KEY = "@added_stops";
export default function App() {
  const [text,setText] = useState("");
  const [BUSSTOP_ID,setBusstop_id] = useState("");
  const [added_stops,Set_added_stops] = useState({});
  const settingBusstop_id = (id) => setBusstop_id(id);
  const onChangeText = (text) => setText(text);

  const SaveStops = async (toSave) =>{ //저장
    await AsyncStorage.setItem(STORAGE_KEY,JSON.stringify(toSave));
  }
  const loadStops = async()=> {
    const s = await AsyncStorage.getItem(STORAGE_KEY);
    console.log(s);
    setBusstop_id(JSON.parse(s)); //맞는코드인지 확인 필요
  }
  const adding_bus_stops = async()=>{ // 스크롤뷰에 추가,유저가 검색한 정류장 저장하기위한 작업
    console.log(text);
    console.log("입력값");
    if(text === "")
      return;
    if(text in bus_stops){
      const new_stops = Object.assign(
        {},
        added_stops,
        {[Date.now()]: {[text] : bus_stops[text]},});
        Set_added_stops(new_stops);
        await SaveStops(new_stops);
        setText("");
        console.log(added_stops);
    }
    else if(!(text in bus_stops)){
      console.log("잘못된 정류장이름");
      setText("");
    }
   
  }

  // const add_bus_stop = async() =>{
  //   /*여기서는 그냥 버스정류장이 존재하는 이름이라면 스크롤뷰에 추가하는걸로 하자. 그리고나서
  //   스크롤뷰에 있는 정류장이름을 클릭하면 다른창으로 가고 그곳에서 버스를 클릭하면 api를 몇초간격으로
  //   받아오는걸로 가는게 좋겠다.
  //  */
  //   if(text === "")
  //     return;

  //   if(bus_stops[paydload] != null){
  //     settingBusstop_id(paydload);
  //     const fullUrl = `${api_url}?serviceKey=${serviceKey}&BUSSTOP_ID=${BUSSTOP_ID}`;
  //     try{
  //       const response = await axios.get(fullUrl);
  //       console.log(response.status)
  //     } catch(error){
  //       console.error(error);
  //     }
      
  //     //api로 버스정류장의 정보를 불러와서 스크롤뷰에 버스정류소이름 추가할것. 이거 클릭하면 버스정류소
  //     //페이지로 넘어간다.
  //   }
  //   else if(bus_stops[paydload] === null){
  //       Alert.alert("잘못된 정류장 이름입니다.");
  //     }
  //   }
  

  //console.log(bus_stops["운남삼성아파트"])
  return (
    <View style={styles.container}>
      <StatusBar style="auto"/>
      <View >
        <Text style={styles.header}>늦지마라늦지마라</Text>
      </View>
      <TextInput
      returnKeyType='done'
      onSubmitEditing={adding_bus_stops}
      onChangeText={onChangeText}
      value={text}
      placeholder="버스정류장 이름을 입력하세요."
      style={styles.input}
      />

      <ScrollView>
      {Object.keys(added_stops).map((key)=>(<View key={key}>
        <Text style={styles.sv}>{added_stops[key][text]}</Text>
      </View>))}
      </ScrollView>
      
    </View>
 
  )}

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "black",
      paddingHorizontal: 20,
    },
    header: {
      marginTop: 100,
      color: "white",
      fontSize: 20,
    },
    input: {
      backgroundColor: "white",
      paddingVertical: 15,
      paddingHorizontal: 20,
      borderRadius:30,
      marginVertical: 20,
      fontSize: 18,
    },
    sv: {
      color: "white",
    }
  })
