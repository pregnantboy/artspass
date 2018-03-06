<template>
  <div class="vehicle-div" :class="{'active': inProgress || hasCompleted, 'completed': hasCompleted}">
    <img src="../../../icons/svg/cloud2.svg" id="cloud2" class="cloud" />
    <img src="../../../icons/svg/cloud1.svg" id="cloud1" class="cloud" />
    <img src="../../../icons/svg/cloud2.svg" id="cloud4" class="cloud" v-if="hasCompleted" />
    <img src="../../../icons/svg/cloud1.svg" id="cloud3" class="cloud" v-if="hasCompleted" />
    <svg id="road-line">
      <line x1="0" y1="0" x2="400" y2="0" stroke="rgba(206, 117, 16, 0.8)" />
    </svg>
    <img src="../../../icons/svg/tree1.svg" class="tree" id="tree1" />
    <img src="../../../icons/svg/tree2.svg" class="tree" id="tree2" />
    <img src="../../../icons/svg/tree3.svg" class="tree" id="tree3" />
    <img src="../../../icons/svg/tree2.svg" id="tree4" v-if="hasCompleted" />
    <img src="../../../icons/svg/tree3.svg" id="tree5" v-if="hasCompleted" />
    <img src="../../../icons/svg/cafe.svg" id="cafe" v-if="hasCompleted" />
    <span id="lunch-place" v-if="hasCompleted">LUNCH</span>
    <svg id="vehicle-shadow">
      <ellipse cx="200" :cy="52" :rx="vehicleWidth/2" :ry="inProgress ? 10 : 6" style="fill:rgba(0,0,0,0.2)" />
    </svg>
    <img :src="svgName" id="vehicle" :style="{ width: vehicleWidth + 'px', left: 'calc(200px - ' + vehicleWidth/2 + 'px)'}" />
  </div>
</template>

<script>
  const getIcon = chrome.extension.getBackgroundPage().getIcon;

  export default {
    props: ["mode", "lunchItem"],
    computed: {
      size: function () {
        if (this.lunchItem && this.lunchItem.participants) {
          return this.lunchItem.participants.length;
        } else {
          return 1;
        }
      },
      inProgress: function () {
        return this.mode === "inprogress";
      },
      hasCompleted: function () {
        return this.mode === "ended";
      },
      svgName: function () {
        let size = (this.mode === "new") ? 0 : this.size;
        let lunchtime = this.lunchItem ? this.lunchItem.lunchtime : null;
        console.log(getIcon(size, lunchtime));
        return (
          "../../../icons/svg/" + getIcon(size, lunchtime) + ".svg"
        );
      },
      vehicleWidth: function () {
        if (!this.size || this.mode === "new") {
          return 150;
        }
        switch (this.size) {
          case 1:
          case 2:
            return 150;
          case 3:
          case 4:
          case 5:
            return 200;
          case 6:
            return 250;
          case 7:
          default:
            return 300;
        }
      }
    },
    methods: {
    
    }
  };
</script>

<style>
.vehicle-div {
  height: 250px;
}

.vehicle-div.active {
  height: 310px;
  background: white;
  transition: all 1s linear;
}

.vehicle-div #vehicle {
  position: absolute;
  bottom: 207px;
  animation-name: bounce;
  animation-iteration-count: infinite;
  animation-duration: 3000ms;
  animation-timing-function: ease-out;
  transition: bottom 1s linear, width 0.3s ease, left 0.3s ease;
}

.vehicle-div.active #vehicle {
  bottom: 108px;
  width: 150px;
  left: calc(100% - 75px);
  animation-name: bounce-faster;
  animation-iteration-count: infinite;
  animation-duration: 4000ms;
  animation-timing-function: ease-out;
}

.vehicle-div.active.completed #vehicle,
.vehicle-div.active.completed #vehicle-shadow {
  animation: fade-out 1s linear 0.5s forwards;
}

.vehicle-div #vehicle-shadow {
  position: absolute;
  top: 140px;
  width: 100%;
  left: 0;
  transition: all 1s linear;
}

.vehicle-div #vehicle-shadow ellipse {
  transition: all 0.3s ease;
}

.vehicle-div.active #vehicle-shadow {
  top: 240px;
}

#road-line {
  position: absolute;
  top: 275px;
  width: 100%;
  left: 0;
}

