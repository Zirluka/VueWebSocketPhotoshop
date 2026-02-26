<template>
	<div class="sidemenu">
		<form @submit.prevent>
			<!-- Select which shape need to create -->
			<select v-model="currentShape">
				<option value="rectangle">rectangle</option>
				<option value="circle">circle</option>
			</select>
			<!-- Rect Inputs -->
			<div class="square-inputs shape-inputs" v-if="currentShape === 'rectangle'">
				<div class="label-div">
					<!-- Width -->
					<label for="rectWidth">Width</label>
					<input type="number" id="rectWidth" min="1" v-model="params.width">
				</div>
				<div class="label-div">
					<!-- Height -->
					<label for="rectHeight">Height</label>
					<input type="number" id="rectHeight" min="1" v-model="params.height">
				</div>
				<div class="label-div">
					<!-- Color -->
					<label for="rectColor">Color</label>
					<input type="color" id="rectColor" v-model="params.color">
				</div>
				<div class="label-div">
					<!-- X -->
					<label for="rectX">X</label>
					<input type="number" id="rectX" min="0" v-model="params.x">
				</div>
				<div class="label-div">
					<!-- Y -->
					<label for="rectY">Y</label>
					<input type="number" id="rectY" min="0" v-model="params.y">
				</div>
				<div class="label-div">
					<!-- Rotate -->
					<label for="rectY">Rotate in deg</label>
					<input type="number" id="rectRotate" v-model="params.rotate">
				</div>
			</div>
			<!-- Circle Inputs -->
			<div class="circle-inputs shape-inputs" v-if="currentShape === 'circle'">
				<div class="label-div">
					<!-- Radius -->
					<label for="circleRadius">Radius</label>
					<input type="number" id="circleRadius" min="1" v-model="params.width">
				</div>
				<div class="label-div">
					<!-- Color -->
					<label for="circleColor">Color</label>
					<input type="color" id="circleColor" v-model="params.color">
				</div>
				<div class="label-div">
					<!-- X -->
					<label for="circleX">X</label>
					<input type="number" id="circleX" min="0" v-model="params.x">
				</div>
				<div class="label-div">
					<!-- Y -->
					<label for="circleY">Y</label>
					<input type="number" id="circleY" min="0" v-model="params.y">
				</div>
			</div>
			<!-- Create btn -->
			<div class="btns">
				<button @click="createShape">Create Shape</button>
				<button @click="editShape">Edit Shape</button>
				<button @click="$emit('handleUnselect')">Unselect</button>
			</div>
		</form>
		<div class="shapes_list">
			<div class="shape_item" 
			v-for="shape in sortedShaped" :key="shape.uuid"
			@click="$emit('handleSelect', shape.uuid)"
			:class="{'selected': shape.uuid === selectedShape}">
				<p>{{ shape.uuid }}</p>
				<button @click="$emit('handleShapeUp', {'uuid' : shape.uuid})">Up</button>
				<button @click="$emit('handleShapeDown', {'uuid' : shape.uuid})">down</button>
				<button @click="$emit('handleDelete', {'uuid' : shape.uuid})">Delete Shape</button>
			</div>
		</div>
	</div>
</template>

<script>

export default {
	emits: [
		'handleCreate',
		'handleUnselect', 
		'handleEdit',
		'handleDelete',
		'handleShapeUp', 
		'handleShapeDown',
		'handleSelect'
	],
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
			currentShape: 'rectangle',
			uuid : null,
			params: {
				'width': 1,
				'height': 1,
				'color': '#000',
				'x': 0,
				'y': 0,
				'zIndex' : 50000,
				'rotate' : 0
			},
		}
	},
	methods: {
		createShape() {
			let paramsCopy = JSON.parse(JSON.stringify(this.params))
			if (this.currentShape === 'circle') {
				paramsCopy.width = this.params.width * 2
				paramsCopy.height = this.params.width * 2
			}
			this.$emit('handleCreate', {
				'type' : this.currentShape,
				'params' : paramsCopy
			})
		},
		editShape() {
			let paramsCopy = JSON.parse(JSON.stringify(this.params))
			if (this.currentShape === 'circle') {
				paramsCopy.width = this.params.width * 2
				paramsCopy.height = this.params.width * 2
			}
			this.$emit('handleEdit', paramsCopy)
		},
		
	},
	computed: {
		sortedShaped() {
			return this.shapes.sort(
				(a, b) => b.params.zIndex - a.params.zIndex
			)
		}
	}
}
</script>

<style scoped>
.sidemenu {
	width: 100%;
	background-color: #c6c6c6;
	padding: 15px 10px;

	z-index: 100000;

	display: grid;
	grid-template-columns: 1fr 300px;
}
.shapes_list {
	height: 100%;
	overflow-y: scroll;
}
.shape_item {
	border: 1px #000 dashed;
	padding: 10px 5px;
	margin-bottom: 10px;
}
.shape_item button {
	margin-left: 5px;
}
.sidemenu form {
	display: flex;
	flex-direction: column;
	gap: 10px;
}
select {
	width: fit-content;
	padding: 5px 10px;
}
.shape-inputs {
	display: flex;
	align-items: center;
}
.shape-inputs label {
	margin-right: 5px;
	margin-left: 20px;
}
.shape-inputs label:nth-child(1) {
	margin-left: 0;
}
button {
	width: fit-content;
	padding: 5px 10px;
}
.btns button {
	margin-right: 10px;
}
.selected {
	border-color: red;
}
</style>