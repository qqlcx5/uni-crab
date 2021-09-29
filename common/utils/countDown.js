export default class CountDown {
    constructor() {
        this.timer = null;
        this.taskList = [];
        this.callback = null;
        this.isRun = false;
        this.showDays = false;
    }
    formatTime(timestamp) {
      // 小于等于0的话，结束倒计时
      if(timestamp <= 0){
        this.end()
        return { day:'00', showHour:'00', hour:'00', minute: '00', second: '00' }
      }
        let [day, showHour, hour, minute, second] = [0, 0, 0, 0, 0];
        day = Math.floor(timestamp / (60 * 60 * 24));
        // 判断是否显示“天”参数，如果不显示，将天部分的值，加入到小时中
        // hour为给后面计算秒和分等用的(基于显示天的前提下计算)
        hour = Math.floor(timestamp / (60 * 60)) - day * 24;
        // showHour为需要显示的小时
        if (this.showDays) {
            showHour = hour;
        } else {
            // 如果不显示天数，将“天”部分的时间折算到小时中去
            showHour = Math.floor(timestamp / (60 * 60));
        }
        minute = Math.floor(timestamp / 60) - hour * 60 - day * 24 * 60;
        second =
            Math.floor(timestamp) -
            day * 24 * 60 * 60 -
            hour * 60 * 60 -
            minute * 60;
        // 如果小于10，在前面补上一个"0"
        showHour = showHour < 10 ? "0" + showHour : showHour;
        minute = minute < 10 ? "0" + minute : minute;
        second = second < 10 ? "0" + second : second;
        day = day < 10 ? "0" + day : day;
        return {
          day, showHour, minute, second, hour
        }
    }
    start(callback) {
        // 倒计时
        // 避免可能出现的倒计时重叠情况
        this.clearTimer();
        this.callback = callback;
        if (this.taskList.length === 0) return;
        this.isRun = true;
        this.countdown();
        
    }
    addTask(timestamp) {
        this.taskList.push({
          timestamp: timestamp,
          time: {}
        })
        return this;
    }
    countdown() {
      if(!this.isRun) return this.clearTimer();
      this.timer = setTimeout(() => {
        this.taskList.forEach(o => {
          o.timestamp -= 1
          o.time = this.formatTime(o.timestamp);
          return o;
        })
        this.callback && this.callback(this.taskList)
        this.countdown();
      }, 1000);
      
    }
    stop() {
        this.end();
    }
    end() {
        this.isRun = false;
        this.clearTimer();
    }
    clearTimer() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    }
}
