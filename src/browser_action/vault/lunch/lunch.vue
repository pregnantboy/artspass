<template>
	<div style="width: 450px">
		<div id="train-gif" style="height:300px">
		</div>
		<div class="lunch-div">
			<span class="lunch-label">Departure Time</span>
			<br/>
			<md-button class="time-button">11:15 AM</md-button>
			<md-button class="time-button active">11:30 AM</md-button>
			<md-button class="time-button">11:45 AM</md-button>
			<md-button class="time-button" style="width: 30px">Custom</md-button>
		</div>
		<div class="lever-div">
			<!-- <md-button id="start-button">All Aboard!</md-button> -->
			<img id="lever-handle" src="../../../icons/lever.png" />
			<br/>
			<img id="lever-base" src="../../../icons/leverbase.png" />
		</div>
	</div>
</template>

<script>
	export default {

	}
</script>

<style scoped>
.lunch-label {
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 2px;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.6);
}

.lunch-div {
  text-align: center;
}

.lever-div {
  text-align: center;
  height: 150px;
}

.time-button {
  width: 80px;
  display: inline-block;
  color: var(--vault-color);
}

.time-button.active {
  border: 2px solid rgba(var(--theme-color), 0.7);
}

#start-button {
  /* color: white;
  background-color: var(--vault-color); */
  text-transform: uppercase;
  width: 140px;
  margin: 30px 0;
}

#lever-handle {
  transform-origin: center bottom;
  margin-bottom: -1.5px;
  transform: rotate(-85deg);
}

#lever-base {
	position: absolute;
	bottom:0;
}
</style>
