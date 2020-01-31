<template>
  <app />
</template>

<script>
import Vue from 'vue';
import VueKonva from 'vue-konva';
import 'vue-simple-context-menu/dist/vue-simple-context-menu.css';
import VueSimpleContextMenu from 'vue-simple-context-menu';
import VueI18n from 'vue-i18n';
import App from './App';

Vue.config.productionTip = false;

Vue.use(VueKonva);
Vue.component('vue-simple-context-menu', VueSimpleContextMenu);

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
      hide_shapes: 'Hide shapes',
      show_shapes: 'Show shapes',
      edit: 'Annotate',
      delete: 'Delete',
      annotation_title: 'Title',
      annotation_text: 'Text',
      annotation_link_title: 'Link title',
      annotation_link: 'Link',
      submit: 'Change',
      more: 'More',
      accept_polygon: 'Accept polyon',
      polygon_help: 'Add points by clicking. Right click removes last point. Accept by clicking on green polygon icon.'
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
      hide_shapes: 'Annotationen verbergen',
      show_shapes: 'Annotationen zeigen',
      edit: 'Daten',
      delete: 'Löschen',
      annotation_title: 'Titel',
      annotation_text: 'Text',
      annotation_link_title: 'Link-Titel',
      annotation_link: 'Link',
      submit: 'Ändern',
      more: 'Mehr',
      accept_polygon: 'Polygon annehmen',
      polygon_help: 'Punkte durch Klicks hinzufügen. Rechtsklick entfernt den letzen Punkt. Annehmen durch Klick auf grünes Polygon-Icon.'
    }
  }
});
Vue.use(VueI18n);

export default {
  components: {
    App
  },
  i18n: i18n
};
</script>
