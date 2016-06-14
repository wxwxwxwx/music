$(function(){
  var database = [],
  play = $('#btnplay'),
  audio = $('audio'),
    prev = $('#prevbt'),
    next = $('#nextbt'),
    v_bar = $('#spanvolumebar'),
    v_op = $('#spanvolumebar'),
    hideshow = $('#btnfold'),
    musicnum = $('#spansongnum1'),
    div = $('#divsonglist'),
    ul = $('#divsonglist ul'),
    newli;


    var makelist = function(){
      $.each(database,function(k,v){
        newli = '<li><strong class="music_name" title="'+v.title+'">'+v.title+'</strong> <strong class="singer_name" title="'+v.artist+'">'+v.artist+'</strong><strong class="play_time">'+v.duration+'</strong><div class="list_cp"><strong class="btn_like" title="喜欢" name="" mid="004fQTu016b9W4"> <span>我喜欢</span>  </strong> <strong class="btn_share" title="分享"> <span>分享</span> </strong><strong class="btn_fav" title="收藏到歌单"> <span>收藏</span> </strong> <strong class="btn_del" title="从列表中删除"><span>删除</span></strong></div></li>'
        $(newli).appendTo(ul);
      })
    }

    $.getJSON('../database.json').done(function(data){
      database = data;
      makelist();
    })

    var changesong = function(){
      console.log(audio)
      audio.play();
      $('#divsonglist ul li').remove('play_current').eq(currentSong).addClass('play_current');
      $('#music_name').text(database[currentSong].title);
      $('#sing_name').text(database[currentSong].artist);
      $('#').text(database[currentSong].duration)
    }

    var currentSong = null;
    ul.on('click','li',function(){
      currentSong = $(this).index();
      audio.src = database[currentSong].filename;
      changesong();
    })

    ul.on('mouseenter mouseleave','li',function(){
      $(this).toggleClass('play_hover');
    })

    ul.on('click','.btn_del',function(){
      var needdel = $('#divsonglist .btn_del').index(this);
      database = $.grep(database,function(v,k){
        return k!==needdel;
      })
      $(this).closest('li').remove();
      $('#spansongnum1 span').text(database.length);
      return false;
    })





    next.on('click',function(){
      currentSong += 1;
      currentSong = database.length?0:currentSong;
      audio.src = database[currentSong].filename;
    })



})
