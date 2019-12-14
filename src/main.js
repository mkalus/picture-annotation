import Vue from 'vue';
import VueKonva from 'vue-konva';
import App from './App.vue';
import 'vue-simple-context-menu/dist/vue-simple-context-menu.css';
import VueSimpleContextMenu from 'vue-simple-context-menu';

Vue.config.productionTip = false;

Vue.use(VueKonva);
Vue.component('vue-simple-context-menu', VueSimpleContextMenu);

// loading wrapper for each instance
const $elements = document.getElementsByClassName('picture-annotation');

for (let i = 0; i < $elements.length; i++) {
  const $el = $elements[i];

  // create new instance for each occurrence
  new Vue({
    render: function (h) {
      const callback = this.$el.attributes['data-callback'] &&
        this.$el.attributes['data-callback'].value &&
        typeof eval(this.$el.attributes['data-callback'].value) && // eslint-disable-line no-eval
        eval(this.$el.attributes['data-callback'].value); // eslint-disable-line no-eval

      return h(App, {
        // pass attributes of parent element to app
        props: {
          containerId: this.$el.attributes.id || 'picture-annotation-' + Math.random(),
          language: (this.$el.attributes['data-language'] && this.$el.attributes['data-language'].value) || 'en',
          imageSrc: this.$el.attributes['data-image-src'] && this.$el.attributes['data-image-src'].value,
          dataCallback: callback
        }
      });
    }
  }).$mount($el);
}
