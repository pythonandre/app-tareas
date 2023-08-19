import { createStore,  applyMiddleware } from 'redux';
import rootReducer from './reducers'; // You'll need to create your reducers
import thunk from 'redux-thunk'; // Import redux-thunk

const store = createStore(rootReducer, applyMiddleware(thunk)); // Apply thunk middleware

export default store;