import moment from 'moment';
let local = {
    // ip地址所在城市
    city: '',
    // 所在城市温度
    temperature: '',
    // 天气类型
    type: '',
    // 星期几
    day: '',
    // 年月日时间
    time: '',
};
// 异步调用
async function asyncFn(proxy) {
    let returnDate = await getLocalCity(proxy);
    let retrunWeather = await getLocalWeather(proxy, returnDate);
    return retrunWeather
}

// 获取时间
function getDate() {
    let time = {
        year: '',
        month: '',
        date: '',
        hour: '',
        minute: '',
        second: '',
        day: ''
    }
    const date = new Date();
    var a = date.getDay();
    var d = "";
    switch (a) {
        case 0:
            d = "星期日";
            break;
        case 1:
            d = "星期一";
            break;
        case 2:
            d = "星期二";
            break;
        case 3:
            d = "星期三";
            break;
        case 4:
            d = "星期四";
            break;
        case 5:
            d = "星期五";
            break;
        default:
            d = "星期六";
    }
    let times = {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        date: date.getDate(),
        hour: date.getHours() < 10 ? '0' + date.getHours() : date.getHours(),
        minute: date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes(),
        second: date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds(),
        day: d
    }
    return times;
}

// 获取城市
function getLocalCity(proxy) {
    console.log('proxy: ', proxy);

    var data = {
        key: 'Y2LBZ-LYVCF-SBYJA-JKBZ2-WCRJZ-KQFMG', //申请的密钥,写死就行
    }
    var url = 'https://apis.map.qq.com/ws/location/v1/ip' //这个就是地理位置信息的接口
    data.output = 'jsonp'
    return proxy.$jsonp(url, data)
        .then((res) => {
            console.log(res);
            local.city = res.result.ad_info.city
            //    let retrunWeather = await getLocalWeather(proxy, returnDate) 在回调函数中不能，调用异步函数
            return local.city
        })
        .catch((error) => {
            console.log(error)
        });


}
// 获取当前城市天气
function getLocalWeather(proxy, city) {
    // if (city && city !== '') {
    //     return proxy.$api
    //         .get('http://wthrcdn.etouch.cn/weather_mini?city=' + city)
    //         .then((res) => {
    //             // 获取当天数据 
    //             let todayWeather = res.data.data.forecast[0]
    //             if (todayWeather !== '') {
    //                 // 获取温度，取平均值
    //                 let high = todayWeather.high.split(' ')[1].slice(0, -1)
    //                 let low = todayWeather.low.split(' ')[1].slice(0, -1)
    //                 local.temperature = (parseInt(low) + parseInt(high)) / 2
    //                 // 获取天气类型
    //                 local.type = todayWeather.type
    //                 // 获取星期几
    //                 local.day = todayWeather.date.slice(-3)
    //                 // 获取当前时间 
    //             }
    //             return local
    //         })
    //         .catch(function (error) {
    //             console.log(error)
    //         })
    // }
    return {
        city,
        weather: '多云',
        min: '10',
        max: '18'
    }

}

export {
    asyncFn,
    getDate
}