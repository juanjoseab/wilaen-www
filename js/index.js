/*$( document ).bind( "mobileinit", function() {
    // Make your jQuery Mobile framework configuration changes here!

    $.mobile.allowCrossDomainPages = true;
});
*/

$(function(){
    FastClick.attach(document.body);
    //window.dbo.init();
    var imgs = [];
    var imgObj = [];
    imgObj.angle = 0;
    var selectPic;
    var canvas, lienzo;
    var fadeimg = 1;
    var photoData;
    var db = window.openDatabase("Database", "1.0", "dbtx", 2000000000);
    var banner = {};
    banner.set = false;

    function checkDb(){
        db.transaction(function(tx){
            tx.executeSql("SELECT * FROM sqlite_master WHERE type='table' AND name='img'",null,function(tx,results){
            //console.log(results);
            if(results.rows.length > 0) {
                //console.log("tengo rows");
                getBanners();
            }else{
                //console.log("no tengo rows");
                db.transaction(function(tr){
                    console.log("ejecutanto statements");
                    tr.executeSql('CREATE TABLE IF NOT EXISTS mygallery (id INTEGER PRIMARY KEY, uri);');
                    
                    tr.executeSql('CREATE TABLE IF NOT EXISTS banner (id INTEGER PRIMARY KEY, low,medium,high,href);');
                    tr.executeSql('INSERT INTO banner (low,medium,high,href) VALUES ("img/banners/low.jpg", "img/banners/medium.jpg","img/banners/high.jpg","http://rafael.servehttp.com/paranormal/");');

                    tr.executeSql('CREATE TABLE IF NOT EXISTS img (id INTEGER PRIMARY KEY, name, uri);');
                    tr.executeSql('INSERT INTO img (name, uri) VALUES ("Ovni", "img/pics/ovni.png");');
                    tr.executeSql('INSERT INTO img (name, uri) VALUES ("Creepy Chica", "img/pics/aro.png");');
                    tr.executeSql('INSERT INTO img (name, uri) VALUES ("Samara", "img/pics/aro2.png");');
                    tr.executeSql('INSERT INTO img (name, uri) VALUES ("Alien Oscuro", "img/pics/alien1.png");');
                    tr.executeSql('INSERT INTO img (name, uri) VALUES ("Alien Claro", "img/pics/alien2.png");');
                    tr.executeSql('INSERT INTO img (name, uri) VALUES ("Chica Zombi", "img/pics/chica-zombi.png");');
                    tr.executeSql('INSERT INTO img (name, uri) VALUES ("Zombi", "img/pics/zombi.png");');
                    tr.executeSql('INSERT INTO img (name, uri) VALUES ("Chupacabras", "img/pics/chupacabras.png");');
                    tr.executeSql('INSERT INTO img (name, uri) VALUES ("Fantasmas", "img/pics/ninos-fantasma.png");');
                    tr.executeSql('INSERT INTO img (name, uri) VALUES ("Cara malvada", "img/pics/face.png");');
                }, function(trerr){
                    console.log(trerr.message);
                    return false;
                }, function(tr){
                    console.log(tr);
                    getBanners();
                    return true;
                });
                
            }
         });

        }, function(){
            return false;
        }, function(){
            return true;
        });
    }
    checkDb();

    function saveImgOnDB(imgdata){
        db.transaction(function(tr){
            console.log("Guardando imagen");
            tr.executeSql('INSERT INTO mygallery (uri) VALUES ( "'+imgdata+'");');
        }, function(err){
            console.log(err.message);
            return false;
        }, function(tr){
            //console.log(tr);
            return true;
        });
    }

    function resizes(){
        var windowHeight = $(window).height();
        var windowWidth = $(window).width();
        var canvasFooter = $("#canvasFooter");
        var ctrlBtnW = $(".wrap_controls div img").width();
        $("#lienzo").width('100%').height( (windowHeight - 5)  + "px");
        //$("#canvas_controls").height( (windowHeight - $("#canvasFooter").height())  + "px");
        //$("body").height(device.height);
        //Le doy la altura al titulo principal
        $("#home .home_center_container").css('top', (windowHeight/2) - $(".home_center_container").height() + 'px');
        $("#nuevacreepy .home_center_container").css('top', (windowHeight/3) - $(".home_center_container").height() + 'px');
        //$('.creepyfooter').css('bottom',windowHeight - 120 + "px");
        $('.creepyfooter').css('bottom',0);
        //$(".wrap_controls div").css("height" , windowHeight/5 + "px !important").width(ctrlBtnW * 5).css("margin-left", ((windowWidth - (ctrlBtnW * 5) ) /2)  + "px !important");
        //console.log($(window).orientation);


    }

    setInterval(function(){
        var windowHeight = $(window).height();
        var windowWidth = $(window).width();
        var ctrlBtnW = $(".wrap_controls div img").width();
        $("#nuevacreepy .home_center_container").css('top', (windowHeight/5) - $(".home_center_container").height() + 'px');
        $("#home .home_center_container").css('top', (windowHeight/2) - $(".home_center_container").height() + 'px');
        if(window.innerHeight > window.innerWidth){
            //var boxW = ((windowWidth - (ctrlBtnW * 5) ) /2);
            //console.log(boxW);
            //$(".wrap_controls div#controlButtonBox").css("height" , windowHeight/5 + "px !important").width(ctrlBtnW * 5).css({"margin-left": ((windowWidth - (ctrlBtnW * 5) ) /2)  + "px !important"});
            $("#controlButtonBox").width(ctrlBtnW*5);
            
        }else{
            $("#controlButtonBox").width("100%");
            //$(".wrap_controls").css("height" , windowHeight + "px !important").width(windowWidth / 10);
            //$(".wrap_controls div#controlButtonBox").css("height" , windowHeight + "px !important").width("100%");

        }
        var bannerFlag = banner.set;
        console.log(window.innerWidth)
        if(window.innerWidth <= 500){
            banner.set = banner.low;
        }
        if(window.innerWidth > 500 && window.innerWidth <= 900 ){
            banner.set = banner.medium;
        }
        if(window.innerWidth > 900){
            banner.set = banner.high;
        }

        if(bannerFlag != banner.set){

            $("#header img").remove();
            $("#header").append('<a class="LinkCreppyBanner" target="_system" data-href="' + banner.href + '"><img src="' + banner.set + '" class="creppyBanner" /></a>');
            bannerFlag = banner.set;
        }



        
    },500);
    $('body').on('click','.LinkCreppyBanner',function(){
        var bannerhref = $(this).attr('data-href');
        window.open(bannerhref, '_system');
    })
    

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


    function getBanners(){
        db.transaction(function(tx){
            tx.executeSql("SELECT * FROM banner",null,function(tx,results){
                //console.log(results.rows);
            if(results.rows.length > 0){
                                    
                    var item = results.rows.item(results.rows.length - 1);
                    banner.low = item.low;
                    banner.medium = item.medium;
                    banner.high = item.high;
                    banner.href = item.href;
                    
            }

            console.log(banner);
        });
        },
        function(err){
            alert(err.message);
        },
        function(){

        });
    }




    $('#openAlbum').click(function(){
        console.info('se disparo openAlbum');
        openAlbum();
        //openAlbumTest();
    });

    $('#openCamera').click(function(){
        console.info('se disparo openAlbum');
        openCamera();
        //openCameraTest();
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
        console.log("abriendo album X");
        navigator.camera.getPicture(function(imageData){
            console.info(imageData);
            console.log("supuestamente entramos en la foto");
            photoData = imageData;
            createCanvas();
            $.mobile.changePage( "#create", { transition: "flip", changeHash: false });
        }, function(error){
            console.log("ERROR EN EL ALBUM : " + error);
        }, 
        {
            quality: 50,
            sourceType: 0,
            destinationType: 1
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
                targetWidth: 500, 
                targetHeight: 500,
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
        console.log("entramos a la funcion createCanvas");
        var photo = new Image();
        photo.src = photoData;
        console.log(photoData);
        console.log("ya asignamos el src");
        $("#canvasContent *").remove();
        $(photo).on("load",function(){
            console.log("estamos en el momento de ONLOAD de la imagen");
            var imgW;
            var imgH;
            console.log("w: " + photo.width +" - h: " + photo.height);
            $("#canvasContent").height( imgH  + "px");
            $("canvas").remove();
            canvas = document.createElement('canvas');
            

            // obtengo las coordenadas del centro de la imagen
            var imgCenterY;            
            var imgCenterX;
            //traslado el eje al centro de la imagen

            if(window.innerHeight > window.innerWidth){
                if(photo.width > photo.height){                    
                    imgW = $(window).width();
                    imgH = Math.round($(window).innerWidth() * photo.width/photo.height);

                    console.log("pw: " + imgW.width +" - ph: " + imgH.height);
                    imgCenterY = (imgH/2);            
                    imgCenterX = (imgW/2);
                    

                    canvas.width = imgW;
                    canvas.height = imgH;
                    $("#canvasContent").append(canvas);
                    lienzo = canvas.getContext("2d");
                    lienzo.translate(imgCenterX , imgCenterY );

                    //Defino el angulo de giro, convirtiendo los grados que devuelve el plugin a radianes
                    imgangle =  (90) * (Math.PI/180);

                    //Roto el lienzo en base al angulo
                    lienzo.rotate(imgangle);

                    //dibujo la imagen en torno a la esquina superior izquierda, 
                    //pero le resto la mitad del ancho de la imagen y la mitad del alto 
                    //para que mantener su centro.
                    lienzo.drawImage(photo, -(imgH/2), -(imgW/2), imgH,imgW );
                    lienzo.rotate(-imgangle);
                    lienzo.translate(-imgCenterX , -imgCenterY );

                }else if(photo.width < photo.height){
                    imgW = $(window).width();
                    imgH = Math.round($(window).height() * photo.width/photo.height);
                    canvas.width = imgW;
                    canvas.height = imgH;
                    $("#canvasContent").append(canvas);
                    lienzo = canvas.getContext("2d");
                    lienzo.drawImage(photo,0,0,imgW,imgH);

                }           
                
                //var boxW = ((windowWidth - (ctrlBtnW * 5) ) /2);
                //console.log(boxW);
                //$(".wrap_controls div#controlButtonBox").css("height" , windowHeight/5 + "px !important").width(ctrlBtnW * 5).css({"margin-left": ((windowWidth - (ctrlBtnW * 5) ) /2)  + "px !important"});
                
                console.log('asdf')

            }else{
                
                if(photo.width > photo.height){                    
                    imgH = $(window).height();
                    imgW = Math.round($(window).width() * photo.height/photo.width);
                    canvas.width = imgW;
                    canvas.height = imgH;
                    $("#canvasContent").append(canvas);
                    lienzo = canvas.getContext("2d");
                    lienzo.drawImage(photo,0,0,imgW,imgH);
                }else if(photo.width < photo.height){

                    imgH = $(window).innerHeight();
                    imgW = Math.round($(window).innerWidth() * photo.width/photo.height);

                    console.log("pw: " + imgW.width +" - ph: " + imgH.height);
                    imgCenterY = (imgH/2);            
                    imgCenterX = (imgW/2);
                    

                    canvas.width = imgW;
                    canvas.height = imgH;
                    $("#canvasContent").append(canvas);
                    lienzo = canvas.getContext("2d");
                    lienzo.translate(imgCenterX , imgCenterY );

                    //Defino el angulo de giro, convirtiendo los grados que devuelve el plugin a radianes
                    imgangle =  (-90) * (Math.PI/180);

                    //Roto el lienzo en base al angulo
                    lienzo.rotate(imgangle);

                    //dibujo la imagen en torno a la esquina superior izquierda, 
                    //pero le resto la mitad del ancho de la imagen y la mitad del alto 
                    //para que mantener su centro.
                    lienzo.drawImage(photo, -(imgH/2), -(imgW/2), imgH,imgW );
                    lienzo.rotate(-imgangle);
                    lienzo.translate(-imgCenterX , -imgCenterY );
                }

                


                //$(".wrap_controls").css("height" , windowHeight + "px !important").width(windowWidth / 10);
                //$(".wrap_controls div#controlButtonBox").css("height" , windowHeight + "px !important").width("100%");

            }
            
            //lienzo.drawImage(photo,0,0,imgW,imgH);
        });
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
        db.transaction(function(tx){
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
                    imgObj.angle = (ui.angle.stop * 180 / (Math.PI));
                    if(imgObj.angle< 0){
                        imgObj.angle = 360 - (-1 * imgObj.angle);
                    }
                    /*if(imgObj.angle < 0){
                        console.log(123)
                        imgObj.angle = Math.round(imgObj.angle* 100) / 100;
                    }*/
                    console.log(imgObj.angle);
                    //console.log(imgObj.angle);
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
            $.mobile.changePage( "#create", { transition: "slide", changeHash: false });
        }
        
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
            resizes();
            clearCanvasSpace();
        }else{
            return false;
        };

    });

    function guarderImagen(){
        var imagen = new Image();
        imagen.src = imgObj.url;
        var lienzo = canvas.getContext("2d");
        $(imagen).on("load",function(){            

            //Obtengo el ancho y alto de la imagen
            var imgW = $("img#myCreepyThumbimgId").width();
            var imgH = $("img#myCreepyThumbimgId").height();

            // obtengo las coordenadas del centro de la imagen
            var imgCenterX = imgObj.left + (imgW/2);
            var imgCenterY = imgObj.top + (imgH/2);            
            //console.log(imgH + " - " + imgW);
            lienzo.globalAlpha = fadeimg;
            //traslado el eje al centro de la imagen
            lienzo.translate(imgCenterX , imgCenterY );

            //Defino el angulo de giro, convirtiendo los grados que devuelve el plugin a radianes
            imgangle =  (imgObj.angle) * (Math.PI/180);

            //Roto el lienzo en base al angulo
            lienzo.rotate(imgangle);

            //dibujo la imagen en torno a la esquina superior izquierda, 
            //pero le resto la mitad del ancho de la imagen y la mitad del alto 
            //para que mantener su centro.
            lienzo.drawImage(imagen, -(imgW/2), -(imgH/2), imgW,imgH );
            //lienzo.drawImage(imagen,imgObj.left,imgObj.top,imgW,imgH);
            //console.log(lienzo);
            $("img#myCreepyThumbimgId").remove();
            var imgData = canvas.toDataURL();
            db.transaction(function(tr){
                console.log("Guardando imagen");
                tr.executeSql('INSERT INTO mygallery (uri) VALUES ( "'+imgData+'");');
            }, function(trerr){
                console.log(trerr.message);
                return false;
            }, function(tr){
                //console.log(tr);
                return true;
            });
            prepareMyCreepyGallery();
            resizes();
            clearCanvasSpace();
            $("#canvasContent canvas").remove();
            $("#draggable-test").remove();
        });
    }

    function cancelarImagen(){
        clearCanvasSpace()
        $("#canvasContent *").remove();
        $("#draggable-test").remove();
        $.mobile.changePage( "#home", { transition: "slide", changeHash: false });
    }

    $(".sharepic").click(function(){
        window.plugins.socialsharing.share(null, 'Android filename', selectPic, null);
    });

    function clearCanvasSpace(){
        photoData= null;
        canvas = null;
        selectPic = null;
    }
    

    $("#gotoMyCreepyGallery, .gotoMyCreepyGallery").click(function(){
        prepareMyCreepyGallery();
    });
    

    function prepareMyCreepyGallery (){
        resizes();
        clearCanvasSpace();
        $("#MyCreepyGalleryContent *").remove();
        db.transaction(function(tx){
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
    });

    // Window load event used just in case window height is dependant upon images



});
