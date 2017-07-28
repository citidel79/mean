var mongoose = require('mongoose');
var Hotel = mongoose.model('Hotel');

module.exports.reviewsGetAll = function(req, res) {

	var hotelId = req.params.hotelId;
	console.log("Get hotel", hotelId);
    
    Hotel
        .findById(hotelId)
        .exec(function (err, doc) {
	        console.log("find one", doc);
            res 
                .status(200)
                .json(doc.reviews);
    });
};

module.exports.reviewsGetOne = function(req, res) {

};
