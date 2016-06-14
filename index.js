$(function(){
  var database = [],
  play = $('#btnplay'),
  audio = $('audio').get(0),
    prev = $('#prevbt'),
    next = $('#nextbt'),
    v_bar = $('#spanvolumebar'),
    v_op = $('#spanvolumebar'),
    hideshow = $('#btnfold'),
    musicnum = $('#spansongnum1'),
    div = $('#divsonglist'),
    ul = $('#divsonglist ul'),
    oldvom,
    newli;

    // 页面的绘制
    var makelist = function(){
      $.each(database,function(k,v){
        newli = '<li><strong class="music_name" title="'+v.title+'">'+v.title+'</strong> <strong class="singer_name" title="'+v.artist+'">'+v.artist+'</strong><strong class="play_time">'+v.duration+'</strong><div class="list_cp"><strong class="btn_like" title="喜欢" name="" mid="004fQTu016b9W4"> <span>我喜欢</span>  </strong> <strong class="btn_share" title="分享"> <span>分享</span> </strong><strong class="btn_fav" title="收藏到歌单"> <span>收藏</span> </strong> <strong class="btn_del" title="从列表中删除"><span>删除</span></strong></div></li>'
        $(newli).appendTo(ul);
        $('#spansongnum1 span').text(database.length);
      })
    }
    // 数据的获取
    $.getJSON('../database.json').done(function(data){
      database = data;
      makelist();
    })
    // 改边歌曲
    var changesong = function(){
      audio.play();
      $('.play_bt').addClass('pause_bt')
      $('#divsonglist ul li').removeClass('play_current').eq(currentSong).addClass('play_current');
      $('#music_name').text(database[currentSong].title);
      $('.singer_name').text(database[currentSong].artist);
      $('.play_date').text(database[currentSong].duration);
    }
    // 播放功能函数
    var beginone = function(){
      if(audio.src.length === 17){
        audio.src = database[0].filename;
        currentSong = 0;

      }
      if($('.play_bt').hasClass('pause_bt')){
        changesong();
      }else{
        audio.pause();
      }
    }


    // 点击歌曲的操作
    var currentSong = null;
    ul.on('click','li',function(){
      currentSong = $(this).index();
      audio.src = database[currentSong].filename;
      changesong();
    })
    // 鼠标移入歌曲
    ul.on('mouseenter mouseleave','li',function(){
      $(this).toggleClass('play_hover');
    })
    // 删除按钮的功能
    ul.on('click','.btn_del',function(){
      var needdel = $('#divsonglist .btn_del').index(this);
      database = $.grep(database,function(v,k){
        return k!==needdel;
      })
      $(this).closest('li').remove();
      $('#spansongnum1 span').text(database.length);
      return false;
    })
    // 歌曲的播放/暂停
    $('.play_bt').on('click',function(){
      $(this).toggleClass('pause_bt')
      beginone();
    })



    // 切换下一首
    next.on('click',function(){
      currentSong += 1;
      currentSong === database.length?currentSong = 0:currentSong;
      audio.src = database[currentSong].filename;
      changesong();
    })
    // 切换上一首
    prev.on('click',function(){
      currentSong -=1;
      currentSong === -1?currentSong = database.length-1:currentSong;
      audio.src = database[currentSong].filename;
      changesong();
    })
    // 音量控制
    $('#spanvolume').on('click',function(e){
      var percent = e.offsetX/$(this).width();
      var width = percent*100+'%';
    audio.volume = percent;
      $(this).find('.volume_bar').width(width);
      $(this).find('.volume_op').css('left',width);
        if(width==='0%'){
        $('.volume_icon').addClass('volume_mute');
        }else{
          $('.volume_icon').removeClass('volume_mute');
        }
    })
    // 音量小点的控制
    $('.volume_icon').on('click',function(){
      $(this).toggleClass('volume_mute');
      if( $(this).hasClass('volume_mute') ){
        oldvom = $('.volume_bar').width();
        oldv = audio.volume;
        $('.volume_bar').width(0);
        $('.volume_op').css('left','0')
        audio.volume = 0;
      }
      else{
        $('.volume_bar').width(oldvom);
        $('.volume_op').css('left',oldvom);
        audio.volume = oldv;
      }
    })
    // 切换播放模式
    $('#btnPlayway').on('click',function(){
      $('#divselect').css('display','block')
    })
    $('#divselect').on('click','strong',function(){
      var a = $(this).attr('class'),
      size;
      if(a === 'cycle_bt'){
        size = '-219px 0';
      }else if(a==='ordered_bt'){
        size = '-291px -60px';
      }else if(a==='unordered_bt'){
        size = '-327px -32px'
      }else{
        size = '-255px 0';
      }
      $('#btnPlayway').attr('title', $(this).find('span').text());
      $('#btnPlayway').attr('class',a)
      $('#btnPlayway span').text( $(this).find('span').text() );
      $('#btnPlayway').css('background-position',size);
      $(this).closest('p').css('display','none');
    })
    // 进度条点击切换到当前的进度
    $('#spanplayer_bgbar').on('click',function(e){
      audio.currentTime = audio.duration*e.offsetX/$(this).width();

    });
    // 进度条走
    audio.ontimeupdate = function(){
      var per = this.currentTime/this.duration;
      var width = (per*100).toFixed(2)+'%';
      $('.play_current_bar').width(width);
      $('.progress_op').css('left',width)
    }
    // 播放完一首之后根据当前的模式切换下一首
    audio.onended = function(){
      var model = $('#btnPlayway').attr('class');
      $('.play_current_bar').width('0');
      $('.progress_op').css('left','0');
      if(model === 'cycle_bt'){
        currentSong === database.length?currentSong = 0:currentSong += 1;
      }else if(model==='ordered_bt'){

        currentSong === database.length?currentSong = 0:currentSong += 1;
      }else if(model==='unordered_bt'){
        currentSong = Math.floor(Math.random()*database.length);
      }else{
        currentSong = currentSong;
      }
      audio.src = database[currentSong].filename;
      changesong()

    }
    // 点击清理桌面
    $('#clear_list').on('click',function(){
      database = [];
      ul.empty();
      $(this).css('display','none');
      audio.src = '';
    })
    // 点击收起来
    $('#btnfold').on('click',function(){
      $('.m_player').toggleClass('m_player_folded')
      if($('.m_player').hasClass('m_player_folded')){
        $('.m_player').css('left','-540px').css('transition','left .6s ease')
      }else{
        $('.m_player').css('left','0px')
      }
    })
    // 点击列表
    $('#spansongnum1').on('click',function(){
      $(this).toggleClass('closelist')
      if($(this).hasClass('closelist') ){
        $('#divplayframe').css('opacity','0').css('transition','opacity .6s linear')
      }else{

      $('#divplayframe').css('opacity','1');
      }
  })

})
