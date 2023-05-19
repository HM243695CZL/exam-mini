import { createStore } from 'vuex';
import userInfo from './modules/userInfo'

const store = createStore({
	modules:{ 
		userInfo
	}
});

export default store;