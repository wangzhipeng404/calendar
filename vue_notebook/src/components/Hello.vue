<template>
  <div class="container ">
    <div id="calendar-wrap" v-show="show === 'calendar'">
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
          <div class="cell-dom" v-bind:class="{
            'current-date': is_same_day(day),
            'disable': $index < month_arr.preLen || $index >= month_arr.preLen + month_arr.currentLen,
            'has-note': has_note(day)
            }
            ">
            {{day.getDate()}}
          </div>
        </div >
      </div>
    </div>
    <div id="note-wrap">
      <div class="note-input" v-show="show === 'edit'">
        <div class="clearfix header-nav">
          <div class="btn edit-cancel pull-left" v-on:click="show_note()">取消</div>
          <div class="btn edit-sure pull-right" v-on:click="save_note()">保存</div>
          <div class="clearfix"></div>
        </div>
        <p class="clearfix"><textarea v-model="current_note" ></textarea></p>
      </div>
      <div class="note-content" v-show="show === 'note'">
        <div class="header-nav">
          <div class="btn back-btn pull-left" v-on:click="show_calendar()">返回</div>
          <div class="btn edit-btn pull-right" v-on:click="show_edit()">编辑</div>
          <div class="clearfix"></div>
        <div>
        <p>{{current_note ? current_note : '无'}}</p>
      </div>
    </div>
  </div>
</template>

<script>
let storage = window.localStorage
let noteStorage = storage.getItem('notes') ? JSON.parse(storage.getItem('notes')) : {}
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
      current_note: currentNote,
      show: 'calendar'
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
      this.show = 'note'
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
    },
    has_note: function (date) {
      let id = this.create_id(date)
      if (this.notes[id]) {
        return true
      } else {
        return false
      }
    },
    show_calendar: function () {
      this.show = 'calendar'
    },
    show_edit: function () {
      this.show = 'edit'
    },
    show_note: function () {
      this.show = 'note'
    },
    save_note: function () {
      let id = this.create_id(this.current_date)
      this.notes[id] = this.current_note
      this.show_note()
      storage.setItem('notes', JSON.stringify(this.notes))
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.pull-left {
  float: left;
}
.pull-right {
  float: right;
}
.clearfix {
  clear: both;
}
.clearfix::befor,
.clearfix::after {
  content:".";
  display:block;
  height:0;
  clear:both;
  visibility:hidden
}
.current-date {
  background-color: #42b983;
}
.disable {
  color: #BFBFBF;
}
.has-note {
  color: red;
}
.container {
  display: border-box;
  width: 100%;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}
#calendar-wrap {
  width: 100%;
  height: 80%;
}
#note-wrap {
  width: 100%;
  height: 100%;
}
.btn {
  border: 1px solid #ccc;
  border-radius: 3px;
  padding: 5px 15px;
  color: #333;
}
.header-nav {
  padding:5px 0;
}
.calendar-header {
  font-size: 20px;
}
.pre-month, .next-month {
  padding: 10px;
}
.cell-dom {
  width: 14%;
  float: left;
  padding:15px 0;
  border-bottom: 1px solid #ccc;
}
#note-wrap .note-input, #note-wrap .note-content {
  width: 100%;
  height: 100%;
  display: block;
  text-align: left;
}
.note-input textarea {
  width: 100%;
  min-height: 450px;
  margin: 0;
  padding: 0;
}
</style>
