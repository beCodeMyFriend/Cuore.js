CUORE.Boot=(function(doc, undefined) {
    var booted=false;
    var toBeBooted=[];
    var bootApplication=function(appConstructor, baseURL) {
        var app=new appConstructor(baseURL);
        app.draw();
    };

    var ns = {
        onBootCall: function(callback) {
            var checkLoaded = setInterval(function() {
                if (doc.body && doc.getElementById) {
                    clearInterval(checkLoaded);
                    booted=true;
                    callback();
                }
            }, 10);
        },
        registerApplication: function(app, baseURL) {
            if(booted)
                bootApplication(app, baseURL);
            else
              toBeBooted.push(function() {
                  bootApplication(app, baseURL);
              });
        }
    };

    ns.onBootCall(function() {
        for(var i=0,len=toBeBooted.length;i<len;i++) {
            try {
                toBeBooted[i]();
            } catch(err) {

            }
        }
    });
  
    return ns;
})(document);
