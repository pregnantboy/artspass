<template>
  <div style="width: 400px; height: 400px">
    <md-speed-dial class="md-top-right" md-direction="bottom" style="right:8px; top:8px; z-index:5;">
      <md-speed-dial-target class="speeddial-button" style="width:40px;height:40px; box-shadow:none;">
        <md-icon class="md-morph-initial">menu</md-icon>
        <md-icon class="md-morph-final">keyboard_arrow_down</md-icon>
      </md-speed-dial-target>
      <md-speed-dial-content>
        <md-button class="md-icon-button speeddial-button" @click="naviagateToVault()">
          <md-icon>vpn_key</md-icon>
        </md-button>

        <md-button class="md-icon-button speeddial-button" @click="openOptions()">
          <md-icon>settings</md-icon>
        </md-button>
      </md-speed-dial-content>
    </md-speed-dial>
    <lunch-vehicle></lunch-vehicle>
    <div style="text-align: center;">
      <span class="time-label">Lunch Time</span>
      <br/>
      <md-button v-for="(time, index) in timeOptions" :key="index" class="time-button md-dense" @click="selectedTime = time" :class="{'active': selectedTime === time }">{{ time | formatTime }}</md-button>
      <md-button class="time-button md-dense" :class="{'active': selectedTime === customTimeLabel }" @click="showDialog = true">{{ customTimeLabel | formatTime }}</md-button>
    </div>
    <div class="start-div">
      <md-button class="md-raised md-dense" id="start-button" @click="start">Set</md-button>
    </div>
    <md-dialog :md-active.sync="showDialog" style="height: 200px; width: 240px;">
      <timepicker @customTime="setCustomTime"></timepicker>
    </md-dialog>
  </div>
</template>

<script>
  import Timepicker from "./timepicker.vue";
  import LunchVehicle from "./lunch-vehicle.vue";

  const startLunch = chrome.extension.getBackgroundPage().startLunch;

  export default {
    data() {
      return {
        currentLunchItem: null,
        mode: "new", // new, inprogress, ended
        timeOptions: [],
        selectedTime: null,
        showDialog: false,
        customTimeLabel: "CUSTOM"
      };
    },
    filters: {
      formatTime: function (value) {
        if (value instanceof Date) {
          return value.toLocaleTimeString("en-US", {
            hour: "numeric",
            hour12: true,
            minute: "numeric"
          });
        } else {
          return value;
        }
      }
    },
    components: {
      "timepicker": Timepicker,
      "lunch-vehicle": LunchVehicle
    },
    methods: {
      notify: function () {
        // chrome.extension.getBackgroundPage().createNotification();
        chrome.notifications.create("randomid", {
          type: "image",
          iconUrl: "../../../icons/icon48.png",
          imageUrl: "../../../icons/svg/cycle.svg",
          title: "hello23",
          message: "goodbye",
          buttons: [
            {
              title: "YES",
              iconUrl: "../../../icons/icon48.png"
            },
            {
              title: "NO",
              iconUrl: "../../../icons/icon48.png"
            }
          ],
          isClickable: true
        });
      },
      start: function () {
        if (this.selectedTime) {
          console.log("starting lunch at", this.selectedTime);
          startLunch(Date.parse(this.selectedTime));
        }
      },
      openOptions: function () {
        chrome.runtime.openOptionsPage();
      },
      naviagateToVault: function () {
        this.$root.$data.page = "vault";
      },
      initView: function () {
        console.log("reached here");
        if (
          !this.currentLunchItem ||
          new Date() - this.currentLunchItem.Date > 60000
        ) {
          // no item or expired for more than 10 minutes
          this.mode = "new";
          this.timeOptions = getTimeOptions();
          console.log("reached 2", this.timeOptions);
          return;
        }
        if (this.currentLunchItem.Date - new Date() > 0) {
          this.mode = "inprogress";
        } else {
          this.mode = "ended";
        }
      },
      setCustomTime: function (customTime) {
        this.showDialog = false;
        this.selectedTime = customTime;
        this.customTimeLabel = customTime;
      }
    },
    created: function () {
      this.currentLunchItem = chrome.extension.getBackgroundPage().currentLunchItem;
      this.initView();
      chrome.runtime.onMessage.addListener(function (message) {
        if (event === "lunch-update") {
          this.currentLunchItem = chrome.extension.getBackgroundPage().currentLunchItem;
          this.initView();
        }
      });
    }
  };

  function getTimeOptions() {
    let currentTime = new Date();
    currentTime.setSeconds(0, 0);
    let timeToNextTimeOption = (15 - currentTime.getMinutes() % 15 || 15);
    let timeOptions = [];
    [0, 15, 30].forEach(timeAddition => {
      timeOptions.push(
        new Date(
          currentTime.getTime() + (timeToNextTimeOption + timeAddition) * 60000
        )
      );
    });
    return timeOptions;
  }
</script>

<style scoped src="lunch.css"></style>
