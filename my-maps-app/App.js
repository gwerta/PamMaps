//Lista de imports
import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View, TextInput, Keyboard, Dimensions } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { GOOGLE_MAPS_API_KEY } from '@env';
import { SafeAreaView } from 'react-native-safe-area-context';


//Função principal que setta a localização padrão
export default function App() {
  const mapRef = useRef(null);
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState({
    latitude: -23.55052,
    longitude: -46.633308,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  // Função para buscar localização usando a API do Google Maps Geocoding
  const handleSearch = async () => {
    if (!search) return;
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(search)}&key=${GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      if (data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        const newRegion = {
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        };
        setRegion(newRegion);
        mapRef.current.animateToRegion(newRegion, 1000);
        Keyboard.dismiss();
      } else {
        alert('Localização não encontrada!');
      }
    } catch (error) {
      alert('Erro ao buscar localização!');
    }
  };

  // Renderiza o mapa e a busca de localização

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Buscar localização..."
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
      </View>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={region}
        region={region}
      >
        <Marker
          coordinate={{ latitude: region.latitude, longitude: region.longitude }}
          title="Localização"
          description={search || "Capital financeira do Brasil"}
        />
      </MapView>
    </SafeAreaView>
  );
}

//Estilização dos componentes
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    padding: 10,
    backgroundColor: '#fff',
    zIndex: 1,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
  },
  map: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});