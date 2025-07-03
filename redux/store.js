import { configureStore } from '@reduxjs/toolkit';
// import createSagaMiddleware from 'redux-saga';
import calculatorReducer from './slices/calculatorSlice';
import languageReducer from './slices/languageSlice';

// const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: {
    calculator: calculatorReducer,
    language: languageReducer,
  },
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
});

// sagaMiddleware.run(rootSaga); // Placeholder for future saga

export default store; 