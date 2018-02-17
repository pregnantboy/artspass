<template>
	<div id="vehicle-div" style="height:250px;">
		
		<img src="../../../icons/svg/cycle.svg" id="vehicle" style="height:150px; position:absolute; top: 70px; left: calc(50% - 75px);" />
		<svg id="vehicle-shadow" style="position:absolute; top: 140px;">
			<ellipse cx="200" cy="52" rx="80" ry="6" style="fill:rgba(0,0,0,0.2)" />
		</svg>
	</div>
</template>

<script>
	export default {

	}
</script>

<style>
#vehicle {
  animation-name: bounce;
  animation-iteration-count: infinite;
  animation-duration: 3000ms;
  animation-timing-function: ease-out;
}
</style>


