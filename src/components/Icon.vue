<template>
  <span class="pa-icon">
    <svg :fill="fill"
         :width="width"
         :height="height"
         :viewBox="viewBox"
         :xmlns="xmlns">
      <title v-if="title">{{ title }}</title>
      <path :d="shape" />
    </svg>
  </span>
</template>

<script>
import { mdiShapePolygonPlus, mdiShapeSquarePlus, mdiShapeCirclePlus, mdiDeleteOutline } from '@mdi/js';

/**
 * Icon helper for SVG Icons
 */
export default {
  props: {
    type: {
      type: String,
      required: true
    },
    fill: {
      type: String,
      default: 'currentColor'
    },
    width: {
      type: [Number, String],
      default: 24
    },
    height: {
      type: [Number, String],
      default: 24
    },
    viewBox: {
      type: [String],
      default: '0 0 24 24'
    },
    xmlns: {
      type: String,
      default: 'xmlns="http://www.w3.org/2000/svg"'
    },
    title: {
      type: String,
      required: false
    }
  },
  computed: {
    shape () {
      switch (this.type) {
        case 'add-polygon': return mdiShapePolygonPlus;
        case 'add-rectangle': return mdiShapeSquarePlus;
        case 'add-circle': return mdiShapeCirclePlus;
        case 'delete-shape': return mdiDeleteOutline;
        default: return 'NOT FOUND';
      }
    }
  }
};
</script>
