<template>
  <div :id="containerId">
    <v-stage :config="{
      width: stageSize.width,
      height: stageSize.height,
      scaleX: scale,
      scaleY: scale,
      draggable: true
    }" @mousedown="handleStageMouseDown" @wheel="handleScroll">
      <v-layer>
        <v-image :config="{
            image: image
          }" />
      </v-layer>
      <v-layer ref="layer">
        <v-rect v-for="item in rectangles" :key="item.id" :config="item" />
        <v-circle :config="configCircle"></v-circle>
        <v-transformer ref="transformer" />
      </v-layer>
    </v-stage>
  </div>
</template>

<script>
const width = window.innerWidth;
const height = window.innerHeight;

export default {
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
          fill: 'red',
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
  // mounted live cycle hook
  mounted () {
    document.getElementById(this.containerId).addEventListener('wheel', this.handleScroll);
  },
  beforeDestroy () {
    document.getElementById(this.containerId).removeEventListener('wheel', this.handleScroll);
  },
  methods: {
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
