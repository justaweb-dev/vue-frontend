import App from './App.vue'
import './assets/main.css'
import router from './router'
import '@justaweb-dev/histoire-library/dist/histoire-comp-lib.css'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
