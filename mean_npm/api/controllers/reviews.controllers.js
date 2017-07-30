var mongoose = require('mongoose');
var Hotel = mongoose.model('Hotel');
var response = { status: 400, result: null };

module.exports.reviewsGetAll = function(req, res) {

	var hotelId = req.params.hotelId;
	console.log("Get hotel", hotelId);
    
    Hotel
        .findById(hotelId)
        .select('reviews')
        .exec(function (err, doc) {
            if(err) {
                console.log("Error: " + err);
                response.status = 500;
                response.result = err;
            }
            else {
	            console.log("find one", doc);
                response.status = 200;
                response.result = doc.reviews;
            }
            res 
                .status(response.status)
                .json(response.result);
    });
};

module.exports.reviewsGetOne = function(req, res) {

	var hotelId = req.params.hotelId;
    var reviewId = req.params.reviewId;

	console.log("Get hotel", hotelId);
	console.log("Get hotel", reviewId);
    
    Hotel
        .findById(hotelId)
        .select('reviews')
        .exec(function (err, hotel) {
            if(err) {
                console.log("Error: " + err);
                response.status = 500;
                resonse.result = err;
            }
            else {
	            console.log("Returned hotel", hotel);
                var review = hotel.reviews.id(reviewId);
                if(!review) {
                    response.status = 404;
                    response.result = { message : "review does not exist"}
                }else { 
                    response.status = 200;
                    response.result = review;
                }
            }
            res 
                .status(response.status)
                .json(response.result);
    });
};


function _addReview(req, res, hotel) {
    
    hotel.reviews.push({
            name: req.body.name,
            rating: parseInt(req.body.rating, 10),
            review: req.body.review
    });

    hotel.save(function(err, hotelUpdated) {
        if(err) {
            res
                .status(500)
                .json(err);
        }
        else {
            res 
                .status(201)
                .json(hotelUpdated.reviews[hotelUpdated.reviews.length -1]);
        }
    });
        
};

module.exports.reviewsAddOne = function(req, res) {

	var hotelId = req.params.hotelId;
	console.log("Get hotel", hotelId);
    
    Hotel
        .findById(hotelId)
        .select('reviews')
        .exec(function (err, doc) {
            if(err) {
                console.log("Error: " + err);
                response.status = 500;
                response.result = err;
            }
            else if(!doc){
	            console.log("Hotel id not found", hotelId);
                response.status = 404;
                response.result = {message: "Hotel id not found"};
            } 
            if(doc) {
                _addReview(req, res, doc);
            } else {

                res 
                    .status(response.status)
                    .json(response.result);
            }
    });
};


module.exports.reviewsUpdateOne = function(req, res) {
	var hotelId = req.params.hotelId;
    var reviewId = req.params.reviewId;

	console.log("Get hotel", hotelId);
	console.log("Get review", reviewId);
    
    Hotel
        .findById(hotelId)
        .select('reviews')
        .exec(function (err, hotel) {
            if(err) {
                console.log("Error: " + err);
                response.status = 500;
                resonse.result = err;
            }
            else {
	            console.log("Returned hotel", hotel);
                var review = hotel.reviews.id(reviewId);
                if(!review) {
                    response.status = 404;
                    response.result = { message : "review does not exist"}
                }else { 
                    //update review
                    review.name = req.body.name;
                    review.rating = parseInt(req.body.rating, 10);
                    review.review =req.body.review;
                    
                    hotel.save(function(err, hotelUpdated) {
                        if(err) {
                            res
                                .status(500)
                                .json(err);
                        }
                    });

                    response.status = 204;
                    response.result = {};
                    

                }
            }
            res 
                .status(response.status)
                .json(response.result);
    });

};
module.exports.reviewsDeleteOne = function(req, res){
	var hotelId = req.params.hotelId;
    var reviewId = req.params.reviewId;

	console.log("Get hotel", hotelId);
	console.log("Get review", reviewId);
    
    Hotel
        .findById(hotelId)
        .select('reviews')
        .exec(function (err, hotel) {
            if(err) {
                console.log("Error: " + err);
                response.status = 500;
                resonse.result = err;
            }
            else {
	            console.log("Returned hotel", hotel);
                hotel.reviews.id(reviewId).remove();
                    //update review
                    
                    hotel.save(function(err, hotelUpdated) {
                        if(err) {
                            res
                                .status(500)
                                .json(err);
                        }
                    });

                    response.status = 204;
                    response.result = {};
                    

            }
            res 
                .status(response.status)
                .json(response.result);
    });

};
