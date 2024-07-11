<script setup>
import { onMounted } from 'vue';
import ThreeJSController from './servises/ThreeJS'

onMounted(() => {
  const threeJSController = new ThreeJSController()
  threeJSController.init()
})
</script>

<template>
  <canvas></canvas>
</template>

<style scoped>
canvas {
  position: absolute;
}
</style>
