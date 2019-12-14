import Vue from 'vue';
import VueKonva from 'vue-konva';
import App from './App.vue';
import 'vue-simple-context-menu/dist/vue-simple-context-menu.css';
import VueSimpleContextMenu from 'vue-simple-context-menu';

Vue.config.productionTip = false;

Vue.use(VueKonva);
Vue.component('vue-simple-context-menu', VueSimpleContextMenu);

new Vue({
  render: h => h(App)
}).$mount('#app');
