import React from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { setField } from '../../redux/actions/calculatorActions';
import { useT } from '../../t';

function normalize(value, min, max, positive = true) {
  if (value === '' || isNaN(Number(value))) return 0.5; // treat empty as neutral
  const v = Math.max(min, Math.min(max, Number(value)));
  const norm = (v - min) / (max - min);
  return positive ? norm : 1 - norm;
}

export default function CalculatorScreen() {
  const dispatch = useDispatch();
  const t = useT();
  const {
    salary,
    region,
    workingDays,
    wfhDays,
    annualLeaves,
    medicalLeaves,
    publicHolidays,
    workingHours,
    commuteTime,
    restTime,
  } = useSelector((state) => state.calculator);
  const [result, setResult] = React.useState(null);

  const handleInput = (field, value) => {
    dispatch(setField({ field, value }));
  };

  const handleCalculate = () => {
    // Normalization ranges (can be adjusted)
    const normSalary = normalize(salary, 2000, 20000, true);
    // For region, use 1 for now (neutral)
    const normRegion = 1;
    const normWorkingDays = normalize(workingDays, 3, 7, false);
    const normWFHDays = normalize(wfhDays, 0, 5, true);
    const normAnnualLeaves = normalize(annualLeaves, 8, 30, true);
    const normMedicalLeaves = normalize(medicalLeaves, 0, 20, true);
    const normPublicHolidays = normalize(publicHolidays, 10, 20, true);
    const normWorkingHours = normalize(workingHours, 6, 12, false);
    const normCommuteTime = normalize(commuteTime, 0, 180, false);
    const normRestTime = normalize(restTime, 0, 240, true);

    // Weights
    const weights = {
      salary: 0.15,
      region: 0.10,
      workingDays: 0.10,
      wfhDays: 0.10,
      annualLeaves: 0.10,
      medicalLeaves: 0.05,
      publicHolidays: 0.05,
      workingHours: 0.10,
      commuteTime: 0.10,
      restTime: 0.15,
    };

    // Weighted sum
    const score =
      normSalary * weights.salary +
      normRegion * weights.region +
      normWorkingDays * weights.workingDays +
      normWFHDays * weights.wfhDays +
      normAnnualLeaves * weights.annualLeaves +
      normMedicalLeaves * weights.medicalLeaves +
      normPublicHolidays * weights.publicHolidays +
      normWorkingHours * weights.workingHours +
      normCommuteTime * weights.commuteTime +
      normRestTime * weights.restTime;

    // Convert to 0-5 scale
    const rating = (score * 5).toFixed(2);
    setResult(rating);
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Image source={require('../../assets/images/header.png')} style={styles.headerImage} resizeMode="contain" />
      <Text style={styles.title}>{t('header')}</Text>
      <Text style={styles.label}>{t('salary')}</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={salary}
        onChangeText={v => handleInput('salary', v)}
        placeholder={t('salary')}
        placeholderTextColor="#e0e0e0"
      />
      <Text style={styles.label}>{t('region')}</Text>
      <Text style={styles.fixedField}>{region}</Text>

      {/* Row 1: Working days/week, WFH days/week */}
      <View style={styles.row}>
        <View style={styles.inputGroup}>
          <Text style={styles.labelSmall}>{t('working_days')} 🐮🐴</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={workingDays}
            onChangeText={v => handleInput('workingDays', v)}
            placeholder="e.g. 5"
            placeholderTextColor="#e0e0e0"
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.labelSmall}>{t('wfh_days')}</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={wfhDays}
            onChangeText={v => handleInput('wfhDays', v)}
            placeholder="e.g. 2"
            placeholderTextColor="#e0e0e0"
          />
        </View>
      </View>

      {/* Row 2: Annual leaves, Medical leaves */}
      <View style={styles.row}>
        <View style={styles.inputGroup}>
          <Text style={styles.labelSmall}>{t('annual_leaves')}</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={annualLeaves}
            onChangeText={v => handleInput('annualLeaves', v)}
            placeholder="e.g. 14"
            placeholderTextColor="#e0e0e0"
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.labelSmall}>{t('medical_leaves')} 🤒</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={medicalLeaves}
            onChangeText={v => handleInput('medicalLeaves', v)}
            placeholder="e.g. 10"
            placeholderTextColor="#e0e0e0"
          />
        </View>
      </View>

      {/* Row 3: Public holidays, Working hours/day */}
      <View style={styles.row}>
        <View style={styles.inputGroup}>
          <Text style={styles.labelSmall}>{t('public_holidays')}</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={publicHolidays}
            onChangeText={v => handleInput('publicHolidays', v)}
            placeholder="e.g. 18"
            placeholderTextColor="#e0e0e0"
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.labelSmall}>{t('working_hours')}</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={workingHours}
            onChangeText={v => handleInput('workingHours', v)}
            placeholder="e.g. 8"
            placeholderTextColor="#e0e0e0"
          />
        </View>
      </View>

      {/* Row 4: Commute (min/day), Rest (min/day) */}
      <View style={styles.row}>
        <View style={styles.inputGroup}>
          <Text style={styles.labelSmall}>{t('commute')} 🚗</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={commuteTime}
            onChangeText={v => handleInput('commuteTime', v)}
            placeholder="e.g. 60"
            placeholderTextColor="#e0e0e0"
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.labelSmall}>{t('rest')}</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={restTime}
            onChangeText={v => handleInput('restTime', v)}
            placeholder="e.g. 90"
            placeholderTextColor="#e0e0e0"
          />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.roundButton} onPress={handleCalculate} activeOpacity={0.8}>
          <Text style={styles.roundButtonText}>{t('calculate')}</Text>
        </TouchableOpacity>
      </View>
      {result && <Text style={styles.result}>{t('result')}: {result} / 5 ⭐️</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#092635',
    paddingBottom: 100, // for floating tab bar
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    // marginBottom: 24,
    color: '#fff',
    letterSpacing: 1,
  },
  label: {
    fontSize: 16,
    marginTop: 12,
    alignSelf: 'flex-start',
    color: '#fff',
    fontWeight: '600',
    letterSpacing: 0.5,
    padding: 12, 
  },
  input: {
    width: '100%',
    maxWidth: 350,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#9EC8B9',
    padding: 12,
    fontSize: 16,
    marginTop: 4,
    backgroundColor: '#19394c',
    color: '#fff',
  },
  fixedField: {
    fontSize: 16,
    color: '#9EC8B9',
    alignSelf: 'flex-start',
    marginBottom: 8,
    marginTop: 4,
    fontWeight: '600',
    paddingHorizontal: 12, 
  },
  buttonContainer: {
    marginVertical: 24,
    width: '100%',
    maxWidth: 350,
  },
  roundButton: {
    backgroundColor: '#9EC8B9',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 350,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },
  roundButtonText: {
    color: '#092635',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  result: {
    fontSize: 18,
    fontWeight: '600',
    color: '#9EC8B9',
    // marginTop: 16,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 350,
    marginTop: 8,
    marginBottom: 4,
    gap: 8,
  },
  inputGroup: {
    flex: 1,
    marginHorizontal: 2,
  },
  labelSmall: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '500',
    marginBottom: 2,
    marginLeft: 2,
  },
  headerImage: {
    // width: 260,
    height: 80,
    alignSelf: 'center',
    marginTop: 24,
    marginBottom: 12,
  },
}); 