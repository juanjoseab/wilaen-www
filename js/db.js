window.dbo = {
	db : window.openDatabase("Database", "1.0", "dbtx", 200000),
	init : function (){	
		this.db.transaction(this.checkDB, this.errorCB, this.successCB);
	},
	checkDB : function(tx){
		 tx.executeSql("SELECT * FROM sqlite_master WHERE type='table' AND name='img'",null,function(tx,results){
		 	//console.log(results);
		 	if(results.rows.length > 0) {
		 		//console.log("tengo rows");
		 	}else{
		 		//console.log("no tengo rows");
		 		window.dbo.db.transaction(function(tr){
		 			console.log("ejecutanto statements");
		 			tr.executeSql('CREATE TABLE IF NOT EXISTS mygallery (id INTEGER PRIMARY KEY, uri);');
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
				    console.log("fin de los  statements");
				}, function(trerr){
					console.log(trerr.message);
					return false;
				}, function(tr){
					console.log(tr);
					return true;
				});
				
		 	}
		 });

		  /*tx.executeSql("SELECT * FROM sqlite_master WHERE type='table' AND name='mygallery'",null,function(tx,results){
		 	//console.log(results);
		 	if(results.rows.length > 0) {		 		
		 	}else{
		 		window.dbo.db.transaction(function(tr){
				    tr.executeSql('CREATE TABLE IF NOT EXISTS mygallery (id unique, uri)');				    
				}, function(trerr){					
					
				}, function(tr){					
					
				});
				
		 	}
		 });*/


	},	
	errorCB : function (err) {
		console.log(err.message);
		return false;
	    //alert("Error processing SQL: " + err);
	},
	successCB : function () {
	    //alert("success!");
	    return true;
	},
	saveImg : function(imgdata) {
		window.dbo.db.transaction(function(tr){
		 			console.log("Guardando imagen");
				    tr.executeSql('INSERT INTO mygallery (uri) VALUES ( "'+imgdata+'");');
				}, function(trerr){
					console.log(trerr.message);
					return false;
				}, function(tr){
					//console.log(tr);
					return true;
				});
	}

}
//alert(0);
//window.db.populateDB();
