describe('Multi Entry Test', function () {
    it('create db with promise', function (done) {
        con.jsStoreCon_.isDbExist('MultiEntryTest').then(function (exist) {
            console.log('db exist :' + exist);
            if (exist) {
                con.jsStoreCon_.openDb('MultiEntryTest').then(function () {
                    onDbInit();
                    done();
                });

            } else {
                con.jsStoreCon_.createDb(MultiEntryTest.getDbSchema()).then(function (tableList) {
                    expect(tableList).to.be.an('array').length(1);
                    console.log('Database created');
                    done();
                });
            }
        }).
        catch(function (err) {
            done(err);
        });
    });

    it('insert data into table', function (done) {
        con.jsStoreCon_.insert({
            into: 'people',
            values: MultiEntryTest.getValues()
        }).
        then(function (results) {
            expect(results).to.be.an('number').equal(3);
            done();
        }).
        catch(function (err) {
            done(err);
        })
    });

    it('multientry test without multientry column - select data from array', function (done) {
        con.jsStoreCon_.select({
            from: 'people',
            where: {
                tags: 'mongo'
            }
        }).
        then(function (results) {
            expect(results).to.be.an('array').length(0);
            done();
        }).
        catch(function (err) {
            done(err);
        })
    });

    it('change db with multientry column', function (done) {
        con.runSql('IsDbExist MultiEntryTest table person version 2').then(function (exist) {
            console.log('db exist :' + exist);
            if (exist) {
                con('openDb MultiEntryTest');
                done();
            } else {
                var Db = MultiEntryTest.getDbSchema();
                Db.tables[0].version = 2;
                Db.tables[0].columns[1].multiEntry = true;
                con.jsStoreCon_.createDb(Db).then(function (tableList) {
                    expect(tableList).to.be.an('array').length(1);
                    console.log('Database created');
                    done();
                });
            }
        }).catch(function (err) {
            done(err);
        });
    });

    it('insert data into table multiEntryTest', function (done) {
        con.jsStoreCon_.insert({
            into: 'people',
            values: MultiEntryTest.getValues()
        }).
        then(function (results) {
            expect(results).to.be.an('number').equal(3);
            done();
        }).
        catch(function (err) {
            done(err);
        })
    });

    it('multientry test with multientry column - select data from array', function (done) {
        con.jsStoreCon_.select({
            from: 'people',
            where: {
                tags: 'mongo'
            }
        }).
        then(function (results) {
            expect(results).to.be.an('array').length(1);
            done();
        }).
        catch(function (err) {
            done(err);
        })
    });

    it('unique column test', function (done) {
        var value = {
            name: "Ray",
            tags: ["apple", "banana", "beer"]
        };
        con.jsStoreCon_.insert({
            into: 'people',
            values: [value]
        }).
        then(function (results) {
            expect(results).to.be.an('array').length(1);
            done();
        }).
        catch(function (err) {
            console.log(err);
            done();
        })

    });

    it('array data type check', function (done) {
        var value = {
            name: "Ray",
            tags: "apple"
        };
        con.jsStoreCon_.insert({
            into: 'people',
            values: [value]
        }).
        then(function (results) {
            expect(results).to.be.an('array').length(1);
            done();
        }).
        catch(function (err) {
            var error = {
                "message": "Supplied value for column 'tags' have wrong data type",
                "type": "wrong_data_type"
            };
            expect(err).to.be.an('object').eql(error);
            done();
        })

    });
});

var MultiEntryTest = {
    getDbSchema: function () {
        var people = {
                name: 'people',
                columns: [{
                        name: 'name',
                        unique: true,
                        dataType: JsStore.DATA_TYPE.String
                    },
                    {
                        name: 'tags',
                        dataType: JsStore.DATA_TYPE.Array
                    }
                ]
            },
            dataBase = {
                name: 'MultiEntryTest',
                tables: [people]
            };
        return dataBase;
    },
    getValues: function () {
        var values = [{
                name: "Ray",
                tags: ["apple", "banana", "beer"]
            },
            {
                name: "Scott",
                tags: ["beer"]
            }, {
                name: "Marc",
                tags: ["mongo", "jenkins"]
            }
        ];
        return values;
    }
}