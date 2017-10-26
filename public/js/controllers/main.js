angular.module('todoController', [])

	// inject the Todo service factory into our controller
	.controller('mainController', ['$scope','$http','Todos', function($scope, $http, Todos) {
		$scope.formData = {};
		$scope.loadingData = false;
		$scope.loading = true;
		Todos.get()
			.success(function(data) {
				localStorage.setItem("cachedData", data);
				$scope.todos = data;
				$scope.loading = false;
			});

		// CREATE ==================================================================

		$scope.startStopWatch = function() {
			$scope.loadingData = true;
			if(localStorage.getItem("toggleStartStop")==null || localStorage.getItem("toggleStartStop")=="startNext"){
			if (navigator.geolocation) {

				navigator.geolocation.getCurrentPosition(function showPosition(position) {
			console.log("Latitude: " + position.coords.latitude +
			"<br>Longitude: " + position.coords.longitude);
			var data=JSON.parse('{"text": "Latitude:'+position.coords.latitude+' Time:'+new Date()+' "}')
			Todos.create(data)

				// if successful creation, call our get function to get all the new todos
				.success(function(data) {
					//$scope.id=data._id;
					localStorage.setItem("lastStartedWatchId", data._id);
					Todos.get()
						.success(function(data) {

							$scope.todos = data;
							$scope.loadingData = false;
							$scope.loading = false;
							localStorage.setItem("toggleStartStop", "stopNext");
							pseudoToggle =false;
						}).error(function(){
							console.log("No connection");
							$scope.todos =localStorage.getItem("cachedData");
						});
				}).error(function(){
					console.log("No connection");
					$scope.todos =localStorage.getItem("cachedData");
				});

			});

			} else {
				console.log("Geolocation is not supported by this browser.");
			}

		}
		else if (localStorage.getItem("toggleStartStop")=="stopNext"){
			console.log("Stopping");
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function showPosition(position) {
			console.log("Latitude: " + position.coords.latitude +
			"<br>Longitude: " + position.coords.longitude);
			var data=JSON.parse('{"text": "Latitude:'+position.coords.latitude+new Date(0)+'"}')
			Todos.getById(localStorage.getItem("lastStartedWatchId"),data)

				// if successful creation, call our get function to get all the new todos
				.success(function(data) {
					$scope.loading = false;
					$scope.loadingData = false;
					$scope.formData = {}; // clear the form so our user is ready to enter another
					$scope.todos = data; // assign our new list of todos
				}).error(function(){
					console.log("No connection");
					$scope.todos =localStorage.getItem("cachedData");
				});;

			});
			} else {
				console.log("Geolocation is not supported by this browser.");
			}
		}
		//toggle=!toggle;
		localStorage.setItem("toggleStartStop", "startNext");
		}


		// DELETE ==================================================================
		// delete a todo after checking it
		$scope.deleteTodo = function(id) {
			$scope.loading = true;

			Todos.delete(id)
				// if successful creation, call our get function to get all the new todos
				.success(function(data) {
					$scope.loading = false;
					$scope.todos = data; // assign our new list of todos
				});
		};
	}]);
