$(function(){
    var leftnav = $(".sidebar_inner ul li");
    var loca = window.location.href;
    var index = loca.lastIndexOf("\/");
    loca = loca.substring(index + 1, loca .length);

    if(loca == ""){
        leftnav.eq(0).addClass('active');
    } else if(loca == "editor"){
        leftnav.eq(1).addClass('active');
    } else if(loca == "newslist"){
        leftnav.eq(2).addClass('active');
    } else if(loca == "draft"){
        leftnav.eq(3).addClass('active');
    } else if(loca == "recycle"){
        leftnav.eq(4).addClass('active');
    } else if(loca == "alldailys"){
        leftnav.eq(5).addClass('active');
    } else{
        leftnav.eq(1).addClass('active');
    }
    //计算日期
    getDate = window.getDate = function(){
        var date = new Date();
        this.Y = date.getFullYear();
        this.M = date.getMonth()+1 ;
        this.D = date.getDate();
        if(this.M < 10){
            this.M =  0 +"" + this.M;
        }
        if(this.D < 10){
            this.D =  0 +"" + this.D;
        }
        return this.Y + "-" + this.M + "-" + this.D;
    }
    //设置 Cookie
    setCookie = window.setCookie = function(cname,cvalue,exdays){
        var d = new Date();
        d.setTime(d.getTime()+(exdays*24*60*60*1000));
        var expires = "expires="+d.toGMTString();
        document.cookie = cname+"="+cvalue+"; "+expires;
    }
    //获取 Cookie
    getCookie = window.getCookie = function(cname){
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) {
            var c = ca[i].trim();
            if (c.indexOf(name)==0) return c.substring(name.length,c.length);
        }
        return "";
    };
    //通用提示框
    Palert = window.Palert = function(inner){
       $("body").append("<div class=palert>"+ inner +"</div>");
        window.setTimeout(function(){
            $(".palert").remove();
        },1200);
    };


    //删除、修改新闻
    $(document).on("click",".news_list ul li a", function(){
        var myli = $(this).parents("li");
        var _id = myli.attr('_id');
        if($(this).hasClass('news_remove')){ //删除
            $.post("/doremovenews",{
                "_id" : _id
            },function(result){
                if(result == "1"){
                    Palert("操作成功！")
                    myli.remove();
                }else if(result == "-1"){
                    Palert("服务器异常！");
                }
            });
        }else if($(this).hasClass('news_reduction')){ //还原
            $.post("/doreduction",{
                "_id" : _id
            },function(result){
                if(result == "1"){
                    Palert("操作成功！")
                    myli.remove();
                }else if(result == "-1"){
                    Palert("服务器异常！");
                }
            });
        }else if($(this).hasClass('news_delete')){ //delete
            $.post("/dodeletenews",{
                "_id" : _id
            },function(result){
                if(result == "1"){
                    Palert("操作成功！")
                    myli.remove();
                }else if(result == "-1"){
                    Palert("服务器异常！");
                }
            });
        }
    });
});