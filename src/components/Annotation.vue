<template>
  <div class="pa-annotation">
    <h4 v-if="value.title">{{value.title}}</h4>

    <div v-if="value.text"><nl2br tag="p" :text="value.text"/></div>

    <a :href="value.link" v-if="value.link">{{value.linkTitle || $t('more')}}</a>
  </div>
</template>

<script>
import Nl2br from 'vue-nl2br';

export default {
  components: {
    Nl2br
  },
  props: ['value']
};
</script>

<style lang="sass">
.pa-annotation
  h4
    font-weight: bold
    margin: 0 0 1em 0

  a
    display: block
    text-align: center
    color: #000
    text-decoration: none
    background: lightgrey
    padding: 0.7em
    border: 0
    margin: 1em 0 0 0

    &:hover, &:focus
      background: gold
</style>
