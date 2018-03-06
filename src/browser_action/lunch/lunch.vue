<template>
  <div style="width: 400px; height: 400px; overflow: hidden; user-select: none;">
    <md-speed-dial class="md-top-right" md-direction="bottom" style="left:353px; top:8px; z-index:5; position: relative; float:left">
      <md-speed-dial-target class="speeddial-button" style="width:40px;height:40px; box-shadow:none;">
        <md-icon class="md-morph-initial">menu</md-icon>
        <md-icon class="md-morph-final">keyboard_arrow_down</md-icon>
      </md-speed-dial-target>
      <md-speed-dial-content>
        <md-button class="md-icon-button speeddial-button" style="background-color: white;" @click="naviagateToVault()">
          <md-icon>fingerprint</md-icon>
        </md-button>

        <md-button class="md-icon-button speeddial-button" style="background-color: white;" @click="openOptions()">
          <md-icon>settings</md-icon>
        </md-button>
      </md-speed-dial-content>
    </md-speed-dial>
    <lunch-vehicle :mode="mode" :lunchItem="currentLunchItem"></lunch-vehicle>
    <div style="text-align: center; position: relative;">
      <span class="time-label" :class="{'in-progress':!isNew}">Lunch Time</span>
      <span class="time-label in-progress" v-if="inProgress">: {{ currentLunchItem.lunchtime | formatTime }} </span>
      <span class="time-label in-progress" v-if="hasCompleted"> !</span>
      <br/>
      <div v-if="isNew">
        <md-button v-for="(time, index) in timeOptions" :key="index" class="time-button md-dense" @click="selectedTime = time" :class="{'active': selectedTime === time }">{{ time | formatTime }}</md-button>
        <md-button class="time-button md-dense" :class="{'active': selectedTime === customTimeLabel }" @click="showDialog = true">{{ customTimeLabel | formatTime }}</md-button>
      </div>
    </div>
    <div class="start-div">
      <md-button v-if="isNew" class="md-raised md-dense" id="start-button" @click="start">START</md-button>
      <md-button v-if="inProgress" class="md-raised md-dense" id="start-button" @click="hopIn" :disabled="alreadyHoppedIn">{{ alreadyHoppedIn ? 'WAITING FOR LUNCH ...' : 'HOP IN' }}</md-button>
    </div>
    <md-button v-if="inProgress || hasCompleted" class="md-icon-button" style="position: absolute; top: 375px; left: 0px; color: rgba(20,20,20,0.5);" @click="stopLunchDialog=true">
      <md-icon>rv_hookup</md-icon>
    </md-button>
    <md-button v-if="inProgress" class="md-icon-button" style="position: absolute; top: 375px; left: 353px; color: rgba(20,20,20,0.5);" @click="stopLunchDialog=true">
      <md-icon>alarm_add</md-icon>
    </md-button>
    <md-dialog-confirm style="background: white;" :md-active.sync="stopLunchDialog" md-title="Turn this shit around?" md-confirm-text="yes! " md-cancel-text="no. keep going." @md-confirm="deleteLunchConfirm" />
    <md-dialog :md-active.sync="showDialog" style="height: 200px; width: 240px;">
      <timepicker @customTime="setCustomTime"></timepicker>
    </md-dialog>
  </div>
</template>

<script>
  import Timepicker from "./timepicker.vue";
  import LunchVehicle from "./lunch-vehicle.vue";
  import _ from "lodash";

  const startLunch = chrome.extension.getBackgroundPage().startLunch;
  const deleteLunch = chrome.extension.getBackgroundPage().deleteLunch;
  const addParticipant = chrome.extension.getBackgroundPage().addParticipant;
  const currentUser = chrome.extension.getBackgroundPage().currentUser;
  const LUNCH_EXPIRY_DURATION = chrome.extension.getBackgroundPage().LUNCH_EXPIRY_DURATION;

  export default {
    data() {
      return {
        currentLunchItem: null,
        mode: "new", // new, inprogress, ended
        timeOptions: [],
        selectedTime: null,
        showDialog: false,
        customTimeLabel: "CUSTOM",
        stopLunchDialog: false
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
    computed: {
      inProgress: function () {
        return this.mode === "inprogress";
      },
      isNew: function () {
        return this.mode === "new";
      },
      hasCompleted: function () {
        return this.mode === "ended";
      },
      alreadyHoppedIn: function () {
        if (this.inProgress && this.currentLunchItem && this.currentLunchItem.participants) {
          return this.currentLunchItem.participants.indexOf(currentUser.displayName) !== -1;
        }
        return false;
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
          startLunch(this.selectedTime);
        }
      },
      hopIn: function () {
        this.currentLunchItem.participants.push(currentUser.displayName);
        addParticipant();
      },
      deleteLunchConfirm: function () {
        this.currentLunchItem = null;
        this.initView();
        deleteLunch();
      },
      add10Minutes(): function() {
        
      },
      openOptions: function () {
        chrome.runtime.openOptionsPage();
      },
      naviagateToVault: function () {
        this.$root.$data.page = "vault";
        chrome.extension.getBackgroundPage().route = "vault";
      },
      initView: function () {
        console.log("lunch init view", this.currentLunchItem);
        if (
          !this.currentLunchItem ||
          new Date() - this.currentLunchItem.lunchtime > LUNCH_EXPIRY_DURATION
        ) {
          // no item or expired for more than 10 minutes
          this.mode = "new";
          this.timeOptions = getTimeOptions();
        } else {
          if ((this.currentLunchItem.lunchtime - Date.now()) > 0) {
            this.mode = "inprogress";
          } else {
            this.mode = "ended";
            this.timeOptions = getTimeOptions();
          }
        }
        console.log("current mode:", this.mode, ". Time since lunch ended", new Date() - this.currentLunchItem.lunchtime);
      },
      setCustomTime: function (customTime) {
        this.showDialog = false;
        this.selectedTime = customTime;
        this.customTimeLabel = customTime;
      },
      updateLunchItem: function () {
        let bgLunchItem = chrome.extension.getBackgroundPage().currentLunchItem;
        if (bgLunchItem) {
          this.currentLunchItem = {
            id: bgLunchItem.id,
            lunchtime: new Date(bgLunchItem.lunchtime),
            participants: _.clone(bgLunchItem.participants)
          };
        }
      }
    },
    created: function () {
      this.updateLunchItem();
      console.log("on created: ", this.currentLunchItem);
      this.initView();
      chrome.runtime.onMessage.addListener((message) => {
        if (message.event === "lunch-update") {
          this.updateLunchItem();
          console.log("lunch update from background received: ", this.currentLunchItem);
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
