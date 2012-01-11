/* ------------------------------------------------------------------------
水平アコーディオン jQuery版
    Copyright (c) 2011, Matsumoto.JS All rights reserved.

【使用方法】（なるべく<head>タグ内にて）
<script src="js/jquery.min.js" type="text/javascript"></script> 
<script src="js/jquery.horizontalAccordion.js" type="text/javascript"></script>
<script language="JavaScript" type="text/javascript">
$(document).ready( function() {
    $("#test").horizontalAccordion({slit:50, interval:5, duration:0.5});
});
</script>

【パラメータの説明】
以下の情報を任意に指定します（上記書式を参考に）
    slit: スリットの幅（px）
    startPos: 最初に開いておくパネル（0..）
    duration: スライドの時間を秒で指定（画像の切替え時間）
    interval: 自動切り替えの間隔を秒で指定（初期値:0=再生しない）

 ------------------------------------------------------------------------ */

(function($) {

    $.fn.horizontalAccordion = function (options) {
        var settings = {
            slit : 20,
            startPos : 0,
            duration : 0.5,
            interval : 0
         };
        if (options) $.extend(settings,options);
        settings.duration = settings.duration * 1000;
        settings.interval = settings.interval * 1000;

        var clientWidth = $(this).width();
	    var lastIndex = 0;
	    var currentIndex = settings.startPos;
	
        var _animateAccordion = function (index) {
            for (id=0; id<=index; id++) 
              $('li.accordion_'+id).animate(
                  {left: id*settings.slit+"px"}, 
                  {queue:false, duration:settings.duration}
              );
            for (id=index+1; id<=lastIndex; id++) 
              $('li.accordion_'+id).animate(
                  {left: (clientWidth-(lastIndex-id+1)*settings.slit)+"px"}, 
                  {queue:false, duration:settings.duration}
              );
        };

        var _autoplayEvent = function () {
            currentIndex = currentIndex + 1;
            if (currentIndex > lastIndex) currentIndex = 0;
            _animateAccordion(currentIndex);
        }

        //Initialize
        if ($(this).css('position') === 'static') $(this).css('position','relative');
        $(this).find('li').each(function(i){
            if ($(this).css('position') === 'static') $(this).css('position','absolute');
            $(this).css('display','block');
	        lastIndex = i;
	        $(this).addClass('accordion_'+i);
            //Animate to default position
	        var time = (lastIndex - i) * settings.duration / 2;
	        setTimeout(
              function(){ 
                  var leftPos = clientWidth-(lastIndex-i+1)*settings.slit;
                  if (i<=settings.startPos) leftPos = i*settings.slit;
                  $('li.accordion_'+i).animate(
                      {left: leftPos+"px"},
                      {queue:false, duration:settings.duration}
                  );
              }, time
            );
        });
        
        //Add event listener
        $(this).find('li').each(function(i){
	        $(this).hover(function(){ currentIndex=i; _animateAccordion(i); });
        });
		
        if (settings.interval > 0) setInterval(_autoplayEvent, settings.interval);
    
        return this;
    }

}(jQuery));
