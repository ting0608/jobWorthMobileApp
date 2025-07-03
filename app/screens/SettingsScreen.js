import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setLanguage } from '../../redux/slices/languageSlice';
import { useT } from '../t';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
  const dispatch = useDispatch();
  const t = useT();
  const language = useSelector((state) => state.language.language);

  const handleLanguage = async (lang) => {
    dispatch(setLanguage(lang));
    await AsyncStorage.setItem('language', lang);
    console.log('Redux language after change:', lang, 'Redux state:', store.getState().language.language);
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/backgroundElement1.gif')} style={styles.bgGif} />
      <Text style={styles.title}>{t('settings')}</Text>
      <Text style={styles.label}>{t('language')}</Text>
      <View style={styles.langRow}>
        <TouchableOpacity
          style={[styles.langButton, language === 'en' && styles.activeLang]}
          onPress={() => handleLanguage('en')}
        >
          <Text style={styles.langText}>{t('english')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.langButton, language === 'zh' && styles.activeLang]}
          onPress={() => handleLanguage('zh')}
        >
          <Text style={styles.langText}>{t('chinese')}</Text>
        </TouchableOpacity>
      </View>
      <Image source={require('../../assets/images/backgroundElement2.gif')} style={styles.bgGif2} />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#092635',
  },
  bgGif: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 240,
    height: 120,
    zIndex: 1,
    opacity: 1,
  },
  bgGif2: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    // width: 240,
    // height: 240,
    zIndex: 1,
    opacity: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#fff',
    marginTop: 24,
    zIndex: 2,
  },
  label: {
    fontSize: 18,
    marginBottom: 16,
    color: '#fff',
    fontWeight: '600',
    zIndex: 2,
  },
  langRow: {
    flexDirection: 'row',
    gap: 24,
    zIndex: 2,
  },
  langButton: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#eee',
    backgroundColor: '#f9f9f9',
    marginHorizontal: 8,
    zIndex: 2,
  },
  activeLang: {
    borderColor: '#00796B',
    backgroundColor: '#e0f7f4',
  },
  langText: {
    fontSize: 16,
    color: '#092635',
    fontWeight: '500',
  },
}); 