#road-line line {
  transition: stroke-width 1s ease-out;
  stroke-width: 0;
}

.vehicle-div.active #road-line line {
  stroke-width: 300;
}

.vehicle-div.active #cloud2 {
  width: 70px;
  top: 40px;
  animation: cloud-move 28s linear -12s infinite, fade-in 1s linear;
}

.vehicle-div.active #cloud1 {
  width: 100px;
  top: 60px;
  animation: cloud-move 22s linear -2s infinite, fade-in 1s linear;
}

.vehicle-div.active.completed #cloud2 {
  animation: cloud-move 28s linear -12s, fade-out 1s linear 0.5s forwards;
}

.vehicle-div.active.completed #cloud1 {
  animation: cloud-move 22s linear -2s, fade-out 1s linear 0.5s forwards;
}

.vehicle-div.active.completed #cloud4 {
  width: 70px;
  left: -60px;
  top: 10px;
}

.vehicle-div.active.completed #cloud3 {
  width: 100px;
  left: -426px;
  top: 40px;
}

.vehicle-div .cloud {
  transform: translateX(400px);
  display: none;
}

.vehicle-div.active .cloud {
  display: block;
  position: absolute;
}

.vehicle-div:not(.active) .tree {
  display: none;
}

.vehicle-div.active .tree {
  width: 80px;
  top: 200px;
  position: absolute;
  transform: translateX(400px);
  animation-name: tree-move, fade-in;
  animation-iteration-count: infinite, 1;
  animation-duration: 6s, 1s;
  animation-timing-function: linear;
}

.vehicle-div.active #tree1 {
  animation-delay: -2s, 0s;
}

.vehicle-div.active #tree2 {
  animation-delay: -4s, 0s;
}

.vehicle-div.active #tree3 {
  animation-delay: -1ms, 0s;
}

.vehicle-div.active.completed #tree1 {
  animation: tree-move 6s linear -2s, fade-out 1s linear 0.5s forwards;
}

.vehicle-div.active.completed #tree2 {
  animation: tree-move 6s linear -4s, fade-out 1s linear 0.5s forwards;
}

.vehicle-div.active.completed #tree3 {
  animation: tree-move 6s linear 0s, fade-out 1s linear 0.5s forwards;
}

.vehicle-div.active.completed #tree4 {
  position: absolute;
  width: 80px;
  top: 200px;  
  left: 0;
}

.vehicle-div.active.completed #tree5 {
  position: absolute;
  width: 80px;
  top: 200px;  
  left: 300px;
}

.vehicle-div.active.completed #cloud3,
.vehicle-div.active.completed #cloud4,
.vehicle-div.active.completed #tree4,
.vehicle-div.active.completed #tree5 {
  opacity: 0;
  animation: fade-in 1s linear 2.5s forwards;
}

#cafe {
  height: 250px;
  position: absolute;
  left: 75px;
  top: 58px;
}

#lunch-place {
  position: absolute;
  top: 88px;
  left: 132px;
  text-align: center;
  width: 147px;
  font-weight: 500;
  font-size: 20px;
  line-height: 21px;
  overflow: hidden;
}

#lunch-place,
#cafe {
  animation: fade-in 1s linear 2s forwards;
  opacity: 0;
}

@keyframes bounce {
  0% {
    transform: translateY(0px);
  }
  10% {
    transform: translateY(-3px);
  }
  20% {
    transform: translateY(0px);
  }
}

@keyframes bounce-faster {
  0% {
    transform: translateY(0px);
  }
  2% {
    transform: translateY(-3px);
  }
  4% {
    transform: translateY(0px);
  }
  6% {
    transform: translateY(-3px);
  }
  8% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(0px);
  }
  52% {
    transform: translateY(-3px);
  }
  54% {
    transform: translateY(0px);
  }
}

@keyframes cloud-move {
  from {
    transform: translateX(400px);
  }
  to {
    transform: translateX(-200px);
  }
}

@keyframes tree-move {
  from {
    transform: translateX(400px);
  }
  to {
    transform: translateX(-100px);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fade-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

@keyframes cloud-sway {
  0% {
    transform: translateX(-20px);
  }
  50% {
    transform: translateX(20px);
  }
  100% {
    transform: translateX(-20px);
  }
}
</style>


