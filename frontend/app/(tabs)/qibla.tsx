import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Magnetometer } from 'expo-sensors';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
const { width } = Dimensions.get('window');

interface City {
  id: string;
  name: string;
  qibla_direction: number;
}

interface PrayerTimes {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  qibla_direction: number;
}

export default function Qibla() {
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [heading, setHeading] = useState(0);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCityPicker, setShowCityPicker] = useState(false);

  useEffect(() => {
    initData();
    setupMagnetometer();
  }, []);

  useEffect(() => {
    if (selectedCity) {
      fetchPrayerTimes();
    }
  }, [selectedCity]);

  const initData = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/cities`);
      setCities(response.data);
      
      const savedCityId = await AsyncStorage.getItem('selected_city_id');
      const defaultCity = response.data.find((c: City) => c.id === (savedCityId || 'istanbul'));
      setSelectedCity(defaultCity || response.data[0]);
    } catch (error) {
      console.error('Error loading cities:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPrayerTimes = async () => {
    if (!selectedCity) return;
    try {
      const response = await axios.get(`${BACKEND_URL}/api/prayer-times/${selectedCity.id}`);
      setPrayerTimes(response.data);
    } catch (error) {
      console.error('Error fetching prayer times:', error);
    }
  };

  const setupMagnetometer = async () => {
    try {
      // Check if magnetometer is available (not on web)
      const isAvailable = await Magnetometer.isAvailableAsync();
      if (!isAvailable) {
        setHasPermission(false);
        console.log('Magnetometer not available on this device');
        return;
      }
      
      const { status } = await Magnetometer.requestPermissionsAsync();
      setHasPermission(status === 'granted');
      
      if (status === 'granted') {
        Magnetometer.setUpdateInterval(100);
        const subscription = Magnetometer.addListener((data) => {
          let angle = Math.atan2(data.y, data.x) * (180 / Math.PI);
          angle = angle >= 0 ? angle : 360 + angle;
          setHeading(Math.round(angle));
        });
        
        return () => subscription.remove();
      }
    } catch (error) {
      console.log('Magnetometer error:', error);
      setHasPermission(false);
    }
  };

  const selectCity = async (city: City) => {
    setSelectedCity(city);
    await AsyncStorage.setItem('selected_city_id', city.id);
    setShowCityPicker(false);
  };

  const getQiblaRotation = () => {
    if (!selectedCity) return 0;
    const qibla = selectedCity.qibla_direction;
    return qibla - heading;
  };

  const getDirectionText = () => {
    const diff = getQiblaRotation();
    const normalizedDiff = ((diff % 360) + 360) % 360;
    
    if (normalizedDiff < 5 || normalizedDiff > 355) {
      return 'Kıble yönündesiniz!';
    } else if (normalizedDiff < 180) {
      return `Sağa ${Math.round(normalizedDiff)}° dönün`;
    } else {
      return `Sola ${Math.round(360 - normalizedDiff)}° dönün`;
    }
  };

  const isAligned = () => {
    const diff = Math.abs(getQiblaRotation() % 360);
    return diff < 5 || diff > 355;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#10b981" />
          <Text style={styles.loadingText}>Yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Kıble Pusulası</Text>
          <TouchableOpacity
            style={styles.citySelector}
            onPress={() => setShowCityPicker(!showCityPicker)}
          >
            <Ionicons name="location" size={18} color="#10b981" />
            <Text style={styles.citySelectorText}>{selectedCity?.name || 'Şehir Seç'}</Text>
            <Ionicons name="chevron-down" size={16} color="#64748b" />
          </TouchableOpacity>
        </View>

        {/* City Picker */}
        {showCityPicker && (
          <View style={styles.cityPicker}>
            <ScrollView 
              style={styles.cityList} 
              nestedScrollEnabled
              showsVerticalScrollIndicator={false}
            >
              {cities.map((city) => (
                <TouchableOpacity
                  key={city.id}
                  style={[
                    styles.cityItem,
                    selectedCity?.id === city.id && styles.cityItemActive,
                  ]}
                  onPress={() => selectCity(city)}
                >
                  <Text
                    style={[
                      styles.cityItemText,
                      selectedCity?.id === city.id && styles.cityItemTextActive,
                    ]}
                  >
                    {city.name}
                  </Text>
                  {selectedCity?.id === city.id && (
                    <Ionicons name="checkmark" size={20} color="#10b981" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Compass Card */}
        <View style={styles.compassCard}>
          {hasPermission === false ? (
            <View style={styles.permissionError}>
              <Ionicons name="compass-outline" size={64} color="#10b981" />
              <Text style={styles.permissionTitle}>Kıble Yönü</Text>
              <Text style={styles.qiblaStaticValue}>
                {selectedCity?.qibla_direction.toFixed(1)}°
              </Text>
              <Text style={styles.permissionText}>
                {selectedCity?.name} için Kıble açısı yukarıda gösterilmektedir.
              </Text>
              <Text style={styles.permissionSubtext}>
                Canlı pusula için mobil cihazda açın.
              </Text>
            </View>
          ) : (
            <>
              {/* Direction Text */}
              <View style={[
                styles.directionBadge,
                isAligned() && styles.directionBadgeAligned
              ]}>
                <Ionicons 
                  name={isAligned() ? 'checkmark-circle' : 'navigate'} 
                  size={20} 
                  color={isAligned() ? '#10b981' : '#f59e0b'} 
                />
                <Text style={[
                  styles.directionText,
                  isAligned() && styles.directionTextAligned
                ]}>
                  {getDirectionText()}
                </Text>
              </View>

              {/* Compass */}
              <View style={styles.compassContainer}>
                <View style={styles.compassOuter}>
                  {/* Cardinal directions */}
                  <View style={[styles.cardinalPoint, styles.north]}>
                    <Text style={styles.cardinalText}>K</Text>
                  </View>
                  <View style={[styles.cardinalPoint, styles.east]}>
                    <Text style={styles.cardinalText}>D</Text>
                  </View>
                  <View style={[styles.cardinalPoint, styles.south]}>
                    <Text style={styles.cardinalText}>G</Text>
                  </View>
                  <View style={[styles.cardinalPoint, styles.west]}>
                    <Text style={styles.cardinalText}>B</Text>
                  </View>
                  
                  {/* Compass inner circle */}
                  <View style={styles.compassInner}>
                    {/* Qibla direction indicator */}
                    <View
                      style={[
                        styles.qiblaIndicator,
                        {
                          transform: [{ rotate: `${getQiblaRotation()}deg` }],
                        },
                      ]}
                    >
                      <View style={styles.qiblaArrow}>
                        <Ionicons name="location" size={32} color="#10b981" />
                      </View>
                      <View style={styles.qiblaLine} />
                    </View>
                    
                    {/* Center */}
                    <View style={styles.compassCenter}>
                      <Text style={styles.headingText}>{heading}°</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Qibla Info */}
              <View style={styles.qiblaInfo}>
                <View style={styles.qiblaInfoItem}>
                  <Text style={styles.qiblaInfoLabel}>Kıble Açısı</Text>
                  <Text style={styles.qiblaInfoValue}>
                    {selectedCity?.qibla_direction.toFixed(1)}°
                  </Text>
                </View>
                <View style={styles.qiblaInfoDivider} />
                <View style={styles.qiblaInfoItem}>
                  <Text style={styles.qiblaInfoLabel}>Pusula Yönü</Text>
                  <Text style={styles.qiblaInfoValue}>{heading}°</Text>
                </View>
              </View>
            </>
          )}
        </View>

        {/* Prayer Times Card */}
        {prayerTimes && (
          <View style={styles.prayerCard}>
            <Text style={styles.prayerCardTitle}>Bugünün Namaz Vakitleri</Text>
            <View style={styles.prayerGrid}>
              <PrayerItem name="İmsak" time={prayerTimes.fajr} icon="moon" />
              <PrayerItem name="Güneş" time={prayerTimes.sunrise} icon="sunny" />
              <PrayerItem name="Öğle" time={prayerTimes.dhuhr} icon="partly-sunny" />
              <PrayerItem name="İkindi" time={prayerTimes.asr} icon="cloudy" />
              <PrayerItem name="Akşam" time={prayerTimes.maghrib} icon="cloudy-night" />
              <PrayerItem name="Yatsı" time={prayerTimes.isha} icon="moon" />
            </View>
          </View>
        )}

        {/* Kaaba Info */}
        <View style={styles.kaabaCard}>
          <View style={styles.kaabaIcon}>
            <Ionicons name="cube" size={32} color="#f59e0b" />
          </View>
          <View style={styles.kaabaText}>
            <Text style={styles.kaabaTitle}>Kabe-i Muazzama</Text>
            <Text style={styles.kaabaSubtitle}>Mekke-i Mükerreme, Suudi Arabistan</Text>
            <Text style={styles.kaabaCoords}>21.4225° K, 39.8262° D</Text>
          </View>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const PrayerItem = ({ name, time, icon }: { name: string; time: string; icon: string }) => (
  <View style={styles.prayerItem}>
    <Ionicons name={icon as any} size={18} color="#64748b" />
    <Text style={styles.prayerItemName}>{name}</Text>
    <Text style={styles.prayerItemTime}>{time}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a1628',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#94a3b8',
    marginTop: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  citySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  citySelectorText: {
    color: '#f8fafc',
    fontSize: 14,
  },
  cityPicker: {
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: '#1e293b',
    borderRadius: 16,
    overflow: 'hidden',
  },
  cityList: {
    maxHeight: 200,
  },
  cityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  cityItemActive: {
    backgroundColor: '#10b98120',
  },
  cityItemText: {
    color: '#94a3b8',
    fontSize: 15,
  },
  cityItemTextActive: {
    color: '#10b981',
    fontWeight: '600',
  },
  compassCard: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#1e293b',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  permissionError: {
    alignItems: 'center',
    padding: 32,
  },
  permissionTitle: {
    color: '#f8fafc',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
  },
  qiblaStaticValue: {
    color: '#10b981',
    fontSize: 48,
    fontWeight: 'bold',
    marginTop: 8,
  },
  permissionText: {
    color: '#94a3b8',
    fontSize: 14,
    marginTop: 16,
    textAlign: 'center',
  },
  permissionSubtext: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
  directionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f59e0b20',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
    marginBottom: 24,
  },
  directionBadgeAligned: {
    backgroundColor: '#10b98120',
  },
  directionText: {
    color: '#f59e0b',
    fontSize: 14,
    fontWeight: '600',
  },
  directionTextAligned: {
    color: '#10b981',
  },
  compassContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  compassOuter: {
    width: width - 100,
    height: width - 100,
    maxWidth: 280,
    maxHeight: 280,
    borderRadius: 140,
    backgroundColor: '#0f172a',
    borderWidth: 2,
    borderColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cardinalPoint: {
    position: 'absolute',
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  north: { top: 10 },
  east: { right: 10 },
  south: { bottom: 10 },
  west: { left: 10 },
  cardinalText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '600',
  },
  compassInner: {
    width: width - 160,
    height: width - 160,
    maxWidth: 220,
    maxHeight: 220,
    borderRadius: 110,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qiblaIndicator: {
    position: 'absolute',
    alignItems: 'center',
    height: '100%',
  },
  qiblaArrow: {
    marginTop: 10,
  },
  qiblaLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#10b98140',
    marginBottom: 40,
  },
  compassCenter: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headingText: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: 'bold',
  },
  qiblaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 16,
  },
  qiblaInfoItem: {
    flex: 1,
    alignItems: 'center',
  },
  qiblaInfoLabel: {
    color: '#64748b',
    fontSize: 12,
    marginBottom: 4,
  },
  qiblaInfoValue: {
    color: '#f8fafc',
    fontSize: 20,
    fontWeight: 'bold',
  },
  qiblaInfoDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#334155',
  },
  prayerCard: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
  },
  prayerCardTitle: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  prayerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  prayerItem: {
    width: (width - 80) / 3,
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  prayerItemName: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 6,
  },
  prayerItemTime: {
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  kaabaCard: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  kaabaIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f59e0b20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  kaabaText: {
    flex: 1,
  },
  kaabaTitle: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '600',
  },
  kaabaSubtitle: {
    color: '#94a3b8',
    fontSize: 13,
    marginTop: 4,
  },
  kaabaCoords: {
    color: '#64748b',
    fontSize: 11,
    marginTop: 4,
  },
});
