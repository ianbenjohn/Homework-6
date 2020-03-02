$(document).ready(function() {


    $('#citySearch-btn').click(currentWeather);
    $('#citySearch-btn').click(forecastedDays);
    $('#searchedCity').click(currentWeather);
    $('#searchedCity').click(forecastedDays);
    $('#currentCity').css('display', 'none');
    $('#listDays').css('display', 'none');
  
    var userInput;
    var time = moment().format('LL');
    var myKey = '1efea0b32291007ea6bde57f479e852b';

    function forecastedDays() {
      if ($(this).attr('id') === 'searchedCity') {
        var x = event.target;
        userInput = $(x).text();
        console.log(userInput);
      } else {
        userInput = $(this).prev().val();
      }
      var dispDay = 1;
      var fiveDayCall = 'https://api.openweathermap.org/data/2.5/forecast?q=' + userInput + '&APPID=' + myKey;

      $.ajax({
        url: fiveDayCall,
        method: 'GET'
      }).then(function(response) {
        var listArray = response.list;
        listArray.forEach(element => {
          var yearDateTime = element.dt_txt;
  
          var currentDate = yearDateTime.split(' ')[0];
          var currentTime = yearDateTime.split(' ')[1];
  
          if (currentTime === '15:00:00') {
            var day = currentDate.split('-')[2];
            var month = currentDate.split('-')[1];
            var year = currentDate.split('-')[0];
            $('#day-' + dispDay)
              .children('.showDate')
              .html(`${month}/${day}/${year}`);
            $('#day-' + dispDay)
              .children('#showIcon')
              .attr('src', 'http://openweathermap.org/img/w/' + element.weather[0].icon + '.png'
              );
            $('#day-' + dispDay)
              .children('#showTemp')
              .html(
                `Temperature: ${parseInt(
                  (element.main.temp - 273.15) * 1.8 + 32
                )}°F`
              );
            $('#day-' + dispDay)
              .children('#showHumid')
              .html(`Humidity: ${element.main.humidity}% `);
            dispDay++;
          }
        });
      });
    }
  
    function currentWeather(event) {
      event.preventDefault();
      $('#currentCity').empty();
      $('#search-container').animate({ left: '10px' }, 600);
      $('#listDays').css('display', 'flex');
  
      if ($(this).attr('id') === 'searchedCity') {
        var x = event.target;
        userInput = $(x).text();
        console.log(userInput);
      } else {
        userInput = $(this).prev().val();
      }
      
  
      var queryURL ='https://api.openweathermap.org/data/2.5/weather?q=' + userInput + '&APPID=' + myKey;
  
      $.ajax({
        url: queryURL,
        method: 'GET'
      }).then(function(response) {
        console.log(response);
        $('#currentCity').css('display', 'block');
  
        var city = '';
        var city = $('<h1>')
          .addClass('showName')
          .text(`City: ${response.name}, ${response.sys.country}`);
        var date = $('<h3>')
          .addClass('date')
          .text(`Date: ${time}`);
        var iconImage = $('<img>')
          .addClass('icon-image')
          .attr('src', 'https://openweathermap.org/img/w/' + response.weather[0].icon + '.png');
  
        var tempF = parseInt((response.main.temp - 273.15) * 1.8 + 32);
        var temperature = $('<h4>')
          .addClass('current-temp')
          .text(`Current Temperature: ${tempF} F°`);
        var humidity = $('<h4>')
          .addClass('humidity')
          .text(`Humidity: ${response.main.humidity}%`);
        var windSpeed = $('<h4>')
          .addClass('wind-speed')
          .text(`Wind Speed ${response.wind.speed} mph`);
  
        var uvIdx = $('<h4>').addClass('uvIdx');
  
      
        var latitude = response.coord.lat;
        var lon = response.coord.lon;
        function takeUV() {
          var uvIdxUrl =
            'https://api.openweathermap.org/data/2.5/uvi?appid=' + myKey + '&lat=' + latitude + '&lon=' + lon;
          $.ajax({
            url: uvIdxUrl,
            method: 'GET'
          }).then(function(response) {
            console.log(response.value);
            $('.uvIdx').text(' UV Index: ' + response.value);
          });
        }
        takeUV();
  
        $('#currentCity').append(city, iconImage, date, temperature, humidity, windSpeed, uvIdx);
      });
    }
  
    
  
    var ul = $('#searchedCity');
    var itemsArray = localStorage.getItem('items')
      ? JSON.parse(localStorage.getItem('items'))
      : [];
    var data = JSON.parse(localStorage.getItem('items'));
  
    var listMaker = text => {
      var li = $('<li>').addClass('cityList btn');
      li.text(text);
      ul.prepend(li);
    };
  
    $('#citySearch-btn').click(function() {
      itemsArray.push(userInput);
      localStorage.setItem('items', JSON.stringify(itemsArray));
      listMaker(userInput);
    });
  
    data.forEach(item => {
      listMaker(item);
      console.log(item);
    });
  
    $('.clear-btn').on('click', function() {
      $('.cityList').remove();
      localStorage.clear();
      $('input').empty();
    });
  });