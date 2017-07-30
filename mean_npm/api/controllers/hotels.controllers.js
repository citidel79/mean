var mongoose = require('mongoose');
var Hotel = mongoose.model('Hotel');
var response = {
    status: 200,
    message : "Ok"
};

function respond(res, response) {
    res
        .status(response.status)
        .json(response.message);
};

var runGeoQuery = function(req, res) {

     if(isNaN(req.query.lat) || isNaN(req.query.lng)) {
        response.status = 404;
        response.message = { message : "lat and lng must be numbers" };
        respond(res, response);
     }
     else {

     var lng = parseFloat(req.query.lng);
     var lat = parseFloat(req.query.lat);

     //a geoJson point

     var point = {
             type: "Point",
             coordinates: [lng, lat]
     };

     var geoOptions = {
             spherical : true,
             maxDistance : 2000,
             num : 5
     };

     Hotel
        .geoNear(point, geoOptions, function(err, results, stats) {
                if(err) {
                    response.status = 500;
                    response.message = err;
                }
                else {
                    console.log('Geo results', results);
                    console.log('Geo stats', stats);
                    response.message = results
                }

                res
                    .status(response.status)
                    .json(response.message);
                

        });
     }
};

module.exports.hotelsGetAll = function(req, res) {

    var offset = 0;
    var count = 5;
    var maxCount = 10;

    if(req.query && req.query.lat && req.query.lng) {
            if(isNaN(req.count) && isNaN(req.offset)){
                    res 
                        .status(400)
                        .json( {message: "If supplies in querystring count and offset need to be numbers" });
                    return;
            }
            runGeoQuery(req, res);
            return;
    }


    if(req.query && req.query.offset) {
        offset = parseInt(req.query.offset, 10);
    }
    if(req.query && req.query.count) {
        count = parseInt(req.query.count, 10);
    }
    

    if( count > maxCount) {
            res
                    .status(400)
                    .json( { message : " Count limit of " + maxCount + "exceeded" });
        return;

    }

    Hotel
        .find()
        .skip(offset)
        .limit(count)
        .exec(function(err, hotels) {
            if(err){
                res
                    .status(500)
                    .json(err)
                    return;
            }
            else {
                    console.log("Found hotels", hotels.length);
                    console.log("Hotels", hotels);
                    res
                        .json(hotels);
                    return;
            }
        });
        
};

module.exports.hotelsGetOne = function(req, res) {
	var hotelId = req.params.hotelId;
	console.log("Get hotel", hotelId);
    
    Hotel
        .findById(hotelId)
        .exec(function (err, doc) {
            response.message = doc;

            if(err) {
                console.log("Error finding hotel");
                response.status = 500;
                response.message = err;
            }
            if(!doc) {
                console.log("Error no doc");
                response.status = 404;
                response.message = {message: "no doc"};
            }
            res 
                .status(response.status)
                .json(response.message);
            
    });
};

var _splitArray = function(input) {
    var output;

    if(input && input.length > 0) {
        output = input.split(";");
    } else {
        output = [];
    }

    return output;
};


module.exports.hotelsAddOne = function(req, res) {

    Hotel
        .create({
            name : req.body.name,
            description: req.body.description,
            stars: parseInt(req.body.stars),
            services: _splitArray(req.body.services),
            photos: _splitArray(req.body.photos),
            currency: req.body.currency,
            "location": {
                address: req.body.address,
                coordinates: [parseFloat(req.body.lng), 
                                parseFloat(req.body.lat)]
            }

        }, function(err, hotel) {
            if(err) {
                console.log("Error creating hotel");
                res
                    .status(400)
                    .json(err);
            } else {
                console.log("Hotel created " + hotel);
                res
                    .status(201)
                    .json(hotel);
            }
        


        });
};

module.exports.hotelsUpdateOne = function(req, res) {
    var hotelId = req.params.hotelId;
	console.log("Get hotel", hotelId);
    
    Hotel
        .findById(hotelId)
        .select("-reviews -rooms")
        .exec(function (err, doc) {
            response.message = doc;

            if(err) {
                console.log("Error finding hotel");
                response.status = 500;
                response.message = err;
            }
            if(!doc) {
                console.log("Error no doc");
                response.status = 404;
                response.message = {message: "no doc"};
            }
            if(response.status != 200) {
                res 
                    .status(response.status)
                    .json(response.message);

            }
            else {
               doc.name = req.body.name;
               doc.description = req.body.description;
                doc.stars =  parseInt(req.body.stars, 10);
                doc.services = _splitArray(req.body.services);
                doc.photos =  _splitArray(req.body.photos);
                doc.currency = req.body.currency
                doc.location =  {
                    address: req.body.address,
                    coordinates: [parseFloat(req.body.lng), 
                                    parseFloat(req.body.lat)]
                };
                doc.save(function(err, hotelUpdated) {
                        if(err) {
                            res 
                                .status(500)
                                .json(err);
                        }
                        else {
                            res
                                .status(204)
                                .json();
                        }
                });
            }
    });
};
module.exports.hotelsDeleteOne = function(req, res){
        var hotelId = req.params.hotelId;

        Hotel
            .findByIdAndRemove(hotelId)
            .exec(function(err, hotel) {
                    if(err){
                        res
                            .status(404)
                            .json(err);
                    }
                    else {
                        console.log("Hotel deleted, id: ", hotelId);
                        res
                            .status(204)
                            .json();
                    }
                    

            });
};
