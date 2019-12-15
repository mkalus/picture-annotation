import Vue from 'vue';
import VueKonva from 'vue-konva';
import App from './App.vue';
import 'vue-simple-context-menu/dist/vue-simple-context-menu.css';
import VueSimpleContextMenu from 'vue-simple-context-menu';
import VueI18n from 'vue-i18n';

Vue.config.productionTip = false;

Vue.use(VueKonva);
Vue.component('vue-simple-context-menu', VueSimpleContextMenu);
Vue.use(VueI18n);

// Create VueI18n instance with options
const i18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: {
      zoom_in: 'Zoom in',
      zoom_out: 'Zoom out',
      add_polygon: 'Add polygon',
      add_rectangle: 'Add rectangle',
      add_circle: 'Add circle',
      add_person: 'Add person shape',
      open_annotation: 'Annotate shape',
      delete_shape: 'Delete shape',
      edit: 'Annotate',
      delete: 'Delete',
      annotation_title: 'Title',
      annotation_text: 'Text',
      annotation_link_title: 'Link title',
      annotation_link: 'Link',
      submit: 'Change'
    },
    de: {
      zoom_in: 'Vergrößern',
      zoom_out: 'Verkleinern',
      add_polygon: 'Polygon hinzufügen',
      add_rectangle: 'Rechteck hinzufügen',
      add_circle: 'Kreis hinzufügen',
      add_person: 'Personenform hinzufügen',
      open_annotation: 'Daten eingeben',
      delete_shape: 'Löschen',
      edit: 'Daten',
      delete: 'Löschen',
      annotation_title: 'Titel',
      annotation_text: 'Text',
      annotation_link_title: 'Link-Titel',
      annotation_link: 'Link',
      submit: 'Ändern'
    }
  }
});

// loading wrapper for each instance
const $elements = document.getElementsByClassName('picture-annotation');
const savedElements = []; // save elements to array, since array will otherwise be reduce while looping
$elements.forEach($el => savedElements.push($el));

for (let i = 0; i < savedElements.length; i++) {
  const $el = savedElements[i];

  // do we have annotation data?
  const data = $el.getElementsByClassName('picture-annotation-data');

  // create new instance for each occurrence
  new Vue({
    i18n,
    render: function (h) {
      const callback = this.$el.attributes['data-callback'] &&
        this.$el.attributes['data-callback'].value &&
        typeof eval(this.$el.attributes['data-callback'].value) && // eslint-disable-line no-eval
        eval(this.$el.attributes['data-callback'].value); // eslint-disable-line no-eval

      return h(App, {
        // pass attributes of parent element to app
        props: {
          containerId: this.$el.attributes.id || 'picture-annotation-' + Math.random(),
          editMode: (this.$el.attributes['data-edit-mode'] && this.$el.attributes['data-edit-mode'].value === '1') || false,
          language: (this.$el.attributes['data-language'] && this.$el.attributes['data-language'].value) || 'en',
          imageSrc: this.$el.attributes['data-image-src'] && this.$el.attributes['data-image-src'].value,
          localStorageKey: this.$el.attributes['data-local-storage-key'] && this.$el.attributes['data-local-storage-key'].value,
          width: (this.$el.attributes['data-width'] && this.$el.attributes['data-width'].value) || $el.innerWidth,
          height: (this.$el.attributes['data-height'] && this.$el.attributes['data-height'].value) || $el.innerHeight,
          dataCallback: callback,
          initialData: (data.length && data[0].innerHTML) || ''
        }
      });
    }
  }).$mount($el);
}
