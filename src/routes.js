var routes = function(app, express) {

    var router = express.Router();

    app.get("/", function(req, res) {
        res.send("hello world");
    });
};

module.exports = routes;
