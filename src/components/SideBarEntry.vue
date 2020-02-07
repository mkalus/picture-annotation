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
      <div v-if="shape.annotation.text" class="pa-annotation-text"><nl2br tag="p" :text="shape.annotation.text"/></div>

      <a :href="shape.annotation.link" v-if="shape.annotation.link" class="pa-annotation-link">{{shape.annotation.linkTitle || $t('more')}}</a>
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
      active: false
    };
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
    }
  },
  watch: {
    selectedShapeName: function (newShape, oldShape) {
      if (newShape === this.shape.name) {}
      if (!this.active && newShape === this.shape.name) {
        this.toggleContent();
      } else if (this.active && oldShape === this.shape.name) {
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
</style>
