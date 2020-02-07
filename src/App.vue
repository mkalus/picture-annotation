<template>
  <div :id="containerId" class="pa-container" :style="{width: width + 'px', height: height + 'px'}">
    <div class="pa-canvas">
      <div class="pa-controls">
        <a href="#" @click.prevent="changeScale(0.1)" :title="$t('zoom_in')"><icon type="zoom-in" /></a>
        <a href="#" @click.prevent="changeScale(-0.1)" :title="$t('zoom_out')"><icon type="zoom-out" /></a>
        <hr />
        <a href="#" @click.prevent="toggleShowShapes" :title="$t(isShapesVisible ? 'hide_shapes' : 'show_shapes')" v-if="!editMode"><icon :type="isShapesVisible ? 'shapes-off' : 'shapes-on'" /></a>
        <a href="#" @click.prevent="startPolygonDrawing" :title="$t(isAddingPolygon ? 'accept_polygon' : 'add_polygon')" v-if="editMode"><icon :type="isAddingPolygon ? 'add-polygon-accept' : 'add-polygon'" :fill="isAddingPolygon ? 'green' : 'currentColor'" /></a>
        <a href="#" @click.prevent="addRectangle" :title="$t('add_rectangle')" v-if="editMode"><icon type="add-rectangle" :fill="isAddingPolygon ? 'gray' : 'currentColor'" /></a>
        <a href="#" @click.prevent="addCircle" :title="$t('add_circle')" v-if="editMode"><icon type="add-circle" :fill="isAddingPolygon ? 'gray' : 'currentColor'" /></a>
        <a href="#" @click.prevent="addPerson" :title="$t('add_person')" v-if="editMode"><icon type="add-person" :fill="isAddingPolygon ? 'gray' : 'currentColor'" /></a>
      </div>
      <!-- TODO: Fix buttons above - unselect triggers before button can get selectedShapeName -->

      <v-stage :config="{
        width: stageSize.width,
        height: stageSize.height,
        scaleX: scale,
        scaleY: scale,
        draggable: true
      }" @mousedown="handleStageMouseDown" @contextmenu="cancelEvent"
         @mouseenter="handleGlobalMouseEnter" @mouseleave="handleGlobalMouseLeave" @wheel="handleScroll" :ref="'stage'">
        <v-layer ref="background">
          <v-image :config="{
              image: image
            }" />
        </v-layer>
        <v-layer ref="items">
          <template v-for="shape in shapes">
            <v-rect v-if="shape.type === 'rect'" :config="shape" :key="shape.name"
                    @dragend="handleDragEnd($event, shape)" @transformend="handleTransform($event, shape)"
                    @mouseenter="handleMouseEnter(shape.name)" @mouseleave="handleMouseLeave"/>
            <v-circle v-if="shape.type === 'circle'" :config="shape" :key="shape.name"
                      @dragend="handleDragEnd($event, shape)" @transformend="handleTransform($event, shape)"
                      @mouseenter="handleMouseEnter(shape.name)" @mouseleave="handleMouseLeave"/>
            <v-line v-if="shape.type === 'poly'" :config="shape" :key="shape.name"
                    @dragend="handleDragEnd($event, shape)" @transformend="handleTransform($event, shape)"
                    @mouseenter="handleMouseEnter(shape.name)" @mouseleave="handleMouseLeave"/>
            <v-path v-if="shape.type === 'path'" :config="shape" :key="shape.name"
                    @dragend="handleDragEnd($event, shape)" @transformend="handleTransform($event, shape)"
                    @mouseenter="handleMouseEnter(shape.name)" @mouseleave="handleMouseLeave"/>
          </template>
          <v-transformer ref="transformer" v-if="editMode"/>
        </v-layer>
        <v-layer ref="polygon" v-if="editMode && isAddingPolygon">
          <v-line v-if="polygonPoints.length > 2" :config="polygonPointsConfig" />
          <template v-for="(shape, index) in polygonAddShapes">
            <v-rect :config="shape" :key="index" />
          </template>
        </v-layer>
      </v-stage>

      <loader v-if="isLoading" />

      <div class="pa-polygon-hint" v-show="isAddingPolygon">{{ $t('polygon_help') }}</div>
    </div>
    <div class="pa-infobar">
      <side-bar-entry v-for="shape in shapes" :key="shape.name" :shape="shape" :edit-mode="editMode"
                      :selected-shape-name="selectedShapeName" :current-hover-shape="currentHoverShape"
                      v-on:sidebar-entry-enter="handleSideBarMouseEnter($event)"
                      v-on:sidebar-entry-leave="handleSideBarMouseLeave($event)"
                      v-on:sidebar-entry-delete="deleteShape($event)"
                      v-on:sidebar-entry-save="formSubmitted($event)"/>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import VueKonva from 'vue-konva';
