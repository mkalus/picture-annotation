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

<style lang="sass">
.pa-side-bar-entry
  &.is-hover-target
    .pa-accordion
      background-color: #efc4b0

  &.is-selected-target
    .pa-accordion
      background-color: #efc4b0

.pa-accordion
  background-color: #eee
  color: #444
  cursor: pointer
  padding: 18px
  width: 100%
  text-align: left
  border: none
  outline: none
  transition: 0.4s
  margin-bottom: 2px

  &.is-active, &:hover
    background-color: #ccc

.pa-side-bar-title
  vertical-align: top
  padding-left: 5px

.pa-side-bar-icons
  float: right

.pa-annotation-text
  padding: 5px

.pa-panel
  padding: 0 18px
  background-color: white
  max-height: 0
  overflow: hidden
  transition: max-height 0.2s ease-out

.pa-annotation-link
  display: block
  text-align: center
  color: #000
  text-decoration: none
  background: lightgoldenrodyellow
  padding: 0.7em
  border: 0
  margin: 1em 0
  transition: background 0.5s ease-out

  &:hover, &:focus
    background: gold

.pa-annotation-form
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif
  display: grid
  grid-template-columns: auto 1fr
  grid-gap: 1em
  padding: 10px 0

  label
    grid-column: 1 / 2
    text-align: right

  button
    grid-column: 2 / 3
    background: lightgrey
    padding: 0.7em
    border: 0

    &:hover
      background: gold

  input, textarea
    grid-column: 2 / 3
    background: #fff
    border: 1px solid #9c9c9c

    &:focus
      outline: 3px solid gold

  textarea
    height: 10em
</style>
