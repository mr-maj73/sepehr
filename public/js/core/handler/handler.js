function Queue() {
    this._oldestIndex = 0;
    this._newestIndex = 0;
    this._storage = {};
}

Queue.prototype.size = function() {
    return this._newestIndex - this._oldestIndex;
};

Queue.prototype.enqueue = function(data) {
    this._storage[this._newestIndex] = data;
    this._newestIndex++;
};

Queue.prototype.dequeue = function() {
    var oldestIndex = this._oldestIndex,
        newestIndex = this._newestIndex,
        deletedData;

    if (oldestIndex !== newestIndex) {
        deletedData = this._storage[oldestIndex];
        delete this._storage[oldestIndex];
        this._oldestIndex++;

        return deletedData;
    }
};

Queue.prototype.first = function() {
    var oldestIndex = this._oldestIndex,
        deletedData = this._storage[oldestIndex];

        return deletedData;
};




var exec = require('child_process').execFile,
    child;
var fs = require('fs');


var mail = {
    subject:"ds",
    from:[{address:"b.bakhshi94@gmail.com"}],
    text:"body",
    attachments:[{generatedFileName:"9122471-1.zip"}],
    messageId:"CAPE9n4xBEJ=iZ5oJNwiRWSr-obOqbcQ3D8w060rUeuB1hnmNNA@mail.gmail.com"
};
var localStorage = {script:"D:\\Documents\\Sepehr\\SepehrJs\\Sepehr-DS-Checker.exe"};
global.ATTACHMENT_DIR = "C:\\Users\\Masoud\\AppData\\Local\\sepehr\\attachments";

var mailQ = new Queue();

startProcess = function(mail,callback){
    var obj = {mail:mail, callback:callback};

    mailQ.enqueue(obj);
    checkProcess();
};

checkProcess = function(){
    var len = mailQ.size();
    console.log(len + " Process in Queue");
    if(len == 1){
        var m = mailQ.first();
        console.log("Starting "+mailQ._newestIndex);
        startProcessNew(m.mail, m.callback)
    }
    else{

        console.log("Queue Full");
    }
};

endProcess = function(err,res,cb, code){

    cb(err,res, code);
    mailQ.dequeue();
    console.log("Ending "+mailQ._oldestIndex);
    var len = mailQ.size();
    console.log(len + " Process in Queue");
    if(len > 0){
        var m = mailQ.first();
        console.log("Starting "+mailQ._newestIndex);
        startProcessNew(m.mail, m.callback)
    }
    else{

        console.log("Queue Full");
    }
};
startProcessOld = function(mail,callback){
    /*var attachments = []
    for(var i=0 ; i<mail.attachments.length; i++){
        attachments.push(path+"/"+mail.attachments[i].filename);
    }*/

    var res = {};
    var err = null;
    options = ["user",mail.from[0].address,mail.subject,
        mail.text];
    if(mail.attachments){
        for(var i =0 ; i< mail.attachments.length; i++)
            options.push(global.ATTACHMENT_DIR+"\\"+mail.messageId+"\\in\\"+mail.attachments[i].generatedFileName);
    }
//child = exec('Sepehr-ExerciseChecker.exe',["user","shahrzad_ZA@yahoo.com","ds","This Is Body",'C:\\Sepehr\\Exercises\\9111257\\SELECTIONSORT\\9111257-1.zip'],{cwd:"D:\\Documents\\Visual Studio 2012\\Projects\\Sepehr-ExerciseChecker\\Sepehr-ExerciseChecker\\obj\\Debug"},
    //child = exec('Sepehr-ExerciseChecker.exe',options
    child = exec(localStorage.script,options
        //,{cwd:"D:\\Documents\\Visual Studio 2012\\Projects\\Sepehr-ExerciseChecker\\Sepehr-ExerciseChecker\\obj\\Debug"}
        ,
  function (error, stdout, stderr) {
      //console.debug('stdout: ' + stdout);
      //console.debug('stderr: ' + stderr);
      var out = stdout.substring(stdout.indexOf('{'),stdout.lastIndexOf('}')+1);
      //console.debug(out);
      if(out == ""){
          err = "Unknown Mail";
          return;
      }

        var out2 = {};
      try {
          out2 = JSON.parse(out);
          out2.body = parseBody(out2.body);
      }catch (ex){
          out = out.substring(0,out.indexOf("}")+1);
          out2 = parseBody(out);
          out2 = JSON.parse(out2);

      }
      res = out2;
      res.text = res.body;
      delete res.body;
      try{
      console.debug(res);
      }catch (ex){}

      if (error !== null) {
          err = error;
          try{
          console.debug(error);
          }catch (ex){}
      }
  });

    child.on('close', function (code) {
        try{
            console.debug('Closed With Code : ' + code);
        }catch (ex){}
        endProcess(err,res,callback, code)
    });

};
var parseBody = function(body){
    var newBody = "";
    var i =body.indexOf('$');
    while(i != -1 ){
        newBody += body.substring(0,i);
        switch (body.charAt(i+1)){
            case 'n':newBody += "\n"; break;
            case 't':newBody += "\t"; break;
            case '"':newBody += "\\\""; break;
            case '\\':newBody += "\\"; break;
            case 'r':newBody += "\r"; break;
        }
        body = body.substring(i+2,body.length);
        i =body.indexOf('$');
    }
    newBody += body;
    return newBody;
};

