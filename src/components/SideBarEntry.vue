<template>
  <div class="pa-side-bar-entry" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave"
       :class="{'is-selected-target': selectedShapeName === shape.name, 'is-hover-target': currentHoverShape === shape.name}">

    <button @click="toggleContent" class="pa-accordion" :class="{'is-active': active}">
      <icon :type="shape.type" />
      <span v-if="shape.annotation.title" class="pa-side-bar-title">{{shape.annotation.title}}</span>
      <span v-if="editMode && (active || selectedShapeName === shape.name)" class="pa-side-bar-icons">
        <a href="#" @click.prevent="deleteShape" :title="$t('delete_shape')"><icon type="delete-shape" fill="red" /></a>
      </span>
    </button>

    <div class="pa-panel" ref="panel">
      <template v-if="editMode">
        <form class="pa-annotation-form" @submit.prevent="submitted">
          <label :for="shape.name + '-title'">{{ $t('annotation_title') }}</label>
          <input type="text" name="title" :id="shape.name + '-title'" v-model="formData.title">
          <label :for="shape.name + '-text'">{{ $t('annotation_text') }}</label>
          <textarea name="text" :id="shape.name + '-text'" v-model="formData.text" />
          <label :for="shape.name + '-link-title'">{{ $t('annotation_link_title') }}</label>
          <input type="text" name="link-title" :id="shape.name + '-link-title'" v-model="formData.linkTitle">
          <label :for="shape.name + '-link'">{{ $t('annotation_link') }}</label>
          <input type="text" name="link" :id="shape.name + '-link'" v-model="formData.link">
          <button type="submit">{{ $t('submit') }}</button>
        </form>
      </template>
      <template v-else>
        <div v-if="shape.annotation.text" class="pa-annotation-text"><nl2br tag="p" :text="shape.annotation.text"/></div>

        <a :href="shape.annotation.link" v-if="shape.annotation.link" class="pa-annotation-link">{{shape.annotation.linkTitle || $t('more')}}</a>
      </template>
    </div>
  </div>
</template>

<script>
import Nl2br from 'vue-nl2br';
import Icon from './Icon';

export default {
  components: {
    Icon,
    Nl2br
  },
  props: ['shape', 'editMode', 'selectedShapeName', 'currentHoverShape'],
  data () {
    return {
      active: false,
      // form data as copy
      formData: {
        title: '',
        text: '',
        linkTitle: '',
        link: ''
      }
    };
  },
  created () {
    if (this.shape) {
      this.formData.title = this.shape.annotation.title;
      this.formData.text = this.shape.annotation.text;
      this.formData.linkTitle = this.shape.annotation.linkTitle;
      this.formData.link = this.shape.annotation.link;
    }
  },
  methods: {
    handleMouseEnter () {
      this.$emit('sidebar-entry-enter', this.shape.name);
    },
    handleMouseLeave () {
      this.$emit('sidebar-entry-leave', this.shape.name);
    },
    toggleContent () {
      // slide up/down
      this.$refs.panel.style.maxHeight = this.active ? null : this.$refs.panel.scrollHeight + 'px';
      // activation
      this.active = !this.active;
    },
    deleteShape () {
      this.$emit('sidebar-entry-delete', this.shape.name);
    },
    submitted () {
      // copy back data
      this.shape.annotation.title = this.formData.title;
      this.shape.annotation.text = this.formData.text;
      this.shape.annotation.linkTitle = this.formData.linkTitle;
      this.shape.annotation.link = this.formData.link;

      // close entry
      this.toggleContent();

      this.$emit('sidebar-entry-save', this.shape.name);
    }
  },
  watch: {
    selectedShapeName: function (newShape, oldShape) {
      if (newShape === this.shape.name) {}
      if (!this.active && newShape === this.shape.name) {
        this.toggleContent();
      } else if (this.active && newShape !== this.shape.name) {
        this.toggleContent();
      }
    }
  }
};
</script>
