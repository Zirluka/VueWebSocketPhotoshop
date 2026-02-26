<template>
  <WorkSpace
    :shapes="shapes"
    :selectedShape="selectedShape"
    @handleSelect="selectShape"
    @handleMoveShape="moveShape"
    />
    <SideMenu 
    @handleCreate="createShape"
    @handleEdit="editShape"
    @handleUnselect="unselectShape"
    @handleDelete="deleteShape"
    :shapes="shapes"
    :selectedShape="selectedShape"
    @handleSelect="selectShape"
    @handleShapeDown="changeLayerDown"
    @handleShapeUp="changeLayerUp"
  />
</template>

<script>
// Import components
import WorkSpace from '@/components/WorkSpace.vue'
import SideMenu from '@/components/SideMenu.vue'
import { toRaw } from 'vue'

export default {
  // Init components
  components: {
    WorkSpace,
    SideMenu
  },
  // data
  data() {
    return {
      // websocket
      ws: null,
      // All shapes[{'x', 'y'...}, {}...]
      shapes: [],
      // Selected Shape
      selectedShape: null,
    }
  },
  // Methods
  methods: {
    sendMessage(message) {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        message = JSON.stringify(message)
        this.ws.send(message)
      }
    },
    moveShape(shape_move) {
      let shape = this.shapes.find(s => s.uuid === shape_move.uuid)
      console.log(shape)
      if (!shape) return

      shape.params.x = shape_move.x
      shape.params.y = shape_move.y

      this.sendMessage({
        type: "MOVE_SHAPE",
        payload: shape_move
      })
    },
    selectShape(shape_uuid) {
      if (this.selectedShape === shape_uuid) {
        this.selectedShape = null
        return
      }
      this.selectedShape = shape_uuid
    },
    createShape(shape_params) {
      shape_params.uuid = Date.now()
      this.sendMessage({
        type: "CREATE_SHAPE",
        payload: shape_params
      })
    },
    editShape(shape_params) {
      this.sendMessage({
        type: "UPDATE_SHAPE",
        payload: {
          'uuid': this.selectedShape,
          'params': shape_params
        }
      })
    },
    unselectShape() {
      this.selectedShape = null
    },
    deleteShape(msg) {
      this.sendMessage({
            type: "DELETE_SHAPE",
            payload: {
              'uuid': msg.uuid
            }
          })
    },
    changeLayerUp(msg) {
      msg['type'] = 'up'
      this.sendMessage({
        type: "ChangeLayer",
        payload: msg
      })
    },
    changeLayerDown(msg) {
      msg['type'] = 'down'
      this.sendMessage({
        type: "ChangeLayer",
        payload: msg
      })
    },
  },
  // onMount
  mounted() {
    this.ws = new WebSocket('http://localhost:3000')

    this.ws.onopen = () => {
      console.log('connected successful')

      this.ws.onmessage = (data) => {
        const msg = JSON.parse(data.data)

        switch (msg.type) {
          case "CREATE_SHAPE":
            this.shapes.push(msg.payload)
            break;
          case "UPDATE_SHAPE": {
              let shape = this.shapes.find(s => s.uuid === msg.payload.uuid)
              if (!shape) return
              shape.params = msg.payload.params
            }
            break;
          case "MOVE_SHAPE": {
              let shape = this.shapes.find(s => s.uuid === msg.payload.uuid)
              if (!shape) return
              shape.params.x = msg.payload.x
              shape.params.y = msg.payload.y
            }
            break;
          case "DELETE_SHAPE": {
              for (let index = 0; index < this.shapes.length; index++) {
                if (this.shapes[index].uuid === msg.payload.uuid) {
                  this.shapes.splice(index, 1)
                }
              }
            }
            break;
          case "ChangeLayer": {
              let shape = this.shapes.find(s => s.uuid === msg.payload.uuid)
              if (!shape) return
              if (msg.payload.type === 'up') {
                shape.params.zIndex += 1
                return
              }
              if (msg.payload.type === 'down') {
                shape.params.zIndex -= 1
                return
              }
            }
          break;
        }
      }
    }
  }
}
</script>

<style>
* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}
body {
	width: 100vw;
	background-color: #6d107e;
	background: linear-gradient(0deg, #6d107e, #f03358);
}
#app {
	width: 100%;
	height: 100%;

	display: grid;
  grid-template-rows: 1fr 300px;
}
</style>
