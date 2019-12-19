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
import {
  mdiShapePolygonPlus, mdiShapeSquarePlus, mdiShapeCirclePlus, mdiDeleteOutline, mdiSquareEditOutline,
  mdiMagnifyPlusOutline, mdiMagnifyMinusOutline, mdiEyeOutline, mdiEyeOffOutline
} from '@mdi/js';

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
        case 'zoom-in': return mdiMagnifyPlusOutline;
        case 'zoom-out': return mdiMagnifyMinusOutline;
        case 'shapes-on': return mdiEyeOutline;
        case 'shapes-off': return mdiEyeOffOutline;
        case 'add-polygon': return mdiShapePolygonPlus;
        case 'add-polygon-accept': return 'M20.29 3.29L15 8.59l-2.29-2.3-1.42 1.42 3.71 3.7 6.71-6.7-1.42-1.42zM7 5l-4 9 7 7 9-4v-4h-2v2.7l-6.6 2.9-5-5L8.3 7H11V5H7z';
        case 'add-rectangle': return mdiShapeSquarePlus;
        case 'add-circle': return mdiShapeCirclePlus;
        case 'add-person': return 'M9 4a4 4 0 014 4 4 4 0 01-4 4 4 4 0 01-4-4 4 4 0 014-4m0 1.9a2.1 2.1 0 100 4.2A2.1 2.1 0 0011.1 8 2.1 2.1 0 009 5.9M20 7v3h3v2h-3v3h-2v-3h-3v-2h3V7h2M9 13c2.67 0 8 1.33 8 4v3H1v-3c0-2.67 5.33-4 8-4m0 1.9c-2.97 0-6.1 1.46-6.1 2.1v1.1h12.2V17c0-.64-3.1-2.1-6.1-2.1z';
        case 'edit-shape': return mdiSquareEditOutline;
        case 'delete-shape': return mdiDeleteOutline;
        default: return 'NOT FOUND';
      }
    }
  }
};
</script>
