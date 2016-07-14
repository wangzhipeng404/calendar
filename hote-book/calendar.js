/*
+------------------------------
@author: wangzhipeng404
@time: 2016/7/12
@desc: 简易酒店预订日历插件
+------------------------------
*/
var Calendar = (function(){
    var Calendar = function(div, options){
        this.div = document.getElementById(div);
        var options = options
        var w = this.div.style.width || 390;
        var h = this.div.style.height || (300 - 30);
        this.width = parseInt(w) >= 360 ? w : 360; 
        this.height = parseInt(h) >= 180 ? h : 180;
        this.date = options.date;
        this.dateInfo = options.info ? options.info : {};
        this.scense = options.scense ? options.scense : 'get';
        this.callback = options.callback ? options.callback : function() {};
        this.activeDate = new Date(); //最后被点击的日期，后续需要用到，所以先初始化了 
        this.div.style.width = this.width + 'px'; //按默认值设置回去
        this.div.style.height = this.height + 'px';//按默认值设置回去
    };

    Calendar.week = ['一', '二','三', '四','五', '六', '日'];

    Calendar.prototype['showUI'] = function(callback){
        var exist = document.getElementById('vczero_celldom_0');
        if(!!exist){
            for(var e = 0; e < 42; e++){
                var node = document.getElementById('vczero_celldom_' + e);
                node.onclick = null; //移除事件处理程序
                this.div.removeChild(node);
            }
        }

        var width = this.width,
            height = this.height,
            cell = {width: (parseInt(width) - 20)/7, height: (parseInt(height) -30 - 20)/6},
            monthArr = this._monthPanel(this.date);
        this.div.style.paddingLeft = '8px'; 
        this.div.style.border = '2px solid #57ABFF';
        this.div.style.cursor = 'default';
        this.div.style.fontFamily = '微软雅黑';
        this._addHeader();
        this._addWeekday();
        this._createInputModal();

        for(var i = 0; i < 42; i++){
            var cellDOM = document.createElement('div');
            cellDOM.style.width = cell.width + 'px';
            cellDOM.style.height = cell.height + 'px';
            cellDOM.style.display = 'inline-block';
            cellDOM.style.cssFloat = 'left';
            cellDOM.style.cursor = 'pointer';
            cellDOM.style.textAlign = 'center';
            cellDOM.id = 'vczero_celldom_' + i;
            cellDOM.style.lineHeight = cell.height + 'px';
            cellDOM.setAttribute('date',monthArr.date[i]); //设置日期对象到DOM属性date上
            var innerHTML = monthArr.date[i].getDate();
            var id = this._id(monthArr.date[i])
            if(this.dateInfo[id]) {
                    innerHTML +=  '(' + this.dateInfo[id]['价格'] + ')';
            }
            cellDOM.innerHTML = innerHTML;
            //去掉最后一行横线
            if(i < 35){ 
                cellDOM.style.borderBottom = '1px solid #C8CACC';
            }

            if(i < monthArr.preLen || i >= monthArr.currentLen + monthArr.preLen){
                cellDOM.style.color = '#BFBFBF';
                cellDOM.classList.add('disabled')
            }
            this.div.appendChild(cellDOM);
        }

        //使用父元素事件委托
        var _that = this;
        var inputModal = document.getElementById('calemdar-input-modal');
        this.div.addEventListener('click',function(e){
            var node = e.target;
            var nodeClass = node.classList;
            if(node.id.indexOf('vczero_celldom_') > -1 && !nodeClass.contains('disabled')){
                var date = new Date(node.getAttribute('date'));
                _that.activeDate = date;
                if(_that.scense == 'set') {
                    inputModal.style.display  = 'block';
                } else if(_that.scense == 'get') {

                }
                _that.callback(node, date);
            }
        });
    };

    Calendar.prototype._addHeader = function(){
        var exist = document.getElementById('vczero_datediv');
        if(!!exist){
            exist.onclick = null;
            this.div.removeChild(exist);
        }

        var header = document.createElement('div');
        header.style.height = '22px';
        header.style.width = this.div.style.width || '800px';


        //包含左 时间 右的大DIV
        var dateDiv = document.createElement('div');
        dateDiv.style.width = '200px';
        dateDiv.style.height = '22px';
        dateDiv.style.margin = '0 auto';
        dateDiv.style.textAlign = 'center';
        dateDiv.style.fontWeight = 'bold';
        dateDiv.style.padding = '10px';
        dateDiv.id = 'vczero_datediv';

        //< DIV
        var leftDiv = document.createElement('div');
        leftDiv.innerHTML = '<';
        leftDiv.style.display = 'inline-block';
        leftDiv.style.float = 'left';
        leftDiv.style.width = '50px';
        leftDiv.style.cursor = 'pointer';
        leftDiv.style.color = '#C5BFBF';
        var _that = this; //获取到this对象
        leftDiv.addEventListener('click', function(event){
            var year = parseInt(_that.date.getFullYear()),
                month = parseInt(_that.date.getMonth());
            if(month === 0){
                _that.date = new Date(year - 1, 11, 1);
            }else{
                _that.date = new Date(year, month - 1, 1);
            }
            _that['showUI'](function(){});
            
        });

        //> DIV
        var rightDiv = document.createElement('div');
        rightDiv.innerHTML = '>';
        rightDiv.style.display = 'inline-block';
        rightDiv.style.float = 'left';
        rightDiv.style.width = '50px';
        rightDiv.style.cursor = 'pointer';
        rightDiv.style.color = '#C5BFBF';
        rightDiv.addEventListener('click', function(event){
            var year = parseInt(_that.date.getFullYear()),
                month = parseInt(_that.date.getMonth());
            if(month === 11){
                _that.date = new Date(year + 1, 0, 1);
            }else{
                _that.date = new Date(year, month + 1, 1);
            }
            _that['showUI'](function(){});
        });


        //显示月份的DIV
        var timeDiv = document.createElement('div');
        timeDiv.style.display = 'inline-block';
        timeDiv.style.float = 'left';
        timeDiv.style.width = '100px';
        timeDiv.innerHTML = this.date.getFullYear() + '年' + (this.date.getMonth() + 1) + '月';

        dateDiv.appendChild(leftDiv);
        dateDiv.appendChild(timeDiv);
        dateDiv.appendChild(rightDiv);
        this.div.appendChild(dateDiv);
    };

    //增加星期
    Calendar.prototype._addWeekday = function(){
        var exist = document.getElementById('vczero_week_0');
        if(!!exist){
            for(var i = 0; i < 7; i++){
                var node = document.getElementById('vczero_week_' + i);
                node.onclick = null;
                this.div.removeChild(node);
            }
            
        }

        for(var n = 0; n < 7; n++){
            var weekday = document.createElement('div');
            weekday.style.width = (parseInt(this.width) - 20)/7 + 'px';
            weekday.style.height = '20px';
            weekday.style.display = 'inline-block';
            weekday.style.float = 'left';
            weekday.style.color = '#BFBFBF';
            weekday.style.fontWeight = 'bold';
            weekday.style.textAlign = 'center';
            weekday.id = 'vczero_week_' + n;
            weekday.innerHTML = Calendar.week[n];
            this.div.appendChild(weekday);
        }
    };

    Calendar.prototype._monthPanel = function(date){
        //如果传递了Date对象，则按Date对象进行计算月份面板
        //否则，按照当前月份计算面板
        var myDate = date || new Date(),
            year = myDate.getFullYear(),
            month = myDate.getMonth(),
            day = myDate.getDate(),
            week = myDate.getDay(),
            currentDays = new Date(year, month + 1, 0).getDate(),
            preDays = new Date(year, month, 0).getDate(),
            firstDay = new Date(year, month, 1),
            firstCell = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1,
            bottomCell =  42 - currentDays - firstCell;
        //前一个月该显示多少天
        var preMonth = [];
        for(var p = firstCell; p > 0; p--){
            preMonth.push(new Date(year, month - 1, preDays - p + 1));
        }
        var len = preMonth.length;
        //本月
        var currentMonth = [];
        for(var c = 0; c < currentDays; c++){
            currentMonth.push(new Date(year, month, c + 1));
        }
        //下一个月
        var nextMonth = [];
        for(var n = 0; n < bottomCell; n++){
            nextMonth.push(new Date(year, month + 1, n + 1));
        }

        preMonth = preMonth.concat(currentMonth, nextMonth);
        return {
            date: preMonth,
            preLen: len,
            currentLen: currentMonth.length
        };
    };
    Calendar.prototype._createInputModal = function() {
        var _that = this;
        var modalDiv = document.createElement('div');
        modalDiv.id = 'calemdar-input-modal';
        modalDiv.style.display = 'none';
        modalDiv.style.zIndex = 999;
        modalDiv.style.width = '150px';
        modalDiv.style.height = '100px';
        modalDiv.style.position = 'absolute';
        modalDiv.style.right = '-155px';
        var keyInput = document.createElement('input');
        keyInput.id = 'key-input';

        modalDiv.innerHTML = 'key：<input type="text" id="calendar-key-input"/><br/>value：<input type="text" id="calendar-value-input" /><br/></br><button id="calendar-sure-btn">确定</button>&nbsp&nbsp<button id="calendar-cancel-btn">取消</button>';
        this.div.appendChild(modalDiv);

        //为确定按钮添加事件
        var keyInput = document.getElementById('calendar-key-input');
        var valInput = document.getElementById('calendar-value-input');
        var surebtn = document.getElementById('calendar-sure-btn');
        surebtn.addEventListener('click', function() {
            var key = keyInput.value;
            var val = valInput.value;
            if(key != '' && val != '') {
                var id = _that._id(_that.activeDate);
                if(_that.dateInfo.id) {
                    _that.dateInfo.id[key] = val;
                } else {
                    _that.dateInfo[id] = {};
                    _that.dateInfo[id][key] = val;
                }
                _that['showUI'](function(){}); //重绘当前日历
                modalDiv.style.display = 'none';
                keyInput.value = '';
                valInput.value = '';
            } 
        })
        //为cancel按钮添加事件
        var cancelbtn = document.getElementById('calendar-cancel-btn');
        cancelbtn.addEventListener('click', function() {
            modalDiv.style.display = 'none';
            keyInput.value = '';
            valInput.value = '';
        })
    }
    //生成一个日期id，用于存取日期信息；
    Calendar.prototype._id = function(date) {
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        var d = date.getDate();
        m = m < 10 ? '0' + m : m;
        d = d < 10 ? '0' + d : d;
        return 'date' + y + m + d;
    }
    Calendar.prototype._getDateInfo = function() {
        return this.dateInfo;
    }
    return Calendar;

})();