import VueI18n from 'vue-i18n';
import i18n from './i18n.js';
import Icon from './components/Icon';
import Loader from './components/Loader';
import SideBarEntry from './components/SideBarEntry';

// some Vue use definitions - Konva painting, i18n
Vue.use(VueKonva);
Vue.use(VueI18n);

Vue.config.productionTip = false;

export default {
  components: {
    SideBarEntry,
    Icon,
    Loader
  },
  props: ['language', 'containerId', 'imageSrc', 'dataCallback', 'localStorageKey', 'width', 'height', 'editMode', 'initialData', 'initialDataId'],
  i18n: new VueI18n(i18n),
  data () {
    return {
      image: null,
      stageSize: {
        width: null,
        height: null
      },
      scale: 1, // current scale
      shapes: [], // shape container
      selectedShapeName: '', // currently selected shape
      currentHoverShape: '', // hovering over certain shape
      isLoading: true, // loading image?
      isShapesVisible: true, // show shapes?
      isAddingPolygon: false, // currently in polygon add mode?
      polygonPoints: [],
      polygonAddShapes: [],
      callback: undefined, // actual callback function
      formData: {
        title: '',
        text: '',
        linkTitle: '',
        link: ''
      }
    };
  },
  computed: {
    polygonPointsConfig () {
      return {
        points: this.polygonPoints,
        ...this.getBaseShapeForPolygon(),
        closed: true
      };
    }
  },
  // created live cycle hook
  created () {
    // set defaults
    this.stageSize.width = parseInt(this.width) / 3 * 2 - 2; // - 2 for border
    this.stageSize.height = parseInt(this.height);

    if (!this.stageSize.width || isNaN(this.stageSize.width)) this.stageSize.width = window.innerWidth;
    if (!this.stageSize.height || isNaN(this.stageSize.height)) this.stageSize.height = window.innerHeight;

    // load image
    const image = new window.Image();
    image.src = this.imageSrc;
    image.onload = () => {
      // set image only when it is loaded
      this.image = image;

      // adapt initial scale to fit canvas
      this.changeScale(-1 + Math.min(this.stageSize.width / image.width, this.stageSize.height / image.height));
      // loading finished
      this.isLoading = false;
    };

    // define callback function
    this.callback = this.dataCallback &&
      typeof eval(this.dataCallback) && // eslint-disable-line no-eval
      eval(this.dataCallback); // eslint-disable-line no-eval
  },
  mounted () {
    document.addEventListener('keydown', this.handleKeyEvent);

    // set language
    if (this.language) {
      this.$i18n.locale = this.language;
    }

    // try to load from local storage or local data
    this.load();
  },
  beforeDestroy () {
    document.removeEventListener('keydown', this.handleKeyEvent);
  },
  methods: {
    // handle transformation of elements
    handleStageMouseDown (e) {
      // adding polygon shape?
      if (this.isAddingPolygon) {
        e.evt.preventDefault();
        e.evt.stopPropagation();
        e.evt.stopImmediatePropagation();

        // right mouse button deletes last point
        if (e.evt.button === 2) this.removePolygonPoint();
        else if (e.evt.detail === 1) this.addPolygonPoint(); // ignore double clicks

        return; // no further stuff
      }

      // only handle left mouse button
      if (e.evt && e.evt.button !== 0) return;

      // in edit mode?
      if (this.editMode) {
        // edit mode only

        // clicked on stage - clear selection
        if (e.target === e.target.getStage()) {
          this.selectedShapeName = '';
          this.updateTransformer();
          return;
        }

        // clicked on transformer - do nothing
        const clickedOnTransformer =
          e.target.getParent().className === 'Transformer';
        if (clickedOnTransformer) {
          return;
        }
      }

      // find clicked shape by its name
      const name = e.target.name();
      const shape = this.shapes.find(r => r.name === name);
      if (shape) {
        this.selectedShapeName = name;
      } else {
        this.selectedShapeName = '';
      }

      if (this.editMode) {
        this.updateTransformer();
      }
    },
    updateTransformer () {
      if (!this.editMode) return; // edit mode only

      // here we need to manually attach or detach Transformer node
      const transformerNode = this.$refs.transformer.getStage();
      const stage = transformerNode.getStage();
      const { selectedShapeName } = this;

      const selectedNode = stage.findOne('.' + selectedShapeName);
      // do nothing if selected node is already attached
      if (selectedNode === transformerNode.node()) {
        return;
      }

      if (selectedNode) {
        // attach to another node
        transformerNode.attachTo(selectedNode);
      } else {
        // remove transformer
        transformerNode.detach();
      }
      transformerNode.getLayer().batchDraw();
    },
    cancelEvent (e) {
      e.evt.preventDefault();
    },

    // handle additions
    startPolygonDrawing () {
      // actually drawing polygon right now?
      if (this.isAddingPolygon) {
        this.finishPolygon();
      } else {
        this.isAddingPolygon = true;
      }
    },
    addPolygonPoint () { // add single polygon point
      // get stage and calculate pointer
      const stage = this.$refs.stage.getStage();
      const pointerPosition = stage.getPointerPosition();
      const x = (pointerPosition.x - (stage.attrs.x || 0)) / stage.attrs.scaleX;
      const y = (pointerPosition.y - (stage.attrs.y || 0)) / stage.attrs.scaleY;

      // add to list of points
      this.polygonPoints.push(x, y);

      // add new rect
      this.polygonAddShapes.push({
        ...this.getBaseShapeForPolygon(),
        x: x - 15,
        y: y - 15,
        width: 30,
        height: 30
      });
    },
    removePolygonPoint () { // remove single polygon point
      if (this.polygonPoints.length) {
        // remove last two points from list
        this.polygonPoints.splice(this.polygonPoints.length - 2, 2);

        // slice last shape off
        this.polygonAddShapes.pop();
      }
    },
    finishPolygon () {
      // clear list and copy
      const points = this.polygonPoints.splice(0, this.polygonPoints.length);

      // if polygon has 3 or more points, accept it
      if (points.length > 5) {
        this.addPolygon(points);
      }

      // clear points
      if (this.polygonAddShapes.length) {
        this.polygonAddShapes.splice(0, this.polygonAddShapes.length);
      }

      this.isAddingPolygon = false;
    },

    addPolygon (points) {
      this.shapes.push({
        ...this.getBaseShape('poly'),
        points: points,
        closed: true,
        x: 0,
        y: 0
      });

      // call update
      this.shapesUpdated();
    },
    addRectangle () {
      if (this.isAddingPolygon) return;

      this.shapes.push({
        ...this.getBaseShape('rect'),
        x: 80 / this.scale,
        y: 50 / this.scale,
        width: 200 / this.scale,
        height: 200 / this.scale
      });

      // call update
      this.shapesUpdated();
    },
    addCircle () {
      if (this.isAddingPolygon) return;

      this.shapes.push({
        ...this.getBaseShape('circle'),
        x: 180 / this.scale,
        y: 200 / this.scale,
        radius: 100 / this.scale
      });

      // call update
      this.shapesUpdated();
    },

    addPerson () {
      if (this.isAddingPolygon) return;

      this.shapes.push({
        ...this.getBaseShape('path'),
        x: 80 / this.scale,
        y: 80 / this.scale,
        data: 'm 105.61519,0 a 52.807596,52.807596 0 1 1 0,105.61519 52.807596,52.807596 0 0 1 0,-105.61519 m 0,105.61519 c 58.3524,0 105.61522,23.63141 105.61522,52.8076 V 264.038 H 0 V 158.42279 c 0,-29.17619 47.262803,-52.8076 105.61519,-52.8076 z',
        scale: {
          x: 1 / this.scale,
          y: 1 / this.scale
        }
      });

      // call update
      this.shapesUpdated();
    },

    getBaseShape (type) {
      return {
        type: type,
        name: 'shape-' + (new Date()).valueOf(),
        fill: '#b0c4de',
        opacity: 0.5,
        stroke: '#0000ff',
        draggable: true,
        strokeWidth: 2,
        strokeScaleEnabled: false,
        annotation: {
          title: '',
          text: '',
          linkTitle: '',
          link: ''
        }
      };
    },
    getBaseShapeForPolygon (type) {
      return {
        fill: '#a24545',
        opacity: 0.5,
        stroke: '#800000',
        strokeWidth: 2,
        strokeScaleEnabled: false
      };
    },

    // delete shape
    deleteShape (name) {
      const idx = this.shapes.findIndex(r => r.name === name);
      if (idx >= 0) {
        if (name === this.selectedShapeName) {
          this.selectedShapeName = '';
          this.updateTransformer();
        }

        this.shapes.splice(idx, 1);

        // call update
        this.shapesUpdated();
      }
    },

    // handle key events
    handleKeyEvent (event) {
      // shape selected?
      if (this.editMode && this.selectedShapeName) {
        // delete key pressed?
        if (event.key === 'Delete') this.deleteShape(this.selectedShapeName);
      }
      // TODO only if focued
      /* if (!this.selectedShapeName) {
        if (event.key === '+') this.changeScale(0.1);
      } */
    },

    // handle scaling of canvas
    handleScroll (e) {
      if (e.evt) {
        const event = e.evt;
        event.preventDefault();

        // Normalize wheel to +1 or -1.
        const wheel = event.deltaY < 0 ? 1 : -1;

        // calculate scale
        this.changeScale(wheel * 0.02);
      }
    },
    changeScale (diff) {
      let scale = this.scale + diff;

      // minimum and maximum
      if (scale < 0.1) scale = 0.1;
      if (scale > 5) scale = 5;

      // TODO: easing or timer - https://konvajs.org/docs/tweens/Common_Easings.html
      this.scale = scale;
    },

    // handle manipulation events
    handleDragEnd (event, shape) {
      shape.x = event.currentTarget.attrs.x;
      shape.y = event.currentTarget.attrs.y;

      // call update
      this.shapesUpdated();
    },
    handleTransform (event, shape) {
      shape.rotation = event.currentTarget.attrs.rotation;
      shape.scaleX = event.currentTarget.attrs.scaleX;
      shape.scaleY = event.currentTarget.attrs.scaleY;
      shape.x = event.currentTarget.attrs.x;
      shape.y = event.currentTarget.attrs.y;

      // call update
      this.shapesUpdated();
    },

    // handle show stuff
    handleMouseEnter (name) {
      if (!this.isAddingPolygon) {
        this.$refs.stage.getStage().container().style.cursor = 'pointer';
        this.currentHoverShape = name;
      }
    },
    handleMouseLeave () {
      if (!this.isAddingPolygon) {
        this.$refs.stage.getStage().container().style.cursor = 'default';
        this.currentHoverShape = '';
      }
    },
    handleGlobalMouseEnter () {
      if (this.isAddingPolygon) this.$refs.stage.getStage().container().style.cursor = 'crosshair';
    },
    handleGlobalMouseLeave () {
      if (this.isAddingPolygon) this.$refs.stage.getStage().container().style.cursor = 'default';
    },
    handleSideBarMouseEnter (name) {
      if (!this.isAddingPolygon) {
        const idx = this.shapes.findIndex(r => r.name === name);
        if (idx >= 0) {
          this.shapes[idx].stroke = '#c00';
          this.shapes[idx].fill = '#dec4b0';
        }
      }
    },
    handleSideBarMouseLeave (name) {
      if (!this.isAddingPolygon) {
        const idx = this.shapes.findIndex(r => r.name === name);
        if (idx >= 0) {
          this.shapes[idx].stroke = '#00f';
          this.shapes[idx].fill = '#b0c4de';
        }
      }
    },

    formSubmitted (name) {
      // save correct color
      const idx = this.shapes.findIndex(r => r.name === name);
      if (idx >= 0) {
        this.shapes[idx].stroke = '#00f';
        this.shapes[idx].fill = '#b0c4de';
      }

      // callback/persist
      this.shapesUpdated();
    },

    // toggle shapes shown or not
    toggleShowShapes () {
      // toggle
      this.$refs.items.getStage().canvas._canvas.style.opacity = this.isShapesVisible ? '0' : '1';
      // TODO: fade animation
      this.isShapesVisible = !this.isShapesVisible;
    },

    // callback on update
    shapesUpdated () {
      if (this.callback && typeof this.callback === 'function') {
        this.callback(JSON.stringify(this.shapes));
      }

      // save to local storage, if defined
      if (this.localStorageKey) {
        localStorage.setItem(this.localStorageKey, JSON.stringify(this.shapes));
      }
    },
    load () {
      if (this.initialDataId) {
        const node = document.getElementById(this.initialDataId);
        if (node && node.innerHTML) this.shapes = JSON.parse(node.innerHTML);
      } else if (this.initialData && this.initialData.length > 0) {
        this.shapes = JSON.parse(this.initialData);
      } else if (this.localStorageKey) {
        const data = localStorage.getItem(this.localStorageKey) || '[]';
        this.shapes = JSON.parse(data);
      }

      // if we only show data, remove draggable from it
      if (!this.editMode) {
        this.shapes.forEach(shape => shape.draggable && delete shape.draggable);
      }
    }
  }
};
</script>

<style lang="sass">
.pa-container
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif
  display: grid
  grid-template-columns: 2fr 1fr

.pa-canvas
  border: 1px solid #ccc
  position: relative
  overflow: hidden

.pa-controls
  position: absolute
  z-index: 100
  background-color: white
  padding: 0.3em
  left: 1em
  top: 1em
  border: 1px solid #333
  border-radius: 0.5em

  a
    color: #000
    display: block
    padding: 0.2em

  hr
    color: #000
    padding: 0
    margin: 0.1em 0 0.3em 0

.pa-polygon-hint
  position: absolute
  bottom: 1em
  left: 1em
  background-color: rgba(0, 0, 0, 0.6)
  color: #fff
  padding: 0.5em
  border-radius: 0.5em
  font-size: 90%

.pa-infobar
  margin-left: 5px
</style>