/*var temp = '{"subject":"Result","to":"b.bakhshi94@gmail.com","body":"Test: SELECTIONSORT$tExit Code: 100$nTest: SELECTIONSORT$tExit Code: 100$n"}';
var temp2 = '{"subject":"Result","to":"b.bakhshi94@gmail.com","body":"Test: SELECTIONSORT\tExit Code: 100\nTest: SELECTIONSORT\tExit Code: 100\n}';
//res = parseBody(out);
res = JSON.parse(temp);
//res2 = parseBody(res);
res2.body = parseBody(res.body);
console.log(res2);*/

/*startProcess(mail,function(err, res, code){
    console.log(res);
});*/
startProcessNew = function(mail,callback){
    /*var attachments = []
     for(var i=0 ; i<mail.attachments.length; i++){
     attachments.push(path+"/"+mail.attachments[i].filename);
     }*/

    var res = {};
    var err = null;
    var path = global.ATTACHMENT_DIR+"\\"+mail.messageId;
    var inPut = path+"\\in";
    var outPut = path;
    options = [inPut, outPut];//+"\\out"];
//child = exec('Sepehr-ExerciseChecker.exe',["user","shahrzad_ZA@yahoo.com","ds","This Is Body",'C:\\Sepehr\\Exercises\\9111257\\SELECTIONSORT\\9111257-1.zip'],{cwd:"D:\\Documents\\Visual Studio 2012\\Projects\\Sepehr-ExerciseChecker\\Sepehr-ExerciseChecker\\obj\\Debug"},
    //child = exec('Sepehr-ExerciseChecker.exe',options
    child = exec(localStorage.script,options
        ,
        //{cwd:"D:\\Documents\\Visual Studio 2012\\Projects\\Sepehr-ExerciseChecker\\Sepehr-ExerciseChecker\\obj\\Debug"},
        function (error, stdout, stderr) {
            //console.debug('stdout: ' + stdout);
            //console.debug('stderr: ' + stderr);
            try{

            if (error !== null) {
                err = error;
                try{
                console.debug(error);
                }catch (ex){}
            }


                res.to = fs.readFileSync(outPut+"\\head.txt");
                res.subject = fs.readFileSync(outPut+"\\subject.txt");
                res.text = fs.readFileSync(outPut+"\\body.txt");

            }catch (ex){

            }


        });

    child.on('close', function (code) {
        try{
            console.debug('Closed With Code : ' + code);
        }catch (ex){}
        endProcess(err,res,callback, code)
    });
};


