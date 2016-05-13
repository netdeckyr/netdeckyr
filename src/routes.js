var routes = function(app, express) {
    app.get("/", function(req, res) {
        res.send("hello world");   
    });
}

module.exports = routes;
