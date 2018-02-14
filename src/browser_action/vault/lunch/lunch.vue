<template>
	<div style="width: 400px">
		<md-speed-dial class="md-top-right" md-direction="bottom" style="right:8px; top:8px; z-index:5;">
			<md-speed-dial-target class="speeddial-button" style="width:40px;height:40px; box-shadow:none;">
				<md-icon class="md-morph-initial">menu</md-icon>
				<md-icon class="md-morph-final">keyboard_arrow_down</md-icon>
			</md-speed-dial-target>
			<md-speed-dial-content>
				<md-button class="md-icon-button speeddial-button" @click="launchTrain">
					<md-icon>train</md-icon>
				</md-button>

				<md-button class="md-icon-button speeddial-button" @click="openOptions()">
					<md-icon>settings</md-icon>
				</md-button>
			</md-speed-dial-content>
		</md-speed-dial>
		<div id="vehicle-div" style="height:250px;">
			<img src="../../../icons/svg/cycle.svg" id="vehicle" style="height:150px; position:absolute; top: 70px; left: calc(50% - 75px);" />
			<svg id="vehicle=shadow" style="position:absolute; top: 140px;">
				<ellipse cx="200" cy="52" rx="80" ry="6" style="fill:rgba(0,0,0,0.2)" />
			</svg>
		</div>
		<div style="text-align: center;">
			<span class="time-label">Lunch Time</span>
			<br/>
			<md-button class="time-button md-dense">11:15 AM</md-button>
			<md-button class="time-button md-dense active">11:30 AM</md-button>
			<md-button class="time-button md-dense">11:45 AM</md-button>
			<md-button class="time-button md-dense">Custom</md-button>
		</div>
		<div class="start-div">
			<md-button class="md-raised md-dense" id="start-button">Set</md-button>
			<!-- <img id="lever-handle" src="../../../icons/lever-handle.png" @click="pulled=!pulled" :class="{'pulled': pulled}" />
			<img id="lever-base" src="../../../icons/lever-base.png" /> -->
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				pulled: false
			}
		}
	}
</script>

<style scoped>
.speeddial-button {
  color: rgba(0, 0, 0, 0.6);
}

.time-label {
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 2px;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.6);
}

.time-button {
  width: 80px;
  display: inline-block;
  color: var(--vault-color);
  min-width: 60px;
}

.time-button.active {
  border-bottom: 2px solid rgba(var(--theme-color), 0.7);
}

.start-div {
  text-align: center;
}

#start-button {
  background-color: var(--vault-color);
  color: white;
  text-transform: uppercase;
  width: 100px;
  margin: 30px 0;
}

#vehicle {
  animation-name: bounce;
  animation-iteration-count: infinite;
  animation-duration: 3000ms;
  animation-timing-function: ease-out;
}

.lever-div {
  height: 150px;
  width: 100%;
  text-align: center;
}

#lever-handle {
  transform-origin: center bottom;
  transform: rotate(-30deg);
  position: absolute;
  left: calc(50% - 62px);
  bottom: 25px;
  cursor: pointer;
}

#lever-handle:hover {
  animation-name: tilt;
  animation-duration: 200ms;
  animation-timing-function: ease-in-out;
  animation-fill-mode: forwards;
}

#lever-handle.pulled {
  animation-name: pull;
  animation-duration: 400ms;
  animation-timing-function: ease-in;
  animation-fill-mode: forwards;
}

#lever-base {
  position: absolute;
  left: calc(50% - 64px);
  bottom: 10px;
  pointer-events: none;
}

@keyframes tilt {
  from {
    transform: rotate(-30deg);
  }
  to {
    transform: rotate(-20deg);
  }
}

@keyframes pull {
  from {
    transform: rotate(-20deg);
  }
  to {
    transform: rotate(30deg);
  }
}

@keyframes bounce {
  0% {
    transform: translateY(0px);
  }
  10% {
    transform: translateY(-5px);
  }
  20% {
    transform: translateY(0px);
  }
}
</style>
