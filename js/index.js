/*$( document ).bind( "mobileinit", function() {
    // Make your jQuery Mobile framework configuration changes here!

    $.mobile.allowCrossDomainPages = true;
});
*/

$(function(){
    FastClick.attach(document.body);
    window.dbo.init();
    var imgs = [];
    var imgObj = [];
    imgObj.angle = 0;
    var selectPic;
    var canvas;
    var fadeimg = 1;
    var photoData;

    function resizes(){
        var windowHeight = $(window).height();
        var windowWidth = $(window).width();
        var canvasFooter = $("#canvasFooter");
        $("#lienzo").width('100%').height( (windowHeight - 5)  + "px");
        $("#canvas_controls").height( (windowHeight - $("#canvasFooter").height())  + "px");
        //$("body").height(device.height);
        //Le doy la altura al titulo principal
        $("#home .home_center_container").css('top', (windowHeight/2) - $(".home_center_container").height() + 'px');
        $("#nuevacreepy .home_center_container").css('top', (windowHeight/2) - $(".home_center_container").height() + 'px');
        //$('.creepyfooter').css('bottom',windowHeight - 120 + "px");
        $('.creepyfooter').css('bottom',0);
    }

    setInterval(function(){
        var windowHeight = $(window).height();
        var ctrlBtnW = $(".wrap_controls div img").width();
        $(".wrap_controls div").css ("height" , windowHeight/5 + "px !important").width(ctrlBtnW * 3).css("margin-left",ctrlBtnW + "px !important");
    },500);

    resizes();
    $(window).resize(function(){
        resizes();

        if(photoData){
            createCanvas();
        }
        if(selectPic){
            insertImg();
        }        
    });
    document.addEventListener("backbutton", function(e){
        console.log(e);
        if($.mobile.activePage.is('#home')){
            return false;
        }

        if($.mobile.activePage.is('#nuevacreepy')){
            $.mobile.changePage("#home", { transition: "flip", changeHash: false });
        }

        if($.mobile.activePage.is('#create')){
            $.mobile.changePage("#nuevacreepy", { transition: "flip", changeHash: false });
        }

        if($.mobile.activePage.is('#creepygallery')){
            $.mobile.changePage("#create", { transition: "flip", changeHash: false });
            resizes();
        }

        if($.mobile.activePage.is('#mycreepygallery')){
            $.mobile.changePage("#home", { transition: "flip", changeHash: false });
        }

        if($.mobile.activePage.is('#mycreepyimage')){
            $.mobile.changePage("#mycreepygallery", { transition: "flip", changeHash: false });
        }

    }, false);




    $('#openAlbum').click(function(){
        console.info('se disparo openAlbum');
        //openAlbum();
        openAlbumTest();
    });

    $('#openCamera').click(function(){
        console.info('se disparo openAlbum');
        //openCamera();
        openCameraTest();
    });


    function iraHome(){
        $.mobile.changePage("#home", { transition: "flip", changeHash: false });
    }

     function iraCreepyGallery(){
        $.mobile.changePage("#creepygallery", { transition: "flip", changeHash: false });
    }

    

    

    function goToPage(idpage){
        $.mobile.changePage(idpage, { transition: "flip", changeHash: false });
    }

    $('#nuevaCreepyPic').click(function(){
            $.mobile.changePage("#nuevacreepy", { transition: "flip", changeHash: false });   
    });
    $('#regresarahome, .regresarahome').click(function(){
        $.mobile.changePage("#home", { transition: "flip", changeHash: false });
    });

    function openAlbum() {
    
        navigator.camera.getPicture(function(imageData){
            photoData = imageData;
            createCanvas();
            $.mobile.changePage( "#create", { transition: "flip", changeHash: false });
            //alert(imageData);
        }, function(error){console.log(error);}, 
            {
                quality: 50,
                sourceType: 0,
                destinationType: 1,
                correctOrientation: true
        });
        
    }

    function openCamera() {
        navigator.camera.getPicture(function(imageData){
            photoData = imageData;
            createCanvas();
            $.mobile.changePage( "#create", { transition: "flip", changeHash: false });
            //alert(imageData);
        }, function(error){console.log(error);}, 
            {
                quality: 50,
                sourceType: 1,
                destinationType: 1,
                correctOrientation: true
        });
        
    }

    function openAlbumTest(){
        console.log('en la funcion del album');
        photoData = "img/testpics/rw.jpg";
        createCanvas();
        $.mobile.changePage( "#create", { transition: "flip", changeHash: false });
    }

    function openCameraTest(){
        console.log('en la funcion de la camara');
        photoData = "img/testpics/paisaje.jpg";
        createCanvas();
        $.mobile.changePage( "#create", { transition: "flip", changeHash: false });
    }

    //dataURL = canvas.toDataURL();

    function createCanvas(){
        var photo = new Image();
        photo.src = photoData; 
        $("#canvasContent canvas").remove();
        $(photo).on("load",function(){

            var imgW;
            var imgH;

            if(photo.width > photo.height){
                imgW = $(window).width();
                imgH = Math.round($(window).width() * photo.height/photo.width);
            }else if(photo.width < photo.height){                
                imgH = $(window).height();
                imgW = Math.round($(window).height() * photo.width/photo.height);
            }else {
                alert("es cuadrada");
            }            
            $("#canvasContent").height( imgH  + "px");
            canvas = document.createElement('canvas');
            canvas.width = imgW;
            canvas.height = imgH;
            $("#canvasContent").append(canvas);
            var lienzo = canvas.getContext("2d");
            lienzo.drawImage(photo,0,0,imgW,imgH);
        })
    }


    $( "#resizable-test" ).resizable();
    


    $("#expandimg").click(function(){
        var dw = $( "#draggable-test" ).width();
        var dh = $( "#draggable-test" ).height();
        $( "#draggable-test" ).width(dw + 10 + "px").height(dh + 10 + "px");
    });

    $("#collapseimg").click(function(){
        var dw = $( "#draggable-test" ).width();
        var dh = $( "#draggable-test" ).height();
        $( "#draggable-test" ).width(dw - 10 + "px").height(dh - 10 + "px"); 
    });

    $("#plusimg").click(function(){
        if(fadeimg < 1){
            fadeimg = fadeimg + 0.1;
            $( "#myCreepyThumbimgId" ).fadeTo( 0, fadeimg, function() {});
        }        
    });

    $("#minusimg").click(function(){
        if(fadeimg > 0.2){
            fadeimg = fadeimg - 0.1;
            $( "#myCreepyThumbimgId" ).fadeTo( 0, fadeimg, function() {});
        } 
    });

    $("#openCreepyAlbum").click(function(){
        $("#CreepyGalleryContent div").remove();
        window.dbo.db.transaction(function(tx){
            tx.executeSql("SELECT * FROM img",null,function(tx,results){
                //console.log(results.rows);
            if(results.rows.length > 0){
                for (var i = results.rows.length - 1; i >= 0; i--) {                    
                    var item = results.rows.item(i);
                    $('<div class="ui-block-b creepy-galleryitem" bg-rel="'+item.uri+'" id-rel="'+item.id+'" style="background-image:url('+item.uri+') !important;"><span>'+item.name+'</span></div>').appendTo("#CreepyGalleryContent");
                };
                //iraCreepyGallery();

                $.mobile.changePage("#creepygallery", { transition: "slide", changeHash: false });
            }
        });
        },
        function(err){
            alert(err.message);
        },
        function(){

        });
        //ui-grid-b

    });

    $("body").on('click','.creepy-galleryitem',function(){
        var t = $(this);
        if(imgObj.url != undefined && imgObj.url == $(this).attr('bg-rel') ){
            t.addClass('item-selected');
            return;
        }
        imgObj = {
            "url" : $(this).attr('bg-rel'),
            "left" : 0,
            "top": 0
        }
        insertImg();
        $.mobile.changePage( "#create", { transition: "slide", changeHash: false });
    });

    function insertImg(){
        $('.draggable-test').remove();
        $('.resizable-item').remove();
        if(imgObj.url != undefined){
            var params = {
                // Callback fired on rotation start.
                start: function(event, ui) {
                },
                // Callback fired during rotation.
                rotate: function(event, ui) {
                },
                // Callback fired on rotation end.
                stop: function(event, ui) {
                    imgObj.angle = ui.angle.stop;
                    //console.log(ui.angle.stop);
                },
            };      

            var creepyimgItem = $('<div><img src="'+imgObj.url +'" id="myCreepyThumbimgId" /></div>').rotatable(params);
            var resizable = $('<div class="resizable-item" id="resizable-item" > </div>').resizable({
                aspectRatio: true,
                //handles: 'ne, se, sw, nw'
                handles: 'se'
            });
            var it = $('<div class="draggable-test" id="draggable-test" />');
            it.draggable({ 
                containment: $("#canvasContent"),
                scroll: false,
                stop: function( event, ui ) {
                    var Stoppos = $(this).position();                    
                    imgObj.left = Stoppos.left;
                    imgObj.top = Stoppos.top;
                    //console.log(imgObj); 
                    
                }
            });
            it.appendTo('#canvasOverLayer');
            resizable.appendTo('#draggable-test');
            creepyimgItem.appendTo("#resizable-item");            
            

            
        }
        $.mobile.changePage( "#create", { transition: "slide", changeHash: false });
    }
    

    $("#guardarImg").click(function(){
        if(confirm('\u00BFRealmente deseas guardar esta imagen en tu CreepyAlbum?')){
            guarderImagen();    
        }else{
            return false;
        }
        

        /*
        navigator.notification.confirm(
            '\u00BFRealmente deseas guardar esta imagen en tu CreepyAlbum?',  // message
            function(){ guarderImagen(); },         // callback
            'CreepyPic',            // title
            ['Si','No']                  // buttonName
        );*/
    });

    $("#cancelimg").click(function(){
        if(confirm('\u00BFRealmente eliminar esta imagen?')){
            cancelarImagen();    
        }else{
            return false;
        };

    });

    function guarderImagen(){
        var imagen = new Image();
        imagen.src = imgObj.url;
        var lienzo = canvas.getContext("2d");
        $(imagen).on("load",function(){            
            var imgW = $("img#myCreepyThumbimgId").width();
            var imgH = $("img#myCreepyThumbimgId").height();;
            //console.log(imgH + " - " + imgW);
            lienzo.globalAlpha = fadeimg;
            lienzo.rotate(imgObj.angle*Math.PI/180);
            lienzo.drawImage(imagen,imgObj.left,imgObj.top,imgW,imgH);
            console.log(lienzo);
            $("img#myCreepyThumbimgId").remove();
            var imgData = canvas.toDataURL();
            window.dbo.saveImg(imgData);
            prepareMyCreepyGallery();
            $("#canvasContent canvas").remove();
            $("#draggable-test").remove();
        });
    }

    function cancelarImagen(){
        $("#canvasContent canvas").remove();
        $("#draggable-test").remove();
        $.mobile.changePage( "#home", { transition: "slide", changeHash: false });
    }

    $(".sharepic").click(function(){
        window.plugins.socialsharing.share(null, 'Android filename', selectPic, null);
    });

    

    $("#gotoMyCreepyGallery, .gotoMyCreepyGallery").click(function(){
        prepareMyCreepyGallery();

    });
    

    function prepareMyCreepyGallery (){
        $("#MyCreepyGalleryContent *").remove();
        window.dbo.db.transaction(function(tx){
            tx.executeSql("SELECT * FROM mygallery",null,function(tx,results){
                //console.log(results.rows);
            if(results.rows.length > 0){
                for (var i = results.rows.length - 1; i >= 0; i--) {                    
                    var item = results.rows.item(i);
                    $('<div  img-src="'+item.uri+'" class="gallery-item-box"><img src="'+item.uri+'" class="mygalleryimg" /></div>').appendTo("#MyCreepyGalleryContent");
                };
                //iraCreepyGallery();
                $('.gallery-item-box').height($(window).width()/3);
                $.mobile.changePage("#mycreepygallery", { transition: "flip", changeHash: false });
            }else{

                alert('A\u00fan no tienes fotos en tu CreepyAlbum')
                
            }
        });
        },
        function(err){
            alert(err.message);
        },
        function(){

        });
    }    

    $('body').on('click','.gallery-item-box',function(){
        var img_src = $(this).attr('img-src');
        $('#creepyImgBox img').remove();
        $('#creepyImgBox').append('<img src="'+img_src+'" />');
        selectPic = img_src;
        $.mobile.changePage("#mycreepyimage", { transition: "flip", changeHash: false });
    })
});
