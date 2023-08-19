// reducers/index.ts
import { combineReducers } from 'redux';
// Import your individual reducers here
// import counterReducer from './counterReducer';

const rootReducer = combineReducers({
  // Add your reducers here
  // counter: counterReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;