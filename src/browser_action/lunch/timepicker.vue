<template>
	<md-dialog :md-active.sync="show" style="background: white; height: 200px; width: 240px; color: rgba(0, 0, 0, 0.7);">
		<md-dialog-title>CUSTOM TIME</md-dialog-title>
		<div style="width: 100%; text-align:center; font-size: 25px;">
			<md-field class="time-input" :class="{'md-invalid': hourError}" :md-counter="false">
				<md-input v-model="hour" maxlength="2"></md-input>
			</md-field>
			:
			<md-field class="time-input" :class="{'md-invalid': minuteError}" :md-counter="false">
				<md-input v-model="minute" maxlength="2"></md-input>
			</md-field>
			<md-button class="md-dense ampm" @click="toggleAmPm()">{{ ampm }}</md-button>
		</div>
		<md-button class="md-dense" style="color: var(--vault-color);" @click="set()">SET</md-button>
	</md-dialog>
</template>

<script>
	export default {
		props: ["show"],
		data() {
			return {
				hour: (new Date().getHours() % 12 || 12),
				minute: ('0' + new Date().getMinutes()).slice(-2),
				ampm: new Date().getHours() < 12 ? "AM" : "PM"
			}
		},
		computed: {
			hourError: function () {
				if (!/^\d+$/.test(this.hour) || this.hour < 0 || this.hour > 12) {
					return true;
				}
			},
			minuteError: function () {
				if (!/^\d+$/.test(this.minute) || this.minute < 0 || this.minute > 59) {
					return true;
				}
			}
		},
		methods: {
			toggleAmPm() {
				this.ampm = this.ampm === "AM" ? "PM" : "AM";
			},
			set() {
				if (this.hourError || this.minuteError) {
					console.log(this.hourError, this.minuteError);
					return;
				}
				let customTime = new Date();
				customTime.setHours((+this.hour + 12 * (this.ampm === "PM")) % 24);
				console.log((+this.hour + 12 * (this.ampm === "PM")) % 24);
				customTime.setMinutes(+this.minutes);
				customTime.setSeconds(0);
				customTime.setMilliseconds(0);
				// if (customTime < new Date()) {
				// 	this.hourError = true;
				// 	this.minuteError = true;
				// }
				console.log(customTime);
				this.$emit("customTime", customTime);
			}
		}
	}
</script>

<style scoped>

.time-input {
  display: inline-block;
  width: 30px;
}

.time-input .md-input {
  text-align: center;
  font-size: 25px;
}

.ampm {
  color: rgba(0, 0, 0, 0.7);
  width: 30px;
  min-width: 30px;
  margin: 0;
  margin-top: 21px;
  font-size: 15px;
}

.md-field.md-focused label {
  color: var(--vault-color);
}

.md-field:after {
  background-color: rgba(0, 0, 0, 0.15);
}

.md-field:before {
  background-color: var(--vault-color);
}

.md-field.md-invalid span,
.md-field.md-has-value.md-invalid .md-input {
  color: #ff1744;
}

.md-field.md-invalid:before,
.md-field.md-invalid:after {
  background-color: #ff1744;
}
</style>

