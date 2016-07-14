<template>
  <div class="container clearfix">
    <div id="calendar-wrap">
      <div class="calendar-header">
        <span class="pre-month" v-on:click="pre_month"><</span>
        <span>{{current_year}}年{{current_month + 1}}月</span>
        <span class="next-month" v-on:click="next_month">></span>
      </div>
      <div class="calendar-body clearfix">
        <div v-for="item in week" class="cell-dom">
          {{item}}
        </div >
        <div v-for="day in month_arr.date" class="" v-on:click="update_date(day)">
          <div v-if="is_same_day(day)" class="cell-dom current-date">
            <span v-if="$index < month_arr.preLen || $index >= month_arr.preLen + month_arr.currentLen" class="disable">
              {{day.getDate()}}
            </span>
            <span v-else>
              {{day.getDate()}}
            </span>
          </div>
          <div v-else class="cell-dom">
            <span v-if="$index < month_arr.preLen || $index >= month_arr.preLen + month_arr.currentLen" class="disable">
              {{day.getDate()}}
            </span>
            <span v-else>
              {{day.getDate()}}
            </span>
          </div>
        </div >
      </div>
    </div>
    <div id="note-wrap">
      <div class="note-input">
        <textarea v-model="current_note" v-on:keyup="update_note" ></textarea>
      </div>
      <div class="note-content">
        {{current_note}}
      </div>
    </div>
  </div>
</template>

<script>
let storage = window.localStorage
let noteStorage = storage.getItem('notes') ? JSON.parse(storage.getItem('notes')) : {}
console.log(noteStorage)
let monthPanel = function (date) {
  var myDate = date || new Date()
  var year = myDate.getFullYear()
  var month = myDate.getMonth()
  var currentDays = new Date(year, month + 1, 0).getDate()
  var preDays = new Date(year, month, 0).getDate()
  var firstDay = new Date(year, month, 1)
  var firstCell = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1
  var bottomCell = 42 - currentDays - firstCell
  var preMonth = []
  for (var p = firstCell; p > 0; p--) {
    preMonth.push(new Date(year, month - 1, preDays - p + 1))
  }
  var len = preMonth.length
  var currentMonth = []
  for (var c = 0; c < currentDays; c++) {
    currentMonth.push(new Date(year, month, c + 1))
  }
  var nextMonth = []
  for (var n = 0; n < bottomCell; n++) {
    nextMonth.push(new Date(year, month + 1, n + 1))
  }

  preMonth = preMonth.concat(currentMonth, nextMonth)
  return {
    date: preMonth,
    preLen: len,
    currentLen: currentMonth.length
  }
}

let createId = function (date) {
  let y = date.getFullYear()
  let m = date.getMonth() + 1
  let d = date.getDate()
  m = m < 10 ? '0' + m : m
  d = d < 10 ? '0' + d : d
  return 'date' + y + m + d
}
let today = new Date()
let currentYear = today.getFullYear()
let currentMoth = today.getMonth()
let currentId = createId(today)
let currentNote = noteStorage[currentId] ? noteStorage[currentId] : ''
export default {
  data () {
    return {
      current_year: currentYear,
      current_month: currentMoth,
      week: ['一', '二', '三', '四', '五', '六', '日'],
      month_arr: monthPanel(today),
      notes: noteStorage,
      current_date: today,
      current_id: currentId,
      current_note: currentNote
    }
  },
  methods: {
    create_id: createId,
    update_month: function (date) {
      this.month_arr = monthPanel(date)
    },
    update_date: function (date) {
      let id = this.create_id(date)
      this.current_date = date
      this.current_note = this.notes[id]
    },
    update_note: function () {
      let id = this.create_id(this.current_date)
      this.notes[id] = this.current_note
      storage.setItem('notes', JSON.stringify(this.notes))
    },
    next_month: function () {
      console.log(this.current_month)
      if (this.current_month === 12) {
        this.current_year += 1
        this.current_month = 0
      } else {
        this.current_month += 1
      }
      this.update_month(new Date(this.current_year, this.current_month, 1))
    },
    pre_month: function () {
      if (this.current_month === 0) {
        this.current_year -= 1
        this.current_month = 11
      } else {
        this.current_month -= 1
      }
      this.update_month(new Date(this.current_year, this.current_month, 1))
    },
    is_same_day: function (date) {
      return date.toDateString() === this.current_date.toDateString()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.clearfix:befor,
.clearfix:after {
  clear: both;
  content: '';
}
.current-date {
  background-color: #42b983;
}
.disable {
  color: #BFBFBF;
}
.container {
  width: 80%;
  height: 100%;
  margin-top: 50px;
  margin-left: auto;
  margin-right: auto;
}
#calendar-wrap, #note-wrap {
  float: left;
  position: relative;
}
#calendar-wrap {
  width: 30%;
}
#note-wrap {
  width: 60%;
  height: 100%;
}
.pre-month, .next-month {
  padding: 5px;
}
.cell-dom {
  width: 14%;
  float: left;
  padding:15px 0;
  border-bottom: 1px solid #ccc;
}
#note-wrap textarea, #note-wrap .note-content {
  width: 45%;
  min-height: 360px;
  display: block;
  float: left;
  text-align: left;
}
#note-wrap .note-content {
  margin-left: 5%;
  border-left: 1px solid #ccc;
  border-right: 1px solid #ccc;
}
</style>
