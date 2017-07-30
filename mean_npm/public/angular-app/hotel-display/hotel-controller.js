angular.module('meanhotel')
.controller('HotelController', HotelController);

function HotelController($routeParams, $route, hotelDataFactory) {
    var vm = this;
    var id = $routeParams.id;


    hotelDataFactory.hotelDisplay(id).then(function(response){
        vm.hotel = response.data;
        vm.stars = _getStarRating(response.data.stars);
    });
    
    function _getStarRating(stars) {
        return new Array(stars);
    }


    vm.addReview = function() {
        console.log("In Add review");
        var postData = {
            name: vm.name,
            rating: vm.rating,
            review: vm.review
        };
        if(vm.reviewForm.$valid) {
            hotelDataFactory
                .postReview(id, postData)
                .then(function(response){

                    console.log("Checking status: ", response.status); 
                    var st = parseInt(response.status, 10);
                    if(st == 200 || st == 201) {
                        console.log("reloading"); 
                        $route.reload();
                    }
                }).catch(function(error) {
                    console.log(error);
                });
        }
        else {
            console.log("Submitted"); 
            vm.isSubmitted = true;
        }
    }

}
