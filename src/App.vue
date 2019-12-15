<template>
  <div :id="containerId" class="pa-container">
    <div class="pa-controls">
      <a href="#" @click.prevent="changeScale(0.1)" :title="$t('zoom_in')"><icon type="zoom-in" /></a>
      <a href="#" @click.prevent="changeScale(-0.1)" :title="$t('zoom_out')"><icon type="zoom-out" /></a>
      <hr />
      <a href="#" @click.prevent="addPolygon" :title="$t('add_polygon')"><icon type="add-polygon" /></a>
      <a href="#" @click.prevent="addRectangle" :title="$t('add_rectangle')"><icon type="add-rectangle" /></a>
      <a href="#" @click.prevent="addCircle" :title="$t('add_circle')"><icon type="add-circle" /></a>
      <a href="#" @click.prevent="addPerson" :title="$t('add_person')"><icon type="add-person" /></a>
      <hr />
      <a href="#" @click.prevent="openAnnotation(selectedShapeName)" :title="$t('open_annotation')"><icon type="edit-shape" :fill="selectedShapeName ? 'green' : 'gray'" /></a>
      <a href="#" @click.prevent="deleteShape(selectedShapeName)" :title="$t('delete_shape')"><icon type="delete-shape" :fill="selectedShapeName ? 'red' : 'gray'" /></a>
    </div>

    <v-stage :config="{
      width: stageSize.width,
      height: stageSize.height,
      scaleX: scale,
      scaleY: scale,
      draggable: true
    }" @mousedown="handleStageMouseDown" @wheel="handleScroll">
      <v-layer ref="background">
        <v-image :config="{
            image: image
          }" />
      </v-layer>
      <v-layer ref="items">
        <template v-for="shape in shapes">
          <v-rect v-if="shape.type === 'rect'" :config="shape" :key="shape.name" @dblclick="openAnnotation($event, shape.name)" @contextmenu="openContextMenu($event, shape.name)" @dragend="handleDragEnd($event, shape)" @transformend="handleTransform($event, shape)" />
          <v-circle v-if="shape.type === 'circle'" :config="shape" :key="shape.name" @dblclick="openAnnotation($event, shape.name)" @contextmenu="openContextMenu($event, shape.name)" @dragend="handleDragEnd($event, shape)" @transformend="handleTransform($event, shape)" />
          <v-line v-if="shape.type === 'poly'" :config="shape" :key="shape.name" @dblclick="openAnnotation($event, shape.name)" @contextmenu="openContextMenu($event, shape.name)" @dragend="handleDragEnd($event, shape)" @transformend="handleTransform($event, shape)" />
          <v-path v-if="shape.type === 'path'" :config="shape" :key="shape.name" @dblclick="openAnnotation($event, shape.name)" @contextmenu="openContextMenu($event, shape.name)" @dragend="handleDragEnd($event, shape)" @transformend="handleTransform($event, shape)" />
        </template>
        <v-transformer ref="transformer"/>
      </v-layer>
    </v-stage>

    <vue-simple-context-menu
      :elementId="containerId + '-ctx-menu'"
      :options="[{name: $t('edit'), action: 'edit'}, {name: $t('delete'), action: 'delete'}]"
      :ref="'vueSimpleContextMenu'"
      @option-clicked="contextMenuClicked"
    />

    <div class="pa-modal" v-show="showModal">
      <div class="pa-modal-content">
        <span class="pa-close" @click="showModal = false">&times;</span>
        <p>TODO: Formular einfügen.</p>
        <p>Some text in the Modal..</p>
        <p>Some text in the Modal..</p>
        <p>Some text in the Modal..</p>
        <p>Some text in the Modal..</p>
      </div>
    </div>
  </div>
</template>

<script>
import Icon from './components/Icon';

const width = window.innerWidth;
const height = window.innerHeight;

