<template>
  <div class="pa-side-bar-entry" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave"
       :class="{'is-selected-target': selectedShapeName === shape.name, 'is-hover-target': currentHoverShape === shape.name}">

    <button @click="toggleContent" class="pa-accordion" :class="{'is-active': active}"><icon :type="shape.type" /><span v-if="shape.annotation.title">{{shape.annotation.title}}</span></button>

    <div class="pa-panel" ref="panel">
      <div v-if="shape.annotation.text"><nl2br tag="p" :text="shape.annotation.text"/></div>

      <a :href="shape.annotation.link" v-if="shape.annotation.link">{{shape.annotation.linkTitle || $t('more')}}</a>
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
      // TODO: emit event
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

  &.is-active, &:hover
    background-color: #ccc

.pa-panel
  padding: 0 18px
  background-color: white
  max-height: 0
  overflow: hidden
  transition: max-height 0.2s ease-out
</style>
