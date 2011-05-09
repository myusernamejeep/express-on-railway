require('./spec_helper').init(exports);

var app = require('express').createServer();
require('express-on-railway').init(app);
app.listen(args.shift() || 3000);

var c = require('../lib/controller').load('test', 'test');

it('should load controller', function (test) {
    test.ok(c.respondTo('test'));
    test.ok(c.respondTo('action'));
    test.done();
});

it('should perform test action',   perform('test',   'beforeAllExceptTest'));
it('should perform action action', perform('action', 'beforeTestOnly'));

function perform (action, except) {
    return function (test) {
        var req = {
            notify: sinon.spy(function (msg) {
                test.notEqual(msg, except);
                if (msg == 'done') done();
                c.next();
            }),
            render:   function () {},
            send:     function () {},
            redirect: function () {},
            flash:    function () {}
        };

        c.perform(action, req, 'res');

        function done () {
            test.equal(req.notify.callCount, 4);
            test.done();
        }
    }
}
