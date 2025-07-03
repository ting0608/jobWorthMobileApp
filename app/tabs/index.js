import React, { useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Animated, Dimensions } from 'react-native';
import { Provider } from 'react-redux';
import store from '../../redux/store';
import CalculatorScreen from '../screens/CalculatorScreen';
import OptionXScreen from '../screens/OptionXScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { Feather } from '@expo/vector-icons';

const TABS = [
  { key: 'calculator', label: 'Calculator', icon: 'divide' },
  { key: 'optionx', label: 'Option X', icon: 'eye' },
  { key: 'settings', label: 'Settings', icon: 'settings' },
];

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function MainTabs() {
  const [activeTab, setActiveTab] = useState('calculator');
  const [prevTab, setPrevTab] = useState('calculator');
  const [isAnimating, setIsAnimating] = useState(false);
  const animValue = useRef(new Animated.Value(0)).current;
  const [tabIndex, setTabIndex] = useState(0);

  // Find index of current and next tab
  const getTabIndex = (key) => TABS.findIndex(tab => tab.key === key);

  const handleTabPress = (key) => {
    if (key === activeTab || isAnimating) return;
    const nextIndex = getTabIndex(key);
    const currentIndex = getTabIndex(activeTab);
    const direction = nextIndex > currentIndex ? 1 : -1;
    setPrevTab(activeTab);
    setIsAnimating(true);
    animValue.setValue(direction * SCREEN_WIDTH);
    setActiveTab(key);
    setTabIndex(nextIndex);
    Animated.timing(animValue, {
      toValue: 0,
      duration: 350,
      useNativeDriver: true,
    }).start(() => {
      setIsAnimating(false);
    });
  };

  // Render content based on active tab
  const renderScreen = (tabKey) => {
    if (tabKey === 'calculator') return <CalculatorScreen />;
    if (tabKey === 'optionx') return <OptionXScreen />;
    if (tabKey === 'settings') return <SettingsScreen />;
    return null;
  };

  // For animation: render both previous and current screens
  const prevIndex = getTabIndex(prevTab);
  const currentIndex = getTabIndex(activeTab);
  const direction = currentIndex > prevIndex ? 1 : -1;

  return (
    <Provider store={store}>
      <View style={{ flex: 1, backgroundColor: '#5C8374' }}>
        <View style={styles.animatedContainer}>
          {isAnimating && (
            <Animated.View
              style={[
                styles.animatedScreen,
                {
                  transform: [{ translateX: animValue.interpolate({
                    inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
                    outputRange: [0, direction * -SCREEN_WIDTH, 0],
                  }) }],
                  zIndex: 1,
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                },
              ]}
            >
              {renderScreen(prevTab)}
            </Animated.View>
          )}
          <Animated.View
            style={[
              styles.animatedScreen,
              {
                transform: [{ translateX: animValue }],
                zIndex: 2,
                width: '100%',
                height: '100%',
              },
            ]}
          >
            {renderScreen(activeTab)}
          </Animated.View>
        </View>
        <View style={styles.fabTabBarContainer}>
          <View style={styles.fabTabBar}>
            {TABS.map(tab => (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tabButton, activeTab === tab.key && styles.activeTabButton]}
                onPress={() => handleTabPress(tab.key)}
                activeOpacity={0.7}
              >
                <Feather
                  name={tab.icon}
                  size={20}
                  color={activeTab === tab.key ? '#00796B' : '#888'}
                  style={{ marginBottom: 2 }}
                />
                <Text style={[styles.tabLabel, activeTab === tab.key && styles.activeTabLabel]}>
                  {tab.label}
                </Text>
                {activeTab === tab.key && <View style={styles.activeIndicator} />}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  animatedContainer: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 24,
    margin: 12,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
  },
  animatedScreen: {
    flex: 1,
  },
  fabTabBarContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 24,
    alignItems: 'center',
    zIndex: 10,
  },
  fabTabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 32,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    minWidth: 220,
    maxWidth: 350,
    width: '90%',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  tabButton: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  activeTabButton: {
    backgroundColor: '#e0f7f4',
  },
  tabLabel: {
    fontSize: 16,
    color: '#888',
    fontWeight: '500',
  },
  activeTabLabel: {
    color: '#00796B',
    fontWeight: '700',
  },
  activeIndicator: {
    marginTop: 4,
    width: 24,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#00796B',
  },
}); 