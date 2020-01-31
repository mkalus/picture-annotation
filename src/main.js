import Vue from 'vue';
import App from './App.vue';

// loader that simulates the parameters of the web component
const $elements = document.getElementsByClassName('picture-annotation');
const savedElements = []; // save elements to array, since array will otherwise be reduce while looping
for (let i = 0; i < $elements.length; i++) {
  savedElements.push($elements[i]);
}

// retrieve elements from array and create vue instances
for (let i = 0; i < savedElements.length; i++) {
  const $el = savedElements[i];

  // do we have annotation data?
  const data = $el.getElementsByClassName('picture-annotation-data');

  // create new instance for each occurrence
  new Vue({
    // handler for rendering component
    render: function (h) {
      // return App instance with parameters
      return h(App, {
        // pass attributes of parent element to app
        props: {
          containerId: (this.$el.attributes.id && this.$el.attributes.id.value) || 'picture-annotation-' + i,
          editMode: (this.$el.attributes['data-edit-mode'] && this.$el.attributes['data-edit-mode'].value === '1') || false,
          language: (this.$el.attributes['data-language'] && this.$el.attributes['data-language'].value) || 'en',
          imageSrc: this.$el.attributes['data-image-src'] && this.$el.attributes['data-image-src'].value,
          localStorageKey: this.$el.attributes['data-local-storage-key'] && this.$el.attributes['data-local-storage-key'].value,
          width: (this.$el.attributes['data-width'] && this.$el.attributes['data-width'].value) || $el.innerWidth,
          height: (this.$el.attributes['data-height'] && this.$el.attributes['data-height'].value) || $el.innerHeight,
          dataCallback: this.$el.attributes['data-callback'] && this.$el.attributes['data-callback'].value,
          initialData: (data.length && data[0].innerHTML) || ''
        }
      });
    }
  }).$mount($el);
}