export default {
  components: {
    Icon
  },
  props: ['language', 'containerId', 'imageSrc', 'dataCallback', 'localStorageKey'],
  data () {
    return {
      image: null,
      stageSize: {
        width: width,
        height: height
      },
      scale: 1, // current scale
      shapes: [], // shape container
      selectedShapeName: '', // currently selected shape
      showModal: false // modal is shown?
    };
  },
  // created live cycle hook
  created () {
    // load image
    const image = new window.Image();
    image.src = this.imageSrc;
    image.onload = () => {
      // set image only when it is loaded
      this.image = image;
      // adapt initial scale to fit canvas
      this.changeScale(-Math.max(width / image.width, height / image.height));
    };
  },
  mounted () {
    document.addEventListener('keydown', this.handleKeyEvent);

    // set language
    if (this.language) {
      this.$i18n.locale = this.language;
    }

    // try to load from local storage
    this.load();
  },
  beforeDestroy () {
    document.removeEventListener('keydown', this.handleKeyEvent);
  },
  methods: {
    // handle transformation of elements
    handleStageMouseDown (e) {
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

      // find clicked shape by its name
      const name = e.target.name();
      const shape = this.shapes.find(r => r.name === name);
      if (shape) {
        this.selectedShapeName = name;
      } else {
        this.selectedShapeName = '';
      }

      this.updateTransformer();
    },
    updateTransformer () {
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

    // handle additions
    addPolygon () {
      this.shapes.push({
        ...this.getBaseShape('poly'),
        points: [23, 20, 23, 160, 70, 93, 150, 109, 290, 139, 270, 93], // TODO: addPoly Layer + Function
        closed: true,
        x: 150,
        y: 150
      });

      // call update
      this.shapesUpdated();
    },
    addRectangle () {
      this.shapes.push({
        ...this.getBaseShape('rect'),
        x: 150,
        y: 150,
        width: 100,
        height: 100
      });

      // call update
      this.shapesUpdated();
    },
    addCircle () {
      this.shapes.push({
        ...this.getBaseShape('circle'),
        x: 150,
        y: 150,
        radius: 100
      });

      // call update
      this.shapesUpdated();
    },

    addPerson () {
      this.shapes.push({
        ...this.getBaseShape('path'),
        x: 250,
        y: 250,
        data: 'm 105.61519,0 a 52.807596,52.807596 0 1 1 0,105.61519 52.807596,52.807596 0 0 1 0,-105.61519 m 0,105.61519 c 58.3524,0 105.61522,23.63141 105.61522,52.8076 V 264.038 H 0 V 158.42279 c 0,-29.17619 47.262803,-52.8076 105.61519,-52.8076 z',
        scale: {
          x: 2,
          y: 2
        }
      });

      // call update
      this.shapesUpdated();
    },

    getBaseShape (type) {
      return {
        type: type,
        name: 'shape-' + (new Date()).valueOf(),
        fill: 'lightsteelblue',
        opacity: 0.5,
        stroke: 'blue',
        draggable: true,
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
      if (this.selectedShapeName) {
        // delete key pressed?
        if (event.key === 'Delete') this.deleteShape(this.selectedShapeName);
      }
      if (this.showModal) { // modal shown
        if (event.key === 'Escape') this.showModal = false;
      }
    },

    // handle scaling of canvas
    handleScroll (e) {
      if (e.evt) {
        const event = e.evt;

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

      // call update
      this.shapesUpdated();
    },

    // annotation handling
    openAnnotation (event, name) {
      if (event && event.evt) event.evt.preventDefault();

      this.showModal = true;
    },

    // open context menu handling
    openContextMenu (eventAll, name) {
      if (eventAll.evt) {
        const event = eventAll.evt;
        event.preventDefault();

        this.$refs.vueSimpleContextMenu.showMenu(event, name);
      }
    },
    contextMenuClicked (event) {
      if (event.option && event.option.name) {
        switch (event.option.action) {
          case 'edit':
            this.openAnnotation(null, this.selectedShapeName);
            break;
          case 'delete':
            this.deleteShape(this.selectedShapeName);
            break;
        }
      }
    },

    // callback on update
    shapesUpdated () {
      if (this.dataCallback && typeof this.dataCallback === 'function') {
        this.dataCallback(JSON.stringify(this.shapes));
      }

      // save to local storage, if defined
      if (this.localStorageKey) {
        localStorage.setItem(this.localStorageKey, JSON.stringify(this.shapes));
      }
    },
    load () {
      if (this.localStorageKey) {
        const data = localStorage.getItem(this.localStorageKey) || '[]';
        this.shapes = JSON.parse(data);
      }
    }
  }
};
</script>

<style lang="sass">
.pa-container
  position: relative

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

.pa-modal
  // display: none
  position: fixed
  z-index: 101
  left: 0
  top: 0
  width: 100%
  height: 100%
  background-color: rgb(0,0,0)
  background-color: rgba(0,0,0,0.4)

.pa-modal-content
  background-color: #fefefe
  margin: 15% auto
  padding: 20px
  border: 1px solid #888
  width: 80%

.pa-close
  color: #aaa
  float: right
  font-size: 28px
  font-weight: bold

.pa-close:hover, .pa-close:focus
  color: black
  text-decoration: none
  cursor: pointer
</style>
