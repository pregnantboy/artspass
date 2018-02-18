<template>
  <div class="vehicle-div" :class="{'active': inProgress}">
    <img src="../../../icons/svg/cloud2.svg" id="cloud2" class="cloud" />
    <img src="../../../icons/svg/cloud1.svg" id="cloud1" class="cloud" />
    <svg id="road-line">
      <line x1="0" y1="0" x2="400" y2="0" stroke="rgba(206, 117, 16, 0.8)" />
    </svg>
    <img src="../../../icons/svg/tree1.svg" class="tree" style="animation-delay: -2s, 0s" />
    <img src="../../../icons/svg/tree2.svg" class="tree" style="animation-delay: -4s, 0s" />
    <img src="../../../icons/svg/tree3.svg" class="tree" style="animation-delay: -6s, 0s" />

    <svg id="vehicle-shadow">
      <ellipse cx="200" :cy="52" :rx="vehicleWidth/2" :ry="inProgress ? 10 : 6" style="fill:rgba(0,0,0,0.2)" />
    </svg>
    <img :src="svgName" id="vehicle" :style="{ width: vehicleWidth + 'px', left: 'calc(50% - ' + vehicleWidth/2 + 'px)'}" />
  </div>
</template>

<script>
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
        return this.mode === "inprogress"
      },
      svgName: function () {
        let iconArray = ["cycle", "recreational"];
        if (this.size && this.mode !== "new") {
          switch (this.size) {
            case 1:
              iconArray = ["cycle", "recreational"];
              break;
            case 2:
              iconArray = ["motorbiking", "motor-sports"];
              break;
            case 3:
              iconArray = ["automobile-1"];
              break;
            case 4:
              iconArray = ["automobile", "suv"];
              break;
            case 5:
              iconArray = ["tourist"];
              break;
            case 6:
              iconArray = ["tramway", "buses"];
              break;
            case 7:
            default:
              iconArray = ["public-transport", "airplanes", "zeppelins"];
              break;
          };
        }
        return "../../../icons/svg/" + this.getPseudoRandomIcon(iconArray) + ".svg";
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
      getPseudoRandomIcon: function (arrayOfIcons) {
        if (arrayOfIcons.length === 1) {
          return arrayOfIcons[0];
        }
        if (this.mode !=="new" && this.lunchItem && this.lunchItem.lunchtime) {
          let t = this.lunchItem.lunchtime;
          let pseudoRandomNumber = t.getMinutes() + t.getHours() + t.getDate() + t.getMonth() + 1;
          return arrayOfIcons[pseudoRandomNumber % arrayOfIcons.length];
        }
        return arrayOfIcons[Math.floor(Math.random() * arrayOfIcons.length)];
      }
    }
  }
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

.vehicle-div #vehicle-shadow {
  position: absolute;
  top: 140px;
  width: 100%;
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
}

#road-line line {
  transition: stroke-width 1s ease-out;
  stroke-width: 0;
}

.vehicle-div.active #road-line line {
  stroke-width: 300;
}

#cloud2 {
  width: 70px;
  top: 40px;
  animation: cloud-move 28s linear -12s infinite, fade-in 1s linear;
}

#cloud1 {
  width: 100px;
  top: 60px;
  animation: cloud-move 22s linear -2s infinite, fade-in 1s linear;
}

.vehicle-div .cloud {
  transform: translateX(400px);
  display: none;
}

.vehicle-div.active .cloud {
  display: block;
  position: absolute;
}

.vehicle-div .tree {
  display: none;
}

.vehicle-div.active .tree {
  width: 80px;
  top: 200px;
  position: absolute;
  transform: translateX(400px);
  animation-name: tree-move, fade-in;
  animation-iteration-count: infinite, 1;
  animation-duration: 6000ms, 1s;
  animation-timing-function: linear;
  display: block;
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
</style>


