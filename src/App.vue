<template>
  <div :id="containerId" class="pa-container">
    <div class="pa-controls">
      <a href="#" @click.prevent="addPolygon"><icon type="add-polygon" /></a>
      <a href="#" @click.prevent="addRectangle"><icon type="add-rectangle" /></a>
      <a href="#" @click.prevent="addCircle"><icon type="add-circle" /></a>
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
        <v-rect v-for="item in rectangles" :key="item.id" :config="item" />
        <v-circle :config="configCircle"></v-circle>
        <v-transformer ref="transformer" />
      </v-layer>
    </v-stage>
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
  data () {
    return {
      containerId: 'xxyyzz', // dummy, set later TODO
      image: null,
      stageSize: {
        width: width,
        height: height
      },
      scale: 1,
      configCircle: {
        x: 100,
        y: 100,
        radius: 70,
        fill: 'red',
        stroke: 'black',
        strokeWidth: 4,
        draggable: true,
        name: 'circle1'
      },
      rectangles: [
        {
          x: 10,
          y: 10,
          width: 100,
          height: 100,
          fill: 'blue',
          opacity: 0.5,
          name: 'rect1',
          draggable: true
        },
        {
          x: 150,
          y: 150,
          width: 100,
          height: 100,
          fill: 'green',
          name: 'rect2',
          draggable: true
        }
      ],
      selectedShapeName: ''
    };
  },
  // created live cycle hook
  created () {
    const image = new window.Image();
    image.src = './example/example.jpg';
    image.onload = () => {
      // set image only when it is loaded
      this.image = image;
    };
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

      // find clicked rect by its name
      const name = e.target.name();
      const rect = this.rectangles.find(r => r.name === name);
      if (rect) {
        this.selectedShapeName = name;
      } else {
        this.selectedShapeName = '';
      }

      // find circle
      if (!this.selectedShapeName && name === this.configCircle.name) {
        this.selectedShapeName = name;
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
      console.log('addPolygon');
      // TODO
    },
    addRectangle () {
      // TODO
      console.log('addRectangle');
      this.rectangles.push({
        x: 150,
        y: 150,
        width: 100,
        height: 100,
        fill: 'green',
        name: 'rect3',
        draggable: true
      });
    },
    addCircle () {
      // TODO
      console.log('addCircle');
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

      this.scale = scale;
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
</style>
