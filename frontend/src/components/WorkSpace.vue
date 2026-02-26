<template>
	<div class="workspace">
		<div class="shape" draggable="false"
			v-for="shape in shapes" :key="shape.uuid"
			@click="$emit('handleSelect', shape.uuid)"
			@mousedown="startDrag($event, shape)"
			:class="[shape.type], {'selected': shape.uuid === selectedShape}"
			:style="{ top: shape.params.y + 'px',
								left: shape.params.x + 'px',
								backgroundColor: shape.params.color,
								width: shape.params.width + 'px',
								height: shape.params.height + 'px',
								zIndex: shape.params.zIndex,
								transform: `rotate(${shape.params.rotate}deg)`,
							}">
		</div>
	</div>
</template>

<script>
export default {
	props: {
		shapes: {
			require: true,
			type: Array
		},
		selectedShape: {
			require: false,
			type: Number
		}
	},
	data() {
		return {
			draggingShape: null,
			offset: { x: 0, y: 0 }
		}
	},
	methods: {
		startDrag(e, shape) {
			this.draggingShape = shape.uuid
			this.offset.x = e.clientX - shape.params.x
			this.offset.y = e.clientY - shape.params.y
		},
		onMove(e) {
			if (!this.draggingShape) return
			
			this.$emit('handleMoveShape', {
				uuid: this.draggingShape,
				x: e.clientX - this.offset.x,
				y: e.clientY - this.offset.y
			})
		},
		stopDragging() {
			this.draggingShape = null
		},
	},
	mounted() {
		window.addEventListener('mousemove', this.onMove)
		window.addEventListener('mouseup', this.stopDragging)
	}
}
</script>

<style scoped>
.workspace {
	width: 100%;
	height: 700px;
	background-color: #fff;

	position: relative;
}
.shape {
	position: absolute;
}
.circle {
	border-radius: 50%;
}
.selected {
	border: 2px red solid;
}
</style>