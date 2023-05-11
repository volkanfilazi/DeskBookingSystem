import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/router'
import { createPinia } from 'pinia'
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'


const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)
app.component('VueDatePicker', VueDatePicker)
app.mount('#app')
