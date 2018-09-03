angular.module('starter.controllers', ['ngCordova', 'ionic', 'ngMap', 'luegg.directives', 'cleave.js'])

.controller('LoginCtrl', function($scope, ionicMaterialInk, $window, LoginService, $ionicPopup, $ionicLoading, $state, $rootScope) {
	
	var ls = localStorage;
	$scope.data = {}; // Declare variabel utk menyimpan data input dari user pada saat login

	// $ionicLoading.hide();
	// ionicMaterialInk.displayEffect();
	$ionicLoading.hide();
	$scope.login = function() { // Fungsi login
	// utk menampilkan efek loading pada saat app dibuka
	$rootScope.showLoading($ionicLoading);

	// validasi input dari user
	if ($scope.data.username === undefined && $scope.data.password === undefined) {
		$rootScope.showPopup($ionicPopup,'Login Failed!','Please fill your username and password', 'popup-error'); 
		$ionicLoading.hide();
	} else if ($scope.data.username === undefined || $scope.data.username === "") {
		$rootScope.showPopup($ionicPopup,'Login Failed!','Username must be filled!', 'popup-error'); 
		$ionicLoading.hide();
	} else if ($scope.data.password === undefined || $scope.data.password === "") {
		$rootScope.showPopup($ionicPopup,'Login Failed!','Password must be filled!', 'popup-error'); 
		$ionicLoading.hide();
	} else if ($scope.data.username !== undefined && $scope.data.password !== undefined) {
		// jika input dari user sudah benar, maka sistem akan melakukan login ke server dgn parameter username dan password
		LoginService.login($scope.data.username, $scope.data.password).success(function(data) {
			// console.log(data);
			ls.setItem("userid", data.userId); // menyimpan data user id kedalam local storage
			ls.setItem("token", data.id); // menyimpan data id yg akan digunakan sbg token kedalam local storage
			
			// $state.go('app.home'); // menampilkan halaman home
			LoginService.getUserById(ls.getItem("userid")).success(function(data) {
				$scope.profile = {};
				$scope.profile = data;

				if($scope.profile.role === "Organizer"){
					ls.setItem("firstRoundMatchesStatus", "On Progress");
					ls.setItem("secondRoundMatchesStatus", "On Progress");
					ls.setItem("thirdRoundMatchesStatus", "On Progress");
					ls.setItem("knockoutSchedulingStat", "On Progress");
					ls.setItem("groupStageClassementStatus", 'On Progress');
					ls.setItem("firstRoundMatchesStatus", "On Progress");
					ls.setItem("secondRoundMatchesStatus", "On Progress");
					ls.setItem("thirdRoundMatchesStatus", "On Progress");
					ls.setItem("roundOf16MatchesStatus", "On Progress");
					ls.setItem("quarterFinalMatchesStatus", "On Progress");
					ls.setItem("semiFinalMatchesStatus", "On Progress");
					ls.setItem("thirdPlaceMatchesStatus", "On Progress");
					ls.setItem("finalMatchesStatus", "On Progress");
					$state.go('app.home');
					// $ionicLoading.hide();
				}else if($scope.profile.role === "Player"){
					if($scope.profile.profileCompleted === "" || $scope.profile.profileCompleted === null){
						$scope.profileCompleted = false;
						// console.log("profile completed false");
					}
					$ionicLoading.hide();
					$state.go('app.home');
				}else if($scope.profile.role === "Manager"){
					$state.go('app.home'); 
					// $ionicLoading.hide();
				}else if($scope.profile.role === "Coach"){
					$state.go('app.home'); 
					$ionicLoading.hide();
				}else{
					$state.go('app.home'); 
					$ionicLoading.hide();
				}
			}).error(function(data) {
				$ionicLoading.hide();
			});
			$ionicLoading.hide(); // menghilangkan efek loading jika semua proses sudah selesai
		}).error(function(data) {
			// console.log(data);
			$ionicLoading.hide();
			// menampilkan alert ke user jika proses login tidak berhasil
			if(data == 'Error 500'){
				$rootScope.showPopup($ionicPopup,'Login Failed!','There was an error. Please try again later...', 'popup-error');
			}else{
				$rootScope.showPopup($ionicPopup,'Login Failed!','Username &amp; password don’t match!', 'popup-error');
			}
			
		});
	}
	};
})

.controller('RegisterCtrl', function($scope, $state, $rootScope, RegisterService, $ionicPopup, $ionicPlatform, $ionicLoading, PostService) {
	
	var ls = localStorage;
	$ionicLoading.hide();
	
	$scope.data = {}; // declare variabel utk menyimpan data input dari user pada saat register
	$scope.data.id = "U" + $rootScope.randomString;
	$scope.data.ktp = "";

	$scope.register = function() { // fungsi register

		// List no ktp
		$scope.ktpArr = ["1029394923924","12345678910","1022392423498","5239395923924","2320304923924"];
		// $scope.registeredKtpArr = [];
		// list no ktp

		// default data //
		$scope.data.address = "";
		$scope.data.age = "";
		$scope.data.bio = "";
		$scope.data.hp = "";
		$scope.data.photo = "";
		$scope.data.profileCompleted = "";
		$scope.data.status = "";
		$scope.data.availableDayAndTime = {};
		// default data player //
		$scope.data.assist = "";
		$scope.data.goal = "";
		$scope.data.redCard = "";
		$scope.data.yellowCard = "";
		$scope.data.play = "";
		// default data manager //
		$scope.data.matchManaged = "";
		$scope.data.position = "";
		$scope.data.team = "";
		$scope.data.teamInvitation = "";
		$scope.data.teamRequested = "";
		// default data referee //
		$scope.data.redCardGiven = "";
		$scope.data.yellowCardGiven = "";

		// validasi nomor ktp
		// $scope.ktpnumArr = $scope.ktpArr.split(",");
		$scope.isKTPValid = "";
		// $scope.isKTPUsed = "";

		for(var i = 0; i < $scope.ktpArr.length; i++){
			
			if($scope.data.ktp !== $scope.ktpArr[i]){
				$scope.isKTPValid = "false";
				
			}else{
				// if($scope.registeredKtpArr.indexOf($scope.ktpArr[i]) === -1){
					
					$scope.isKTPValid = "true";
					// $scope.registeredKtpArr.push($scope.ktpArr[i]);
					break;
				// }else{
				// 	$scope.isKTPUsed = "true";
				// 	console.log("ktp number already used !");
				// 	// $rootScope.showPopup($ionicPopup,'Register failed!','KTP number already used');
				// }
			}
		}

		// validasi input dari user
		var passwordRe = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
		$scope.validatePassword = passwordRe.test($scope.data.password); // validasi password

		var emailRe = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		$scope.validateEmail = emailRe.test(String($scope.data.email).toLowerCase());
		   
		if ($scope.data.fullname === undefined && $scope.data.username === undefined && $scope.data.password === undefined && $scope.data.email === undefined && $scope.data.role === undefined) {
			$rootScope.showPopup($ionicPopup,'Register failed!','Please fill all the fields', 'popup-error');
		} else if ($scope.data.fullname === undefined || $scope.data.fullname === "") {
			$rootScope.showPopup($ionicPopup,'Register failed!','Fullname is required !', 'popup-error');
		} else if ($scope.data.username === undefined || $scope.data.username === "") {
			$rootScope.showPopup($ionicPopup,'Register failed!','Username is required !', 'popup-error');
		} else if ($scope.data.password === undefined || $scope.data.password === "") {
			$rootScope.showPopup($ionicPopup,'Register failed!','Password is required !', 'popup-error');
		} else if ($scope.validatePassword === false) {
			$rootScope.showPopup($ionicPopup,'Register failed!','Passwords must contain at least six characters, including uppercase, lowercase letters and numbers', 'popup-error');			
		} else if ($scope.validateEmail === false) {
			$rootScope.showPopup($ionicPopup,'Register failed!','Email not valid', 'popup-error');			
		} else if ($scope.data.email === undefined || $scope.data.email === "") {
			$rootScope.showPopup($ionicPopup,'Register failed!','Your email must be filled and valid', 'popup-error');
		} else if ($scope.data.ktp === undefined || $scope.data.ktp === "") {
			$rootScope.showPopup($ionicPopup,'Register failed!','KTP number is required !', 'popup-error');
		} else if ($scope.isKTPValid === "false") {
			$rootScope.showPopup($ionicPopup,'Register failed!','Pastikan nomor KTP yang anda masukkan valid!', 'popup-error');
		// } else if ($scope.isKTPUsed === "true") {
		// 	$rootScope.showPopup($ionicPopup,'Register failed!','KTP number already used !');
		} else if ($scope.data.role === undefined || $scope.data.role === "") {
			$rootScope.showPopup($ionicPopup,'Register failed!','You have not selected the role.', 'popup-error');
		} else if ($scope.data.fullname !== null && $scope.data.username !== null && $scope.data.password !== null && $scope.data.email !== null && $scope.data.role !== null && $scope.data.ktp !== null && $scope.isKTPValid === "true") {
			RegisterService.tambahUser($scope.data).success(function(data) {
				$ionicLoading.hide();
				$rootScope.showPopup($ionicPopup,'Success!','Berhasil register', 'popup-success');
				$state.go('login');
			}).error(function(data) {
			
				$rootScope.showPopup($ionicPopup,'Post Data Failed!','Gagal register, username sudah ada', 'popup-error');
			});
		}
	};

	$scope.goToNextPage = function() { 

		// List no ktp
		$scope.ktpArr = ["1029394923924","1022392423498","12345678910","5239395923924","2320304923924"];
		// $scope.registeredKtpArr = [];
		// list no ktp

		// default data //
		$scope.data.address = "";
		$scope.data.age = "";
		$scope.data.bio = "";
		$scope.data.hp = "";
		$scope.data.photo = "";
		$scope.data.profileCompleted = "";
		$scope.data.status = "";
		$scope.data.availableDayAndTime = {};
		// default data player //
		$scope.data.assist = "";
		$scope.data.goal = "";
		$scope.data.redCard = "";
		$scope.data.yellowCard = "";
		$scope.data.play = "";
		// default data manager //
		$scope.data.matchManaged = "";
		$scope.data.position = "";
		$scope.data.team = "";
		$scope.data.teamInvitation = "";
		$scope.data.teamRequested = "";
		// default data referee //
		$scope.data.redCardGiven = "";
		$scope.data.yellowCardGiven = "";

		// validasi nomor ktp
		// $scope.ktpnumArr = $scope.ktpArr.split(",");
		$scope.isKTPValid = "";
		// $scope.isKTPUsed = "";

		for(var i = 0; i < $scope.ktpArr.length; i++){
			
			if($scope.data.ktp !== $scope.ktpArr[i]){
				$scope.isKTPValid = "false";
				
			}else{
				// if($scope.registeredKtpArr.indexOf($scope.ktpArr[i]) === -1){
					
					$scope.isKTPValid = "true";
					// $scope.registeredKtpArr.push($scope.ktpArr[i]);
					break;
				// }else{
				// 	$scope.isKTPUsed = "true";
				// 	console.log("ktp number already used !");
				// 	// $rootScope.showPopup($ionicPopup,'Register failed!','KTP number already used');
				// }
			}
		}

		// validasi input dari user
		var passwordRe = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
		$scope.validatePassword = passwordRe.test($scope.data.password); // validasi password

		var emailRe = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		$scope.validateEmail = emailRe.test(String($scope.data.email).toLowerCase());
		   
		if ($scope.data.fullname === undefined && $scope.data.username === undefined && $scope.data.password === undefined && $scope.data.email === undefined && $scope.data.role === undefined) {
			$rootScope.showPopup($ionicPopup,'Register failed!','Please fill all the fields', 'popup-error');
		} else if ($scope.data.fullname === undefined || $scope.data.fullname === "") {
			$rootScope.showPopup($ionicPopup,'Register failed!','Fullname is required !', 'popup-error');
		} else if ($scope.data.username === undefined || $scope.data.username === "") {
			$rootScope.showPopup($ionicPopup,'Register failed!','Username is required !', 'popup-error');
		} else if ($scope.data.password === undefined || $scope.data.password === "") {
			$rootScope.showPopup($ionicPopup,'Register failed!','Password is required !', 'popup-error');
		} else if ($scope.validatePassword === false) {
			$rootScope.showPopup($ionicPopup,'Register failed!','Passwords must contain at least six characters, including uppercase, lowercase letters and numbers', 'popup-error');			
		} else if ($scope.validateEmail === false) {
			$rootScope.showPopup($ionicPopup,'Register failed!','Email not valid', 'popup-error');			
		} else if ($scope.data.email === undefined || $scope.data.email === "") {
			$rootScope.showPopup($ionicPopup,'Register failed!','Your email must be filled and valid', 'popup-error');
		} else if ($scope.data.ktp === undefined || $scope.data.ktp === "") {
			$rootScope.showPopup($ionicPopup,'Register failed!','KTP number is required !', 'popup-error');
		} else if ($scope.isKTPValid === "false") {
			$rootScope.showPopup($ionicPopup,'Register failed!','Pastikan nomor KTP yang anda masukkan valid!', 'popup-error');
		// } else if ($scope.isKTPUsed === "true") {
		// 	$rootScope.showPopup($ionicPopup,'Register failed!','KTP number already used !');
		} else if ($scope.data.role === undefined || $scope.data.role === "") {
			$rootScope.showPopup($ionicPopup,'Register failed!','You have not selected the role.', 'popup-error');
		} else if ($scope.data.fullname !== null && $scope.data.username !== null && $scope.data.password !== null && $scope.data.email !== null && $scope.data.role !== null && $scope.data.ktp !== null && $scope.isKTPValid === "true") {
			localStorage.setItem('userData', JSON.stringify($scope.data));
			$state.go('register2');
		}
	};

	$scope.monday = {};
	$scope.tuesday = {};
	$scope.wednesday = {};
	$scope.thursday = {};
	$scope.friday = {};
	$scope.saturday = {};
	$scope.sunday = {};


	$scope.userData = localStorage.getItem('userData');
	$scope.userDataParse = JSON.parse($scope.userData);

	$scope.registerReferee = function() {
		// $scope.userData = localStorage.getItem('userData');
		// $scope.userDataParse = JSON.parse($scope.userData);
		$scope.userDataParse.availableDayAndTime = {};
		
		if($scope.monday !== {}){
			$scope.userDataParse.availableDayAndTime.monday = Object.values($scope.monday);
		}
		if($scope.tuesday !== {}){
			$scope.userDataParse.availableDayAndTime.tuesday = Object.values($scope.tuesday);
		}
		if($scope.wednesday !== {}){
			$scope.userDataParse.availableDayAndTime.wednesday = Object.values($scope.wednesday);
		}
		if($scope.thursday !== {}){
			$scope.userDataParse.availableDayAndTime.thursday = Object.values($scope.thursday);
		}
		if($scope.friday !== {}){
			$scope.userDataParse.availableDayAndTime.friday = Object.values($scope.friday);
		}
		if($scope.saturday !== {}){
			$scope.userDataParse.availableDayAndTime.saturday = Object.values($scope.saturday);
		}
		if($scope.sunday !== {}){
			$scope.userDataParse.availableDayAndTime.sunday = Object.values($scope.sunday);
		}

		// console.log($scope.userDataParse);

		RegisterService.tambahUser($scope.userDataParse).success(function(data) {
			$ionicLoading.hide();
			$rootScope.showPopup($ionicPopup,'Success!','Berhasil register', 'popup-success');
			ls.removeItem("userData");
			$state.go('login');
		}).error(function(data) {
			$rootScope.showPopup($ionicPopup,'Post Data Failed!','Gagal register, username sudah ada', 'popup-error');
		});
	};


	$('.phoneValidation').on('keyup', function(e){
		// 1.
		var selection = window.getSelection().toString();
		if(selection !== ''){
			return;
		}

		// 2.
		if($.inArray(e.keyCode, [38,40,37,39]) !== -1){
			return;
		}

		// 3.
		var $this = $(this);
		var input = $this.val();

		// 4.
		var input = input.replace(/[\D\s\._\-]+/g, "");

		// 5.
		input = input ? parseInt(input, 10) : 0;

		// 6.
		$this.val(function(){
			return (input === 0) ? "" : input;
		});
    });

	$scope.profile = {};

	$scope.registerPlayer = function() {

		var phoneRe = /^\d{11}$/;
		var phoneRe2 = /^\d{12}$/;
		var addressRe = /^\d+\s[A-z]+/;

		// var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
		$scope.userDataParse.age = moment().diff($scope.userDataParse.dateOfBirth, 'years');

		$scope.validatePhone = phoneRe.test($scope.profile.hp);
		$scope.validatePhone2 = phoneRe2.test($scope.profile.hp);
		$scope.validateAddress = addressRe.test($scope.userDataParse.address);

		// console.log($scope.validateAddress);

		$scope.userDataParse.hp = "+62" + $scope.profile.hp;
	
		// console.log($scope.userDataParse);

		if ($scope.userDataParse.dateOfBirth === undefined && $scope.userDataParse.address === undefined && $scope.profile.hp === undefined && $scope.userDataParse.position === undefined) {
			$rootScope.showPopup($ionicPopup,'Register failed!','Please fill all the fields', 'popup-error');
		} else if ($scope.userDataParse.dateOfBirth === undefined || $scope.userDataParse.dateOfBirth === "") {
			$rootScope.showPopup($ionicPopup,'Register failed!','Date of birth is required !', 'popup-error');
		} else if ($scope.userDataParse.address === undefined || $scope.userDataParse.address === "") {
			$rootScope.showPopup($ionicPopup,'Register failed!','Address is required !', 'popup-error');
		} else if ($scope.profile.hp === undefined || $scope.profile.hp === "") {
			$rootScope.showPopup($ionicPopup,'Register failed!','Phone number is required !', 'popup-error');
		} else if ($scope.validatePhone === false && $scope.validatePhone2 === false) {
			$rootScope.showPopup($ionicPopup,'Register failed!','Phone number is not valid', 'popup-error');			
		} else {
			$rootScope.showLoading();
			RegisterService.tambahUser($scope.userDataParse).success(function(data) {
				$ionicLoading.hide();
				$rootScope.showPopup($ionicPopup,'Success!','Berhasil register', 'popup-success');
				ls.removeItem("userData");
				$state.go('login');
			}).error(function(data) {
				$rootScope.showPopup($ionicPopup,'Post Data Failed!','Gagal register, username sudah ada', 'popup-error');
			});
		}
	};
})

.controller('MainCtrl', function($scope, $ionicPopup, $ionicTabsDelegate, $ionicLoading, $ionicPopover, $state, LoginService, ProfileService, CompetitionService, TeamService, $rootScope) {
		var ls = localStorage;
		$scope.menuProfile = {}; // utk menyimpan data profile 
		$ionicLoading.hide();
		// jika user id atau token msh kosong maka sistem akan mengarahkan halaman login
		if (ls.getItem("userid") === null || ls.getItem("userid") === "" || ls.getItem("userid") === undefined || ls.getItem("token") === "" || ls.getItem("token") === null || ls.getItem("token") === undefined) {
			$state.go('login');
		}

		// Do before main view loaded
		$scope.$on('$ionicView.beforeEnter', function() {
			$scope.state = $state.current.name;
			// Get user profile data
			ProfileService.getProfile(ls.getItem("userid"),ls.getItem("token")).success(function(data) {
				
				$scope.menuProfile = data;
				$scope.myTeam = {};
				ls.setItem("role", data.role);
				

				if(ls.getItem("role")==='Player' || ls.getItem("role")==='Coach' || ls.getItem("role")==='Manager'){
					if(data.team !== ""){

						ls.setItem("team", data.team);
				
						TeamService.getTeamByName(data.team).success(function(data){
							
							$scope.myTeam = data;
							ls.setItem("myTeamId", $scope.myTeam.id);
							ls.setItem("myCompetitionId", $scope.myTeam.competitionId);

							if($scope.myTeam.team_coach !== null || $scope.myTeam.team_coach !== ''){
								ls.setItem("myTeamCoach", $scope.myTeam.team_coach);
							}else{
								ls.setItem("myTeamCoach", "");
							}
							
							if($scope.myTeam.team_squad !== null){
								ls.setItem("myTeamSquad", $scope.myTeam.team_squad);
							}else{
								ls.setItem("myTeamSquad", "");
							}
							
						}).error(function(data) {});
					}else{
						ls.setItem("myTeamId", "");
						ls.setItem("myCompetitionId", "");
						ls.setItem("myTeamCoach", "");
						ls.setItem("myTeamSquad", "");
						ls.setItem("team", "");
					}			
				}else if(ls.getItem("role")==='Organizer'){

					var myCompetitionId = [];
					var myCompetitionIdArr = [];
					var myCompetitionNameArr = $scope.menuProfile.createdCompetition.active.split(",");
					myCompetitionNameArr.forEach(function(comp){
						CompetitionService.getCompetitionId(comp).success(function(data) {
							myCompetitionId.push(data);
							// console.log(data);
							$ionicLoading.hide();
						}).error(function(data) {
							$ionicLoading.hide();
						});
					});
				
					setTimeout(function(){
						// console.log(myCompetitionId);
						myCompetitionIdArr = myCompetitionId.join();
						// console.log(myCompetitionIdArr);
						ls.setItem("myCompetitionId", myCompetitionIdArr);	
					},5000);
					
				}

				ls.setItem("username", data.username);
				
				$scope.menuProfile.password = "";
				//set default value to menuProfile.photo
				if ($scope.menuProfile.photo === undefined) {
					$scope.menuProfile.photo = "";
				}
			}).error(function(data) {});
		});

		$scope.back = function() { // kembali ke halaman home
			$state.go('app.home');
		};
		$scope.backProfile = function() { // kembali ke halaman profile
			$state.go('app.profile');
		};
		// fungsi utk logout
		$scope.logout = function() { 
			var confirmPopup = $ionicPopup.confirm({
				title: 'Logout From SportMan',
				template: 'Are you sure?'
			});
			confirmPopup.then(function(res) {
		        if(res) {
		            console.log('Sure!');
		            clearInterval(window.loadRefMatches);
		            clearInterval(window.loadCompetition1);
		         	ls.removeItem("userid"); 					
		         	ls.removeItem("token"); 			
		         	ls.removeItem("compName"); 
					ls.removeItem("compId"); 	
					ls.removeItem("fixId"); 					
					ls.removeItem("role"); 					
					ls.removeItem("team"); 					
					ls.removeItem("myTeamId"); 					
					ls.removeItem("username"); 					
					ls.removeItem("myCompetitionId"); 					
					ls.removeItem("myTeamCoach");
					ls.removeItem("myTeamSquad");
					ls.removeItem("firstRoundMatchesStatus"); 					
					ls.removeItem("secondRoundMatchesStatus");
					ls.removeItem("thirdRoundMatchesStatus");
					ls.removeItem("knockoutSchedulingStat");
					ls.removeItem("groupStageClassementStatus"); 					
					ls.removeItem("roundOf16MatchesStatus");
					ls.removeItem("quarterFinalMatchesStatus");
					ls.removeItem("semiFinalMatchesStatus");
					ls.removeItem("thirdPlaceMatchesStatus");
					ls.removeItem("finalMatchesStatus");
					$scope.isOrganizer = false;
					$state.go('login'); // menampilkan halaman login
		         } else {
		            console.log('Not sure!');
		         }
		    });
		};
		$scope.viewChat = function(){
			console.log("view chat");
			clearInterval(window.loadRefMatches);
			$state.go('app.chat');
		};
		$scope.viewProfile = function(){
			console.log("view profile");
			clearInterval(window.loadRefMatches);
			$state.go('app.profile');
		};
		$scope.viewLiveScore = function(){
			console.log("view live score");
			clearInterval(window.loadRefMatches);
			$state.go('app.live_score');
		};
		$scope.viewTrackScore = function(){
			console.log("view track score");
			clearInterval(window.loadRefMatches);
			$state.go('app.track_score');
		};
		$scope.viewSchedule = function(){
			console.log("view schedule");
			clearInterval(window.loadRefMatches);
			$state.go('app.schedule');
		};
		$scope.viewTeam = function(){
			console.log("view team");
			clearInterval(window.loadRefMatches);
			localStorage.setItem("showme", 1);
			$state.go('app.my_team');
		};
		$scope.viewAbout = function(){
			console.log("view about");
			clearInterval(window.loadRefMatches);
			$state.go('app.about');
		};
})

.controller('HomeCtrl', function($scope, $compile, $state, $stateParams, $rootScope, $ionicPopup, $ionicPlatform, $ionicLoading, LoginService, ClassementService, TeamService, CompetitionService, MatchService, PostService, ProfileService, $cordovaSocialSharing, $window, $ionicModal) {
		
	var ls = localStorage;
	// $rootScope.showLoading();
	$scope.loadCompetition = setInterval($scope.getCompetitionByOrganizer, 3000);	

	// for closing the complete profile card
	// $scope.closeDiv = function() {
	//     var x = document.getElementById("profileDiv");
	//     if (x.style.display === "none") {
	//         x.style.display = "block";
	//     } else {
	//         x.style.display = "none";
	//     }
	// };

	// console.log(ls.getItem("role"));

	$scope.allRefereesArr = [];
	$scope.availableRefMonday = [];
	$scope.availableRefTuesday = [];
	$scope.availableRefWednesday = [];
	$scope.availableRefThursday = [];
	$scope.availableRefFriday = [];
	$scope.availableRefSaturday = [];
	$scope.availableRefSunday = [];

	$scope.allAnalystsArr = [];
	$scope.avAnalystsMonday = [];
	$scope.avAnalystsTuesday = [];
	$scope.avAnalystsWednesday = [];
	$scope.avAnalystsThursday = [];
	$scope.avAnalystsFriday = [];
	$scope.avAnalystsSaturday = [];
	$scope.avAnalystsSunday = [];

	// Get all referees
	LoginService.getAllReferees().success(function(data) {
		$scope.allRefereesArr = data;
	}).error(function(data) {});

	// Get all analysts
	LoginService.getAllAnalysts().success(function(data) {
		$scope.allAnalystsArr = data;
		// console.log(data);
	}).error(function(data) {});

	setTimeout(function(){

		$scope.allRefereesArr.forEach(function(ref){

			if(ref.availableDayAndTime !== null){
			
				if(ref.availableDayAndTime.monday !== undefined){
					// console.log(ref.availableDayAndTime.monday.length);
					if(ref.availableDayAndTime.monday.length !== 0){
						// if(ref.bookedDate === '' || ref.bookedDate === null){
							$scope.availableRefMonday.push(ref);
						// }
					}
				}

				if(ref.availableDayAndTime.tuesday !== undefined){
					// console.log(ref.availableDayAndTime.tuesday.length);
					if(ref.availableDayAndTime.tuesday.length !== 0){
						// if(ref.bookedDate === '' || ref.bookedDate === null){
							$scope.availableRefTuesday.push(ref);
						// }
					}
				}

				if(ref.availableDayAndTime.wednesday !== undefined){
					// console.log(ref.availableDayAndTime.wednesday.length);
					if(ref.availableDayAndTime.wednesday.length !== 0){
						// if(ref.bookedDate === '' || ref.bookedDate === null){
							$scope.availableRefWednesday.push(ref);
						// }
					}
				}

				if(ref.availableDayAndTime.thursday !== undefined){
					// console.log(ref.availableDayAndTime.thursday.length);
					if(ref.availableDayAndTime.thursday.length !== 0){
						// if(ref.bookedDate === '' || ref.bookedDate === null){
							$scope.availableRefThursday.push(ref);
						// }
					}
				}

				if(ref.availableDayAndTime.friday !== undefined){
					// console.log(ref.availableDayAndTime.friday.length);
					if(ref.availableDayAndTime.friday.length !== 0){
						// if(ref.bookedDate === '' || ref.bookedDate === null){
							$scope.availableRefFriday.push(ref);
						// }
					}
				}

				if(ref.availableDayAndTime.saturday !== undefined){
					// console.log(ref.availableDayAndTime.saturday.length);
					if(ref.availableDayAndTime.saturday.length !== 0){
						// if(ref.bookedDate === '' || ref.bookedDate === null){
							$scope.availableRefSaturday.push(ref);
						// }
					}
				}

				if(ref.availableDayAndTime.sunday !== undefined){
					// console.log(ref.availableDayAndTime.sunday.length);
					if(ref.availableDayAndTime.sunday.length !== 0){
						// if(ref.bookedDate === '' || ref.bookedDate === null){
							$scope.availableRefSunday.push(ref);
						// }
					}
				}
			}
		});

		$scope.allAnalystsArr.forEach(function(analyst){

			if(analyst.availableDayAndTime !== null){
			
				if(analyst.availableDayAndTime.monday !== undefined){
					// console.log(analyst.availableDayAndTime.monday.length);
					if(analyst.availableDayAndTime.monday.length !== 0){
						// if(analyst.bookedDate === '' || analyst.bookedDate === null){
							$scope.avAnalystsMonday.push(analyst);
						// }
					}
				}

				if(analyst.availableDayAndTime.tuesday !== undefined){
					// console.log(analyst.availableDayAndTime.tuesday.length);
					if(analyst.availableDayAndTime.tuesday.length !== 0){
						// if(analyst.bookedDate === '' || analyst.bookedDate === null){
							$scope.avAnalystsTuesday.push(analyst);
						// }
					}
				}

				if(analyst.availableDayAndTime.wednesday !== undefined){
					// console.log(analyst.availableDayAndTime.wednesday.length);
					if(analyst.availableDayAndTime.wednesday.length !== 0){
						// if(analyst.bookedDate === '' || analyst.bookedDate === null){
							$scope.avAnalystsWednesday.push(analyst);
						// }
					}
				}

				if(analyst.availableDayAndTime.thursday !== undefined){
					// console.log(analyst.availableDayAndTime.thursday.length);
					if(analyst.availableDayAndTime.thursday.length !== 0){
						// if(analyst.bookedDate === '' || analyst.bookedDate === null){
							$scope.avAnalystsThursday.push(analyst);
						// }
					}
				}

				if(analyst.availableDayAndTime.friday !== undefined){
					// console.log(analyst.availableDayAndTime.friday.length);
					if(analyst.availableDayAndTime.friday.length !== 0){
						// if(analyst.bookedDate === '' || analyst.bookedDate === null){
							$scope.avAnalystsFriday.push(analyst);
						// }
					}
				}

				if(analyst.availableDayAndTime.saturday !== undefined){
					// console.log(analyst.availableDayAndTime.saturday.length);
					if(analyst.availableDayAndTime.saturday.length !== 0){
						// if(analyst.bookedDate === '' || analyst.bookedDate === null){
							$scope.avAnalystsSaturday.push(analyst);
						// }
					}
				}

				if(analyst.availableDayAndTime.sunday !== undefined){
					// console.log(analyst.availableDayAndTime.sunday.length);
					if(analyst.availableDayAndTime.sunday.length !== 0){
						// if(analyst.bookedDate === '' || analyst.bookedDate === null){
							$scope.avAnalystsSunday.push(analyst);
						// }
					}
				}
			}
		});
	},3000);

	var timeArr = ["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00"];
	$scope.avMonRef = [];
	$scope.avTueRef = [];
	$scope.avWedRef = [];
	$scope.avThuRef = [];
	$scope.avFriRef = [];
	$scope.avSatRef = [];
	$scope.avSunRef = [];

	$scope.avMonAnalysts = [];
	$scope.avTueAnalysts = [];
	$scope.avWedAnalysts = [];
	$scope.avThuAnalysts = [];
	$scope.avFriAnalysts = [];
	$scope.avSatAnalysts = [];
	$scope.avSunAnalysts = [];

	setTimeout(function(){
		// Monday
		for(var t = 0; t < timeArr.length; t++){
			$scope.avMonRef[t] = [];
			$scope.availableRefMonday.forEach(function(ref){
				// console.log(ref.availableDayAndTime.monday);
				if(ref.availableDayAndTime.monday.indexOf(timeArr[t]) !== -1){
					$scope.avMonRef[t].push(ref);
				}
			});
		}
		// Tuesday
		for(var t = 0; t < timeArr.length; t++){
			$scope.avTueRef[t] = [];
			$scope.availableRefTuesday.forEach(function(ref){
				// console.log(ref.availableDayAndTime.tuesday);
				if(ref.availableDayAndTime.tuesday.indexOf(timeArr[t]) !== -1){
					$scope.avTueRef[t].push(ref);
				}
			});
		}
		// Wednesday
		for(var t = 0; t < timeArr.length; t++){
			$scope.avWedRef[t] = [];
			$scope.availableRefWednesday.forEach(function(ref){
				// console.log(ref.availableDayAndTime.wednesday);
				if(ref.availableDayAndTime.wednesday.indexOf(timeArr[t]) !== -1){
					$scope.avWedRef[t].push(ref);
				}
			});
		}
		// Thursday
		for(var t = 0; t < timeArr.length; t++){
			$scope.avThuRef[t] = [];
			$scope.availableRefThursday.forEach(function(ref){
				// console.log(ref.availableDayAndTime.thursday);
				if(ref.availableDayAndTime.thursday.indexOf(timeArr[t]) !== -1){
					$scope.avThuRef[t].push(ref);
				}
			});
		}
		// Friday
		for(var t = 0; t < timeArr.length; t++){
			$scope.avFriRef[t] = [];
			$scope.availableRefFriday.forEach(function(ref){
				// console.log(ref.availableDayAndTime.friday);
				if(ref.availableDayAndTime.friday.indexOf(timeArr[t]) !== -1){
					$scope.avFriRef[t].push(ref);
				}
			});
		}
		// Saturday
		for(var t = 0; t < timeArr.length; t++){
			$scope.avSatRef[t] = [];
			$scope.availableRefSaturday.forEach(function(ref){
				// console.log(ref.availableDayAndTime.saturday);
				if(ref.availableDayAndTime.saturday.indexOf(timeArr[t]) !== -1){
					$scope.avSatRef[t].push(ref);
				}
			});
		}
		// Sunday
		for(var t = 0; t < timeArr.length; t++){
			$scope.avSunRef[t] = [];
			$scope.availableRefSunday.forEach(function(ref){
				// console.log(ref.availableDayAndTime.sunday);
				if(ref.availableDayAndTime.sunday.indexOf(timeArr[t]) !== -1){
					$scope.avSunRef[t].push(ref);
				}
			});
		}

		// Monday
		for(var t = 0; t < timeArr.length; t++){
			$scope.avMonAnalysts[t] = [];
			$scope.avAnalystsMonday.forEach(function(analyst){
				// console.log(ref.availableDayAndTime.monday);
				if(analyst.availableDayAndTime.monday.indexOf(timeArr[t]) !== -1){
					$scope.avMonAnalysts[t].push(analyst);
				}
			});
		}
		// Tuesday
		for(var t = 0; t < timeArr.length; t++){
			$scope.avTueAnalysts[t] = [];
			$scope.avAnalystsTuesday.forEach(function(analyst){
				// console.log(ref.availableDayAndTime.monday);
				if(analyst.availableDayAndTime.tuesday.indexOf(timeArr[t]) !== -1){
					$scope.avTueAnalysts[t].push(analyst);
				}
			});
		}
		// Wednesday
		for(var t = 0; t < timeArr.length; t++){
			$scope.avWedAnalysts[t] = [];
			$scope.avAnalystsWednesday.forEach(function(analyst){
				// console.log(ref.availableDayAndTime.wednesday);
				if(analyst.availableDayAndTime.wednesday.indexOf(timeArr[t]) !== -1){
					$scope.avWedAnalysts[t].push(analyst);
				}
			});
		}
		// Thursday
		for(var t = 0; t < timeArr.length; t++){
			$scope.avThuAnalysts[t] = [];
			$scope.avAnalystsThursday.forEach(function(analyst){
				// console.log(ref.availableDayAndTime.thursday);
				if(analyst.availableDayAndTime.thursday.indexOf(timeArr[t]) !== -1){
					$scope.avThuAnalysts[t].push(analyst);
				}
			});
		}
		// Friday
		for(var t = 0; t < timeArr.length; t++){
			$scope.avFriAnalysts[t] = [];
			$scope.avAnalystsFriday.forEach(function(analyst){
				// console.log(ref.availableDayAndTime.friday);
				if(analyst.availableDayAndTime.friday.indexOf(timeArr[t]) !== -1){
					$scope.avFriAnalysts[t].push(analyst);
				}
			});
		}
		// Saturday
		for(var t = 0; t < timeArr.length; t++){
			$scope.avSatAnalysts[t] = [];
			$scope.avAnalystsSaturday.forEach(function(analyst){
				// console.log(ref.availableDayAndTime.saturday);
				if(analyst.availableDayAndTime.saturday.indexOf(timeArr[t]) !== -1){
					$scope.avSatAnalysts[t].push(analyst);
				}
			});
		}
		// Sunday
		for(var t = 0; t < timeArr.length; t++){
			$scope.avSunAnalysts[t] = [];
			$scope.avAnalystsSunday.forEach(function(analyst){
				// console.log(ref.availableDayAndTime.sunday);
				if(analyst.availableDayAndTime.sunday.indexOf(timeArr[t]) !== -1){
					$scope.avSunAnalysts[t].push(analyst);
				}
			});
		}
		// console.log($scope.avMonRef[0][0]);
		// console.log($scope.avWedRef[0][0]);
		// console.log($scope.avMonAnalysts);

		// Put the object into storage
		localStorage.setItem('avMonRef', JSON.stringify($scope.avMonRef));
		localStorage.setItem('avTueRef', JSON.stringify($scope.avTueRef));
		localStorage.setItem('avWedRef', JSON.stringify($scope.avWedRef));
		localStorage.setItem('avThuRef', JSON.stringify($scope.avThuRef));
		localStorage.setItem('avFriRef', JSON.stringify($scope.avFriRef));
		localStorage.setItem('avSatRef', JSON.stringify($scope.avSatRef));
		localStorage.setItem('avSunRef', JSON.stringify($scope.avSunRef));
		localStorage.setItem('avMonAnalysts', JSON.stringify($scope.avMonAnalysts));
		localStorage.setItem('avTueAnalysts', JSON.stringify($scope.avTueAnalysts));
		localStorage.setItem('avWedAnalysts', JSON.stringify($scope.avWedAnalysts));
		localStorage.setItem('avThuAnalysts', JSON.stringify($scope.avThuAnalysts));
		localStorage.setItem('avFriAnalysts', JSON.stringify($scope.avFriAnalysts));
		localStorage.setItem('avSatAnalysts', JSON.stringify($scope.avSatAnalysts));
		localStorage.setItem('avSunAnalysts', JSON.stringify($scope.avSunAnalysts));

	},5000);

	// get all competitions created by the organizer
	$scope.getCompetitionByOrganizer = function(){
		if(ls.getItem("role") === 'Organizer'){
			// declare variables
			// $ionicLoading.hide();
			$scope.competitionLoaded = false;
			$scope.registerStatus = [];
			$scope.newTeams = [];
			$scope.fixNum = "";
			$scope.match = [];
			$scope.matches = [];
			$scope.all = [];
			$scope.registeredTeamLength = [];
			$scope.registered = [];

			CompetitionService.getCompetitionByOrganizer(ls.getItem("username")).success(function(data) {
				// console.log(data);
				$scope.competition = {};
				$scope.competition = data;
				// $ionicLoading.hide();
				
				// check if there are any competition created by the organizer
				$scope.hasCompetition = "";
				if ($scope.competition.length !== 0) { $scope.hasCompetition = true; } 
				else { $scope.hasCompetition = false; }


				$scope.rteamLength = []; // the number of registered team
				$scope.totalWidth = [];
				$scope.elem = [];
				$scope.finishedMatch = {};

				data.forEach(function(entry){

					// get finished match 
					if(entry.match_status === 'finished' && entry.referee_ratingStatus === false){
						// console.log("true");
					}else{
						// console.log("false");
					}
					CompetitionService.getFinishedMatch(entry.id).success(function(data){
						// $scope.finishedMatch[entry.id = data;
						// console.log(data.length);
						if(data.length !== 0){
							
							var matchId = entry.id;
							// console.log($scope.finishedMatch);
							$state.go('app.referee_rating', {
								'matchId': matchId
							});
						}
					}).error(function(data){});



					// check if the registered team is not null
					if(entry.registeredTeam !== null){	
						$scope.registerArr = entry.registeredTeam.split(',');
						$scope.rteamLength[entry.id] = $scope.registerArr.length;
						$scope.totalWidth[entry.id] = ($scope.registerArr.length / entry.comp_numOfTeam) * 100;

						// Progress Bar
						// setTimeout(function(){
						// 	$scope.elem[entry.id] = document.getElementById(entry.id);
						// 	var width = 1;
						// 	var id = setInterval(frame, 30);
						//     function frame() {
						//         if (width >= $scope.totalWidth[entry.id]) {
						//             clearInterval(id);
						//         } else {
						//             width++; 
						//             $scope.elem[entry.id].style.width = width + '%'; 
						//         }
						//     }
						//      // $scope.elem[entry.id].style.width = $scope.totalWidth[entry.id] + '%'; 
						// },2000);
						
						if(entry.schedule_status === 'On Queue' && $scope.registerArr.length === entry.comp_numOfTeam){
							clearInterval($scope.loadCompetition);
							console.log("do the scheduling");

							// Retrieve the object from storage
							var avMonRefObj = localStorage.getItem('avMonRef');
							var avMonRefObjData = JSON.parse(avMonRefObj);
							var avMonAnalystObj = localStorage.getItem('avMonAnalysts');
							var avMonAnalystObjData = JSON.parse(avMonAnalystObj);

							var avTueRefObj = localStorage.getItem('avTueRef');
							var avTueRefObjData = JSON.parse(avTueRefObj);
							var avTueAnalystObj = localStorage.getItem('avTueAnalysts');
							var avTueAnalystObjData = JSON.parse(avTueAnalystObj);

							var avWedRefObj = localStorage.getItem('avWedRef');
							var avWedRefObjData = JSON.parse(avWedRefObj);
							var avWedAnalystObj = localStorage.getItem('avWedAnalysts');
							var avWedAnalystObjData = JSON.parse(avWedAnalystObj);

							var avThuRefObj = localStorage.getItem('avThuRef');
							var avThuRefObjData = JSON.parse(avThuRefObj);
							var avThuAnalystObj = localStorage.getItem('avThuAnalysts');
							var avThuAnalystObjData = JSON.parse(avThuAnalystObj);

							var avFriRefObj = localStorage.getItem('avFriRef');
							var avFriRefObjData = JSON.parse(avFriRefObj);
							var avFriAnalystObj = localStorage.getItem('avFriAnalysts');
							var avFriAnalystObjData = JSON.parse(avFriAnalystObj);

							var avSatRefObj = localStorage.getItem('avSatRef');
							var avSatRefObjData = JSON.parse(avSatRefObj);
							var avSatAnalystObj = localStorage.getItem('avSatAnalysts');
							var avSatAnalystObjData = JSON.parse(avSatAnalystObj);

							var avSunRefObj = localStorage.getItem('avSunRef');
							var avSunRefObjData = JSON.parse(avSunRefObj);
							var avSunAnalystObj = localStorage.getItem('avSunAnalysts');
							var avSunAnalystObjData = JSON.parse(avSunAnalystObj);

							// Scheduling
							// Group Stage
							if(entry.comp_type == "GroupStage"){
								//Round Robin Scheduling
								$scope.registerArrLength = $scope.registerArr.length;

								// Create competition classement
								$scope.classementArr = [];
								$scope.registerArr.forEach(function(team, index){
									setTimeout(function(){
										$scope.classementForm = {};
										$scope.classementForm.id = "Cl" + $rootScope.randomString + index;
										$scope.classementForm.position = index + 1;
										$scope.classementForm.play = 0;
										$scope.classementForm.win = 0;
										$scope.classementForm.draw = 0;
										$scope.classementForm.lose = 0;
										$scope.classementForm.goalDifference = 0;
										$scope.classementForm.points = 0;
										$scope.classementForm.status = "";
										$scope.classementForm.competition_id = entry.id;
										$scope.classementForm.team = team;
										// console.log($scope.classementForm);
										
										$scope.classementArr.push($scope.classementForm);
									},1000);
								});
								$scope.savedClassementArr = [];
								// localStorage.setItem("groupStageClassementStatus", 'On Progress');
								if(entry.classement_status === null || entry.classement_status === ''){

									setTimeout(function(){
										// console.log($scope.classementArr);
										$scope.classementArr.forEach(function(classement){
											// if(localStorage.getItem("groupStageClassementStatus") === 'On Progress'){
												// console.log($scope.savedClassementArr);
												// console.log(classement.id);
												if($scope.savedClassementArr.indexOf(classement.id) === -1){
													addClassementDelay(classement);
													$scope.savedClassementArr.push(classement.id);
												}
											// }
										});

										// if($scope.savedClassementArr.length === $scope.classementArr.length){
										// 	console.log("sudah ad");
										// 	localStorage.setItem("groupStageClassementStatus", 'Completed');
										// }

										function addClassementDelay(classement){
											setTimeout(function(){
												//insert data to database
												ClassementService.addClassement(classement).success(function(data){
													// $ionicLoading.hide();
													console.log("create classement");
													// console.log(data);
													$scope.savedClassementArr.push(classement.id);
												}).error(function(data){
													// $ionicLoading.hide();
												});
												//insert data to database
											},3000);
										}
									},10000);
								}

								if(entry.classement_status === null || entry.classement_status === ''){
									setTimeout(function(){
										console.log("change classement status to completed");
											$scope.formCompetition = {};
										
											$scope.formCompetition.classement_status = "Completed";
											
											CompetitionService.editCompetition(entry.id, localStorage.getItem("token"), $scope.formCompetition).success(function(data) {
												// $ionicLoading.hide();
												console.log("berhasil");
											}).error(function(data) {
												// $ionicLoading.hide();
												console.log("gagal");
											});
									},30000);
								}
								// Create competition classement
			
								if($scope.registerArr.length % 2 === 0){
									$scope.registerArrLength = $scope.registerArr.length - 1;
								}
								
								for(var b = 1; b < $scope.registerArr.length; b++){
									$scope.newTeams.push($scope.registerArr[b]);
								}
								for(var c = $scope.registerArr.length; c <= $scope.registerArr.length; c++){
									$scope.fixNum = $scope.registerArr[c-$scope.registerArr.length];
								}

								$scope.matchPerDay = $scope.registerArr.length / 2;
								if($scope.registerArr.length % 2 !== 0){
									$scope.matchPerDay = ($scope.registerArr.length - 1) / 2;
								}
								console.log("Number of teams : " + $scope.registerArrLength);
								console.log("Match Per Day : " + $scope.matchPerDay);

								localStorage.setItem("schedulingStat", "not yet");
								if(localStorage.getItem("schedulingStat") === "not yet"){
									for (var r = 0; r < $scope.registerArrLength; r++) {
									  // setDelay(r);
									   for(var i = 0; i < $scope.matchPerDay; i++){
											
											if($scope.registerArr.length % 2 !== 0){
												var team1 = $scope.registerArr[$scope.matchPerDay - i];
												var team2 = $scope.registerArr[$scope.matchPerDay + i + 1];
											}else{
												var team1 = $scope.registerArr[$scope.matchPerDay - i - 1];
												var team2 = $scope.registerArr[$scope.matchPerDay + i];
											}
						
											$scope.match.push(team1);
											$scope.match.push(team2);
										}

										$scope.matches.push($scope.match);
										//rotate array
										if($scope.registerArr.length % 2 !== 0){
											$scope.registerArr = $scope.arrayRotateOdd($scope.registerArr, true);	
										}else{
											$scope.registerArr = $scope.arrayRotateEven($scope.newTeams, true);
										}
										$scope.match = [];
										var fixture = r+1;
										console.log("Fixture " + fixture + " : " + $scope.matches[r]);
									}
									localStorage.setItem("schedulingStat", "done");
								}
						
								setTimeout(function(){
									$scope.homeTeam = [];
									$scope.awayTeam = [];
									$scope.fixtureObj = [];
									for(w = 0; w < $scope.matches.length; w++){
										for(e = 0; e < $scope.matches[w].length; e++){
											if(e % 2 === 0){
												$scope.homeTeam.push($scope.matches[w][e]);
											}else{
												$scope.awayTeam.push($scope.matches[w][e]);
											}
										}
									}
									
									for(t = 0; t < $scope.homeTeam.length; t++){
										$scope.fixtureObj[t] = {};
										$scope.fixtureObj[t].match_homeTeam = $scope.homeTeam[t];
										$scope.fixtureObj[t].match_awayTeam = $scope.awayTeam[t];
										$scope.fixtureObj[t].match_time = "";
										$scope.fixtureObj[t].match_started = "";
									}
								
									$scope.allFixtures = $scope.fixtureObj;
									$scope.fixture = [];
									var fixtureNumber = 0;
									// $rootScope.showLoading();
									// console.log($scope.registerArrLength);
									for(p = 0; p < $scope.registerArrLength; p++){
										fixtureNumber++;
										
										$scope.fixture[p] = [];
										for(u = 0; u < $scope.matchPerDay; u++){
											$scope.fixtureObj[u].fixture_number = fixtureNumber;
											$scope.fixtureObj[u].competition_id = entry.id;
											$scope.fixture[p].push($scope.fixtureObj[u]);
										}
										$scope.fixtureObj.splice(0,$scope.matchPerDay);
										// console.log($scope.fixture[p]);
									}


									// all fixtures
									setTimeout(function(){
										var startDate = moment(new Date(entry.comp_start));
										if(entry.fixture_break === 0){
											var fixtureBreak = 1;	
										}else{
											var fixtureBreak = (entry.fixture_break + 1);
										}
										
										var allFixturesDate = [];
										var dayCounter = fixtureBreak;
										allFixturesDate.push(startDate.toISOString());
										// console.log(startDate);
										// console.log(fixtureBreak);
										// console.log($scope.fixture.length);
										for(var i = 1; i < $scope.fixture.length; i++){
											// console.log(i);
											allFixturesDate.push(moment(new Date(entry.comp_start)).add(dayCounter, 'days').toISOString());
											dayCounter += fixtureBreak;
										}
										// console.log(allFixturesDate);
										// var allFixturesDateArr = allFixturesDate.split(",");
										
										setTimeout(function(){
											$scope.allFixturesObj = [];
											
											var timeArr = ["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00"];
											var fieldArr = [1,2,3];
											for(var m = 0; m < $scope.fixture.length; m++){
												// console.log(m);
												$scope.allFixturesObj[m] = [];
												timeIndex = 0;
												fieldIndex = 0;
												
												for(t = 0; t < $scope.fixture[m].length; t++){
													// console.log(timeIndex);
													// console.log(fieldIndex);
													// console.log($scope.fixture[m][t].match_homeTeam);
													$scope.allFixturesObj[m][t] = {};
													$scope.allFixturesObj[m][t].match_homeTeamObj = {};
													$scope.allFixturesObj[m][t].match_homeTeamObj.team_name = $scope.fixture[m][t].match_homeTeam;
													$scope.allFixturesObj[m][t].match_homeTeamObj.score = 0;
													$scope.allFixturesObj[m][t].match_homeTeamObj.formation = '';
													$scope.allFixturesObj[m][t].match_homeTeamObj.lineup = '';
													$scope.allFixturesObj[m][t].match_homeTeamObj.lastLineup = '';
													$scope.allFixturesObj[m][t].match_homeTeamObj.sub = '';
													$scope.allFixturesObj[m][t].match_homeTeamObj.lastSub = '';
													$scope.allFixturesObj[m][t].match_homeTeamObj.player = '';

													$scope.allFixturesObj[m][t].match_awayTeamObj = {};
													$scope.allFixturesObj[m][t].match_awayTeamObj.team_name = $scope.fixture[m][t].match_awayTeam;
													$scope.allFixturesObj[m][t].match_awayTeamObj.score = 0;
													$scope.allFixturesObj[m][t].match_awayTeamObj.formation = '';
													$scope.allFixturesObj[m][t].match_awayTeamObj.lineup = '';
													$scope.allFixturesObj[m][t].match_awayTeamObj.lastLineup = '';
													$scope.allFixturesObj[m][t].match_awayTeamObj.sub = '';
													$scope.allFixturesObj[m][t].match_awayTeamObj.lastSub = '';
													$scope.allFixturesObj[m][t].match_awayTeamObj.player = '';

													$scope.allFixturesObj[m][t].id = "MA" + $rootScope.randomString + 0 + t;
													$scope.allFixturesObj[m][t].match_homeTeam = $scope.fixture[m][t].match_homeTeam;
													$scope.allFixturesObj[m][t].match_awayTeam = $scope.fixture[m][t].match_awayTeam;
													$scope.allFixturesObj[m][t].match_date = allFixturesDate[m];
													$scope.allFixturesObj[m][t].match_time = timeArr[timeIndex];
													$scope.allFixturesObj[m][t].match_fixture = "fixture " + (m+1); 
													$scope.allFixturesObj[m][t].match_field = fieldArr[fieldIndex];
													$scope.allFixturesObj[m][t].match_started = "";
													$scope.allFixturesObj[m][t].fixture_number = (m+1);
													$scope.allFixturesObj[m][t].competition_id = entry.id;
													$scope.allFixturesObj[m][t].match_venue = entry.comp_address.venue.nama;



													// console.log(timeIndex);
													// console.log(refereeIndex);
													// console.log($scope.avSunRef);
													// console.log($scope.avSunRef[timeIndex][refereeIndex]);

										
													if(moment(allFixturesDate[m]).format('dddd') === 'Monday'){
														refereeIndex = 0;
														analystIndex = 0;
														// console.log(refereeIndex);
														// console.log(avMonRefObjData);
														selectReferee(refereeIndex);
														selectAnalyst(analystIndex);

														function selectReferee(refereeIndex){
															var bookedDate = avMonRefObjData[timeIndex][refereeIndex].bookedDate.toString();
															if (bookedDate.indexOf(allFixturesDate[m]) === -1) {
													            $scope.allFixturesObj[m][t].match_referee = avMonRefObjData[timeIndex][refereeIndex].username;
													        	avMonRefObjData[timeIndex].splice(refereeIndex, 1);
													        } else {
													            return selectReferee(refereeIndex + 1);
													        }
														}
														function selectAnalyst(analystIndex){
															var bookedDate = avMonAnalystObjData[timeIndex][analystIndex].bookedDate.toString();
															if (bookedDate.indexOf(allFixturesDate[m]) === -1) {
													            $scope.allFixturesObj[m][t].match_analyst = avMonAnalystObjData[timeIndex][analystIndex].username;
													        	avMonAnalystObjData[timeIndex].splice(analystIndex, 1);
													        } else {
													            return selectAnalyst(analystIndex + 1);
													        }
														}
													}else if(moment(allFixturesDate[m]).format('dddd') === 'Tuesday'){
														refereeIndex = 0;
														analystIndex = 0;
														// console.log(refereeIndex);
														// console.log(avTueRefObjData);
														selectReferee(refereeIndex);
														selectAnalyst(analystIndex);

														function selectReferee(refereeIndex){
															var bookedDate = avTueRefObjData[timeIndex][refereeIndex].bookedDate.toString();
															if (bookedDate.indexOf(allFixturesDate[m]) === -1) {
													            $scope.allFixturesObj[m][t].match_referee = avTueRefObjData[timeIndex][refereeIndex].username;
													        	avTueRefObjData[timeIndex].splice(refereeIndex, 1);
													        } else {
													            return selectReferee(refereeIndex + 1);
													        }
														}
														function selectAnalyst(analystIndex){
															var bookedDate = avTueAnalystObjData[timeIndex][analystIndex].bookedDate.toString();
															if (bookedDate.indexOf(allFixturesDate[m]) === -1) {
													            $scope.allFixturesObj[m][t].match_analyst = avTueAnalystObjData[timeIndex][analystIndex].username;
													        	avTueAnalystObjData[timeIndex].splice(analystIndex, 1);
													        } else {
													            return selectAnalyst(analystIndex + 1);
													        }
														}
													}else if(moment(allFixturesDate[m]).format('dddd') === 'Wednesday'){
														refereeIndex = 0;
														analystIndex = 0;
														// console.log(refereeIndex);
														// console.log(avWedRefObjData);
														selectReferee(refereeIndex);
														selectAnalyst(analystIndex);

														function selectReferee(refereeIndex){
															var bookedDate = avWedRefObjData[timeIndex][refereeIndex].bookedDate.toString();
															if (bookedDate.indexOf(allFixturesDate[m]) === -1) {
													            $scope.allFixturesObj[m][t].match_referee = avWedRefObjData[timeIndex][refereeIndex].username;
													        	avWedRefObjData[timeIndex].splice(refereeIndex, 1);
													        } else {
													            return selectReferee(refereeIndex + 1);
													        }
														}
														function selectAnalyst(analystIndex){
															var bookedDate = avWedAnalystObjData[timeIndex][analystIndex].bookedDate.toString();
															if (bookedDate.indexOf(allFixturesDate[m]) === -1) {
													            $scope.allFixturesObj[m][t].match_analyst = avWedAnalystObjData[timeIndex][analystIndex].username;
													        	avWedAnalystObjData[timeIndex].splice(analystIndex, 1);
													        } else {
													            return selectAnalyst(analystIndex + 1);
													        }
														}
													}else if(moment(allFixturesDate[m]).format('dddd') === 'Thursday'){
														refereeIndex = 0;
														analystIndex = 0;
														// console.log(refereeIndex);
														// console.log(avThuRefObjData);
														selectReferee(refereeIndex);
														selectAnalyst(analystIndex);

														function selectReferee(refereeIndex){
															var bookedDate = avThuRefObjData[timeIndex][refereeIndex].bookedDate.toString();
															if (bookedDate.indexOf(allFixturesDate[m]) === -1) {
													            $scope.allFixturesObj[m][t].match_referee = avThuRefObjData[timeIndex][refereeIndex].username;
													        	avThuRefObjData[timeIndex].splice(refereeIndex, 1);
													        } else {
													            return selectReferee(refereeIndex + 1);
													        }
														}
														function selectAnalyst(analystIndex){
															var bookedDate = avThuAnalystObjData[timeIndex][analystIndex].bookedDate.toString();
															if (bookedDate.indexOf(allFixturesDate[m]) === -1) {
													            $scope.allFixturesObj[m][t].match_analyst = avThuAnalystObjData[timeIndex][analystIndex].username;
													        	avThuAnalystObjData[timeIndex].splice(analystIndex, 1);
													        } else {
													            return selectAnalyst(analystIndex + 1);
													        }
														}
													}else if(moment(allFixturesDate[m]).format('dddd') === 'Friday'){
														refereeIndex = 0;
														analystIndex = 0;
														// console.log(refereeIndex);
														// console.log(avFriRefObjData);
														selectReferee(refereeIndex);
														selectAnalyst(analystIndex);

														function selectReferee(refereeIndex){
															var bookedDate = avFriRefObjData[timeIndex][refereeIndex].bookedDate.toString();
															if (bookedDate.indexOf(allFixturesDate[m]) === -1) {
													            $scope.allFixturesObj[m][t].match_referee = avFriRefObjData[timeIndex][refereeIndex].username;
													        	avFriRefObjData[timeIndex].splice(refereeIndex, 1);
													        } else {
													            return selectReferee(refereeIndex + 1);
													        }
														}
														function selectAnalyst(analystIndex){
															var bookedDate = avFriAnalystObjData[timeIndex][analystIndex].bookedDate.toString();
															if (bookedDate.indexOf(allFixturesDate[m]) === -1) {
													            $scope.allFixturesObj[m][t].match_analyst = avFriAnalystObjData[timeIndex][analystIndex].username;
													        	avFriAnalystObjData[timeIndex].splice(analystIndex, 1);
													        } else {
													            return selectAnalyst(analystIndex + 1);
													        }
														}
													}else if(moment(allFixturesDate[m]).format('dddd') === 'Saturday'){
														refereeIndex = 0;
														analystIndex = 0;
														// console.log(refereeIndex);
														// console.log(avSatRefObjData);
														selectReferee(refereeIndex);
														selectAnalyst(analystIndex);

														function selectReferee(refereeIndex){
															var bookedDate = avSatRefObjData[timeIndex][refereeIndex].bookedDate.toString();
															if (bookedDate.indexOf(allFixturesDate[m]) === -1) {
													            $scope.allFixturesObj[m][t].match_referee = avSatRefObjData[timeIndex][refereeIndex].username;
													        	avSatRefObjData[timeIndex].splice(refereeIndex, 1);
													        } else {
													            return selectReferee(refereeIndex + 1);
													        }
														}
														function selectAnalyst(analystIndex){
															var bookedDate = avSatAnalystObjData[timeIndex][analystIndex].bookedDate.toString();
															if (bookedDate.indexOf(allFixturesDate[m]) === -1) {
													            $scope.allFixturesObj[m][t].match_analyst = avSatAnalystObjData[timeIndex][analystIndex].username;
													        	avSatAnalystObjData[timeIndex].splice(analystIndex, 1);
													        } else {
													            return selectAnalyst(analystIndex + 1);
													        }
														}
													}else if(moment(allFixturesDate[m]).format('dddd') === 'Sunday'){
														refereeIndex = 0;
														analystIndex = 0;
														// console.log(refereeIndex);
														// console.log(avSunRefObjData);
														selectReferee(refereeIndex);
														selectAnalyst(analystIndex);

														function selectReferee(refereeIndex){
															var bookedDate = avSunRefObjData[timeIndex][refereeIndex].bookedDate.toString();
															if (bookedDate.indexOf(allFixturesDate[m]) === -1) {
													            $scope.allFixturesObj[m][t].match_referee = avSunRefObjData[timeIndex][refereeIndex].username;
													        	avSunRefObjData[timeIndex].splice(refereeIndex, 1);
													        } else {
													            return selectReferee(refereeIndex + 1);
													        }
														}
														function selectAnalyst(analystIndex){
															var bookedDate = avSunAnalystObjData[timeIndex][analystIndex].bookedDate.toString();
															if (bookedDate.indexOf(allFixturesDate[m]) === -1) {
													            $scope.allFixturesObj[m][t].match_analyst = avSunAnalystObjData[timeIndex][analystIndex].username;
													        	avSunAnalystObjData[timeIndex].splice(analystIndex, 1);
													        } else {
													            return selectAnalyst(analystIndex + 1);
													        }
														}
													}
														// $scope.allFixturesObj[m][t].match_analyst = $scope.avMonAnalysts[timeIndex][analystIndex].username;
													// }else if(moment(allFixturesDate[m]).format('dddd') === 'Tuesday'){
													// 	selectReferee(refereeIndex);
													// 	function selectReferee(refereeIndex){
													// 		var bookedDate = $scope.avTueRef[timeIndex][refereeIndex].bookedDate.toString();
													// 		if (bookedDate.indexOf(allFixturesDate[m]) === -1) {
													//             $scope.allFixturesObj[m][t].match_referee = $scope.avTueRef[timeIndex][refereeIndex].username;
													//         } else {
													//             return selectReferee(refereeIndex + 1);
													//         }
													// 	}
													// 	// $scope.allFixturesObj[m][t].match_referee = $scope.avTueRef[timeIndex][refereeIndex].username;
													// 	// $scope.allFixturesObj[m][t].match_analyst = $scope.avTueAnalysts[timeIndex][analystIndex].username;
													// }else if(moment(allFixturesDate[m]).format('dddd') === 'Wednesday'){
													// 	selectReferee(refereeIndex);
													// 	function selectReferee(refereeIndex){
													// 		var bookedDate = $scope.avWedRef[timeIndex][refereeIndex].bookedDate.toString();
													// 		if (bookedDate.indexOf(allFixturesDate[m]) === -1) {
													//             $scope.allFixturesObj[m][t].match_referee = $scope.avWedRef[timeIndex][refereeIndex].username;
													//         } else {
													//             return selectReferee(refereeIndex + 1);
													//         }
													// 	}
													// 	// $scope.allFixturesObj[m][t].match_referee = $scope.avWedRef[timeIndex][refereeIndex].username;
													// 	// $scope.allFixturesObj[m][t].match_analyst = $scope.avWedAnalysts[timeIndex][analystIndex].username;
													// }else if(moment(allFixturesDate[m]).format('dddd') === 'Thursday'){
													// 	selectReferee(refereeIndex);
													// 	function selectReferee(refereeIndex){
													// 		var bookedDate = $scope.avThuRef[timeIndex][refereeIndex].bookedDate.toString();
													// 		if (bookedDate.indexOf(allFixturesDate[m]) === -1) {
													//             $scope.allFixturesObj[m][t].match_referee = $scope.avThuRef[timeIndex][refereeIndex].username;
													//         } else {
													//             return selectReferee(refereeIndex + 1);
													//         }
													// 	}
													// 	// $scope.allFixturesObj[m][t].match_referee = $scope.avThuRef[timeIndex][refereeIndex].username;
													// 	// $scope.allFixturesObj[m][t].match_analyst = $scope.avThuAnalysts[timeIndex][analystIndex].username;
													// }else if(moment(allFixturesDate[m]).format('dddd') === 'Friday'){
													// 	selectReferee(refereeIndex);
													// 	function selectReferee(refereeIndex){
													// 		var bookedDate = $scope.avFriRef[timeIndex][refereeIndex].bookedDate.toString();
													// 		if (bookedDate.indexOf(allFixturesDate[m]) === -1) {
													//             $scope.allFixturesObj[m][t].match_referee = $scope.avFriRef[timeIndex][refereeIndex].username;
													//         } else {
													//             return selectReferee(refereeIndex + 1);
													//         }
													// 	}
													// 	// $scope.allFixturesObj[m][t].match_referee = $scope.avFriRef[timeIndex][refereeIndex].username;
													// 	// $scope.allFixturesObj[m][t].match_analyst = $scope.avFriAnalysts[timeIndex][analystIndex].username;
													// }else if(moment(allFixturesDate[m]).format('dddd') === 'Saturday'){
													// 	selectReferee(refereeIndex);
													// 	function selectReferee(refereeIndex){
													// 		var bookedDate = $scope.avSatRef[timeIndex][refereeIndex].bookedDate.toString();
													// 		if (bookedDate.indexOf(allFixturesDate[m]) === -1) {
													//             $scope.allFixturesObj[m][t].match_referee = $scope.avSatRef[timeIndex][refereeIndex].username;
													//         } else {
													//             return selectReferee(refereeIndex + 1);
													//         }
													// 	}
													// 	// $scope.allFixturesObj[m][t].match_referee = $scope.avSatRef[timeIndex][refereeIndex].username;
													// 	// $scope.allFixturesObj[m][t].match_analyst = $scope.avSatAnalysts[timeIndex][analystIndex].username;
													// }else if(moment(allFixturesDate[m]).format('dddd') === 'Sunday'){
													// 	selectReferee(refereeIndex);
													// 	function selectReferee(refereeIndex){
													// 		var bookedDate = $scope.avSunRef[timeIndex][refereeIndex].bookedDate.toString();
													// 		if (bookedDate.indexOf(allFixturesDate[m]) === -1) {
													//             $scope.allFixturesObj[m][t].match_referee = $scope.avSunRef[timeIndex][refereeIndex].username;
													//         } else {
													//             return selectReferee(refereeIndex + 1);
													//         }
													// 	}
													// 	// $scope.allFixturesObj[m][t].match_referee = $scope.avSunRef[timeIndex][refereeIndex].username;
													// 	// $scope.allFixturesObj[m][t].match_analyst = $scope.avSunAnalysts[timeIndex][analystIndex].username;
													// }

													// refereeIndex++;
													// analystIndex++;
													fieldIndex++;
													
													if((t+1) % 2 == 0){
														timeIndex++;
														fieldIndex = 0;
													}
												}
											}
											// console.log($scope.allFixturesObj);
										},10000);
		
										// check if the schedule status is on queue
										if(entry.schedule_status === 'On Queue'){
					
											setTimeout(function(){
												// console.log($scope.allFixturesObj);
												var timeoutTime = 1000;
												for(var f = 0; f < $scope.allFixturesObj.length; f++){
													// console.log($scope.allFixturesObj[f]);
													$scope.allFixturesObj[f].forEach(function(entry){
														$scope.bookedDateRefForm = {};
														$scope.bookedDateRefForm.Username = entry.match_referee;
														$scope.bookedDateRefForm.BookedDate = entry.match_date;
														$scope.bookedDateAnaForm = {};
														$scope.bookedDateAnaForm.Username = entry.match_analyst;
														$scope.bookedDateAnaForm.BookedDate = entry.match_date;

														addMatchDelay(entry,timeoutTime);
														addBookedDate($scope.bookedDateRefForm,$scope.bookedDateAnaForm,timeoutTime);
														timeoutTime += 10;
													});
												}

												// set timer to addMatch function to minimize the number of request per second to prevent failed request
												function addMatchDelay(entry,timeoutTime){
													setTimeout(function(){
														//insert data to database
														MatchService.addMatch(entry).success(function(data){
															// $ionicLoading.hide();
															console.log("add match");
															// console.log(data);
														}).error(function(data){
															// $ionicLoading.hide();
														});
														//insert data to database
													},timeoutTime);
												}

												// set timer to addBookedDate function to minimize the number of request per second to prevent failed request
												function addBookedDate(bookedDateRefForm,bookedDateAnaForm,timeOutTime){
													setTimeout(function(){
														LoginService.addBookedDate(bookedDateRefForm).success(function(data) {
															console.log('berhasil melakukan perubahan data referee');
															// console.log(data);
															$ionicLoading.hide();
														}).error(function(data) {
															$ionicLoading.hide();
														});

														LoginService.addBookedDate(bookedDateAnaForm).success(function(data) {
															console.log('berhasil melakukan perubahan data analyst');
															// console.log(data);
															$ionicLoading.hide();
														}).error(function(data) {
															$ionicLoading.hide();
														});
													},timeOutTime);
												}
									
												// another timer to change the schedule status to on progress
												// if didn't change the status than it will save the data endlessly
												setTimeout(function(){
													if(entry.schedule_status === 'On Queue'){
														console.log("change schedule status to on progress");
														$scope.formCompetition = {};
														// schedule status (on queue, on progress, completed)
														// on queue (team just registered)
														// on progress (competition already has full team and auto scheduling completed)
														// completed (match date and referee has been selected)
														$scope.formCompetition.schedule_status = "On Progress";
														
														CompetitionService.editCompetition(entry.id, localStorage.getItem("token"), $scope.formCompetition).success(function(data) {
															// $ionicLoading.hide();
															console.log("berhasil");
															$scope.loadCompetition = setInterval($scope.getCompetitionByOrganizer, 3000);	
														}).error(function(data) {
															// $ionicLoading.hide();
															console.log("gagal");
														});
													}	
												},20000);

											},15000);
										}
									},4000);
								  },15000);
								// Round Robin Scheduling
							}
							// Group Stage


							// Knockout System
							else if(entry.comp_type == "KnockoutSystem"){
								console.log("KnockoutSystem");
								$scope.pairs = $scope.registerArr.length / 4;

								// Shuffling array function
								Array.prototype.shuffle = function() {
								    var input = this;
								     
								    for (var i = input.length-1; i >=0; i--) {
								     
								        var randomIndex = Math.floor(Math.random()*(i+1)); 
								        var itemAtIndex = input[randomIndex]; 
								         
								        input[randomIndex] = input[i]; 
								        input[i] = itemAtIndex;
								    }
								    return input;
								};
								// Shuffling array function

								// Shuffling the teams
								$scope.registerArr.shuffle();
								console.log($scope.registerArr);

								$scope.matchesArr = [];
								$scope.matchArr = [];
								console.log("Number of pairs: " + $scope.pairs);

								// Date Selection
								var startDate = moment(entry.comp_start);
								var endDate = moment(entry.comp_finish);
							
								//Difference in number of days
								var numOfDays = endDate.diff(startDate, 'days')+1;
								
								console.log(numOfDays);
								// 7 Days
								if(numOfDays === 7){
									if(entry.comp_numOfTeam === 8){
										var playOffDate1 = moment(new Date(entry.comp_start));
										var playOffDate2 = moment(new Date(entry.comp_start)).add(1, 'days');
										var playOffDateArr = [];
										playOffDateArr.push(playOffDate1,playOffDate2);
									}
									if(entry.comp_numOfTeam === 32){
										var roundOf16Date = moment(new Date(entry.comp_start)).add(1, 'days');
									}
									if(entry.comp_numOfTeam !== 8){
										var playOffDate = moment(new Date(entry.comp_start));
										var quarterFinalDate = moment(new Date(entry.comp_start)).add(2, 'days');
									}
									var semiFinalDate = moment(new Date(entry.comp_start)).add(4, 'days');
									var finalDate = moment(new Date(entry.comp_start)).add(6, 'days');
									var timeArr = ["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00"];
									var fieldArr = [1,2,3];

									// Date Selection

									var timeIndex = 0;
									var fieldIndex = 0;
									var playOffIndex = 0;
									$scope.roundOf16FixtureObj = [];
									$scope.quarterFinalFixtureObj = [];
									$scope.semiFinalFixtureObj = [];


									console.log($scope.pairs);
									// if(localStorage.getItem("knockoutSchedulingStat") === 'On Progress'){
										// play off
										for(var i = 1; i <= $scope.pairs; i++){
										    for(var j = 1; j <= 2; j++){
										        $scope.matchArr[j] = {
										            "match_homeTeam" : "", 
										            "match_awayTeam" : "", 
										            "winner" : "",
										            "match_pair" : "",
										            "competition_id" : entry.id,
										            "fixture_number" : 1,
										            "match_status" : "Play Off"
										        };
										    }    

									        $scope.matchArr[1].match_homeTeam = $scope.registerArr[0];
									        $scope.matchArr[1].match_awayTeam = $scope.registerArr[1];
									        $scope.matchArr[1].match_pair = i;
									        $scope.matchArr[1].pair_status = "home";
									        $scope.matchArr[1].match_date = moment(playOffDate).toISOString();	
									        $scope.matchArr[1].match_time = timeArr[timeIndex];
									        $scope.matchArr[1].match_field = fieldArr[0];
									        if(entry.comp_numOfTeam === 8){
									        	$scope.matchArr[1].match_date = moment(playOffDateArr[playOffIndex]).toISOString();	
									        	$scope.matchArr[1].match_time = timeArr[0];
									        	$scope.matchArr[1].match_field = fieldArr[0];
									        }
									       
									        $scope.matchArr[2].match_homeTeam = $scope.registerArr[2];
									        $scope.matchArr[2].match_awayTeam = $scope.registerArr[3];
									        $scope.matchArr[2].match_pair = i;
									        $scope.matchArr[2].pair_status = "away";
									        $scope.matchArr[2].match_date = moment(playOffDate).toISOString();
									        $scope.matchArr[2].match_time = timeArr[timeIndex];
									        $scope.matchArr[2].match_field = fieldArr[1];
									        if(entry.comp_numOfTeam === 8){
									        	$scope.matchArr[2].match_date = moment(playOffDateArr[playOffIndex]).toISOString();
									        	$scope.matchArr[2].match_time = timeArr[1];
									        	$scope.matchArr[2].match_field = fieldArr[0];
									        }

									        $scope.matchesArr.push($scope.matchArr[1]);
									        $scope.matchesArr.push($scope.matchArr[2]);
										    
										    $scope.registerArr.splice(0, 4);
										    timeIndex++;
										    playOffIndex++;
										}

										// play off
										$scope.playOffFixtureObj = [];
										if(entry.comp_numOfTeam === 32){
											setTimeout(function(){
												timeIndex = 0;
												fieldIndex = 0;
												refereeIndex = 0;
												analystIndex = 0;
												for(var m = 0; m < $scope.matchesArr.length; m++){
													$scope.playOffFixtureObj[m] = {};
													$scope.playOffFixtureObj[m].match_homeTeamObj = {};
													$scope.playOffFixtureObj[m].match_homeTeamObj.team_name = $scope.matchesArr[m].match_homeTeam;
													$scope.playOffFixtureObj[m].match_homeTeamObj.score = 0;
													$scope.playOffFixtureObj[m].match_homeTeamObj.formation = '';
													$scope.playOffFixtureObj[m].match_homeTeamObj.lineup = '';
													$scope.playOffFixtureObj[m].match_homeTeamObj.lastLineup = '';
													$scope.playOffFixtureObj[m].match_homeTeamObj.sub = '';
													$scope.playOffFixtureObj[m].match_homeTeamObj.lastSub = '';
													$scope.playOffFixtureObj[m].match_homeTeamObj.player = '';

													$scope.playOffFixtureObj[m].match_awayTeamObj = {};
													$scope.playOffFixtureObj[m].match_awayTeamObj.team_name = $scope.matchesArr[m].match_awayTeam;
													$scope.playOffFixtureObj[m].match_awayTeamObj.score = 0;
													$scope.playOffFixtureObj[m].match_awayTeamObj.formation = '';
													$scope.playOffFixtureObj[m].match_awayTeamObj.lineup = '';
													$scope.playOffFixtureObj[m].match_awayTeamObj.lastLineup = '';
													$scope.playOffFixtureObj[m].match_awayTeamObj.sub = '';
													$scope.playOffFixtureObj[m].match_awayTeamObj.lastSub = '';
													$scope.playOffFixtureObj[m].match_awayTeamObj.player = '';

													$scope.playOffFixtureObj[m].id = "MA" + $rootScope.randomString + 16 + m;
													$scope.playOffFixtureObj[m].match_homeTeam = $scope.matchesArr[m].match_homeTeam;
													$scope.playOffFixtureObj[m].match_awayTeam = $scope.matchesArr[m].match_awayTeam;
													$scope.playOffFixtureObj[m].match_pair = $scope.matchesArr[m].match_pair;
													$scope.playOffFixtureObj[m].pair_status = $scope.matchesArr[m].pair_status;
													$scope.playOffFixtureObj[m].match_date = moment(playOffDate).toISOString();
													$scope.playOffFixtureObj[m].match_time = timeArr[timeIndex];
													$scope.playOffFixtureObj[m].match_fixture = "play off";
													$scope.playOffFixtureObj[m].match_field = fieldArr[fieldIndex];
													$scope.playOffFixtureObj[m].match_started = "";
													$scope.playOffFixtureObj[m].competition_id = entry.id;
													$scope.playOffFixtureObj[m].match_venue = entry.comp_address.venue.nama;
										
													if(moment(playOffDate).format('dddd') === 'Monday'){
														$scope.playOffFixtureObj[m].match_referee = $scope.avMonRef[timeIndex][refereeIndex].username;
														$scope.playOffFixtureObj[m].match_analyst = $scope.avMonAnalysts[timeIndex][analystIndex].username;
													}else if(moment(playOffDate).format('dddd') === 'Tuesday'){
														$scope.playOffFixtureObj[m].match_referee = $scope.avTueRef[timeIndex][refereeIndex].username;
														$scope.playOffFixtureObj[m].match_analyst = $scope.avTueAnalysts[timeIndex][analystIndex].username;
													}else if(moment(playOffDate).format('dddd') === 'Wednesday'){
														$scope.playOffFixtureObj[m].match_referee = $scope.avWedRef[timeIndex][refereeIndex].username;
														$scope.playOffFixtureObj[m].match_analyst = $scope.avWedAnalysts[timeIndex][analystIndex].username;
													}else if(moment(playOffDate).format('dddd') === 'Thursday'){
														$scope.playOffFixtureObj[m].match_referee = $scope.avThuRef[timeIndex][refereeIndex].username;
														$scope.playOffFixtureObj[m].match_analyst = $scope.avThuAnalysts[timeIndex][analystIndex].username;
													}else if(moment(playOffDate).format('dddd') === 'Friday'){
														$scope.playOffFixtureObj[m].match_referee = $scope.avFriRef[timeIndex][refereeIndex].username;
														$scope.playOffFixtureObj[m].match_analyst = $scope.avFriAnalysts[timeIndex][analystIndex].username;
													}else if(moment(playOffDate).format('dddd') === 'Saturday'){
														$scope.playOffFixtureObj[m].match_referee = $scope.avSatRef[timeIndex][refereeIndex].username;
														$scope.playOffFixtureObj[m].match_analyst = $scope.avSatAnalysts[timeIndex][analystIndex].username;
													}else if(moment(playOffDate).format('dddd') === 'Sunday'){
														$scope.playOffFixtureObj[m].match_referee = $scope.avSunRef[timeIndex][refereeIndex].username;
														$scope.playOffFixtureObj[m].match_analyst = $scope.avSunAnalysts[timeIndex][analystIndex].username;
													}
											
													refereeIndex++;
													analystIndex++;
													fieldIndex++;
													if(m % 2 !== 0){
														timeIndex = timeIndex + 2;
														fieldIndex = 0;
													}
												}
												console.log($scope.playOffFixtureObj);
											},6000);
										}else if(entry.comp_numOfTeam === 16){
											setTimeout(function(){
												timeIndex = 0;
												playOffIndex = 0;
												refereeIndex = 0;
												analystIndex = 0;
												fieldIndex = 0;
												for(var m = 0; m < $scope.matchesArr.length; m++){
													$scope.playOffFixtureObj[m] = {};
													$scope.playOffFixtureObj[m].match_homeTeamObj = {};
													$scope.playOffFixtureObj[m].match_homeTeamObj.team_name =  $scope.matchesArr[m].match_homeTeam;
													$scope.playOffFixtureObj[m].match_homeTeamObj.score = 0;
													$scope.playOffFixtureObj[m].match_homeTeamObj.formation = '';
													$scope.playOffFixtureObj[m].match_homeTeamObj.lineup = '';
													$scope.playOffFixtureObj[m].match_homeTeamObj.lastLineup = '';
													$scope.playOffFixtureObj[m].match_homeTeamObj.sub = '';
													$scope.playOffFixtureObj[m].match_homeTeamObj.lastSub = '';
													$scope.playOffFixtureObj[m].match_homeTeamObj.player = '';

													$scope.playOffFixtureObj[m].match_awayTeamObj = {};
													$scope.playOffFixtureObj[m].match_awayTeamObj.team_name = $scope.matchesArr[m].match_awayTeam;
													$scope.playOffFixtureObj[m].match_awayTeamObj.score = 0;
													$scope.playOffFixtureObj[m].match_awayTeamObj.formation = '';
													$scope.playOffFixtureObj[m].match_awayTeamObj.lineup = '';
													$scope.playOffFixtureObj[m].match_awayTeamObj.lastLineup = '';
													$scope.playOffFixtureObj[m].match_awayTeamObj.sub = '';
													$scope.playOffFixtureObj[m].match_awayTeamObj.lastSub = '';
													$scope.playOffFixtureObj[m].match_awayTeamObj.player = '';

													$scope.playOffFixtureObj[m].id = "MA" + $rootScope.randomString + 16 + m;
													$scope.playOffFixtureObj[m].match_homeTeam = $scope.matchesArr[m].match_homeTeam;
													$scope.playOffFixtureObj[m].match_awayTeam = $scope.matchesArr[m].match_awayTeam;
													$scope.playOffFixtureObj[m].match_pair = $scope.matchesArr[m].match_pair;
													$scope.playOffFixtureObj[m].pair_status = $scope.matchesArr[m].pair_status;
													$scope.playOffFixtureObj[m].match_date = moment(playOffDate).toISOString();
													$scope.playOffFixtureObj[m].match_time = timeArr[timeIndex];
													$scope.playOffFixtureObj[m].match_fixture = "play off";
													$scope.playOffFixtureObj[m].match_field = fieldArr[fieldIndex];
													$scope.playOffFixtureObj[m].match_started = "";
													$scope.playOffFixtureObj[m].competition_id = entry.id;
													$scope.playOffFixtureObj[m].match_venue = entry.comp_address.venue.nama;
										
													if(moment(playOffDate).format('dddd') === 'Monday'){
														$scope.playOffFixtureObj[m].match_referee = $scope.avMonRef[timeIndex][refereeIndex].username;
														$scope.playOffFixtureObj[m].match_analyst = $scope.avMonAnalysts[timeIndex][analystIndex].username;
													}else if(moment(playOffDate).format('dddd') === 'Tuesday'){
														$scope.playOffFixtureObj[m].match_referee = $scope.avTueRef[timeIndex][refereeIndex].username;
														$scope.playOffFixtureObj[m].match_analyst = $scope.avTueAnalysts[timeIndex][analystIndex].username;
													}else if(moment(playOffDate).format('dddd') === 'Wednesday'){
														$scope.playOffFixtureObj[m].match_referee = $scope.avWedRef[timeIndex][refereeIndex].username;
														$scope.playOffFixtureObj[m].match_analyst = $scope.avWedAnalysts[timeIndex][analystIndex].username;
													}else if(moment(playOffDate).format('dddd') === 'Thursday'){
														$scope.playOffFixtureObj[m].match_referee = $scope.avThuRef[timeIndex][refereeIndex].username;
														$scope.playOffFixtureObj[m].match_analyst = $scope.avThuAnalysts[timeIndex][analystIndex].username;
													}else if(moment(playOffDate).format('dddd') === 'Friday'){
														$scope.playOffFixtureObj[m].match_referee = $scope.avFriRef[timeIndex][refereeIndex].username;
														$scope.playOffFixtureObj[m].match_analyst = $scope.avFriAnalysts[timeIndex][analystIndex].username;
													}else if(moment(playOffDate).format('dddd') === 'Saturday'){
														$scope.playOffFixtureObj[m].match_referee = $scope.avSatRef[timeIndex][refereeIndex].username;
														$scope.playOffFixtureObj[m].match_analyst = $scope.avSatAnalysts[timeIndex][analystIndex].username;
													}else if(moment(playOffDate).format('dddd') === 'Sunday'){
														$scope.playOffFixtureObj[m].match_referee = $scope.avSunRef[timeIndex][refereeIndex].username;
														$scope.playOffFixtureObj[m].match_analyst = $scope.avSunAnalysts[timeIndex][analystIndex].username;
													}
													
													fieldIndex++;
													refereeIndex++;
													analystIndex++;
													
													if(m % 2 !== 0){
														fieldIndex = 0;
														timeIndex = timeIndex + 2;
													}
												}
												console.log($scope.playOffFixtureObj);
											},6000);
										}else{
											setTimeout(function(){
												refereeIndex = 0;
												analystIndex = 0;
												playOffIndex = 0;
												timeIndex = 0;
												for(var m = 0; m < $scope.matchesArr.length; m++){
													$scope.playOffFixtureObj[m] = {};
													$scope.playOffFixtureObj[m].match_homeTeamObj = {};
													$scope.playOffFixtureObj[m].match_homeTeamObj.team_name =  $scope.matchesArr[m].match_homeTeam;
													$scope.playOffFixtureObj[m].match_homeTeamObj.score = 0;
													$scope.playOffFixtureObj[m].match_homeTeamObj.formation = '';
													$scope.playOffFixtureObj[m].match_homeTeamObj.lineup = '';
													$scope.playOffFixtureObj[m].match_homeTeamObj.lastLineup = '';
													$scope.playOffFixtureObj[m].match_homeTeamObj.sub = '';
													$scope.playOffFixtureObj[m].match_homeTeamObj.lastSub = '';
													$scope.playOffFixtureObj[m].match_homeTeamObj.player = '';

													$scope.playOffFixtureObj[m].match_awayTeamObj = {};
													$scope.playOffFixtureObj[m].match_awayTeamObj.team_name =  $scope.matchesArr[m].match_awayTeam;
													$scope.playOffFixtureObj[m].match_awayTeamObj.score = 0;
													$scope.playOffFixtureObj[m].match_awayTeamObj.formation = '';
													$scope.playOffFixtureObj[m].match_awayTeamObj.lineup = '';
													$scope.playOffFixtureObj[m].match_awayTeamObj.lastLineup = '';
													$scope.playOffFixtureObj[m].match_awayTeamObj.sub = '';
													$scope.playOffFixtureObj[m].match_awayTeamObj.lastSub = '';
													$scope.playOffFixtureObj[m].match_awayTeamObj.player = '';

													$scope.playOffFixtureObj[m].id = "MA" + $rootScope.randomString + 16 + m;
													$scope.playOffFixtureObj[m].match_homeTeam = $scope.matchesArr[m].match_homeTeam;
													$scope.playOffFixtureObj[m].match_awayTeam = $scope.matchesArr[m].match_awayTeam;
													$scope.playOffFixtureObj[m].match_pair = $scope.matchesArr[m].match_pair;
													$scope.playOffFixtureObj[m].pair_status = $scope.matchesArr[m].pair_status;
													$scope.playOffFixtureObj[m].match_date = moment(playOffDateArr[playOffIndex]).toISOString();
													$scope.playOffFixtureObj[m].match_time = timeArr[timeIndex];
													$scope.playOffFixtureObj[m].match_fixture = "play off";
													$scope.playOffFixtureObj[m].match_field = fieldArr[0];
													$scope.playOffFixtureObj[m].match_started = "";
													$scope.playOffFixtureObj[m].competition_id = entry.id;
													$scope.playOffFixtureObj[m].match_venue = entry.comp_address.venue.nama;
										
													if(moment(playOffDateArr[playOffIndex]).format('dddd') === 'Monday'){
														$scope.playOffFixtureObj[m].match_referee = $scope.avMonRef[timeIndex][refereeIndex].username;
														$scope.playOffFixtureObj[m].match_analyst = $scope.avMonAnalysts[timeIndex][analystIndex].username;
													}else if(moment(playOffDateArr[playOffIndex]).format('dddd') === 'Tuesday'){
														$scope.playOffFixtureObj[m].match_referee = $scope.avTueRef[timeIndex][refereeIndex].username;
														$scope.playOffFixtureObj[m].match_analyst = $scope.avTueAnalysts[timeIndex][analystIndex].username;
													}else if(moment(playOffDateArr[playOffIndex]).format('dddd') === 'Wednesday'){
														$scope.playOffFixtureObj[m].match_referee = $scope.avWedRef[timeIndex][refereeIndex].username;
														$scope.playOffFixtureObj[m].match_analyst = $scope.avWedAnalysts[timeIndex][analystIndex].username;
													}else if(moment(playOffDateArr[playOffIndex]).format('dddd') === 'Thursday'){
														$scope.playOffFixtureObj[m].match_referee = $scope.avThuRef[timeIndex][refereeIndex].username;
														$scope.playOffFixtureObj[m].match_analyst = $scope.avThuAnalysts[timeIndex][analystIndex].username;
													}else if(moment(playOffDateArr[playOffIndex]).format('dddd') === 'Friday'){
														$scope.playOffFixtureObj[m].match_referee = $scope.avFriRef[timeIndex][refereeIndex].username;
														$scope.playOffFixtureObj[m].match_analyst = $scope.avFriAnalysts[timeIndex][analystIndex].username;
													}else if(moment(playOffDateArr[playOffIndex]).format('dddd') === 'Saturday'){
														$scope.playOffFixtureObj[m].match_referee = $scope.avSatRef[timeIndex][refereeIndex].username;
														$scope.playOffFixtureObj[m].match_analyst = $scope.avSatAnalysts[timeIndex][analystIndex].username;
													}else if(moment(playOffDateArr[playOffIndex]).format('dddd') === 'Sunday'){
														$scope.playOffFixtureObj[m].match_referee = $scope.avSunRef[timeIndex][refereeIndex].username;
														$scope.playOffFixtureObj[m].match_analyst = $scope.avSunAnalysts[timeIndex][analystIndex].username;
													}
													timeIndex = timeIndex + 2;
													refereeIndex++;
													analystIndex++;
													if((m+1) % 2 === 0){
														playOffIndex++;
														timeIndex = 0;
													}
												}
												console.log($scope.playOffFixtureObj);
											},6000);
										}

										// round of 16
										var pair = 1;
										var pairStatusArr = ["home","away"];
										var pairStatusIndex = 0;
										if(entry.comp_numOfTeam === 32){
											setTimeout(function(){
												timeIndex = 0;
												refereeIndex = 0;
												analystIndex = 0;
												for(var m = 0; m < 8; m++){
													$scope.roundOf16FixtureObj[m] = {};
													$scope.roundOf16FixtureObj[m].match_homeTeamObj = {};
													$scope.roundOf16FixtureObj[m].match_homeTeamObj.team_name = '';
													$scope.roundOf16FixtureObj[m].match_homeTeamObj.score = 0;
													$scope.roundOf16FixtureObj[m].match_homeTeamObj.formation = '';
													$scope.roundOf16FixtureObj[m].match_homeTeamObj.lineup = '';
													$scope.roundOf16FixtureObj[m].match_homeTeamObj.lastLineup = '';
													$scope.roundOf16FixtureObj[m].match_homeTeamObj.sub = '';
													$scope.roundOf16FixtureObj[m].match_homeTeamObj.lastSub = '';
													$scope.roundOf16FixtureObj[m].match_homeTeamObj.player = '';

													$scope.roundOf16FixtureObj[m].match_awayTeamObj = {};
													$scope.roundOf16FixtureObj[m].match_awayTeamObj.team_name = '';
													$scope.roundOf16FixtureObj[m].match_awayTeamObj.score = 0;
													$scope.roundOf16FixtureObj[m].match_awayTeamObj.formation = '';
													$scope.roundOf16FixtureObj[m].match_awayTeamObj.lineup = '';
													$scope.roundOf16FixtureObj[m].match_awayTeamObj.lastLineup = '';
													$scope.roundOf16FixtureObj[m].match_awayTeamObj.sub = '';
													$scope.roundOf16FixtureObj[m].match_awayTeamObj.lastSub = '';
													$scope.roundOf16FixtureObj[m].match_awayTeamObj.player = '';

													$scope.roundOf16FixtureObj[m].id = "MA" + $rootScope.randomString + 16 + m;
													$scope.roundOf16FixtureObj[m].match_homeTeam = "";
													$scope.roundOf16FixtureObj[m].match_awayTeam = "";
													$scope.roundOf16FixtureObj[m].match_pair = pair;
													$scope.roundOf16FixtureObj[m].pair_status = pairStatusArr[pairStatusIndex];
													$scope.roundOf16FixtureObj[m].last_pair = m+1;
													$scope.roundOf16FixtureObj[m].match_date = moment(roundOf16Date).toISOString();
													$scope.roundOf16FixtureObj[m].match_time = timeArr[timeIndex];
													$scope.roundOf16FixtureObj[m].match_fixture = "round of 16";
													$scope.roundOf16FixtureObj[m].match_field = 1;
													$scope.roundOf16FixtureObj[m].match_started = "";
													$scope.roundOf16FixtureObj[m].competition_id = entry.id;
													$scope.roundOf16FixtureObj[m].match_venue = entry.comp_address.venue.nama;
										
													if(moment(roundOf16Date).format('dddd') === 'Monday'){
														$scope.roundOf16FixtureObj[m].match_referee = $scope.avMonRef[timeIndex][refereeIndex].username;
														$scope.roundOf16FixtureObj[m].match_analyst = $scope.avMonAnalysts[timeIndex][analystIndex].username;
													}else if(moment(roundOf16Date).format('dddd') === 'Tuesday'){
														$scope.roundOf16FixtureObj[m].match_referee = $scope.avTueRef[timeIndex][refereeIndex].username;
														$scope.roundOf16FixtureObj[m].match_analyst = $scope.avTueAnalysts[timeIndex][analystIndex].username;
													}else if(moment(roundOf16Date).format('dddd') === 'Wednesday'){
														$scope.roundOf16FixtureObj[m].match_referee = $scope.avWedRef[timeIndex][refereeIndex].username;
														$scope.roundOf16FixtureObj[m].match_analyst = $scope.avWedAnalysts[timeIndex][analystIndex].username;
													}else if(moment(roundOf16Date).format('dddd') === 'Thursday'){
														$scope.roundOf16FixtureObj[m].match_referee = $scope.avThuRef[timeIndex][refereeIndex].username;
														$scope.roundOf16FixtureObj[m].match_analyst = $scope.avThuAnalysts[timeIndex][analystIndex].username;
													}else if(moment(roundOf16Date).format('dddd') === 'Friday'){
														$scope.roundOf16FixtureObj[m].match_referee = $scope.avFriRef[timeIndex][refereeIndex].username;
														$scope.roundOf16FixtureObj[m].match_analyst = $scope.avFriAnalysts[timeIndex][analystIndex].username;
													}else if(moment(roundOf16Date).format('dddd') === 'Saturday'){
														$scope.roundOf16FixtureObj[m].match_referee = $scope.avSatRef[timeIndex][refereeIndex].username;
														$scope.roundOf16FixtureObj[m].match_analyst = $scope.avSatAnalysts[timeIndex][analystIndex].username;
													}else if(moment(roundOf16Date).format('dddd') === 'Sunday'){
														$scope.roundOf16FixtureObj[m].match_referee = $scope.avSunRef[timeIndex][refereeIndex].username;
														$scope.roundOf16FixtureObj[m].match_analyst = $scope.avSunAnalysts[timeIndex][analystIndex].username;
													}

													refereeIndex++;
													analystIndex++;
													timeIndex = timeIndex + 2;
													pairStatusIndex++;
													if((m+1) % 2 === 0){
														pairStatusIndex = 0;
													}
													if((m+1) % 4 === 0){
														roundOf16Index++;
													}
													if(m % 2 !== 0){
														pair++;
													}
												}
												console.log($scope.roundOf16FixtureObj);
											},6000);
										}

										// quarter final
										var pair = 1;
										var pairStatusArr = ["home","away"];
										var pairStatusIndex = 0;
										if(entry.comp_numOfTeam !== 8){
											setTimeout(function(){
												timeIndex = 0;
												refereeIndex = 0;
												analystIndex = 0;
												for(var m = 0; m < 4; m++){
													$scope.quarterFinalFixtureObj[m] = {};
													$scope.quarterFinalFixtureObj[m].match_homeTeamObj = {};
													$scope.quarterFinalFixtureObj[m].match_homeTeamObj.team_name = '';
													$scope.quarterFinalFixtureObj[m].match_homeTeamObj.score = 0;
													$scope.quarterFinalFixtureObj[m].match_homeTeamObj.formation = '';
													$scope.quarterFinalFixtureObj[m].match_homeTeamObj.lineup = '';
													$scope.quarterFinalFixtureObj[m].match_homeTeamObj.lastLineup = '';
													$scope.quarterFinalFixtureObj[m].match_homeTeamObj.sub = '';
													$scope.quarterFinalFixtureObj[m].match_homeTeamObj.lastSub = '';
													$scope.quarterFinalFixtureObj[m].match_homeTeamObj.player = '';

													$scope.quarterFinalFixtureObj[m].match_awayTeamObj = {};
													$scope.quarterFinalFixtureObj[m].match_awayTeamObj.team_name = '';
													$scope.quarterFinalFixtureObj[m].match_awayTeamObj.score = 0;
													$scope.quarterFinalFixtureObj[m].match_awayTeamObj.formation = '';
													$scope.quarterFinalFixtureObj[m].match_awayTeamObj.lineup = '';
													$scope.quarterFinalFixtureObj[m].match_awayTeamObj.lastLineup = '';
													$scope.quarterFinalFixtureObj[m].match_awayTeamObj.sub = '';
													$scope.quarterFinalFixtureObj[m].match_awayTeamObj.lastSub = '';
													$scope.quarterFinalFixtureObj[m].match_awayTeamObj.player = '';

													$scope.quarterFinalFixtureObj[m].id = "MA" + $rootScope.randomString + 8 + m;
													$scope.quarterFinalFixtureObj[m].match_homeTeam = "";
													$scope.quarterFinalFixtureObj[m].match_awayTeam = "";
													$scope.quarterFinalFixtureObj[m].match_pair = pair;
													$scope.quarterFinalFixtureObj[m].pair_status = pairStatusArr[pairStatusIndex];
													$scope.quarterFinalFixtureObj[m].last_pair = m+1;
													$scope.quarterFinalFixtureObj[m].match_date = moment(quarterFinalDate).toISOString();
													$scope.quarterFinalFixtureObj[m].match_time = timeArr[timeIndex];
													$scope.quarterFinalFixtureObj[m].match_fixture = "quarter final";
													$scope.quarterFinalFixtureObj[m].match_field = 1;
													$scope.quarterFinalFixtureObj[m].match_started = "";
													$scope.quarterFinalFixtureObj[m].competition_id = entry.id;
													$scope.quarterFinalFixtureObj[m].match_venue = entry.comp_address.venue.nama;
										
													if(moment(quarterFinalDate).format('dddd') === 'Monday'){
														$scope.quarterFinalFixtureObj[m].match_referee = $scope.avMonRef[timeIndex][refereeIndex].username;
														$scope.quarterFinalFixtureObj[m].match_analyst = $scope.avMonAnalysts[timeIndex][analystIndex].username;
													}else if(moment(quarterFinalDate).format('dddd') === 'Tuesday'){
														$scope.quarterFinalFixtureObj[m].match_referee = $scope.avTueRef[timeIndex][refereeIndex].username;
														$scope.quarterFinalFixtureObj[m].match_analyst = $scope.avTueAnalysts[timeIndex][analystIndex].username;
													}else if(moment(quarterFinalDate).format('dddd') === 'Wednesday'){
														$scope.quarterFinalFixtureObj[m].match_referee = $scope.avWedRef[timeIndex][refereeIndex].username;
														$scope.quarterFinalFixtureObj[m].match_analyst = $scope.avWedAnalysts[timeIndex][analystIndex].username;
													}else if(moment(quarterFinalDate).format('dddd') === 'Thursday'){
														$scope.quarterFinalFixtureObj[m].match_referee = $scope.avThuRef[timeIndex][refereeIndex].username;
														$scope.quarterFinalFixtureObj[m].match_analyst = $scope.avThuAnalysts[timeIndex][analystIndex].username;
													}else if(moment(quarterFinalDate).format('dddd') === 'Friday'){
														$scope.quarterFinalFixtureObj[m].match_referee = $scope.avFriRef[timeIndex][refereeIndex].username;
														$scope.quarterFinalFixtureObj[m].match_analyst = $scope.avFriAnalysts[timeIndex][analystIndex].username;
													}else if(moment(quarterFinalDate).format('dddd') === 'Saturday'){
														$scope.quarterFinalFixtureObj[m].match_referee = $scope.avSatRef[timeIndex][refereeIndex].username;
														$scope.quarterFinalFixtureObj[m].match_analyst = $scope.avSatAnalysts[timeIndex][analystIndex].username;
													}else if(moment(quarterFinalDate).format('dddd') === 'Sunday'){
														$scope.quarterFinalFixtureObj[m].match_referee = $scope.avSunRef[timeIndex][refereeIndex].username;
														$scope.quarterFinalFixtureObj[m].match_analyst = $scope.avSunAnalysts[timeIndex][analystIndex].username;
													}

													refereeIndex++;
													analystIndex++;
													timeIndex = timeIndex + 2;
													pairStatusIndex++;
													if((m+1) % 2 === 0){
														pairStatusIndex = 0;
													}
													if(m % 2 !== 0){
														pair++;
													}
												}
												console.log($scope.quarterFinalFixtureObj);
											},6000);
											
										}

										// semi final
										setTimeout(function(){
											timeIndex = 1;
											refereeIndex = 0;
											analystIndex = 0;
											var pairStatusArr = ["home","away"];
											var pairStatusIndex = 0;
											for(var m = 0; m < 2; m++){
												$scope.semiFinalFixtureObj[m] = {};
												$scope.semiFinalFixtureObj[m].match_homeTeamObj = {};
												$scope.semiFinalFixtureObj[m].match_homeTeamObj.team_name = '';
												$scope.semiFinalFixtureObj[m].match_homeTeamObj.score = 0;
												$scope.semiFinalFixtureObj[m].match_homeTeamObj.formation = '';
												$scope.semiFinalFixtureObj[m].match_homeTeamObj.lineup = '';
												$scope.semiFinalFixtureObj[m].match_homeTeamObj.lastLineup = '';
												$scope.semiFinalFixtureObj[m].match_homeTeamObj.sub = '';
												$scope.semiFinalFixtureObj[m].match_homeTeamObj.lastSub = '';
												$scope.semiFinalFixtureObj[m].match_homeTeamObj.player = '';

												$scope.semiFinalFixtureObj[m].match_awayTeamObj = {};
												$scope.semiFinalFixtureObj[m].match_awayTeamObj.team_name = '';
												$scope.semiFinalFixtureObj[m].match_awayTeamObj.score = 0;
												$scope.semiFinalFixtureObj[m].match_awayTeamObj.formation = '';
												$scope.semiFinalFixtureObj[m].match_awayTeamObj.lineup = '';
												$scope.semiFinalFixtureObj[m].match_awayTeamObj.lastLineup = '';
												$scope.semiFinalFixtureObj[m].match_awayTeamObj.sub = '';
												$scope.semiFinalFixtureObj[m].match_awayTeamObj.lastSub = '';
												$scope.semiFinalFixtureObj[m].match_awayTeamObj.player = '';

												$scope.semiFinalFixtureObj[m].id = "MA" + $rootScope.randomString + 4 + m;
												$scope.semiFinalFixtureObj[m].match_homeTeam = "";
												$scope.semiFinalFixtureObj[m].match_awayTeam = "";
												$scope.semiFinalFixtureObj[m].match_pair = 1;
												$scope.semiFinalFixtureObj[m].pair_status = pairStatusArr[pairStatusIndex];
												$scope.semiFinalFixtureObj[m].last_pair = m+1;
												$scope.semiFinalFixtureObj[m].match_date = moment(semiFinalDate).toISOString();
												$scope.semiFinalFixtureObj[m].match_time = timeArr[timeIndex];
												$scope.semiFinalFixtureObj[m].match_fixture = "semi final";
												$scope.semiFinalFixtureObj[m].match_field = 1;
												$scope.semiFinalFixtureObj[m].match_started = "";
												$scope.semiFinalFixtureObj[m].competition_id = entry.id;
												$scope.semiFinalFixtureObj[m].match_venue = entry.comp_address.venue.nama;
									
												if(moment(semiFinalDate).format('dddd') === 'Monday'){
													$scope.semiFinalFixtureObj[m].match_referee = $scope.avMonRef[timeIndex][refereeIndex].username;
													$scope.semiFinalFixtureObj[m].match_analyst = $scope.avMonAnalysts[timeIndex][analystIndex].username;
												}else if(moment(semiFinalDate).format('dddd') === 'Tuesday'){
													$scope.semiFinalFixtureObj[m].match_referee = $scope.avTueRef[timeIndex][refereeIndex].username;
													$scope.semiFinalFixtureObj[m].match_analyst = $scope.avTueAnalysts[timeIndex][analystIndex].username;
												}else if(moment(semiFinalDate).format('dddd') === 'Wednesday'){
													$scope.semiFinalFixtureObj[m].match_referee = $scope.avWedRef[timeIndex][refereeIndex].username;
													$scope.semiFinalFixtureObj[m].match_analyst = $scope.avWedAnalysts[timeIndex][analystIndex].username;
												}else if(moment(semiFinalDate).format('dddd') === 'Thursday'){
													$scope.semiFinalFixtureObj[m].match_referee = $scope.avThuRef[timeIndex][refereeIndex].username;
													$scope.semiFinalFixtureObj[m].match_analyst = $scope.avThuAnalysts[timeIndex][analystIndex].username;
												}else if(moment(semiFinalDate).format('dddd') === 'Friday'){
													$scope.semiFinalFixtureObj[m].match_referee = $scope.avFriRef[timeIndex][refereeIndex].username;
													$scope.semiFinalFixtureObj[m].match_analyst = $scope.avFriAnalysts[timeIndex][analystIndex].username;
												}else if(moment(semiFinalDate).format('dddd') === 'Saturday'){
													$scope.semiFinalFixtureObj[m].match_referee = $scope.avSatRef[timeIndex][refereeIndex].username;
													$scope.semiFinalFixtureObj[m].match_analyst = $scope.avSatAnalysts[timeIndex][analystIndex].username;
												}else if(moment(semiFinalDate).format('dddd') === 'Sunday'){
													$scope.semiFinalFixtureObj[m].match_referee = $scope.avSunRef[timeIndex][refereeIndex].username;
													$scope.semiFinalFixtureObj[m].match_analyst = $scope.avSunAnalysts[timeIndex][analystIndex].username;
												}

												refereeIndex++;
												analystIndex++;
												timeIndex = timeIndex + 2;
												pairStatusIndex++;
												if((m+1) % 2 === 0){
													pairStatusIndex = 0;
												}
											}
											console.log($scope.semiFinalFixtureObj);
										},6000);
										

										// final
										setTimeout(function(){
											refereeIndex = 0;
											analystIndex = 0;
											$scope.finalFixtureObj = {};
											$scope.finalFixtureObj.match_homeTeamObj = {};
											$scope.finalFixtureObj.match_homeTeamObj.team_name = '';
											$scope.finalFixtureObj.match_homeTeamObj.score = 0;
											$scope.finalFixtureObj.match_homeTeamObj.formation = '';
											$scope.finalFixtureObj.match_homeTeamObj.lineup = '';
											$scope.finalFixtureObj.match_homeTeamObj.lastLineup = '';
											$scope.finalFixtureObj.match_homeTeamObj.sub = '';
											$scope.finalFixtureObj.match_homeTeamObj.lastSub = '';
											$scope.finalFixtureObj.match_homeTeamObj.player = '';

											$scope.finalFixtureObj.match_awayTeamObj = {};
											$scope.finalFixtureObj.match_awayTeamObj.team_name = '';
											$scope.finalFixtureObj.match_awayTeamObj.score = 0;
											$scope.finalFixtureObj.match_awayTeamObj.formation = '';
											$scope.finalFixtureObj.match_awayTeamObj.lineup = '';
											$scope.finalFixtureObj.match_awayTeamObj.lastLineup = '';
											$scope.finalFixtureObj.match_awayTeamObj.sub = '';
											$scope.finalFixtureObj.match_awayTeamObj.lastSub = '';
											$scope.finalFixtureObj.match_awayTeamObj.player = '';

											$scope.finalFixtureObj.id = "MA" + $rootScope.randomString;
											$scope.finalFixtureObj.match_homeTeam = "";
											$scope.finalFixtureObj.match_awayTeam = "";
											$scope.finalFixtureObj.match_date = moment(finalDate).toISOString();
											$scope.finalFixtureObj.match_time = timeArr[1];
											$scope.finalFixtureObj.match_fixture = "final";
											$scope.finalFixtureObj.match_field = 1;
											$scope.finalFixtureObj.match_started = "";
											$scope.finalFixtureObj.competition_id = entry.id;
											$scope.finalFixtureObj.match_venue = entry.comp_address.venue.nama;
								
											if(moment(finalDate).format('dddd') === 'Monday'){
												$scope.finalFixtureObj.match_referee = $scope.avMonRef[timeIndex][refereeIndex].username;
												$scope.finalFixtureObj.match_analyst = $scope.avMonAnalysts[timeIndex][analystIndex].username;
											}else if(moment(finalDate).format('dddd') === 'Tuesday'){
												$scope.finalFixtureObj.match_referee = $scope.avTueRef[timeIndex][refereeIndex].username;
												$scope.finalFixtureObj.match_analyst = $scope.avTueAnalysts[timeIndex][analystIndex].username;
											}else if(moment(finalDate).format('dddd') === 'Wednesday'){
												$scope.finalFixtureObj.match_referee = $scope.avWedRef[timeIndex][refereeIndex].username;
												$scope.finalFixtureObj.match_analyst = $scope.avWedAnalysts[timeIndex][analystIndex].username;
											}else if(moment(finalDate).format('dddd') === 'Thursday'){
												$scope.finalFixtureObj.match_referee = $scope.avThuRef[timeIndex][refereeIndex].username;
												$scope.finalFixtureObj.match_analyst = $scope.avThuAnalysts[timeIndex][analystIndex].username;
											}else if(moment(finalDate).format('dddd') === 'Friday'){
												$scope.finalFixtureObj.match_referee = $scope.avFriRef[timeIndex][refereeIndex].username;
												$scope.finalFixtureObj.match_analyst = $scope.avFriAnalysts[timeIndex][analystIndex].username;
											}else if(moment(finalDate).format('dddd') === 'Saturday'){
												$scope.finalFixtureObj.match_referee = $scope.avSatRef[timeIndex][refereeIndex].username;
												$scope.finalFixtureObj.match_analyst = $scope.avSatAnalysts[timeIndex][analystIndex].username;
											}else if(moment(finalDate).format('dddd') === 'Sunday'){
												$scope.finalFixtureObj.match_referee = $scope.avSunRef[timeIndex][refereeIndex].username;
												$scope.finalFixtureObj.match_analyst = $scope.avSunAnalysts[timeIndex][analystIndex].username;
											}									
											console.log($scope.finalFixtureObj);
										},6000);
									
									// }
								// 14 Days (done) 
								}else if(numOfDays === 14){
									if(entry.comp_numOfTeam === 8){
										var playOffDate1 = moment(new Date(entry.comp_start));
										var playOffDate2 = moment(new Date(entry.comp_start)).add(2, 'days');
										var playOffDate3 = moment(new Date(entry.comp_start)).add(4, 'days');
										var playOffDate4 = moment(new Date(entry.comp_start)).add(6, 'days');
										var playOffDateArr = [];
										playOffDateArr.push(playOffDate1,playOffDate2,playOffDate3,playOffDate4);
									}
									if(entry.comp_numOfTeam === 16){
										var playOffDate1 = moment(new Date(entry.comp_start));
										var playOffDate2 = moment(new Date(entry.comp_start)).add(1, 'days');
										var quarterFinalDate1 = moment(new Date(entry.comp_start)).add(4, 'days');
										var quarterFinalDate2 = moment(new Date(entry.comp_start)).add(5, 'days');
										var quarterFinalDate3 = moment(new Date(entry.comp_start)).add(6, 'days');
										var quarterFinalDate4 = moment(new Date(entry.comp_start)).add(7, 'days');
										var playOffDateArr = [];
										var quarterFinalDateArr = [];
										playOffDateArr.push(playOffDate1,playOffDate2);
										quarterFinalDateArr.push(quarterFinalDate1,quarterFinalDate2,quarterFinalDate3,quarterFinalDate4);
									}
									if(entry.comp_numOfTeam === 32){
										var playOffDate = moment(new Date(entry.comp_start));
										var roundOf16Date1 = moment(new Date(entry.comp_start)).add(3, 'days');
										var roundOf16Date2 = moment(new Date(entry.comp_start)).add(4, 'days');
										var quarterFinalDate1 = moment(new Date(entry.comp_start)).add(6, 'days');
										var quarterFinalDate2 = moment(new Date(entry.comp_start)).add(7, 'days');
										var roundOf16DateArr = [];
										var quarterFinalDateArr = [];
										roundOf16DateArr.push(roundOf16Date1,roundOf16Date2);
										quarterFinalDateArr.push(quarterFinalDate1,quarterFinalDate2);
									}
									
									var semiFinalDate1 = moment(new Date(entry.comp_start)).add(10, 'days');
									var semiFinalDate2 = moment(new Date(entry.comp_start)).add(11, 'days');
									var semiFinalDateArr = [];
									semiFinalDateArr.push(semiFinalDate1,semiFinalDate2);
									var finalDate = moment(new Date(entry.comp_start)).add(13, 'days');
									var timeArr = ["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00"];
									var fieldArr = [1,2,3];

									// Date Selection

									var timeIndex = 0;
									var fieldIndex = 0;
									var refereeIndex = 0;
									var analystIndex = 0;
									$scope.playOffFixtureObj = [];
									$scope.roundOf16FixtureObj = [];
									$scope.quarterFinalFixtureObj = [];
									$scope.semiFinalFixtureObj = [];


									console.log($scope.pairs);
									// if(localStorage.getItem("knockoutSchedulingStat") === 'On Progress'){
										console.log(entry.comp_numOfTeam);
										console.log(numOfDays);
										for(var i = 1; i <= $scope.pairs; i++){
										    for(var j = 1; j <= 2; j++){
										        $scope.matchArr[j] = {
										            "match_homeTeam" : "", 
										            "match_awayTeam" : "", 
										            "winner" : "",
										            "match_pair" : "",
										            "competition_id" : entry.id,
										            "fixture_number" : 1,
										            "match_status" : "Play Off"
										        };
										    }    

									        $scope.matchArr[1].match_homeTeam = $scope.registerArr[0];
									        $scope.matchArr[1].match_awayTeam = $scope.registerArr[1];
									        $scope.matchArr[1].match_pair = i;
									        $scope.matchArr[1].pair_status = "home";
									        // $scope.matchArr[1].match_date = moment(playOffDate).toISOString();
									        // $scope.matchArr[1].match_time = timeArr[timeIndex];
									        // $scope.matchArr[1].match_field = fieldArr[0];
									        $scope.matchArr[2].match_homeTeam = $scope.registerArr[2];
									        $scope.matchArr[2].match_awayTeam = $scope.registerArr[3];
									        $scope.matchArr[2].match_pair = i;
									        $scope.matchArr[2].pair_status = "away";
									        // $scope.matchArr[2].match_date = moment(playOffDate).toISOString();
									        // $scope.matchArr[2].match_time = timeArr[timeIndex];
									        // $scope.matchArr[2].match_field = fieldArr[1];

									        $scope.matchesArr.push($scope.matchArr[1]);
									        $scope.matchesArr.push($scope.matchArr[2]);
										    
										    $scope.registerArr.splice(0, 4);
										    timeIndex++;
										}

										// play off
										if(entry.comp_numOfTeam === 32){
											setTimeout(function(){
												timeIndex = 0;
												fieldIndex = 0;
												refereeIndex = 0;
												analystIndex = 0;
												for(var m = 0; m < $scope.matchesArr.length; m++){
													$scope.playOffFixtureObj[m] = {};
													$scope.playOffFixtureObj[m].match_homeTeamObj = {};
													$scope.playOffFixtureObj[m].match_homeTeamObj.team_name = $scope.matchesArr[m].match_homeTeam;
													$scope.playOffFixtureObj[m].match_homeTeamObj.score = 0;
													$scope.playOffFixtureObj[m].match_homeTeamObj.formation = '';
													$scope.playOffFixtureObj[m].match_homeTeamObj.lineup = '';
													$scope.playOffFixtureObj[m].match_homeTeamObj.lastLineup = '';
													$scope.playOffFixtureObj[m].match_homeTeamObj.sub = '';
													$scope.playOffFixtureObj[m].match_homeTeamObj.lastSub = '';
													$scope.playOffFixtureObj[m].match_homeTeamObj.player = '';

													$scope.playOffFixtureObj[m].match_awayTeamObj = {};
													$scope.playOffFixtureObj[m].match_awayTeamObj.team_name = $scope.matchesArr[m].match_awayTeam;
													$scope.playOffFixtureObj[m].match_awayTeamObj.score = 0;
													$scope.playOffFixtureObj[m].match_awayTeamObj.formation = '';
													$scope.playOffFixtureObj[m].match_awayTeamObj.lineup = '';
													$scope.playOffFixtureObj[m].match_awayTeamObj.lastLineup = '';
													$scope.playOffFixtureObj[m].match_awayTeamObj.sub = '';
													$scope.playOffFixtureObj[m].match_awayTeamObj.lastSub = '';
													$scope.playOffFixtureObj[m].match_awayTeamObj.player = '';

													$scope.playOffFixtureObj[m].id = "MA" + $rootScope.randomString + 16 + m;
													$scope.playOffFixtureObj[m].match_homeTeam = $scope.matchesArr[m].match_homeTeam;
													$scope.playOffFixtureObj[m].match_awayTeam = $scope.matchesArr[m].match_awayTeam;
													$scope.playOffFixtureObj[m].match_pair = $scope.matchesArr[m].match_pair;
													$scope.playOffFixtureObj[m].pair_status = $scope.matchesArr[m].pair_status;
													$scope.playOffFixtureObj[m].match_date = moment(playOffDate).toISOString();
													$scope.playOffFixtureObj[m].match_time = timeArr[timeIndex];
													$scope.playOffFixtureObj[m].match_fixture = "play off";
													$scope.playOffFixtureObj[m].match_field = fieldArr[fieldIndex];
													$scope.playOffFixtureObj[m].match_started = "";
													$scope.playOffFixtureObj[m].competition_id = entry.id;
													$scope.playOffFixtureObj[m].match_venue = entry.comp_address.venue.nama;
										
													if(moment(playOffDate).format('dddd') === 'Monday'){
														$scope.playOffFixtureObj[m].match_referee = $scope.avMonRef[timeIndex][refereeIndex].username;
														$scope.playOffFixtureObj[m].match_analyst = $scope.avMonAnalysts[timeIndex][analystIndex].username;
													}else if(moment(playOffDate).format('dddd') === 'Tuesday'){
														$scope.playOffFixtureObj[m].match_referee = $scope.avTueRef[timeIndex][refereeIndex].username;
														$scope.playOffFixtureObj[m].match_analyst = $scope.avTueAnalysts[timeIndex][analystIndex].username;
													}else if(moment(playOffDate).format('dddd') === 'Wednesday'){
														$scope.playOffFixtureObj[m].match_referee = $scope.avWedRef[timeIndex][refereeIndex].username;
														$scope.playOffFixtureObj[m].match_analyst = $scope.avWedAnalysts[timeIndex][analystIndex].username;
													}else if(moment(playOffDate).format('dddd') === 'Thursday'){
														$scope.playOffFixtureObj[m].match_referee = $scope.avThuRef[timeIndex][refereeIndex].username;
														$scope.playOffFixtureObj[m].match_analyst = $scope.avThuAnalysts[timeIndex][analystIndex].username;
													}else if(moment(playOffDate).format('dddd') === 'Friday'){
														$scope.playOffFixtureObj[m].match_referee = $scope.avFriRef[timeIndex][refereeIndex].username;
														$scope.playOffFixtureObj[m].match_analyst = $scope.avFriAnalysts[timeIndex][analystIndex].username;
													}else if(moment(playOffDate).format('dddd') === 'Saturday'){
														$scope.playOffFixtureObj[m].match_referee = $scope.avSatRef[timeIndex][refereeIndex].username;
														$scope.playOffFixtureObj[m].match_analyst = $scope.avSatAnalysts[timeIndex][analystIndex].username;
													}else if(moment(playOffDate).format('dddd') === 'Sunday'){
														$scope.playOffFixtureObj[m].match_referee = $scope.avSunRef[timeIndex][refereeIndex].username;
														$scope.playOffFixtureObj[m].match_analyst = $scope.avSunAnalysts[timeIndex][analystIndex].username;
													}
											
													refereeIndex++;
													analystIndex++;
													fieldIndex++;
													if(m % 2 !== 0){
														timeIndex = timeIndex + 2;
														fieldIndex = 0;
													}
												};
												console.log($scope.playOffFixtureObj);
											},6000);
										}else if(entry.comp_numOfTeam === 16){
											setTimeout(function(){
												timeIndex = 0;
												playOffIndex = 0;
												refereeIndex = 0;
												analystIndex = 0;
												for(var m = 0; m < $scope.matchesArr.length; m++){
													$scope.playOffFixtureObj[m] = {};
													$scope.playOffFixtureObj[m].match_homeTeamObj = {};
													$scope.playOffFixtureObj[m].match_homeTeamObj.team_name =  $scope.matchesArr[m].match_homeTeam;
													$scope.playOffFixtureObj[m].match_homeTeamObj.score = 0;
													$scope.playOffFixtureObj[m].match_homeTeamObj.formation = '';
													$scope.playOffFixtureObj[m].match_homeTeamObj.lineup = '';
													$scope.playOffFixtureObj[m].match_homeTeamObj.lastLineup = '';
													$scope.playOffFixtureObj[m].match_homeTeamObj.sub = '';
													$scope.playOffFixtureObj[m].match_homeTeamObj.lastSub = '';
													$scope.playOffFixtureObj[m].match_homeTeamObj.player = '';

													$scope.playOffFixtureObj[m].match_awayTeamObj = {};
													$scope.playOffFixtureObj[m].match_awayTeamObj.team_name = $scope.matchesArr[m].match_awayTeam;
													$scope.playOffFixtureObj[m].match_awayTeamObj.score = 0;
													$scope.playOffFixtureObj[m].match_awayTeamObj.formation = '';
													$scope.playOffFixtureObj[m].match_awayTeamObj.lineup = '';
													$scope.playOffFixtureObj[m].match_awayTeamObj.lastLineup = '';
													$scope.playOffFixtureObj[m].match_awayTeamObj.sub = '';
													$scope.playOffFixtureObj[m].match_awayTeamObj.lastSub = '';
													$scope.playOffFixtureObj[m].match_awayTeamObj.player = '';

													$scope.playOffFixtureObj[m].id = "MA" + $rootScope.randomString + 16 + m;
													$scope.playOffFixtureObj[m].match_homeTeam = $scope.matchesArr[m].match_homeTeam;
													$scope.playOffFixtureObj[m].match_awayTeam = $scope.matchesArr[m].match_awayTeam;
													$scope.playOffFixtureObj[m].match_pair = $scope.matchesArr[m].match_pair;
													$scope.playOffFixtureObj[m].pair_status = $scope.matchesArr[m].pair_status;
													$scope.playOffFixtureObj[m].match_date = moment(playOffDateArr[playOffIndex]).toISOString();
													$scope.playOffFixtureObj[m].match_time = timeArr[timeIndex];
													$scope.playOffFixtureObj[m].match_fixture = "play off";
													$scope.playOffFixtureObj[m].match_field = fieldArr[0];
													$scope.playOffFixtureObj[m].match_started = "";
													$scope.playOffFixtureObj[m].competition_id = entry.id;
													$scope.playOffFixtureObj[m].match_venue = entry.comp_address.venue.nama;
										
													if(moment(playOffDateArr[playOffIndex]).format('dddd') === 'Monday'){
														$scope.playOffFixtureObj[m].match_referee = $scope.avMonRef[timeIndex][refereeIndex].username;
														$scope.playOffFixtureObj[m].match_analyst = $scope.avMonAnalysts[timeIndex][analystIndex].username;
													}else if(moment(playOffDateArr[playOffIndex]).format('dddd') === 'Tuesday'){
														$scope.playOffFixtureObj[m].match_referee = $scope.avTueRef[timeIndex][refereeIndex].username;
														$scope.playOffFixtureObj[m].match_analyst = $scope.avTueAnalysts[timeIndex][analystIndex].username;
													}else if(moment(playOffDateArr[playOffIndex]).format('dddd') === 'Wednesday'){
														$scope.playOffFixtureObj[m].match_referee = $scope.avWedRef[timeIndex][refereeIndex].username;
														$scope.playOffFixtureObj[m].match_analyst = $scope.avWedAnalysts[timeIndex][analystIndex].username;
													}else if(moment(playOffDateArr[playOffIndex]).format('dddd') === 'Thursday'){
														$scope.playOffFixtureObj[m].match_referee = $scope.avThuRef[timeIndex][refereeIndex].username;
														$scope.playOffFixtureObj[m].match_analyst = $scope.avThuAnalysts[timeIndex][analystIndex].username;
													}else if(moment(playOffDateArr[playOffIndex]).format('dddd') === 'Friday'){
														$scope.playOffFixtureObj[m].match_referee = $scope.avFriRef[timeIndex][refereeIndex].username;
														$scope.playOffFixtureObj[m].match_analyst = $scope.avFriAnalysts[timeIndex][analystIndex].username;
													}else if(moment(playOffDateArr[playOffIndex]).format('dddd') === 'Saturday'){
														$scope.playOffFixtureObj[m].match_referee = $scope.avSatRef[timeIndex][refereeIndex].username;
														$scope.playOffFixtureObj[m].match_analyst = $scope.avSatAnalysts[timeIndex][analystIndex].username;
													}else if(moment(playOffDateArr[playOffIndex]).format('dddd') === 'Sunday'){
														$scope.playOffFixtureObj[m].match_referee = $scope.avSunRef[timeIndex][refereeIndex].username;
														$scope.playOffFixtureObj[m].match_analyst = $scope.avSunAnalysts[timeIndex][analystIndex].username;
													}
												
													refereeIndex++;
													analystIndex++;
													timeIndex = timeIndex + 2;
													if((m+1) % 4 === 0){
														playOffIndex++;
														timeIndex = 0;
													}
												};
												console.log($scope.playOffFixtureObj);
											},6000);
										}else{
											setTimeout(function(){
												refereeIndex = 0;
												analystIndex = 0;
												playOffIndex = 0;
												for(var m = 0; m < $scope.matchesArr.length; m++){
													$scope.playOffFixtureObj[m] = {};
													$scope.playOffFixtureObj[m].match_homeTeamObj = {};
													$scope.playOffFixtureObj[m].match_homeTeamObj.team_name =  $scope.matchesArr[m].match_homeTeam;
													$scope.playOffFixtureObj[m].match_homeTeamObj.score = 0;
													$scope.playOffFixtureObj[m].match_homeTeamObj.formation = '';
													$scope.playOffFixtureObj[m].match_homeTeamObj.lineup = '';
													$scope.playOffFixtureObj[m].match_homeTeamObj.lastLineup = '';
													$scope.playOffFixtureObj[m].match_homeTeamObj.sub = '';
													$scope.playOffFixtureObj[m].match_homeTeamObj.lastSub = '';
													$scope.playOffFixtureObj[m].match_homeTeamObj.player = '';

													$scope.playOffFixtureObj[m].match_awayTeamObj = {};
													$scope.playOffFixtureObj[m].match_awayTeamObj.team_name =  $scope.matchesArr[m].match_awayTeam;
													$scope.playOffFixtureObj[m].match_awayTeamObj.score = 0;
													$scope.playOffFixtureObj[m].match_awayTeamObj.formation = '';
													$scope.playOffFixtureObj[m].match_awayTeamObj.lineup = '';
													$scope.playOffFixtureObj[m].match_awayTeamObj.lastLineup = '';
													$scope.playOffFixtureObj[m].match_awayTeamObj.sub = '';
													$scope.playOffFixtureObj[m].match_awayTeamObj.lastSub = '';
													$scope.playOffFixtureObj[m].match_awayTeamObj.player = '';

													$scope.playOffFixtureObj[m].id = "MA" + $rootScope.randomString + 16 + m;
													$scope.playOffFixtureObj[m].match_homeTeam = $scope.matchesArr[m].match_homeTeam;
													$scope.playOffFixtureObj[m].match_awayTeam = $scope.matchesArr[m].match_awayTeam;
													$scope.playOffFixtureObj[m].match_pair = $scope.matchesArr[m].match_pair;
													$scope.playOffFixtureObj[m].pair_status = $scope.matchesArr[m].pair_status;
													$scope.playOffFixtureObj[m].match_date = moment(playOffDateArr[playOffIndex]).toISOString();
													$scope.playOffFixtureObj[m].match_time = timeArr[0];
													$scope.playOffFixtureObj[m].match_fixture = "play off";
													$scope.playOffFixtureObj[m].match_field = fieldArr[0];
													$scope.playOffFixtureObj[m].match_started = "";
													$scope.playOffFixtureObj[m].competition_id = entry.id;
													$scope.playOffFixtureObj[m].match_venue = entry.comp_address.venue.nama;
										
													if(moment(playOffDateArr[playOffIndex]).format('dddd') === 'Monday'){
														$scope.playOffFixtureObj[m].match_referee = $scope.avMonRef[timeIndex][refereeIndex].username;
														$scope.playOffFixtureObj[m].match_analyst = $scope.avMonAnalysts[timeIndex][analystIndex].username;
													}else if(moment(playOffDateArr[playOffIndex]).format('dddd') === 'Tuesday'){
														$scope.playOffFixtureObj[m].match_referee = $scope.avTueRef[timeIndex][refereeIndex].username;
														$scope.playOffFixtureObj[m].match_analyst = $scope.avTueAnalysts[timeIndex][analystIndex].username;
													}else if(moment(playOffDateArr[playOffIndex]).format('dddd') === 'Wednesday'){
														$scope.playOffFixtureObj[m].match_referee = $scope.avWedRef[timeIndex][refereeIndex].username;
														$scope.playOffFixtureObj[m].match_analyst = $scope.avWedAnalysts[timeIndex][analystIndex].username;
													}else if(moment(playOffDateArr[playOffIndex]).format('dddd') === 'Thursday'){
														$scope.playOffFixtureObj[m].match_referee = $scope.avThuRef[timeIndex][refereeIndex].username;
														$scope.playOffFixtureObj[m].match_analyst = $scope.avThuAnalysts[timeIndex][analystIndex].username;
													}else if(moment(playOffDateArr[playOffIndex]).format('dddd') === 'Friday'){
														$scope.playOffFixtureObj[m].match_referee = $scope.avFriRef[timeIndex][refereeIndex].username;
														$scope.playOffFixtureObj[m].match_analyst = $scope.avFriAnalysts[timeIndex][analystIndex].username;
													}else if(moment(playOffDateArr[playOffIndex]).format('dddd') === 'Saturday'){
														$scope.playOffFixtureObj[m].match_referee = $scope.avSatRef[timeIndex][refereeIndex].username;
														$scope.playOffFixtureObj[m].match_analyst = $scope.avSatAnalysts[timeIndex][analystIndex].username;
													}else if(moment(playOffDateArr[playOffIndex]).format('dddd') === 'Sunday'){
														$scope.playOffFixtureObj[m].match_referee = $scope.avSunRef[timeIndex][refereeIndex].username;
														$scope.playOffFixtureObj[m].match_analyst = $scope.avSunAnalysts[timeIndex][analystIndex].username;
													}
													refereeIndex++;
													analystIndex++;
													playOffIndex++;
												};
												console.log($scope.playOffFixtureObj);
											},6000);
										}

										// round of 16
										var pair = 1;
										var pairStatusArr = ["home","away"];
										var pairStatusIndex = 0;
										var roundOf16Index = 0;
										if(entry.comp_numOfTeam === 32){
											setTimeout(function(){
												timeIndex = 0;
												refereeIndex = 0;
												analystIndex = 0;
												for(var m = 0; m < 8; m++){
													$scope.roundOf16FixtureObj[m] = {};
													$scope.roundOf16FixtureObj[m].match_homeTeamObj = {};
													$scope.roundOf16FixtureObj[m].match_homeTeamObj.team_name = '';
													$scope.roundOf16FixtureObj[m].match_homeTeamObj.score = 0;
													$scope.roundOf16FixtureObj[m].match_homeTeamObj.formation = '';
													$scope.roundOf16FixtureObj[m].match_homeTeamObj.lineup = '';
													$scope.roundOf16FixtureObj[m].match_homeTeamObj.lastLineup = '';
													$scope.roundOf16FixtureObj[m].match_homeTeamObj.sub = '';
													$scope.roundOf16FixtureObj[m].match_homeTeamObj.lastSub = '';
													$scope.roundOf16FixtureObj[m].match_homeTeamObj.player = '';

													$scope.roundOf16FixtureObj[m].match_awayTeamObj = {};
													$scope.roundOf16FixtureObj[m].match_awayTeamObj.team_name = '';
													$scope.roundOf16FixtureObj[m].match_awayTeamObj.score = 0;
													$scope.roundOf16FixtureObj[m].match_awayTeamObj.formation = '';
													$scope.roundOf16FixtureObj[m].match_awayTeamObj.lineup = '';
													$scope.roundOf16FixtureObj[m].match_awayTeamObj.lastLineup = '';
													$scope.roundOf16FixtureObj[m].match_awayTeamObj.sub = '';
													$scope.roundOf16FixtureObj[m].match_awayTeamObj.lastSub = '';
													$scope.roundOf16FixtureObj[m].match_awayTeamObj.player = '';

													$scope.roundOf16FixtureObj[m].id = "MA" + $rootScope.randomString + 16 + m;
													$scope.roundOf16FixtureObj[m].match_homeTeam = "";
													$scope.roundOf16FixtureObj[m].match_awayTeam = "";
													$scope.roundOf16FixtureObj[m].match_pair = pair;
													$scope.roundOf16FixtureObj[m].pair_status = pairStatusArr[pairStatusIndex];
													$scope.roundOf16FixtureObj[m].last_pair = m+1;
													$scope.roundOf16FixtureObj[m].match_date = moment(roundOf16DateArr[roundOf16Index]).toISOString();
													$scope.roundOf16FixtureObj[m].match_time = timeArr[timeIndex];
													$scope.roundOf16FixtureObj[m].match_fixture = "round of 16";
													$scope.roundOf16FixtureObj[m].match_field = 1;
													$scope.roundOf16FixtureObj[m].match_started = "";
													$scope.roundOf16FixtureObj[m].competition_id = entry.id;
													$scope.roundOf16FixtureObj[m].match_venue = entry.comp_address.venue.nama;
										
													if(moment(roundOf16DateArr[roundOf16Index]).format('dddd') === 'Monday'){
														$scope.roundOf16FixtureObj[m].match_referee = $scope.avMonRef[timeIndex][refereeIndex].username;
														$scope.roundOf16FixtureObj[m].match_analyst = $scope.avMonAnalysts[timeIndex][analystIndex].username;
													}else if(moment(roundOf16DateArr[roundOf16Index]).format('dddd') === 'Tuesday'){
														$scope.roundOf16FixtureObj[m].match_referee = $scope.avTueRef[timeIndex][refereeIndex].username;
														$scope.roundOf16FixtureObj[m].match_analyst = $scope.avTueAnalysts[timeIndex][analystIndex].username;
													}else if(moment(roundOf16DateArr[roundOf16Index]).format('dddd') === 'Wednesday'){
														$scope.roundOf16FixtureObj[m].match_referee = $scope.avWedRef[timeIndex][refereeIndex].username;
														$scope.roundOf16FixtureObj[m].match_analyst = $scope.avWedAnalysts[timeIndex][analystIndex].username;
													}else if(moment(roundOf16DateArr[roundOf16Index]).format('dddd') === 'Thursday'){
														$scope.roundOf16FixtureObj[m].match_referee = $scope.avThuRef[timeIndex][refereeIndex].username;
														$scope.roundOf16FixtureObj[m].match_analyst = $scope.avThuAnalysts[timeIndex][analystIndex].username;
													}else if(moment(roundOf16DateArr[roundOf16Index]).format('dddd') === 'Friday'){
														$scope.roundOf16FixtureObj[m].match_referee = $scope.avFriRef[timeIndex][refereeIndex].username;
														$scope.roundOf16FixtureObj[m].match_analyst = $scope.avFriAnalysts[timeIndex][analystIndex].username;
													}else if(moment(roundOf16DateArr[roundOf16Index]).format('dddd') === 'Saturday'){
														$scope.roundOf16FixtureObj[m].match_referee = $scope.avSatRef[timeIndex][refereeIndex].username;
														$scope.roundOf16FixtureObj[m].match_analyst = $scope.avSatAnalysts[timeIndex][analystIndex].username;
													}else if(moment(roundOf16DateArr[roundOf16Index]).format('dddd') === 'Sunday'){
														$scope.roundOf16FixtureObj[m].match_referee = $scope.avSunRef[timeIndex][refereeIndex].username;
														$scope.roundOf16FixtureObj[m].match_analyst = $scope.avSunAnalysts[timeIndex][analystIndex].username;
													}
												
													refereeIndex++;
													analystIndex++;
													timeIndex = timeIndex + 2;
													pairStatusIndex++;
													if((m+1) % 2 === 0){
														pairStatusIndex = 0;
													}
													if((m+1) % 4 === 0){
														roundOf16Index++;
														timeIndex = 0;
													}
													if(m % 2 !== 0){
														pair++;
													}
												}
												console.log($scope.roundOf16FixtureObj);
											},6000);
										}

										// quarter final
										var pair = 1;
										var pairStatusArr = ["home","away"];
										var pairStatusIndex = 0;
										var quarterFinalIndex = 0;
										if(entry.comp_numOfTeam !== 8){
											setTimeout(function(){
												refereeIndex = 0;
												analystIndex = 0;
												timeIndex = 0;
												for(var m = 0; m < 4; m++){
													$scope.quarterFinalFixtureObj[m] = {};
													$scope.quarterFinalFixtureObj[m].match_homeTeamObj = {};
													$scope.quarterFinalFixtureObj[m].match_homeTeamObj.team_name = '';
													$scope.quarterFinalFixtureObj[m].match_homeTeamObj.score = 0;
													$scope.quarterFinalFixtureObj[m].match_homeTeamObj.formation = '';
													$scope.quarterFinalFixtureObj[m].match_homeTeamObj.lineup = '';
													$scope.quarterFinalFixtureObj[m].match_homeTeamObj.lastLineup = '';
													$scope.quarterFinalFixtureObj[m].match_homeTeamObj.sub = '';
													$scope.quarterFinalFixtureObj[m].match_homeTeamObj.lastSub = '';
													$scope.quarterFinalFixtureObj[m].match_homeTeamObj.player = '';

													$scope.quarterFinalFixtureObj[m].match_awayTeamObj = {};
													$scope.quarterFinalFixtureObj[m].match_awayTeamObj.team_name = '';
													$scope.quarterFinalFixtureObj[m].match_awayTeamObj.score = 0;
													$scope.quarterFinalFixtureObj[m].match_awayTeamObj.formation = '';
													$scope.quarterFinalFixtureObj[m].match_awayTeamObj.lineup = '';
													$scope.quarterFinalFixtureObj[m].match_awayTeamObj.lastLineup = '';
													$scope.quarterFinalFixtureObj[m].match_awayTeamObj.sub = '';
													$scope.quarterFinalFixtureObj[m].match_awayTeamObj.lastSub = '';
													$scope.quarterFinalFixtureObj[m].match_awayTeamObj.player = '';

													$scope.quarterFinalFixtureObj[m].id = "MA" + $rootScope.randomString + 16 + m;
													$scope.quarterFinalFixtureObj[m].match_homeTeam = "";
													$scope.quarterFinalFixtureObj[m].match_awayTeam = "";
													$scope.quarterFinalFixtureObj[m].match_pair = pair;
													$scope.quarterFinalFixtureObj[m].pair_status = pairStatusArr[pairStatusIndex];
													$scope.quarterFinalFixtureObj[m].last_pair = m+1;
													$scope.quarterFinalFixtureObj[m].match_date = moment(quarterFinalDateArr[quarterFinalIndex]).toISOString();
													$scope.quarterFinalFixtureObj[m].match_time = timeArr[timeIndex];
													$scope.quarterFinalFixtureObj[m].match_fixture = "quarter final";
													$scope.quarterFinalFixtureObj[m].match_field = 1;
													$scope.quarterFinalFixtureObj[m].match_started = "";
													$scope.quarterFinalFixtureObj[m].competition_id = entry.id;
													$scope.quarterFinalFixtureObj[m].match_venue = entry.comp_address.venue.nama;
										
													if(moment(quarterFinalDateArr[quarterFinalIndex]).format('dddd') === 'Monday'){
														$scope.quarterFinalFixtureObj[m].match_referee = $scope.avMonRef[timeIndex][refereeIndex].username;
														$scope.quarterFinalFixtureObj[m].match_analyst = $scope.avMonAnalysts[timeIndex][analystIndex].username;
													}else if(moment(quarterFinalDateArr[quarterFinalIndex]).format('dddd') === 'Tuesday'){
														$scope.quarterFinalFixtureObj[m].match_referee = $scope.avTueRef[timeIndex][refereeIndex].username;
														$scope.quarterFinalFixtureObj[m].match_analyst = $scope.avTueAnalysts[timeIndex][analystIndex].username;
													}else if(moment(quarterFinalDateArr[quarterFinalIndex]).format('dddd') === 'Wednesday'){
														$scope.quarterFinalFixtureObj[m].match_referee = $scope.avWedRef[timeIndex][refereeIndex].username;
														$scope.quarterFinalFixtureObj[m].match_analyst = $scope.avWedAnalysts[timeIndex][analystIndex].username;
													}else if(moment(quarterFinalDateArr[quarterFinalIndex]).format('dddd') === 'Thursday'){
														$scope.quarterFinalFixtureObj[m].match_referee = $scope.avThuRef[timeIndex][refereeIndex].username;
														$scope.quarterFinalFixtureObj[m].match_analyst = $scope.avThuAnalysts[timeIndex][analystIndex].username;
													}else if(moment(quarterFinalDateArr[quarterFinalIndex]).format('dddd') === 'Friday'){
														$scope.quarterFinalFixtureObj[m].match_referee = $scope.avFriRef[timeIndex][refereeIndex].username;
														$scope.quarterFinalFixtureObj[m].match_analyst = $scope.avFriAnalysts[timeIndex][analystIndex].username;
													}else if(moment(quarterFinalDateArr[quarterFinalIndex]).format('dddd') === 'Saturday'){
														$scope.quarterFinalFixtureObj[m].match_referee = $scope.avSatRef[timeIndex][refereeIndex].username;
														$scope.quarterFinalFixtureObj[m].match_analyst = $scope.avSatAnalysts[timeIndex][analystIndex].username;
													}else if(moment(quarterFinalDateArr[quarterFinalIndex]).format('dddd') === 'Sunday'){
														$scope.quarterFinalFixtureObj[m].match_referee = $scope.avSunRef[timeIndex][refereeIndex].username;
														$scope.quarterFinalFixtureObj[m].match_analyst = $scope.avSunAnalysts[timeIndex][analystIndex].username;
													}

													refereeIndex++;
													analystIndex++;
													pairStatusIndex++;
													if((m+1) % 2 === 0){
														pairStatusIndex = 0;
													}

													if(entry.comp_numOfTeam === 16){
														$scope.quarterFinalFixtureObj[m].match_time = timeArr[0];
													}
																										
													if(entry.comp_numOfTeam === 16){
														quarterFinalIndex++;	
													}
													
													if(m % 2 !== 0){
														pair++;
													}
													if(entry.comp_numOfTeam === 32){
														timeIndex = timeIndex + 2;
														if((m+1) % 2 === 0){
															quarterFinalIndex++;
															timeIndex = 0;
														}
													}
												}
												console.log($scope.quarterFinalFixtureObj);			
											},6000);
										}

										// semi final
										setTimeout(function(){
											var semiFinalIndex = 0;
											refereeIndex = 0;
											analystIndex = 0;
											var pairStatusArr = ["home","away"];
											var pairStatusIndex = 0;
											for(var m = 0; m < 2; m++){
												$scope.semiFinalFixtureObj[m] = {};
												$scope.semiFinalFixtureObj[m].match_homeTeamObj = {};
												$scope.semiFinalFixtureObj[m].match_homeTeamObj.team_name = '';
												$scope.semiFinalFixtureObj[m].match_homeTeamObj.score = 0;
												$scope.semiFinalFixtureObj[m].match_homeTeamObj.formation = '';
												$scope.semiFinalFixtureObj[m].match_homeTeamObj.lineup = '';
												$scope.semiFinalFixtureObj[m].match_homeTeamObj.lastLineup = '';
												$scope.semiFinalFixtureObj[m].match_homeTeamObj.sub = '';
												$scope.semiFinalFixtureObj[m].match_homeTeamObj.lastSub = '';
												$scope.semiFinalFixtureObj[m].match_homeTeamObj.player = '';

												$scope.semiFinalFixtureObj[m].match_awayTeamObj = {};
												$scope.semiFinalFixtureObj[m].match_awayTeamObj.team_name = '';
												$scope.semiFinalFixtureObj[m].match_awayTeamObj.score = 0;
												$scope.semiFinalFixtureObj[m].match_awayTeamObj.formation = '';
												$scope.semiFinalFixtureObj[m].match_awayTeamObj.lineup = '';
												$scope.semiFinalFixtureObj[m].match_awayTeamObj.lastLineup = '';
												$scope.semiFinalFixtureObj[m].match_awayTeamObj.sub = '';
												$scope.semiFinalFixtureObj[m].match_awayTeamObj.lastSub = '';
												$scope.semiFinalFixtureObj[m].match_awayTeamObj.player = '';

												$scope.semiFinalFixtureObj[m].id = "MA" + $rootScope.randomString + 16 + m;
												$scope.semiFinalFixtureObj[m].match_homeTeam = "";
												$scope.semiFinalFixtureObj[m].match_awayTeam = "";
												$scope.semiFinalFixtureObj[m].match_pair = 1;
												$scope.semiFinalFixtureObj[m].pair_status = pairStatusArr[pairStatusIndex];
												$scope.semiFinalFixtureObj[m].last_pair = m+1;
												$scope.semiFinalFixtureObj[m].match_date = moment(semiFinalDateArr[semiFinalIndex]).toISOString();
												$scope.semiFinalFixtureObj[m].match_time = timeArr[1];
												$scope.semiFinalFixtureObj[m].match_fixture = "semi final";
												$scope.semiFinalFixtureObj[m].match_field = 1;
												$scope.semiFinalFixtureObj[m].match_started = "";
												$scope.semiFinalFixtureObj[m].competition_id = entry.id;
												$scope.semiFinalFixtureObj[m].match_venue = entry.comp_address.venue.nama;
									
												if(moment(semiFinalDateArr[semiFinalIndex]).format('dddd') === 'Monday'){
													$scope.semiFinalFixtureObj[m].match_referee = $scope.avMonRef[timeIndex][refereeIndex].username;
													$scope.semiFinalFixtureObj[m].match_analyst = $scope.avMonAnalysts[timeIndex][analystIndex].username;
												}else if(moment(semiFinalDateArr[semiFinalIndex]).format('dddd') === 'Tuesday'){
													$scope.semiFinalFixtureObj[m].match_referee = $scope.avTueRef[timeIndex][refereeIndex].username;
													$scope.semiFinalFixtureObj[m].match_analyst = $scope.avTueAnalysts[timeIndex][analystIndex].username;
												}else if(moment(semiFinalDateArr[semiFinalIndex]).format('dddd') === 'Wednesday'){
													$scope.semiFinalFixtureObj[m].match_referee = $scope.avWedRef[timeIndex][refereeIndex].username;
													$scope.semiFinalFixtureObj[m].match_analyst = $scope.avWedAnalysts[timeIndex][analystIndex].username;
												}else if(moment(semiFinalDateArr[semiFinalIndex]).format('dddd') === 'Thursday'){
													$scope.semiFinalFixtureObj[m].match_referee = $scope.avThuRef[timeIndex][refereeIndex].username;
													$scope.semiFinalFixtureObj[m].match_analyst = $scope.avThuAnalysts[timeIndex][analystIndex].username;
												}else if(moment(semiFinalDateArr[semiFinalIndex]).format('dddd') === 'Friday'){
													$scope.semiFinalFixtureObj[m].match_referee = $scope.avFriRef[timeIndex][refereeIndex].username;
													$scope.semiFinalFixtureObj[m].match_analyst = $scope.avFriAnalysts[timeIndex][analystIndex].username;
												}else if(moment(semiFinalDateArr[semiFinalIndex]).format('dddd') === 'Saturday'){
													$scope.semiFinalFixtureObj[m].match_referee = $scope.avSatRef[timeIndex][refereeIndex].username;
													$scope.semiFinalFixtureObj[m].match_analyst = $scope.avSatAnalysts[timeIndex][analystIndex].username;
												}else if(moment(semiFinalDateArr[semiFinalIndex]).format('dddd') === 'Sunday'){
													$scope.semiFinalFixtureObj[m].match_referee = $scope.avSunRef[timeIndex][refereeIndex].username;
													$scope.semiFinalFixtureObj[m].match_analyst = $scope.avSunAnalysts[timeIndex][analystIndex].username;
												}
											
												refereeIndex++;
												analystIndex++;
												semiFinalIndex++;
												pairStatusIndex++;
												if((m+1) % 2 === 0){
													pairStatusIndex = 0;
												}
											}
											console.log($scope.semiFinalFixtureObj);			
										},6000);
									
										// final
										setTimeout(function(){
											refereeIndex = 0;
											analystIndex = 0;
											$scope.finalFixtureObj = {};
											$scope.finalFixtureObj.match_homeTeamObj = {};
											$scope.finalFixtureObj.match_homeTeamObj.team_name = '';
											$scope.finalFixtureObj.match_homeTeamObj.score = 0;
											$scope.finalFixtureObj.match_homeTeamObj.formation = '';
											$scope.finalFixtureObj.match_homeTeamObj.lineup = '';
											$scope.finalFixtureObj.match_homeTeamObj.lastLineup = '';
											$scope.finalFixtureObj.match_homeTeamObj.sub = '';
											$scope.finalFixtureObj.match_homeTeamObj.lastSub = '';
											$scope.finalFixtureObj.match_homeTeamObj.player = '';

											$scope.finalFixtureObj.match_awayTeamObj = {};
											$scope.finalFixtureObj.match_awayTeamObj.team_name = '';
											$scope.finalFixtureObj.match_awayTeamObj.score = 0;
											$scope.finalFixtureObj.match_awayTeamObj.formation = '';
											$scope.finalFixtureObj.match_awayTeamObj.lineup = '';
											$scope.finalFixtureObj.match_awayTeamObj.lastLineup = '';
											$scope.finalFixtureObj.match_awayTeamObj.sub = '';
											$scope.finalFixtureObj.match_awayTeamObj.lastSub = '';
											$scope.finalFixtureObj.match_awayTeamObj.player = '';

											$scope.finalFixtureObj.id = "MA" + $rootScope.randomString;
											$scope.finalFixtureObj.match_homeTeam = "";
											$scope.finalFixtureObj.match_awayTeam = "";
											$scope.finalFixtureObj.match_pair = 1;
											$scope.finalFixtureObj.match_date = moment(finalDate).toISOString();
											$scope.finalFixtureObj.match_time = timeArr[1];
											$scope.finalFixtureObj.match_fixture = "final";
											$scope.finalFixtureObj.match_field = 1;
											$scope.finalFixtureObj.match_started = "";
											$scope.finalFixtureObj.competition_id = entry.id;
											$scope.finalFixtureObj.match_venue = entry.comp_address.venue.nama;
								
											if(moment(finalDate).format('dddd') === 'Monday'){
												$scope.finalFixtureObj.match_referee = $scope.avMonRef[timeIndex][refereeIndex].username;
												$scope.finalFixtureObj.match_analyst = $scope.avMonAnalysts[timeIndex][analystIndex].username;
											}else if(moment(finalDate).format('dddd') === 'Tuesday'){
												$scope.finalFixtureObj.match_referee = $scope.avTueRef[timeIndex][refereeIndex].username;
												$scope.finalFixtureObj.match_analyst = $scope.avTueAnalysts[timeIndex][analystIndex].username;
											}else if(moment(finalDate).format('dddd') === 'Wednesday'){
												$scope.finalFixtureObj.match_referee = $scope.avWedRef[timeIndex][refereeIndex].username;
												$scope.finalFixtureObj.match_analyst = $scope.avWedAnalysts[timeIndex][analystIndex].username;
											}else if(moment(finalDate).format('dddd') === 'Thursday'){
												$scope.finalFixtureObj.match_referee = $scope.avThuRef[timeIndex][refereeIndex].username;
												$scope.finalFixtureObj.match_analyst = $scope.avThuAnalysts[timeIndex][analystIndex].username;
											}else if(moment(finalDate).format('dddd') === 'Friday'){
												$scope.finalFixtureObj.match_referee = $scope.avFriRef[timeIndex][refereeIndex].username;
												$scope.finalFixtureObj.match_analyst = $scope.avFriAnalysts[timeIndex][analystIndex].username;
											}else if(moment(finalDate).format('dddd') === 'Saturday'){
												$scope.finalFixtureObj.match_referee = $scope.avSatRef[timeIndex][refereeIndex].username;
												$scope.finalFixtureObj.match_analyst = $scope.avSatAnalysts[timeIndex][analystIndex].username;
											}else if(moment(finalDate).format('dddd') === 'Sunday'){
												$scope.finalFixtureObj.match_referee = $scope.avSunRef[timeIndex][refereeIndex].username;
												$scope.finalFixtureObj.match_analyst = $scope.avSunAnalysts[timeIndex][analystIndex].username;
											}
											console.log($scope.finalFixtureObj);										
										},6000);
									// }
								}
								
								// localStorage.setItem("knockoutSchedulingStat", "Completed");
								
								// var savedMatchesPlayOff = [];
								// var savedMatchesRoundOf16 = [];
								// var savedMatchesQuarterFinal = [];
								// var savedMatchesSemiFinal = [];
								// var savedMatchesThirdPlace = [];
								// var savedMatchesFinal = [];

								// localStorage.setItem("playOffMatchesStatus", "On Progress");
								// localStorage.setItem("roundOf16MatchesStatus", "On Progress");
								// localStorage.setItem("quarterFinalMatchesStatus", "On Progress");
								// localStorage.setItem("semiFinalMatchesStatus", "On Progress");
								// localStorage.setItem("thirdPlaceMatchesStatus", "On Progress");
								// localStorage.setItem("finalMatchesStatus", "On Progress");

								// check if the schedule status is on queue
								if(entry.schedule_status === 'On Queue'){

									//	if true save the data to database
									console.log("save data to database");

									setTimeout(function(){
										console.log($scope.playOffFixtureObj);
									
										var timeoutTime = 1000;

										$scope.playOffFixtureObj.forEach(function(entry){
											addMatchDelay(entry,timeoutTime);										
											timeoutTime += 10;
										});

										// 	set timer to addMatch function to minimize the number of request per second to prevent failed request
										function addMatchDelay(entry,timeoutTime){
											setTimeout(function(){
												//insert data to database
												console.log("blm ad");
												MatchService.addMatch(entry).success(function(data){
													console.log("add match");
													console.log(data);
												}).error(function(data){
													$ionicLoading.hide();
												});
												//insert data to database
											},timeoutTime);
										}

										if(entry.comp_numOfTeam === 32){
											var timeoutTime = 1000;
											$scope.roundOf16FixtureObj.forEach(function(entry){
												addMatchDelay(entry,timeoutTime);
												timeoutTime += 10;
											});

											//	set timer to addMatch function to minimize the number of request per second to prevent failed request
											function addMatchDelay(entry,timeoutTime){
												setTimeout(function(){
													//insert data to database
													console.log("blm ad");
													MatchService.addMatch(entry).success(function(data){
														console.log("add match");
														console.log(data);
													}).error(function(data){
														$ionicLoading.hide();
													});
													//insert data to database
												},timeoutTime);
											}
										}

										if(entry.comp_numOfTeam !== 8){
											var timeoutTime = 1000;
											$scope.quarterFinalFixtureObj.forEach(function(entry){
												addMatchDelay(entry,timeoutTime);
												timeoutTime += 10;
											});

											//	set timer to addMatch function to minimize the number of request per second to prevent failed request
											function addMatchDelay(entry,timeoutTime){
												setTimeout(function(){
													//insert data to database
													console.log("blm ad");
													MatchService.addMatch(entry).success(function(data){
														console.log("add match");
														console.log(data);
													}).error(function(data){
														$ionicLoading.hide();
													});
													//insert data to database
												},timeoutTime);
											}
										}

										$scope.semiFinalFixtureObj.forEach(function(entry){
											addMatchDelay(entry,timeoutTime);
											timeoutTime += 10;
										});

										// set timer to addMatch function to minimize the number of request per second to prevent failed request
										function addMatchDelay(entry,timeoutTime){
											setTimeout(function(){
												//insert data to database
												console.log("blm ad");
												MatchService.addMatch(entry).success(function(data){
													console.log("add match");
													console.log(data);
												}).error(function(data){
													$ionicLoading.hide();
												});
												//insert data to database
											},timeoutTime);
										}							
										
										addMatchDelay($scope.finalFixtureObj,timeoutTime);
										timeoutTime += 10;
									
										//	set timer to addMatch function to minimize the number of request per second to prevent failed request
										function addMatchDelay(entry,timeoutTime){
											setTimeout(function(){
												//insert data to database
												console.log("blm ad");
												MatchService.addMatch(entry).success(function(data){
													console.log("add match");
													console.log(data);
												}).error(function(data){
													$ionicLoading.hide();
												});
												//insert data to database
											},timeoutTime);
										}			

									},15000);
								}

								// another timer to change the schedule status to on progress
								// if didn't change the status than it will save the data endlessly
								setTimeout(function(){
									if(entry.schedule_status === 'On Queue'){
										console.log("change schedule status to on progress");
										$scope.formCompetition = {};
										// schedule status (on queue, on progress, completed)
										// on queue (team just registered)
										// on progress (competition already has full team, auto scheduling completed)
										// completed (match date and referee has been selected)
										$scope.formCompetition.schedule_status = "On Progress";
										
										CompetitionService.editCompetition(entry.id, localStorage.getItem("token"), $scope.formCompetition).success(function(data) {
											// $ionicLoading.hide();
											console.log("berhasil");
											$scope.loadCompetition = setInterval($scope.getCompetitionByOrganizer, 3000);	
										}).error(function(data) {
											// $ionicLoading.hide();
											console.log("gagal");
										});
									}
								},20000);
								
							// Combination System	
							}else{
								console.log("Combination");
								$scope.groups = $scope.registerArr.length / 4;

								// Shuffling array function
								Array.prototype.shuffle = function() {
								    var input = this;
								     
								    for (var i = input.length-1; i >=0; i--) {
								     
								        var randomIndex = Math.floor(Math.random()*(i+1)); 
								        var itemAtIndex = input[randomIndex]; 
								         
								        input[randomIndex] = input[i]; 
								        input[i] = itemAtIndex;
								    }
								    return input;
								};
								// Shuffling array function


								// Shuffling the teams
								$scope.registerArr.shuffle();
								console.log($scope.registerArr);

								$scope.matchesArr = [];
								$scope.matchArr = [];
								$scope.teamsArr = [];
								console.log("Number of groups: " + $scope.groups);


								for(var i = 1; i <= $scope.groups; i++){

								    for(var j = 1; j <= 4; j++){
								        $scope.matchArr[j] = {
								            "team" : "", 
								            "group" : ""
								        };
								    }    
								   
								    // ASCII code for uppercase A is 65
								    var chr = String.fromCharCode(65 + (i-1)); // where n is 0, 1, 2 ...

								    $scope.matchArr[1].team = $scope.registerArr[0];
								    $scope.matchArr[1].group = chr;
								    $scope.matchArr[2].team = $scope.registerArr[1];
								    $scope.matchArr[2].group = chr;
								    $scope.matchArr[3].team = $scope.registerArr[2];
								    $scope.matchArr[3].group = chr;
								    $scope.matchArr[4].team = $scope.registerArr[3];
								    $scope.matchArr[4].group = chr;
								    
								    $scope.matchesArr.push($scope.matchArr[1]);
								    $scope.matchesArr.push($scope.matchArr[2]);
								    $scope.matchesArr.push($scope.matchArr[3]);
								    $scope.matchesArr.push($scope.matchArr[4]);
								    
								    $scope.registerArr.splice(0, 4);

								    $scope.teamsArr[i] = [];
								}


								$scope.matchesArr.forEach(function(item){
								    if(item.group == "A"){
								        // console.log("A");
								        $scope.teamsArr[1].push(item.team);
								    }else if(item.group == "B"){
								        // console.log("B");
								        $scope.teamsArr[2].push(item.team);
								    }else if(item.group == "C"){
								        // console.log("C");
								        $scope.teamsArr[3].push(item.team);
								    }else if(item.group == "D"){
								        // console.log("D");
								        $scope.teamsArr[4].push(item.team);
								    }else if(item.group == "E"){
								        // console.log("E");
								        $scope.teamsArr[5].push(item.team);
								    }else if(item.group == "F"){
								        // console.log("F");
								        $scope.teamsArr[6].push(item.team);
								    }else if(item.group == "G"){
								        // console.log("G");
								        $scope.teamsArr[7].push(item.team);
								    }else if(item.group == "H"){
								        // console.log("H");
								        $scope.teamsArr[8].push(item.team);
								    }
								});

								$scope.classementArr = [];
								$scope.matchesGroupA = {group: 'A', matches: []};
								$scope.matchesGroupB = {group: 'B', matches: []};
								$scope.matchesGroupC = {group: 'C', matches: []};
								$scope.matchesGroupD = {group: 'D', matches: []};
								$scope.matchesGroupE = {group: 'E', matches: []};
								$scope.matchesGroupF = {group: 'F', matches: []};
								$scope.matchesGroupG = {group: 'G', matches: []};
								$scope.matchesGroupH = {group: 'H', matches: []};

								for(var j = 1; j <= $scope.groups; j++){
								    console.log(String.fromCharCode(65 + (j-1)));
								    console.log($scope.teamsArr[j]);

								    // Create competition classement
									$scope.teamsArr[j].forEach(function(team, index){

										$scope.classementForm = {};
										$scope.classementForm.id = "Cl" + $rootScope.randomString + j + index;
										$scope.classementForm.position = index + 1;
										$scope.classementForm.play = 0;
										$scope.classementForm.win = 0;
										$scope.classementForm.draw = 0;
										$scope.classementForm.lose = 0;
										$scope.classementForm.goalDifference = 0;
										$scope.classementForm.points = 0;
										$scope.classementForm.status = "";
										$scope.classementForm.competition_id = entry.id;
										$scope.classementForm.team = team;
										$scope.classementForm.group = String.fromCharCode(65 + (j-1));
										
										$scope.classementArr.push($scope.classementForm);
									});

									$scope.savedClassementArr = [];
									localStorage.setItem("classementStatus", 'On Progress');
									if(entry.classement_status === null || entry.classement_status === ''){
										
											setTimeout(function(){
												$scope.classementArr.forEach(function(classement){
													if(localStorage.getItem("classementStatus") === 'On Progress'){
														// console.log($scope.savedClassementArr);
														// console.log(classement.id);
														if($scope.savedClassementArr.indexOf(classement.id) === -1){
															addClassementDelay(classement);
															$scope.savedClassementArr.push(classement.id);
														}else{
															console.log("sudah ad");
															localStorage.setItem("classementStatus", 'Completed');
														}
													}
												});

												function addClassementDelay(classement){
													setTimeout(function(){
														//insert data to database
														console.log("blm ad");													
															ClassementService.addClassement(classement).success(function(data){
																// $ionicLoading.hide();
																console.log("create classement");
																// console.log(data);
																$scope.savedClassementArr.push(classement.id);
															}).error(function(data){
																// $ionicLoading.hide();
															});
														//insert data to database
													},4000);
												}
											},10000);
										
									}

									if(entry.classement_status === null || entry.classement_status === ''){
										setTimeout(function(){
											console.log("change classement status to completed");
												$scope.formCompetition = {};
											
												$scope.formCompetition.classement_status = "Completed";
												
												CompetitionService.editCompetition(entry.id, localStorage.getItem("token"), $scope.formCompetition).success(function(data) {
													// $ionicLoading.hide();
													console.log("berhasil");
												}).error(function(data) {
													// $ionicLoading.hide();
													console.log("gagal");
												});
										},30000);
									}
									// Create competition classement


								    var newTeams = [];
								    var fixNum = "";
								    var teamsLength = $scope.teamsArr[j].length - 1;

								    for(var a = 1; a < $scope.teamsArr[j].length; a++){
								    	newTeams.push($scope.teamsArr[j][a]);
								    }

								    for(var c = $scope.teamsArr[j].length; c <= $scope.teamsArr[j].length; c++){
								    	fixNum = $scope.teamsArr[j][c-$scope.teamsArr[j].length];
								    }

								    var match = [];
								    // var matches = [];
								    var all = [];
								    var matchPerDay = $scope.teamsArr[j].length / 2;
								    // console.log(teamA.length);
								    for(var round = 0; round < teamsLength; round++){
									    for(var i = 0; i < matchPerDay; i++){
									        var team1 = $scope.teamsArr[j][matchPerDay - i - 1];
									        var team2 = $scope.teamsArr[j][matchPerDay + i];
									        match.push(team1);
									        match.push(team2);
									    }
								        // $scope.matches.push(match);
								        if(j === 1){
								        	console.log("Group A matches");
								        	$scope.matchesGroupA.matches.push(match);
								        }else if(j === 2){
								        	console.log("Group B matches");
								        	$scope.matchesGroupB.matches.push(match);
								        }else if(j === 3){
								        	console.log("Group C matches");
								        	$scope.matchesGroupC.matches.push(match);
								        }else if(j === 4){
								        	console.log("Group D matches");
								        	$scope.matchesGroupD.matches.push(match);
								        }else if(j === 5){
								        	console.log("Group E matches");
								        	$scope.matchesGroupE.matches.push(match);
								        }else if(j === 6){
								        	console.log("Group F matches");
								        	$scope.matchesGroupF.matches.push(match);
								        }else if(j === 7){
								        	console.log("Group G matches");
								        	$scope.matchesGroupG.matches.push(match);
								        }else if(j === 8){
								        	console.log("Group H matches");
								        	$scope.matchesGroupH.matches.push(match);
								        }
								        //rotate array
								        $scope.teamsArr[j] = arrayRotateEven(newTeams, true);
								        match = [];
								        var fixture = round + 1;
								        // console.log("Round " + fixture + " : " + $scope.matches[round]);
								    }
								}
								console.log($scope.classementArr);
								console.log($scope.matchesGroupA.matches);
								console.log($scope.matchesGroupB.matches);

								$scope.firstRoundMatches = {group: [],matches: []};
								$scope.firstRoundHomeTeam = [];
								$scope.firstRoundAwayTeam = [];
								$scope.firstRoundFixtureObj = [];

								$scope.secondRoundMatches = {group: [],matches: []};
								$scope.secondRoundHomeTeam = [];
								$scope.secondRoundAwayTeam = [];
								$scope.secondRoundFixtureObj = [];

								$scope.thirdRoundMatches = {group: [],matches: []};
								$scope.thirdRoundHomeTeam = [];
								$scope.thirdRoundAwayTeam = [];
								$scope.thirdRoundFixtureObj = [];

								if(entry.comp_numOfTeam === 32){
									$scope.roundOf16FixtureObj = [];
								}
								if(entry.comp_numOfTeam !== 8){
									$scope.quarterFinalFixtureObj = [];
								}
								$scope.semiFinalFixtureObj = [];


								// First Round Matches
								if($scope.matchesGroupA.matches.length !== 0){
									$scope.firstRoundMatches.group.push('A'); 
									$scope.firstRoundMatches.matches.push($scope.matchesGroupA.matches[0]);
								}
								if($scope.matchesGroupB.matches.length !== 0){
									$scope.firstRoundMatches.group.push('B');
									$scope.firstRoundMatches.matches.push($scope.matchesGroupB.matches[0]);
								}
								if($scope.matchesGroupC.matches.length !== 0){
									$scope.firstRoundMatches.group.push('C');
									$scope.firstRoundMatches.matches.push($scope.matchesGroupC.matches[0]);
								}
								if($scope.matchesGroupD.matches.length !== 0){
									$scope.firstRoundMatches.group.push('D');
									$scope.firstRoundMatches.matches.push($scope.matchesGroupD.matches[0]);
								}
								if($scope.matchesGroupE.matches.length !== 0){
									$scope.firstRoundMatches.group.push('E');
									$scope.firstRoundMatches.matches.push($scope.matchesGroupE.matches[0]);
								}
								if($scope.matchesGroupF.matches.length !== 0){
									$scope.firstRoundMatches.group.push('F');
									$scope.firstRoundMatches.matches.push($scope.matchesGroupF.matches[0]);
								}
								if($scope.matchesGroupG.matches.length !== 0){
									$scope.firstRoundMatches.group.push('G');
									$scope.firstRoundMatches.matches.push($scope.matchesGroupG.matches[0]);
								}
								if($scope.matchesGroupH.matches.length !== 0){
									$scope.firstRoundMatches.group.push('H');
									$scope.firstRoundMatches.matches.push($scope.matchesGroupH.matches[0]);
								}

								// Second Round Matches
								if($scope.matchesGroupA.matches.length !== 0){
									$scope.secondRoundMatches.group.push('A'); 
									$scope.secondRoundMatches.matches.push($scope.matchesGroupA.matches[1]);
								}
								if($scope.matchesGroupB.matches.length !== 0){
									$scope.secondRoundMatches.group.push('B');
									$scope.secondRoundMatches.matches.push($scope.matchesGroupB.matches[1]);
								}
								if($scope.matchesGroupC.matches.length !== 0){
									$scope.secondRoundMatches.group.push('C');
									$scope.secondRoundMatches.matches.push($scope.matchesGroupC.matches[1]);
								}
								if($scope.matchesGroupD.matches.length !== 0){
									$scope.secondRoundMatches.group.push('D');
									$scope.secondRoundMatches.matches.push($scope.matchesGroupD.matches[1]);
								}
								if($scope.matchesGroupE.matches.length !== 0){
									$scope.secondRoundMatches.group.push('E');
									$scope.secondRoundMatches.matches.push($scope.matchesGroupE.matches[1]);
								}
								if($scope.matchesGroupF.matches.length !== 0){
									$scope.secondRoundMatches.group.push('F');
									$scope.secondRoundMatches.matches.push($scope.matchesGroupF.matches[1]);
								}
								if($scope.matchesGroupG.matches.length !== 0){
									$scope.secondRoundMatches.group.push('G');
									$scope.secondRoundMatches.matches.push($scope.matchesGroupG.matches[1]);
								}
								if($scope.matchesGroupH.matches.length !== 0){
									$scope.secondRoundMatches.group.push('H');
									$scope.secondRoundMatches.matches.push($scope.matchesGroupH.matches[1]);
								}

								// Third Round Matches 
								if($scope.matchesGroupA.matches.length !== 0){
									$scope.thirdRoundMatches.group.push('A'); 
									$scope.thirdRoundMatches.matches.push($scope.matchesGroupA.matches[2]);
								}
								if($scope.matchesGroupB.matches.length !== 0){
									$scope.thirdRoundMatches.group.push('B');
									$scope.thirdRoundMatches.matches.push($scope.matchesGroupB.matches[2]);
								}
								if($scope.matchesGroupC.matches.length !== 0){
									$scope.thirdRoundMatches.group.push('C');
									$scope.thirdRoundMatches.matches.push($scope.matchesGroupC.matches[2]);
								}
								if($scope.matchesGroupD.matches.length !== 0){
									$scope.thirdRoundMatches.group.push('D');
									$scope.thirdRoundMatches.matches.push($scope.matchesGroupD.matches[2]);
								}
								if($scope.matchesGroupE.matches.length !== 0){
									$scope.thirdRoundMatches.group.push('E');
									$scope.thirdRoundMatches.matches.push($scope.matchesGroupE.matches[2]);
								}
								if($scope.matchesGroupF.matches.length !== 0){
									$scope.thirdRoundMatches.group.push('F');
									$scope.thirdRoundMatches.matches.push($scope.matchesGroupF.matches[2]);
								}
								if($scope.matchesGroupG.matches.length !== 0){
									$scope.thirdRoundMatches.group.push('G');
									$scope.thirdRoundMatches.matches.push($scope.matchesGroupG.matches[2]);
								}
								if($scope.matchesGroupH.matches.length !== 0){
									$scope.thirdRoundMatches.group.push('H');
									$scope.thirdRoundMatches.matches.push($scope.matchesGroupH.matches[2]);
								}
							
								console.log($scope.firstRoundMatches);
								console.log($scope.secondRoundMatches);
								console.log($scope.thirdRoundMatches);
							
								$scope.firstRoundMatches.matches.forEach(function(match){
									for(var m = 0; m < match.length; m++){
										if(m % 2 === 0){
											$scope.firstRoundHomeTeam.push(match[m]);
										}else{
											$scope.firstRoundAwayTeam.push(match[m]);
										}
									}
								});

								$scope.secondRoundMatches.matches.forEach(function(match){
									for(var m = 0; m < match.length; m++){
										if(m % 2 === 0){
											$scope.secondRoundHomeTeam.push(match[m]);
										}else{
											$scope.secondRoundAwayTeam.push(match[m]);
										}
									}
								});

								$scope.thirdRoundMatches.matches.forEach(function(match){
									for(var m = 0; m < match.length; m++){
										if(m % 2 === 0){
											$scope.thirdRoundHomeTeam.push(match[m]);
										}else{
											$scope.thirdRoundAwayTeam.push(match[m]);
										}
									}
								});

								// Date Selection For All The Matches
								var startDate = moment(entry.comp_start);
								var endDate = moment(entry.comp_finish);
							
								//Difference in number of days
								var numOfDays = endDate.diff(startDate, 'days')+1;
								
								console.log(numOfDays);

							setTimeout(function(){

								// 21 Days
								if(numOfDays === 21){
									console.log("21");
									if(entry.comp_numOfTeam === 32){
										console.log("32");
										var fixture1Date = moment(new Date(entry.comp_start));
										var fixture2Date = moment(new Date(entry.comp_start)).add(2, 'days');
										var fixture3Date = moment(new Date(entry.comp_start)).add(4, 'days');
										var roundOf16Date1 = moment(new Date(entry.comp_start)).add(6, 'days');
										var roundOf16Date2 = moment(new Date(entry.comp_start)).add(7, 'days');
										var roundOf16Date3 = moment(new Date(entry.comp_start)).add(8, 'days');
										var roundOf16Date4 = moment(new Date(entry.comp_start)).add(9, 'days');
										var quarterFinalDate1 = moment(new Date(entry.comp_start)).add(11, 'days');
										var quarterFinalDate2 = moment(new Date(entry.comp_start)).add(12, 'days');
										var quarterFinalDate3 = moment(new Date(entry.comp_start)).add(13, 'days');
										var semiFinalDate1 = moment(new Date(entry.comp_start)).add(16, 'days');
										var semiFinalDate2 = moment(new Date(entry.comp_start)).add(17, 'days');
										var thirdPlaceDate = moment(new Date(entry.comp_start)).add(19, 'days');
										var finalDate = entry.comp_finish;

										console.log(moment(fixture1Date).toISOString());
										console.log(moment(fixture2Date).toISOString());
										console.log(moment(fixture3Date).toISOString());
										// get day based on date
										console.log(moment(fixture1Date).format('dddd')); 

										var firstRoundGroupIndex = 0;
										var secondRoundGroupIndex = 0;
										var thirdRoundGroupIndex = 0;
										var roundOf16Index = 0;
										var quarterFinalIndex = 0;
										var semiFinalIndex = 0;
										var roundOf16DateArr = [];
										var quarterFinalDateArr = [];
										var semiFinalDateArr = [];
										var timeArr = ["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00"];
										var fieldArr = [1,2,3];

										roundOf16DateArr.push(roundOf16Date1,roundOf16Date2,roundOf16Date3,roundOf16Date4);
										quarterFinalDateArr.push(quarterFinalDate1,quarterFinalDate2,quarterFinalDate3);
										semiFinalDateArr.push(semiFinalDate1,semiFinalDate2);

										// Fixture 1
										setTimeout(function(){
											var timeIndex = 0;
											var fieldIndex = 0;
											var refereeIndex = 0;
											var analystIndex = 0;

											for(t = 0; t < $scope.firstRoundHomeTeam.length; t++){
												$scope.firstRoundFixtureObj[t] = {};
												$scope.firstRoundFixtureObj[t].match_homeTeamObj = {};
												$scope.firstRoundFixtureObj[t].match_homeTeamObj.team_name = $scope.firstRoundHomeTeam[t];
												$scope.firstRoundFixtureObj[t].match_homeTeamObj.score = 0;
												$scope.firstRoundFixtureObj[t].match_homeTeamObj.formation = '';
												$scope.firstRoundFixtureObj[t].match_homeTeamObj.lineup = '';
												$scope.firstRoundFixtureObj[t].match_homeTeamObj.lastLineup = '';
												$scope.firstRoundFixtureObj[t].match_homeTeamObj.sub = '';
												$scope.firstRoundFixtureObj[t].match_homeTeamObj.lastSub = '';
												$scope.firstRoundFixtureObj[t].match_homeTeamObj.player = '';

												$scope.firstRoundFixtureObj[t].match_awayTeamObj = {};
												$scope.firstRoundFixtureObj[t].match_awayTeamObj.team_name = $scope.firstRoundAwayTeam[t];
												$scope.firstRoundFixtureObj[t].match_awayTeamObj.score = 0;
												$scope.firstRoundFixtureObj[t].match_awayTeamObj.formation = '';
												$scope.firstRoundFixtureObj[t].match_awayTeamObj.lineup = '';
												$scope.firstRoundFixtureObj[t].match_awayTeamObj.lastLineup = '';
												$scope.firstRoundFixtureObj[t].match_awayTeamObj.sub = '';
												$scope.firstRoundFixtureObj[t].match_awayTeamObj.lastSub = '';
												$scope.firstRoundFixtureObj[t].match_awayTeamObj.player = '';

												$scope.firstRoundFixtureObj[t].id = "MA" + $rootScope.randomString + 1 + firstRoundGroupIndex + t;
												$scope.firstRoundFixtureObj[t].match_homeTeam = $scope.firstRoundHomeTeam[t];
												$scope.firstRoundFixtureObj[t].match_awayTeam = $scope.firstRoundAwayTeam[t];
												$scope.firstRoundFixtureObj[t].match_group = $scope.firstRoundMatches.group[firstRoundGroupIndex];
												$scope.firstRoundFixtureObj[t].match_date = moment(fixture1Date).toISOString();
												$scope.firstRoundFixtureObj[t].match_time = timeArr[timeIndex];
												$scope.firstRoundFixtureObj[t].match_fixture = "fixture 1";
												$scope.firstRoundFixtureObj[t].match_field = fieldArr[fieldIndex];
												$scope.firstRoundFixtureObj[t].match_started = "";
												$scope.firstRoundFixtureObj[t].fixture_number = 1;
												$scope.firstRoundFixtureObj[t].competition_id = entry.id;
												$scope.firstRoundFixtureObj[t].match_venue = entry.comp_address.venue.nama;

									
												if(moment(fixture1Date).format('dddd') === 'Monday'){
													$scope.firstRoundFixtureObj[t].match_referee = $scope.avMonRef[timeIndex][refereeIndex].username;
													$scope.firstRoundFixtureObj[t].match_analyst = $scope.avMonAnalysts[timeIndex][analystIndex].username;
												}else if(moment(fixture1Date).format('dddd') === 'Tuesday'){
													$scope.firstRoundFixtureObj[t].match_referee = $scope.avTueRef[timeIndex][refereeIndex].username;
													$scope.firstRoundFixtureObj[t].match_analyst = $scope.avTueAnalysts[timeIndex][analystIndex].username;
												}else if(moment(fixture1Date).format('dddd') === 'Wednesday'){
													$scope.firstRoundFixtureObj[t].match_referee = $scope.avWedRef[timeIndex][refereeIndex].username;
													$scope.firstRoundFixtureObj[t].match_analyst = $scope.avWedAnalysts[timeIndex][analystIndex].username;
												}else if(moment(fixture1Date).format('dddd') === 'Thursday'){
													$scope.firstRoundFixtureObj[t].match_referee = $scope.avThuRef[timeIndex][refereeIndex].username;
													$scope.firstRoundFixtureObj[t].match_analyst = $scope.avThuAnalysts[timeIndex][analystIndex].username;
												}else if(moment(fixture1Date).format('dddd') === 'Friday'){
													$scope.firstRoundFixtureObj[t].match_referee = $scope.avFriRef[timeIndex][refereeIndex].username;
													$scope.firstRoundFixtureObj[t].match_analyst = $scope.avFriAnalysts[timeIndex][analystIndex].username;
												}else if(moment(fixture1Date).format('dddd') === 'Saturday'){
													$scope.firstRoundFixtureObj[t].match_referee = $scope.avSatRef[timeIndex][refereeIndex].username;
													$scope.firstRoundFixtureObj[t].match_analyst = $scope.avSatAnalysts[timeIndex][analystIndex].username;
												}else if(moment(fixture1Date).format('dddd') === 'Sunday'){
													$scope.firstRoundFixtureObj[t].match_referee = $scope.avSunRef[timeIndex][refereeIndex].username;
													$scope.firstRoundFixtureObj[t].match_analyst = $scope.avSunAnalysts[timeIndex][analystIndex].username;
												}

												refereeIndex++;
												analystIndex++;
												fieldIndex++;
												if(t % 2 != 0){
													firstRoundGroupIndex++;
												}
												if((t+1) % 3 == 0){
													timeIndex++;
													fieldIndex = 0;
												}
											}
											console.log($scope.firstRoundFixtureObj);
										},6000);

										// Fixture 2
										setTimeout(function(){
											timeIndex = 0;
											fieldIndex = 0;
											refereeIndex = 0;
											analystIndex = 0;

											for(t = 0; t < $scope.secondRoundHomeTeam.length; t++){
												$scope.secondRoundFixtureObj[t] = {};
												$scope.secondRoundFixtureObj[t].match_homeTeamObj = {};
												$scope.secondRoundFixtureObj[t].match_homeTeamObj.team_name = $scope.secondRoundHomeTeam[t];
												$scope.secondRoundFixtureObj[t].match_homeTeamObj.score = 0;
												$scope.secondRoundFixtureObj[t].match_homeTeamObj.formation = '';
												$scope.secondRoundFixtureObj[t].match_homeTeamObj.lineup = '';
												$scope.secondRoundFixtureObj[t].match_homeTeamObj.lastLineup = '';
												$scope.secondRoundFixtureObj[t].match_homeTeamObj.sub = '';
												$scope.secondRoundFixtureObj[t].match_homeTeamObj.lastSub = '';
												$scope.secondRoundFixtureObj[t].match_homeTeamObj.player = '';

												$scope.secondRoundFixtureObj[t].match_awayTeamObj = {};
												$scope.secondRoundFixtureObj[t].match_awayTeamObj.team_name = $scope.secondRoundAwayTeam[t];
												$scope.secondRoundFixtureObj[t].match_awayTeamObj.score = 0;
												$scope.secondRoundFixtureObj[t].match_awayTeamObj.formation = '';
												$scope.secondRoundFixtureObj[t].match_awayTeamObj.lineup = '';
												$scope.secondRoundFixtureObj[t].match_awayTeamObj.lastLineup = '';
												$scope.secondRoundFixtureObj[t].match_awayTeamObj.sub = '';
												$scope.secondRoundFixtureObj[t].match_awayTeamObj.lastSub = '';
												$scope.secondRoundFixtureObj[t].match_awayTeamObj.player = '';

												$scope.secondRoundFixtureObj[t].id = "MA" + $rootScope.randomString + 2 + secondRoundGroupIndex + t;
												$scope.secondRoundFixtureObj[t].match_homeTeam = $scope.secondRoundHomeTeam[t];
												$scope.secondRoundFixtureObj[t].match_awayTeam = $scope.secondRoundAwayTeam[t];
												$scope.secondRoundFixtureObj[t].match_group = $scope.secondRoundMatches.group[secondRoundGroupIndex];
												$scope.secondRoundFixtureObj[t].match_date = moment(fixture2Date).toISOString();
												$scope.secondRoundFixtureObj[t].match_time = timeArr[timeIndex];
												$scope.secondRoundFixtureObj[t].match_fixture = "fixture 2";
												$scope.secondRoundFixtureObj[t].match_field = fieldArr[fieldIndex];
												$scope.secondRoundFixtureObj[t].match_started = "";
												$scope.secondRoundFixtureObj[t].fixture_number = 2;
												$scope.secondRoundFixtureObj[t].competition_id = entry.id;
												$scope.secondRoundFixtureObj[t].match_venue = entry.comp_address.venue.nama;

									
												if(moment(fixture2Date).format('dddd') === 'Monday'){
													$scope.secondRoundFixtureObj[t].match_referee = $scope.avMonRef[timeIndex][refereeIndex].username;
													$scope.secondRoundFixtureObj[t].match_analyst = $scope.avMonAnalysts[timeIndex][analystIndex].username;
												}else if(moment(fixture2Date).format('dddd') === 'Tuesday'){
													$scope.secondRoundFixtureObj[t].match_referee = $scope.avTueRef[timeIndex][refereeIndex].username;
													$scope.secondRoundFixtureObj[t].match_analyst = $scope.avTueAnalysts[timeIndex][analystIndex].username;
												}else if(moment(fixture2Date).format('dddd') === 'Wednesday'){
													$scope.secondRoundFixtureObj[t].match_referee = $scope.avWedRef[timeIndex][refereeIndex].username;
													$scope.secondRoundFixtureObj[t].match_analyst = $scope.avWedAnalysts[timeIndex][analystIndex].username;
												}else if(moment(fixture2Date).format('dddd') === 'Thursday'){
													$scope.secondRoundFixtureObj[t].match_referee = $scope.avThuRef[timeIndex][refereeIndex].username;
													$scope.secondRoundFixtureObj[t].match_analyst = $scope.avThuAnalysts[timeIndex][analystIndex].username;
												}else if(moment(fixture2Date).format('dddd') === 'Friday'){
													$scope.secondRoundFixtureObj[t].match_referee = $scope.avFriRef[timeIndex][refereeIndex].username;
													$scope.secondRoundFixtureObj[t].match_analyst = $scope.avFriAnalysts[timeIndex][analystIndex].username;
												}else if(moment(fixture2Date).format('dddd') === 'Saturday'){
													$scope.secondRoundFixtureObj[t].match_referee = $scope.avSatRef[timeIndex][refereeIndex].username;
													$scope.secondRoundFixtureObj[t].match_analyst = $scope.avSatAnalysts[timeIndex][analystIndex].username;
												}else if(moment(fixture2Date).format('dddd') === 'Sunday'){
													$scope.secondRoundFixtureObj[t].match_referee = $scope.avSunRef[timeIndex][refereeIndex].username;
													$scope.secondRoundFixtureObj[t].match_analyst = $scope.avSunAnalysts[timeIndex][analystIndex].username;
												}
										
												refereeIndex++;
												analystIndex++;
												fieldIndex++;
												if(t % 2 != 0){
													secondRoundGroupIndex++;
												}
												if((t+1) % 3 == 0){
													timeIndex++;
													fieldIndex = 0;
												}
											}
											console.log($scope.secondRoundFixtureObj);
										},6000);
										
										// Fixture 3
										setTimeout(function(){
											timeIndex = 0;
											fieldIndex = 0;
											refereeIndex = 0;
											analystIndex = 0;

											for(t = 0; t < $scope.thirdRoundHomeTeam.length; t++){
												$scope.thirdRoundFixtureObj[t] = {};
												$scope.thirdRoundFixtureObj[t].match_homeTeamObj = {};
												$scope.thirdRoundFixtureObj[t].match_homeTeamObj.team_name = $scope.thirdRoundHomeTeam[t];
												$scope.thirdRoundFixtureObj[t].match_homeTeamObj.score = 0;
												$scope.thirdRoundFixtureObj[t].match_homeTeamObj.formation = '';
												$scope.thirdRoundFixtureObj[t].match_homeTeamObj.lineup = '';
												$scope.thirdRoundFixtureObj[t].match_homeTeamObj.lastLineup = '';
												$scope.thirdRoundFixtureObj[t].match_homeTeamObj.sub = '';
												$scope.thirdRoundFixtureObj[t].match_homeTeamObj.lastSub = '';
												$scope.thirdRoundFixtureObj[t].match_homeTeamObj.player = '';

												$scope.thirdRoundFixtureObj[t].match_awayTeamObj = {};
												$scope.thirdRoundFixtureObj[t].match_awayTeamObj.team_name = $scope.thirdRoundAwayTeam[t];
												$scope.thirdRoundFixtureObj[t].match_awayTeamObj.score = 0;
												$scope.thirdRoundFixtureObj[t].match_awayTeamObj.formation = '';
												$scope.thirdRoundFixtureObj[t].match_awayTeamObj.lineup = '';
												$scope.thirdRoundFixtureObj[t].match_awayTeamObj.lastLineup = '';
												$scope.thirdRoundFixtureObj[t].match_awayTeamObj.sub = '';
												$scope.thirdRoundFixtureObj[t].match_awayTeamObj.lastSub = '';
												$scope.thirdRoundFixtureObj[t].match_awayTeamObj.player = '';

												$scope.thirdRoundFixtureObj[t].id = "MA" + $rootScope.randomString + 3 + thirdRoundGroupIndex + t;
												$scope.thirdRoundFixtureObj[t].match_homeTeam = $scope.thirdRoundHomeTeam[t];
												$scope.thirdRoundFixtureObj[t].match_awayTeam = $scope.thirdRoundAwayTeam[t];
												$scope.thirdRoundFixtureObj[t].match_group = $scope.thirdRoundMatches.group[thirdRoundGroupIndex];
												$scope.thirdRoundFixtureObj[t].match_date = moment(fixture3Date).toISOString();
												$scope.thirdRoundFixtureObj[t].match_time = timeArr[timeIndex];
												$scope.thirdRoundFixtureObj[t].match_fixture = "fixture 3";
												$scope.thirdRoundFixtureObj[t].match_field = fieldArr[fieldIndex];
												$scope.thirdRoundFixtureObj[t].match_started = "";
												$scope.thirdRoundFixtureObj[t].fixture_number = 3;
												$scope.thirdRoundFixtureObj[t].competition_id = entry.id;
												$scope.thirdRoundFixtureObj[t].match_venue = entry.comp_address.venue.nama;

									
												if(moment(fixture2Date).format('dddd') === 'Monday'){
													$scope.thirdRoundFixtureObj[t].match_referee = $scope.avMonRef[timeIndex][refereeIndex].username;
													$scope.thirdRoundFixtureObj[t].match_analyst = $scope.avMonAnalysts[timeIndex][analystIndex].username;
												}else if(moment(fixture2Date).format('dddd') === 'Tuesday'){
													$scope.thirdRoundFixtureObj[t].match_referee = $scope.avTueRef[timeIndex][refereeIndex].username;
													$scope.thirdRoundFixtureObj[t].match_analyst = $scope.avTueAnalysts[timeIndex][analystIndex].username;
												}else if(moment(fixture2Date).format('dddd') === 'Wednesday'){
													$scope.thirdRoundFixtureObj[t].match_referee = $scope.avWedRef[timeIndex][refereeIndex].username;
													$scope.thirdRoundFixtureObj[t].match_analyst = $scope.avWedAnalysts[timeIndex][analystIndex].username;
												}else if(moment(fixture2Date).format('dddd') === 'Thursday'){
													$scope.thirdRoundFixtureObj[t].match_referee = $scope.avThuRef[timeIndex][refereeIndex].username;
													$scope.thirdRoundFixtureObj[t].match_analyst = $scope.avThuAnalysts[timeIndex][analystIndex].username;
												}else if(moment(fixture2Date).format('dddd') === 'Friday'){
													$scope.thirdRoundFixtureObj[t].match_referee = $scope.avFriRef[timeIndex][refereeIndex].username;
													$scope.thirdRoundFixtureObj[t].match_analyst = $scope.avFriAnalysts[timeIndex][analystIndex].username;
												}else if(moment(fixture2Date).format('dddd') === 'Saturday'){
													$scope.thirdRoundFixtureObj[t].match_referee = $scope.avSatRef[timeIndex][refereeIndex].username;
													$scope.thirdRoundFixtureObj[t].match_analyst = $scope.avSatAnalysts[timeIndex][analystIndex].username;
												}else if(moment(fixture2Date).format('dddd') === 'Sunday'){
													$scope.thirdRoundFixtureObj[t].match_referee = $scope.avSunRef[timeIndex][refereeIndex].username;
													$scope.thirdRoundFixtureObj[t].match_analyst = $scope.avSunAnalysts[timeIndex][analystIndex].username;
												}

												refereeIndex++;
												analystIndex++;
												fieldIndex++;
												if(t % 2 != 0){
													thirdRoundGroupIndex++;
												}
												if((t+1) % 3 == 0){
													timeIndex++;
													fieldIndex = 0;
												}
											}
											console.log($scope.thirdRoundFixtureObj);
										},6000);
										
										// Round of 16
										setTimeout(function(){
											timeIndex = 0;
											refereeIndex = 0;
											analystIndex = 0;
											var pair = 1;

											for(var m = 0; m < 8; m++){
												$scope.roundOf16FixtureObj[m] = {};
												$scope.roundOf16FixtureObj[m].match_homeTeamObj = {};
												$scope.roundOf16FixtureObj[m].match_homeTeamObj.team_name = "";
												$scope.roundOf16FixtureObj[m].match_homeTeamObj.score = 0;
												$scope.roundOf16FixtureObj[m].match_homeTeamObj.formation = '';
												$scope.roundOf16FixtureObj[m].match_homeTeamObj.lineup = '';
												$scope.roundOf16FixtureObj[m].match_homeTeamObj.lastLineup = '';
												$scope.roundOf16FixtureObj[m].match_homeTeamObj.sub = '';
												$scope.roundOf16FixtureObj[m].match_homeTeamObj.lastSub = '';
												$scope.roundOf16FixtureObj[m].match_homeTeamObj.player = '';

												$scope.roundOf16FixtureObj[m].match_awayTeamObj = {};
												$scope.roundOf16FixtureObj[m].match_awayTeamObj.team_name = "";
												$scope.roundOf16FixtureObj[m].match_awayTeamObj.score = 0;
												$scope.roundOf16FixtureObj[m].match_awayTeamObj.formation = '';
												$scope.roundOf16FixtureObj[m].match_awayTeamObj.lineup = '';
												$scope.roundOf16FixtureObj[m].match_awayTeamObj.lastLineup = '';
												$scope.roundOf16FixtureObj[m].match_awayTeamObj.sub = '';
												$scope.roundOf16FixtureObj[m].match_awayTeamObj.lastSub = '';
												$scope.roundOf16FixtureObj[m].match_awayTeamObj.player = '';

												$scope.roundOf16FixtureObj[m].id = "MA" + $rootScope.randomString + 16 + m;
												$scope.roundOf16FixtureObj[m].match_homeTeam = "";
												$scope.roundOf16FixtureObj[m].match_awayTeam = "";
												$scope.roundOf16FixtureObj[m].match_date = moment(roundOf16DateArr[roundOf16Index]).toISOString();
												$scope.roundOf16FixtureObj[m].match_time = timeArr[timeIndex];
												$scope.roundOf16FixtureObj[m].match_fixture = "round of 16";
												$scope.roundOf16FixtureObj[m].match_field = 1;
												$scope.roundOf16FixtureObj[m].match_pair = pair;
												$scope.roundOf16FixtureObj[m].match_started = "";
												$scope.roundOf16FixtureObj[m].competition_id = entry.id;
												$scope.roundOf16FixtureObj[m].match_venue = entry.comp_address.venue.nama;

												if(moment(roundOf16DateArr[roundOf16Index]).format('dddd') === 'Monday'){
													$scope.roundOf16FixtureObj[m].match_referee = $scope.avMonRef[timeIndex][refereeIndex].username;
													$scope.roundOf16FixtureObj[m].match_analyst = $scope.avMonAnalysts[timeIndex][analystIndex].username;
												}else if(moment(roundOf16DateArr[roundOf16Index]).format('dddd') === 'Tuesday'){
													$scope.roundOf16FixtureObj[m].match_referee = $scope.avTueRef[timeIndex][refereeIndex].username;
													$scope.roundOf16FixtureObj[m].match_analyst = $scope.avTueAnalysts[timeIndex][analystIndex].username;
												}else if(moment(roundOf16DateArr[roundOf16Index]).format('dddd') === 'Wednesday'){
													$scope.roundOf16FixtureObj[m].match_referee = $scope.avWedRef[timeIndex][refereeIndex].username;
													$scope.roundOf16FixtureObj[m].match_analyst = $scope.avWedAnalysts[timeIndex][analystIndex].username;
												}else if(moment(roundOf16DateArr[roundOf16Index]).format('dddd') === 'Thursday'){
													$scope.roundOf16FixtureObj[m].match_referee = $scope.avThuRef[timeIndex][refereeIndex].username;
													$scope.roundOf16FixtureObj[m].match_analyst = $scope.avThuAnalysts[timeIndex][analystIndex].username;
												}else if(moment(roundOf16DateArr[roundOf16Index]).format('dddd') === 'Friday'){
													$scope.roundOf16FixtureObj[m].match_referee = $scope.avFriRef[timeIndex][refereeIndex].username;
													$scope.roundOf16FixtureObj[m].match_analyst = $scope.avFriAnalysts[timeIndex][analystIndex].username;
												}else if(moment(roundOf16DateArr[roundOf16Index]).format('dddd') === 'Saturday'){
													$scope.roundOf16FixtureObj[m].match_referee = $scope.avSatRef[timeIndex][refereeIndex].username;
													$scope.roundOf16FixtureObj[m].match_analyst = $scope.avSatAnalysts[timeIndex][analystIndex].username;
												}else if(moment(roundOf16DateArr[roundOf16Index]).format('dddd') === 'Sunday'){
													$scope.roundOf16FixtureObj[m].match_referee = $scope.avSunRef[timeIndex][refereeIndex].username;
													$scope.roundOf16FixtureObj[m].match_analyst = $scope.avSunAnalysts[timeIndex][analystIndex].username;
												}
						
												refereeIndex++;
												analystIndex++;
												timeIndex++;
												if(m % 2 != 0){
													roundOf16Index++;
													timeIndex = 0;
													pair++;
												}
											}
											console.log($scope.roundOf16FixtureObj);
										},6000);
										
										// Quarter Final
										setTimeout(function(){
											timeIndex = 0;
											refereeIndex = 0;
											analystIndex = 0;
											pair = 1;

											for(m = 0; m < 4; m++){
												$scope.quarterFinalFixtureObj[m] = {};
												$scope.quarterFinalFixtureObj[m].match_homeTeamObj = {};
												$scope.quarterFinalFixtureObj[m].match_homeTeamObj.team_name = "";
												$scope.quarterFinalFixtureObj[m].match_homeTeamObj.score = 0;
												$scope.quarterFinalFixtureObj[m].match_homeTeamObj.formation = '';
												$scope.quarterFinalFixtureObj[m].match_homeTeamObj.lineup = '';
												$scope.quarterFinalFixtureObj[m].match_homeTeamObj.lastLineup = '';
												$scope.quarterFinalFixtureObj[m].match_homeTeamObj.sub = '';
												$scope.quarterFinalFixtureObj[m].match_homeTeamObj.lastSub = '';
												$scope.quarterFinalFixtureObj[m].match_homeTeamObj.player = '';

												$scope.quarterFinalFixtureObj[m].match_awayTeamObj = {};
												$scope.quarterFinalFixtureObj[m].match_awayTeamObj.team_name = "";
												$scope.quarterFinalFixtureObj[m].match_awayTeamObj.score = 0;
												$scope.quarterFinalFixtureObj[m].match_awayTeamObj.formation = '';
												$scope.quarterFinalFixtureObj[m].match_awayTeamObj.lineup = '';
												$scope.quarterFinalFixtureObj[m].match_awayTeamObj.lastLineup = '';
												$scope.quarterFinalFixtureObj[m].match_awayTeamObj.sub = '';
												$scope.quarterFinalFixtureObj[m].match_awayTeamObj.lastSub = '';
												$scope.quarterFinalFixtureObj[m].match_awayTeamObj.player = '';

												$scope.quarterFinalFixtureObj[m].id = "MA" + $rootScope.randomString + 8 + m;
												$scope.quarterFinalFixtureObj[m].match_homeTeam = "";
												$scope.quarterFinalFixtureObj[m].match_awayTeam = "";
												$scope.quarterFinalFixtureObj[m].match_date = moment(quarterFinalDateArr[quarterFinalIndex]).toISOString();
												$scope.quarterFinalFixtureObj[m].match_time = timeArr[timeIndex];
												$scope.quarterFinalFixtureObj[m].match_fixture = "quarter final";
												$scope.quarterFinalFixtureObj[m].match_field = 1;
												$scope.quarterFinalFixtureObj[m].match_pair = pair;
												$scope.quarterFinalFixtureObj[m].match_started = "";
												$scope.quarterFinalFixtureObj[m].competition_id = entry.id;
												$scope.quarterFinalFixtureObj[m].match_venue = entry.comp_address.venue.nama;

												if(moment(quarterFinalDateArr[quarterFinalIndex]).format('dddd') === 'Monday'){
													$scope.quarterFinalFixtureObj[m].match_referee = $scope.avMonRef[timeIndex][refereeIndex].username;
													$scope.quarterFinalFixtureObj[m].match_analyst = $scope.avMonAnalysts[timeIndex][analystIndex].username;
												}else if(moment(quarterFinalDateArr[quarterFinalIndex]).format('dddd') === 'Tuesday'){
													$scope.quarterFinalFixtureObj[m].match_referee = $scope.avTueRef[timeIndex][refereeIndex].username;
													$scope.quarterFinalFixtureObj[m].match_analyst = $scope.avTueAnalysts[timeIndex][analystIndex].username;
												}else if(moment(quarterFinalDateArr[quarterFinalIndex]).format('dddd') === 'Wednesday'){
													$scope.quarterFinalFixtureObj[m].match_referee = $scope.avWedRef[timeIndex][refereeIndex].username;
													$scope.quarterFinalFixtureObj[m].match_analyst = $scope.avWedAnalysts[timeIndex][analystIndex].username;
												}else if(moment(quarterFinalDateArr[quarterFinalIndex]).format('dddd') === 'Thursday'){
													$scope.quarterFinalFixtureObj[m].match_referee = $scope.avThuRef[timeIndex][refereeIndex].username;
													$scope.quarterFinalFixtureObj[m].match_analyst = $scope.avThuAnalysts[timeIndex][analystIndex].username;
												}else if(moment(quarterFinalDateArr[quarterFinalIndex]).format('dddd') === 'Friday'){
													$scope.quarterFinalFixtureObj[m].match_referee = $scope.avFriRef[timeIndex][refereeIndex].username;
													$scope.quarterFinalFixtureObj[m].match_analyst = $scope.avFriAnalysts[timeIndex][analystIndex].username;
												}else if(moment(quarterFinalDateArr[quarterFinalIndex]).format('dddd') === 'Saturday'){
													$scope.quarterFinalFixtureObj[m].match_referee = $scope.avSatRef[timeIndex][refereeIndex].username;
													$scope.quarterFinalFixtureObj[m].match_analyst = $scope.avSatAnalysts[timeIndex][analystIndex].username;
												}else if(moment(quarterFinalDateArr[quarterFinalIndex]).format('dddd') === 'Sunday'){
													$scope.quarterFinalFixtureObj[m].match_referee = $scope.avSunRef[timeIndex][refereeIndex].username;
													$scope.quarterFinalFixtureObj[m].match_analyst = $scope.avSunAnalysts[timeIndex][analystIndex].username;
												}
							
												refereeIndex++;
												analystIndex++;
												timeIndex++;
												if(m % 2 == 0){
													quarterFinalIndex++;
													timeIndex = 0;
												}
												if(m % 2 != 0){
													pair++;
												}
											}
											console.log($scope.quarterFinalFixtureObj);
										},6000);
										
										// Semi Final
										setTimeout(function(){
											refereeIndex = 0;
											analystIndex = 0;
											for(m = 0; m < 2; m++){
												$scope.semiFinalFixtureObj[m] = {};
												$scope.semiFinalFixtureObj[m].match_homeTeamObj = {};
												$scope.semiFinalFixtureObj[m].match_homeTeamObj.team_name = "";
												$scope.semiFinalFixtureObj[m].match_homeTeamObj.score = 0;
												$scope.semiFinalFixtureObj[m].match_homeTeamObj.formation = '';
												$scope.semiFinalFixtureObj[m].match_homeTeamObj.lineup = '';
												$scope.semiFinalFixtureObj[m].match_homeTeamObj.lastLineup = '';
												$scope.semiFinalFixtureObj[m].match_homeTeamObj.sub = '';
												$scope.semiFinalFixtureObj[m].match_homeTeamObj.lastSub = '';
												$scope.semiFinalFixtureObj[m].match_homeTeamObj.player = '';

												$scope.semiFinalFixtureObj[m].match_awayTeamObj = {};
												$scope.semiFinalFixtureObj[m].match_awayTeamObj.team_name = "";
												$scope.semiFinalFixtureObj[m].match_awayTeamObj.score = 0;
												$scope.semiFinalFixtureObj[m].match_awayTeamObj.formation = '';
												$scope.semiFinalFixtureObj[m].match_awayTeamObj.lineup = '';
												$scope.semiFinalFixtureObj[m].match_awayTeamObj.lastLineup = '';
												$scope.semiFinalFixtureObj[m].match_awayTeamObj.sub = '';
												$scope.semiFinalFixtureObj[m].match_awayTeamObj.lastSub = '';
												$scope.semiFinalFixtureObj[m].match_awayTeamObj.player = '';

												$scope.semiFinalFixtureObj[m].id = "MA" + $rootScope.randomString + 4 + m;
												$scope.semiFinalFixtureObj[m].match_homeTeam = "";
												$scope.semiFinalFixtureObj[m].match_awayTeam = "";
												$scope.semiFinalFixtureObj[m].match_date = moment(semiFinalDateArr[semiFinalIndex]).toISOString();
												$scope.semiFinalFixtureObj[m].match_time = timeArr[1];
												$scope.semiFinalFixtureObj[m].match_fixture = "semi final";
												$scope.semiFinalFixtureObj[m].match_field = 1;
												$scope.semiFinalFixtureObj[m].match_pair = 1;
												$scope.semiFinalFixtureObj[m].match_started = "";
												$scope.semiFinalFixtureObj[m].competition_id = entry.id;
												$scope.semiFinalFixtureObj[m].match_venue = entry.comp_address.venue.nama;

												if(moment(semiFinalDateArr[semiFinalIndex]).format('dddd') === 'Monday'){
													$scope.semiFinalFixtureObj[m].match_referee = $scope.avMonRef[timeIndex][refereeIndex].username;
													$scope.semiFinalFixtureObj[m].match_analyst = $scope.avMonAnalysts[timeIndex][analystIndex].username;
												}else if(moment(semiFinalDateArr[semiFinalIndex]).format('dddd') === 'Tuesday'){
													$scope.semiFinalFixtureObj[m].match_referee = $scope.avTueRef[timeIndex][refereeIndex].username;
													$scope.semiFinalFixtureObj[m].match_analyst = $scope.avTueAnalysts[timeIndex][analystIndex].username;
												}else if(moment(semiFinalDateArr[semiFinalIndex]).format('dddd') === 'Wednesday'){
													$scope.semiFinalFixtureObj[m].match_referee = $scope.avWedRef[timeIndex][refereeIndex].username;
													$scope.semiFinalFixtureObj[m].match_analyst = $scope.avWedAnalysts[timeIndex][analystIndex].username;
												}else if(moment(semiFinalDateArr[semiFinalIndex]).format('dddd') === 'Thursday'){
													$scope.semiFinalFixtureObj[m].match_referee = $scope.avThuRef[timeIndex][refereeIndex].username;
													$scope.semiFinalFixtureObj[m].match_analyst = $scope.avThuAnalysts[timeIndex][analystIndex].username;
												}else if(moment(semiFinalDateArr[semiFinalIndex]).format('dddd') === 'Friday'){
													$scope.semiFinalFixtureObj[m].match_referee = $scope.avFriRef[timeIndex][refereeIndex].username;
													$scope.semiFinalFixtureObj[m].match_analyst = $scope.avFriAnalysts[timeIndex][analystIndex].username;
												}else if(moment(semiFinalDateArr[semiFinalIndex]).format('dddd') === 'Saturday'){
													$scope.semiFinalFixtureObj[m].match_referee = $scope.avSatRef[timeIndex][refereeIndex].username;
													$scope.semiFinalFixtureObj[m].match_analyst = $scope.avSatAnalysts[timeIndex][analystIndex].username;
												}else if(moment(semiFinalDateArr[semiFinalIndex]).format('dddd') === 'Sunday'){
													$scope.semiFinalFixtureObj[m].match_referee = $scope.avSunRef[timeIndex][refereeIndex].username;
													$scope.semiFinalFixtureObj[m].match_analyst = $scope.avSunAnalysts[timeIndex][analystIndex].username;
												}
							
												semiFinalIndex++;
												refereeIndex++;
												analystIndex++;
											}
											console.log($scope.semiFinalFixtureObj);
										},6000);
										
										// Third Place
										setTimeout(function(){
											refereeIndex = 0;
											analystIndex = 0;
											$scope.thirdPlaceFixtureObj = {};
											$scope.thirdPlaceFixtureObj.match_homeTeamObj = {};
											$scope.thirdPlaceFixtureObj.match_homeTeamObj.team_name = "";
											$scope.thirdPlaceFixtureObj.match_homeTeamObj.score = 0;
											$scope.thirdPlaceFixtureObj.match_homeTeamObj.formation = '';
											$scope.thirdPlaceFixtureObj.match_homeTeamObj.lineup = '';
											$scope.thirdPlaceFixtureObj.match_homeTeamObj.lastLineup = '';
											$scope.thirdPlaceFixtureObj.match_homeTeamObj.sub = '';
											$scope.thirdPlaceFixtureObj.match_homeTeamObj.lastSub = '';
											$scope.thirdPlaceFixtureObj.match_homeTeamObj.player = '';

											$scope.thirdPlaceFixtureObj.match_awayTeamObj = {};
											$scope.thirdPlaceFixtureObj.match_awayTeamObj.team_name = "";
											$scope.thirdPlaceFixtureObj.match_awayTeamObj.score = 0;
											$scope.thirdPlaceFixtureObj.match_awayTeamObj.formation = '';
											$scope.thirdPlaceFixtureObj.match_awayTeamObj.lineup = '';
											$scope.thirdPlaceFixtureObj.match_awayTeamObj.lastLineup = '';
											$scope.thirdPlaceFixtureObj.match_awayTeamObj.sub = '';
											$scope.thirdPlaceFixtureObj.match_awayTeamObj.lastSub = '';
											$scope.thirdPlaceFixtureObj.match_awayTeamObj.player = '';

											$scope.thirdPlaceFixtureObj.id = "MA" + $rootScope.randomString + 3 + m;
											$scope.thirdPlaceFixtureObj.match_homeTeam = "";
											$scope.thirdPlaceFixtureObj.match_awayTeam = "";
											$scope.thirdPlaceFixtureObj.match_date = moment(thirdPlaceDate).toISOString();
											$scope.thirdPlaceFixtureObj.match_time = timeArr[1];
											$scope.thirdPlaceFixtureObj.match_fixture = "third place";
											$scope.thirdPlaceFixtureObj.match_field = 1;
											$scope.thirdPlaceFixtureObj.match_started = "";
											$scope.thirdPlaceFixtureObj.competition_id = entry.id;
											$scope.thirdPlaceFixtureObj.match_venue = entry.comp_address.venue.nama;

											if(moment(thirdPlaceDate).format('dddd') === 'Monday'){
												$scope.thirdPlaceFixtureObj.match_referee = $scope.avMonRef[timeIndex][refereeIndex].username;
												$scope.thirdPlaceFixtureObj.match_analyst = $scope.avMonAnalysts[timeIndex][analystIndex].username;
											}else if(moment(thirdPlaceDate).format('dddd') === 'Tuesday'){
												$scope.thirdPlaceFixtureObj.match_referee = $scope.avTueRef[timeIndex][refereeIndex].username;
												$scope.thirdPlaceFixtureObj.match_analyst = $scope.avTueAnalysts[timeIndex][analystIndex].username;
											}else if(moment(thirdPlaceDate).format('dddd') === 'Wednesday'){
												$scope.thirdPlaceFixtureObj.match_referee = $scope.avWedRef[timeIndex][refereeIndex].username;
												$scope.thirdPlaceFixtureObj.match_analyst = $scope.avWedAnalysts[timeIndex][analystIndex].username;
											}else if(moment(thirdPlaceDate).format('dddd') === 'Thursday'){
												$scope.thirdPlaceFixtureObj.match_referee = $scope.avThuRef[timeIndex][refereeIndex].username;
												$scope.thirdPlaceFixtureObj.match_analyst = $scope.avThuAnalysts[timeIndex][analystIndex].username;
											}else if(moment(thirdPlaceDate).format('dddd') === 'Friday'){
												$scope.thirdPlaceFixtureObj.match_referee = $scope.avFriRef[timeIndex][refereeIndex].username;
												$scope.thirdPlaceFixtureObj.match_analyst = $scope.avFriAnalysts[timeIndex][analystIndex].username;
											}else if(moment(thirdPlaceDate).format('dddd') === 'Saturday'){
												$scope.thirdPlaceFixtureObj.match_referee = $scope.avSatRef[timeIndex][refereeIndex].username;
												$scope.thirdPlaceFixtureObj.match_analyst = $scope.avSatAnalysts[timeIndex][analystIndex].username;
											}else if(moment(thirdPlaceDate).format('dddd') === 'Sunday'){
												$scope.thirdPlaceFixtureObj.match_referee = $scope.avSunRef[timeIndex][refereeIndex].username;
												$scope.thirdPlaceFixtureObj.match_analyst = $scope.avSunAnalysts[timeIndex][analystIndex].username;
											}
											console.log($scope.thirdPlaceFixtureObj);
										},6000);
										
										// Final
										setTimeout(function(){
											refereeIndex = 1;
											analystIndex = 1;
											$scope.finalFixtureObj = {};
											$scope.finalFixtureObj.match_homeTeamObj = {};
											$scope.finalFixtureObj.match_homeTeamObj.team_name = "";
											$scope.finalFixtureObj.match_homeTeamObj.score = 0;
											$scope.finalFixtureObj.match_homeTeamObj.formation = '';
											$scope.finalFixtureObj.match_homeTeamObj.lineup = '';
											$scope.finalFixtureObj.match_homeTeamObj.lastLineup = '';
											$scope.finalFixtureObj.match_homeTeamObj.sub = '';
											$scope.finalFixtureObj.match_homeTeamObj.lastSub = '';
											$scope.finalFixtureObj.match_homeTeamObj.player = '';

											$scope.finalFixtureObj.match_awayTeamObj = {};
											$scope.finalFixtureObj.match_awayTeamObj.team_name = "";
											$scope.finalFixtureObj.match_awayTeamObj.score = 0;
											$scope.finalFixtureObj.match_awayTeamObj.formation = '';
											$scope.finalFixtureObj.match_awayTeamObj.lineup = '';
											$scope.finalFixtureObj.match_awayTeamObj.lastLineup = '';
											$scope.finalFixtureObj.match_awayTeamObj.sub = '';
											$scope.finalFixtureObj.match_awayTeamObj.lastSub = '';
											$scope.finalFixtureObj.match_awayTeamObj.player = '';

											$scope.finalFixtureObj.id = "MA" + $rootScope.randomString + 1 + m;
											$scope.finalFixtureObj.match_homeTeam = "";
											$scope.finalFixtureObj.match_awayTeam = "";
											$scope.finalFixtureObj.match_date = moment(finalDate).toISOString();
											$scope.finalFixtureObj.match_time = timeArr[1];
											$scope.finalFixtureObj.match_fixture = "final";
											$scope.finalFixtureObj.match_field = 1;
											$scope.finalFixtureObj.match_started = "";
											$scope.finalFixtureObj.competition_id = entry.id;
											$scope.finalFixtureObj.match_venue = entry.comp_address.venue.nama;

											if(moment(finalDate).format('dddd') === 'Monday'){
												$scope.finalFixtureObj.match_referee = $scope.avMonRef[timeIndex][refereeIndex].username;
												$scope.finalFixtureObj.match_analyst = $scope.avMonAnalysts[timeIndex][analystIndex].username;
											}else if(moment(finalDate).format('dddd') === 'Tuesday'){
												$scope.finalFixtureObj.match_referee = $scope.avTueRef[timeIndex][refereeIndex].username;
												$scope.finalFixtureObj.match_analyst = $scope.avTueAnalysts[timeIndex][analystIndex].username;
											}else if(moment(finalDate).format('dddd') === 'Wednesday'){
												$scope.finalFixtureObj.match_referee = $scope.avWedRef[timeIndex][refereeIndex].username;
												$scope.finalFixtureObj.match_analyst = $scope.avWedAnalysts[timeIndex][analystIndex].username;
											}else if(moment(finalDate).format('dddd') === 'Thursday'){
												$scope.finalFixtureObj.match_referee = $scope.avThuRef[timeIndex][refereeIndex].username;
												$scope.finalFixtureObj.match_analyst = $scope.avThuAnalysts[timeIndex][analystIndex].username;
											}else if(moment(finalDate).format('dddd') === 'Friday'){
												$scope.finalFixtureObj.match_referee = $scope.avFriRef[timeIndex][refereeIndex].username;
												$scope.finalFixtureObj.match_analyst = $scope.avFriAnalysts[timeIndex][analystIndex].username;
											}else if(moment(finalDate).format('dddd') === 'Saturday'){
												$scope.finalFixtureObj.match_referee = $scope.avSatRef[timeIndex][refereeIndex].username;
												$scope.finalFixtureObj.match_analyst = $scope.avSatAnalysts[timeIndex][analystIndex].username;
											}else if(moment(finalDate).format('dddd') === 'Sunday'){
												$scope.finalFixtureObj.match_referee = $scope.avSunRef[timeIndex][refereeIndex].username;
												$scope.finalFixtureObj.match_analyst = $scope.avSunAnalysts[timeIndex][analystIndex].username;
											}
											console.log($scope.finalFixtureObj);
										},6000);
										
									}else if(entry.comp_numOfTeam === 16){

										console.log("16");
										var fixture1Date1 = moment(new Date(entry.comp_start));
										var fixture1Date2 = moment(new Date(entry.comp_start)).add(1, 'days');
										var fixture2Date1 = moment(new Date(entry.comp_start)).add(3, 'days');
										var fixture2Date2 = moment(new Date(entry.comp_start)).add(4, 'days');
										var fixture3Date1 = moment(new Date(entry.comp_start)).add(6, 'days');
										var fixture3Date2 = moment(new Date(entry.comp_start)).add(7, 'days');
										var quarterFinalDate1 = moment(new Date(entry.comp_start)).add(10, 'days');
										var quarterFinalDate2 = moment(new Date(entry.comp_start)).add(11, 'days');
										var quarterFinalDate3 = moment(new Date(entry.comp_start)).add(12, 'days');
										var quarterFinalDate4 = moment(new Date(entry.comp_start)).add(13, 'days');
										var semiFinalDate1 = moment(new Date(entry.comp_start)).add(16, 'days');
										var semiFinalDate2 = moment(new Date(entry.comp_start)).add(17, 'days');
										var thirdPlaceDate = moment(new Date(entry.comp_start)).add(19, 'days');
										var finalDate = entry.comp_finish;

										var firstRoundGroupIndex = 0;
										var secondRoundGroupIndex = 0;
										var thirdRoundGroupIndex = 0;
										var quarterFinalIndex = 0;
										var fixture1DateArr = [];
										var fixture2DateArr = [];
										var fixture3DateArr = [];
										var semiFinalIndex = 0;
										var quarterFinalDateArr = [];
										var semiFinalDateArr = [];
										var timeArr = ["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00"];
										var fieldArr = [1,2,3];

										fixture1DateArr.push(fixture1Date1,fixture1Date2);
										fixture2DateArr.push(fixture2Date1,fixture2Date2);
										fixture3DateArr.push(fixture3Date1,fixture3Date2);
										quarterFinalDateArr.push(quarterFinalDate1,quarterFinalDate2,quarterFinalDate3,quarterFinalDate4);
										semiFinalDateArr.push(semiFinalDate1,semiFinalDate2);

										// Fixture 1
										setTimeout(function(){
											var timeIndex = 0;
											var fixtureIndex = 0;
											var refereeIndex = 0;
											var analystIndex = 0;

											for(t = 0; t < $scope.firstRoundHomeTeam.length; t++){
												$scope.firstRoundFixtureObj[t] = {};
												$scope.firstRoundFixtureObj[t].match_homeTeamObj = {};
												$scope.firstRoundFixtureObj[t].match_homeTeamObj.team_name = $scope.firstRoundHomeTeam[t];
												$scope.firstRoundFixtureObj[t].match_homeTeamObj.score = 0;
												$scope.firstRoundFixtureObj[t].match_homeTeamObj.formation = '';
												$scope.firstRoundFixtureObj[t].match_homeTeamObj.lineup = '';
												$scope.firstRoundFixtureObj[t].match_homeTeamObj.lastLineup = '';
												$scope.firstRoundFixtureObj[t].match_homeTeamObj.sub = '';
												$scope.firstRoundFixtureObj[t].match_homeTeamObj.lastSub = '';
												$scope.firstRoundFixtureObj[t].match_homeTeamObj.player = '';

												$scope.firstRoundFixtureObj[t].match_awayTeamObj = {};
												$scope.firstRoundFixtureObj[t].match_awayTeamObj.team_name = $scope.firstRoundAwayTeam[t];
												$scope.firstRoundFixtureObj[t].match_awayTeamObj.score = 0;
												$scope.firstRoundFixtureObj[t].match_awayTeamObj.formation = '';
												$scope.firstRoundFixtureObj[t].match_awayTeamObj.lineup = '';
												$scope.firstRoundFixtureObj[t].match_awayTeamObj.lastLineup = '';
												$scope.firstRoundFixtureObj[t].match_awayTeamObj.sub = '';
												$scope.firstRoundFixtureObj[t].match_awayTeamObj.lastSub = '';
												$scope.firstRoundFixtureObj[t].match_awayTeamObj.player = '';

												$scope.firstRoundFixtureObj[t].id = "MA" + $rootScope.randomString + 1 + firstRoundGroupIndex + t;
												$scope.firstRoundFixtureObj[t].match_homeTeam = $scope.firstRoundHomeTeam[t];
												$scope.firstRoundFixtureObj[t].match_awayTeam = $scope.firstRoundAwayTeam[t];
												$scope.firstRoundFixtureObj[t].match_group = $scope.firstRoundMatches.group[firstRoundGroupIndex];
												$scope.firstRoundFixtureObj[t].match_date = moment(fixture1DateArr[fixtureIndex]).toISOString();
												$scope.firstRoundFixtureObj[t].match_time = timeArr[timeIndex];
												$scope.firstRoundFixtureObj[t].match_fixture = "fixture 1";
												$scope.firstRoundFixtureObj[t].match_field = 1;
												$scope.firstRoundFixtureObj[t].match_started = "";
												$scope.firstRoundFixtureObj[t].fixture_number = 1;
												$scope.firstRoundFixtureObj[t].competition_id = entry.id;
												$scope.firstRoundFixtureObj[t].match_venue = entry.comp_address.venue.nama;

									
												if(moment(fixture1DateArr[fixtureIndex]).format('dddd') === 'Monday'){
													$scope.firstRoundFixtureObj[t].match_referee = $scope.avMonRef[timeIndex][refereeIndex].username;
													$scope.firstRoundFixtureObj[t].match_analyst = $scope.avMonAnalysts[timeIndex][analystIndex].username;
												}else if(moment(fixture1DateArr[fixtureIndex]).format('dddd') === 'Tuesday'){
													$scope.firstRoundFixtureObj[t].match_referee = $scope.avTueRef[timeIndex][refereeIndex].username;
													$scope.firstRoundFixtureObj[t].match_analyst = $scope.avTueAnalysts[timeIndex][analystIndex].username;
												}else if(moment(fixture1DateArr[fixtureIndex]).format('dddd') === 'Wednesday'){
													$scope.firstRoundFixtureObj[t].match_referee = $scope.avWedRef[timeIndex][refereeIndex].username;
													$scope.firstRoundFixtureObj[t].match_analyst = $scope.avWedAnalysts[timeIndex][analystIndex].username;
												}else if(moment(fixture1DateArr[fixtureIndex]).format('dddd') === 'Thursday'){
													$scope.firstRoundFixtureObj[t].match_referee = $scope.avThuRef[timeIndex][refereeIndex].username;
													$scope.firstRoundFixtureObj[t].match_analyst = $scope.avThuAnalysts[timeIndex][analystIndex].username;
												}else if(moment(fixture1DateArr[fixtureIndex]).format('dddd') === 'Friday'){
													$scope.firstRoundFixtureObj[t].match_referee = $scope.avFriRef[timeIndex][refereeIndex].username;
													$scope.firstRoundFixtureObj[t].match_analyst = $scope.avFriAnalysts[timeIndex][analystIndex].username;
												}else if(moment(fixture1DateArr[fixtureIndex]).format('dddd') === 'Saturday'){
													$scope.firstRoundFixtureObj[t].match_referee = $scope.avSatRef[timeIndex][refereeIndex].username;
													$scope.firstRoundFixtureObj[t].match_analyst = $scope.avSatAnalysts[timeIndex][analystIndex].username;
												}else if(moment(fixture1DateArr[fixtureIndex]).format('dddd') === 'Sunday'){
													$scope.firstRoundFixtureObj[t].match_referee = $scope.avSunRef[timeIndex][refereeIndex].username;
													$scope.firstRoundFixtureObj[t].match_analyst = $scope.avSunAnalysts[timeIndex][analystIndex].username;
												}
												
												refereeIndex++;
												analystIndex++;
												timeIndex++;
												if(t % 2 !== 0){
													firstRoundGroupIndex++;
												}
												if((t+1) % 4 === 0){
													fixtureIndex++;
													timeIndex = 0;
												}
											}
											console.log($scope.firstRoundFixtureObj);
										},6000);
										

										// Fixture 2
										setTimeout(function(){
											timeIndex = 0;
											fixtureIndex = 0;
											refereeIndex = 0;
											analystIndex = 0;

											for(t = 0; t < $scope.secondRoundHomeTeam.length; t++){
												$scope.secondRoundFixtureObj[t] = {};
												$scope.secondRoundFixtureObj[t].match_homeTeamObj = {};
												$scope.secondRoundFixtureObj[t].match_homeTeamObj.team_name = $scope.secondRoundHomeTeam[t];
												$scope.secondRoundFixtureObj[t].match_homeTeamObj.score = 0;
												$scope.secondRoundFixtureObj[t].match_homeTeamObj.formation = '';
												$scope.secondRoundFixtureObj[t].match_homeTeamObj.lineup = '';
												$scope.secondRoundFixtureObj[t].match_homeTeamObj.lastLineup = '';
												$scope.secondRoundFixtureObj[t].match_homeTeamObj.sub = '';
												$scope.secondRoundFixtureObj[t].match_homeTeamObj.lastSub = '';
												$scope.secondRoundFixtureObj[t].match_homeTeamObj.player = '';

												$scope.secondRoundFixtureObj[t].match_awayTeamObj = {};
												$scope.secondRoundFixtureObj[t].match_awayTeamObj.team_name = $scope.secondRoundAwayTeam[t];
												$scope.secondRoundFixtureObj[t].match_awayTeamObj.score = 0;
												$scope.secondRoundFixtureObj[t].match_awayTeamObj.formation = '';
												$scope.secondRoundFixtureObj[t].match_awayTeamObj.lineup = '';
												$scope.secondRoundFixtureObj[t].match_awayTeamObj.lastLineup = '';
												$scope.secondRoundFixtureObj[t].match_awayTeamObj.sub = '';
												$scope.secondRoundFixtureObj[t].match_awayTeamObj.lastSub = '';
												$scope.secondRoundFixtureObj[t].match_awayTeamObj.player = '';

												$scope.secondRoundFixtureObj[t].id = "MA" + $rootScope.randomString + 2 + secondRoundGroupIndex + t;
												$scope.secondRoundFixtureObj[t].match_homeTeam = $scope.secondRoundHomeTeam[t];
												$scope.secondRoundFixtureObj[t].match_awayTeam = $scope.secondRoundAwayTeam[t];
												$scope.secondRoundFixtureObj[t].match_group = $scope.secondRoundMatches.group[secondRoundGroupIndex];
												$scope.secondRoundFixtureObj[t].match_date = moment(fixture2DateArr[fixtureIndex]).toISOString();
												$scope.secondRoundFixtureObj[t].match_time = timeArr[timeIndex];
												$scope.secondRoundFixtureObj[t].match_fixture = "fixture 2";
												$scope.secondRoundFixtureObj[t].match_field = 1;
												$scope.secondRoundFixtureObj[t].match_started = "";
												$scope.secondRoundFixtureObj[t].fixture_number = 2;
												$scope.secondRoundFixtureObj[t].competition_id = entry.id;
												$scope.secondRoundFixtureObj[t].match_venue = entry.comp_address.venue.nama;

									
												if(moment(fixture2DateArr[fixtureIndex]).format('dddd') === 'Monday'){
													$scope.secondRoundFixtureObj[t].match_referee = $scope.avMonRef[timeIndex][refereeIndex].username;
													$scope.secondRoundFixtureObj[t].match_analyst = $scope.avMonAnalysts[timeIndex][analystIndex].username;
												}else if(moment(fixture2DateArr[fixtureIndex]).format('dddd') === 'Tuesday'){
													$scope.secondRoundFixtureObj[t].match_referee = $scope.avTueRef[timeIndex][refereeIndex].username;
													$scope.secondRoundFixtureObj[t].match_analyst = $scope.avTueAnalysts[timeIndex][analystIndex].username;
												}else if(moment(fixture2DateArr[fixtureIndex]).format('dddd') === 'Wednesday'){
													$scope.secondRoundFixtureObj[t].match_referee = $scope.avWedRef[timeIndex][refereeIndex].username;
													$scope.secondRoundFixtureObj[t].match_analyst = $scope.avWedAnalysts[timeIndex][analystIndex].username;
												}else if(moment(fixture2DateArr[fixtureIndex]).format('dddd') === 'Thursday'){
													$scope.secondRoundFixtureObj[t].match_referee = $scope.avThuRef[timeIndex][refereeIndex].username;
													$scope.secondRoundFixtureObj[t].match_analyst = $scope.avThuAnalysts[timeIndex][analystIndex].username;
												}else if(moment(fixture2DateArr[fixtureIndex]).format('dddd') === 'Friday'){
													$scope.secondRoundFixtureObj[t].match_referee = $scope.avFriRef[timeIndex][refereeIndex].username;
													$scope.secondRoundFixtureObj[t].match_analyst = $scope.avFriAnalysts[timeIndex][analystIndex].username;
												}else if(moment(fixture2DateArr[fixtureIndex]).format('dddd') === 'Saturday'){
													$scope.secondRoundFixtureObj[t].match_referee = $scope.avSatRef[timeIndex][refereeIndex].username;
													$scope.secondRoundFixtureObj[t].match_analyst = $scope.avSatAnalysts[timeIndex][analystIndex].username;
												}else if(moment(fixture2DateArr[fixtureIndex]).format('dddd') === 'Sunday'){
													$scope.secondRoundFixtureObj[t].match_referee = $scope.avSunRef[timeIndex][refereeIndex].username;
													$scope.secondRoundFixtureObj[t].match_analyst = $scope.avSunAnalysts[timeIndex][analystIndex].username;
												}
										
												refereeIndex++;
												analystIndex++;
												timeIndex++;
												if(t % 2 != 0){
													secondRoundGroupIndex++;
												}
												if((t+1) % 4 === 0){
													fixtureIndex++;
													timeIndex = 0;
												}
											}
											console.log($scope.secondRoundFixtureObj);
										},6000);

										// Fixture 3
										setTimeout(function(){
											timeIndex = 0;
											fixtureIndex = 0;
											refereeIndex = 0;
											analystIndex = 0;

											for(t = 0; t < $scope.thirdRoundHomeTeam.length; t++){
												$scope.thirdRoundFixtureObj[t] = {};
												$scope.thirdRoundFixtureObj[t].match_homeTeamObj = {};
												$scope.thirdRoundFixtureObj[t].match_homeTeamObj.team_name = $scope.thirdRoundHomeTeam[t];
												$scope.thirdRoundFixtureObj[t].match_homeTeamObj.score = 0;
												$scope.thirdRoundFixtureObj[t].match_homeTeamObj.formation = '';
												$scope.thirdRoundFixtureObj[t].match_homeTeamObj.lineup = '';
												$scope.thirdRoundFixtureObj[t].match_homeTeamObj.lastLineup = '';
												$scope.thirdRoundFixtureObj[t].match_homeTeamObj.sub = '';
												$scope.thirdRoundFixtureObj[t].match_homeTeamObj.lastSub = '';
												$scope.thirdRoundFixtureObj[t].match_homeTeamObj.player = '';

												$scope.thirdRoundFixtureObj[t].match_awayTeamObj = {};
												$scope.thirdRoundFixtureObj[t].match_awayTeamObj.team_name = $scope.thirdRoundAwayTeam[t];
												$scope.thirdRoundFixtureObj[t].match_awayTeamObj.score = 0;
												$scope.thirdRoundFixtureObj[t].match_awayTeamObj.formation = '';
												$scope.thirdRoundFixtureObj[t].match_awayTeamObj.lineup = '';
												$scope.thirdRoundFixtureObj[t].match_awayTeamObj.lastLineup = '';
												$scope.thirdRoundFixtureObj[t].match_awayTeamObj.sub = '';
												$scope.thirdRoundFixtureObj[t].match_awayTeamObj.lastSub = '';
												$scope.thirdRoundFixtureObj[t].match_awayTeamObj.player = '';

												$scope.thirdRoundFixtureObj[t].id = "MA" + $rootScope.randomString + 3 + thirdRoundGroupIndex + t;
												$scope.thirdRoundFixtureObj[t].match_homeTeam = $scope.thirdRoundHomeTeam[t];
												$scope.thirdRoundFixtureObj[t].match_awayTeam = $scope.thirdRoundAwayTeam[t];
												$scope.thirdRoundFixtureObj[t].match_group = $scope.thirdRoundMatches.group[thirdRoundGroupIndex];
												$scope.thirdRoundFixtureObj[t].match_date = moment(fixture3DateArr[fixtureIndex]).toISOString();
												$scope.thirdRoundFixtureObj[t].match_time = timeArr[timeIndex];
												$scope.thirdRoundFixtureObj[t].match_fixture = "fixture 3";
												$scope.thirdRoundFixtureObj[t].match_field = 1;
												$scope.thirdRoundFixtureObj[t].match_started = "";
												$scope.thirdRoundFixtureObj[t].fixture_number = 3;
												$scope.thirdRoundFixtureObj[t].competition_id = entry.id;
												$scope.thirdRoundFixtureObj[t].match_venue = entry.comp_address.venue.nama;

									
												if(moment(fixture3DateArr[fixtureIndex]).format('dddd') === 'Monday'){
													$scope.thirdRoundFixtureObj[t].match_referee = $scope.avMonRef[timeIndex][refereeIndex].username;
													$scope.thirdRoundFixtureObj[t].match_analyst = $scope.avMonAnalysts[timeIndex][analystIndex].username;
												}else if(moment(fixture3DateArr[fixtureIndex]).format('dddd') === 'Tuesday'){
													$scope.thirdRoundFixtureObj[t].match_referee = $scope.avTueRef[timeIndex][refereeIndex].username;
													$scope.thirdRoundFixtureObj[t].match_analyst = $scope.avTueAnalysts[timeIndex][analystIndex].username;
												}else if(moment(fixture3DateArr[fixtureIndex]).format('dddd') === 'Wednesday'){
													$scope.thirdRoundFixtureObj[t].match_referee = $scope.avWedRef[timeIndex][refereeIndex].username;
													$scope.thirdRoundFixtureObj[t].match_analyst = $scope.avWedAnalysts[timeIndex][analystIndex].username;
												}else if(moment(fixture3DateArr[fixtureIndex]).format('dddd') === 'Thursday'){
													$scope.thirdRoundFixtureObj[t].match_referee = $scope.avThuRef[timeIndex][refereeIndex].username;
													$scope.thirdRoundFixtureObj[t].match_analyst = $scope.avThuAnalysts[timeIndex][analystIndex].username;
												}else if(moment(fixture3DateArr[fixtureIndex]).format('dddd') === 'Friday'){
													$scope.thirdRoundFixtureObj[t].match_referee = $scope.avFriRef[timeIndex][refereeIndex].username;
													$scope.thirdRoundFixtureObj[t].match_analyst = $scope.avFriAnalysts[timeIndex][analystIndex].username;
												}else if(moment(fixture3DateArr[fixtureIndex]).format('dddd') === 'Saturday'){
													$scope.thirdRoundFixtureObj[t].match_referee = $scope.avSatRef[timeIndex][refereeIndex].username;
													$scope.thirdRoundFixtureObj[t].match_analyst = $scope.avSatAnalysts[timeIndex][analystIndex].username;
												}else if(moment(fixture3DateArr[fixtureIndex]).format('dddd') === 'Sunday'){
													$scope.thirdRoundFixtureObj[t].match_referee = $scope.avSunRef[timeIndex][refereeIndex].username;
													$scope.thirdRoundFixtureObj[t].match_analyst = $scope.avSunAnalysts[timeIndex][analystIndex].username;
												}

												refereeIndex++;
												analystIndex++;
												timeIndex++;
												if(t % 2 != 0){
													thirdRoundGroupIndex++;
												}
												if((t+1) % 4 === 0){
													fixtureIndex++;
													timeIndex = 0;
												}
											}
											console.log($scope.thirdRoundFixtureObj);
										},6000);
										

										// Quarter Final
										setTimeout(function(){
											var pair = 1;
											refereeIndex = 0;
											analystIndex = 0;

											for(m = 0; m < 4; m++){
												$scope.quarterFinalFixtureObj[m] = {};
												$scope.quarterFinalFixtureObj[m].match_homeTeamObj = {};
												$scope.quarterFinalFixtureObj[m].match_homeTeamObj.team_name = '';
												$scope.quarterFinalFixtureObj[m].match_homeTeamObj.score = 0;
												$scope.quarterFinalFixtureObj[m].match_homeTeamObj.formation = '';
												$scope.quarterFinalFixtureObj[m].match_homeTeamObj.lineup = '';
												$scope.quarterFinalFixtureObj[m].match_homeTeamObj.lastLineup = '';
												$scope.quarterFinalFixtureObj[m].match_homeTeamObj.sub = '';
												$scope.quarterFinalFixtureObj[m].match_homeTeamObj.lastSub = '';
												$scope.quarterFinalFixtureObj[m].match_homeTeamObj.player = '';

												$scope.quarterFinalFixtureObj[m].match_awayTeamObj = {};
												$scope.quarterFinalFixtureObj[m].match_awayTeamObj.team_name = '';
												$scope.quarterFinalFixtureObj[m].match_awayTeamObj.score = 0;
												$scope.quarterFinalFixtureObj[m].match_awayTeamObj.formation = '';
												$scope.quarterFinalFixtureObj[m].match_awayTeamObj.lineup = '';
												$scope.quarterFinalFixtureObj[m].match_awayTeamObj.lastLineup = '';
												$scope.quarterFinalFixtureObj[m].match_awayTeamObj.sub = '';
												$scope.quarterFinalFixtureObj[m].match_awayTeamObj.lastSub = '';
												$scope.quarterFinalFixtureObj[m].match_awayTeamObj.player = '';

												$scope.quarterFinalFixtureObj[m].id = "MA" + $rootScope.randomString + 8 + m;
												$scope.quarterFinalFixtureObj[m].match_homeTeam = "";
												$scope.quarterFinalFixtureObj[m].match_awayTeam = "";
												$scope.quarterFinalFixtureObj[m].match_date = moment(quarterFinalDateArr[quarterFinalIndex]).toISOString();
												$scope.quarterFinalFixtureObj[m].match_time = timeArr[1];
												$scope.quarterFinalFixtureObj[m].match_fixture = "quarter final";
												$scope.quarterFinalFixtureObj[m].match_field = 1;
												$scope.quarterFinalFixtureObj[m].match_pair = pair;
												$scope.quarterFinalFixtureObj[m].match_started = "";
												$scope.quarterFinalFixtureObj[m].competition_id = entry.id;
												$scope.quarterFinalFixtureObj[m].match_venue = entry.comp_address.venue.nama;

									
												if(moment(quarterFinalDateArr[quarterFinalIndex]).format('dddd') === 'Monday'){
													$scope.quarterFinalFixtureObj[m].match_referee = $scope.avMonRef[timeIndex][refereeIndex].username;
													$scope.quarterFinalFixtureObj[m].match_analyst = $scope.avMonAnalysts[timeIndex][analystIndex].username;
												}else if(moment(quarterFinalDateArr[quarterFinalIndex]).format('dddd') === 'Tuesday'){
													$scope.quarterFinalFixtureObj[m].match_referee = $scope.avTueRef[timeIndex][refereeIndex].username;
													$scope.quarterFinalFixtureObj[m].match_analyst = $scope.avTueAnalysts[timeIndex][analystIndex].username;
												}else if(moment(quarterFinalDateArr[quarterFinalIndex]).format('dddd') === 'Wednesday'){
													$scope.quarterFinalFixtureObj[m].match_referee = $scope.avWedRef[timeIndex][refereeIndex].username;
													$scope.quarterFinalFixtureObj[m].match_analyst = $scope.avWedAnalysts[timeIndex][analystIndex].username;
												}else if(moment(quarterFinalDateArr[quarterFinalIndex]).format('dddd') === 'Thursday'){
													$scope.quarterFinalFixtureObj[m].match_referee = $scope.avThuRef[timeIndex][refereeIndex].username;
													$scope.quarterFinalFixtureObj[m].match_analyst = $scope.avThuAnalysts[timeIndex][analystIndex].username;
												}else if(moment(quarterFinalDateArr[quarterFinalIndex]).format('dddd') === 'Friday'){
													$scope.quarterFinalFixtureObj[m].match_referee = $scope.avFriRef[timeIndex][refereeIndex].username;
													$scope.quarterFinalFixtureObj[m].match_analyst = $scope.avFriAnalysts[timeIndex][analystIndex].username;
												}else if(moment(quarterFinalDateArr[quarterFinalIndex]).format('dddd') === 'Saturday'){
													$scope.quarterFinalFixtureObj[m].match_referee = $scope.avSatRef[timeIndex][refereeIndex].username;
													$scope.quarterFinalFixtureObj[m].match_analyst = $scope.avSatAnalysts[timeIndex][analystIndex].username;
												}else if(moment(quarterFinalDateArr[quarterFinalIndex]).format('dddd') === 'Sunday'){
													$scope.quarterFinalFixtureObj[m].match_referee = $scope.avSunRef[timeIndex][refereeIndex].username;
													$scope.quarterFinalFixtureObj[m].match_analyst = $scope.avSunAnalysts[timeIndex][analystIndex].username;
												}
											
												refereeIndex++;
												analystIndex++;
												quarterFinalIndex++;
												if(m % 2 != 0){
													pair++;
												}
											}
											console.log($scope.quarterFinalFixtureObj);
										},6000);
										

										// Semi Final
										setTimeout(function(){
											refereeIndex = 0;
											analystIndex = 0;

											for(m = 0; m < 2; m++){
												$scope.semiFinalFixtureObj[m] = {};
												$scope.semiFinalFixtureObj[m].match_homeTeamObj = {};
												$scope.semiFinalFixtureObj[m].match_homeTeamObj.team_name = '';
												$scope.semiFinalFixtureObj[m].match_homeTeamObj.score = 0;
												$scope.semiFinalFixtureObj[m].match_homeTeamObj.formation = '';
												$scope.semiFinalFixtureObj[m].match_homeTeamObj.lineup = '';
												$scope.semiFinalFixtureObj[m].match_homeTeamObj.lastLineup = '';
												$scope.semiFinalFixtureObj[m].match_homeTeamObj.sub = '';
												$scope.semiFinalFixtureObj[m].match_homeTeamObj.lastSub = '';
												$scope.semiFinalFixtureObj[m].match_homeTeamObj.player = '';

												$scope.semiFinalFixtureObj[m].match_awayTeamObj = {};
												$scope.semiFinalFixtureObj[m].match_awayTeamObj.team_name = '';
												$scope.semiFinalFixtureObj[m].match_awayTeamObj.score = 0;
												$scope.semiFinalFixtureObj[m].match_awayTeamObj.formation = '';
												$scope.semiFinalFixtureObj[m].match_awayTeamObj.lineup = '';
												$scope.semiFinalFixtureObj[m].match_awayTeamObj.lastLineup = '';
												$scope.semiFinalFixtureObj[m].match_awayTeamObj.sub = '';
												$scope.semiFinalFixtureObj[m].match_awayTeamObj.lastSub = '';
												$scope.semiFinalFixtureObj[m].match_awayTeamObj.player = '';

												$scope.semiFinalFixtureObj[m].id = "MA" + $rootScope.randomString + 4 + m;
												$scope.semiFinalFixtureObj[m].match_homeTeam = "";
												$scope.semiFinalFixtureObj[m].match_awayTeam = "";
												$scope.semiFinalFixtureObj[m].match_date = moment(semiFinalDateArr[semiFinalIndex]).toISOString();
												$scope.semiFinalFixtureObj[m].match_time = timeArr[1];
												$scope.semiFinalFixtureObj[m].match_fixture = "semi final";
												$scope.semiFinalFixtureObj[m].match_field = 1;
												$scope.semiFinalFixtureObj[m].match_pair = 1;
												$scope.semiFinalFixtureObj[m].match_started = "";
												$scope.semiFinalFixtureObj[m].competition_id = entry.id;
												$scope.semiFinalFixtureObj[m].match_venue = entry.comp_address.venue.nama;

									
												if(moment(semiFinalDateArr[semiFinalIndex]).format('dddd') === 'Monday'){
													$scope.semiFinalFixtureObj[m].match_referee = $scope.avMonRef[timeIndex][refereeIndex].username;
													$scope.semiFinalFixtureObj[m].match_analyst = $scope.avMonAnalysts[timeIndex][analystIndex].username;
												}else if(moment(semiFinalDateArr[semiFinalIndex]).format('dddd') === 'Tuesday'){
													$scope.semiFinalFixtureObj[m].match_referee = $scope.avTueRef[timeIndex][refereeIndex].username;
													$scope.semiFinalFixtureObj[m].match_analyst = $scope.avTueAnalysts[timeIndex][analystIndex].username;
												}else if(moment(semiFinalDateArr[semiFinalIndex]).format('dddd') === 'Wednesday'){
													$scope.semiFinalFixtureObj[m].match_referee = $scope.avWedRef[timeIndex][refereeIndex].username;
													$scope.semiFinalFixtureObj[m].match_analyst = $scope.avWedAnalysts[timeIndex][analystIndex].username;
												}else if(moment(semiFinalDateArr[semiFinalIndex]).format('dddd') === 'Thursday'){
													$scope.semiFinalFixtureObj[m].match_referee = $scope.avThuRef[timeIndex][refereeIndex].username;
													$scope.semiFinalFixtureObj[m].match_analyst = $scope.avThuAnalysts[timeIndex][analystIndex].username;
												}else if(moment(semiFinalDateArr[semiFinalIndex]).format('dddd') === 'Friday'){
													$scope.semiFinalFixtureObj[m].match_referee = $scope.avFriRef[timeIndex][refereeIndex].username;
													$scope.semiFinalFixtureObj[m].match_analyst = $scope.avFriAnalysts[timeIndex][analystIndex].username;
												}else if(moment(semiFinalDateArr[semiFinalIndex]).format('dddd') === 'Saturday'){
													$scope.semiFinalFixtureObj[m].match_referee = $scope.avSatRef[timeIndex][refereeIndex].username;
													$scope.semiFinalFixtureObj[m].match_analyst = $scope.avSatAnalysts[timeIndex][analystIndex].username;
												}else if(moment(semiFinalDateArr[semiFinalIndex]).format('dddd') === 'Sunday'){
													$scope.semiFinalFixtureObj[m].match_referee = $scope.avSunRef[timeIndex][refereeIndex].username;
													$scope.semiFinalFixtureObj[m].match_analyst = $scope.avSunAnalysts[timeIndex][analystIndex].username;
												}
											
												refereeIndex++;
												analystIndex++;
												semiFinalIndex++;
											}
											console.log($scope.semiFinalFixtureObj);
										},6000);
									
										// Third Place
										setTimeout(function(){
											refereeIndex = 0;
											analystIndex = 0;

											$scope.thirdPlaceFixtureObj = {};
											$scope.thirdPlaceFixtureObj.match_homeTeamObj = {};
											$scope.thirdPlaceFixtureObj.match_homeTeamObj.team_name = '';
											$scope.thirdPlaceFixtureObj.match_homeTeamObj.score = 0;
											$scope.thirdPlaceFixtureObj.match_homeTeamObj.formation = '';
											$scope.thirdPlaceFixtureObj.match_homeTeamObj.lineup = '';
											$scope.thirdPlaceFixtureObj.match_homeTeamObj.lastLineup = '';
											$scope.thirdPlaceFixtureObj.match_homeTeamObj.sub = '';
											$scope.thirdPlaceFixtureObj.match_homeTeamObj.lastSub = '';
											$scope.thirdPlaceFixtureObj.match_homeTeamObj.player = '';

											$scope.thirdPlaceFixtureObj.match_awayTeamObj = {};
											$scope.thirdPlaceFixtureObj.match_awayTeamObj.team_name = '';
											$scope.thirdPlaceFixtureObj.match_awayTeamObj.score = 0;
											$scope.thirdPlaceFixtureObj.match_awayTeamObj.formation = '';
											$scope.thirdPlaceFixtureObj.match_awayTeamObj.lineup = '';
											$scope.thirdPlaceFixtureObj.match_awayTeamObj.lastLineup = '';
											$scope.thirdPlaceFixtureObj.match_awayTeamObj.sub = '';
											$scope.thirdPlaceFixtureObj.match_awayTeamObj.lastSub = '';
											$scope.thirdPlaceFixtureObj.match_awayTeamObj.player = '';

											$scope.thirdPlaceFixtureObj.id = "MA" + $rootScope.randomString + 3 + m;
											$scope.thirdPlaceFixtureObj.match_homeTeam = "";
											$scope.thirdPlaceFixtureObj.match_awayTeam = "";
											$scope.thirdPlaceFixtureObj.match_date = moment(thirdPlaceDate).toISOString();
											$scope.thirdPlaceFixtureObj.match_time = timeArr[1];
											$scope.thirdPlaceFixtureObj.match_fixture = "third place";
											$scope.thirdPlaceFixtureObj.match_field = 1;
											$scope.thirdPlaceFixtureObj.match_pair = 1;
											$scope.thirdPlaceFixtureObj.match_started = "";
											$scope.thirdPlaceFixtureObj.competition_id = entry.id;
											$scope.thirdPlaceFixtureObj.match_venue = entry.comp_address.venue.nama;

											if(moment(thirdPlaceDate).format('dddd') === 'Monday'){
												$scope.thirdPlaceFixtureObj.match_referee = $scope.avMonRef[timeIndex][refereeIndex].username;
												$scope.thirdPlaceFixtureObj.match_analyst = $scope.avMonAnalysts[timeIndex][analystIndex].username;
											}else if(moment(thirdPlaceDate).format('dddd') === 'Tuesday'){
												$scope.thirdPlaceFixtureObj.match_referee = $scope.avTueRef[timeIndex][refereeIndex].username;
												$scope.thirdPlaceFixtureObj.match_analyst = $scope.avTueAnalysts[timeIndex][analystIndex].username;
											}else if(moment(thirdPlaceDate).format('dddd') === 'Wednesday'){
												$scope.thirdPlaceFixtureObj.match_referee = $scope.avWedRef[timeIndex][refereeIndex].username;
												$scope.thirdPlaceFixtureObj.match_analyst = $scope.avWedAnalysts[timeIndex][analystIndex].username;
											}else if(moment(thirdPlaceDate).format('dddd') === 'Thursday'){
												$scope.thirdPlaceFixtureObj.match_referee = $scope.avThuRef[timeIndex][refereeIndex].username;
												$scope.thirdPlaceFixtureObj.match_analyst = $scope.avThuAnalysts[timeIndex][analystIndex].username;
											}else if(moment(thirdPlaceDate).format('dddd') === 'Friday'){
												$scope.thirdPlaceFixtureObj.match_referee = $scope.avFriRef[timeIndex][refereeIndex].username;
												$scope.thirdPlaceFixtureObj.match_analyst = $scope.avFriAnalysts[timeIndex][analystIndex].username;
											}else if(moment(thirdPlaceDate).format('dddd') === 'Saturday'){
												$scope.thirdPlaceFixtureObj.match_referee = $scope.avSatRef[timeIndex][refereeIndex].username;
												$scope.thirdPlaceFixtureObj.match_analyst = $scope.avSatAnalysts[timeIndex][analystIndex].username;
											}else if(moment(thirdPlaceDate).format('dddd') === 'Sunday'){
												$scope.thirdPlaceFixtureObj.match_referee = $scope.avSunRef[timeIndex][refereeIndex].username;
												$scope.thirdPlaceFixtureObj.match_analyst = $scope.avSunAnalysts[timeIndex][analystIndex].username;
											}
											console.log($scope.thirdPlaceFixtureObj);
										},6000);
										

										// Final
										setTimeout(function(){
											refereeIndex = 1;
											analystIndex = 1;

											$scope.finalFixtureObj = {};
											$scope.finalFixtureObj.match_homeTeamObj = {};
											$scope.finalFixtureObj.match_homeTeamObj.team_name = '';
											$scope.finalFixtureObj.match_homeTeamObj.score = 0;
											$scope.finalFixtureObj.match_homeTeamObj.formation = '';
											$scope.finalFixtureObj.match_homeTeamObj.lineup = '';
											$scope.finalFixtureObj.match_homeTeamObj.lastLineup = '';
											$scope.finalFixtureObj.match_homeTeamObj.sub = '';
											$scope.finalFixtureObj.match_homeTeamObj.lastSub = '';
											$scope.finalFixtureObj.match_homeTeamObj.player = '';

											$scope.finalFixtureObj.match_awayTeamObj = {};
											$scope.finalFixtureObj.match_awayTeamObj.team_name = '';
											$scope.finalFixtureObj.match_awayTeamObj.score = 0;
											$scope.finalFixtureObj.match_awayTeamObj.formation = '';
											$scope.finalFixtureObj.match_awayTeamObj.lineup = '';
											$scope.finalFixtureObj.match_awayTeamObj.lastLineup = '';
											$scope.finalFixtureObj.match_awayTeamObj.sub = '';
											$scope.finalFixtureObj.match_awayTeamObj.lastSub = '';
											$scope.finalFixtureObj.match_awayTeamObj.player = '';

											$scope.finalFixtureObj.id = "MA" + $rootScope.randomString + 1 + m;
											$scope.finalFixtureObj.match_homeTeam = "";
											$scope.finalFixtureObj.match_awayTeam = "";
											$scope.finalFixtureObj.match_date = moment(finalDate).toISOString();
											$scope.finalFixtureObj.match_time = timeArr[1];
											$scope.finalFixtureObj.match_fixture = "final";
											$scope.finalFixtureObj.match_field = 1;
											$scope.finalFixtureObj.match_started = "";
											$scope.finalFixtureObj.competition_id = entry.id;
											$scope.finalFixtureObj.match_venue = entry.comp_address.venue.nama;

											if(moment(finalDate).format('dddd') === 'Monday'){
												$scope.finalFixtureObj.match_referee = $scope.avMonRef[timeIndex][refereeIndex].username;
												$scope.finalFixtureObj.match_analyst = $scope.avMonAnalysts[timeIndex][analystIndex].username;
											}else if(moment(finalDate).format('dddd') === 'Tuesday'){
												$scope.finalFixtureObj.match_referee = $scope.avTueRef[timeIndex][refereeIndex].username;
												$scope.finalFixtureObj.match_analyst = $scope.avTueAnalysts[timeIndex][analystIndex].username;
											}else if(moment(finalDate).format('dddd') === 'Wednesday'){
												$scope.finalFixtureObj.match_referee = $scope.avWedRef[timeIndex][refereeIndex].username;
												$scope.finalFixtureObj.match_analyst = $scope.avWedAnalysts[timeIndex][analystIndex].username;
											}else if(moment(finalDate).format('dddd') === 'Thursday'){
												$scope.finalFixtureObj.match_referee = $scope.avThuRef[timeIndex][refereeIndex].username;
												$scope.finalFixtureObj.match_analyst = $scope.avThuAnalysts[timeIndex][analystIndex].username;
											}else if(moment(finalDate).format('dddd') === 'Friday'){
												$scope.finalFixtureObj.match_referee = $scope.avFriRef[timeIndex][refereeIndex].username;
												$scope.finalFixtureObj.match_analyst = $scope.avFriAnalysts[timeIndex][analystIndex].username;
											}else if(moment(finalDate).format('dddd') === 'Saturday'){
												$scope.finalFixtureObj.match_referee = $scope.avSatRef[timeIndex][refereeIndex].username;
												$scope.finalFixtureObj.match_analyst = $scope.avSatAnalysts[timeIndex][analystIndex].username;
											}else if(moment(finalDate).format('dddd') === 'Sunday'){
												$scope.finalFixtureObj.match_referee = $scope.avSunRef[timeIndex][refereeIndex].username;
												$scope.finalFixtureObj.match_analyst = $scope.avSunAnalysts[timeIndex][analystIndex].username;
											}
											console.log($scope.finalFixtureObj);											
										},6000);									
									}

								// 14 Days (done)
								}else if(numOfDays === 14){
									console.log("14");
									if(entry.comp_numOfTeam === 32){
										console.log("32");
										var fixture1Date = moment(new Date(entry.comp_start));
										var fixture2Date = moment(new Date(entry.comp_start)).add(1, 'days');
										var fixture3Date = moment(new Date(entry.comp_start)).add(2, 'days');
										var roundOf16Date1 = moment(new Date(entry.comp_start)).add(4, 'days');
										var roundOf16Date2 = moment(new Date(entry.comp_start)).add(5, 'days');
										var quarterFinalDate = moment(new Date(entry.comp_start)).add(7, 'days');
										var roundOf16Index = 0;				
										var roundOf16DateArr = [];
										roundOf16DateArr.push(roundOf16Date1,roundOf16Date2);	
									}else if(entry.comp_numOfTeam === 16){
										console.log("16");
										var fixture1Date = moment(new Date(entry.comp_start));
										var fixture2Date = moment(new Date(entry.comp_start)).add(2, 'days');
										var fixture3Date = moment(new Date(entry.comp_start)).add(4, 'days');
										var quarterFinalDate1 = moment(new Date(entry.comp_start)).add(6, 'days');
										var quarterFinalDate2 = moment(new Date(entry.comp_start)).add(7, 'days');
										var quarterFinalIndex = 0;
										var quarterFinalDateArr = [];	
										quarterFinalDateArr.push(quarterFinalDate1,quarterFinalDate2);
									}else{
										console.log("8");
										var fixture1Date1 = moment(new Date(entry.comp_start));
										var fixture1Date2 = moment(new Date(entry.comp_start)).add(1, 'days');;
										var fixture2Date1 = moment(new Date(entry.comp_start)).add(3, 'days');
										var fixture2Date2 = moment(new Date(entry.comp_start)).add(4, 'days');
										var fixture3Date1 = moment(new Date(entry.comp_start)).add(6, 'days');
										var fixture3Date2 = moment(new Date(entry.comp_start)).add(7, 'days');
										var fixture1Index = 0;		
										var fixture2Index = 0;		
										var fixture3Index = 0;				
										var fixture1DateArr = [];
										var fixture2DateArr = [];
										var fixture3DateArr = [];
										fixture1DateArr.push(fixture1Date1,fixture1Date2);
										fixture2DateArr.push(fixture2Date1,fixture2Date2);	
										fixture3DateArr.push(fixture3Date1,fixture3Date2);	
									}

									var semiFinalDate = moment(new Date(entry.comp_start)).add(10, 'days');
									var thirdPlaceDate = moment(new Date(entry.comp_start)).add(12, 'days');
									var finalDate = entry.comp_finish;

									var firstRoundGroupIndex = 0;
									var secondRoundGroupIndex = 0;
									var thirdRoundGroupIndex = 0;
									var semiFinalIndex = 0;
									var semiFinalDateArr = [];
									var timeArr = ["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00"];
									var fieldArr = [1,2,3];


									// Fixture 1
									var timeIndex = 0;
									var fieldIndex = 0;
									var refereeIndex = 0;
									var analystIndex = 0;

									// get day based on date
									console.log(moment(fixture1Date).format('dddd')); 

									setTimeout(function(){
										var timeIndex = 0;
										var fieldIndex = 0;
										var refereeIndex = 0;
										var analystIndex = 0;

										for(t = 0; t < $scope.firstRoundHomeTeam.length; t++){
											$scope.firstRoundFixtureObj[t] = {};
											$scope.firstRoundFixtureObj[t].match_homeTeamObj = {};
											$scope.firstRoundFixtureObj[t].match_homeTeamObj.team_name = $scope.firstRoundHomeTeam[t];
											$scope.firstRoundFixtureObj[t].match_homeTeamObj.score = 0;
											$scope.firstRoundFixtureObj[t].match_homeTeamObj.formation = '';
											$scope.firstRoundFixtureObj[t].match_homeTeamObj.lineup = '';
											$scope.firstRoundFixtureObj[t].match_homeTeamObj.lastLineup = '';
											$scope.firstRoundFixtureObj[t].match_homeTeamObj.sub = '';
											$scope.firstRoundFixtureObj[t].match_homeTeamObj.lastSub = '';
											$scope.firstRoundFixtureObj[t].match_homeTeamObj.player = '';

											$scope.firstRoundFixtureObj[t].match_awayTeamObj = {};
											$scope.firstRoundFixtureObj[t].match_awayTeamObj.team_name = $scope.firstRoundAwayTeam[t];
											$scope.firstRoundFixtureObj[t].match_awayTeamObj.score = 0;
											$scope.firstRoundFixtureObj[t].match_awayTeamObj.formation = '';
											$scope.firstRoundFixtureObj[t].match_awayTeamObj.lineup = '';
											$scope.firstRoundFixtureObj[t].match_awayTeamObj.lastLineup = '';
											$scope.firstRoundFixtureObj[t].match_awayTeamObj.sub = '';
											$scope.firstRoundFixtureObj[t].match_awayTeamObj.lastSub = '';
											$scope.firstRoundFixtureObj[t].match_awayTeamObj.player = '';

											$scope.firstRoundFixtureObj[t].id = "MA" + $rootScope.randomString + 1 + firstRoundGroupIndex + t;
											$scope.firstRoundFixtureObj[t].match_homeTeam = $scope.firstRoundHomeTeam[t];
											$scope.firstRoundFixtureObj[t].match_awayTeam = $scope.firstRoundAwayTeam[t];
											$scope.firstRoundFixtureObj[t].match_group = $scope.firstRoundMatches.group[firstRoundGroupIndex];
											$scope.firstRoundFixtureObj[t].match_fixture = "fixture 1";
											$scope.firstRoundFixtureObj[t].match_field = fieldArr[fieldIndex];
											$scope.firstRoundFixtureObj[t].fixture_number = 1;
											$scope.firstRoundFixtureObj[t].competition_id = entry.id;
											$scope.firstRoundFixtureObj[t].match_date = moment(fixture1Date).toISOString();
											$scope.firstRoundFixtureObj[t].match_time = timeArr[timeIndex];
											$scope.firstRoundFixtureObj[t].match_venue = entry.comp_address.venue.nama;
										
											if(moment(fixture1Date).format('dddd') === 'Monday'){
												$scope.firstRoundFixtureObj[t].match_referee = $scope.avMonRef[timeIndex][refereeIndex].username;
												$scope.firstRoundFixtureObj[t].match_analyst = $scope.avMonAnalysts[timeIndex][analystIndex].username;
											}else if(moment(fixture1Date).format('dddd') === 'Tuesday'){
												$scope.firstRoundFixtureObj[t].match_referee = $scope.avTueRef[timeIndex][refereeIndex].username;
												$scope.firstRoundFixtureObj[t].match_analyst = $scope.avTueAnalysts[timeIndex][analystIndex].username;
											}else if(moment(fixture1Date).format('dddd') === 'Wednesday'){
												$scope.firstRoundFixtureObj[t].match_referee = $scope.avWedRef[timeIndex][refereeIndex].username;
												$scope.firstRoundFixtureObj[t].match_analyst = $scope.avWedAnalysts[timeIndex][analystIndex].username;
											}else if(moment(fixture1Date).format('dddd') === 'Thursday'){
												$scope.firstRoundFixtureObj[t].match_referee = $scope.avThuRef[timeIndex][refereeIndex].username;
												$scope.firstRoundFixtureObj[t].match_analyst = $scope.avThuAnalysts[timeIndex][analystIndex].username;
											}else if(moment(fixture1Date).format('dddd') === 'Friday'){
												$scope.firstRoundFixtureObj[t].match_referee = $scope.avFriRef[timeIndex][refereeIndex].username;
												$scope.firstRoundFixtureObj[t].match_analyst = $scope.avFriAnalysts[timeIndex][analystIndex].username;
											}else if(moment(fixture1Date).format('dddd') === 'Saturday'){
												$scope.firstRoundFixtureObj[t].match_referee = $scope.avSatRef[timeIndex][refereeIndex].username;
												$scope.firstRoundFixtureObj[t].match_analyst = $scope.avSatAnalysts[timeIndex][analystIndex].username;
											}else if(moment(fixture1Date).format('dddd') === 'Sunday'){
												$scope.firstRoundFixtureObj[t].match_referee = $scope.avSunRef[timeIndex][refereeIndex].username;
												$scope.firstRoundFixtureObj[t].match_analyst = $scope.avSunAnalysts[timeIndex][analystIndex].username;
											}

											fieldIndex++;
											refereeIndex++;
											analystIndex++;
											if(t % 2 != 0){
												firstRoundGroupIndex++;
											}

											if(entry.comp_numOfTeam !== 8){
												if((t+1) % 3 == 0){
													timeIndex++;
													fieldIndex = 0;
												}
											}
											console.log(timeIndex);
											if((timeIndex % 2 == 0) && (fieldIndex == 0)){
												refereeIndex = 0;
												analystIndex = 0;
											}

											if(entry.comp_numOfTeam === 8){
												timeIndex++;
												$scope.firstRoundFixtureObj[t].match_date = moment(fixture1DateArr[fixture1Index]).toISOString();
												$scope.firstRoundFixtureObj[t].match_field = "1";
												if((t+1) % 2 == 0){
													fixture1Index++;
													timeIndex = 0;
												}
											}
										}
										console.log($scope.firstRoundFixtureObj);
									},6000);

									// Fixture 2
									setTimeout(function(){
										timeIndex = 0;
										fieldIndex = 0;
										// refereeIndex = 0;
										for(t = 0; t < $scope.secondRoundHomeTeam.length; t++){
											$scope.secondRoundFixtureObj[t] = {};
											$scope.secondRoundFixtureObj[t].match_homeTeamObj = {};
											$scope.secondRoundFixtureObj[t].match_homeTeamObj.team_name = $scope.secondRoundHomeTeam[t];
											$scope.secondRoundFixtureObj[t].match_homeTeamObj.score = 0;
											$scope.secondRoundFixtureObj[t].match_homeTeamObj.formation = '';
											$scope.secondRoundFixtureObj[t].match_homeTeamObj.lineup = '';
											$scope.secondRoundFixtureObj[t].match_homeTeamObj.lastLineup = '';
											$scope.secondRoundFixtureObj[t].match_homeTeamObj.sub = '';
											$scope.secondRoundFixtureObj[t].match_homeTeamObj.lastSub = '';
											$scope.secondRoundFixtureObj[t].match_homeTeamObj.player = '';

											$scope.secondRoundFixtureObj[t].match_awayTeamObj = {};
											$scope.secondRoundFixtureObj[t].match_awayTeamObj.team_name = $scope.secondRoundAwayTeam[t];
											$scope.secondRoundFixtureObj[t].match_awayTeamObj.score = 0;
											$scope.secondRoundFixtureObj[t].match_awayTeamObj.formation = '';
											$scope.secondRoundFixtureObj[t].match_awayTeamObj.lineup = '';
											$scope.secondRoundFixtureObj[t].match_awayTeamObj.lastLineup = '';
											$scope.secondRoundFixtureObj[t].match_awayTeamObj.sub = '';
											$scope.secondRoundFixtureObj[t].match_awayTeamObj.lastSub = '';
											$scope.secondRoundFixtureObj[t].match_awayTeamObj.player = '';

											$scope.secondRoundFixtureObj[t].id = "MA" + $rootScope.randomString + 2 + secondRoundGroupIndex + t;
											$scope.secondRoundFixtureObj[t].match_homeTeam = $scope.secondRoundHomeTeam[t];
											$scope.secondRoundFixtureObj[t].match_awayTeam = $scope.secondRoundAwayTeam[t];
											$scope.secondRoundFixtureObj[t].match_group = $scope.secondRoundMatches.group[secondRoundGroupIndex];
											$scope.secondRoundFixtureObj[t].match_date = moment(fixture2Date).toISOString();
											$scope.secondRoundFixtureObj[t].match_time = timeArr[timeIndex];
											$scope.secondRoundFixtureObj[t].match_fixture = "fixture 2";
											$scope.secondRoundFixtureObj[t].match_field = fieldArr[fieldIndex];
											$scope.secondRoundFixtureObj[t].match_started = "";
											$scope.secondRoundFixtureObj[t].fixture_number = 2;
											$scope.secondRoundFixtureObj[t].competition_id = entry.id;
											$scope.secondRoundFixtureObj[t].match_venue = entry.comp_address.venue.nama;

											if(moment(fixture2Date).format('dddd') === 'Monday'){
												$scope.secondRoundFixtureObj[t].match_referee = $scope.avMonRef[timeIndex][refereeIndex].username;
												$scope.secondRoundFixtureObj[t].match_analyst = $scope.avMonAnalysts[timeIndex][analystIndex].username;
											}else if(moment(fixture2Date).format('dddd') === 'Tuesday'){
												$scope.secondRoundFixtureObj[t].match_referee = $scope.avTueRef[timeIndex][refereeIndex].username;
												$scope.secondRoundFixtureObj[t].match_analyst = $scope.avTueAnalysts[timeIndex][analystIndex].username;
											}else if(moment(fixture2Date).format('dddd') === 'Wednesday'){
												$scope.secondRoundFixtureObj[t].match_referee = $scope.avWedRef[timeIndex][refereeIndex].username;
												$scope.secondRoundFixtureObj[t].match_analyst = $scope.avWedAnalysts[timeIndex][analystIndex].username;
											}else if(moment(fixture2Date).format('dddd') === 'Thursday'){
												$scope.secondRoundFixtureObj[t].match_referee = $scope.avThuRef[timeIndex][refereeIndex].username;
												$scope.secondRoundFixtureObj[t].match_analyst = $scope.avThuAnalysts[timeIndex][analystIndex].username;
											}else if(moment(fixture2Date).format('dddd') === 'Friday'){
												$scope.secondRoundFixtureObj[t].match_referee = $scope.avFriRef[timeIndex][refereeIndex].username;
												$scope.secondRoundFixtureObj[t].match_analyst = $scope.avFriAnalysts[timeIndex][analystIndex].username;
											}else if(moment(fixture2Date).format('dddd') === 'Saturday'){
												$scope.secondRoundFixtureObj[t].match_referee = $scope.avSatRef[timeIndex][refereeIndex].username;
												$scope.secondRoundFixtureObj[t].match_analyst = $scope.avSatAnalysts[timeIndex][analystIndex].username;
											}else if(moment(fixture2Date).format('dddd') === 'Sunday'){
												$scope.secondRoundFixtureObj[t].match_referee = $scope.avSunRef[timeIndex][refereeIndex].username;
												$scope.secondRoundFixtureObj[t].match_analyst = $scope.avSunAnalysts[timeIndex][analystIndex].username;
											}

											refereeIndex++;
											analystIndex++;
											fieldIndex++;
											if(t % 2 != 0){
												secondRoundGroupIndex++;
											}

											if(entry.comp_numOfTeam !== 8){
												if((t+1) % 3 == 0){
													timeIndex++;
													fieldIndex = 0;
												}
											}

											console.log(timeIndex);
											if((timeIndex % 2 == 0) && (fieldIndex == 0)){
												refereeIndex = 0;
												analystIndex = 0;
											}

											if(entry.comp_numOfTeam === 8){
												timeIndex++;
												$scope.secondRoundFixtureObj[t].match_date = moment(fixture2DateArr[fixture2Index]).toISOString();
												$scope.secondRoundFixtureObj[t].match_field = "1";
												if((t+1) % 2 == 0){
													fixture2Index++;
													timeIndex = 0;
												}
											}
										}
										console.log($scope.secondRoundFixtureObj);
									},6000);

									// Fixture 3
									setTimeout(function(){
										timeIndex = 0;
										fieldIndex = 0;
										refereeIndex = 0;
										analystIndex = 0;
										for(t = 0; t < $scope.thirdRoundHomeTeam.length; t++){
											$scope.thirdRoundFixtureObj[t] = {};
											$scope.thirdRoundFixtureObj[t].match_homeTeamObj = {};
											$scope.thirdRoundFixtureObj[t].match_homeTeamObj.team_name = $scope.thirdRoundHomeTeam[t];
											$scope.thirdRoundFixtureObj[t].match_homeTeamObj.score = 0;
											$scope.thirdRoundFixtureObj[t].match_homeTeamObj.formation = '';
											$scope.thirdRoundFixtureObj[t].match_homeTeamObj.lineup = '';
											$scope.thirdRoundFixtureObj[t].match_homeTeamObj.lastLineup = '';
											$scope.thirdRoundFixtureObj[t].match_homeTeamObj.sub = '';
											$scope.thirdRoundFixtureObj[t].match_homeTeamObj.lastSub = '';
											$scope.thirdRoundFixtureObj[t].match_homeTeamObj.player = '';

											$scope.thirdRoundFixtureObj[t].match_awayTeamObj = {};
											$scope.thirdRoundFixtureObj[t].match_awayTeamObj.team_name = $scope.thirdRoundAwayTeam[t];
											$scope.thirdRoundFixtureObj[t].match_awayTeamObj.score = 0;
											$scope.thirdRoundFixtureObj[t].match_awayTeamObj.formation = '';
											$scope.thirdRoundFixtureObj[t].match_awayTeamObj.lineup = '';
											$scope.thirdRoundFixtureObj[t].match_awayTeamObj.lastLineup = '';
											$scope.thirdRoundFixtureObj[t].match_awayTeamObj.sub = '';
											$scope.thirdRoundFixtureObj[t].match_awayTeamObj.lastSub = '';
											$scope.thirdRoundFixtureObj[t].match_awayTeamObj.player = '';

											$scope.thirdRoundFixtureObj[t].id = "MA" + $rootScope.randomString + 3 + secondRoundGroupIndex + t;
											$scope.thirdRoundFixtureObj[t].match_homeTeam = $scope.thirdRoundHomeTeam[t];
											$scope.thirdRoundFixtureObj[t].match_awayTeam = $scope.thirdRoundAwayTeam[t];
											$scope.thirdRoundFixtureObj[t].match_group = $scope.thirdRoundMatches.group[thirdRoundGroupIndex];
											$scope.thirdRoundFixtureObj[t].match_date = moment(fixture3Date).toISOString();
											$scope.thirdRoundFixtureObj[t].match_time = timeArr[timeIndex];
											$scope.thirdRoundFixtureObj[t].match_fixture = "fixture 3"
											$scope.thirdRoundFixtureObj[t].match_field = fieldArr[fieldIndex];
											$scope.thirdRoundFixtureObj[t].match_started = "";
											$scope.thirdRoundFixtureObj[t].fixture_number = 3;
											$scope.thirdRoundFixtureObj[t].competition_id = entry.id;
											$scope.thirdRoundFixtureObj[t].match_venue = entry.comp_address.venue.nama;

											if(moment(fixture3Date).format('dddd') === 'Monday'){
												$scope.thirdRoundFixtureObj[t].match_referee = $scope.avMonRef[timeIndex][refereeIndex].username;
												$scope.thirdRoundFixtureObj[t].match_analyst = $scope.avMonAnalysts[timeIndex][analystIndex].username;
											}else if(moment(fixture3Date).format('dddd') === 'Tuesday'){
												$scope.thirdRoundFixtureObj[t].match_referee = $scope.avTueRef[timeIndex][refereeIndex].username;
												$scope.thirdRoundFixtureObj[t].match_analyst = $scope.avTueAnalysts[timeIndex][analystIndex].username;
											}else if(moment(fixture3Date).format('dddd') === 'Wednesday'){
												$scope.thirdRoundFixtureObj[t].match_referee = $scope.avWedRef[timeIndex][refereeIndex].username;
												$scope.thirdRoundFixtureObj[t].match_analyst = $scope.avWedAnalysts[timeIndex][analystIndex].username;
											}else if(moment(fixture3Date).format('dddd') === 'Thursday'){
												$scope.thirdRoundFixtureObj[t].match_referee = $scope.avThuRef[timeIndex][refereeIndex].username;
												$scope.thirdRoundFixtureObj[t].match_analyst = $scope.avThuAnalysts[timeIndex][analystIndex].username;
											}else if(moment(fixture3Date).format('dddd') === 'Friday'){
												$scope.thirdRoundFixtureObj[t].match_referee = $scope.avFriRef[timeIndex][refereeIndex].username;
												$scope.thirdRoundFixtureObj[t].match_analyst = $scope.avFriAnalysts[timeIndex][analystIndex].username;
											}else if(moment(fixture3Date).format('dddd') === 'Saturday'){
												$scope.thirdRoundFixtureObj[t].match_referee = $scope.avSatRef[timeIndex][refereeIndex].username;
												$scope.thirdRoundFixtureObj[t].match_analyst = $scope.avSatAnalysts[timeIndex][analystIndex].username;
											}else if(moment(fixture3Date).format('dddd') === 'Sunday'){
												$scope.thirdRoundFixtureObj[t].match_referee = $scope.avSunRef[timeIndex][refereeIndex].username;
												$scope.thirdRoundFixtureObj[t].match_analyst = $scope.avSunAnalysts[timeIndex][analystIndex].username;
											}

											refereeIndex++;
											analystIndex++;
											fieldIndex++;
											if(t % 2 != 0){
												thirdRoundGroupIndex++;
											}

											if(entry.comp_numOfTeam !== 8){
												if((t+1) % 3 == 0){
													timeIndex++;
													fieldIndex = 0;
												}
											}

											console.log(timeIndex);
											if((timeIndex % 2 == 0) && (fieldIndex == 0)){
												refereeIndex = 0;
												analystIndex = 0;
											}
											
											if(entry.comp_numOfTeam === 8){
												timeIndex++;
												$scope.thirdRoundFixtureObj[t].match_date = moment(fixture3DateArr[fixture3Index]).toISOString();
												$scope.thirdRoundFixtureObj[t].match_field = "1";
												if((t+1) % 2 == 0){
													fixture3Index++;
													timeIndex = 0;
												}
											}
										}
										console.log($scope.thirdRoundFixtureObj);
									},6000);

									// Round of 16
									setTimeout(function(){
										if(entry.comp_numOfTeam === 32){
											timeIndex = 0;
											refereeIndex = 0;
											analystIndex = 0;
											var pair = 1;
											for(var m = 0; m < 8; m++){
												$scope.roundOf16FixtureObj[m] = {};
												$scope.roundOf16FixtureObj[m].match_homeTeamObj = {};
												$scope.roundOf16FixtureObj[m].match_homeTeamObj.team_name = '';
												$scope.roundOf16FixtureObj[m].match_homeTeamObj.score = 0;
												$scope.roundOf16FixtureObj[m].match_homeTeamObj.formation = '';
												$scope.roundOf16FixtureObj[m].match_homeTeamObj.lineup = '';
												$scope.roundOf16FixtureObj[m].match_homeTeamObj.lastLineup = '';
												$scope.roundOf16FixtureObj[m].match_homeTeamObj.sub = '';
												$scope.roundOf16FixtureObj[m].match_homeTeamObj.lastSub = '';
												$scope.roundOf16FixtureObj[m].match_homeTeamObj.player = '';

												$scope.roundOf16FixtureObj[m].match_awayTeamObj = {};
												$scope.roundOf16FixtureObj[m].match_awayTeamObj.team_name = '';
												$scope.roundOf16FixtureObj[m].match_awayTeamObj.score = 0;
												$scope.roundOf16FixtureObj[m].match_awayTeamObj.formation = '';
												$scope.roundOf16FixtureObj[m].match_awayTeamObj.lineup = '';
												$scope.roundOf16FixtureObj[m].match_awayTeamObj.lastLineup = '';
												$scope.roundOf16FixtureObj[m].match_awayTeamObj.sub = '';
												$scope.roundOf16FixtureObj[m].match_awayTeamObj.lastSub = '';
												$scope.roundOf16FixtureObj[m].match_awayTeamObj.player = '';

												$scope.roundOf16FixtureObj[m].id = "MA" + $rootScope.randomString + 16 + m;
												$scope.roundOf16FixtureObj[m].match_homeTeam = "";
												$scope.roundOf16FixtureObj[m].match_awayTeam = "";
												$scope.roundOf16FixtureObj[m].match_date = moment(roundOf16DateArr[roundOf16Index]).toISOString();
												$scope.roundOf16FixtureObj[m].match_time = timeArr[timeIndex];
												$scope.roundOf16FixtureObj[m].match_fixture = "round of 16";
												$scope.roundOf16FixtureObj[m].match_field = 1;
												$scope.roundOf16FixtureObj[m].match_pair = pair;
												$scope.roundOf16FixtureObj[m].match_started = "";
												$scope.roundOf16FixtureObj[m].competition_id = entry.id;
												$scope.roundOf16FixtureObj[m].match_venue = entry.comp_address.venue.nama;

												if(moment(roundOf16DateArr[roundOf16Index]).format('dddd') === 'Monday'){
													$scope.roundOf16FixtureObj[m].match_referee = $scope.avMonRef[timeIndex][refereeIndex].username;
													$scope.roundOf16FixtureObj[m].match_analyst = $scope.avMonAnalysts[timeIndex][analystIndex].username;
												}else if(moment(roundOf16DateArr[roundOf16Index]).format('dddd') === 'Tuesday'){
													$scope.roundOf16FixtureObj[m].match_referee = $scope.avTueRef[timeIndex][refereeIndex].username;
													$scope.roundOf16FixtureObj[m].match_analyst = $scope.avTueAnalysts[timeIndex][analystIndex].username;
												}else if(moment(roundOf16DateArr[roundOf16Index]).format('dddd') === 'Wednesday'){
													$scope.roundOf16FixtureObj[m].match_referee = $scope.avWedRef[timeIndex][refereeIndex].username;
													$scope.roundOf16FixtureObj[m].match_analyst = $scope.avWedAnalysts[timeIndex][analystIndex].username;
												}else if(moment(roundOf16DateArr[roundOf16Index]).format('dddd') === 'Thursday'){
													$scope.roundOf16FixtureObj[m].match_referee = $scope.avThuRef[timeIndex][refereeIndex].username;
													$scope.roundOf16FixtureObj[m].match_analyst = $scope.avThuAnalysts[timeIndex][analystIndex].username;
												}else if(moment(roundOf16DateArr[roundOf16Index]).format('dddd') === 'Friday'){
													$scope.roundOf16FixtureObj[m].match_referee = $scope.avFriRef[timeIndex][refereeIndex].username;
													$scope.roundOf16FixtureObj[m].match_analyst = $scope.avFriAnalysts[timeIndex][analystIndex].username;
												}else if(moment(roundOf16DateArr[roundOf16Index]).format('dddd') === 'Saturday'){
													$scope.roundOf16FixtureObj[m].match_referee = $scope.avSatRef[timeIndex][refereeIndex].username;
													$scope.roundOf16FixtureObj[m].match_analyst = $scope.avSatAnalysts[timeIndex][analystIndex].username;
												}else if(moment(roundOf16DateArr[roundOf16Index]).format('dddd') === 'Sunday'){
													$scope.roundOf16FixtureObj[m].match_referee = $scope.avSunRef[timeIndex][refereeIndex].username;
													$scope.roundOf16FixtureObj[m].match_analyst = $scope.avSunAnalysts[timeIndex][analystIndex].username;
												}

												refereeIndex++;
												analystIndex++;
												console.log(timeIndex);
												if((timeIndex % 4 == 0) && (fieldIndex == 0)){
													refereeIndex = 0;
													analystIndex = 0;
												}

												timeIndex = timeIndex + 2;
												if((m+1) % 4 == 0){
													roundOf16Index++;
													timeIndex = 0;
												}

												if(m % 2 != 0){
													pair++;
												}
											}
										}
										console.log($scope.roundOf16FixtureObj);
									},6000);	
									
									// Quarter Final
									setTimeout(function(){
										if(entry.comp_numOfTeam === 16){
											console.log("asjadlajdaskdjad");
											timeIndex = 0;
											refereeIndex = 0;
											analystIndex = 0;
											pair = 1;
											for(m = 0; m < 4; m++){
												$scope.quarterFinalFixtureObj[m] = {};
												$scope.quarterFinalFixtureObj[m].match_homeTeamObj = {};
												$scope.quarterFinalFixtureObj[m].match_homeTeamObj.team_name = '';
												$scope.quarterFinalFixtureObj[m].match_homeTeamObj.score = 0;
												$scope.quarterFinalFixtureObj[m].match_homeTeamObj.formation = '';
												$scope.quarterFinalFixtureObj[m].match_homeTeamObj.lineup = '';
												$scope.quarterFinalFixtureObj[m].match_homeTeamObj.lastLineup = '';
												$scope.quarterFinalFixtureObj[m].match_homeTeamObj.sub = '';
												$scope.quarterFinalFixtureObj[m].match_homeTeamObj.lastSub = '';
												$scope.quarterFinalFixtureObj[m].match_homeTeamObj.player = '';

												$scope.quarterFinalFixtureObj[m].match_awayTeamObj = {};
												$scope.quarterFinalFixtureObj[m].match_awayTeamObj.team_name = '';
												$scope.quarterFinalFixtureObj[m].match_awayTeamObj.score = 0;
												$scope.quarterFinalFixtureObj[m].match_awayTeamObj.formation = '';
												$scope.quarterFinalFixtureObj[m].match_awayTeamObj.lineup = '';
												$scope.quarterFinalFixtureObj[m].match_awayTeamObj.lastLineup = '';
												$scope.quarterFinalFixtureObj[m].match_awayTeamObj.sub = '';
												$scope.quarterFinalFixtureObj[m].match_awayTeamObj.lastSub = '';
												$scope.quarterFinalFixtureObj[m].match_awayTeamObj.player = '';

												$scope.quarterFinalFixtureObj[m].id = "MA" + $rootScope.randomString + 8 + m;
												$scope.quarterFinalFixtureObj[m].match_homeTeam = "";
												$scope.quarterFinalFixtureObj[m].match_awayTeam = "";
												$scope.quarterFinalFixtureObj[m].match_time = timeArr[timeIndex];
												$scope.quarterFinalFixtureObj[m].match_fixture = "quarter final";
												$scope.quarterFinalFixtureObj[m].match_field = 1;
												$scope.quarterFinalFixtureObj[m].match_pair = pair;
												$scope.quarterFinalFixtureObj[m].match_started = "";
												$scope.quarterFinalFixtureObj[m].competition_id = entry.id;
												$scope.quarterFinalFixtureObj[m].match_venue = entry.comp_address.venue.nama;

												timeIndex = timeIndex + 2;
												if(entry.comp_numOfTeam === 32){
													$scope.quarterFinalFixtureObj[m].match_date = moment(quarterFinalDate).toISOString();

													if(moment(quarterFinalDate).format('dddd') === 'Monday'){
														$scope.quarterFinalFixtureObj[m].match_referee = $scope.avMonRef[timeIndex][refereeIndex].username;
														$scope.quarterFinalFixtureObj[m].match_analyst = $scope.avMonAnalysts[timeIndex][analystIndex].username;
													}else if(moment(quarterFinalDate).format('dddd') === 'Tuesday'){
														$scope.quarterFinalFixtureObj[m].match_referee = $scope.avTueRef[timeIndex][refereeIndex].username;
														$scope.quarterFinalFixtureObj[m].match_analyst = $scope.avTueAnalysts[timeIndex][analystIndex].username;
													}else if(moment(quarterFinalDate).format('dddd') === 'Wednesday'){
														$scope.quarterFinalFixtureObj[m].match_referee = $scope.avWedRef[timeIndex][refereeIndex].username;
														$scope.quarterFinalFixtureObj[m].match_analyst = $scope.avWedAnalysts[timeIndex][analystIndex].username;
													}else if(moment(quarterFinalDate).format('dddd') === 'Thursday'){
														$scope.quarterFinalFixtureObj[m].match_referee = $scope.avThuRef[timeIndex][refereeIndex].username;
														$scope.quarterFinalFixtureObj[m].match_analyst = $scope.avThuAnalysts[timeIndex][analystIndex].username;
													}else if(moment(quarterFinalDate).format('dddd') === 'Friday'){
														$scope.quarterFinalFixtureObj[m].match_referee = $scope.avFriRef[timeIndex][refereeIndex].username;
														$scope.quarterFinalFixtureObj[m].match_analyst = $scope.avFriAnalysts[timeIndex][analystIndex].username;
													}else if(moment(quarterFinalDate).format('dddd') === 'Saturday'){
														$scope.quarterFinalFixtureObj[m].match_referee = $scope.avSatRef[timeIndex][refereeIndex].username;
														$scope.quarterFinalFixtureObj[m].match_analyst = $scope.avSatAnalysts[timeIndex][analystIndex].username;
													}else if(moment(quarterFinalDate).format('dddd') === 'Sunday'){
														$scope.quarterFinalFixtureObj[m].match_referee = $scope.avSunRef[timeIndex][refereeIndex].username;
														$scope.quarterFinalFixtureObj[m].match_analyst = $scope.avSunAnalysts[timeIndex][analystIndex].username;
													}

												}else if(entry.comp_numOfTeam === 16){
													$scope.quarterFinalFixtureObj[m].match_date = moment(quarterFinalDateArr[quarterFinalIndex]).toISOString();
													
													if(moment(quarterFinalDateArr[quarterFinalIndex]).format('dddd') === 'Monday'){
														$scope.quarterFinalFixtureObj[m].match_referee = $scope.avMonRef[timeIndex][refereeIndex].username;
														$scope.quarterFinalFixtureObj[m].match_analyst = $scope.avMonAnalysts[timeIndex][analystIndex].username;
													}else if(moment(quarterFinalDateArr[quarterFinalIndex]).format('dddd') === 'Tuesday'){
														$scope.quarterFinalFixtureObj[m].match_referee = $scope.avTueRef[timeIndex][refereeIndex].username;
														$scope.quarterFinalFixtureObj[m].match_analyst = $scope.avTueAnalysts[timeIndex][analystIndex].username;
													}else if(moment(quarterFinalDateArr[quarterFinalIndex]).format('dddd') === 'Wednesday'){
														$scope.quarterFinalFixtureObj[m].match_referee = $scope.avWedRef[timeIndex][refereeIndex].username;
														$scope.quarterFinalFixtureObj[m].match_analyst = $scope.avWedAnalysts[timeIndex][analystIndex].username;
													}else if(moment(quarterFinalDateArr[quarterFinalIndex]).format('dddd') === 'Thursday'){
														$scope.quarterFinalFixtureObj[m].match_referee = $scope.avThuRef[timeIndex][refereeIndex].username;
														$scope.quarterFinalFixtureObj[m].match_analyst = $scope.avThuAnalysts[timeIndex][analystIndex].username;
													}else if(moment(quarterFinalDateArr[quarterFinalIndex]).format('dddd') === 'Friday'){
														$scope.quarterFinalFixtureObj[m].match_referee = $scope.avFriRef[timeIndex][refereeIndex].username;
														$scope.quarterFinalFixtureObj[m].match_analyst = $scope.avFriAnalysts[timeIndex][analystIndex].username;
													}else if(moment(quarterFinalDateArr[quarterFinalIndex]).format('dddd') === 'Saturday'){
														$scope.quarterFinalFixtureObj[m].match_referee = $scope.avSatRef[timeIndex][refereeIndex].username;
														$scope.quarterFinalFixtureObj[m].match_analyst = $scope.avSatAnalysts[timeIndex][analystIndex].username;
													}else if(moment(quarterFinalDateArr[quarterFinalIndex]).format('dddd') === 'Sunday'){
														$scope.quarterFinalFixtureObj[m].match_referee = $scope.avSunRef[timeIndex][refereeIndex].username;
														$scope.quarterFinalFixtureObj[m].match_analyst = $scope.avSunAnalysts[timeIndex][analystIndex].username;
													}

													if((m+1) % 2 == 0){
														quarterFinalIndex++;
														timeIndex = 0;
													}
												}
												if(m % 2 != 0){
													pair++;
												}
												
												refereeIndex++;
												analystIndex++;
												console.log(timeIndex);
												if((timeIndex % 4 == 0) && (fieldIndex == 0)){
													refereeIndex = 0;
													analystIndex = 0;
												}
											}
										}
										console.log($scope.quarterFinalFixtureObj);
									},6000);
									
									// Semi Final
									setTimeout(function(){
										timeIndex = 1;
										refereeIndex = 0;
										analystIndex = 0;
										for(m = 0; m < 2; m++){
											$scope.semiFinalFixtureObj[m] = {};
											$scope.semiFinalFixtureObj[m].match_homeTeamObj = {};
											$scope.semiFinalFixtureObj[m].match_homeTeamObj.team_name = '';
											$scope.semiFinalFixtureObj[m].match_homeTeamObj.score = 0;
											$scope.semiFinalFixtureObj[m].match_homeTeamObj.formation = '';
											$scope.semiFinalFixtureObj[m].match_homeTeamObj.lineup = '';
											$scope.semiFinalFixtureObj[m].match_homeTeamObj.lastLineup = '';
											$scope.semiFinalFixtureObj[m].match_homeTeamObj.sub = '';
											$scope.semiFinalFixtureObj[m].match_homeTeamObj.lastSub = '';
											$scope.semiFinalFixtureObj[m].match_homeTeamObj.player = '';

											$scope.semiFinalFixtureObj[m].match_awayTeamObj = {};
											$scope.semiFinalFixtureObj[m].match_awayTeamObj.team_name = '';
											$scope.semiFinalFixtureObj[m].match_awayTeamObj.score = 0;
											$scope.semiFinalFixtureObj[m].match_awayTeamObj.formation = '';
											$scope.semiFinalFixtureObj[m].match_awayTeamObj.lineup = '';
											$scope.semiFinalFixtureObj[m].match_awayTeamObj.lastLineup = '';
											$scope.semiFinalFixtureObj[m].match_awayTeamObj.sub = '';
											$scope.semiFinalFixtureObj[m].match_awayTeamObj.lastSub = '';
											$scope.semiFinalFixtureObj[m].match_awayTeamObj.player = '';

											$scope.semiFinalFixtureObj[m].id = "MA" + $rootScope.randomString + 4 + m;
											$scope.semiFinalFixtureObj[m].match_homeTeam = "";
											$scope.semiFinalFixtureObj[m].match_awayTeam = "";
											$scope.semiFinalFixtureObj[m].match_date = moment(semiFinalDate).toISOString();
											$scope.semiFinalFixtureObj[m].match_time = timeArr[timeIndex];
											$scope.semiFinalFixtureObj[m].match_fixture = "semi final";
											$scope.semiFinalFixtureObj[m].match_field = 1;
											$scope.semiFinalFixtureObj[m].match_pair = 1;
											$scope.semiFinalFixtureObj[m].match_started = "";
											$scope.semiFinalFixtureObj[m].competition_id = entry.id;
											$scope.semiFinalFixtureObj[m].match_venue = entry.comp_address.venue.nama;

											if(moment(semiFinalDate).format('dddd') === 'Monday'){
												$scope.semiFinalFixtureObj[m].match_referee = $scope.avMonRef[timeIndex][refereeIndex].username;
												$scope.semiFinalFixtureObj[m].match_analyst = $scope.avMonAnalysts[timeIndex][analystIndex].username;
											}else if(moment(semiFinalDate).format('dddd') === 'Tuesday'){
												$scope.semiFinalFixtureObj[m].match_referee = $scope.avTueRef[timeIndex][refereeIndex].username;
												$scope.semiFinalFixtureObj[m].match_analyst = $scope.avTueAnalysts[timeIndex][analystIndex].username;
											}else if(moment(semiFinalDate).format('dddd') === 'Wednesday'){
												$scope.semiFinalFixtureObj[m].match_referee = $scope.avWedRef[timeIndex][refereeIndex].username;
												$scope.semiFinalFixtureObj[m].match_analyst = $scope.avWedAnalysts[timeIndex][analystIndex].username;
											}else if(moment(semiFinalDate).format('dddd') === 'Thursday'){
												$scope.semiFinalFixtureObj[m].match_referee = $scope.avThuRef[timeIndex][refereeIndex].username;
												$scope.semiFinalFixtureObj[m].match_analyst = $scope.avThuAnalysts[timeIndex][analystIndex].username;
											}else if(moment(semiFinalDate).format('dddd') === 'Friday'){
												$scope.semiFinalFixtureObj[m].match_referee = $scope.avFriRef[timeIndex][refereeIndex].username;
												$scope.semiFinalFixtureObj[m].match_analyst = $scope.avFriAnalysts[timeIndex][analystIndex].username;
											}else if(moment(semiFinalDate).format('dddd') === 'Saturday'){
												$scope.semiFinalFixtureObj[m].match_referee = $scope.avSatRef[timeIndex][refereeIndex].username;
												$scope.semiFinalFixtureObj[m].match_analyst = $scope.avSatAnalysts[timeIndex][analystIndex].username;
											}else if(moment(semiFinalDate).format('dddd') === 'Sunday'){
												$scope.semiFinalFixtureObj[m].match_referee = $scope.avSunRef[timeIndex][refereeIndex].username;
												$scope.semiFinalFixtureObj[m].match_analyst = $scope.avSunAnalysts[timeIndex][analystIndex].username;
											}

											semiFinalIndex++;
											timeIndex = timeIndex + 2;
											refereeIndex++;
											analystIndex++;
										}
										console.log($scope.semiFinalFixtureObj);
									},6000);
										
									// Third Place
									setTimeout(function(){
										refereeIndex = 0;
										$scope.thirdPlaceFixtureObj = {};
										$scope.thirdPlaceFixtureObj.match_homeTeamObj = {};
										$scope.thirdPlaceFixtureObj.match_homeTeamObj.team_name = '';
										$scope.thirdPlaceFixtureObj.match_homeTeamObj.score = 0;
										$scope.thirdPlaceFixtureObj.match_homeTeamObj.formation = '';
										$scope.thirdPlaceFixtureObj.match_homeTeamObj.lineup = '';
										$scope.thirdPlaceFixtureObj.match_homeTeamObj.lastLineup = '';
										$scope.thirdPlaceFixtureObj.match_homeTeamObj.sub = '';
										$scope.thirdPlaceFixtureObj.match_homeTeamObj.lastSub = '';
										$scope.thirdPlaceFixtureObj.match_homeTeamObj.player = '';

										$scope.thirdPlaceFixtureObj.match_awayTeamObj = {};
										$scope.thirdPlaceFixtureObj.match_awayTeamObj.team_name = '';
										$scope.thirdPlaceFixtureObj.match_awayTeamObj.score = 0;
										$scope.thirdPlaceFixtureObj.match_awayTeamObj.formation = '';
										$scope.thirdPlaceFixtureObj.match_awayTeamObj.lineup = '';
										$scope.thirdPlaceFixtureObj.match_awayTeamObj.lastLineup = '';
										$scope.thirdPlaceFixtureObj.match_awayTeamObj.sub = '';
										$scope.thirdPlaceFixtureObj.match_awayTeamObj.lastSub = '';
										$scope.thirdPlaceFixtureObj.match_awayTeamObj.player = '';

										$scope.thirdPlaceFixtureObj.id = "MA" + $rootScope.randomString + 3 + m;
										$scope.thirdPlaceFixtureObj.match_homeTeam = "";
										$scope.thirdPlaceFixtureObj.match_awayTeam = "";
										$scope.thirdPlaceFixtureObj.match_date = moment(thirdPlaceDate).toISOString();
										$scope.thirdPlaceFixtureObj.match_time = timeArr[1];
										$scope.thirdPlaceFixtureObj.match_fixture = "third place";
										$scope.thirdPlaceFixtureObj.match_field = 1;
										$scope.thirdPlaceFixtureObj.match_started = "";
										$scope.thirdPlaceFixtureObj.competition_id = entry.id;
										$scope.thirdPlaceFixtureObj.match_venue = entry.comp_address.venue.nama;

										if(moment(thirdPlaceDate).format('dddd') === 'Monday'){
											$scope.thirdPlaceFixtureObj.match_referee = $scope.avMonRef[timeIndex][refereeIndex].username;
											$scope.thirdPlaceFixtureObj.match_analyst = $scope.avMonAnalysts[timeIndex][analystIndex].username;
										}else if(moment(thirdPlaceDate).format('dddd') === 'Tuesday'){
											$scope.thirdPlaceFixtureObj.match_referee = $scope.avTueRef[timeIndex][refereeIndex].username;
											$scope.thirdPlaceFixtureObj.match_analyst = $scope.avTueAnalysts[timeIndex][analystIndex].username;
										}else if(moment(thirdPlaceDate).format('dddd') === 'Wednesday'){
											$scope.thirdPlaceFixtureObj.match_referee = $scope.avWedRef[timeIndex][refereeIndex].username;
											$scope.thirdPlaceFixtureObj.match_analyst = $scope.avWedAnalysts[timeIndex][analystIndex].username;
										}else if(moment(thirdPlaceDate).format('dddd') === 'Thursday'){
											$scope.thirdPlaceFixtureObj.match_referee = $scope.avThuRef[timeIndex][refereeIndex].username;
											$scope.thirdPlaceFixtureObj.match_analyst = $scope.avThuAnalysts[timeIndex][analystIndex].username;
										}else if(moment(thirdPlaceDate).format('dddd') === 'Friday'){
											$scope.thirdPlaceFixtureObj.match_referee = $scope.avFriRef[timeIndex][refereeIndex].username;
											$scope.thirdPlaceFixtureObj.match_analyst = $scope.avFriAnalysts[timeIndex][analystIndex].username;
										}else if(moment(thirdPlaceDate).format('dddd') === 'Saturday'){
											$scope.thirdPlaceFixtureObj.match_referee = $scope.avSatRef[timeIndex][refereeIndex].username;
											$scope.thirdPlaceFixtureObj.match_analyst = $scope.avSatAnalysts[timeIndex][analystIndex].username;
										}else if(moment(thirdPlaceDate).format('dddd') === 'Sunday'){
											$scope.thirdPlaceFixtureObj.match_referee = $scope.avSunRef[timeIndex][refereeIndex].username;
											$scope.thirdPlaceFixtureObj.match_analyst = $scope.avSunAnalysts[timeIndex][analystIndex].username;
										}
										console.log($scope.thirdPlaceFixtureObj);
									},6000);

									// Final
									setTimeout(function(){
										refereeIndex = 0;
										$scope.finalFixtureObj = {};
										$scope.finalFixtureObj.match_homeTeamObj = {};
										$scope.finalFixtureObj.match_homeTeamObj.team_name = '';
										$scope.finalFixtureObj.match_homeTeamObj.score = 0;
										$scope.finalFixtureObj.match_homeTeamObj.formation = '';
										$scope.finalFixtureObj.match_homeTeamObj.lineup = '';
										$scope.finalFixtureObj.match_homeTeamObj.lastLineup = '';
										$scope.finalFixtureObj.match_homeTeamObj.sub = '';
										$scope.finalFixtureObj.match_homeTeamObj.lastSub = '';
										$scope.finalFixtureObj.match_homeTeamObj.player = '';

										$scope.finalFixtureObj.match_awayTeamObj = {};
										$scope.finalFixtureObj.match_awayTeamObj.team_name = '';
										$scope.finalFixtureObj.match_awayTeamObj.score = 0;
										$scope.finalFixtureObj.match_awayTeamObj.formation = '';
										$scope.finalFixtureObj.match_awayTeamObj.lineup = '';
										$scope.finalFixtureObj.match_awayTeamObj.lastLineup = '';
										$scope.finalFixtureObj.match_awayTeamObj.sub = '';
										$scope.finalFixtureObj.match_awayTeamObj.lastSub = '';
										$scope.finalFixtureObj.match_awayTeamObj.player = '';

										$scope.finalFixtureObj.id = "MA" + $rootScope.randomString + 1 + m;
										$scope.finalFixtureObj.match_homeTeam = "";
										$scope.finalFixtureObj.match_awayTeam = "";
										$scope.finalFixtureObj.match_date = moment(finalDate).toISOString();
										$scope.finalFixtureObj.match_time = timeArr[1];
										$scope.finalFixtureObj.match_fixture = "final";
										$scope.finalFixtureObj.match_field = 1;
										$scope.finalFixtureObj.match_started = "";
										$scope.finalFixtureObj.competition_id = entry.id;
										$scope.finalFixtureObj.match_venue = entry.comp_address.venue.nama;

										if(moment(finalDate).format('dddd') === 'Monday'){
											$scope.finalFixtureObj.match_referee = $scope.avMonRef[timeIndex][refereeIndex].username;
											$scope.finalFixtureObj.match_analyst = $scope.avMonAnalysts[timeIndex][analystIndex].username;
										}else if(moment(finalDate).format('dddd') === 'Tuesday'){
											$scope.finalFixtureObj.match_referee = $scope.avTueRef[timeIndex][refereeIndex].username;
											$scope.finalFixtureObj.match_analyst = $scope.avTueAnalysts[timeIndex][analystIndex].username;
										}else if(moment(finalDate).format('dddd') === 'Wednesday'){
											$scope.finalFixtureObj.match_referee = $scope.avWedRef[timeIndex][refereeIndex].username;
											$scope.finalFixtureObj.match_analyst = $scope.avWedAnalysts[timeIndex][analystIndex].username;
										}else if(moment(finalDate).format('dddd') === 'Thursday'){
											$scope.finalFixtureObj.match_referee = $scope.avThuRef[timeIndex][refereeIndex].username;
											$scope.finalFixtureObj.match_analyst = $scope.avThuAnalysts[timeIndex][analystIndex].username;
										}else if(moment(finalDate).format('dddd') === 'Friday'){
											$scope.finalFixtureObj.match_referee = $scope.avFriRef[timeIndex][refereeIndex].username;
											$scope.finalFixtureObj.match_analyst = $scope.avFriAnalysts[timeIndex][analystIndex].username;
										}else if(moment(finalDate).format('dddd') === 'Saturday'){
											$scope.finalFixtureObj.match_referee = $scope.avSatRef[timeIndex][refereeIndex].username;
											$scope.finalFixtureObj.match_analyst = $scope.avSatAnalysts[timeIndex][analystIndex].username;
										}else if(moment(finalDate).format('dddd') === 'Sunday'){
											$scope.finalFixtureObj.match_referee = $scope.avSunRef[timeIndex][refereeIndex].username;
											$scope.finalFixtureObj.match_analyst = $scope.avSunAnalysts[timeIndex][analystIndex].username;
										}
										console.log($scope.finalFixtureObj);
									},6000);
									
								// 7 Days (done)
								}else {
									console.log("7");
									var fixture1Date = moment(new Date(entry.comp_start));
									var fixture2Date = moment(new Date(entry.comp_start)).add(1, 'days');
									var fixture3Date = moment(new Date(entry.comp_start)).add(2, 'days');

									if(entry.comp_numOfTeam === 32){
										console.log("32");
										var roundOf16Date = moment(new Date(entry.comp_start)).add(3, 'days');
										var quarterFinalDate = moment(new Date(entry.comp_start)).add(4, 'days');
										var semiFinalDate = moment(new Date(entry.comp_start)).add(5, 'days');

									}else if(entry.comp_numOfTeam === 16){
										console.log("16");
										var quarterFinalDate = moment(new Date(entry.comp_start)).add(4, 'days');
										var semiFinalDate = moment(new Date(entry.comp_start)).add(5, 'days');

									}else if(entry.comp_numOfTeam === 8){
										console.log("8");
										var semiFinalDate = moment(new Date(entry.comp_start)).add(4, 'days');

									}

									var thirdPlaceDate = entry.comp_finish;
									var finalDate = entry.comp_finish;

									var firstRoundGroupIndex = 0;
									var secondRoundGroupIndex = 0;
									var thirdRoundGroupIndex = 0;
					
									var timeArr = ["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00"];
									var fieldArr = [1,2,3];


									// Fixture 1
									var timeIndex = 0;
									var fieldIndex = 0;
									var refereeIndex = 0;
									var analystIndex = 0;


									setTimeout(function(){
										var timeIndex = 0;
										var fieldIndex = 0;
										var refereeIndex = 0;
										var analystIndex = 0;

										for(t = 0; t < $scope.firstRoundHomeTeam.length; t++){
											$scope.firstRoundFixtureObj[t] = {};
											$scope.firstRoundFixtureObj[t].match_homeTeamObj = {};
											$scope.firstRoundFixtureObj[t].match_homeTeamObj.team_name = $scope.firstRoundHomeTeam[t];
											$scope.firstRoundFixtureObj[t].match_homeTeamObj.score = 0;
											$scope.firstRoundFixtureObj[t].match_homeTeamObj.formation = '';
											$scope.firstRoundFixtureObj[t].match_homeTeamObj.lineup = '';
											$scope.firstRoundFixtureObj[t].match_homeTeamObj.lastLineup = '';
											$scope.firstRoundFixtureObj[t].match_homeTeamObj.sub = '';
											$scope.firstRoundFixtureObj[t].match_homeTeamObj.lastSub = '';
											$scope.firstRoundFixtureObj[t].match_homeTeamObj.player = '';

											$scope.firstRoundFixtureObj[t].match_awayTeamObj = {};
											$scope.firstRoundFixtureObj[t].match_awayTeamObj.team_name = $scope.firstRoundAwayTeam[t];
											$scope.firstRoundFixtureObj[t].match_awayTeamObj.score = 0;
											$scope.firstRoundFixtureObj[t].match_awayTeamObj.formation = '';
											$scope.firstRoundFixtureObj[t].match_awayTeamObj.lineup = '';
											$scope.firstRoundFixtureObj[t].match_awayTeamObj.lastLineup = '';
											$scope.firstRoundFixtureObj[t].match_awayTeamObj.sub = '';
											$scope.firstRoundFixtureObj[t].match_awayTeamObj.lastSub = '';
											$scope.firstRoundFixtureObj[t].match_awayTeamObj.player = '';

											$scope.firstRoundFixtureObj[t].id = "MA" + $rootScope.randomString + 1 + firstRoundGroupIndex + t;
											$scope.firstRoundFixtureObj[t].match_homeTeam = $scope.firstRoundHomeTeam[t];
											$scope.firstRoundFixtureObj[t].match_awayTeam = $scope.firstRoundAwayTeam[t];
											$scope.firstRoundFixtureObj[t].match_group = $scope.firstRoundMatches.group[firstRoundGroupIndex];
											$scope.firstRoundFixtureObj[t].match_fixture = "fixture 1";
											$scope.firstRoundFixtureObj[t].match_field = fieldArr[fieldIndex];
											$scope.firstRoundFixtureObj[t].fixture_number = 1;
											$scope.firstRoundFixtureObj[t].competition_id = entry.id;
											$scope.firstRoundFixtureObj[t].match_date = moment(fixture1Date).toISOString();
											$scope.firstRoundFixtureObj[t].match_time = timeArr[timeIndex];
											$scope.firstRoundFixtureObj[t].match_venue = entry.comp_address.venue.nama;
										
											if(moment(fixture1Date).format('dddd') === 'Monday'){
												$scope.firstRoundFixtureObj[t].match_referee = $scope.avMonRef[timeIndex][refereeIndex].username;
												$scope.firstRoundFixtureObj[t].match_analyst = $scope.avMonAnalysts[timeIndex][analystIndex].username;
											}else if(moment(fixture1Date).format('dddd') === 'Tuesday'){
												$scope.firstRoundFixtureObj[t].match_referee = $scope.avTueRef[timeIndex][refereeIndex].username;
												$scope.firstRoundFixtureObj[t].match_analyst = $scope.avTueAnalysts[timeIndex][analystIndex].username;
											}else if(moment(fixture1Date).format('dddd') === 'Wednesday'){
												$scope.firstRoundFixtureObj[t].match_referee = $scope.avWedRef[timeIndex][refereeIndex].username;
												$scope.firstRoundFixtureObj[t].match_analyst = $scope.avWedAnalysts[timeIndex][analystIndex].username;
											}else if(moment(fixture1Date).format('dddd') === 'Thursday'){
												$scope.firstRoundFixtureObj[t].match_referee = $scope.avThuRef[timeIndex][refereeIndex].username;
												$scope.firstRoundFixtureObj[t].match_analyst = $scope.avThuAnalysts[timeIndex][analystIndex].username;
											}else if(moment(fixture1Date).format('dddd') === 'Friday'){
												$scope.firstRoundFixtureObj[t].match_referee = $scope.avFriRef[timeIndex][refereeIndex].username;
												$scope.firstRoundFixtureObj[t].match_analyst = $scope.avFriAnalysts[timeIndex][analystIndex].username;
											}else if(moment(fixture1Date).format('dddd') === 'Saturday'){
												$scope.firstRoundFixtureObj[t].match_referee = $scope.avSatRef[timeIndex][refereeIndex].username;
												$scope.firstRoundFixtureObj[t].match_analyst = $scope.avSatAnalysts[timeIndex][analystIndex].username;
											}else if(moment(fixture1Date).format('dddd') === 'Sunday'){
												$scope.firstRoundFixtureObj[t].match_referee = $scope.avSunRef[timeIndex][refereeIndex].username;
												$scope.firstRoundFixtureObj[t].match_analyst = $scope.avSunAnalysts[timeIndex][analystIndex].username;
											}

											fieldIndex++;
											refereeIndex++;
											analystIndex++;
											if(t % 2 != 0){
												firstRoundGroupIndex++;
											}

											if(entry.comp_numOfTeam !== 8){
												if((t+1) % 3 == 0){
													timeIndex++;
													fieldIndex = 0;
												}
											}

											if(entry.comp_numOfTeam === 8){
												timeIndex++;
												$scope.firstRoundFixtureObj[t].match_date = moment(fixture1Date).toISOString();
												$scope.firstRoundFixtureObj[t].match_field = "1";
												
											}
										}
										console.log($scope.firstRoundFixtureObj);
									},6000);
									

									// Fixture 2
									setTimeout(function(){
										timeIndex = 0;
										fieldIndex = 0;

										for(t = 0; t < $scope.secondRoundHomeTeam.length; t++){
											$scope.secondRoundFixtureObj[t] = {};
											$scope.secondRoundFixtureObj[t].match_homeTeamObj = {};
											$scope.secondRoundFixtureObj[t].match_homeTeamObj.team_name = $scope.secondRoundHomeTeam[t];
											$scope.secondRoundFixtureObj[t].match_homeTeamObj.score = 0;
											$scope.secondRoundFixtureObj[t].match_homeTeamObj.formation = '';
											$scope.secondRoundFixtureObj[t].match_homeTeamObj.lineup = '';
											$scope.secondRoundFixtureObj[t].match_homeTeamObj.lastLineup = '';
											$scope.secondRoundFixtureObj[t].match_homeTeamObj.sub = '';
											$scope.secondRoundFixtureObj[t].match_homeTeamObj.lastSub = '';
											$scope.secondRoundFixtureObj[t].match_homeTeamObj.player = '';

											$scope.secondRoundFixtureObj[t].match_awayTeamObj = {};
											$scope.secondRoundFixtureObj[t].match_awayTeamObj.team_name = $scope.secondRoundAwayTeam[t];
											$scope.secondRoundFixtureObj[t].match_awayTeamObj.score = 0;
											$scope.secondRoundFixtureObj[t].match_awayTeamObj.formation = '';
											$scope.secondRoundFixtureObj[t].match_awayTeamObj.lineup = '';
											$scope.secondRoundFixtureObj[t].match_awayTeamObj.lastLineup = '';
											$scope.secondRoundFixtureObj[t].match_awayTeamObj.sub = '';
											$scope.secondRoundFixtureObj[t].match_awayTeamObj.lastSub = '';
											$scope.secondRoundFixtureObj[t].match_awayTeamObj.player = '';

											$scope.secondRoundFixtureObj[t].id = "MA" + $rootScope.randomString + 2 + secondRoundGroupIndex + t;
											$scope.secondRoundFixtureObj[t].match_homeTeam = $scope.secondRoundHomeTeam[t];
											$scope.secondRoundFixtureObj[t].match_awayTeam = $scope.secondRoundAwayTeam[t];
											$scope.secondRoundFixtureObj[t].match_group = $scope.secondRoundMatches.group[secondRoundGroupIndex];
											$scope.secondRoundFixtureObj[t].match_fixture = "fixture 2";
											$scope.secondRoundFixtureObj[t].match_field = fieldArr[fieldIndex];
											$scope.secondRoundFixtureObj[t].fixture_number = 2;
											$scope.secondRoundFixtureObj[t].competition_id = entry.id;
											$scope.secondRoundFixtureObj[t].match_date = moment(fixture2Date).toISOString();
											$scope.secondRoundFixtureObj[t].match_time = timeArr[timeIndex];
											$scope.secondRoundFixtureObj[t].match_venue = entry.comp_address.venue.nama;
										
											if(moment(fixture2Date).format('dddd') === 'Monday'){
												$scope.secondRoundFixtureObj[t].match_referee = $scope.avMonRef[timeIndex][refereeIndex].username;
												$scope.secondRoundFixtureObj[t].match_analyst = $scope.avMonAnalysts[timeIndex][analystIndex].username;
											}else if(moment(fixture2Date).format('dddd') === 'Tuesday'){
												$scope.secondRoundFixtureObj[t].match_referee = $scope.avTueRef[timeIndex][refereeIndex].username;
												$scope.secondRoundFixtureObj[t].match_analyst = $scope.avTueAnalysts[timeIndex][analystIndex].username;
											}else if(moment(fixture2Date).format('dddd') === 'Wednesday'){
												$scope.secondRoundFixtureObj[t].match_referee = $scope.avWedRef[timeIndex][refereeIndex].username;
												$scope.secondRoundFixtureObj[t].match_analyst = $scope.avWedAnalysts[timeIndex][analystIndex].username;
											}else if(moment(fixture2Date).format('dddd') === 'Thursday'){
												$scope.secondRoundFixtureObj[t].match_referee = $scope.avThuRef[timeIndex][refereeIndex].username;
												$scope.secondRoundFixtureObj[t].match_analyst = $scope.avThuAnalysts[timeIndex][analystIndex].username;
											}else if(moment(fixture2Date).format('dddd') === 'Friday'){
												$scope.secondRoundFixtureObj[t].match_referee = $scope.avFriRef[timeIndex][refereeIndex].username;
												$scope.secondRoundFixtureObj[t].match_analyst = $scope.avFriAnalysts[timeIndex][analystIndex].username;
											}else if(moment(fixture2Date).format('dddd') === 'Saturday'){
												$scope.secondRoundFixtureObj[t].match_referee = $scope.avSatRef[timeIndex][refereeIndex].username;
												$scope.secondRoundFixtureObj[t].match_analyst = $scope.avSatAnalysts[timeIndex][analystIndex].username;
											}else if(moment(fixture2Date).format('dddd') === 'Sunday'){
												$scope.secondRoundFixtureObj[t].match_referee = $scope.avSunRef[timeIndex][refereeIndex].username;
												$scope.secondRoundFixtureObj[t].match_analyst = $scope.avSunAnalysts[timeIndex][analystIndex].username;
											}

											refereeIndex++;
											analystIndex++;
											fieldIndex++;
											if(t % 2 != 0){
												secondRoundGroupIndex++;
											}

											if(entry.comp_numOfTeam !== 8){
												if((t+1) % 3 == 0){
													timeIndex++;
													fieldIndex = 0;
												}
											}

											if(entry.comp_numOfTeam === 8){
												timeIndex++;
												$scope.secondRoundFixtureObj[t].match_date = moment(fixture2Date).toISOString();
												$scope.secondRoundFixtureObj[t].match_field = "1";
												
											}
										}
										console.log($scope.secondRoundFixtureObj);
									},6000);
									

									// Fixture 3
									setTimeout(function(){
										timeIndex = 0;
										fieldIndex = 0;
										refereeIndex = 0;
										analystIndex = 0;
										for(t = 0; t < $scope.thirdRoundHomeTeam.length; t++){
											$scope.thirdRoundFixtureObj[t] = {};
											$scope.thirdRoundFixtureObj[t].match_homeTeamObj = {};
											$scope.thirdRoundFixtureObj[t].match_homeTeamObj.team_name = $scope.thirdRoundHomeTeam[t];
											$scope.thirdRoundFixtureObj[t].match_homeTeamObj.score = 0;
											$scope.thirdRoundFixtureObj[t].match_homeTeamObj.formation = '';
											$scope.thirdRoundFixtureObj[t].match_homeTeamObj.lineup = '';
											$scope.thirdRoundFixtureObj[t].match_homeTeamObj.lastLineup = '';
											$scope.thirdRoundFixtureObj[t].match_homeTeamObj.sub = '';
											$scope.thirdRoundFixtureObj[t].match_homeTeamObj.lastSub = '';
											$scope.thirdRoundFixtureObj[t].match_homeTeamObj.player = '';

											$scope.thirdRoundFixtureObj[t].match_awayTeamObj = {};
											$scope.thirdRoundFixtureObj[t].match_awayTeamObj.team_name = $scope.thirdRoundAwayTeam[t];
											$scope.thirdRoundFixtureObj[t].match_awayTeamObj.score = 0;
											$scope.thirdRoundFixtureObj[t].match_awayTeamObj.formation = '';
											$scope.thirdRoundFixtureObj[t].match_awayTeamObj.lineup = '';
											$scope.thirdRoundFixtureObj[t].match_awayTeamObj.lastLineup = '';
											$scope.thirdRoundFixtureObj[t].match_awayTeamObj.sub = '';
											$scope.thirdRoundFixtureObj[t].match_awayTeamObj.lastSub = '';
											$scope.thirdRoundFixtureObj[t].match_awayTeamObj.player = '';

											$scope.thirdRoundFixtureObj[t].id = "MA" + $rootScope.randomString + 3 + thirdRoundGroupIndex + t;
											$scope.thirdRoundFixtureObj[t].match_homeTeam = $scope.thirdRoundHomeTeam[t];
											$scope.thirdRoundFixtureObj[t].match_awayTeam = $scope.thirdRoundAwayTeam[t];
											$scope.thirdRoundFixtureObj[t].match_group = $scope.thirdRoundMatches.group[thirdRoundGroupIndex];
											$scope.thirdRoundFixtureObj[t].match_fixture = "fixture 3";
											$scope.thirdRoundFixtureObj[t].match_field = fieldArr[fieldIndex];
											$scope.thirdRoundFixtureObj[t].fixture_number = 3;
											$scope.thirdRoundFixtureObj[t].competition_id = entry.id;
											$scope.thirdRoundFixtureObj[t].match_date = moment(fixture3Date).toISOString();
											$scope.thirdRoundFixtureObj[t].match_time = timeArr[timeIndex];
											$scope.thirdRoundFixtureObj[t].match_venue = entry.comp_address.venue.nama;
										
											if(moment(fixture3Date).format('dddd') === 'Monday'){
												$scope.thirdRoundFixtureObj[t].match_referee = $scope.avMonRef[timeIndex][refereeIndex].username;
												$scope.thirdRoundFixtureObj[t].match_analyst = $scope.avMonAnalysts[timeIndex][analystIndex].username;
											}else if(moment(fixture3Date).format('dddd') === 'Tuesday'){
												$scope.thirdRoundFixtureObj[t].match_referee = $scope.avTueRef[timeIndex][refereeIndex].username;
												$scope.thirdRoundFixtureObj[t].match_analyst = $scope.avTueAnalysts[timeIndex][analystIndex].username;
											}else if(moment(fixture3Date).format('dddd') === 'Wednesday'){
												$scope.thirdRoundFixtureObj[t].match_referee = $scope.avWedRef[timeIndex][refereeIndex].username;
												$scope.thirdRoundFixtureObj[t].match_analyst = $scope.avWedAnalysts[timeIndex][analystIndex].username;
											}else if(moment(fixture3Date).format('dddd') === 'Thursday'){
												$scope.thirdRoundFixtureObj[t].match_referee = $scope.avThuRef[timeIndex][refereeIndex].username;
												$scope.thirdRoundFixtureObj[t].match_analyst = $scope.avThuAnalysts[timeIndex][analystIndex].username;
											}else if(moment(fixture3Date).format('dddd') === 'Friday'){
												$scope.thirdRoundFixtureObj[t].match_referee = $scope.avFriRef[timeIndex][refereeIndex].username;
												$scope.thirdRoundFixtureObj[t].match_analyst = $scope.avFriAnalysts[timeIndex][analystIndex].username;
											}else if(moment(fixture3Date).format('dddd') === 'Saturday'){
												$scope.thirdRoundFixtureObj[t].match_referee = $scope.avSatRef[timeIndex][refereeIndex].username;
												$scope.thirdRoundFixtureObj[t].match_analyst = $scope.avSatAnalysts[timeIndex][analystIndex].username;
											}else if(moment(fixture3Date).format('dddd') === 'Sunday'){
												$scope.thirdRoundFixtureObj[t].match_referee = $scope.avSunRef[timeIndex][refereeIndex].username;
												$scope.thirdRoundFixtureObj[t].match_analyst = $scope.avSunAnalysts[timeIndex][analystIndex].username;
											}

											refereeIndex++;
											analystIndex++;
											fieldIndex++;
											if(t % 2 != 0){
												thirdRoundGroupIndex++;
											}

											if(entry.comp_numOfTeam !== 8){
												if((t+1) % 3 == 0){
													timeIndex++;
													fieldIndex = 0;
												}
											}
											
											if(entry.comp_numOfTeam === 8){
												timeIndex++;
												$scope.thirdRoundFixtureObj[t].match_date = moment(fixture3Date).toISOString();
												$scope.thirdRoundFixtureObj[t].match_field = "1";
												
											}
										}
										console.log($scope.thirdRoundFixtureObj);
									},6000);
									

									// Round of 16
									setTimeout(function(){
										if(entry.comp_numOfTeam === 32){
											timeIndex = 0;
											refereeIndex = 0;
											analystIndex = 0;
											fieldIndex = 0;
											pair = 1;
											for(var m = 0; m < 8; m++){
												$scope.roundOf16FixtureObj[m] = {};
												$scope.roundOf16FixtureObj[m].match_homeTeamObj = {};
												$scope.roundOf16FixtureObj[m].match_homeTeamObj.team_name = '';
												$scope.roundOf16FixtureObj[m].match_homeTeamObj.score = 0;
												$scope.roundOf16FixtureObj[m].match_homeTeamObj.formation = '';
												$scope.roundOf16FixtureObj[m].match_homeTeamObj.lineup = '';
												$scope.roundOf16FixtureObj[m].match_homeTeamObj.lastLineup = '';
												$scope.roundOf16FixtureObj[m].match_homeTeamObj.sub = '';
												$scope.roundOf16FixtureObj[m].match_homeTeamObj.lastSub = '';
												$scope.roundOf16FixtureObj[m].match_homeTeamObj.player = '';

												$scope.roundOf16FixtureObj[m].match_awayTeamObj = {};
												$scope.roundOf16FixtureObj[m].match_awayTeamObj.team_name = '';
												$scope.roundOf16FixtureObj[m].match_awayTeamObj.score = 0;
												$scope.roundOf16FixtureObj[m].match_awayTeamObj.formation = '';
												$scope.roundOf16FixtureObj[m].match_awayTeamObj.lineup = '';
												$scope.roundOf16FixtureObj[m].match_awayTeamObj.lastLineup = '';
												$scope.roundOf16FixtureObj[m].match_awayTeamObj.sub = '';
												$scope.roundOf16FixtureObj[m].match_awayTeamObj.lastSub = '';
												$scope.roundOf16FixtureObj[m].match_awayTeamObj.player = '';

												$scope.roundOf16FixtureObj[m].id = "MA" + $rootScope.randomString + 16 + m;
												$scope.roundOf16FixtureObj[m].match_homeTeam = '';
												$scope.roundOf16FixtureObj[m].match_awayTeam = '';
												$scope.roundOf16FixtureObj[m].match_fixture = "round of 16";
												$scope.roundOf16FixtureObj[m].match_field = fieldArr[fieldIndex];
												$scope.roundOf16FixtureObj[m].competition_id = entry.id;
												$scope.roundOf16FixtureObj[m].match_pair = pair;
												$scope.roundOf16FixtureObj[m].match_date = moment(roundOf16Date).toISOString();
												$scope.roundOf16FixtureObj[m].match_time = timeArr[timeIndex];
												$scope.roundOf16FixtureObj[m].match_venue = entry.comp_address.venue.nama;
											
												if(moment(roundOf16Date).format('dddd') === 'Monday'){
													$scope.roundOf16FixtureObj[m].match_referee = $scope.avMonRef[timeIndex][refereeIndex].username;
													$scope.roundOf16FixtureObj[m].match_analyst = $scope.avMonAnalysts[timeIndex][analystIndex].username;
												}else if(moment(roundOf16Date).format('dddd') === 'Tuesday'){
													$scope.roundOf16FixtureObj[m].match_referee = $scope.avTueRef[timeIndex][refereeIndex].username;
													$scope.roundOf16FixtureObj[m].match_analyst = $scope.avTueAnalysts[timeIndex][analystIndex].username;
												}else if(moment(roundOf16Date).format('dddd') === 'Wednesday'){
													$scope.roundOf16FixtureObj[m].match_referee = $scope.avWedRef[timeIndex][refereeIndex].username;
													$scope.roundOf16FixtureObj[m].match_analyst = $scope.avWedAnalysts[timeIndex][analystIndex].username;
												}else if(moment(roundOf16Date).format('dddd') === 'Thursday'){
													$scope.roundOf16FixtureObj[m].match_referee = $scope.avThuRef[timeIndex][refereeIndex].username;
													$scope.roundOf16FixtureObj[m].match_analyst = $scope.avThuAnalysts[timeIndex][analystIndex].username;
												}else if(moment(roundOf16Date).format('dddd') === 'Friday'){
													$scope.roundOf16FixtureObj[m].match_referee = $scope.avFriRef[timeIndex][refereeIndex].username;
													$scope.roundOf16FixtureObj[m].match_analyst = $scope.avFriAnalysts[timeIndex][analystIndex].username;
												}else if(moment(roundOf16Date).format('dddd') === 'Saturday'){
													$scope.roundOf16FixtureObj[m].match_referee = $scope.avSatRef[timeIndex][refereeIndex].username;
													$scope.roundOf16FixtureObj[m].match_analyst = $scope.avSatAnalysts[timeIndex][analystIndex].username;
												}else if(moment(roundOf16Date).format('dddd') === 'Sunday'){
													$scope.roundOf16FixtureObj[m].match_referee = $scope.avSunRef[timeIndex][refereeIndex].username;
													$scope.roundOf16FixtureObj[m].match_analyst = $scope.avSunAnalysts[timeIndex][analystIndex].username;
												}

												refereeIndex++;
												analystIndex++;
												fieldIndex++;
												// if((timeIndex % 4 == 0)){
												// 	refereeIndex = 0;
												// 	analystIndex = 0;
												// }

												if((m+1) % 2 == 0){
													timeIndex = timeIndex + 2;
													fieldIndex = 0;
												}
												
												if(m % 2 != 0){
													pair++;
												}
											}
										}
										console.log($scope.roundOf16FixtureObj);
									},6000);
									
									
									// Quarter Final
									setTimeout(function(){
										if(entry.comp_numOfTeam === 16 || entry.comp_numOfTeam === 32){
											console.log("asjadlajdaskdjad");
											timeIndex = 0;
											refereeIndex = 0;
											analystIndex = 0;
											pair = 1;
											for(m = 0; m < 4; m++){
												$scope.quarterFinalFixtureObj[m] = {};
												$scope.quarterFinalFixtureObj[m].match_homeTeamObj = {};
												$scope.quarterFinalFixtureObj[m].match_homeTeamObj.team_name = '';
												$scope.quarterFinalFixtureObj[m].match_homeTeamObj.score = 0;
												$scope.quarterFinalFixtureObj[m].match_homeTeamObj.formation = '';
												$scope.quarterFinalFixtureObj[m].match_homeTeamObj.lineup = '';
												$scope.quarterFinalFixtureObj[m].match_homeTeamObj.lastLineup = '';
												$scope.quarterFinalFixtureObj[m].match_homeTeamObj.sub = '';
												$scope.quarterFinalFixtureObj[m].match_homeTeamObj.lastSub = '';
												$scope.quarterFinalFixtureObj[m].match_homeTeamObj.player = '';

												$scope.quarterFinalFixtureObj[m].match_awayTeamObj = {};
												$scope.quarterFinalFixtureObj[m].match_awayTeamObj.team_name = '';
												$scope.quarterFinalFixtureObj[m].match_awayTeamObj.score = 0;
												$scope.quarterFinalFixtureObj[m].match_awayTeamObj.formation = '';
												$scope.quarterFinalFixtureObj[m].match_awayTeamObj.lineup = '';
												$scope.quarterFinalFixtureObj[m].match_awayTeamObj.lastLineup = '';
												$scope.quarterFinalFixtureObj[m].match_awayTeamObj.sub = '';
												$scope.quarterFinalFixtureObj[m].match_awayTeamObj.lastSub = '';
												$scope.quarterFinalFixtureObj[m].match_awayTeamObj.player = '';


												$scope.quarterFinalFixtureObj[m].id = "MA" + $rootScope.randomString + 16 + m;
												$scope.quarterFinalFixtureObj[m].match_homeTeam = '';
												$scope.quarterFinalFixtureObj[m].match_awayTeam = '';
												$scope.quarterFinalFixtureObj[m].match_fixture = "quarter final";
												$scope.quarterFinalFixtureObj[m].match_field = fieldArr[fieldIndex];
												$scope.quarterFinalFixtureObj[m].competition_id = entry.id;
												$scope.quarterFinalFixtureObj[m].match_pair = pair;
												$scope.quarterFinalFixtureObj[m].match_time = timeArr[timeIndex];
												$scope.quarterFinalFixtureObj[m].match_date = moment(quarterFinalDate).toISOString();
												$scope.quarterFinalFixtureObj[m].match_venue = entry.comp_address.venue.nama;

												if(entry.comp_numOfTeam === 32){
													$scope.quarterFinalFixtureObj[m].match_date = moment(quarterFinalDate).toISOString();
													if(moment(quarterFinalDate).format('dddd') === 'Monday'){
														$scope.quarterFinalFixtureObj[m].match_referee = $scope.avMonRef[timeIndex][refereeIndex].username;
														$scope.quarterFinalFixtureObj[m].match_analyst = $scope.avMonAnalysts[timeIndex][analystIndex].username;
													}else if(moment(quarterFinalDate).format('dddd') === 'Tuesday'){
														$scope.quarterFinalFixtureObj[m].match_referee = $scope.avTueRef[timeIndex][refereeIndex].username;
														$scope.quarterFinalFixtureObj[m].match_analyst = $scope.avTueAnalysts[timeIndex][analystIndex].username;
													}else if(moment(quarterFinalDate).format('dddd') === 'Wednesday'){
														$scope.quarterFinalFixtureObj[m].match_referee = $scope.avWedRef[timeIndex][refereeIndex].username;
														$scope.quarterFinalFixtureObj[m].match_analyst = $scope.avWedAnalysts[timeIndex][analystIndex].username;
													}else if(moment(quarterFinalDate).format('dddd') === 'Thursday'){
														$scope.quarterFinalFixtureObj[m].match_referee = $scope.avThuRef[timeIndex][refereeIndex].username;
														$scope.quarterFinalFixtureObj[m].match_analyst = $scope.avThuAnalysts[timeIndex][analystIndex].username;
													}else if(moment(quarterFinalDate).format('dddd') === 'Friday'){
														$scope.quarterFinalFixtureObj[m].match_referee = $scope.avFriRef[timeIndex][refereeIndex].username;
														$scope.quarterFinalFixtureObj[m].match_analyst = $scope.avFriAnalysts[timeIndex][analystIndex].username;
													}else if(moment(quarterFinalDate).format('dddd') === 'Saturday'){
														$scope.quarterFinalFixtureObj[m].match_referee = $scope.avSatRef[timeIndex][refereeIndex].username;
														$scope.quarterFinalFixtureObj[m].match_analyst = $scope.avSatAnalysts[timeIndex][analystIndex].username;
													}else if(moment(quarterFinalDate).format('dddd') === 'Sunday'){
														$scope.quarterFinalFixtureObj[m].match_referee = $scope.avSunRef[timeIndex][refereeIndex].username;
														$scope.quarterFinalFixtureObj[m].match_analyst = $scope.avSunAnalysts[timeIndex][analystIndex].username;
													}
												}else if(entry.comp_numOfTeam === 16){
													$scope.quarterFinalFixtureObj[m].match_date = moment(quarterFinalDate[quarterFinalIndex]).toISOString();
													if(moment(quarterFinalDate[quarterFinalIndex]).format('dddd') === 'Monday'){
														$scope.quarterFinalFixtureObj[m].match_referee = $scope.avMonRef[timeIndex][refereeIndex].username;
														$scope.quarterFinalFixtureObj[m].match_analyst = $scope.avMonAnalysts[timeIndex][analystIndex].username;
													}else if(moment(quarterFinalDate[quarterFinalIndex]).format('dddd') === 'Tuesday'){
														$scope.quarterFinalFixtureObj[m].match_referee = $scope.avTueRef[timeIndex][refereeIndex].username;
														$scope.quarterFinalFixtureObj[m].match_analyst = $scope.avTueAnalysts[timeIndex][analystIndex].username;
													}else if(moment(quarterFinalDate[quarterFinalIndex]).format('dddd') === 'Wednesday'){
														$scope.quarterFinalFixtureObj[m].match_referee = $scope.avWedRef[timeIndex][refereeIndex].username;
														$scope.quarterFinalFixtureObj[m].match_analyst = $scope.avWedAnalysts[timeIndex][analystIndex].username;
													}else if(moment(quarterFinalDate[quarterFinalIndex]).format('dddd') === 'Thursday'){
														$scope.quarterFinalFixtureObj[m].match_referee = $scope.avThuRef[timeIndex][refereeIndex].username;
														$scope.quarterFinalFixtureObj[m].match_analyst = $scope.avThuAnalysts[timeIndex][analystIndex].username;
													}else if(moment(quarterFinalDate[quarterFinalIndex]).format('dddd') === 'Friday'){
														$scope.quarterFinalFixtureObj[m].match_referee = $scope.avFriRef[timeIndex][refereeIndex].username;
														$scope.quarterFinalFixtureObj[m].match_analyst = $scope.avFriAnalysts[timeIndex][analystIndex].username;
													}else if(moment(quarterFinalDate[quarterFinalIndex]).format('dddd') === 'Saturday'){
														$scope.quarterFinalFixtureObj[m].match_referee = $scope.avSatRef[timeIndex][refereeIndex].username;
														$scope.quarterFinalFixtureObj[m].match_analyst = $scope.avSatAnalysts[timeIndex][analystIndex].username;
													}else if(moment(quarterFinalDate[quarterFinalIndex]).format('dddd') === 'Sunday'){
														$scope.quarterFinalFixtureObj[m].match_referee = $scope.avSunRef[timeIndex][refereeIndex].username;
														$scope.quarterFinalFixtureObj[m].match_analyst = $scope.avSunAnalysts[timeIndex][analystIndex].username;
													}
													if((m+1) % 2 == 0){
														quarterFinalIndex++;
													}
												}
											
												

												timeIndex = timeIndex + 2;
												refereeIndex++;
												analystIndex++;
										
												if(m % 2 != 0){
													pair++;
												}
											}
										}
										console.log($scope.quarterFinalFixtureObj);
									},6000);
									
									
									// Semi Final
									setTimeout(function(){
										timeIndex = 1;
										refereeIndex = 0;
										analystIndex = 0;
										pair = 1;
										for(m = 0; m < 2; m++){
											$scope.semiFinalFixtureObj[m] = {};
											$scope.semiFinalFixtureObj[m].match_homeTeamObj = {};
											$scope.semiFinalFixtureObj[m].match_homeTeamObj.team_name = '';
											$scope.semiFinalFixtureObj[m].match_homeTeamObj.score = 0;
											$scope.semiFinalFixtureObj[m].match_homeTeamObj.formation = '';
											$scope.semiFinalFixtureObj[m].match_homeTeamObj.lineup = '';
											$scope.semiFinalFixtureObj[m].match_homeTeamObj.lastLineup = '';
											$scope.semiFinalFixtureObj[m].match_homeTeamObj.sub = '';
											$scope.semiFinalFixtureObj[m].match_homeTeamObj.lastSub = '';
											$scope.semiFinalFixtureObj[m].match_homeTeamObj.player = '';

											$scope.semiFinalFixtureObj[m].match_awayTeamObj = {};
											$scope.semiFinalFixtureObj[m].match_awayTeamObj.team_name = '';
											$scope.semiFinalFixtureObj[m].match_awayTeamObj.score = 0;
											$scope.semiFinalFixtureObj[m].match_awayTeamObj.formation = '';
											$scope.semiFinalFixtureObj[m].match_awayTeamObj.lineup = '';
											$scope.semiFinalFixtureObj[m].match_awayTeamObj.lastLineup = '';
											$scope.semiFinalFixtureObj[m].match_awayTeamObj.sub = '';
											$scope.semiFinalFixtureObj[m].match_awayTeamObj.lastSub = '';
											$scope.semiFinalFixtureObj[m].match_awayTeamObj.player = '';

											$scope.semiFinalFixtureObj[m].id = "MA" + $rootScope.randomString + 4 + m;
											$scope.semiFinalFixtureObj[m].match_homeTeam = '';
											$scope.semiFinalFixtureObj[m].match_awayTeam = '';
											$scope.semiFinalFixtureObj[m].match_fixture = "semi final";
											$scope.semiFinalFixtureObj[m].match_field = fieldArr[fieldIndex];
											$scope.semiFinalFixtureObj[m].competition_id = entry.id;
											$scope.semiFinalFixtureObj[m].match_pair = pair;
											$scope.semiFinalFixtureObj[m].match_date = moment(semiFinalDate).toISOString();
											$scope.semiFinalFixtureObj[m].match_time = timeArr[timeIndex];
											$scope.semiFinalFixtureObj[m].match_venue = entry.comp_address.venue.nama;
										
											if(moment(semiFinalDate).format('dddd') === 'Monday'){
												$scope.semiFinalFixtureObj[m].match_referee = $scope.avMonRef[timeIndex][refereeIndex].username;
												$scope.semiFinalFixtureObj[m].match_analyst = $scope.avMonAnalysts[timeIndex][analystIndex].username;
											}else if(moment(semiFinalDate).format('dddd') === 'Tuesday'){
												$scope.semiFinalFixtureObj[m].match_referee = $scope.avTueRef[timeIndex][refereeIndex].username;
												$scope.semiFinalFixtureObj[m].match_analyst = $scope.avTueAnalysts[timeIndex][analystIndex].username;
											}else if(moment(semiFinalDate).format('dddd') === 'Wednesday'){
												$scope.semiFinalFixtureObj[m].match_referee = $scope.avWedRef[timeIndex][refereeIndex].username;
												$scope.semiFinalFixtureObj[m].match_analyst = $scope.avWedAnalysts[timeIndex][analystIndex].username;
											}else if(moment(semiFinalDate).format('dddd') === 'Thursday'){
												$scope.semiFinalFixtureObj[m].match_referee = $scope.avThuRef[timeIndex][refereeIndex].username;
												$scope.semiFinalFixtureObj[m].match_analyst = $scope.avThuAnalysts[timeIndex][analystIndex].username;
											}else if(moment(semiFinalDate).format('dddd') === 'Friday'){
												$scope.semiFinalFixtureObj[m].match_referee = $scope.avFriRef[timeIndex][refereeIndex].username;
												$scope.semiFinalFixtureObj[m].match_analyst = $scope.avFriAnalysts[timeIndex][analystIndex].username;
											}else if(moment(semiFinalDate).format('dddd') === 'Saturday'){
												$scope.semiFinalFixtureObj[m].match_referee = $scope.avSatRef[timeIndex][refereeIndex].username;
												$scope.semiFinalFixtureObj[m].match_analyst = $scope.avSatAnalysts[timeIndex][analystIndex].username;
											}else if(moment(semiFinalDate).format('dddd') === 'Sunday'){
												$scope.semiFinalFixtureObj[m].match_referee = $scope.avSunRef[timeIndex][refereeIndex].username;
												$scope.semiFinalFixtureObj[m].match_analyst = $scope.avSunAnalysts[timeIndex][analystIndex].username;
											}

											semiFinalIndex++;
											timeIndex = timeIndex + 2;
											refereeIndex++;
											analystIndex++;
										}
										console.log($scope.semiFinalFixtureObj);
									},6000);
									

									// Third Place
									setTimeout(function(){
										refereeIndex = 0;
										$scope.thirdPlaceFixtureObj = {};
										$scope.thirdPlaceFixtureObj.match_homeTeamObj = {};
										$scope.thirdPlaceFixtureObj.match_homeTeamObj.team_name = '';
										$scope.thirdPlaceFixtureObj.match_homeTeamObj.score = 0;
										$scope.thirdPlaceFixtureObj.match_homeTeamObj.formation = '';
										$scope.thirdPlaceFixtureObj.match_homeTeamObj.lineup = '';
										$scope.thirdPlaceFixtureObj.match_homeTeamObj.lastLineup = '';
										$scope.thirdPlaceFixtureObj.match_homeTeamObj.sub = '';
										$scope.thirdPlaceFixtureObj.match_homeTeamObj.lastSub = '';
										$scope.thirdPlaceFixtureObj.match_homeTeamObj.player = '';

										$scope.thirdPlaceFixtureObj.match_awayTeamObj = {};
										$scope.thirdPlaceFixtureObj.match_awayTeamObj.team_name = '';
										$scope.thirdPlaceFixtureObj.match_awayTeamObj.score = 0;
										$scope.thirdPlaceFixtureObj.match_awayTeamObj.formation = '';
										$scope.thirdPlaceFixtureObj.match_awayTeamObj.lineup = '';
										$scope.thirdPlaceFixtureObj.match_awayTeamObj.lastLineup = '';
										$scope.thirdPlaceFixtureObj.match_awayTeamObj.sub = '';
										$scope.thirdPlaceFixtureObj.match_awayTeamObj.lastSub = '';
										$scope.thirdPlaceFixtureObj.match_awayTeamObj.player = '';

										$scope.thirdPlaceFixtureObj.id = "MA" + $rootScope.randomString + 3 + m;
										$scope.thirdPlaceFixtureObj.match_homeTeam = "";
										$scope.thirdPlaceFixtureObj.match_awayTeam = "";
										$scope.thirdPlaceFixtureObj.match_date = moment(thirdPlaceDate).toISOString();
										$scope.thirdPlaceFixtureObj.match_time = timeArr[1];
										$scope.thirdPlaceFixtureObj.match_fixture = "third place";
										$scope.thirdPlaceFixtureObj.match_field = 1;
										$scope.thirdPlaceFixtureObj.match_started = "";
										$scope.thirdPlaceFixtureObj.competition_id = entry.id;
										$scope.thirdPlaceFixtureObj.match_venue = entry.comp_address.venue.nama;

										if(moment(thirdPlaceDate).format('dddd') === 'Monday'){
											$scope.thirdPlaceFixtureObj.match_referee = $scope.avMonRef[timeIndex][refereeIndex].username;
											$scope.thirdPlaceFixtureObj.match_analyst = $scope.avMonAnalysts[timeIndex][analystIndex].username;
										}else if(moment(thirdPlaceDate).format('dddd') === 'Tuesday'){
											$scope.thirdPlaceFixtureObj.match_referee = $scope.avTueRef[timeIndex][refereeIndex].username;
											$scope.thirdPlaceFixtureObj.match_analyst = $scope.avTueAnalysts[timeIndex][analystIndex].username;
										}else if(moment(thirdPlaceDate).format('dddd') === 'Wednesday'){
											$scope.thirdPlaceFixtureObj.match_referee = $scope.avWedRef[timeIndex][refereeIndex].username;
											$scope.thirdPlaceFixtureObj.match_analyst = $scope.avWedAnalysts[timeIndex][analystIndex].username;
										}else if(moment(thirdPlaceDate).format('dddd') === 'Thursday'){
											$scope.thirdPlaceFixtureObj.match_referee = $scope.avThuRef[timeIndex][refereeIndex].username;
											$scope.thirdPlaceFixtureObj.match_analyst = $scope.avThuAnalysts[timeIndex][analystIndex].username;
										}else if(moment(thirdPlaceDate).format('dddd') === 'Friday'){
											$scope.thirdPlaceFixtureObj.match_referee = $scope.avFriRef[timeIndex][refereeIndex].username;
											$scope.thirdPlaceFixtureObj.match_analyst = $scope.avFriAnalysts[timeIndex][analystIndex].username;
										}else if(moment(thirdPlaceDate).format('dddd') === 'Saturday'){
											$scope.thirdPlaceFixtureObj.match_referee = $scope.avSatRef[timeIndex][refereeIndex].username;
											$scope.thirdPlaceFixtureObj.match_analyst = $scope.avSatAnalysts[timeIndex][analystIndex].username;
										}else if(moment(thirdPlaceDate).format('dddd') === 'Sunday'){
											$scope.thirdPlaceFixtureObj.match_referee = $scope.avSunRef[timeIndex][refereeIndex].username;
											$scope.thirdPlaceFixtureObj.match_analyst = $scope.avSunAnalysts[timeIndex][analystIndex].username;
										}
										console.log($scope.thirdPlaceFixtureObj);
									},6000);
									

									// Final
									setTimeout(function(){
										refereeIndex = 0;
										$scope.finalFixtureObj = {};
										$scope.finalFixtureObj.match_homeTeamObj = {};
										$scope.finalFixtureObj.match_homeTeamObj.team_name = '';
										$scope.finalFixtureObj.match_homeTeamObj.score = 0;
										$scope.finalFixtureObj.match_homeTeamObj.formation = '';
										$scope.finalFixtureObj.match_homeTeamObj.lineup = '';
										$scope.finalFixtureObj.match_homeTeamObj.lastLineup = '';
										$scope.finalFixtureObj.match_homeTeamObj.sub = '';
										$scope.finalFixtureObj.match_homeTeamObj.lastSub = '';
										$scope.finalFixtureObj.match_homeTeamObj.player = '';

										$scope.finalFixtureObj.match_awayTeamObj = {};
										$scope.finalFixtureObj.match_awayTeamObj.team_name = '';
										$scope.finalFixtureObj.match_awayTeamObj.score = 0;
										$scope.finalFixtureObj.match_awayTeamObj.formation = '';
										$scope.finalFixtureObj.match_awayTeamObj.lineup = '';
										$scope.finalFixtureObj.match_awayTeamObj.lastLineup = '';
										$scope.finalFixtureObj.match_awayTeamObj.sub = '';
										$scope.finalFixtureObj.match_awayTeamObj.lastSub = '';
										$scope.finalFixtureObj.match_awayTeamObj.player = '';

										$scope.finalFixtureObj.id = "MA" + $rootScope.randomString + 1 + m;
										$scope.finalFixtureObj.match_homeTeam = "";
										$scope.finalFixtureObj.match_awayTeam = "";
										$scope.finalFixtureObj.match_date = moment(finalDate).toISOString();
										$scope.finalFixtureObj.match_time = timeArr[3];
										$scope.finalFixtureObj.match_fixture = "final";
										$scope.finalFixtureObj.match_field = 1;
										$scope.finalFixtureObj.match_started = "";
										$scope.finalFixtureObj.competition_id = entry.id;
										$scope.finalFixtureObj.match_venue = entry.comp_address.venue.nama;

										if(moment(finalDate).format('dddd') === 'Monday'){
											$scope.finalFixtureObj.match_referee = $scope.avMonRef[timeIndex][refereeIndex].username;
											$scope.finalFixtureObj.match_analyst = $scope.avMonAnalysts[timeIndex][analystIndex].username;
										}else if(moment(finalDate).format('dddd') === 'Tuesday'){
											$scope.finalFixtureObj.match_referee = $scope.avTueRef[timeIndex][refereeIndex].username;
											$scope.finalFixtureObj.match_analyst = $scope.avTueAnalysts[timeIndex][analystIndex].username;
										}else if(moment(finalDate).format('dddd') === 'Wednesday'){
											$scope.finalFixtureObj.match_referee = $scope.avWedRef[timeIndex][refereeIndex].username;
											$scope.finalFixtureObj.match_analyst = $scope.avWedAnalysts[timeIndex][analystIndex].username;
										}else if(moment(finalDate).format('dddd') === 'Thursday'){
											$scope.finalFixtureObj.match_referee = $scope.avThuRef[timeIndex][refereeIndex].username;
											$scope.finalFixtureObj.match_analyst = $scope.avThuAnalysts[timeIndex][analystIndex].username;
										}else if(moment(finalDate).format('dddd') === 'Friday'){
											$scope.finalFixtureObj.match_referee = $scope.avFriRef[timeIndex][refereeIndex].username;
											$scope.finalFixtureObj.match_analyst = $scope.avFriAnalysts[timeIndex][analystIndex].username;
										}else if(moment(finalDate).format('dddd') === 'Saturday'){
											$scope.finalFixtureObj.match_referee = $scope.avSatRef[timeIndex][refereeIndex].username;
											$scope.finalFixtureObj.match_analyst = $scope.avSatAnalysts[timeIndex][analystIndex].username;
										}else if(moment(finalDate).format('dddd') === 'Sunday'){
											$scope.finalFixtureObj.match_referee = $scope.avSunRef[timeIndex][refereeIndex].username;
											$scope.finalFixtureObj.match_analyst = $scope.avSunAnalysts[timeIndex][analystIndex].username;
										}
										console.log($scope.finalFixtureObj);
									},6000);
								}
							},2000);
								

								 // "registeredTeam": "Uruguay,Russia,Saudia Arabia,Egypt,Spain,Portugal,IR Iran,Morocco,France,Denmark,Peru,Australia,Croatia,Argentina,Nigeria,Iceland,Brazil,Switzerland,Serbia,Costa Rica,Sweden,Mexico,Korea Republic,Germany,Belgium,England,Tunisia,Panama,Colombia,Japan,Senegal,Poland",

								// .Date Selection For All The Matches

								// Referee Selection For All The Matches
								// .Referee Selection For All The Matches

								// Save matches to database
								// var savedMatchesFirstRound = [];
								// var savedMatchesSecondRound = [];
								// var savedMatchesThirdRound = [];
								// var savedMatchesRoundOf16 = [];
								// var savedMatchesQuarterFinal = [];
								// var savedMatchesSemiFinal = [];
								// var savedMatchesThirdPlace = [];
								// var savedMatchesFinal = [];

						
								if(entry.schedule_status === 'On Queue'){

									setTimeout(function(){

										var savedMatchesFirstRound = [];
										var savedMatchesSecondRound = [];
										var savedMatchesThirdRound = [];
										var savedMatchesRoundOf16 = [];
										var savedMatchesQuarterFinal = [];
										var savedMatchesSemiFinal = [];
										var savedMatchesThirdPlace = [];
										var savedMatchesFinal = [];
										var timeOutTime = 1000;
								
										$scope.firstRoundFixtureObj.forEach(function(entry){
											addMatchDelay(entry,timeOutTime);
											timeOutTime += 10;
										});

										// 	set timer to addMatch function to minimize the number of request per second to prevent failed request
										function addMatchDelay(entry,timeOutTime){
											setTimeout(function(){
												//insert data to database
												console.log("blm ad");
												MatchService.addMatch(entry).success(function(data){
													console.log("add match");
													console.log(data);
												}).error(function(data){
													$ionicLoading.hide();
												});
												//insert data to database
											},timeOutTime);
										}

										$scope.secondRoundFixtureObj.forEach(function(entry){
													addMatchDelay(entry,timeOutTime);
													// savedMatchesSecondRound.push(entry.id);
													timeOutTime += 10;
											
										});

										// 	set timer to addMatch function to minimize the number of request per second to prevent failed request
										function addMatchDelay(entry,timeOutTime){
											setTimeout(function(){
												//insert data to database
												console.log("blm ad");
												MatchService.addMatch(entry).success(function(data){
													// $ionicLoading.hide();
													console.log("add match");
													console.log(data);
													// savedMatchesSecondRound.push(entry.id);
												}).error(function(data){
													// $ionicLoading.hide();
												});
												//insert data to database
											},timeOutTime);
										}

										$scope.thirdRoundFixtureObj.forEach(function(entry){
													addMatchDelay(entry,timeOutTime);
													// savedMatchesThirdRound.push(entry.id);
													timeOutTime += 10;
										});

										// 	set timer to addMatch function to minimize the number of request per second to prevent failed request
										function addMatchDelay(entry,timeOutTime){
											setTimeout(function(){
												//insert data to database
												console.log("blm ad");
												MatchService.addMatch(entry).success(function(data){
													// $ionicLoading.hide();
													console.log("add match");
													console.log(data);
													// savedMatchesThirdRound.push(entry.id);
												}).error(function(data){
													// $ionicLoading.hide();
												});
												//insert data to database
											},timeOutTime);
										}

										if(entry.comp_numOfTeam === 32){
											$scope.roundOf16FixtureObj.forEach(function(entry){
											
														addMatchDelay(entry,timeOutTime);
														// savedMatchesRoundOf16.push(entry.id);
														timeOutTime += 10;
												
											});

											// 	set timer to addMatch function to minimize the number of request per second to prevent failed request
											function addMatchDelay(entry,timeOutTime){
												setTimeout(function(){
													//insert data to database
													console.log("blm ad");
													MatchService.addMatch(entry).success(function(data){
														// $ionicLoading.hide();
														console.log("add match");
														console.log(data);
														// savedMatchesRoundOf16.push(entry.id);
													}).error(function(data){
														// $ionicLoading.hide();
													});
													//insert data to database
												},timeOutTime);
											}
										}

										if(entry.comp_numOfTeam !== 8){
											$scope.quarterFinalFixtureObj.forEach(function(entry){
											
														addMatchDelay(entry,timeOutTime);
														// savedMatchesQuarterFinal.push(entry.id);
														timeOutTime += 10;
												
											});

											// 	set timer to addMatch function to minimize the number of request per second to prevent failed request
											function addMatchDelay(entry,timeOutTime){
												setTimeout(function(){
													//insert data to database
													console.log("blm ad");
													MatchService.addMatch(entry).success(function(data){
														// $ionicLoading.hide();
														console.log("add match");
														console.log(data);
														// savedMatchesQuarterFinal.push(entry.id);
													}).error(function(data){
														// $ionicLoading.hide();
													});
													//insert data to database
												},timeOutTime);
											}
										}

										$scope.semiFinalFixtureObj.forEach(function(entry){
										
													addMatchDelay(entry,timeOutTime);
													// savedMatchesSemiFinal.push(entry.id);
													timeOutTime += 10;
										});

										// 	set timer to addMatch function to minimize the number of request per second to prevent failed request
										function addMatchDelay(entry,timeOutTime){
											setTimeout(function(){
												//insert data to database
												console.log("blm ad");
												MatchService.addMatch(entry).success(function(data){
													// $ionicLoading.hide();
													console.log("add match");
													console.log(data);
													// savedMatchesSemiFinal.push(entry.id);
												}).error(function(data){
													// $ionicLoading.hide();
												});
												//insert data to database
											},timeOutTime);
										}

										// $scope.thirdPlaceFixtureObj.forEach(function(entry){
										
													addMatchDelay($scope.thirdPlaceFixtureObj,timeOutTime);
													// savedMatchesThirdPlace.push($scope.thirdPlaceFixtureObj.id);
													timeOutTime += 10;
												
											// }
										// });

										// 	set timer to addMatch function to minimize the number of request per second to prevent failed request
										function addMatchDelay(entry,timeOutTime){
											setTimeout(function(){
												//insert data to database
												console.log("blm ad");
												MatchService.addMatch(entry).success(function(data){
													// $ionicLoading.hide();
													console.log("add match");
													console.log(data);
													// savedMatchesThirdPlace.push(entry.id);
												}).error(function(data){
													// $ionicLoading.hide();
												});
												//insert data to database
											},timeOutTime);
										}

										// $scope.finalFixtureObj.forEach(function(entry){
											
													addMatchDelay($scope.finalFixtureObj,timeOutTime);
													// savedMatchesFinal.push($scope.finalFixtureObj.id);
													timeOutTime += 10;
												
											// }
										// });

										// 	set timer to addMatch function to minimize the number of request per second to prevent failed request
										function addMatchDelay(entry,timeOutTime){
											setTimeout(function(){
												//insert data to database
												console.log("blm ad");
												MatchService.addMatch(entry).success(function(data){
													// $ionicLoading.hide();
													console.log("add match");
													console.log(data);
													// savedMatchesFinal.push(entry.id);
												}).error(function(data){
													// $ionicLoading.hide();
												});
												//insert data to database
											},timeOutTime);
										}
									},50000);
								}
									
								// another timer to change the schedule status to on progress
								// if didn't change the status than it will save the data endlessly
								setTimeout(function(){
									if(entry.schedule_status === 'On Queue'){
										console.log("change schedule status to on progress");
										$scope.formCompetition = {};
										// schedule status (on queue, on progress, completed)
										// on queue (team just registered)
										// on progress (competition already has full team, auto scheduling completed)
										// completed (match date and referee has been selected)
										$scope.formCompetition.schedule_status = "On Progress";
										
										CompetitionService.editCompetition(entry.id, localStorage.getItem("token"), $scope.formCompetition).success(function(data) {
											// $ionicLoading.hide();
											console.log("berhasil");
											$scope.loadCompetition = setInterval($scope.getCompetitionByOrganizer, 3000);	
										}).error(function(data) {
											// $ionicLoading.hide();
											console.log("gagal");
										});
									}	
								},100000);


								function arrayRotateEven(newTeams, reverse) {
								    if(reverse){
								        newTeams.unshift(newTeams.pop());
								        newTeams.splice(0,0,fixNum);

								        for(var n = 1; n < teamsLength; n++){
								            if(newTeams[n] == fixNum){
								                newTeams.splice(n,1);
								            }
								        }
								    }
								    else{
								        newTeams.push(newTeams.shift());
								        newTeams.splice(0,0,fixNum);
								        for(var m = 1; m < teamsLength; m++){
								            if(newTeams[m] == fixNum){
								                newTeams.splice(m,1);
								            }
								        }
								    }
								    return newTeams;
								}

								}
								// scheduling
							}
							// // bikin array utk menampung wasit-wasit yang available pada tanggal dan waktu pertandingan tertentu
							// var avRefArr = [];

							// // bikin function utk cari / get wasit-wasit yang available pada tgl dan waktu pertandingan tertentu
							// var date = "2010-10-20";
							// var time = "4:30";
							// var singleDate = date + " " + time;

							// console.log(singleDate);
							
							// // get day based on date
							// console.log(moment(date).format('dddd')); 

							// // bikin function utk get wasit yg available berdasarkan tgl dan waktu pertandingan tertentu
							// $scope.getAvRefByDayAndTime = function(day, time){
							// 	// bikin service / api utk get av ref where available_day === day && available_time === time
							// };

					}
				});
				if($scope.competition !== null){
					// clearInterval($scope.loadCompetition);
					$ionicLoading.hide();
				}
				$scope.competitionLoaded = true;
				$ionicLoading.hide();

			}).error(function(data) {});
		}
	};
	
	$scope.loadCompetition = setInterval($scope.getCompetitionByOrganizer, 2000);


	var date = new Date();
	$scope.thisDay = date.getDate();
	$scope.thisMonth = date.getMonth();
	$scope.thisMonthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	$scope.thisMonthName = $scope.thisMonthNames[$scope.thisMonth];
    $scope.thisYear = date.getFullYear();

	$scope.refMatchesByDateObj = {
		"competition": [],
		"matches": [],
		"matchId": []
	};

	$scope.analystMatchesByDateObj = {
		"competition": [],
		"matches": [],
		"matchId": []
	};

	// bedakan nama variable untuk today, next, dan prev 
	// supaya datanya tidak bentrokan


	console.log("today");
	// $rootScope.showLoading($ionicLoading);

	$scope.matchDate = $scope.thisDay + " " + $scope.thisMonthName + " " + $scope.thisYear;
	$scope.matchDate = new Date($scope.matchDate);
	$scope.matchDate = moment($scope.matchDate).toISOString();
	console.log($scope.matchDate);
	
	var index = -1;
	$scope.getMatchesByRefereeAndDate = function() {
		MatchService.getMatchesByRefereeAndDate(ls.getItem("username"),$scope.matchDate).success(function(data) {
			// console.log(data);

			data.forEach(function(match){
				if($scope.refMatchesByDateObj.competition.indexOf(match.competition_id) === -1){
					index++;
					
					CompetitionService.getCompetitionName(match.competition_id).success(function(data) {
						$scope.refMatchesByDateObj.competition.push(data);
						console.log(data);
					}).error(function(data) {});
					
					$scope.refMatchesByDateObj.matches[index] = [];
				}

				if($scope.refMatchesByDateObj.matchId.indexOf(match.id) === -1){
					$scope.refMatchesByDateObj.matches[index].push(match);
					$scope.refMatchesByDateObj.matchId.push(match.id);
				}
			});
			console.log($scope.refMatchesByDateObj);
			clearInterval($scope.loadMatchesByRefereeAndDate);
		}).error(function(data) {
			console.log("gagal");
		});
	};
	$scope.loadMatchesByRefereeAndDate = setInterval($scope.getMatchesByRefereeAndDate, 1000);

	var indexA = -1;
	$scope.getMatchesByAnalystAndDate = function() {
		MatchService.getMatchesByAnalystAndDate(ls.getItem("username"),$scope.matchDate).success(function(data) {

			data.forEach(function(match){
				if($scope.analystMatchesByDateObj.competition.indexOf(match.competition_id) === -1){
					indexA++;
					
					CompetitionService.getCompetitionName(match.competition_id).success(function(data) {
						$scope.analystMatchesByDateObj.competition.push(data);
						console.log(data);
					}).error(function(data) {});
					
					$scope.analystMatchesByDateObj.matches[indexA] = [];
				}

				if($scope.analystMatchesByDateObj.matchId.indexOf(match.id) === -1){
					$scope.analystMatchesByDateObj.matches[indexA].push(match);
					$scope.analystMatchesByDateObj.matchId.push(match.id);
				}
			});
			console.log($scope.analystMatchesByDateObj);
			clearInterval($scope.loadMatchesByAnalystAndDate);
		}).error(function(data) {
			console.log("gagal");
		});
	};
	$scope.loadMatchesByAnalystAndDate = setInterval($scope.getMatchesByAnalystAndDate, 1000);


	$scope.day = date.getDate();
	$scope.month = date.getMonth();
	$scope.monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	$scope.monthName = $scope.monthNames[$scope.month];
    $scope.year = date.getFullYear();
 
    $scope.refNext = function(){
		$rootScope.showLoading($ionicLoading);
	   	$scope.refMatchesByDateObj = {
			"competition": [],
			"matches": [],
			"matchId": []
		};

		console.log("next");
		$scope.showme = 2;
		var lastDay = new Date($scope.year, $scope.month + 1, 0);
		var ld = lastDay.getDate();
		if($scope.day == ld){
			console.log("afsfsdf");
			$scope.day = 1;
			$scope.month += 1;
			$scope.monthName = $scope.monthNames[$scope.month];
			if($scope.month == 12){
				$scope.month = 0;
				$scope.monthName = $scope.monthNames[$scope.month];
				$scope.year += 1;
			}
		}else{
			$scope.day += 1;
		}

		$scope.matchDate = $scope.day + " " + $scope.monthName + " " + $scope.year;
		$scope.matchDate = new Date($scope.matchDate);
		$scope.matchDate = moment($scope.matchDate).toISOString();
		console.log($scope.matchDate);

		$scope.matchesArr = [];
		$scope.allMatches = [];
		
		var index = -1;
		MatchService.getMatchesByRefereeAndDate(ls.getItem("username"),$scope.matchDate).success(function(data) {
			console.log(data);

			data.forEach(function(match){
				if($scope.refMatchesByDateObj.competition.indexOf(match.competition_id) !== -1){

				}else{
					index++;
					CompetitionService.getCompetitionName(match.competition_id).success(function(data) {
						$scope.refMatchesByDateObj.competition.push(data);
						console.log(data);
					}).error(function(data) {});
					$scope.refMatchesByDateObj.matches[index] = [];
				}
				// $scope.allLiveMatchesObj.matches = $scope.matchesArr.concat(data);
				if($scope.refMatchesByDateObj.matchId.indexOf(match.id) !== -1){

				}else{
					$scope.refMatchesByDateObj.matches[index].push(match);
					$scope.refMatchesByDateObj.matchId.push(match.id);
				}
			});
			console.log($scope.refMatchesByDateObj);

			setTimeout(function() {
            	$ionicLoading.hide();
        	}, 1500);

		}).error(function(data) {
			console.log("gagal");
			setTimeout(function() {
            	$ionicLoading.hide();
        	}, 1500);
		});
	};

	$scope.refPrev = function(){
		$scope.refMatchesByDateObj = {
			"competition": [],
			"matches": [],
			"matchId": []
		};

		$scope.showme = 2;
		$rootScope.showLoading($ionicLoading);
		if($scope.day == 1){
			$scope.month -= 1;
			console.log($scope.month);
			$scope.monthName = $scope.monthNames[$scope.month];
			var lastDay = new Date($scope.year, $scope.month + 1, 0);
			var ld = lastDay.getDate();
			$scope.day = ld;
			if($scope.month == -1){
				$scope.month = 11;
				$scope.monthName = $scope.monthNames[$scope.month];
				$scope.year -= 1;
			}
		}else{
			$scope.day -= 1;
		}

		$scope.matchDate = $scope.day + " " + $scope.monthName + " " + $scope.year;
		$scope.matchDate = new Date($scope.matchDate);
		$scope.matchDate = moment($scope.matchDate).toISOString();
		console.log($scope.matchDate);

		$scope.matchesArr = [];
		$scope.allMatches = [];
		
		var index = -1;
		MatchService.getMatchesByRefereeAndDate(ls.getItem("username"),$scope.matchDate).success(function(data) {
			console.log(data);

			data.forEach(function(match){
				if($scope.refMatchesByDateObj.competition.indexOf(match.competition_id) !== -1){

				}else{
					index++;
					CompetitionService.getCompetitionName(match.competition_id).success(function(data) {
						$scope.refMatchesByDateObj.competition.push(data);
						console.log(data);
					}).error(function(data) {});
					$scope.refMatchesByDateObj.matches[index] = [];
				}
				// $scope.allLiveMatchesObj.matches = $scope.matchesArr.concat(data);
				if($scope.refMatchesByDateObj.matchId.indexOf(match.id) !== -1){

				}else{
					$scope.refMatchesByDateObj.matches[index].push(match);
					$scope.refMatchesByDateObj.matchId.push(match.id);
				}
			});
			console.log($scope.refMatchesByDateObj);

			setTimeout(function() {
            	$ionicLoading.hide();
        	}, 1500);

		}).error(function(data) {
			console.log("gagal");

			setTimeout(function() {
            	$ionicLoading.hide();
        	}, 1500);
		});
	};

	$scope.analystNext = function(){
		$rootScope.showLoading($ionicLoading);
	   	$scope.analystMatchesByDateObj = {
			"competition": [],
			"matches": [],
			"matchId": []
		};

		console.log("next");
		$scope.showme = 2;
		var lastDay = new Date($scope.year, $scope.month + 1, 0);
		var ld = lastDay.getDate();
		if($scope.day == ld){
			console.log("afsfsdf");
			$scope.day = 1;
			$scope.month += 1;
			$scope.monthName = $scope.monthNames[$scope.month];
			if($scope.month == 12){
				$scope.month = 0;
				$scope.monthName = $scope.monthNames[$scope.month];
				$scope.year += 1;
			}
		}else{
			$scope.day += 1;
		}

		$scope.matchDate = $scope.day + " " + $scope.monthName + " " + $scope.year;
		$scope.matchDate = new Date($scope.matchDate);
		$scope.matchDate = moment($scope.matchDate).toISOString();
		console.log($scope.matchDate);

		$scope.matchesArr = [];
		$scope.allMatches = [];
		
		var index = -1;
		MatchService.getMatchesByAnalystAndDate(ls.getItem("username"),$scope.matchDate).success(function(data) {
			console.log(data);

			data.forEach(function(match){
				if($scope.analystMatchesByDateObj.competition.indexOf(match.competition_id) !== -1){

				}else{
					index++;
					CompetitionService.getCompetitionName(match.competition_id).success(function(data) {
						$scope.analystMatchesByDateObj.competition.push(data);
						console.log(data);
					}).error(function(data) {});
					$scope.analystMatchesByDateObj.matches[index] = [];
				}
				// $scope.allLiveMatchesObj.matches = $scope.matchesArr.concat(data);
				if($scope.analystMatchesByDateObj.matchId.indexOf(match.id) !== -1){

				}else{
					$scope.analystMatchesByDateObj.matches[index].push(match);
					$scope.analystMatchesByDateObj.matchId.push(match.id);
				}
			});
			console.log($scope.analystMatchesByDateObj);

			setTimeout(function() {
            	$ionicLoading.hide();
        	}, 5000);

		}).error(function(data) {
			console.log("gagal");
			setTimeout(function() {
            	$ionicLoading.hide();
        	}, 5000);
		});
	};

	$scope.analystPrev = function(){
		$scope.analystMatchesByDateObj = {
			"competition": [],
			"matches": [],
			"matchId": []
		};

		$scope.showme = 2;
		$rootScope.showLoading($ionicLoading);
		if($scope.day == 1){
			$scope.month -= 1;
			console.log($scope.month);
			$scope.monthName = $scope.monthNames[$scope.month];
			var lastDay = new Date($scope.year, $scope.month + 1, 0);
			var ld = lastDay.getDate();
			$scope.day = ld;
			if($scope.month == -1){
				$scope.month = 11;
				$scope.monthName = $scope.monthNames[$scope.month];
				$scope.year -= 1;
			}
		}else{
			$scope.day -= 1;
		}

		$scope.matchDate = $scope.day + " " + $scope.monthName + " " + $scope.year;
		$scope.matchDate = new Date($scope.matchDate);
		$scope.matchDate = moment($scope.matchDate).toISOString();
		console.log($scope.matchDate);

		$scope.matchesArr = [];
		$scope.allMatches = [];
		
		var index = -1;
		MatchService.getMatchesByAnalystAndDate(ls.getItem("username"),$scope.matchDate).success(function(data) {
			console.log(data);

			data.forEach(function(match){
				if($scope.analystMatchesByDateObj.competition.indexOf(match.competition_id) !== -1){

				}else{
					index++;
					CompetitionService.getCompetitionName(match.competition_id).success(function(data) {
						$scope.analystMatchesByDateObj.competition.push(data);
						console.log(data);
					}).error(function(data) {});
					$scope.analystMatchesByDateObj.matches[index] = [];
				}
				// $scope.allLiveMatchesObj.matches = $scope.matchesArr.concat(data);
				if($scope.analystMatchesByDateObj.matchId.indexOf(match.id) !== -1){

				}else{
					$scope.analystMatchesByDateObj.matches[index].push(match);
					$scope.analystMatchesByDateObj.matchId.push(match.id);
				}
			});
			console.log($scope.analystMatchesByDateObj);

			setTimeout(function() {
            	$ionicLoading.hide();
        	}, 5000);

		}).error(function(data) {
			console.log("gagal");

			setTimeout(function() {
            	$ionicLoading.hide();
        	}, 5000);
		});
	};

	$scope.showme = 'available';
	$scope.refMatches = {};
	$scope.allRefMatchesObj = {
		"date": [],
		"matches": [],
		"matchId": []
	};
	$scope.refMatchesDays = [];
	$scope.analystMatches = {};
	$scope.allAnalystMatchesObj = {
		"date": [],
		"matches": [],
		"matchId": []
	};
	$scope.analystMatchesDays = [];
	$scope.diffTime = [];
	var interval = [];
	$scope.d = [];
	$scope.h = [];
	$scope.m = [];
	$scope.s = [];

	$scope.getMatchesByReferee = function(){
		console.log("get matches by referee");
		if(ls.getItem("role") === 'Referee'){
			$ionicLoading.hide();
			MatchService.getMatchesByReferee(localStorage.getItem("username")).success(function(data) {
				// console.log("berhasil");
				// console.log(data.length);
				// data.forEach(function(match){
				// 	$scope.refMatches.push(data);
				// });
				$scope.refMatches = data;

				$scope.arrFromRefMatches = Object.keys($scope.refMatches).map(function(key) {
				    return $scope.refMatches[key];
				});

				// console.log($scope.refMatches);
				var index = -1;
				$scope.refMatches.forEach(function(match){

				// $scope.refMatchesDays[match.id] = moment(match.match_date).toNow();
				$scope.refMatchesDate = moment(match.match_date).format('DD-MM-YYYY');

				// console.log(moment(match.match_time).format('HH:mm:ss'));
			    var eventTime = moment($scope.refMatchesDate + " " + match.match_time, 'DD-MM-YYYY HH:mm:ss').unix();
			    var currentTime = moment().unix();
			    $scope.diffTime[match.id] = eventTime - currentTime;    
			    var duration = moment.duration($scope.diffTime[match.id] * 1000, 'milliseconds');
			    interval[match.id] = 1000;


			    // if time to countdown
			    if($scope.diffTime[match.id] > 0) {

			        setInterval(function(){

			            duration = moment.duration(duration.asMilliseconds() - interval[match.id], 'milliseconds');
			            $scope.d[match.id] = moment.duration(duration).days(),
			            $scope.h[match.id] = moment.duration(duration).hours(),
			            $scope.m[match.id] = moment.duration(duration).minutes(),
			            $scope.s[match.id] = moment.duration(duration).seconds();

			          	$scope.d[match.id] = $.trim($scope.d[match.id]).length === 1 ? '0' + $scope.d[match.id] : $scope.d[match.id];
			            $scope.h[match.id] = $.trim($scope.h[match.id]).length === 1 ? '0' + $scope.h[match.id] : $scope.h[match.id];
			            $scope.m[match.id] = $.trim($scope.m[match.id]).length === 1 ? '0' + $scope.m[match.id] : $scope.m[match.id];
			            $scope.s[match.id] = $.trim($scope.s[match.id]).length === 1 ? '0' + $scope.s[match.id] : $scope.s[match.id];

			        }, interval[match.id]);

			    }else if($scope.diffTime[match.id] <= 0){
			    }

					// $scope.allLiveMatchesArr = $scope.liveMatchArr.concat(data);
					if($scope.allRefMatchesObj.date.indexOf(match.match_date) !== -1){

					}else{
						index++;
						$scope.allRefMatchesObj.date.push(match.match_date);
						$scope.allRefMatchesObj.matches[index] = [];
					}
					// $scope.allLiveMatchesObj.matches = $scope.matchesArr.concat(data);
					if($scope.allRefMatchesObj.matchId.indexOf(match.id) !== -1){

					}else{
						$scope.allRefMatchesObj.matches[index].push(match);
						$scope.allRefMatchesObj.matchId.push(match.id);
					}
					$ionicLoading.hide();				
				});
				// clearInterval($scope.loadRefMatches);
			}).error(function(data) {
				console.log("gagal");
				$ionicLoading.hide();
			});
		}
	};

	$scope.getMatchesByAnalyst = function(){
		console.log("get matches by analyst");
		if(ls.getItem("role") === 'Analyst'){
			$ionicLoading.hide();
			MatchService.getMatchesByAnalyst(localStorage.getItem("username")).success(function(data) {
				// console.log("berhasil");
				// console.log(data.length);
				data.sort(function(a, b) {
                    var dateA = new Date(a.match_date),
                        dateB = new Date(b.match_date);
                    return dateA - dateB;//sort by date ascending
                });
				$scope.analystMatches = data;

				// console.log($scope.analystMatches);
				var index = -1;
				$scope.analystMatches.forEach(function(match){

				// $scope.analystMatchesDays[match.id] = moment(match.match_date).toNow();
				$scope.analystMatchesDate = moment(match.match_date).format('DD-MM-YYYY');

				// console.log(moment(match.match_time).format('HH:mm:ss'));
			    var eventTime = moment($scope.analystMatchesDate + " " + match.match_time, 'DD-MM-YYYY HH:mm:ss').unix();
			    var currentTime = moment().unix();
			    $scope.diffTime[match.id] = eventTime - currentTime;    
			    var duration = moment.duration($scope.diffTime[match.id] * 1000, 'milliseconds');
			    interval[match.id] = 1000;


			    // if time to countdown
			    if($scope.diffTime[match.id] > 0) {

			        setInterval(function(){

			            duration = moment.duration(duration.asMilliseconds() - interval[match.id], 'milliseconds');
			            $scope.d[match.id] = moment.duration(duration).days(),
			            $scope.h[match.id] = moment.duration(duration).hours(),
			            $scope.m[match.id] = moment.duration(duration).minutes(),
			            $scope.s[match.id] = moment.duration(duration).seconds();

			          	$scope.d[match.id] = $.trim($scope.d[match.id]).length === 1 ? '0' + $scope.d[match.id] : $scope.d[match.id];
			            $scope.h[match.id] = $.trim($scope.h[match.id]).length === 1 ? '0' + $scope.h[match.id] : $scope.h[match.id];
			            $scope.m[match.id] = $.trim($scope.m[match.id]).length === 1 ? '0' + $scope.m[match.id] : $scope.m[match.id];
			            $scope.s[match.id] = $.trim($scope.s[match.id]).length === 1 ? '0' + $scope.s[match.id] : $scope.s[match.id];

			        }, interval[match.id]);

			    }else if($scope.diffTime[match.id] <= 0){
			    }

					if($scope.allAnalystMatchesObj.date.indexOf(match.match_date) !== -1){

					}else{
						index++;
						$scope.allAnalystMatchesObj.date.push(match.match_date);
						$scope.allAnalystMatchesObj.matches[index] = [];
					}
					if($scope.allAnalystMatchesObj.matchId.indexOf(match.id) !== -1){

					}else{
						$scope.allAnalystMatchesObj.matches[index].push(match);
						$scope.allAnalystMatchesObj.matchId.push(match.id);
					}	
					$ionicLoading.hide();				
				});
			}).error(function(data) {
				console.log("gagal");
				$ionicLoading.hide();
			});
		}
	};

	// setTimeout(function(){
		if(ls.getItem("role") === 'Referee'){
			console.log("refereeeeei i i iii ");
			$ionicLoading.hide();
			$scope.showme = 'available';
			window.loadRefMatches = setInterval($scope.getMatchesByReferee, 1000);

			$scope.showme1 = function(){
				window.loadRefMatches = setInterval($scope.getMatchesByReferee, 1000);
				$scope.showme = 'available';
				console.log('available');
			}

			$scope.showme2 = function(){
				clearInterval(window.loadRefMatches);
				$scope.showme = 2;
				console.log('2');
				// clearInterval(window.loadRefMatches);
			}
		}
	// },2000);
	

	setTimeout(function(){
		if(ls.getItem("role") === 'Analyst'){
			window.loadAnalystMatches = setInterval($scope.getMatchesByAnalyst, 1000);

			$scope.showme1 = function(){
				window.loadAnalystMatches = setInterval($scope.getMatchesByAnalyst, 1000);
				$scope.showme = 'available';
				console.log('available');
			}

			$scope.showme2 = function(){
				$scope.showme = 2;
				console.log('2');
				clearInterval(window.loadRefMatches);
				clearInterval(window.loadAnalystMatches);
			}
		}
	},2000);


	// go to track score page
	$scope.goToTrackScore = function(id) { 
		clearInterval(window.loadRefMatches);
		localStorage.setItem("matchResultBackStatus","home");
		$state.go('app.track_score', {
			'matchId': id
		});
	};

	// go to analyze match page
	$scope.goToAnalyzeMatch = function(id) { 
		clearInterval(window.loadAnalystMatches);
		$state.go('app.analyze_match', {
			'matchId': id
		});
	};

	// go to match detail page
	$scope.goToMatchDetail = function(id) { 
		localStorage.setItem("matchResultBackStatus", "home");
		$state.go('app.match_detail', {
			'matchId': id
		});
	};

	// go to match info page
	$scope.goToMatchInfo = function(id) { 
		localStorage.setItem("matchInfoBackStatus", "home");
		$state.go('app.match_info', {
			'matchId': id
		});
	};

	$scope.doRefresh = function() {
		$rootScope.reload($state,$scope);
	};	

	// get all competition for user with role player, coach, or manager
	$scope.getAllCompetition = function(){
		if(ls.getItem("role") === 'Player' || ls.getItem("role") === 'Coach'|| ls.getItem("role") === 'Manager'){
			CompetitionService.getAllCompetition().success(function(data) {
				// $ionicLoading.hide();
				$scope.registerStatus = [];
				$scope.allCompetition = {};
				$scope.allCompetition = data;
				$scope.newTeams = [];
				$scope.fixNum = "";
				$scope.match = [];
				$scope.matches = [];
				$scope.all = [];
				$scope.registeredTeamLength = [];
				$scope.registered = [];
				$scope.registerStatus = [];
				console.log($scope.allCompetition);
				console.log(data);

				// Check if team has registered in the competition
				data.forEach(function(entry){
					if(entry.registeredTeam != null){
						$scope.registerArr = entry.registeredTeam.split(',');
						$scope.registeredTeamLength[entry.id] = $scope.registerArr.length;
						var a = $scope.registerArr.indexOf(localStorage.getItem("team"));
						if(a != -1){
							$scope.registered[entry.id] = true;
						}else{
							$scope.registered[entry.id] = false;
						}

						if($scope.registeredTeamLength[entry.id] === entry.comp_numOfTeam){
							$scope.registerStatus[entry.id] = 'full';
						}else{
							$scope.registerStatus[entry.id] = 'available';
						}

					}else{
						$scope.registered[entry.id] = false;
					}
					console.log($scope.registered[entry.id]);
				});
				// Check if team has registered in the competition

				if($scope.allCompetition !== null){
					clearInterval($scope.loadAllCompetition);
					$ionicLoading.hide();
				}
			}).error(function(data) {
				$ionicLoading.hide();
			});
		}
	};

	// start timer to load add competition each 5 second
	$scope.loadAllCompetition = setInterval($scope.getAllCompetition, 100);

	$scope.editMatch = function(id) { 
		clearInterval($scope.loadCompetition);
		$state.go('app.edit_match', {
			'matchId': id
		});
	};
	$scope.goToMatchDetail = function(id) {
		localStorage.setItem("matchResultBackStatus", "home");
		clearInterval($scope.loadCompetition);
		$state.go('app.match_detail', {
			'matchId': id
		});
	};
	$scope.liveScore = function(id) { 
		clearInterval($scope.loadCompetition);
		$state.go('app.live_score', {
			'matchId': id
		});
	};
	$scope.trackScore = function(id) {
		clearInterval($scope.loadCompetition);
		$state.go('app.track_score', {
			'matchId': id
		});
	};
	$scope.viewMatches = function(id) { 
		clearInterval($scope.loadCompetition);
		$state.go('app.schedule', {
			'competitionId': id
		});
	};
	$scope.createCompetition = function(){
		clearInterval($scope.loadCompetition);
		$state.go('app.create_competition');
	};
	$scope.more = function(id) {
		clearInterval($scope.loadCompetition);
		$state.go('app.competition_detail', {
			'competitionId': id
		});
	};
	$scope.completeScheduling = function(id) {
		clearInterval($scope.loadCompetition);
		$state.go('app.complete_scheduling', {
			'competitionId': id
		});
	};
	$scope.viewMatchDetail = function(id) {
		clearInterval($scope.loadCompetition);
		clearInterval(window.loadRefMatches);
		$state.go('app.match_info', {
			'matchId': id
		});
	};
	$scope.viewMatchInfo = function(id) {
		clearInterval($scope.loadCompetition);
		$state.go('app.match_info', {
			'matchId': id
		});
	};
	$scope.goToEditCompetition = function(id) {
		clearInterval($scope.loadCompetition);
		$state.go('app.edit_competition', {
			'competitionId': id
		});
	};
	$scope.goToCompleteProfile = function() {
		clearInterval($scope.loadCompetition);
		$state.go('app.complete_profile');
	};
	$scope.goToClassement = function(){
		clearInterval($scope.loadCompetition);
		$state.go('app.classement');
	};
	$scope.goToCompetitionSchedule = function(id) {
		localStorage.setItem("backStatus", "home");
		clearInterval($scope.loadCompetition);
		$state.go('app.competition_schedule', {
			'competitionId': id
		});
	};
	$scope.request = function(id) {
		$scope.loadAvailableMatches = setInterval($scope.getAvailableMatches, 1000);
		console.log(id);
		var confirmPopup = $ionicPopup.confirm({
			title: 'Request to lead this match',
			template: 'Are you sure?'
		});
		confirmPopup.then(function(res) {
	        if(res) {
				$state.go('app.home');
				$scope.showme='available';
	            console.log('Sure!');
	            $scope.refereeData = {};
	            $scope.refereeData.id = id;
	            $scope.refereeData.match_referee = localStorage.getItem("username");
				$scope.refereeData.referee_status = "onprogress";
	            MatchService.request(id, localStorage.getItem("token"), $scope.refereeData).success(function(data) {
					$ionicLoading.hide();
					$scope.showme='onprogress';
					clearInterval($scope.loadAvailableMatches);
					$state.go('app.home');

				}).error(function(data) {
					$ionicLoading.hide();
				});
	         } else {
	            console.log('Not sure!');
	         }
	    });
	};	
	$scope.delCompetition = function(id) {

		console.log($scope.menuProfile);
		$scope.profileData = {};
		$scope.profileData.createdCompetition = {};
		$scope.profileData.createdCompetition.active = "";
		$scope.profileData.createdCompetition.completed = $scope.menuProfile.createdCompetition.completed;

		var activeCompetitionArr = $scope.menuProfile.createdCompetition.active.split(",");
		var compName = "";
		var activeCompetitions = [];

		CompetitionService.getCompetitionName(id).success(function(data) {
			compName = data;
			console.log(compName);
		}).error(function(data) {});

		var confirmPopup = $ionicPopup.confirm({
			title: 'Delete Competition',
			template: 'Are you sure?'
		});

		confirmPopup.then(function(res) {

	        if(res) {

	        	activeCompetitionArr.forEach(function(comp){
					if(comp === compName){
						console.log("sama");
						comp = "";
					}else{
						// $scope.activeCompetitionArr.push(comp);
						activeCompetitions.push(comp);
					}
				});

	        	if(activeCompetitions.length > 1){
	        		$scope.profileData.createdCompetition.active = activeCompetitions.join(",");
	        	}else{
	        		$scope.profileData.createdCompetition.active = activeCompetitions[0];
	        	}
				
	        	console.log($scope.profileData);
	            console.log('Sure!');

	            $rootScope.showLoading();

	            CompetitionService.delCompetition(id).success(function(data) {
		            $scope.loadCompetition = setInterval($scope.getCompetitionByOrganizer, 100);
		            setTimeout(function(){
		            	$ionicLoading.hide();
		            },5000);
				}).error(function(data) {
					// $ionicLoading.hide();
					 setTimeout(function(){
		            	$ionicLoading.hide();
		            },5000);
				});

				ProfileService.editProfileById(localStorage.getItem("userid"), localStorage.getItem("token"), $scope.profileData).success(function(data) {
					console.log("berhasil");
				}).error(function(data) {});

	         } else {
	            console.log('Not sure!');
	         }
	    });
	};
	$scope.registerCompetition = function(id) {
		var confirmPopup = $ionicPopup.confirm({
			title: 'Register Competition',
			template: 'Are you sure?'
		});
		confirmPopup.then(function(res) {
	         if(res) {
	            console.log('Sure!');
		        var teamCoach = localStorage.getItem("myTeamCoach");
				var teamSquad = localStorage.getItem("myTeamSquad").split(",");
				var teamSquadLength = teamSquad.length;

				if(localStorage.getItem("team") === ''){
					var confirmPopup = $ionicPopup.alert({
						title: 'Register Competition Failed',
						template: 'You must have a team before you can register into any competition!'
					});
				}else if(teamCoach !== '' && teamSquadLength >= 8){
					// Register competition

					$scope.formCompetition = {};
					$scope.formCompetition.TeamName = localStorage.getItem("team");
					$scope.formCompetition.CompetitionId = id;
					// $scope.formCompetition.schedule_status = 'On Queue';
					console.log($scope.formCompetition);

					$scope.formTeam = {};
					$scope.formTeam.CompId = id;
					$scope.formTeam.TeamId = localStorage.getItem("myTeamId");
					// if($scope.menuProfile.team === '' || $scope.menuProfile.team === null){
						// var confirmPopup = $ionicPopup.alert({
						// 	title: 'Register Competition Failed',
						// 	template: 'You must join a team before you can register into any competition!'
						// });
					// }else{
						console.log("register competition");
						// CompetitionService.registerTeam(localStorage.getItem("myTeamId"),localStorage.getItem("token"),$scope.formTeam).success(function(data){
						// 	$ionicLoading.hide();
						// 	$state.go('app.competition');
						// }).error(function(data){
						// 	$ionicLoading.hide();
						// });

						TeamService.addCompetition($scope.formTeam).success(function(data){
							$ionicLoading.hide();
							$state.go($state.current, {}, {
				                reload: true
				            });
						}).error(function(data){
							$ionicLoading.hide();
						}); 

						CompetitionService.addRegister($scope.formCompetition).success(function(data){
							$ionicLoading.hide();
							$state.go($state.current, {}, {
				                reload: true
				            });
						}).error(function(data){
							$ionicLoading.hide();
						});     
					// }

				}else if(teamCoach === ''){
					// show an alert
					$rootScope.showPopup($ionicPopup,'Register Failed!','Your team must have a coach', 'popup-error');
				}else if(teamSquadLength <= 8){
					// show an alert
					$rootScope.showPopup($ionicPopup,'Register Failed!','Your team members must be minimal 8 peoples', 'popup-error');
				}
	         } else {
	            console.log('Not sure!');
	         }
	    });
	};
	//Fungsi utk rotate value pada array untuk tim yg berjumlah genap
	$scope.arrayRotateEven = function(newTeams, reverse) {
		if(reverse){
			$scope.newTeams.unshift($scope.newTeams.pop());
			$scope.newTeams.splice(0,0,$scope.fixNum);

			for(var n = 1; n < $scope.registerArrLength; n++){
				if($scope.newTeams[n] == $scope.fixNum){
					$scope.newTeams.splice(n,1);
				}
			}
		}
		else{
			$scope.newTeams.push(newTeams.shift());
			$scope.newTeams.splice(0,0,$scope.fixNum);
			for(var m = 1; m < $scope.registerArrLength; m++){
				if($scope.newTeams[m] == $scope.fixNum){
					$scope.newTeams.splice(m,1);
				}
			}
		}
		return $scope.newTeams;
	};
	//Fungsi utk rotate value pada array untuk tim yg berjumlah ganjil
	$scope.arrayRotateOdd = function(teams, reverse) {
		if(reverse){
			$scope.registerArr.unshift($scope.registerArr.pop());
		}
		else{
			$scope.registerArr.push($scope.registerArr.shift());
		}
		return $scope.registerArr;
	};
})

.controller('ProfileCtrl', function($scope, $rootScope, $state, $ionicPopup, $ionicPlatform, $ionicLoading, LoginService, CompetitionService, TeamService, PostService, ProfileService, $cordovaImagePicker, $cordovaCamera) {
	 $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
     });
     $scope.loadCompleted = false;
		//implement logic here
		$scope.profile = {};
		// $scope.image = "";
		$scope.uploadImage = function() {
			document.getElementById('file-upload').click();
		};
		$scope.showPreviewImage = function(x) {
			var fReader = new FileReader();
			fReader.readAsDataURL(x);
			fReader.onload = function(event) {
				var img = document.getElementById("file-upload");
				$scope.image = event.target.result;
				$scope.$apply();
			};
		};

		LoginService.getUserById(localStorage.getItem("userid"), localStorage.getItem("token")).success(function(data) {
			localStorage.setItem('profileObj', JSON.stringify(data));
			$scope.profile = {};
			$scope.profile = data;
			$scope.loadCompleted = true;
			$ionicLoading.hide();

			var profileObj = localStorage.getItem('profileObj');
			var profileObjData = JSON.parse(profileObj);
			console.log(profileObjData);

			if($scope.profile.role === 'Organizer'){
				console.log("organizer");
				$scope.competitionStatus = "";	

				if($scope.profile.createdCompetition.active !== ''){
					$scope.activeCompetitions = $scope.profile.createdCompetition.active.split(",");
					$scope.totalActiveCompetitions = $scope.profile.createdCompetition.active.split(",").length;
				}else{
					$scope.totalActiveCompetitions = 0;
				}
				if($scope.profile.createdCompetition.completed !== ''){
					$scope.completedCompetitions = $scope.profile.createdCompetition.completed.split(",");
					$scope.totalCompletedCompetitions = $scope.profile.createdCompetition.completed.split(",").length;
				}else{
					$scope.totalCompletedCompetitions = 0;
				}

				$scope.totalCompetitions = $scope.totalActiveCompetitions + $scope.totalCompletedCompetitions;

				console.log($scope.activeCompetitions);

				$scope.showActiveCompetitions = function(){
					$scope.competitionStatus = "Active";
				};
				$scope.showCompletedCompetitions = function(){
					$scope.competitionStatus = "Completed";
				};
				$scope.setDefaultCompStatus = function(){
					$scope.competitionStatus = "";
				};
				$scope.showCompetition = function(competition){

					CompetitionService.getCompetitionId(competition).success(function(data) {
						$state.go('app.competition_detail', {
							'competitionId': data
						});
						$ionicLoading.hide();
					}).error(function(data) {
						$ionicLoading.hide();
					});
				};
			}

			if($scope.profile.role === 'Manager' || $scope.profile.role === 'Coach' || $scope.profile.role === 'Player'){
				$scope.availableJerseyNumber = [];
				$scope.teamId = '';
				$scope.teamData = {};
				TeamService.getTeamByName($scope.profile.team).success(function(data){
					console.log(data);
					$scope.teamData = data;
					$scope.availableJerseyNumber = data.availableJerseyNumber.split(",");
					$scope.teamId = data.id;
					console.log($scope.availableJerseyNumber);
				}).error(function(data) {
					$ionicLoading.hide();
				});
			}
				

			if($scope.profile.role === 'Referee' && $scope.profile.referee_rating !== ''){
				$scope.totalRate = $scope.profile.referee_rating.total_rating_rate.split(",");
				$scope.fairnessRate = $scope.profile.referee_rating.total_fairness_rate.split(",");
				$scope.decisionRate = $scope.profile.referee_rating.total_decision_rate.split(",");
				$scope.disciplineRate = $scope.profile.referee_rating.total_discipline_rate.split(",");
				$scope.integrityRate = $scope.profile.referee_rating.total_integrity_rate.split(",");
			}

			


			$scope.editProfil = function() {
				$scope.teamData = {};
				console.log($scope.teamId);
				console.log($scope.profile.shirtNumber);
				if($scope.availableJerseyNumber !== undefined){
					var index = $scope.availableJerseyNumber.indexOf($scope.profile.shirtNumber);
					$scope.availableJerseyNumber.splice(index, 1);
					console.log($scope.availableJerseyNumber);
					$scope.teamData.availableJerseyNumber = $scope.availableJerseyNumber;
				}
			
                // Loading
                // $ionicLoading.show({
                //     content: 'Loading',
                //     animation: 'fade-in',
                //     showBackdrop: true,
                // });
              
                $scope.profile = data;


                console.log(JSON.stringify($scope.profile) === JSON.stringify(profileObjData));

    //            	if(JSON.stringify($scope.profile) === JSON.stringify(profileObjData) === true){
				// 	console.log("tidak ada perubahan data");
				// 	var alertPopup = $ionicPopup.alert({
				// 		title: 'Info',
				// 		template: 'Tidak Ada Perubahan Data'
				// 	});
				// }else{
					// console.log("ada data yang diubah");


				var emailRe = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
				$scope.validateEmail = emailRe.test(String($scope.profile.email).toLowerCase());
				   
				if ($scope.profile.fullname === undefined || $scope.profile.fullname === "") {
					$rootScope.showPopup($ionicPopup,'Edit Profile failed!','Fullname is required !', 'popup-error');
				} else if ($scope.profile.username === undefined || $scope.profile.username === "") {
					$rootScope.showPopup($ionicPopup,'Edit Profile failed!','Username is required !', 'popup-error');
				} else if ($scope.validateEmail === false) {
					$rootScope.showPopup($ionicPopup,'Edit Profile failed!','Email not valid', 'popup-error');			
				} else if ($scope.profile.email === undefined || $scope.profile.email === "") {
					$rootScope.showPopup($ionicPopup,'Edit Profile failed!','Your email must be filled and valid', 'popup-error');
				} else {
					  $rootScope.showLoading($ionicLoading);

		                // Image upload processing
		                var fileInput = document.getElementById('file-upload');
		                var file = fileInput.files[0];
		                if (file === undefined) {
		                    $scope.profile.photo = '';
		                    // Add data to database
		                    LoginService.editUser(localStorage.getItem("userid"), localStorage.getItem("token"), $scope.profile).success(function(data) {
		                        $scope.profile = data;

		                        if($scope.profile.role === 'Manager' || $scope.profile.role === 'Coach' || $scope.profile.role === 'Player'){
		                        	TeamService.editTeamById($scope.teamId, $scope.teamData).success(function(data) {
					            		console.log(data);
					                }).error(function(data) {});
		                        }

		                        $ionicLoading.hide();
		                        var alertPopup = $ionicPopup.alert({
									title: 'Berhasil',
									template: 'Data Profil Berhasil Diubah'
								});
								$state.go('app.profile');
		                    }).error(function(data) {
		                        $ionicLoading.hide();
		                        var alertPopup = $ionicPopup.alert({
									title: 'Gagal',
									template: 'Gagal Mengubah Data Profil'
								});
		                    });

		                } else {
		                    ProfileService.uploadImage(file, '/' + file.name).success(function(data) {
		                        var params = {
		                            "path": '/' + file.name
		                        };
		                        LoginService.uploadImage(file, '/' + file.name).success(function(data) {
		                            var params = {
		                                "path": '/' + file.name
		                            };
		                            LoginService.getImageLink(params).success(function(data2) {
		                                var temp = data2.url;
		                                var url = temp.replace("?dl=0", "?dl=1");
		                                $scope.profile.photo = url;
		                                LoginService.editUser(localStorage.getItem("userid"), localStorage.getItem("token"), $scope.profile).success(function(data) {
		                                    $scope.profile = data;

		                                   	if($scope.profile.role === 'Manager' || $scope.profile.role === 'Coach' || $scope.profile.role === 'Player'){
					                        	TeamService.editTeamById($scope.teamId, $scope.teamData).success(function(data) {
								            		console.log(data);
								                }).error(function(data) {});
					                        }

		                                    $ionicLoading.hide();
		                                    var alertPopup = $ionicPopup.alert({
												title: 'Berhasil',
												template: 'Data Profil Berhasil Diubah'
											});
											$state.go('app.profile');
		                    			}).error(function(data) {
		                    				var alertPopup = $ionicPopup.alert({
												title: 'Gagal',
												template: 'Gagal Mengubah Data Profil'
											});
		                    			})
		                            .error(function(data) {});
		                            }).error(function(data2) {});
		                        }).error(function(data) {});
		                    }).error(function(data) {});
		                }
		    	}
            };
			$scope.editPassword = function() {
				// Loading
				$ionicLoading.show({
					content: 'Loading',
					animation: 'fade-in',
					showBackdrop: true,
				});
				$scope.profile = data;
					// Add data to database
					LoginService.editPassword(localStorage.getItem("userid"), localStorage.getItem("token"), $scope.profile).success(function(data) {
						$scope.profile = data;
						$ionicLoading.hide();
						$state.go('app.profile');
					}).error(function(data) {
						$ionicLoading.hide();
					});
			};
		}).error(function(data) {});

		if($scope.profile.role === 'Manager' || $scope.profile.role === 'Coach' || $scope.profile.role === 'Player'){
			$scope.teamData = {};
			TeamService.getTeamById(localStorage.getItem("myTeamId"),localStorage.getItem("token")).success(function(data) {
				$scope.teamData = data;
				$ionicLoading.hide();
			}).error(function(data) {
				$ionicLoading.hide();
			});
		}
})

.controller('UserDetailCtrl', function($scope, $state, $stateParams, $ionicPopup, $ionicPlatform, $ionicLoading, LoginService) {
	$ionicLoading.show({
       	content: 'Loading',
       	animation: 'fade-in',
       	showBackdrop: true,
    });
		//implement logic here
	$scope.profile = {};

	LoginService.getUserByUsername($stateParams.username).success(function(data) {
		$scope.profile = {};
		$scope.profile = data;
		console.log($scope.profile);
		$ionicLoading.hide();
	}).error(function(data) {});

	$scope.backToSearchPlayerPage = function(){
		$state.go('app.searchPlayer');
	};

	$scope.backToSearchCoachPage = function(){
		$state.go('app.searchCoach');
	};
})

.controller('RefereeRatingCtrl', function($scope, $rootScope, $state, $stateParams, $ionicPopup, $ionicPlatform, $ionicLoading, LoginService, RatingService, MatchService, CompetitionService, LoginService) {
	
	// $rootScope.showLoading($ionicLoading);
	    $ionicLoading.show({
            content: 'Login...',
            animation: 'fade-in',
            showBackdrop: true,
        });

	console.log($stateParams.matchId);
	$scope.finishedMatch = {};
	$scope.profile = {};
	$scope.compName = {};
	CompetitionService.getFinishedMatch($stateParams.matchId).success(function(data){
		$scope.finishedMatch = data;
		console.log($scope.finishedMatch[0].competition_id);
		LoginService.getUserByUsername($scope.finishedMatch[0].match_referee).success(function(data){
			$scope.profile = data;
			// setTimeout(function(){
			// 	$ionicLoading.hide();
			// },2000);
		}).error(function(data) {
			// setTimeout(function(){
			// 	$ionicLoading.hide();
			// },2000);
		});

		CompetitionService.getCompetitionName($scope.finishedMatch[0].competition_id).success(function(comp) {
			$scope.compName = comp;
			console.log(comp);
		}).error(function(data) {});

	}).error(function(data){});

	 $scope.fairnessStar = 0;
	 $scope.decisionStar = 0;
	 $scope.disciplineStar = 0;
	 $scope.integrityStar = 0;
	 $scope.fairnessrated = false;
	 $scope.decisionrated = false;
	 $scope.disciplinerated = false;
	 $scope.integrityrated = false;

     $scope.fairnessRating = function(star) {
     	console.log(star);
     	$scope.fairnessStar = star;
     	$scope.fairnessrated = true;
     };
    
     $scope.decisionRating = function(star) {
     	console.log(star);
     	$scope.decisionStar = star;
     	$scope.decisionrated = true;
     };
    
     $scope.disciplineRating = function(star) {
     	console.log(star);
     	$scope.disciplineStar = star;
     	$scope.disciplinerated = true;
     };

     $scope.integrityRating = function(star) {
     	console.log(star);
     	$scope.integrityStar = star;
     	$scope.integrityrated = true;
     };
   
   	
 	 $scope.submitRefereeRating = function(matchId, refereeName) {
 	 	var fairnessRate = parseInt($scope.fairnessStar);
 	 	var decisionRate = parseInt($scope.decisionStar);
 	 	var disciplineRate = parseInt($scope.disciplineStar);
 	 	var integrityRate = parseInt($scope.integrityStar);

	    var result = fairnessRate + decisionRate + disciplineRate + integrityRate;
	    console.log(result);
	    console.log(matchId);
	    $scope.refRatingData = {};
	    $scope.refRatingData.match_refereeObj = {};
	   	$scope.refRatingData.match_refereeObj.name = refereeName;
	   	$scope.refRatingData.match_refereeObj.fairnessRate = fairnessRate;
	   	$scope.refRatingData.match_refereeObj.decisionRate = decisionRate;
	   	$scope.refRatingData.match_refereeObj.disciplineRate = disciplineRate;
	   	$scope.refRatingData.match_refereeObj.integrityRate = integrityRate;
	   	$scope.refRatingData.referee_ratingStatus = true;

	   	console.log($scope.refRatingData);

	   	// Save referee rating to match table
	   	MatchService.editMatchById(matchId,$scope.refRatingData).success(function(data) {
			console.log('berhasil melakukan rating');
			console.log(data);
			// $ionicLoading.hide();
		}).error(function(data) {
			// $ionicLoading.hide();
		});

		$scope.refRatingForm = {};
		$scope.refRatingForm.referee_rating = {};
		$scope.refBanForm = {};
		$scope.refBanForm.ban = {};
		$scope.refereeId = '';
		console.log(refereeName);
		LoginService.getUserByUsername(refereeName).success(function(data){
			console.log(data);
			$scope.refereeId = data.id;

			if(data.referee_rating === null || data.referee_rating.rate_counter === 0 || data.referee_rating === ''){
				console.log("ya");
				$scope.refRatingForm.referee_rating.rate_counter = 1;
				$scope.refRatingForm.referee_rating.fairness_rate = fairnessRate;
				$scope.refRatingForm.referee_rating.decision_rate = decisionRate;
				$scope.refRatingForm.referee_rating.discipline_rate = disciplineRate;
				$scope.refRatingForm.referee_rating.integrity_rate = integrityRate;

				$scope.refRatingForm.referee_rating.total_fairness = fairnessRate;
				$scope.refRatingForm.referee_rating.total_decision = decisionRate;
				$scope.refRatingForm.referee_rating.total_discipline = disciplineRate;
				$scope.refRatingForm.referee_rating.total_integrity = integrityRate;

				$scope.refRatingForm.referee_rating.total_fairness_rate = fairnessRate.toFixed(1);
				$scope.refRatingForm.referee_rating.total_decision_rate = decisionRate.toFixed(1);
				$scope.refRatingForm.referee_rating.total_discipline_rate = disciplineRate.toFixed(1);
				$scope.refRatingForm.referee_rating.total_integrity_rate = integrityRate.toFixed(1);


				$scope.refRatingForm.referee_rating.total_rating = result;
				$scope.refRatingForm.referee_rating.total_rating_rate = (result / 4).toFixed(1);

			}else if((data.referee_rating.rate_counter + 1) % 5 === 0){
				console.log("5 kali");
				$scope.refRatingForm.referee_rating.rate_counter = data.referee_rating.rate_counter + 1;
				$scope.refRatingForm.referee_rating.fairness_rate = fairnessRate + "," + data.referee_rating.fairness_rate;
				$scope.refRatingForm.referee_rating.decision_rate = decisionRate + "," + data.referee_rating.decision_rate;
				$scope.refRatingForm.referee_rating.discipline_rate = disciplineRate + "," + data.referee_rating.discipline_rate;
				$scope.refRatingForm.referee_rating.integrity_rate = integrityRate + "," + data.referee_rating.integrity_rate;

				$scope.refRatingForm.referee_rating.total_fairness = (data.referee_rating.total_fairness + fairnessRate);
				$scope.refRatingForm.referee_rating.total_decision = (data.referee_rating.total_decision + decisionRate);
				$scope.refRatingForm.referee_rating.total_discipline = (data.referee_rating.total_discipline + disciplineRate);
				$scope.refRatingForm.referee_rating.total_integrity = (data.referee_rating.total_integrity + integrityRate);

				$scope.refRatingForm.referee_rating.total_fairness_rate = ((data.referee_rating.total_fairness + fairnessRate) / $scope.refRatingForm.referee_rating.rate_counter).toFixed(1);
				$scope.refRatingForm.referee_rating.total_decision_rate = ((data.referee_rating.total_decision + decisionRate) / $scope.refRatingForm.referee_rating.rate_counter).toFixed(1);
				$scope.refRatingForm.referee_rating.total_discipline_rate = ((data.referee_rating.total_discipline + disciplineRate) / $scope.refRatingForm.referee_rating.rate_counter).toFixed(1);
				$scope.refRatingForm.referee_rating.total_integrity_rate = ((data.referee_rating.total_integrity + integrityRate) / $scope.refRatingForm.referee_rating.rate_counter).toFixed(1);

				$scope.refRatingForm.referee_rating.total_rating = (data.referee_rating.total_rating + result);
				$scope.refRatingForm.referee_rating.total_rating_rate = ((data.referee_rating.total_rating + result) / (4 * $scope.refRatingForm.referee_rating.rate_counter)).toFixed(1);
			
				if($scope.refRatingForm.referee_rating.total_fairness_rate < 3 || $scope.refRatingForm.referee_rating.total_decision_rate < 3 || $scope.refRatingForm.referee_rating.total_discipline_rate < 3 || $scope.refRatingForm.referee_rating.total_integrity_rate < 3){
					$scope.refBanForm.ban.status = true;
					$scope.refBanForm.ban.start = moment().toISOString();
					$scope.refBanForm.ban.end = moment().add(3, 'weeks').toISOString();
					$scope.refBanForm.ban.numberOfDays = "3 weeks";

					LoginService.editUser($scope.refereeId, localStorage.getItem("token"),$scope.refBanForm).success(function(data) {
	               		console.log(data);
	                }).error(function(data) {});	
				}

			}else{
				console.log("blm 5 kali");
				$scope.refRatingForm.referee_rating.rate_counter = data.referee_rating.rate_counter + 1;
				$scope.refRatingForm.referee_rating.fairness_rate = fairnessRate + "," + data.referee_rating.fairness_rate;
				$scope.refRatingForm.referee_rating.decision_rate = decisionRate + "," + data.referee_rating.decision_rate;
				$scope.refRatingForm.referee_rating.discipline_rate = disciplineRate + "," + data.referee_rating.discipline_rate;
				$scope.refRatingForm.referee_rating.integrity_rate = integrityRate + "," + data.referee_rating.integrity_rate;

				$scope.refRatingForm.referee_rating.total_fairness = (data.referee_rating.total_fairness + fairnessRate);
				$scope.refRatingForm.referee_rating.total_decision = (data.referee_rating.total_decision + decisionRate);
				$scope.refRatingForm.referee_rating.total_discipline = (data.referee_rating.total_discipline + disciplineRate);
				$scope.refRatingForm.referee_rating.total_integrity = (data.referee_rating.total_integrity + integrityRate);
				$scope.refRatingForm.referee_rating.total_rating = (data.referee_rating.total_rating + result);

				$scope.refRatingForm.referee_rating.total_fairness_rate = data.referee_rating.total_fairness_rate;
				$scope.refRatingForm.referee_rating.total_decision_rate = data.referee_rating.total_decision_rate;
				$scope.refRatingForm.referee_rating.total_discipline_rate = data.referee_rating.total_discipline_rate;
				$scope.refRatingForm.referee_rating.total_integrity_rate = data.referee_rating.total_integrity_rate;
				$scope.refRatingForm.referee_rating.total_rating_rate = data.referee_rating.total_rating_rate;
			}
			console.log($scope.refRatingForm);

			// Save referee rating to user (referee) table

		   	RatingService.addRefereeRatingById($scope.refereeId, $scope.refRatingForm).success(function(data) {
				console.log('berhasil melakukan rating');
				console.log(data);
				// $ionicLoading.hide();
				alertPopup = $ionicPopup.alert({
					title: 'Success!',
					template: 'Your respond has been submitted '
				});
				$state.go('app.home');
			}).error(function(data) {
				// $ionicLoading.hide();
			});


			$ionicLoading.hide();
		}).error(function(data) {
			// $ionicLoading.hide();
		});
    };
})

.controller('PlayerRatingCtrl', function($scope, $state, $ionicPopup, $ionicPlatform, $ionicLoading) {
})

.controller('LeaderboardCtrl', function($scope, $state, $ionicPopup, $ionicPlatform, $ionicLoading, LoginService, ProfileService) {
        // implement logic here
        // $scope.leaderboard = {};
        // $scope.pemenangPertama = {};
        // $scope.pemenangKedua = {};
        // $scope.pemenangKetiga = {};
        // $scope.myLeaderboard = {};
        // $scope.myLeaderboardend = false;
        // // $scope.menuProfile = {}
        // $scope.data = {}
        // $ionicLoading.show({
        //     content: 'Login...',
        //     animation: 'fade-in',
        //     showBackdrop: true,
        // });
        // LoginService.getLeaderboard(localStorage.getItem("token")).success(function(data) {
        //     $scope.menuProfile.password = "";
        //     var i = 1;
        //     data.forEach(function(entry) {
        //         if ($scope.menuProfile.username === entry.username) {
        //             $scope.myLeaderboard = entry;
        //         }
        //         if ($scope.menuProfile.username === entry.username && i > 10) {
        //             $scope.myLeaderboardend = true;
        //             $scope.myLeaderboard.position = i;
        //         }
        //         i++;
        //     });
        //     $ionicLoading.hide();
        //     $scope.leaderboard = data;
        //     $scope.pemenangPertama = data[0];
        //     $scope.pemenangKedua = data[1];
        //     $scope.pemenangKetiga = data[2];
        //     console.log($scope.pemenangPertama);
        //     console.log($scope.myLeaderboard);
        //     console.log(data);
        // }).error(function(data) {});
        // $scope.userDetail = function(username) {
        //     $state.go('app.userProfile', {
        //         'username': username
        //     });

        // };
})

.controller('HistoryCtrl', function($scope, $rootScope, $state, $ionicPopup, $ionicPlatform, $ionicLoading, MatchService, CompetitionService) {
	$rootScope.showLoading($ionicLoading);
	$scope.completedMatches = {};
	$scope.compName = [];


	if(localStorage.getItem("role") === 'Referee'){
		MatchService.getCompletedMatchesByRef(localStorage.getItem("username")).success(function(data) {
			$scope.completedMatches = data;

			$scope.completedMatches.forEach(function(match){
				console.log(match.id);
				CompetitionService.getCompetitionName(match.competition_id).success(function(data) {
					console.log(data);
					$scope.compName[match.id] = data;
				}).error(function(data) {});
			});
			

			$ionicLoading.hide();
		}).error(function(data) {
			console.log("gagal");
			$ionicLoading.hide();
		});
	}


	if(localStorage.getItem("role") === 'Analyst'){
		MatchService.getCompletedMatchesByAnalyst(localStorage.getItem("username")).success(function(data) {
			$scope.completedMatches = data;
			console.log($scope.completedMatches);

			$scope.completedMatches.forEach(function(match){
				console.log(match.id);
				CompetitionService.getCompetitionName(match.competition_id).success(function(data) {
					console.log(data);
					$scope.compName[match.id] = data;
				}).error(function(data) {});
			});
			

			$ionicLoading.hide();
		}).error(function(data) {
			console.log("gagal");
			$ionicLoading.hide();
		});
	}
	
	// go to match detail page
	$scope.goToMatchDetail = function(id) { 
		localStorage.setItem("matchResultBackStatus", "history");
		$state.go('app.match_detail', {
			'matchId': id
		});
	};
})

.controller('CompleteProfileCtrl', function($scope, $state, $ionicPopup, $ionicPlatform, $ionicLoading, LoginService, ProfileService, $cordovaImagePicker, $cordovaCamera) {
	$ionicLoading.show({
		content: 'Loading',
		animation: 'fade-in',
		showBackdrop: true,
	});
	$ionicLoading.hide();
	//implement logic here
	$scope.profile = {};
	$scope.profile.profileCompleted = true;
	console.log(localStorage.getItem("userid"));

	$scope.backToHome = function() {
		$state.go('app.home');
	};
	$scope.editProfile = function() {
		ProfileService.editProfileById(localStorage.getItem("userid"), localStorage.getItem("token"), $scope.profile).success(function(data) {
			// $scope.profile = data;
			$ionicLoading.hide();
			$state.go('app.home');
			console.log("berhasil");
		}).error(function(data) {
			$ionicLoading.hide();
		});
	};
})

.controller('MatchDetailCtrl', function($scope, $state, $stateParams, $ionicPopup, $ionicPlatform, $ionicLoading, MatchService, CompetitionService, LoginService, PostService, ionicMaterialInk, ionicMaterialMotion, $cordovaSocialSharing) {
	$ionicLoading.show({
		content: 'Login...',
		animation: 'fade-in',
		showBackdrop: true,
	});
	$scope.match = {};
	$scope.goalDataArr = [];
	$scope.goalsArr = [];
	$scope.goalHomeObj = [];
	$scope.goalAwayObj = [];
	$scope.yellowHomeObj = [];
	$scope.yellowAwayObj = [];
	$scope.redHomeObj = [];
	$scope.redAwayObj = [];
	$scope.subHomeObj = [];
	$scope.subAwayObj = [];
	$scope.scorerHome = [];
	$scope.scorerAway = [];
	$scope.timeAway = [];
	$scope.timeHome = [];
	$scope.goalHome = [];
	$scope.goalStatusHome = [];
	$scope.goalStatusAway = [];
	$scope.assistHome = [];
	$scope.assistAway = [];
	$scope.yellowHome = [];
	$scope.yellowAway = [];
	$scope.redHome = [];
	$scope.redAway = [];
	$scope.homeLineupArr = [];
	$scope.awayLineupArr = [];
	$scope.homeSubArr = [];
	$scope.awaySubArr = [];
	$scope.homeLineupPlayerArr = [];
	$scope.awayLineupPlayerArr = [];
	$scope.homeSubPlayerArr = [];
	$scope.awaySubPlayerArr = [];
	$scope.homeLineupGKArr = [];
	$scope.homeLineupDefArr = [];
	$scope.homeLineupMidArr = [];
	$scope.homeLineupAttArr = [];
	$scope.homeSubGKArr = [];
	$scope.homeSubDefArr = [];
	$scope.homeSubMidArr = [];
	$scope.homeSubAttArr = [];
	$scope.awayLineupGKArr = [];
	$scope.awayLineupDefArr = [];
	$scope.awayLineupMidArr = [];
	$scope.awayLineupAttArr = [];
	$scope.awaySubGKArr = [];
	$scope.awaySubDefArr = [];
	$scope.awaySubMidArr = [];
	$scope.awaySubAttArr = [];


	MatchService.getMatchById($stateParams.matchId).success(function(data) {
		$ionicLoading.hide();
		$scope.match = data;
		$scope.day = moment($scope.match.match_date).format('dddd');
		CompetitionService.getCompetitionName($scope.match.competition_id).success(function(data) {
			$scope.compName = data;
			// console.log(compName);
		}).error(function(data) {});

		// Goal
		if($scope.match.goalHome.scorer.includes(",")){
			console.log("ada");
			$scope.scorerHome = $scope.match.goalHome.scorer.split(',');
			$scope.assistHome = $scope.match.goalHome.assist.split(',');
			$scope.timeHome = $scope.match.goalHome.time.split(',');
			$scope.goalHomeh = $scope.match.goalHome.scoreHome.split(',');
			$scope.goalHomea = $scope.match.goalHome.scoreAway.split(',');
			$scope.goalStatusHome  = $scope.match.goalHome.goalStatus.split(',');
			$scope.goalEventNumberHome  = $scope.match.goalHome.eventNumber.split(',');
		}else if($scope.match.goalHome.scorer !== ''){
			console.log("tidak ada");
			$scope.scorerHome = $scope.match.goalHome.scorer.toString();
			$scope.assistHome = $scope.match.goalHome.assist.toString();
			$scope.timeHome = $scope.match.goalHome.time.toString();
			$scope.goalHomeh = $scope.match.goalHome.scoreHome.toString();
			$scope.goalHomea = $scope.match.goalHome.scoreAway.toString();
			$scope.goalStatusHome  = $scope.match.goalHome.goalStatus.toString();
			$scope.goalEventNumberHome  = $scope.match.goalHome.eventNumber.toString();
		}


		if($scope.match.goalAway.scorer.includes(",")){
			console.log("ada");
			$scope.scorerAway = $scope.match.goalAway.scorer.split(',');
			$scope.assistAway = $scope.match.goalAway.assist.split(',');
			$scope.timeAway = $scope.match.goalAway.time.split(',');
			$scope.goalAwayh = $scope.match.goalAway.scoreHome.split(',');
			$scope.goalAwaya = $scope.match.goalAway.scoreAway.split(',');
			$scope.goalStatusAway  = $scope.match.goalAway.goalStatus.split(',');
			$scope.goalEventNumberAway  = $scope.match.goalAway.eventNumber.split(',');
		}else{
			console.log("tidak ada");
			$scope.scorerAway = $scope.match.goalAway.scorer.toString();
			$scope.assistAway = $scope.match.goalAway.assist.toString();
			$scope.timeAway = $scope.match.goalAway.time.toString();
			$scope.goalAwayh = $scope.match.goalAway.scoreHome.toString();
			$scope.goalAwaya = $scope.match.goalAway.scoreAway.toString();
			$scope.goalStatusAway  = $scope.match.goalAway.goalStatus.toString();
			$scope.goalEventNumberAway  = $scope.match.goalAway.eventNumber.toString();
		}

		// Yellow Card
		if($scope.match.yellowCardHome.player.includes(",")){
			console.log("ada");
			$scope.yellowPlayerHome = $scope.match.yellowCardHome.player.split(',');
			$scope.yellowTimeHome = $scope.match.yellowCardHome.time.split(',');
			$scope.yellowStatusHome = $scope.match.yellowCardHome.status.split(',');
			$scope.yellowEventNumberHome = $scope.match.yellowCardHome.eventNumber.split(',');
		}else if($scope.match.yellowCardHome.player !== ''){
			console.log("tidak ada");
			$scope.yellowPlayerHome = $scope.match.yellowCardHome.player.toString();
			$scope.yellowTimeHome = $scope.match.yellowCardHome.time.toString();
			$scope.yellowStatusHome = $scope.match.yellowCardHome.status.toString();
			$scope.yellowEventNumberHome = $scope.match.yellowCardHome.eventNumber.toString();
		}

		if($scope.match.yellowCardAway.player.includes(",")){
			console.log("ada");
			$scope.yellowPlayerAway = $scope.match.yellowCardAway.player.split(',');
			$scope.yellowTimeAway = $scope.match.yellowCardAway.time.split(',');
			$scope.yellowStatusAway = $scope.match.yellowCardAway.status.split(',');
			$scope.yellowEventNumberAway = $scope.match.yellowCardAway.eventNumber.split(',');
		}else if($scope.match.yellowCardAway.player !== ''){
			console.log("tidak ada");
			$scope.yellowPlayerAway = $scope.match.yellowCardAway.player.toString();
			$scope.yellowTimeAway = $scope.match.yellowCardAway.time.toString();
			$scope.yellowStatusAway = $scope.match.yellowCardAway.status.toString();
			$scope.yellowEventNumberAway = $scope.match.yellowCardAway.eventNumber.split(',');
		}

		// Red Card
		if($scope.match.redCardHome.player.includes(",")){
			console.log("ada");
			$scope.redPlayerHome = $scope.match.redCardHome.player.split(',');
			$scope.redTimeHome = $scope.match.redCardHome.time.split(',');
			$scope.redEventNumberHome = $scope.match.redCardHome.eventNumber.split(',');
		}else if($scope.match.redCardHome.player !== ''){
			console.log("tidak ada");
			$scope.redPlayerHome = $scope.match.redCardHome.player.toString();
			$scope.redTimeHome = $scope.match.redCardHome.time.toString();
			$scope.redEventNumberHome = $scope.match.redCardHome.eventNumber.toString();
		}

		if($scope.match.redCardAway.player.includes(",")){
			console.log("ada");
			$scope.redPlayerAway = $scope.match.redCardAway.player.split(',');
			$scope.redTimeAway = $scope.match.redCardAway.time.split(',');
			$scope.redEventNumberAway = $scope.match.redCardAway.eventNumber.split(',');
		}else if($scope.match.redCardAway.player !== ''){
			console.log("tidak ada");
			$scope.redPlayerAway = $scope.match.redCardAway.player.toString();
			$scope.redTimeAway = $scope.match.redCardAway.time.toString();
			$scope.redEventNumberAway = $scope.match.redCardAway.eventNumber.toString();
		}

		// Substitute
		if($scope.match.substituteHome.in.includes(",")){
			console.log("ada");
			$scope.subInHome = $scope.match.substituteHome.in.split(',');
			$scope.subOutHome = $scope.match.substituteHome.out.split(',');
			$scope.subTimeHome = $scope.match.substituteHome.time.split(',');
			$scope.subEventNumberHome = $scope.match.substituteHome.eventNumber.split(',');
		}else if($scope.match.substituteHome.in !== ''){
			console.log("tidak ada");
			$scope.subInHome = $scope.match.substituteHome.in.toString();
			$scope.subOutHome = $scope.match.substituteHome.out.toString();
			$scope.subTimeHome = $scope.match.substituteHome.time.toString();
			$scope.subEventNumberHome = $scope.match.substituteHome.eventNumber.toString();
		}

		if($scope.match.substituteAway.in.includes(",")){
			console.log("ada");
			$scope.subInAway = $scope.match.substituteAway.in.split(',');
			$scope.subOutAway = $scope.match.substituteAway.out.split(',');
			$scope.subTimeAway = $scope.match.substituteAway.time.split(',');
			$scope.subEventNumberAway = $scope.match.substituteAway.eventNumber.split(',');
		}else if($scope.match.substituteAway.in !== ''){
			console.log("tidak ada");
			$scope.subInAway = $scope.match.substituteAway.in.toString();
			$scope.subOutAway = $scope.match.substituteAway.out.toString();
			$scope.subTimeAway = $scope.match.substituteAway.time.toString();
			$scope.subEventNumberAway = $scope.match.substituteAway.eventNumber.toString();
		}
	

		if($scope.match.goalHome.scorer.includes(",")){
			for(var h = 0; h < $scope.scorerHome.length; h++){
				$scope.goalHomeObj[h] = {};
				$scope.goalHomeObj[h].scorer = $scope.scorerHome[h];
				$scope.goalHomeObj[h].assist = $scope.assistHome[h];
				$scope.goalHomeObj[h].time = $scope.timeHome[h];
				$scope.goalHomeObj[h].goalH = $scope.goalHomeh[h];
				$scope.goalHomeObj[h].goalA = $scope.goalHomea[h];
				$scope.goalHomeObj[h].status = "home";
				$scope.goalHomeObj[h].goalStatus = $scope.goalStatusHome[h];
				$scope.goalHomeObj[h].eventNumber = $scope.goalEventNumberHome[h];
			}
		}else if($scope.match.goalHome.scorer !== ''){
			$scope.goalHomeObj[0] = {};
			$scope.goalHomeObj[0].scorer = $scope.scorerHome;
			$scope.goalHomeObj[0].assist = $scope.assistHome;
			$scope.goalHomeObj[0].time = $scope.timeHome;
			$scope.goalHomeObj[0].goalH = $scope.goalHomeh;
			$scope.goalHomeObj[0].goalA = $scope.goalHomea;
			$scope.goalHomeObj[0].status = "home";
			$scope.goalHomeObj[0].goalStatus = $scope.goalStatusHome;
			$scope.goalHomeObj[0].eventNumber = $scope.goalEventNumberHome;

		}

		if($scope.match.goalAway.scorer.includes(",")){
			for(var a = 0; a < $scope.scorerAway.length; a++){
				$scope.goalAwayObj[a] = {};
				$scope.goalAwayObj[a].scorer = $scope.scorerAway[a];
				$scope.goalAwayObj[a].assist = $scope.assistAway[a];
				$scope.goalAwayObj[a].time = $scope.timeAway[a];
				$scope.goalAwayObj[a].goalH = $scope.goalAwayh[a];
				$scope.goalAwayObj[a].goalA = $scope.goalAwaya[a];
				$scope.goalAwayObj[a].status = "away";
				$scope.goalAwayObj[a].goalStatus = $scope.goalStatusAway[a];
				$scope.goalAwayObj[a].eventNumber = $scope.goalEventNumberAway[a];

			}
		}else if($scope.match.goalAway.scorer !== ''){
			$scope.goalAwayObj[0] = {};
			$scope.goalAwayObj[0].scorer = $scope.scorerAway;
			$scope.goalAwayObj[0].assist = $scope.assistAway;
			$scope.goalAwayObj[0].time = $scope.timeAway;
			$scope.goalAwayObj[0].status = "away";
			$scope.goalAwayObj[0].goalH = $scope.goalAwayh;
			$scope.goalAwayObj[0].goalA = $scope.goalAwaya;
			$scope.goalAwayObj[0].goalStatus = $scope.goalStatusAway;
			$scope.goalAwayObj[0].eventNumber = $scope.goalEventNumberAway;
		}

		// Yellow Card
		if($scope.match.yellowCardHome.player.includes(",")){
			for(var h = 0; h < $scope.yellowPlayerHome.length; h++){
				$scope.yellowHomeObj[h] = {};
				$scope.yellowHomeObj[h].player = $scope.yellowPlayerHome[h];
				$scope.yellowHomeObj[h].time = $scope.yellowTimeHome[h];
				$scope.yellowHomeObj[h].status = "home";
				$scope.yellowHomeObj[h].cardStatus = "yellow";
				$scope.yellowHomeObj[h].yellowCardStatus = $scope.yellowStatusHome[h];
				$scope.yellowHomeObj[h].eventNumber = $scope.yellowEventNumberHome[h];
			}
		}else if($scope.match.yellowCardHome.player !== ''){
			$scope.yellowHomeObj[0] = {};
			$scope.yellowHomeObj[0].player = $scope.yellowPlayerHome;
			$scope.yellowHomeObj[0].time = $scope.yellowTimeHome;
			$scope.yellowHomeObj[0].status = "home";
			$scope.yellowHomeObj[0].cardStatus = "yellow";
			$scope.yellowHomeObj[0].yellowCardStatus = $scope.yellowStatusHome;
			$scope.yellowHomeObj[0].eventNumber = $scope.yellowEventNumberHome;
		}

		if($scope.match.yellowCardAway.player.includes(",")){
			for(var h = 0; h < $scope.yellowPlayerAway.length; h++){
				$scope.yellowAwayObj[h] = {};
				$scope.yellowAwayObj[h].player = $scope.yellowPlayerAway[h];
				$scope.yellowAwayObj[h].time = $scope.yellowTimeAway[h];
				$scope.yellowAwayObj[h].status = "away";
				$scope.yellowAwayObj[h].cardStatus = "yellow";
				$scope.yellowAwayObj[h].yellowCardStatus = $scope.yellowStatusAway[h];
				$scope.yellowAwayObj[h].eventNumber = $scope.yellowEventNumberAway[h];
			}
		}else if($scope.match.yellowCardAway.player !== ''){
			$scope.yellowAwayObj[0] = {};
			$scope.yellowAwayObj[0].player = $scope.yellowPlayerAway;
			$scope.yellowAwayObj[0].time = $scope.yellowTimeAway;
			$scope.yellowAwayObj[0].status = "away";
			$scope.yellowAwayObj[0].cardStatus = "yellow";
			$scope.yellowAwayObj[0].yellowCardStatus = $scope.yellowStatusAway;
			$scope.yellowAwayObj[0].eventNumber = $scope.yellowEventNumberAway;
		}

		// Red Card
		if($scope.match.redCardHome.player.includes(",")){
			for(var h = 0; h < $scope.redPlayerHome.length; h++){
				$scope.redHomeObj[h] = {};
				$scope.redHomeObj[h].player = $scope.redPlayerHome[h];
				$scope.redHomeObj[h].time = $scope.redTimeHome[h];
				$scope.redHomeObj[h].status = "home";
				$scope.redHomeObj[h].cardStatus = "red";
				$scope.redHomeObj[h].eventNumber = $scope.redEventNumberHome[h];
			}
		}else if($scope.match.redCardHome.player !== ''){
			$scope.redHomeObj[0] = {};
			$scope.redHomeObj[0].player = $scope.redPlayerHome;
			$scope.redHomeObj[0].time = $scope.redTimeHome;
			$scope.redHomeObj[0].status = "home";
			$scope.redHomeObj[0].cardStatus = "red";
			$scope.redHomeObj[0].eventNumber = $scope.redEventNumberHome;
		}

		if($scope.match.redCardAway.player.includes(",")){
			for(var h = 0; h < $scope.redPlayerAway.length; h++){
				$scope.redAwayObj[h] = {};
				$scope.redAwayObj[h].player = $scope.redPlayerAway[h];
				$scope.redAwayObj[h].time = $scope.redTimeAway[h];
				$scope.redAwayObj[h].status = "away";
				$scope.redAwayObj[h].cardStatus = "red";
				$scope.redAwayObj[h].eventNumber = $scope.redEventNumberAway[h];
			}
		}else if($scope.match.redCardAway.player !== ''){
			$scope.redAwayObj[0] = {};
			$scope.redAwayObj[0].player = $scope.redPlayerAway;
			$scope.redAwayObj[0].time = $scope.redTimeAway;
			$scope.redAwayObj[0].status = "away";
			$scope.redAwayObj[0].cardStatus = "red";
			$scope.redAwayObj[0].eventNumber = $scope.redEventNumberAway;
		}

		// Substitute
		if($scope.match.substituteHome.in.includes(",")){
			for(var h = 0; h < $scope.subInHome.length; h++){
				$scope.subHomeObj[h] = {};
				$scope.subHomeObj[h].in = $scope.subInHome[h];
				$scope.subHomeObj[h].out = $scope.subOutHome[h];
				$scope.subHomeObj[h].time = $scope.subTimeHome[h];
				$scope.subHomeObj[h].status = "home";
				$scope.subHomeObj[h].eventStatus = "sub";
				$scope.subHomeObj[h].eventNumber = $scope.subEventNumberHome[h];
			}
		}else if($scope.match.substituteHome.in !== ''){
			$scope.subHomeObj[0] = {};
			$scope.subHomeObj[0].in = $scope.subInHome;
			$scope.subHomeObj[0].out = $scope.subOutHome;
			$scope.subHomeObj[0].time = $scope.subTimeHome;
			$scope.subHomeObj[0].status = "home";
			$scope.subHomeObj[0].eventStatus = "sub";
			$scope.subHomeObj[0].eventNumber = $scope.subEventNumberHome;
		}

		if($scope.match.substituteAway.in.includes(",")){
			for(var h = 0; h < $scope.subInAway.length; h++){
				$scope.subAwayObj[h] = {};
				$scope.subAwayObj[h].in = $scope.subInAway[h];
				$scope.subAwayObj[h].out = $scope.subOutAway[h];
				$scope.subAwayObj[h].time = $scope.subTimeAway[h];
				$scope.subAwayObj[h].status = "away";
				$scope.subAwayObj[h].eventStatus = "sub";
				$scope.subAwayObj[h].eventNumber = $scope.subEventNumberAway[h];
			}
		}else if($scope.match.substituteAway.in !== ''){
			$scope.subAwayObj[0] = {};
			$scope.subAwayObj[0].in = $scope.subInAway;
			$scope.subAwayObj[0].out = $scope.subOutAway;
			$scope.subAwayObj[0].time = $scope.subTimeAway;
			$scope.subAwayObj[0].status = "away";
			$scope.subAwayObj[0].eventStatus = "sub";
			$scope.subAwayObj[0].eventNumber = $scope.subEventNumberAway;
		}

		console.log($scope.goalHomeObj);
		console.log($scope.goalAwayObj);
		console.log($scope.yellowHomeObj);

		$scope.goalHomeArr = [];
		$scope.goalAwayArr = [];
		$scope.yellowHomeArr = [];
		$scope.yellowAwayArr = [];
		$scope.redHomeArr = [];
		$scope.redAwayArr = [];
		$scope.subHomeArr = [];
		$scope.subAwayArr = [];

		for(var itemh in $scope.goalHomeObj){
			// $scope.goalDataArr.push($scope.goalHomeObj[itemh]);
			$scope.goalHomeArr.push($scope.goalHomeObj[itemh]);
		}

		for(var itema in $scope.goalAwayObj){
			// $scope.goalDataArr.push($scope.goalAwayObj[itema]);
			$scope.goalAwayArr.push($scope.goalAwayObj[itema]);
		}

		// Yellow Card
		for(var item in $scope.yellowHomeObj){
			// $scope.goalDataArr.push($scope.goalAwayObj[itema]);
			$scope.yellowHomeArr.push($scope.yellowHomeObj[item]);
		}

		for(var item in $scope.yellowAwayObj){
			// $scope.goalDataArr.push($scope.goalAwayObj[itema]);
			$scope.yellowAwayArr.push($scope.yellowAwayObj[item]);
		}

		// Red Card
		for(var item in $scope.redHomeObj){
			// $scope.goalDataArr.push($scope.goalAwayObj[itema]);
			$scope.redHomeArr.push($scope.redHomeObj[item]);
		}

		for(var item in $scope.redAwayObj){
			// $scope.goalDataArr.push($scope.goalAwayObj[itema]);
			$scope.redAwayArr.push($scope.redAwayObj[item]);
		}

		// Substitute
		for(var item in $scope.subHomeObj){
			// $scope.goalDataArr.push($scope.goalAwayObj[itema]);
			$scope.subHomeArr.push($scope.subHomeObj[item]);
		}

		for(var item in $scope.subAwayObj){
			// $scope.goalDataArr.push($scope.goalAwayObj[itema]);
			$scope.subAwayArr.push($scope.subAwayObj[item]);
		}
		console.log($scope.goalHomeArr.length);
		console.log($scope.goalAwayArr);
		if($scope.goalHomeArr.length !== 0){
			console.log("not 0");
			$scope.goalsArr = $scope.goalHomeArr;
			if($scope.goalAwayArr.length !== 0){
				console.log("not 0000");
				$scope.goalsArr = $scope.goalHomeArr.concat($scope.goalAwayArr);
			}
		}else{
			console.log("0");
			if($scope.goalAwayArr.length !== 0){
				console.log("not 0000000000");
				$scope.goalsArr = $scope.goalAwayArr;
			}
		}


		if($scope.goalsArr.length !== 0){
			$scope.goalsArr = $scope.goalsArr.concat($scope.yellowHomeArr);
		}else{
			$scope.goalsArr = $scope.yellowHomeArr;
		}

		if($scope.goalsArr.length !== 0){
			$scope.goalsArr = $scope.goalsArr.concat($scope.yellowAwayArr);
		}else{
			$scope.goalsArr = $scope.yellowAwayArr;
		}

		if($scope.goalsArr.length !== 0){
			$scope.goalsArr = $scope.goalsArr.concat($scope.redHomeArr);
		}else{
			$scope.goalsArr = $scope.redHomeArr;
		}

		if($scope.goalsArr.length !== 0){
			$scope.goalsArr = $scope.goalsArr.concat($scope.redAwayArr);
		}else{
			$scope.goalsArr = $scope.redAwayArr;
		}

		if($scope.goalsArr.length !== 0){
			$scope.goalsArr = $scope.goalsArr.concat($scope.subHomeArr);
		}else{
			$scope.goalsArr = $scope.subHomeArr;
		}

		if($scope.goalsArr.length !== 0){
			$scope.goalsArr = $scope.goalsArr.concat($scope.subAwayArr);
		}else{
			$scope.goalsArr = $scope.subAwayArr;
		}
		console.log($scope.goalsArr);

		$scope.goalsArr.sort(function(a, b) {
		    return a.eventNumber - b.eventNumber;
		});

		$scope.homeLineupArr = $scope.match.match_homeTeamObj.lineup.split(",");
		$scope.awayLineupArr = $scope.match.match_awayTeamObj.lineup.split(",");
		$scope.homeSubArr = $scope.match.match_homeTeamObj.sub.split(",");
		$scope.awaySubArr = $scope.match.match_awayTeamObj.sub.split(",");

		$scope.homeLineupArr.forEach(function(lineup){
			LoginService.getUserByUsername(lineup).success(function(data){
				if(data.position == 'GK'){
					$scope.homeLineupGKArr.push(data);
				}else if(data.position == 'Def'){
					$scope.homeLineupDefArr.push(data);
				}else if(data.position == 'Mid'){
					$scope.homeLineupMidArr.push(data);
				}else if(data.position == 'Att'){
					$scope.homeLineupAttArr.push(data);
				}
				$ionicLoading.hide();
			}).error(function(data) {
				$ionicLoading.hide();
			});
		});

		$scope.homeSubArr.forEach(function(sub){
			LoginService.getUserByUsername(sub).success(function(data){
				if(data.position == 'GK'){
					$scope.homeSubGKArr.push(data);
				}else if(data.position == 'Def'){
					$scope.homeSubDefArr.push(data);
				}else if(data.position == 'Mid'){
					$scope.homeSubMidArr.push(data);
				}else if(data.position == 'Att'){
					$scope.homeSubAttArr.push(data);
				}
				$ionicLoading.hide();
			}).error(function(data) {
				$ionicLoading.hide();
			});
		});

		$scope.awayLineupArr.forEach(function(lineup){
			LoginService.getUserByUsername(lineup).success(function(data){
				if(data.position == 'GK'){
					$scope.awayLineupGKArr.push(data);
				}else if(data.position == 'Def'){
					$scope.awayLineupDefArr.push(data);
				}else if(data.position == 'Mid'){
					$scope.awayLineupMidArr.push(data);
				}else if(data.position == 'Att'){
					$scope.awayLineupAttArr.push(data);
				}
				$ionicLoading.hide();
			}).error(function(data) {
				$ionicLoading.hide();
			});
		});

		$scope.awaySubArr.forEach(function(sub){
			LoginService.getUserByUsername(sub).success(function(data){
				if(data.position == 'GK'){
					$scope.awaySubGKArr.push(data);
				}else if(data.position == 'Def'){
					$scope.awaySubDefArr.push(data);
				}else if(data.position == 'Mid'){
					$scope.awaySubMidArr.push(data);
				}else if(data.position == 'Att'){
					$scope.awaySubAttArr.push(data);
				}
				$ionicLoading.hide();
			}).error(function(data) {
				$ionicLoading.hide();
			});
		});

			var homePossession = $scope.match.match_stats.homePossession;
			var awayPossession = $scope.match.match_stats.awayPossession;
			var homeTotalShots = $scope.match.match_stats.homeTotalShots;
			var awayTotalShots = $scope.match.match_stats.awayTotalShots;
			var homeShotOnTarget = $scope.match.match_stats.homeShotOnTarget;
			var awayShotOnTarget = $scope.match.match_stats.awayShotOnTarget;
			var homeShotOffTarget = $scope.match.match_stats.homeShotOffTarget;
			var awayShotOffTarget = $scope.match.match_stats.awayShotOffTarget;
			var homeCornerKicks = $scope.match.match_stats.homeCornerKicks;
			var awayCornerKicks = $scope.match.match_stats.awayCornerKicks;
			var homeFouls = $scope.match.match_stats.homeFouls;
			var awayFouls = $scope.match.match_stats.awayFouls;
			var homeYellowCard = $scope.match.match_stats.homeYellowCard;
			var awayYellowCard = $scope.match.match_stats.awayYellowCard;
			var homeRedCard = $scope.match.match_stats.homeRedCard;
			var awayRedCard = $scope.match.match_stats.awayRedCard;

			if(homePossession !== awayPossession){
				ballPossessionHome.style.width = (homePossession / (homePossession + awayPossession)) * 100 + '%';
				ballPossessionAway.style.width = 100 - ((homePossession / (homePossession + awayPossession)) * 100) + '%';
			}else if(homePossession === 0 && awayPossession !== 0){
				ballPossessionHome.style.width = '0%';
				ballPossessionAway.style.width = '100%';
			}else if(awayPossession === 0 && homePossession !== 0){
				ballPossessionHome.style.width = '100%';
				ballPossessionAway.style.width = '0%';
			}else if(homePossession === awayPossession){
				ballPossessionHome.style.width = '50%';
				ballPossessionAway.style.width = '50%';
			}


			if(homeTotalShots !== awayTotalShots){
				totalShotsHome.style.width = (homeTotalShots / (homeTotalShots + awayTotalShots)) * 100 + '%';
				totalShotsAway.style.width = 100 - ((homeTotalShots / (homeTotalShots + awayTotalShots)) * 100) + '%';
			}else if(homeTotalShots === 0 && awayTotalShots !== 0){
				totalShotsHome.style.width = '0%';
				totalShotsAway.style.width = '100%';
			}else if(awayTotalShots === 0 && homeTotalShots !== 0){
				totalShotsHome.style.width = '100%';
				totalShotsAway.style.width = '0%';
			}else if(homeTotalShots === awayTotalShots){
				totalShotsHome.style.width = '50%';
				totalShotsAway.style.width = '50%';
			}


			if(homeShotOnTarget !== awayShotOnTarget){
				shotOnTargetHome.style.width = (homeShotOnTarget / (homeShotOnTarget + awayShotOnTarget)) * 100 + '%';
				shotOnTargetAway.style.width = 100 - ((homeShotOnTarget / (homeShotOnTarget + awayShotOnTarget)) * 100) + '%';
			}else if(homeShotOnTarget === 0 && awayShotOnTarget !== 0){
				shotOnTargetHome.style.width = '0%';
				shotOnTargetAway.style.width = '100%';
			}else if(awayShotOnTarget === 0 && homeShotOnTarget !== 0){
				shotOnTargetHome.style.width = '100%';
				shotOnTargetAway.style.width = '0%';
			}else if(homeShotOnTarget === awayShotOnTarget){
				shotOnTargetHome.style.width = '50%';
				shotOnTargetAway.style.width = '50%';
			}		


			if(homeShotOffTarget !== awayShotOffTarget){
				shotOffTargetHome.style.width = (homeShotOffTarget / (homeShotOffTarget + awayShotOffTarget)) * 100 + '%';
				shotOffTargetAway.style.width = 100 - ((homeShotOffTarget / (homeShotOffTarget + awayShotOffTarget)) * 100) + '%';
			}else if(homeShotOffTarget === 0 && awayShotOffTarget !== 0){
				shotOffTargetHome.style.width = '0%';
				shotOffTargetAway.style.width = '100%';
			}else if(awayShotOffTarget === 0 && homeShotOffTarget !== 0){
				shotOffTargetHome.style.width = '100%';
				shotOffTargetAway.style.width = '0%';
			}else if(homeShotOffTarget === awayShotOffTarget){
				shotOffTargetHome.style.width = '50%';
				shotOffTargetAway.style.width = '50%';
			}			


			if(homeCornerKicks !== awayCornerKicks){
				cornerKicksHome.style.width = (homeCornerKicks / (homeCornerKicks + awayCornerKicks)) * 100 + '%';
				cornerKicksAway.style.width = 100 - ((homeCornerKicks / (homeCornerKicks + awayCornerKicks)) * 100) + '%';
			}else if(homeCornerKicks === 0 && awayCornerKicks !== 0){
				cornerKicksHome.style.width = '0%';
				cornerKicksAway.style.width = '100%';
			}else if(awayCornerKicks === 0 && homeCornerKicks !== 0){
				cornerKicksHome.style.width = '100%';
				cornerKicksAway.style.width = '0%';
			}else if(homeCornerKicks === awayCornerKicks){
				cornerKicksHome.style.width = '50%';
				cornerKicksAway.style.width = '50%';
			}


			if(homeFouls !== awayFouls){
				foulsHome.style.width = (homeFouls / (homeFouls + awayFouls)) * 100 + '%';
				foulsAway.style.width = 100 - ((homeFouls / (homeFouls + awayFouls)) * 100) + '%';
			}else if(homeFouls === 0 && awayFouls !== 0){
				foulsHome.style.width = '0%';
				foulsAway.style.width = '100%';
			}else if(awayFouls === 0 && homeFouls !== 0){
				foulsHome.style.width = '100%';
				foulsAway.style.width = '0%';
			}else if(homeFouls === awayFouls){
				foulsHome.style.width = '50%';
				foulsAway.style.width = '50%';
			}


			if(homeYellowCard !== awayYellowCard){
				yellowCardHome.style.width = (homeYellowCard / (homeYellowCard + awayYellowCard)) * 100 + '%';
				yellowCardAway.style.width = 100 - ((homeYellowCard / (homeYellowCard + awayYellowCard)) * 100) + '%';
			}else if(homeYellowCard === 0 && awayYellowCard !== 0){
				yellowCardHome.style.width = '0%';
				yellowCardAway.style.width = '100%';
			}else if(awayYellowCard === 0 && homeYellowCard !== 0){
				yellowCardHome.style.width = '100%';
				yellowCardAway.style.width = '0%';
			}else if(homeYellowCard === awayYellowCard){
				yellowCardHome.style.width = '50%';
				yellowCardAway.style.width = '50%';
			}

	
			if(homeRedCard !== awayRedCard){
				redCardHome.style.width = (homeRedCard / (homeRedCard + awayRedCard)) * 100 + '%';
				redCardAway.style.width = 100 - ((homeRedCard / (homeRedCard + awayRedCard)) * 100) + '%';
			}else if(homeRedCard === 0 && awayRedCard !== 0){
				redCardHome.style.width = '0%';
				redCardAway.style.width = '100%';
			}else if(awayRedCard === 0 && homeRedCard !== 0){
				redCardHome.style.width = '100%';
				redCardAway.style.width = '0%';
			}else if(homeRedCard === awayRedCard){
				redCardHome.style.width = '50%';
				redCardAway.style.width = '50%';
			}		
	}).error(function(data) {
	});

	$scope.getMatchById = function(){

		MatchService.getMatchById($stateParams.matchId).success(function(data) {
			$ionicLoading.hide();
			$scope.match = data;
			$scope.day = moment($scope.match.match_date).format('dddd');
			CompetitionService.getCompetitionName($scope.match.competition_id).success(function(data) {
				$scope.compName = data;
				// console.log(compName);
			}).error(function(data) {});

			// Goal
			if($scope.match.goalHome.scorer.includes(",")){
				console.log("ada");
				$scope.scorerHome = $scope.match.goalHome.scorer.split(',');
				$scope.assistHome = $scope.match.goalHome.assist.split(',');
				$scope.timeHome = $scope.match.goalHome.time.split(',');
				$scope.goalHomeh = $scope.match.goalHome.scoreHome.split(',');
				$scope.goalHomea = $scope.match.goalHome.scoreAway.split(',');
				$scope.goalStatusHome  = $scope.match.goalHome.goalStatus.split(',');
				$scope.goalEventNumberHome  = $scope.match.goalHome.eventNumber.split(',');
			}else if($scope.match.goalHome.scorer !== ''){
				console.log("tidak ada");
				$scope.scorerHome = $scope.match.goalHome.scorer.toString();
				$scope.assistHome = $scope.match.goalHome.assist.toString();
				$scope.timeHome = $scope.match.goalHome.time.toString();
				$scope.goalHomeh = $scope.match.goalHome.scoreHome.toString();
				$scope.goalHomea = $scope.match.goalHome.scoreAway.toString();
				$scope.goalStatusHome  = $scope.match.goalHome.goalStatus.toString();
				$scope.goalEventNumberHome  = $scope.match.goalHome.eventNumber.toString();
			}


			if($scope.match.goalAway.scorer.includes(",")){
				console.log("ada");
				$scope.scorerAway = $scope.match.goalAway.scorer.split(',');
				$scope.assistAway = $scope.match.goalAway.assist.split(',');
				$scope.timeAway = $scope.match.goalAway.time.split(',');
				$scope.goalAwayh = $scope.match.goalAway.scoreHome.split(',');
				$scope.goalAwaya = $scope.match.goalAway.scoreAway.split(',');
				$scope.goalStatusAway  = $scope.match.goalAway.goalStatus.split(',');
				$scope.goalEventNumberAway  = $scope.match.goalAway.eventNumber.split(',');
			}else{
				console.log("tidak ada");
				$scope.scorerAway = $scope.match.goalAway.scorer.toString();
				$scope.assistAway = $scope.match.goalAway.assist.toString();
				$scope.timeAway = $scope.match.goalAway.time.toString();
				$scope.goalAwayh = $scope.match.goalAway.scoreHome.toString();
				$scope.goalAwaya = $scope.match.goalAway.scoreAway.toString();
				$scope.goalStatusAway  = $scope.match.goalAway.goalStatus.toString();
				$scope.goalEventNumberAway  = $scope.match.goalAway.eventNumber.toString();
			}

			// Yellow Card
			if($scope.match.yellowCardHome.player.includes(",")){
				console.log("ada");
				$scope.yellowPlayerHome = $scope.match.yellowCardHome.player.split(',');
				$scope.yellowTimeHome = $scope.match.yellowCardHome.time.split(',');
				$scope.yellowStatusHome = $scope.match.yellowCardHome.status.split(',');
				$scope.yellowEventNumberHome = $scope.match.yellowCardHome.eventNumber.split(',');
			}else if($scope.match.yellowCardHome.player !== ''){
				console.log("tidak ada");
				$scope.yellowPlayerHome = $scope.match.yellowCardHome.player.toString();
				$scope.yellowTimeHome = $scope.match.yellowCardHome.time.toString();
				$scope.yellowStatusHome = $scope.match.yellowCardHome.status.toString();
				$scope.yellowEventNumberHome = $scope.match.yellowCardHome.eventNumber.toString();
			}

			if($scope.match.yellowCardAway.player.includes(",")){
				console.log("ada");
				$scope.yellowPlayerAway = $scope.match.yellowCardAway.player.split(',');
				$scope.yellowTimeAway = $scope.match.yellowCardAway.time.split(',');
				$scope.yellowStatusAway = $scope.match.yellowCardAway.status.split(',');
				$scope.yellowEventNumberAway = $scope.match.yellowCardAway.eventNumber.split(',');
			}else if($scope.match.yellowCardAway.player !== ''){
				console.log("tidak ada");
				$scope.yellowPlayerAway = $scope.match.yellowCardAway.player.toString();
				$scope.yellowTimeAway = $scope.match.yellowCardAway.time.toString();
				$scope.yellowStatusAway = $scope.match.yellowCardAway.status.toString();
				$scope.yellowEventNumberAway = $scope.match.yellowCardAway.eventNumber.split(',');
			}

			// Red Card
			if($scope.match.redCardHome.player.includes(",")){
				console.log("ada");
				$scope.redPlayerHome = $scope.match.redCardHome.player.split(',');
				$scope.redTimeHome = $scope.match.redCardHome.time.split(',');
				$scope.redEventNumberHome = $scope.match.redCardHome.eventNumber.split(',');
			}else if($scope.match.redCardHome.player !== ''){
				console.log("tidak ada");
				$scope.redPlayerHome = $scope.match.redCardHome.player.toString();
				$scope.redTimeHome = $scope.match.redCardHome.time.toString();
				$scope.redEventNumberHome = $scope.match.redCardHome.eventNumber.toString();
			}

			if($scope.match.redCardAway.player.includes(",")){
				console.log("ada");
				$scope.redPlayerAway = $scope.match.redCardAway.player.split(',');
				$scope.redTimeAway = $scope.match.redCardAway.time.split(',');
				$scope.redEventNumberAway = $scope.match.redCardAway.eventNumber.split(',');
			}else if($scope.match.redCardAway.player !== ''){
				console.log("tidak ada");
				$scope.redPlayerAway = $scope.match.redCardAway.player.toString();
				$scope.redTimeAway = $scope.match.redCardAway.time.toString();
				$scope.redEventNumberAway = $scope.match.redCardAway.eventNumber.toString();
			}

			// Substitute
			if($scope.match.substituteHome.in.includes(",")){
				console.log("ada");
				$scope.subInHome = $scope.match.substituteHome.in.split(',');
				$scope.subOutHome = $scope.match.substituteHome.out.split(',');
				$scope.subTimeHome = $scope.match.substituteHome.time.split(',');
				$scope.subEventNumberHome = $scope.match.substituteHome.eventNumber.split(',');
			}else if($scope.match.substituteHome.in !== ''){
				console.log("tidak ada");
				$scope.subInHome = $scope.match.substituteHome.in.toString();
				$scope.subOutHome = $scope.match.substituteHome.out.toString();
				$scope.subTimeHome = $scope.match.substituteHome.time.toString();
				$scope.subEventNumberHome = $scope.match.substituteHome.eventNumber.toString();
			}

			if($scope.match.substituteAway.in.includes(",")){
				console.log("ada");
				$scope.subInAway = $scope.match.substituteAway.in.split(',');
				$scope.subOutAway = $scope.match.substituteAway.out.split(',');
				$scope.subTimeAway = $scope.match.substituteAway.time.split(',');
				$scope.subEventNumberAway = $scope.match.substituteAway.eventNumber.split(',');
			}else if($scope.match.substituteAway.in !== ''){
				console.log("tidak ada");
				$scope.subInAway = $scope.match.substituteAway.in.toString();
				$scope.subOutAway = $scope.match.substituteAway.out.toString();
				$scope.subTimeAway = $scope.match.substituteAway.time.toString();
				$scope.subEventNumberAway = $scope.match.substituteAway.eventNumber.toString();
			}
		

			if($scope.match.goalHome.scorer.includes(",")){
				for(var h = 0; h < $scope.scorerHome.length; h++){
					$scope.goalHomeObj[h] = {};
					$scope.goalHomeObj[h].scorer = $scope.scorerHome[h];
					$scope.goalHomeObj[h].assist = $scope.assistHome[h];
					$scope.goalHomeObj[h].time = $scope.timeHome[h];
					$scope.goalHomeObj[h].goalH = $scope.goalHomeh[h];
					$scope.goalHomeObj[h].goalA = $scope.goalHomea[h];
					$scope.goalHomeObj[h].status = "home";
					$scope.goalHomeObj[h].goalStatus = $scope.goalStatusHome[h];
					$scope.goalHomeObj[h].eventNumber = $scope.goalEventNumberHome[h];
				}
			}else if($scope.match.goalHome.scorer !== ''){
				$scope.goalHomeObj[0] = {};
				$scope.goalHomeObj[0].scorer = $scope.scorerHome;
				$scope.goalHomeObj[0].assist = $scope.assistHome;
				$scope.goalHomeObj[0].time = $scope.timeHome;
				$scope.goalHomeObj[0].goalH = $scope.goalHomeh;
				$scope.goalHomeObj[0].goalA = $scope.goalHomea;
				$scope.goalHomeObj[0].status = "home";
				$scope.goalHomeObj[0].goalStatus = $scope.goalStatusHome;
				$scope.goalHomeObj[0].eventNumber = $scope.goalEventNumberHome;

			}

			if($scope.match.goalAway.scorer.includes(",")){
				for(var a = 0; a < $scope.scorerAway.length; a++){
					$scope.goalAwayObj[a] = {};
					$scope.goalAwayObj[a].scorer = $scope.scorerAway[a];
					$scope.goalAwayObj[a].assist = $scope.assistAway[a];
					$scope.goalAwayObj[a].time = $scope.timeAway[a];
					$scope.goalAwayObj[a].goalH = $scope.goalAwayh[a];
					$scope.goalAwayObj[a].goalA = $scope.goalAwaya[a];
					$scope.goalAwayObj[a].status = "away";
					$scope.goalAwayObj[a].goalStatus = $scope.goalStatusAway[a];
					$scope.goalAwayObj[a].eventNumber = $scope.goalEventNumberAway[a];

				}
			}else if($scope.match.goalAway.scorer !== ''){
				$scope.goalAwayObj[0] = {};
				$scope.goalAwayObj[0].scorer = $scope.scorerAway;
				$scope.goalAwayObj[0].assist = $scope.assistAway;
				$scope.goalAwayObj[0].time = $scope.timeAway;
				$scope.goalAwayObj[0].status = "away";
				$scope.goalAwayObj[0].goalH = $scope.goalAwayh;
				$scope.goalAwayObj[0].goalA = $scope.goalAwaya;
				$scope.goalAwayObj[0].goalStatus = $scope.goalStatusAway;
				$scope.goalAwayObj[0].eventNumber = $scope.goalEventNumberAway;
			}

			// Yellow Card
			if($scope.match.yellowCardHome.player.includes(",")){
				for(var h = 0; h < $scope.yellowPlayerHome.length; h++){
					$scope.yellowHomeObj[h] = {};
					$scope.yellowHomeObj[h].player = $scope.yellowPlayerHome[h];
					$scope.yellowHomeObj[h].time = $scope.yellowTimeHome[h];
					$scope.yellowHomeObj[h].status = "home";
					$scope.yellowHomeObj[h].cardStatus = "yellow";
					$scope.yellowHomeObj[h].yellowCardStatus = $scope.yellowStatusHome[h];
					$scope.yellowHomeObj[h].eventNumber = $scope.yellowEventNumberHome[h];
				}
			}else if($scope.match.yellowCardHome.player !== ''){
				$scope.yellowHomeObj[0] = {};
				$scope.yellowHomeObj[0].player = $scope.yellowPlayerHome;
				$scope.yellowHomeObj[0].time = $scope.yellowTimeHome;
				$scope.yellowHomeObj[0].status = "home";
				$scope.yellowHomeObj[0].cardStatus = "yellow";
				$scope.yellowHomeObj[0].yellowCardStatus = $scope.yellowStatusHome;
				$scope.yellowHomeObj[0].eventNumber = $scope.yellowEventNumberHome;
			}

			if($scope.match.yellowCardAway.player.includes(",")){
				for(var h = 0; h < $scope.yellowPlayerAway.length; h++){
					$scope.yellowAwayObj[h] = {};
					$scope.yellowAwayObj[h].player = $scope.yellowPlayerAway[h];
					$scope.yellowAwayObj[h].time = $scope.yellowTimeAway[h];
					$scope.yellowAwayObj[h].status = "away";
					$scope.yellowAwayObj[h].cardStatus = "yellow";
					$scope.yellowAwayObj[h].yellowCardStatus = $scope.yellowStatusAway[h];
					$scope.yellowAwayObj[h].eventNumber = $scope.yellowEventNumberAway[h];
				}
			}else if($scope.match.yellowCardAway.player !== ''){
				$scope.yellowAwayObj[0] = {};
				$scope.yellowAwayObj[0].player = $scope.yellowPlayerAway;
				$scope.yellowAwayObj[0].time = $scope.yellowTimeAway;
				$scope.yellowAwayObj[0].status = "away";
				$scope.yellowAwayObj[0].cardStatus = "yellow";
				$scope.yellowAwayObj[0].yellowCardStatus = $scope.yellowStatusAway;
				$scope.yellowAwayObj[0].eventNumber = $scope.yellowEventNumberAway;
			}

			// Red Card
			if($scope.match.redCardHome.player.includes(",")){
				for(var h = 0; h < $scope.redPlayerHome.length; h++){
					$scope.redHomeObj[h] = {};
					$scope.redHomeObj[h].player = $scope.redPlayerHome[h];
					$scope.redHomeObj[h].time = $scope.redTimeHome[h];
					$scope.redHomeObj[h].status = "home";
					$scope.redHomeObj[h].cardStatus = "red";
					$scope.redHomeObj[h].eventNumber = $scope.redEventNumberHome[h];
				}
			}else if($scope.match.redCardHome.player !== ''){
				$scope.redHomeObj[0] = {};
				$scope.redHomeObj[0].player = $scope.redPlayerHome;
				$scope.redHomeObj[0].time = $scope.redTimeHome;
				$scope.redHomeObj[0].status = "home";
				$scope.redHomeObj[0].cardStatus = "red";
				$scope.redHomeObj[0].eventNumber = $scope.redEventNumberHome;
			}

			if($scope.match.redCardAway.player.includes(",")){
				for(var h = 0; h < $scope.redPlayerAway.length; h++){
					$scope.redAwayObj[h] = {};
					$scope.redAwayObj[h].player = $scope.redPlayerAway[h];
					$scope.redAwayObj[h].time = $scope.redTimeAway[h];
					$scope.redAwayObj[h].status = "away";
					$scope.redAwayObj[h].cardStatus = "red";
					$scope.redAwayObj[h].eventNumber = $scope.redEventNumberAway[h];
				}
			}else if($scope.match.redCardAway.player !== ''){
				$scope.redAwayObj[0] = {};
				$scope.redAwayObj[0].player = $scope.redPlayerAway;
				$scope.redAwayObj[0].time = $scope.redTimeAway;
				$scope.redAwayObj[0].status = "away";
				$scope.redAwayObj[0].cardStatus = "red";
				$scope.redAwayObj[0].eventNumber = $scope.redEventNumberAway;
			}

			// Substitute
			if($scope.match.substituteHome.in.includes(",")){
				for(var h = 0; h < $scope.subInHome.length; h++){
					$scope.subHomeObj[h] = {};
					$scope.subHomeObj[h].in = $scope.subInHome[h];
					$scope.subHomeObj[h].out = $scope.subOutHome[h];
					$scope.subHomeObj[h].time = $scope.subTimeHome[h];
					$scope.subHomeObj[h].status = "home";
					$scope.subHomeObj[h].eventStatus = "sub";
					$scope.subHomeObj[h].eventNumber = $scope.subEventNumberHome[h];
				}
			}else if($scope.match.substituteHome.in !== ''){
				$scope.subHomeObj[0] = {};
				$scope.subHomeObj[0].in = $scope.subInHome;
				$scope.subHomeObj[0].out = $scope.subOutHome;
				$scope.subHomeObj[0].time = $scope.subTimeHome;
				$scope.subHomeObj[0].status = "home";
				$scope.subHomeObj[0].eventStatus = "sub";
				$scope.subHomeObj[0].eventNumber = $scope.subEventNumberHome;
			}

			if($scope.match.substituteAway.in.includes(",")){
				for(var h = 0; h < $scope.subInAway.length; h++){
					$scope.subAwayObj[h] = {};
					$scope.subAwayObj[h].in = $scope.subInAway[h];
					$scope.subAwayObj[h].out = $scope.subOutAway[h];
					$scope.subAwayObj[h].time = $scope.subTimeAway[h];
					$scope.subAwayObj[h].status = "away";
					$scope.subAwayObj[h].eventStatus = "sub";
					$scope.subAwayObj[h].eventNumber = $scope.subEventNumberAway[h];
				}
			}else if($scope.match.substituteAway.in !== ''){
				$scope.subAwayObj[0] = {};
				$scope.subAwayObj[0].in = $scope.subInAway;
				$scope.subAwayObj[0].out = $scope.subOutAway;
				$scope.subAwayObj[0].time = $scope.subTimeAway;
				$scope.subAwayObj[0].status = "away";
				$scope.subAwayObj[0].eventStatus = "sub";
				$scope.subAwayObj[0].eventNumber = $scope.subEventNumberAway;
			}

			console.log($scope.goalHomeObj);
			console.log($scope.goalAwayObj);
			console.log($scope.yellowHomeObj);

			$scope.goalHomeArr = [];
			$scope.goalAwayArr = [];
			$scope.yellowHomeArr = [];
			$scope.yellowAwayArr = [];
			$scope.redHomeArr = [];
			$scope.redAwayArr = [];
			$scope.subHomeArr = [];
			$scope.subAwayArr = [];

			for(var itemh in $scope.goalHomeObj){
				// $scope.goalDataArr.push($scope.goalHomeObj[itemh]);
				$scope.goalHomeArr.push($scope.goalHomeObj[itemh]);
			}

			for(var itema in $scope.goalAwayObj){
				// $scope.goalDataArr.push($scope.goalAwayObj[itema]);
				$scope.goalAwayArr.push($scope.goalAwayObj[itema]);
			}

			// Yellow Card
			for(var item in $scope.yellowHomeObj){
				// $scope.goalDataArr.push($scope.goalAwayObj[itema]);
				$scope.yellowHomeArr.push($scope.yellowHomeObj[item]);
			}

			for(var item in $scope.yellowAwayObj){
				// $scope.goalDataArr.push($scope.goalAwayObj[itema]);
				$scope.yellowAwayArr.push($scope.yellowAwayObj[item]);
			}

			// Red Card
			for(var item in $scope.redHomeObj){
				// $scope.goalDataArr.push($scope.goalAwayObj[itema]);
				$scope.redHomeArr.push($scope.redHomeObj[item]);
			}

			for(var item in $scope.redAwayObj){
				// $scope.goalDataArr.push($scope.goalAwayObj[itema]);
				$scope.redAwayArr.push($scope.redAwayObj[item]);
			}

			// Substitute
			for(var item in $scope.subHomeObj){
				// $scope.goalDataArr.push($scope.goalAwayObj[itema]);
				$scope.subHomeArr.push($scope.subHomeObj[item]);
			}

			for(var item in $scope.subAwayObj){
				// $scope.goalDataArr.push($scope.goalAwayObj[itema]);
				$scope.subAwayArr.push($scope.subAwayObj[item]);
			}
			console.log($scope.goalHomeArr.length);
			console.log($scope.goalAwayArr);
			if($scope.goalHomeArr.length !== 0){
				console.log("not 0");
				$scope.goalsArr = $scope.goalHomeArr;
				if($scope.goalAwayArr.length !== 0){
					console.log("not 0000");
					$scope.goalsArr = $scope.goalHomeArr.concat($scope.goalAwayArr);
				}
			}else{
				console.log("0");
				if($scope.goalAwayArr.length !== 0){
					console.log("not 0000000000");
					$scope.goalsArr = $scope.goalAwayArr;
				}
			}


			if($scope.goalsArr.length !== 0){
				$scope.goalsArr = $scope.goalsArr.concat($scope.yellowHomeArr);
			}else{
				$scope.goalsArr = $scope.yellowHomeArr;
			}

			if($scope.goalsArr.length !== 0){
				$scope.goalsArr = $scope.goalsArr.concat($scope.yellowAwayArr);
			}else{
				$scope.goalsArr = $scope.yellowAwayArr;
			}

			if($scope.goalsArr.length !== 0){
				$scope.goalsArr = $scope.goalsArr.concat($scope.redHomeArr);
			}else{
				$scope.goalsArr = $scope.redHomeArr;
			}

			if($scope.goalsArr.length !== 0){
				$scope.goalsArr = $scope.goalsArr.concat($scope.redAwayArr);
			}else{
				$scope.goalsArr = $scope.redAwayArr;
			}

			if($scope.goalsArr.length !== 0){
				$scope.goalsArr = $scope.goalsArr.concat($scope.subHomeArr);
			}else{
				$scope.goalsArr = $scope.subHomeArr;
			}

			if($scope.goalsArr.length !== 0){
				$scope.goalsArr = $scope.goalsArr.concat($scope.subAwayArr);
			}else{
				$scope.goalsArr = $scope.subAwayArr;
			}
			console.log($scope.goalsArr);

			$scope.goalsArr.sort(function(a, b) {
			    return a.eventNumber - b.eventNumber;
			});

			// var homePossession = $scope.match.match_stats.homePossession;
			// var awayPossession = $scope.match.match_stats.awayPossession;
			// var homeTotalShots = $scope.match.match_stats.homeTotalShots;
			// var awayTotalShots = $scope.match.match_stats.awayTotalShots;
			// var homeShotOnTarget = $scope.match.match_stats.homeShotOnTarget;
			// var awayShotOnTarget = $scope.match.match_stats.awayShotOnTarget;
			// var homeShotOffTarget = $scope.match.match_stats.homeShotOffTarget;
			// var awayShotOffTarget = $scope.match.match_stats.awayShotOffTarget;
			// var homeCornerKicks = $scope.match.match_stats.homeCornerKicks;
			// var awayCornerKicks = $scope.match.match_stats.awayCornerKicks;
			// var homeFouls = $scope.match.match_stats.homeFouls;
			// var awayFouls = $scope.match.match_stats.awayFouls;
			// var homeYellowCard = $scope.match.match_stats.homeYellowCard;
			// var awayYellowCard = $scope.match.match_stats.awayYellowCard;
			// var homeRedCard = $scope.match.match_stats.homeRedCard;
			// var awayRedCard = $scope.match.match_stats.awayRedCard;

			// if(homePossession !== awayPossession){
			// 	ballPossessionHome.style.width = (homePossession / (homePossession + awayPossession)) * 100 + '%';
			// 	ballPossessionAway.style.width = 100 - ((homePossession / (homePossession + awayPossession)) * 100) + '%';
			// }else if(homePossession === 0 && awayPossession !== 0){
			// 	ballPossessionHome.style.width = '0%';
			// 	ballPossessionAway.style.width = '100%';
			// }else if(awayPossession === 0 && homePossession !== 0){
			// 	ballPossessionHome.style.width = '100%';
			// 	ballPossessionAway.style.width = '0%';
			// }else if(homePossession === awayPossession){
			// 	ballPossessionHome.style.width = '50%';
			// 	ballPossessionAway.style.width = '50%';
			// }


			// if(homeTotalShots !== awayTotalShots){
			// 	totalShotsHome.style.width = (homeTotalShots / (homeTotalShots + awayTotalShots)) * 100 + '%';
			// 	totalShotsAway.style.width = 100 - ((homeTotalShots / (homeTotalShots + awayTotalShots)) * 100) + '%';
			// }else if(homeTotalShots === 0 && awayTotalShots !== 0){
			// 	totalShotsHome.style.width = '0%';
			// 	totalShotsAway.style.width = '100%';
			// }else if(awayTotalShots === 0 && homeTotalShots !== 0){
			// 	totalShotsHome.style.width = '100%';
			// 	totalShotsAway.style.width = '0%';
			// }else if(homeTotalShots === awayTotalShots){
			// 	totalShotsHome.style.width = '50%';
			// 	totalShotsAway.style.width = '50%';
			// }


			// if(homeShotOnTarget !== awayShotOnTarget){
			// 	shotOnTargetHome.style.width = (homeShotOnTarget / (homeShotOnTarget + awayShotOnTarget)) * 100 + '%';
			// 	shotOnTargetAway.style.width = 100 - ((homeShotOnTarget / (homeShotOnTarget + awayShotOnTarget)) * 100) + '%';
			// }else if(homeShotOnTarget === 0 && awayShotOnTarget !== 0){
			// 	shotOnTargetHome.style.width = '0%';
			// 	shotOnTargetAway.style.width = '100%';
			// }else if(awayShotOnTarget === 0 && homeShotOnTarget !== 0){
			// 	shotOnTargetHome.style.width = '100%';
			// 	shotOnTargetAway.style.width = '0%';
			// }else if(homeShotOnTarget === awayShotOnTarget){
			// 	shotOnTargetHome.style.width = '50%';
			// 	shotOnTargetAway.style.width = '50%';
			// }		


			// if(homeShotOffTarget !== awayShotOffTarget){
			// 	shotOffTargetHome.style.width = (homeShotOffTarget / (homeShotOffTarget + awayShotOffTarget)) * 100 + '%';
			// 	shotOffTargetAway.style.width = 100 - ((homeShotOffTarget / (homeShotOffTarget + awayShotOffTarget)) * 100) + '%';
			// }else if(homeShotOffTarget === 0 && awayShotOffTarget !== 0){
			// 	shotOffTargetHome.style.width = '0%';
			// 	shotOffTargetAway.style.width = '100%';
			// }else if(awayShotOffTarget === 0 && homeShotOffTarget !== 0){
			// 	shotOffTargetHome.style.width = '100%';
			// 	shotOffTargetAway.style.width = '0%';
			// }else if(homeShotOffTarget === awayShotOffTarget){
			// 	shotOffTargetHome.style.width = '50%';
			// 	shotOffTargetAway.style.width = '50%';
			// }			


			// if(homeCornerKicks !== awayCornerKicks){
			// 	cornerKicksHome.style.width = (homeCornerKicks / (homeCornerKicks + awayCornerKicks)) * 100 + '%';
			// 	cornerKicksAway.style.width = 100 - ((homeCornerKicks / (homeCornerKicks + awayCornerKicks)) * 100) + '%';
			// }else if(homeCornerKicks === 0 && awayCornerKicks !== 0){
			// 	cornerKicksHome.style.width = '0%';
			// 	cornerKicksAway.style.width = '100%';
			// }else if(awayCornerKicks === 0 && homeCornerKicks !== 0){
			// 	cornerKicksHome.style.width = '100%';
			// 	cornerKicksAway.style.width = '0%';
			// }else if(homeCornerKicks === awayCornerKicks){
			// 	cornerKicksHome.style.width = '50%';
			// 	cornerKicksAway.style.width = '50%';
			// }


			// if(homeFouls !== awayFouls){
			// 	foulsHome.style.width = (homeFouls / (homeFouls + awayFouls)) * 100 + '%';
			// 	foulsAway.style.width = 100 - ((homeFouls / (homeFouls + awayFouls)) * 100) + '%';
			// }else if(homeFouls === 0 && awayFouls !== 0){
			// 	foulsHome.style.width = '0%';
			// 	foulsAway.style.width = '100%';
			// }else if(awayFouls === 0 && homeFouls !== 0){
			// 	foulsHome.style.width = '100%';
			// 	foulsAway.style.width = '0%';
			// }else if(homeFouls === awayFouls){
			// 	foulsHome.style.width = '50%';
			// 	foulsAway.style.width = '50%';
			// }


			// if(homeYellowCard !== awayYellowCard){
			// 	yellowCardHome.style.width = (homeYellowCard / (homeYellowCard + awayYellowCard)) * 100 + '%';
			// 	yellowCardAway.style.width = 100 - ((homeYellowCard / (homeYellowCard + awayYellowCard)) * 100) + '%';
			// }else if(homeYellowCard === 0 && awayYellowCard !== 0){
			// 	yellowCardHome.style.width = '0%';
			// 	yellowCardAway.style.width = '100%';
			// }else if(awayYellowCard === 0 && homeYellowCard !== 0){
			// 	yellowCardHome.style.width = '100%';
			// 	yellowCardAway.style.width = '0%';
			// }else if(homeYellowCard === awayYellowCard){
			// 	yellowCardHome.style.width = '50%';
			// 	yellowCardAway.style.width = '50%';
			// }

	
			// if(homeRedCard !== awayRedCard){
			// 	redCardHome.style.width = (homeRedCard / (homeRedCard + awayRedCard)) * 100 + '%';
			// 	redCardAway.style.width = 100 - ((homeRedCard / (homeRedCard + awayRedCard)) * 100) + '%';
			// }else if(homeRedCard === 0 && awayRedCard !== 0){
			// 	redCardHome.style.width = '0%';
			// 	redCardAway.style.width = '100%';
			// }else if(awayRedCard === 0 && homeRedCard !== 0){
			// 	redCardHome.style.width = '100%';
			// 	redCardAway.style.width = '0%';
			// }else if(homeRedCard === awayRedCard){
			// 	redCardHome.style.width = '50%';
			// 	redCardAway.style.width = '50%';
			// }	
		}).error(function(data) {
		});
	}

	window.loadMatchById = setInterval($scope.getMatchById, 1500);

	
	$scope.back = function(){
		if(localStorage.getItem("matchResultBackStatus") === 'history'){
			$state.go('app.history');
			localStorage.removeItem("matchResultBackStatus");
		}else if(localStorage.getItem("matchResultBackStatus") === 'livescore'){
			$state.go('app.live_score');
		}else{
			$state.go('app.home');
			localStorage.removeItem("matchResultBackStatus");
		}
	}

})

.controller('MatchInfoCtrl', function($scope, $state, $stateParams, $ionicPopup, $ionicPlatform, $ionicLoading, MatchService, LoginService, CompetitionService, PostService, ionicMaterialInk, ionicMaterialMotion, $cordovaSocialSharing) {
	$ionicLoading.show({
		content: 'Login...',
		animation: 'fade-in',
		showBackdrop: true,
	});
	$scope.match = {};
	$scope.goalDataArr = [];
	$scope.goalsArr = [];
	$scope.goalHomeObj = {};
	$scope.goalAwayObj = {};
	$scope.scorerHome = [];
	$scope.scorerAway = [];
	$scope.timeAway = [];
	$scope.timeHome = [];
	$scope.homeLineupArr = [];
	$scope.awayLineupArr = [];
	$scope.homeSubArr = [];
	$scope.awaySubArr = [];
	$scope.homeLineupPlayerArr = [];
	$scope.awayLineupPlayerArr = [];
	$scope.homeSubPlayerArr = [];
	$scope.awaySubPlayerArr = [];
	$scope.homeLineupGKObj = {};
	$scope.homeLineupGKArr = [];
	$scope.homeLineupDefArr = [];
	$scope.homeLineupMidArr = [];
	$scope.homeLineupAttArr = [];
	$scope.homeSubGKArr = [];
	$scope.homeSubDefArr = [];
	$scope.homeSubMidArr = [];
	$scope.homeSubAttArr = [];
	$scope.awayLineupGKArr = [];
	$scope.awayLineupDefArr = [];
	$scope.awayLineupMidArr = [];
	$scope.awayLineupAttArr = [];
	$scope.awaySubGKArr = [];
	$scope.awaySubDefArr = [];
	$scope.awaySubMidArr = [];
	$scope.awaySubAttArr = [];


	MatchService.getMatchById($stateParams.matchId).success(function(data) {
		$ionicLoading.hide();
		$scope.match = data;
		$scope.day = moment($scope.match.match_date).format('dddd');

		$scope.homeLineupArr = $scope.match.match_homeTeamObj.lineup.split(",");
		$scope.awayLineupArr = $scope.match.match_awayTeamObj.lineup.split(",");
		$scope.homeSubArr = $scope.match.match_homeTeamObj.sub.split(",");
		$scope.awaySubArr = $scope.match.match_awayTeamObj.sub.split(",");

		console.log($scope.homeLineupArr);
		console.log($scope.awayLineupArr);


		$scope.homeLineupArr.forEach(function(lineup){
			LoginService.getUserByUsername(lineup).success(function(data){
				if(data.position == 'GK'){
					$scope.homeLineupGKArr.push(data);
				}else if(data.position == 'Def'){
					$scope.homeLineupDefArr.push(data);
				}else if(data.position == 'Mid'){
					$scope.homeLineupMidArr.push(data);
				}else if(data.position == 'Att'){
					$scope.homeLineupAttArr.push(data);
				}
				$ionicLoading.hide();
			}).error(function(data) {
				$ionicLoading.hide();
			});
		});

		$scope.homeSubArr.forEach(function(sub){
			LoginService.getUserByUsername(sub).success(function(data){
				if(data.position == 'GK'){
					$scope.homeSubGKArr.push(data);
				}else if(data.position == 'Def'){
					$scope.homeSubDefArr.push(data);
				}else if(data.position == 'Mid'){
					$scope.homeSubMidArr.push(data);
				}else if(data.position == 'Att'){
					$scope.homeSubAttArr.push(data);
				}
				$ionicLoading.hide();
			}).error(function(data) {
				$ionicLoading.hide();
			});
		});

		$scope.awayLineupArr.forEach(function(lineup){
			LoginService.getUserByUsername(lineup).success(function(data){
				console.log(data);
				if(data.position == 'GK'){
					$scope.awayLineupGKArr.push(data);
				}else if(data.position == 'Def'){
					$scope.awayLineupDefArr.push(data);
				}else if(data.position == 'Mid'){
					$scope.awayLineupMidArr.push(data);
				}else if(data.position == 'Att'){
					$scope.awayLineupAttArr.push(data);
				}
				$ionicLoading.hide();
			}).error(function(data) {
				$ionicLoading.hide();
			});
		});

		$scope.awaySubArr.forEach(function(sub){
			LoginService.getUserByUsername(sub).success(function(data){
				if(data.position == 'GK'){
					$scope.awaySubGKArr.push(data);
				}else if(data.position == 'Def'){
					$scope.awaySubDefArr.push(data);
				}else if(data.position == 'Mid'){
					$scope.awaySubMidArr.push(data);
				}else if(data.position == 'Att'){
					$scope.awaySubAttArr.push(data);
				}
				$ionicLoading.hide();
			}).error(function(data) {
				$ionicLoading.hide();
			});
		});

		console.log($scope.awaySubGKArr);

		CompetitionService.getCompetitionName($scope.match.competition_id).success(function(data) {
			$scope.compName = data;
			// console.log(compName);
		}).error(function(data) {});

		$scope.scorerHome = $scope.match.goalHome.scorer.split(',');
		$scope.timeHome = $scope.match.goalHome.time.split(',');
		if($scope.match.goalAway.scorer.includes(",")){
			console.log("11231231231231");
			$scope.scorerAway = $scope.match.goalAway.scorer.split(',');
			$scope.timeAway = $scope.match.goalAway.time.split(',');
		}else{
			console.log("aasda fafa sfa");
			$scope.scorerAway.push($scope.match.goalAway.scorer);
			$scope.timeAway.push($scope.match.goalAway.time);
		}
		for(var h = 0; h < $scope.scorerHome.length; h++){
			$scope.goalHomeObj[h] = {};
			$scope.goalHomeObj[h].scorer = $scope.scorerHome[h];
			$scope.goalHomeObj[h].time = $scope.timeHome[h];
			$scope.goalHomeObj[h].status = "home";
		}

		for(var a = 0; a < $scope.scorerAway.length; a++){
			$scope.goalAwayObj[a] = {};
			$scope.goalAwayObj[a].scorer = $scope.scorerAway[a];
			$scope.goalAwayObj[a].time = $scope.timeAway[a];
			$scope.goalAwayObj[a].status = "away";
		}

		$scope.goalHomeArr = [];
		$scope.goalAwayArr = [];
		for(var itemh in $scope.goalHomeObj){
			$scope.goalDataArr.push($scope.goalHomeObj[itemh]);
			$scope.goalHomeArr.push($scope.goalHomeObj[itemh]);
		}
		for(var itema in $scope.goalAwayObj){
			$scope.goalDataArr.push($scope.goalAwayObj[itema]);
			$scope.goalAwayArr.push($scope.goalAwayObj[itema]);
		}

		$scope.scoreHome = $scope.match.goalHome.scoreHome.split(',');
		$scope.scoreAway = $scope.match.goalHome.scoreAway.split(',');

		$scope.goalHomeArr.sort(function(a, b) {
		    return a.time - b.time;
		});

		for(var ha = 0; ha < $scope.goalHomeArr.length; ha++){
			console.log($scope.goalHomeArr[ha]);
			$scope.goalHomeArr[ha].goalh = $scope.scoreHome[ha];
			$scope.goalHomeArr[ha].goala = $scope.scoreAway[ha];
			$scope.goalsArr.push($scope.goalHomeArr[ha]);
		}
		console.log($scope.goalHomeArr);

		$scope.goalAwayArr.sort(function(a, b) {
		    return a.time - b.time;
		});

		for(var aa = 0; aa < $scope.goalAwayArr.length; aa++){
			console.log($scope.goalAwayArr[aa]);
			$scope.goalAwayArr[aa].goala = aa+1;
			$scope.goalAwayArr[aa].goalh = 0;
			$scope.goalsArr.push($scope.goalAwayArr[aa]);
		}
		console.log($scope.goalAwayArr);
		$scope.goalsArr.sort(function(a, b) {
		    return a.time - b.time;
		});

		$scope.goalsDataArr = [];
		for(var ga = 0; ga < $scope.goalsArr.length; ga++){
			console.log($scope.goalsArr[ga]);
			$scope.goalsArr[ga].goalh = $scope.scoreHome[ga+1];
			$scope.goalsArr[ga].goala = $scope.scoreAway[ga+1];
			$scope.goalsDataArr.push($scope.goalsArr[ga]);
		}
		console.log($scope.goalsDataArr);
	}).error(function(data) {
	});
})

.controller('EditMatchCtrl', function($ionicModal, NgMap, $scope, $rootScope, $state, $stateParams, $ionicPopup, $ionicPlatform, $ionicLoading, TeamService, MatchService, ClassementService, LoginService, CompetitionService, ionicMaterialInk, ionicMaterialMotion, $cordovaSocialSharing) {
	$ionicLoading.show({
		content: 'Login...',
		animation: 'fade-in',
		showBackdrop: true,
	});

	$scope.matchData = {};
	$scope.timerData = {};
	
	MatchService.getMatchById($stateParams.matchId).success(function(data){
		$scope.matchData = data;
		$scope.homeTeamAbr = $scope.matchData.match_homeTeam.substr(0,1);
		$scope.awayTeamAbr = $scope.matchData.match_awayTeam.substr(0,1);

		if($scope.matchData.live_status !== 'true'){
			$scope.timerData.live_status = "true";
		}

		console.log($scope.matchData);
		$ionicLoading.hide();
		// if($scope.matchData.timer_status === null){
			// $scope.startTimer = function(){
			// 	if($scope.matchData.timer_status === ''){
			// 		console.log("afsd fsdf sdfsdf sdfsdf sf");
			// 		$scope.timerData.timer = $scope.matchData.timer + 1;
			// 		// $scope.timerData.timer_status = "halftime";
			// 		MatchService.editMatchById($scope.matchData.id,$scope.timerData).success(function(data) {
			// 			console.log('qweqweqrer erwerwerrqwrqwrqwrqwr');
			// 			$ionicLoading.hide();
			// 			// $state.go('app.home');
			// 		}).error(function(data) {
			// 			$ionicLoading.hide();
			// 		});
			// 	}
			// };
	}).error(function(data){
		$ionicLoading.hide();
	});


	$scope.penaltyShootOut = 1;
	$scope.penaltyStatus = 'home';
	$scope.homePenaltyScore = 0;
	$scope.awayPenaltyScore = 0;
	$scope.homePenalty = 1;
	$scope.awayPenalty = 0;
	$scope.homePenaltyLeft = 5;
	$scope.awayPenaltyLeft = 5;
	$scope.homePenalty1 = '';
	$scope.homePenalty2 = '';
	$scope.homePenalty3 = '';
	$scope.homePenalty4 = '';
	$scope.homePenalty5 = '';
	$scope.awayPenalty1 = '';
	$scope.awayPenalty2 = '';
	$scope.awayPenalty3 = '';
	$scope.awayPenalty4 = '';
	$scope.awayPenalty5 = '';
	$scope.penStatus = false;

	// Home Penalty Goal
	$scope.homePenaltyGoal = function(){
		$scope.awayPenalty = $scope.awayPenalty + 1;
		$scope.homePenaltyScore = $scope.homePenaltyScore + 1;
		$scope.homePenaltyLeft = $scope.homePenaltyLeft - 1;
		$scope.penaltyStatus = 'away';

		if($scope.homePenalty == 1){
			$scope.homePenalty1 = 'goal';
		}else if($scope.homePenalty == 2){
			$scope.homePenalty2 = 'goal';
		}else if($scope.homePenalty == 3){
			$scope.homePenalty3 = 'goal';
		}else if($scope.homePenalty == 4){
			$scope.homePenalty4 = 'goal';
		}else if($scope.homePenalty == 5){
			$scope.homePenalty5 = 'goal';
		}

		if($scope.penaltyShootOut <= 5){
			if($scope.homePenaltyScore <= ($scope.awayPenaltyScore + $scope.awayPenaltyLeft)){
				console.log("msh bisa");
			}else{
				console.log("tamat dah");
				$scope.penaltyStatus = '';

				$rootScope.showLoading();
				$scope.timerData.timer_status = "penalty shootout stopped";
				$scope.timerData.match_status = "finished";
				$scope.timerData.live_status = false;
				$scope.timerData.penalty = {};
				$scope.timerData.penalty.status = true;
				$scope.timerData.penalty.homeTeamScore = $scope.homePenaltyScore;
				$scope.timerData.penalty.awayTeamScore = $scope.awayPenaltyScore;

				if($scope.homePenaltyScore > $scope.awayPenaltyScore){
					$scope.timerData.match_winner = $scope.matchData.match_homeTeam;
					$scope.timerData.match_loser = $scope.matchData.match_awayTeam;
				}else{
					$scope.timerData.match_winner = $scope.matchData.match_awayTeam;
					$scope.timerData.match_loser = $scope.matchData.match_homeTeam;
				}

				clearInterval($scope.loadMatch);
				clearInterval($scope.loadTimer);
				clearInterval($scope.loadTeamPossession);
				$rootScope.showLoading($ionicLoading);

				// update next round match
				CompetitionService.getCompetitionById($scope.matchData.competition_id,localStorage.getItem("token")).success(function(comp) {
					console.log(comp);
					if($scope.matchData.match_fixture === 'play off'){
						console.log("play off");
						if(comp.comp_numOfTeam === 32){
							var fixture = 'round of 16';
							CompetitionService.getMatchByCompIdFixtureAndLastPair($scope.matchData.competition_id,fixture,$scope.matchData.match_pair).success(function(match) {
								match.forEach(function(m){
									console.log(m);
									if($scope.matchData.pair_status === 'home'){
										m.match_homeTeam = $scope.timerData.match_winner;
										m.match_homeTeamObj.team_name = $scope.timerData.match_winner;
									}else{
										m.match_awayTeam = $scope.timerData.match_winner;
										m.match_awayTeamObj.team_name = $scope.timerData.match_winner;
									}
									console.log(m);
									// update next round match data
									MatchService.editMatchById(m.id,m).success(function(data) {
										console.log(data);
									}).error(function(data) {});
								})
							}).error(function(data) {});
						}else if(comp.comp_numOfTeam === 16){
							var fixture = 'quarter final';
							CompetitionService.getMatchByCompIdFixtureAndLastPair($scope.matchData.competition_id,fixture,$scope.matchData.match_pair).success(function(match) {
								match.forEach(function(m){
									console.log(m);
									if($scope.matchData.pair_status === 'home'){
										m.match_homeTeam = $scope.timerData.match_winner;
										m.match_homeTeamObj.team_name = $scope.timerData.match_winner;
									}else{
										m.match_awayTeam = $scope.timerData.match_winner;
										m.match_awayTeamObj.team_name = $scope.timerData.match_winner;
									}
									console.log(m);
									// update next round match data
									MatchService.editMatchById(m.id,m).success(function(data) {
										console.log(data);
									}).error(function(data) {});
								})
							}).error(function(data) {});
						}else{
							var fixture = 'semi final';
							CompetitionService.getMatchByCompIdFixtureAndLastPair($scope.matchData.competition_id,fixture,$scope.matchData.match_pair).success(function(match) {
								match.forEach(function(m){
									console.log(m);
									if($scope.matchData.pair_status === 'home'){
										m.match_homeTeam = $scope.timerData.match_winner;
										m.match_homeTeamObj.team_name = $scope.timerData.match_winner;
									}else{
										m.match_awayTeam = $scope.timerData.match_winner;
										m.match_awayTeamObj.team_name = $scope.timerData.match_winner;
									}
									console.log(m);
									// update next round match data
									MatchService.editMatchById(m.id,m).success(function(data) {
										console.log(data);
									}).error(function(data) {});
								})
							}).error(function(data) {});
						}
					}else if($scope.matchData.match_fixture === 'round of 16'){
						var fixture = 'quarter final';
						CompetitionService.getMatchByCompIdFixtureAndLastPair($scope.matchData.competition_id,fixture,$scope.matchData.match_pair).success(function(match) {
							match.forEach(function(m){
								console.log(m);
								if($scope.matchData.pair_status === 'home'){
									m.match_homeTeam = $scope.timerData.match_winner;
									m.match_homeTeamObj.team_name = $scope.timerData.match_winner;
								}else{
									m.match_awayTeam = $scope.timerData.match_winner;
									m.match_awayTeamObj.team_name = $scope.timerData.match_winner;
								}
								console.log(m);
								// update next round match data
								MatchService.editMatchById(m.id,m).success(function(data) {
									console.log(data);
								}).error(function(data) {});
							})
						}).error(function(data) {});
					}else if($scope.matchData.match_fixture === 'quarter final'){
						var fixture = 'semi final';
						CompetitionService.getMatchByCompIdFixtureAndLastPair($scope.matchData.competition_id,fixture,$scope.matchData.match_pair).success(function(match) {
							match.forEach(function(m){
								console.log(m);
								if($scope.matchData.pair_status === 'home'){
									m.match_homeTeam = $scope.timerData.match_winner;
									m.match_homeTeamObj.team_name = $scope.timerData.match_winner;
								}else{
									m.match_awayTeam = $scope.timerData.match_winner;
									m.match_awayTeamObj.team_name = $scope.timerData.match_winner;
								}
								console.log(m);
								// update next round match data
								MatchService.editMatchById(m.id,m).success(function(data) {
									console.log(data);
								}).error(function(data) {});
							})
						}).error(function(data) {});
					}else if($scope.matchData.match_fixture === 'semi final'){
						var fixture = 'final';
						CompetitionService.getMatchByCompIdFixtureAndLastPair($scope.matchData.competition_id,fixture,$scope.matchData.match_pair).success(function(match) {
							match.forEach(function(m){
								console.log(m);
								if($scope.matchData.pair_status === 'home'){
									m.match_homeTeam = $scope.timerData.match_winner;
									m.match_homeTeamObj.team_name = $scope.timerData.match_winner;
								}else{
									m.match_awayTeam = $scope.timerData.match_winner;
									m.match_awayTeamObj.team_name = $scope.timerData.match_winner;
								}
								console.log(m);
								// update next round match data
								MatchService.editMatchById(m.id,m).success(function(data) {
									console.log(data);
								}).error(function(data) {});
							})
						}).error(function(data) {});
					}
				}).error(function(data) {});
		
				setTimeout(function(){

					// update team data
					TeamService.getTeamByName($scope.matchData.match_homeTeam).success(function(team){
						$scope.teamFormWin = {};
						$scope.teamFormWin.team_play = team.team_play + 1;
						$scope.teamFormWin.team_point = team.team_point + 3;
						$scope.teamFormWin.team_win = team.team_win + 1;
						if($scope.matchData.match_homeTeam === $scope.timerData.match_winner){
							$scope.teamFormWin.goalAgainst = team.team_goalAgainst + $scope.matchData.match_awayTeamObj.score;
							$scope.teamFormWin.goalFor = team.team_goalFor + $scope.matchData.match_homeTeamObj.score;
						}else{
							$scope.teamFormWin.goalAgainst = team.team_goalAgainst + $scope.matchData.match_homeTeamObj.score;	
							$scope.teamFormWin.goalFor = team.team_goalFor + $scope.matchData.match_awayTeamObj.score;
						}
						TeamService.editTeamById(team.id, $scope.teamFormWin).success(function(data) {
		            		console.log(data);
		                }).error(function(data) {});
					}).error(function(data) {
						$ionicLoading.hide();
					});

	                // update referee profile
	                LoginService.getUserByUsername($scope.matchData.match_referee).success(function(referee){
	                	$scope.refereeForm = {};
	                	$scope.refereeForm.matchManaged = referee.matchManaged + 1;
						LoginService.editUser(referee.id, localStorage.getItem("token"),$scope.refereeForm).success(function(data) {
                    		console.log(data);
                    	}).error(function(data) {});	
					}).error(function(data) {});

					// update analyst profile
	                LoginService.getUserByUsername($scope.matchData.match_analyst).success(function(analyst){
	                	$scope.analystForm = {};
	                	$scope.analystForm.matchManaged = analyst.matchManaged + 1;
						LoginService.editUser(analyst.id, localStorage.getItem("token"),$scope.analystForm).success(function(data) {
                    		console.log(data);
                    	}).error(function(data) {});	
					}).error(function(data) {});
				},1500);

				setTimeout(function(){
		
					// update team data
					TeamService.getTeamByName($scope.matchData.match_awayTeam).success(function(team){
						$scope.teamFormLose = {};
						$scope.teamFormLose.team_play = team.team_play + 1;
						$scope.teamFormLose.team_lose = team.team_lose + 1;
						if($scope.matchData.match_homeTeam === $scope.timerData.match_loser){
							$scope.teamFormLose.goalAgainst = team.team_goalAgainst + $scope.matchData.match_awayTeamObj.score;
							$scope.teamFormLose.goalFor = team.team_goalFor + $scope.matchData.match_homeTeamObj.score;
						}else{
							$scope.teamFormLose.goalAgainst = team.team_goalAgainst + $scope.matchData.match_homeTeamObj.score;	
							$scope.teamFormLose.goalFor = team.team_goalFor + $scope.matchData.match_awayTeamObj.score;
						}
						TeamService.editTeamById(team.id, $scope.teamFormLose).success(function(data) {
		            		console.log(data);
		                }).error(function(data) {});

					}).error(function(data) {
						$ionicLoading.hide();
					});
				
					// update match data
					MatchService.editMatchById($scope.matchData.id,$scope.timerData).success(function(data) {
						// setTimeout(function(){
							$ionicLoading.hide();
						// },1000);
						$state.go('app.match_detail', {
							'matchId': $scope.matchData.id
						});
					}).error(function(data) {});
				},2000);
			}

			if($scope.awayPenaltyScore <= ($scope.homePenaltyScore + $scope.homePenaltyLeft)){
				console.log("msh bisa");
			}else{
				console.log("tamat dah");
				$scope.penaltyStatus = '';

				$rootScope.showLoading();
				$scope.timerData.timer_status = "penalty shootout stopped";
				$scope.timerData.match_status = "finished";
				$scope.timerData.live_status = false;
				$scope.timerData.penalty = {};
				$scope.timerData.penalty.status = true;
				$scope.timerData.penalty.homeTeamScore = $scope.homePenaltyScore;
				$scope.timerData.penalty.awayTeamScore = $scope.awayPenaltyScore;

				if($scope.homePenaltyScore > $scope.awayPenaltyScore){
					$scope.timerData.match_winner = $scope.matchData.match_homeTeam;
					$scope.timerData.match_loser = $scope.matchData.match_awayTeam;
				}else{
					$scope.timerData.match_winner = $scope.matchData.match_awayTeam;
					$scope.timerData.match_loser = $scope.matchData.match_homeTeam;
				}

				clearInterval($scope.loadMatch);
				clearInterval($scope.loadTimer);
				clearInterval($scope.loadTeamPossession);
				$rootScope.showLoading($ionicLoading);

				// update next round match
				CompetitionService.getCompetitionById($scope.matchData.competition_id,localStorage.getItem("token")).success(function(comp) {
					console.log(comp);
					if($scope.matchData.match_fixture === 'play off'){
						console.log("play off");
						if(comp.comp_numOfTeam === 32){
							var fixture = 'round of 16';
							CompetitionService.getMatchByCompIdFixtureAndLastPair($scope.matchData.competition_id,fixture,$scope.matchData.match_pair).success(function(match) {
								match.forEach(function(m){
									console.log(m);
									if($scope.matchData.pair_status === 'home'){
										m.match_homeTeam = $scope.timerData.match_winner;
										m.match_homeTeamObj.team_name = $scope.timerData.match_winner;
									}else{
										m.match_awayTeam = $scope.timerData.match_winner;
										m.match_awayTeamObj.team_name = $scope.timerData.match_winner;
									}
									console.log(m);
									// update next round match data
									MatchService.editMatchById(m.id,m).success(function(data) {
										console.log(data);
									}).error(function(data) {});
								})
							}).error(function(data) {});
						}else if(comp.comp_numOfTeam === 16){
							var fixture = 'quarter final';
							CompetitionService.getMatchByCompIdFixtureAndLastPair($scope.matchData.competition_id,fixture,$scope.matchData.match_pair).success(function(match) {
								match.forEach(function(m){
									console.log(m);
									if($scope.matchData.pair_status === 'home'){
										m.match_homeTeam = $scope.timerData.match_winner;
										m.match_homeTeamObj.team_name = $scope.timerData.match_winner;
									}else{
										m.match_awayTeam = $scope.timerData.match_winner;
										m.match_awayTeamObj.team_name = $scope.timerData.match_winner;
									}
									console.log(m);
									// update next round match data
									MatchService.editMatchById(m.id,m).success(function(data) {
										console.log(data);
									}).error(function(data) {});
								})
							}).error(function(data) {});
						}else{
							var fixture = 'semi final';
							CompetitionService.getMatchByCompIdFixtureAndLastPair($scope.matchData.competition_id,fixture,$scope.matchData.match_pair).success(function(match) {
								match.forEach(function(m){
									console.log(m);
									if($scope.matchData.pair_status === 'home'){
										m.match_homeTeam = $scope.timerData.match_winner;
										m.match_homeTeamObj.team_name = $scope.timerData.match_winner;
									}else{
										m.match_awayTeam = $scope.timerData.match_winner;
										m.match_awayTeamObj.team_name = $scope.timerData.match_winner;
									}
									console.log(m);
									// update next round match data
									MatchService.editMatchById(m.id,m).success(function(data) {
										console.log(data);
									}).error(function(data) {});
								})
							}).error(function(data) {});
						}
					}else if($scope.matchData.match_fixture === 'round of 16'){
						var fixture = 'quarter final';
						CompetitionService.getMatchByCompIdFixtureAndLastPair($scope.matchData.competition_id,fixture,$scope.matchData.match_pair).success(function(match) {
							match.forEach(function(m){
								console.log(m);
								if($scope.matchData.pair_status === 'home'){
									m.match_homeTeam = $scope.timerData.match_winner;
									m.match_homeTeamObj.team_name = $scope.timerData.match_winner;
								}else{
									m.match_awayTeam = $scope.timerData.match_winner;
									m.match_awayTeamObj.team_name = $scope.timerData.match_winner;
								}
								console.log(m);
								// update next round match data
								MatchService.editMatchById(m.id,m).success(function(data) {
									console.log(data);
								}).error(function(data) {});
							})
						}).error(function(data) {});
					}else if($scope.matchData.match_fixture === 'quarter final'){
						var fixture = 'semi final';
						CompetitionService.getMatchByCompIdFixtureAndLastPair($scope.matchData.competition_id,fixture,$scope.matchData.match_pair).success(function(match) {
							match.forEach(function(m){
								console.log(m);
								if($scope.matchData.pair_status === 'home'){
									m.match_homeTeam = $scope.timerData.match_winner;
									m.match_homeTeamObj.team_name = $scope.timerData.match_winner;
								}else{
									m.match_awayTeam = $scope.timerData.match_winner;
									m.match_awayTeamObj.team_name = $scope.timerData.match_winner;
								}
								console.log(m);
								// update next round match data
								MatchService.editMatchById(m.id,m).success(function(data) {
									console.log(data);
								}).error(function(data) {});
							})
						}).error(function(data) {});
					}else if($scope.matchData.match_fixture === 'semi final'){
						var fixture = 'final';
						CompetitionService.getMatchByCompIdFixtureAndLastPair($scope.matchData.competition_id,fixture,$scope.matchData.match_pair).success(function(match) {
							match.forEach(function(m){
								console.log(m);
								if($scope.matchData.pair_status === 'home'){
									m.match_homeTeam = $scope.timerData.match_winner;
									m.match_homeTeamObj.team_name = $scope.timerData.match_winner;
								}else{
									m.match_awayTeam = $scope.timerData.match_winner;
									m.match_awayTeamObj.team_name = $scope.timerData.match_winner;
								}
								console.log(m);
								// update next round match data
								MatchService.editMatchById(m.id,m).success(function(data) {
									console.log(data);
								}).error(function(data) {});
							})
						}).error(function(data) {});
					}
				}).error(function(data) {});

				setTimeout(function(){

					// update team data
					TeamService.getTeamByName($scope.matchData.match_homeTeam).success(function(team){
						$scope.teamFormWin = {};
						$scope.teamFormWin.team_play = team.team_play + 1;
						$scope.teamFormWin.team_point = team.team_point + 3;
						$scope.teamFormWin.team_win = team.team_win + 1;
						if($scope.matchData.match_homeTeam === $scope.timerData.match_winner){
							$scope.teamFormWin.goalAgainst = team.team_goalAgainst + $scope.matchData.match_awayTeamObj.score;
							$scope.teamFormWin.goalFor = team.team_goalFor + $scope.matchData.match_homeTeamObj.score;
						}else{
							$scope.teamFormWin.goalAgainst = team.team_goalAgainst + $scope.matchData.match_homeTeamObj.score;	
							$scope.teamFormWin.goalFor = team.team_goalFor + $scope.matchData.match_awayTeamObj.score;
						}
						TeamService.editTeamById(team.id, $scope.teamFormWin).success(function(data) {
		            		console.log(data);
		                }).error(function(data) {});
					}).error(function(data) {
						$ionicLoading.hide();
					});

	                // update referee profile
	                LoginService.getUserByUsername($scope.matchData.match_referee).success(function(referee){
	                	$scope.refereeForm = {};
	                	$scope.refereeForm.matchManaged = referee.matchManaged + 1;
						LoginService.editUser(referee.id, localStorage.getItem("token"),$scope.refereeForm).success(function(data) {
                    		console.log(data);
                    	}).error(function(data) {});	
					}).error(function(data) {});

					// update analyst profile
	                LoginService.getUserByUsername($scope.matchData.match_analyst).success(function(analyst){
	                	$scope.analystForm = {};
	                	$scope.analystForm.matchManaged = analyst.matchManaged + 1;
						LoginService.editUser(analyst.id, localStorage.getItem("token"),$scope.analystForm).success(function(data) {
                    		console.log(data);
                    	}).error(function(data) {});	
					}).error(function(data) {});
				},1500);

				setTimeout(function(){
		
					// update team data
					TeamService.getTeamByName($scope.matchData.match_awayTeam).success(function(team){
						$scope.teamFormLose = {};
						$scope.teamFormLose.team_play = team.team_play + 1;
						$scope.teamFormLose.team_lose = team.team_lose + 1;
						if($scope.matchData.match_homeTeam === $scope.timerData.match_loser){
							$scope.teamFormLose.goalAgainst = team.team_goalAgainst + $scope.matchData.match_awayTeamObj.score;
							$scope.teamFormLose.goalFor = team.team_goalFor + $scope.matchData.match_homeTeamObj.score;
						}else{
							$scope.teamFormLose.goalAgainst = team.team_goalAgainst + $scope.matchData.match_homeTeamObj.score;	
							$scope.teamFormLose.goalFor = team.team_goalFor + $scope.matchData.match_awayTeamObj.score;
						}
						TeamService.editTeamById(team.id, $scope.teamFormLose).success(function(data) {
		            		console.log(data);
		                }).error(function(data) {});

					}).error(function(data) {
						$ionicLoading.hide();
					});
				
					// update match data
					MatchService.editMatchById($scope.matchData.id,$scope.timerData).success(function(data) {
						// setTimeout(function(){
							$ionicLoading.hide();
						// },1000);
						$state.go('app.match_detail', {
							'matchId': $scope.matchData.id
						});
					}).error(function(data) {});
				},2000);

			}
		}else if($scope.penaltyShootOut > 5){
			// $scope.penaltyShootOut = $scope.penaltyShootOut + 1;
		}
	}

	// Home Penalty Miss
	$scope.homePenaltyMiss = function(){
		$scope.awayPenalty = $scope.awayPenalty + 1;
		$scope.homePenaltyLeft = $scope.homePenaltyLeft - 1;
		$scope.penaltyStatus = 'away';

		if($scope.homePenalty == 1){
			$scope.homePenalty1 = 'miss';
		}else if($scope.homePenalty == 2){
			$scope.homePenalty2 = 'miss';
		}else if($scope.homePenalty == 3){
			$scope.homePenalty3 = 'miss';
		}else if($scope.homePenalty == 4){
			$scope.homePenalty4 = 'miss';
		}else if($scope.homePenalty == 5){
			$scope.homePenalty5 = 'miss';
		}

		if($scope.penaltyShootOut <= 5){
			$scope.home
			if($scope.awayPenaltyScore <= ($scope.homePenaltyScore + $scope.homePenaltyLeft)){
				console.log("msh bisa");
			}else{
			console.log("tamat dah");
				$scope.penaltyStatus = '';

				$rootScope.showLoading();
				$scope.timerData.timer_status = "penalty shootout stopped";
				$scope.timerData.match_status = "finished";
				$scope.timerData.live_status = false;
				$scope.timerData.penalty = {};
				$scope.timerData.penalty.status = true;
				$scope.timerData.penalty.homeTeamScore = $scope.homePenaltyScore;
				$scope.timerData.penalty.awayTeamScore = $scope.awayPenaltyScore;

				if($scope.homePenaltyScore > $scope.awayPenaltyScore){
					$scope.timerData.match_winner = $scope.matchData.match_homeTeam;
					$scope.timerData.match_loser = $scope.matchData.match_awayTeam;
				}else{
					$scope.timerData.match_winner = $scope.matchData.match_awayTeam;
					$scope.timerData.match_loser = $scope.matchData.match_homeTeam;
				}

				clearInterval($scope.loadMatch);
				clearInterval($scope.loadTimer);
				clearInterval($scope.loadTeamPossession);
				$rootScope.showLoading($ionicLoading);

				// update next round match
				CompetitionService.getCompetitionById($scope.matchData.competition_id,localStorage.getItem("token")).success(function(comp) {
					console.log(comp);
					if($scope.matchData.match_fixture === 'play off'){
						console.log("play off");
						if(comp.comp_numOfTeam === 32){
							var fixture = 'round of 16';
							CompetitionService.getMatchByCompIdFixtureAndLastPair($scope.matchData.competition_id,fixture,$scope.matchData.match_pair).success(function(match) {
								match.forEach(function(m){
									console.log(m);
									if($scope.matchData.pair_status === 'home'){
										m.match_homeTeam = $scope.timerData.match_winner;
										m.match_homeTeamObj.team_name = $scope.timerData.match_winner;
									}else{
										m.match_awayTeam = $scope.timerData.match_winner;
										m.match_awayTeamObj.team_name = $scope.timerData.match_winner;
									}
									console.log(m);
									// update next round match data
									MatchService.editMatchById(m.id,m).success(function(data) {
										console.log(data);
									}).error(function(data) {});
								})
							}).error(function(data) {});
						}else if(comp.comp_numOfTeam === 16){
							var fixture = 'quarter final';
							CompetitionService.getMatchByCompIdFixtureAndLastPair($scope.matchData.competition_id,fixture,$scope.matchData.match_pair).success(function(match) {
								match.forEach(function(m){
									console.log(m);
									if($scope.matchData.pair_status === 'home'){
										m.match_homeTeam = $scope.timerData.match_winner;
										m.match_homeTeamObj.team_name = $scope.timerData.match_winner;
									}else{
										m.match_awayTeam = $scope.timerData.match_winner;
										m.match_awayTeamObj.team_name = $scope.timerData.match_winner;
									}
									console.log(m);
									// update next round match data
									MatchService.editMatchById(m.id,m).success(function(data) {
										console.log(data);
									}).error(function(data) {});
								})
							}).error(function(data) {});
						}else{
							var fixture = 'semi final';
							CompetitionService.getMatchByCompIdFixtureAndLastPair($scope.matchData.competition_id,fixture,$scope.matchData.match_pair).success(function(match) {
								match.forEach(function(m){
									console.log(m);
									if($scope.matchData.pair_status === 'home'){
										m.match_homeTeam = $scope.timerData.match_winner;
										m.match_homeTeamObj.team_name = $scope.timerData.match_winner;
									}else{
										m.match_awayTeam = $scope.timerData.match_winner;
										m.match_awayTeamObj.team_name = $scope.timerData.match_winner;
									}
									console.log(m);
									// update next round match data
									MatchService.editMatchById(m.id,m).success(function(data) {
										console.log(data);
									}).error(function(data) {});
								})
							}).error(function(data) {});
						}
					}else if($scope.matchData.match_fixture === 'round of 16'){
						var fixture = 'quarter final';
						CompetitionService.getMatchByCompIdFixtureAndLastPair($scope.matchData.competition_id,fixture,$scope.matchData.match_pair).success(function(match) {
							match.forEach(function(m){
								console.log(m);
								if($scope.matchData.pair_status === 'home'){
									m.match_homeTeam = $scope.timerData.match_winner;
									m.match_homeTeamObj.team_name = $scope.timerData.match_winner;
								}else{
									m.match_awayTeam = $scope.timerData.match_winner;
									m.match_awayTeamObj.team_name = $scope.timerData.match_winner;
								}
								console.log(m);
								// update next round match data
								MatchService.editMatchById(m.id,m).success(function(data) {
									console.log(data);
								}).error(function(data) {});
							})
						}).error(function(data) {});
					}else if($scope.matchData.match_fixture === 'quarter final'){
						var fixture = 'semi final';
						CompetitionService.getMatchByCompIdFixtureAndLastPair($scope.matchData.competition_id,fixture,$scope.matchData.match_pair).success(function(match) {
							match.forEach(function(m){
								console.log(m);
								if($scope.matchData.pair_status === 'home'){
									m.match_homeTeam = $scope.timerData.match_winner;
									m.match_homeTeamObj.team_name = $scope.timerData.match_winner;
								}else{
									m.match_awayTeam = $scope.timerData.match_winner;
									m.match_awayTeamObj.team_name = $scope.timerData.match_winner;
								}
								console.log(m);
								// update next round match data
								MatchService.editMatchById(m.id,m).success(function(data) {
									console.log(data);
								}).error(function(data) {});
							})
						}).error(function(data) {});
					}else if($scope.matchData.match_fixture === 'semi final'){
						var fixture = 'final';
						CompetitionService.getMatchByCompIdFixtureAndLastPair($scope.matchData.competition_id,fixture,$scope.matchData.match_pair).success(function(match) {
							match.forEach(function(m){
								console.log(m);
								if($scope.matchData.pair_status === 'home'){
									m.match_homeTeam = $scope.timerData.match_winner;
									m.match_homeTeamObj.team_name = $scope.timerData.match_winner;
								}else{
									m.match_awayTeam = $scope.timerData.match_winner;
									m.match_awayTeamObj.team_name = $scope.timerData.match_winner;
								}
								console.log(m);
								// update next round match data
								MatchService.editMatchById(m.id,m).success(function(data) {
									console.log(data);
								}).error(function(data) {});
							})
						}).error(function(data) {});
					}
				}).error(function(data) {});

				setTimeout(function(){

					// update team data
					TeamService.getTeamByName($scope.matchData.match_homeTeam).success(function(team){
						$scope.teamFormWin = {};
						$scope.teamFormWin.team_play = team.team_play + 1;
						$scope.teamFormWin.team_point = team.team_point + 3;
						$scope.teamFormWin.team_win = team.team_win + 1;
						if($scope.matchData.match_homeTeam === $scope.timerData.match_winner){
							$scope.teamFormWin.goalAgainst = team.team_goalAgainst + $scope.matchData.match_awayTeamObj.score;
							$scope.teamFormWin.goalFor = team.team_goalFor + $scope.matchData.match_homeTeamObj.score;
						}else{
							$scope.teamFormWin.goalAgainst = team.team_goalAgainst + $scope.matchData.match_homeTeamObj.score;	
							$scope.teamFormWin.goalFor = team.team_goalFor + $scope.matchData.match_awayTeamObj.score;
						}
						TeamService.editTeamById(team.id, $scope.teamFormWin).success(function(data) {
		            		console.log(data);
		                }).error(function(data) {});
					}).error(function(data) {
						$ionicLoading.hide();
					});

	                // update referee profile
	                LoginService.getUserByUsername($scope.matchData.match_referee).success(function(referee){
	                	$scope.refereeForm = {};
	                	$scope.refereeForm.matchManaged = referee.matchManaged + 1;
						LoginService.editUser(referee.id, localStorage.getItem("token"),$scope.refereeForm).success(function(data) {
                    		console.log(data);
                    	}).error(function(data) {});	
					}).error(function(data) {});

					// update analyst profile
	                LoginService.getUserByUsername($scope.matchData.match_analyst).success(function(analyst){
	                	$scope.analystForm = {};
	                	$scope.analystForm.matchManaged = analyst.matchManaged + 1;
						LoginService.editUser(analyst.id, localStorage.getItem("token"),$scope.analystForm).success(function(data) {
                    		console.log(data);
                    	}).error(function(data) {});	
					}).error(function(data) {});
				},1500);

				setTimeout(function(){
			
					// update team data
					TeamService.getTeamByName($scope.matchData.match_awayTeam).success(function(team){
						$scope.teamFormLose = {};
						$scope.teamFormLose.team_play = team.team_play + 1;
						$scope.teamFormLose.team_lose = team.team_lose + 1;
						if($scope.matchData.match_homeTeam === $scope.timerData.match_loser){
							$scope.teamFormLose.goalAgainst = team.team_goalAgainst + $scope.matchData.match_awayTeamObj.score;
							$scope.teamFormLose.goalFor = team.team_goalFor + $scope.matchData.match_homeTeamObj.score;
						}else{
							$scope.teamFormLose.goalAgainst = team.team_goalAgainst + $scope.matchData.match_homeTeamObj.score;	
							$scope.teamFormLose.goalFor = team.team_goalFor + $scope.matchData.match_awayTeamObj.score;
						}
						TeamService.editTeamById(team.id, $scope.teamFormLose).success(function(data) {
		            		console.log(data);
		                }).error(function(data) {});

					}).error(function(data) {
						$ionicLoading.hide();
					});
				
					// update match data
					MatchService.editMatchById($scope.matchData.id,$scope.timerData).success(function(data) {
						// setTimeout(function(){
							$ionicLoading.hide();
						// },1000);
						$state.go('app.match_detail', {
							'matchId': $scope.matchData.id
						});
					}).error(function(data) {});
				},2000);
			}
		}else if($scope.penaltyShootOut > 5){
			// $scope.penaltyShootOut = $scope.penaltyShootOut + 1;
		}
	}

	// Away Penalty Goal
	$scope.awayPenaltyGoal = function(){
		$scope.homePenalty = $scope.homePenalty + 1;
		$scope.awayPenaltyScore = $scope.awayPenaltyScore + 1;
		$scope.awayPenaltyLeft = $scope.awayPenaltyLeft - 1;
		$scope.penaltyStatus = 'home';

		if($scope.awayPenalty == 1){
			$scope.awayPenalty1 = 'goal';
		}else if($scope.awayPenalty == 2){
			$scope.awayPenalty2 = 'goal';
		}else if($scope.awayPenalty == 3){
			$scope.awayPenalty3 = 'goal';
		}else if($scope.awayPenalty == 4){
			$scope.awayPenalty4 = 'goal';
		}else if($scope.awayPenalty == 5){
			$scope.awayPenalty5 = 'goal';
		}

		console.log($scope.homePenaltyScore);
		console.log($scope.awayPenaltyScore);
		console.log($scope.homePenaltyLeft);
		console.log($scope.awayPenaltyLeft);		

		if($scope.penaltyShootOut <= 5){
			if($scope.homePenaltyLeft != 0){
				if($scope.homePenaltyScore <= ($scope.awayPenaltyScore + $scope.awayPenaltyLeft)){
					console.log("msh bisa");
					$scope.penaltyShootOut = $scope.penaltyShootOut + 1;
				}else{
				console.log("tamat dah");
				$scope.penaltyStatus = '';

				$rootScope.showLoading();
				$scope.timerData.timer_status = "penalty shootout stopped";
				$scope.timerData.match_status = "finished";
				$scope.timerData.live_status = false;
				$scope.timerData.penalty = {};
				$scope.timerData.penalty.status = true;
				$scope.timerData.penalty.homeTeamScore = $scope.homePenaltyScore;
				$scope.timerData.penalty.awayTeamScore = $scope.awayPenaltyScore;

				if($scope.homePenaltyScore > $scope.awayPenaltyScore){
					$scope.timerData.match_winner = $scope.matchData.match_homeTeam;
					$scope.timerData.match_loser = $scope.matchData.match_awayTeam;
				}else{
					$scope.timerData.match_winner = $scope.matchData.match_awayTeam;
					$scope.timerData.match_loser = $scope.matchData.match_homeTeam;
				}

				clearInterval($scope.loadMatch);
				clearInterval($scope.loadTimer);
				clearInterval($scope.loadTeamPossession);
				$rootScope.showLoading($ionicLoading);

				// update next round match
				CompetitionService.getCompetitionById($scope.matchData.competition_id,localStorage.getItem("token")).success(function(comp) {
					console.log(comp);
					if($scope.matchData.match_fixture === 'play off'){
						console.log("play off");
						if(comp.comp_numOfTeam === 32){
							var fixture = 'round of 16';
							CompetitionService.getMatchByCompIdFixtureAndLastPair($scope.matchData.competition_id,fixture,$scope.matchData.match_pair).success(function(match) {
								match.forEach(function(m){
									console.log(m);
									if($scope.matchData.pair_status === 'home'){
										m.match_homeTeam = $scope.timerData.match_winner;
										m.match_homeTeamObj.team_name = $scope.timerData.match_winner;
									}else{
										m.match_awayTeam = $scope.timerData.match_winner;
										m.match_awayTeamObj.team_name = $scope.timerData.match_winner;
									}
									console.log(m);
									// update next round match data
									MatchService.editMatchById(m.id,m).success(function(data) {
										console.log(data);
									}).error(function(data) {});
								})
							}).error(function(data) {});
						}else if(comp.comp_numOfTeam === 16){
							var fixture = 'quarter final';
							CompetitionService.getMatchByCompIdFixtureAndLastPair($scope.matchData.competition_id,fixture,$scope.matchData.match_pair).success(function(match) {
								match.forEach(function(m){
									console.log(m);
									if($scope.matchData.pair_status === 'home'){
										m.match_homeTeam = $scope.timerData.match_winner;
										m.match_homeTeamObj.team_name = $scope.timerData.match_winner;
									}else{
										m.match_awayTeam = $scope.timerData.match_winner;
										m.match_awayTeamObj.team_name = $scope.timerData.match_winner;
									}
									console.log(m);
									// update next round match data
									MatchService.editMatchById(m.id,m).success(function(data) {
										console.log(data);
									}).error(function(data) {});
								})
							}).error(function(data) {});
						}else{
							var fixture = 'semi final';
							CompetitionService.getMatchByCompIdFixtureAndLastPair($scope.matchData.competition_id,fixture,$scope.matchData.match_pair).success(function(match) {
								match.forEach(function(m){
									console.log(m);
									if($scope.matchData.pair_status === 'home'){
										m.match_homeTeam = $scope.timerData.match_winner;
										m.match_homeTeamObj.team_name = $scope.timerData.match_winner;
									}else{
										m.match_awayTeam = $scope.timerData.match_winner;
										m.match_awayTeamObj.team_name = $scope.timerData.match_winner;
									}
									console.log(m);
									// update next round match data
									MatchService.editMatchById(m.id,m).success(function(data) {
										console.log(data);
									}).error(function(data) {});
								})
							}).error(function(data) {});
						}
					}else if($scope.matchData.match_fixture === 'round of 16'){
						var fixture = 'quarter final';
						CompetitionService.getMatchByCompIdFixtureAndLastPair($scope.matchData.competition_id,fixture,$scope.matchData.match_pair).success(function(match) {
							match.forEach(function(m){
								console.log(m);
								if($scope.matchData.pair_status === 'home'){
									m.match_homeTeam = $scope.timerData.match_winner;
									m.match_homeTeamObj.team_name = $scope.timerData.match_winner;
								}else{
									m.match_awayTeam = $scope.timerData.match_winner;
									m.match_awayTeamObj.team_name = $scope.timerData.match_winner;
								}
								console.log(m);
								// update next round match data
								MatchService.editMatchById(m.id,m).success(function(data) {
									console.log(data);
								}).error(function(data) {});
							})
						}).error(function(data) {});
					}else if($scope.matchData.match_fixture === 'quarter final'){
						var fixture = 'semi final';
						CompetitionService.getMatchByCompIdFixtureAndLastPair($scope.matchData.competition_id,fixture,$scope.matchData.match_pair).success(function(match) {
							match.forEach(function(m){
								console.log(m);
								if($scope.matchData.pair_status === 'home'){
									m.match_homeTeam = $scope.timerData.match_winner;
									m.match_homeTeamObj.team_name = $scope.timerData.match_winner;
								}else{
									m.match_awayTeam = $scope.timerData.match_winner;
									m.match_awayTeamObj.team_name = $scope.timerData.match_winner;
								}
								console.log(m);
								// update next round match data
								MatchService.editMatchById(m.id,m).success(function(data) {
									console.log(data);
								}).error(function(data) {});
							})
						}).error(function(data) {});
					}else if($scope.matchData.match_fixture === 'semi final'){
						var fixture = 'final';
						CompetitionService.getMatchByCompIdFixtureAndLastPair($scope.matchData.competition_id,fixture,$scope.matchData.match_pair).success(function(match) {
							match.forEach(function(m){
								console.log(m);
								if($scope.matchData.pair_status === 'home'){
									m.match_homeTeam = $scope.timerData.match_winner;
									m.match_homeTeamObj.team_name = $scope.timerData.match_winner;
								}else{
									m.match_awayTeam = $scope.timerData.match_winner;
									m.match_awayTeamObj.team_name = $scope.timerData.match_winner;
								}
								console.log(m);
								// update next round match data
								MatchService.editMatchById(m.id,m).success(function(data) {
									console.log(data);
								}).error(function(data) {});
							})
						}).error(function(data) {});
					}
				}).error(function(data) {});

				setTimeout(function(){

					// update team data
					TeamService.getTeamByName($scope.matchData.match_homeTeam).success(function(team){
						$scope.teamFormWin = {};
						$scope.teamFormWin.team_play = team.team_play + 1;
						$scope.teamFormWin.team_point = team.team_point + 3;
						$scope.teamFormWin.team_win = team.team_win + 1;
						if($scope.matchData.match_homeTeam === $scope.timerData.match_winner){
							$scope.teamFormWin.goalAgainst = team.team_goalAgainst + $scope.matchData.match_awayTeamObj.score;
							$scope.teamFormWin.goalFor = team.team_goalFor + $scope.matchData.match_homeTeamObj.score;
						}else{
							$scope.teamFormWin.goalAgainst = team.team_goalAgainst + $scope.matchData.match_homeTeamObj.score;	
							$scope.teamFormWin.goalFor = team.team_goalFor + $scope.matchData.match_awayTeamObj.score;
						}
						TeamService.editTeamById(team.id, $scope.teamFormWin).success(function(data) {
		            		console.log(data);
		                }).error(function(data) {});
					}).error(function(data) {
						$ionicLoading.hide();
					});

	                // update referee profile
	                LoginService.getUserByUsername($scope.matchData.match_referee).success(function(referee){
	                	$scope.refereeForm = {};
	                	$scope.refereeForm.matchManaged = referee.matchManaged + 1;
						LoginService.editUser(referee.id, localStorage.getItem("token"),$scope.refereeForm).success(function(data) {
                    		console.log(data);
                    	}).error(function(data) {});	
					}).error(function(data) {});

					// update analyst profile
	                LoginService.getUserByUsername($scope.matchData.match_analyst).success(function(analyst){
	                	$scope.analystForm = {};
	                	$scope.analystForm.matchManaged = analyst.matchManaged + 1;
						LoginService.editUser(analyst.id, localStorage.getItem("token"),$scope.analystForm).success(function(data) {
                    		console.log(data);
                    	}).error(function(data) {});	
					}).error(function(data) {});
				},1500);

				setTimeout(function(){

					// update team data
					TeamService.getTeamByName($scope.matchData.match_awayTeam).success(function(team){
						$scope.teamFormLose = {};
						$scope.teamFormLose.team_play = team.team_play + 1;
						$scope.teamFormLose.team_lose = team.team_lose + 1;
						if($scope.matchData.match_homeTeam === $scope.timerData.match_loser){
							$scope.teamFormLose.goalAgainst = team.team_goalAgainst + $scope.matchData.match_awayTeamObj.score;
							$scope.teamFormLose.goalFor = team.team_goalFor + $scope.matchData.match_homeTeamObj.score;
						}else{
							$scope.teamFormLose.goalAgainst = team.team_goalAgainst + $scope.matchData.match_homeTeamObj.score;	
							$scope.teamFormLose.goalFor = team.team_goalFor + $scope.matchData.match_awayTeamObj.score;
						}
						TeamService.editTeamById(team.id, $scope.teamFormLose).success(function(data) {
		            		console.log(data);
		                }).error(function(data) {});

					}).error(function(data) {
						$ionicLoading.hide();
					});
				
					// update match data
					MatchService.editMatchById($scope.matchData.id,$scope.timerData).success(function(data) {
						// setTimeout(function(){
							$ionicLoading.hide();
						// },1000);
						$state.go('app.match_detail', {
							'matchId': $scope.matchData.id
						});
					}).error(function(data) {});
				},2000);	
				}
			}

			if($scope.awayPenaltyScore <= ($scope.homePenaltyScore + $scope.homePenaltyLeft)){
				console.log("msh bisa");
				// $scope.penaltyShootOut = $scope.penaltyShootOut + 1;
			}else{
				console.log("tamat dah");
				$scope.penaltyStatus = '';

				$rootScope.showLoading();
				$scope.timerData.timer_status = "penalty shootout stopped";
				$scope.timerData.match_status = "finished";
				$scope.timerData.live_status = false;
				$scope.timerData.penalty = {};
				$scope.timerData.penalty.status = true;
				$scope.timerData.penalty.homeTeamScore = $scope.homePenaltyScore;
				$scope.timerData.penalty.awayTeamScore = $scope.awayPenaltyScore;

				if($scope.homePenaltyScore > $scope.awayPenaltyScore){
					$scope.timerData.match_winner = $scope.matchData.match_homeTeam;
					$scope.timerData.match_loser = $scope.matchData.match_awayTeam;
				}else{
					$scope.timerData.match_winner = $scope.matchData.match_awayTeam;
					$scope.timerData.match_loser = $scope.matchData.match_homeTeam;
				}

				clearInterval($scope.loadMatch);
				clearInterval($scope.loadTimer);
				clearInterval($scope.loadTeamPossession);
				$rootScope.showLoading($ionicLoading);

				// update next round match
				CompetitionService.getCompetitionById($scope.matchData.competition_id,localStorage.getItem("token")).success(function(comp) {
					console.log(comp);
					if($scope.matchData.match_fixture === 'play off'){
						console.log("play off");
						if(comp.comp_numOfTeam === 32){
							var fixture = 'round of 16';
							CompetitionService.getMatchByCompIdFixtureAndLastPair($scope.matchData.competition_id,fixture,$scope.matchData.match_pair).success(function(match) {
								match.forEach(function(m){
									console.log(m);
									if($scope.matchData.pair_status === 'home'){
										m.match_homeTeam = $scope.timerData.match_winner;
										m.match_homeTeamObj.team_name = $scope.timerData.match_winner;
									}else{
										m.match_awayTeam = $scope.timerData.match_winner;
										m.match_awayTeamObj.team_name = $scope.timerData.match_winner;
									}
									console.log(m);
									// update next round match data
									MatchService.editMatchById(m.id,m).success(function(data) {
										console.log(data);
									}).error(function(data) {});
								})
							}).error(function(data) {});
						}else if(comp.comp_numOfTeam === 16){
							var fixture = 'quarter final';
							CompetitionService.getMatchByCompIdFixtureAndLastPair($scope.matchData.competition_id,fixture,$scope.matchData.match_pair).success(function(match) {
								match.forEach(function(m){
									console.log(m);
									if($scope.matchData.pair_status === 'home'){
										m.match_homeTeam = $scope.timerData.match_winner;
										m.match_homeTeamObj.team_name = $scope.timerData.match_winner;
									}else{
										m.match_awayTeam = $scope.timerData.match_winner;
										m.match_awayTeamObj.team_name = $scope.timerData.match_winner;
									}
									console.log(m);
									// update next round match data
									MatchService.editMatchById(m.id,m).success(function(data) {
										console.log(data);
									}).error(function(data) {});
								})
							}).error(function(data) {});
						}else{
							var fixture = 'semi final';
							CompetitionService.getMatchByCompIdFixtureAndLastPair($scope.matchData.competition_id,fixture,$scope.matchData.match_pair).success(function(match) {
								match.forEach(function(m){
									console.log(m);
									if($scope.matchData.pair_status === 'home'){
										m.match_homeTeam = $scope.timerData.match_winner;
										m.match_homeTeamObj.team_name = $scope.timerData.match_winner;
									}else{
										m.match_awayTeam = $scope.timerData.match_winner;
										m.match_awayTeamObj.team_name = $scope.timerData.match_winner;
									}
									console.log(m);
									// update next round match data
									MatchService.editMatchById(m.id,m).success(function(data) {
										console.log(data);
									}).error(function(data) {});
								})
							}).error(function(data) {});
						}
					}else if($scope.matchData.match_fixture === 'round of 16'){
						var fixture = 'quarter final';
						CompetitionService.getMatchByCompIdFixtureAndLastPair($scope.matchData.competition_id,fixture,$scope.matchData.match_pair).success(function(match) {
							match.forEach(function(m){
								console.log(m);
								if($scope.matchData.pair_status === 'home'){
									m.match_homeTeam = $scope.timerData.match_winner;
									m.match_homeTeamObj.team_name = $scope.timerData.match_winner;
								}else{
									m.match_awayTeam = $scope.timerData.match_winner;
									m.match_awayTeamObj.team_name = $scope.timerData.match_winner;
								}
								console.log(m);
								// update next round match data
								MatchService.editMatchById(m.id,m).success(function(data) {
									console.log(data);
								}).error(function(data) {});
							})
						}).error(function(data) {});
					}else if($scope.matchData.match_fixture === 'quarter final'){
						var fixture = 'semi final';
						CompetitionService.getMatchByCompIdFixtureAndLastPair($scope.matchData.competition_id,fixture,$scope.matchData.match_pair).success(function(match) {
							match.forEach(function(m){
								console.log(m);
								if($scope.matchData.pair_status === 'home'){
									m.match_homeTeam = $scope.timerData.match_winner;
									m.match_homeTeamObj.team_name = $scope.timerData.match_winner;
								}else{
									m.match_awayTeam = $scope.timerData.match_winner;
									m.match_awayTeamObj.team_name = $scope.timerData.match_winner;
								}
								console.log(m);
								// update next round match data
								MatchService.editMatchById(m.id,m).success(function(data) {
									console.log(data);
								}).error(function(data) {});
							})
						}).error(function(data) {});
					}else if($scope.matchData.match_fixture === 'semi final'){
						var fixture = 'final';
						CompetitionService.getMatchByCompIdFixtureAndLastPair($scope.matchData.competition_id,fixture,$scope.matchData.match_pair).success(function(match) {
							match.forEach(function(m){
								console.log(m);
								if($scope.matchData.pair_status === 'home'){
									m.match_homeTeam = $scope.timerData.match_winner;
									m.match_homeTeamObj.team_name = $scope.timerData.match_winner;
								}else{
									m.match_awayTeam = $scope.timerData.match_winner;
									m.match_awayTeamObj.team_name = $scope.timerData.match_winner;
								}
								console.log(m);
								// update next round match data
								MatchService.editMatchById(m.id,m).success(function(data) {
									console.log(data);
								}).error(function(data) {});
							})
						}).error(function(data) {});
					}
				}).error(function(data) {});
		
				setTimeout(function(){

					// update team data
					TeamService.getTeamByName($scope.matchData.match_homeTeam).success(function(team){
						$scope.teamFormWin = {};
						$scope.teamFormWin.team_play = team.team_play + 1;
						$scope.teamFormWin.team_point = team.team_point + 3;
						$scope.teamFormWin.team_win = team.team_win + 1;
						if($scope.matchData.match_homeTeam === $scope.timerData.match_winner){
							$scope.teamFormWin.goalAgainst = team.team_goalAgainst + $scope.matchData.match_awayTeamObj.score;
							$scope.teamFormWin.goalFor = team.team_goalFor + $scope.matchData.match_homeTeamObj.score;
						}else{
							$scope.teamFormWin.goalAgainst = team.team_goalAgainst + $scope.matchData.match_homeTeamObj.score;	
							$scope.teamFormWin.goalFor = team.team_goalFor + $scope.matchData.match_awayTeamObj.score;
						}
						TeamService.editTeamById(team.id, $scope.teamFormWin).success(function(data) {
		            		console.log(data);
		                }).error(function(data) {});
					}).error(function(data) {
						$ionicLoading.hide();
					});

	                // update referee profile
	                LoginService.getUserByUsername($scope.matchData.match_referee).success(function(referee){
	                	$scope.refereeForm = {};
	                	$scope.refereeForm.matchManaged = referee.matchManaged + 1;
						LoginService.editUser(referee.id, localStorage.getItem("token"),$scope.refereeForm).success(function(data) {
                    		console.log(data);
                    	}).error(function(data) {});	
					}).error(function(data) {});

					// update analyst profile
	                LoginService.getUserByUsername($scope.matchData.match_analyst).success(function(analyst){
	                	$scope.analystForm = {};
	                	$scope.analystForm.matchManaged = analyst.matchManaged + 1;
						LoginService.editUser(analyst.id, localStorage.getItem("token"),$scope.analystForm).success(function(data) {
                    		console.log(data);
                    	}).error(function(data) {});	
					}).error(function(data) {});
				},1500);

				setTimeout(function(){
				
					// update team data
					TeamService.getTeamByName($scope.matchData.match_awayTeam).success(function(team){
						$scope.teamFormLose = {};
						$scope.teamFormLose.team_play = team.team_play + 1;
						$scope.teamFormLose.team_lose = team.team_lose + 1;
						if($scope.matchData.match_homeTeam === $scope.timerData.match_loser){
							$scope.teamFormLose.goalAgainst = team.team_goalAgainst + $scope.matchData.match_awayTeamObj.score;
							$scope.teamFormLose.goalFor = team.team_goalFor + $scope.matchData.match_homeTeamObj.score;
						}else{
							$scope.teamFormLose.goalAgainst = team.team_goalAgainst + $scope.matchData.match_homeTeamObj.score;	
							$scope.teamFormLose.goalFor = team.team_goalFor + $scope.matchData.match_awayTeamObj.score;
						}
						TeamService.editTeamById(team.id, $scope.teamFormLose).success(function(data) {
		            		console.log(data);
		                }).error(function(data) {});

					}).error(function(data) {
						$ionicLoading.hide();
					});
				
					// update match data
					MatchService.editMatchById($scope.matchData.id,$scope.timerData).success(function(data) {
						// setTimeout(function(){
							$ionicLoading.hide();
						// },1000);
						$state.go('app.match_detail', {
							'matchId': $scope.matchData.id
						});
					}).error(function(data) {});
				},2000);
			}
			

			if($scope.homePenaltyLeft == 0){
				if($scope.awayPenaltyScore > $scope.homePenaltyScore){
					$scope.penaltyStatus = '';
				}else if($scope.awayPenaltyScore = $scope.homePenaltyScore){
					$scope.penaltyShootOut = $scope.penaltyShootOut + 1;
				}
			}
		}else if($scope.penaltyShootOut > 5){
			$scope.penaltyShootOut = $scope.penaltyShootOut + 1;
		}


		if($scope.penStatus == true){
			if($scope.homePenaltyScore != $scope.awayPenaltyScore){
				console.log("not same");
				$scope.penaltyStatus = '';
			}
		}
		if($scope.awayPenalty % 5 == 0){
			console.log("yeah");
			if($scope.homePenaltyScore == $scope.awayPenaltyScore){
				console.log("same");
				$scope.homePenalty = 1;
				$scope.awayPenalty = 0;
				$scope.homePenalty1 = '';
				$scope.homePenalty2 = '';
				$scope.homePenalty3 = '';
				$scope.homePenalty4 = '';
				$scope.homePenalty5 = '';
				$scope.awayPenalty1 = '';
				$scope.awayPenalty2 = '';
				$scope.awayPenalty3 = '';
				$scope.awayPenalty4 = '';
				$scope.awayPenalty5 = '';
				$scope.penStatus = true;
			}
		}
	}

	// Away Penalty Miss
	$scope.awayPenaltyMiss = function(){
		$scope.homePenalty = $scope.homePenalty + 1;
		$scope.awayPenaltyLeft = $scope.awayPenaltyLeft - 1;
		$scope.penaltyStatus = 'home';

		if($scope.awayPenalty == 1){
			$scope.awayPenalty1 = 'miss';
		}else if($scope.awayPenalty == 2){
			$scope.awayPenalty2 = 'miss';
		}else if($scope.awayPenalty == 3){
			$scope.awayPenalty3 = 'miss';
		}else if($scope.awayPenalty == 4){
			$scope.awayPenalty4 = 'miss';
		}else if($scope.awayPenalty == 5){
			$scope.awayPenalty5 = 'miss';
		}

		console.log($scope.homePenaltyScore);
		console.log($scope.awayPenaltyScore);

		if($scope.penaltyShootOut <= 5){
			if($scope.homePenaltyScore <= ($scope.awayPenaltyScore + $scope.awayPenaltyLeft)){
				console.log("msh bisa");
				$scope.penaltyShootOut = $scope.penaltyShootOut + 1;
			}else{
				console.log("tamat dah");
				$scope.penaltyStatus = '';

				$rootScope.showLoading();
				$scope.timerData.timer_status = "penalty shootout stopped";
				$scope.timerData.match_status = "finished";
				$scope.timerData.live_status = false;
				$scope.timerData.penalty = {};
				$scope.timerData.penalty.status = true;
				$scope.timerData.penalty.homeTeamScore = $scope.homePenaltyScore;
				$scope.timerData.penalty.awayTeamScore = $scope.awayPenaltyScore;

				if($scope.homePenaltyScore > $scope.awayPenaltyScore){
					$scope.timerData.match_winner = $scope.matchData.match_homeTeam;
					$scope.timerData.match_loser = $scope.matchData.match_awayTeam;
				}else{
					$scope.timerData.match_winner = $scope.matchData.match_awayTeam;
					$scope.timerData.match_loser = $scope.matchData.match_homeTeam;
				}

				clearInterval($scope.loadMatch);
				clearInterval($scope.loadTimer);
				clearInterval($scope.loadTeamPossession);
				$rootScope.showLoading($ionicLoading);

				// update next round match
				CompetitionService.getCompetitionById($scope.matchData.competition_id,localStorage.getItem("token")).success(function(comp) {
					console.log(comp);
					if($scope.matchData.match_fixture === 'play off'){
						console.log("play off");
						if(comp.comp_numOfTeam === 32){
							var fixture = 'round of 16';
							CompetitionService.getMatchByCompIdFixtureAndLastPair($scope.matchData.competition_id,fixture,$scope.matchData.match_pair).success(function(match) {
								match.forEach(function(m){
									console.log(m);
									if($scope.matchData.pair_status === 'home'){
										m.match_homeTeam = $scope.timerData.match_winner;
										m.match_homeTeamObj.team_name = $scope.timerData.match_winner;
									}else{
										m.match_awayTeam = $scope.timerData.match_winner;
										m.match_awayTeamObj.team_name = $scope.timerData.match_winner;
									}
									console.log(m);
									// update next round match data
									MatchService.editMatchById(m.id,m).success(function(data) {
										console.log(data);
									}).error(function(data) {});
								})
							}).error(function(data) {});
						}else if(comp.comp_numOfTeam === 16){
							var fixture = 'quarter final';
							CompetitionService.getMatchByCompIdFixtureAndLastPair($scope.matchData.competition_id,fixture,$scope.matchData.match_pair).success(function(match) {
								match.forEach(function(m){
									console.log(m);
									if($scope.matchData.pair_status === 'home'){
										m.match_homeTeam = $scope.timerData.match_winner;
										m.match_homeTeamObj.team_name = $scope.timerData.match_winner;
									}else{
										m.match_awayTeam = $scope.timerData.match_winner;
										m.match_awayTeamObj.team_name = $scope.timerData.match_winner;
									}
									console.log(m);
									// update next round match data
									MatchService.editMatchById(m.id,m).success(function(data) {
										console.log(data);
									}).error(function(data) {});
								})
							}).error(function(data) {});
						}else{
							var fixture = 'semi final';
							CompetitionService.getMatchByCompIdFixtureAndLastPair($scope.matchData.competition_id,fixture,$scope.matchData.match_pair).success(function(match) {
								match.forEach(function(m){
									console.log(m);
									if($scope.matchData.pair_status === 'home'){
										m.match_homeTeam = $scope.timerData.match_winner;
										m.match_homeTeamObj.team_name = $scope.timerData.match_winner;
									}else{
										m.match_awayTeam = $scope.timerData.match_winner;
										m.match_awayTeamObj.team_name = $scope.timerData.match_winner;
									}
									console.log(m);
									// update next round match data
									MatchService.editMatchById(m.id,m).success(function(data) {
										console.log(data);
									}).error(function(data) {});
								})
							}).error(function(data) {});
						}
					}else if($scope.matchData.match_fixture === 'round of 16'){
						var fixture = 'quarter final';
						CompetitionService.getMatchByCompIdFixtureAndLastPair($scope.matchData.competition_id,fixture,$scope.matchData.match_pair).success(function(match) {
							match.forEach(function(m){
								console.log(m);
								if($scope.matchData.pair_status === 'home'){
									m.match_homeTeam = $scope.timerData.match_winner;
									m.match_homeTeamObj.team_name = $scope.timerData.match_winner;
								}else{
									m.match_awayTeam = $scope.timerData.match_winner;
									m.match_awayTeamObj.team_name = $scope.timerData.match_winner;
								}
								console.log(m);
								// update next round match data
								MatchService.editMatchById(m.id,m).success(function(data) {
									console.log(data);
								}).error(function(data) {});
							})
						}).error(function(data) {});
					}else if($scope.matchData.match_fixture === 'quarter final'){
						var fixture = 'semi final';
						CompetitionService.getMatchByCompIdFixtureAndLastPair($scope.matchData.competition_id,fixture,$scope.matchData.match_pair).success(function(match) {
							match.forEach(function(m){
								console.log(m);
								if($scope.matchData.pair_status === 'home'){
									m.match_homeTeam = $scope.timerData.match_winner;
									m.match_homeTeamObj.team_name = $scope.timerData.match_winner;
								}else{
									m.match_awayTeam = $scope.timerData.match_winner;
									m.match_awayTeamObj.team_name = $scope.timerData.match_winner;
								}
								console.log(m);
								// update next round match data
								MatchService.editMatchById(m.id,m).success(function(data) {
									console.log(data);
								}).error(function(data) {});
							})
						}).error(function(data) {});
					}else if($scope.matchData.match_fixture === 'semi final'){
						var fixture = 'final';
						CompetitionService.getMatchByCompIdFixtureAndLastPair($scope.matchData.competition_id,fixture,$scope.matchData.match_pair).success(function(match) {
							match.forEach(function(m){
								console.log(m);
								if($scope.matchData.pair_status === 'home'){
									m.match_homeTeam = $scope.timerData.match_winner;
									m.match_homeTeamObj.team_name = $scope.timerData.match_winner;
								}else{
									m.match_awayTeam = $scope.timerData.match_winner;
									m.match_awayTeamObj.team_name = $scope.timerData.match_winner;
								}
								console.log(m);
								// update next round match data
								MatchService.editMatchById(m.id,m).success(function(data) {
									console.log(data);
								}).error(function(data) {});
							})
						}).error(function(data) {});
					}
				}).error(function(data) {});
		
				setTimeout(function(){

					// update team data
					TeamService.getTeamByName($scope.matchData.match_homeTeam).success(function(team){
						$scope.teamFormWin = {};
						$scope.teamFormWin.team_play = team.team_play + 1;
						$scope.teamFormWin.team_point = team.team_point + 3;
						$scope.teamFormWin.team_win = team.team_win + 1;
						if($scope.matchData.match_homeTeam === $scope.timerData.match_winner){
							$scope.teamFormWin.goalAgainst = team.team_goalAgainst + $scope.matchData.match_awayTeamObj.score;
							$scope.teamFormWin.goalFor = team.team_goalFor + $scope.matchData.match_homeTeamObj.score;
						}else{
							$scope.teamFormWin.goalAgainst = team.team_goalAgainst + $scope.matchData.match_homeTeamObj.score;	
							$scope.teamFormWin.goalFor = team.team_goalFor + $scope.matchData.match_awayTeamObj.score;
						}
						TeamService.editTeamById(team.id, $scope.teamFormWin).success(function(data) {
		            		console.log(data);
		                }).error(function(data) {});
					}).error(function(data) {
						$ionicLoading.hide();
					});

	                // update referee profile
	                LoginService.getUserByUsername($scope.matchData.match_referee).success(function(referee){
	                	$scope.refereeForm = {};
	                	$scope.refereeForm.matchManaged = referee.matchManaged + 1;
						LoginService.editUser(referee.id, localStorage.getItem("token"),$scope.refereeForm).success(function(data) {
                    		console.log(data);
                    	}).error(function(data) {});	
					}).error(function(data) {});

					// update analyst profile
	                LoginService.getUserByUsername($scope.matchData.match_analyst).success(function(analyst){
	                	$scope.analystForm = {};
	                	$scope.analystForm.matchManaged = analyst.matchManaged + 1;
						LoginService.editUser(analyst.id, localStorage.getItem("token"),$scope.analystForm).success(function(data) {
                    		console.log(data);
                    	}).error(function(data) {});	
					}).error(function(data) {});
				},1500);

				setTimeout(function(){
		
					// update team data
					TeamService.getTeamByName($scope.matchData.match_awayTeam).success(function(team){
						$scope.teamFormLose = {};
						$scope.teamFormLose.team_play = team.team_play + 1;
						$scope.teamFormLose.team_lose = team.team_lose + 1;
						if($scope.matchData.match_homeTeam === $scope.timerData.match_loser){
							$scope.teamFormLose.goalAgainst = team.team_goalAgainst + $scope.matchData.match_awayTeamObj.score;
							$scope.teamFormLose.goalFor = team.team_goalFor + $scope.matchData.match_homeTeamObj.score;
						}else{
							$scope.teamFormLose.goalAgainst = team.team_goalAgainst + $scope.matchData.match_homeTeamObj.score;	
							$scope.teamFormLose.goalFor = team.team_goalFor + $scope.matchData.match_awayTeamObj.score;
						}
						TeamService.editTeamById(team.id, $scope.teamFormLose).success(function(data) {
		            		console.log(data);
		                }).error(function(data) {});

					}).error(function(data) {
						$ionicLoading.hide();
					});
				
					// update match data
					MatchService.editMatchById($scope.matchData.id,$scope.timerData).success(function(data) {
						// setTimeout(function(){
							$ionicLoading.hide();
						// },1000);
						$state.go('app.match_detail', {
							'matchId': $scope.matchData.id
						});
					}).error(function(data) {});
				},2000);
			}
		}else if($scope.penaltyShootOut > 5 && $scope.awayPenalty % 5 != 0){
			$scope.penaltyShootOut = $scope.penaltyShootOut + 1;
		}	

		if($scope.penStatus == true){
			if($scope.homePenaltyScore != $scope.awayPenaltyScore){
				console.log("not same");
				$scope.penaltyStatus = '';
			}
		}
		if($scope.awayPenalty % 5 == 0){
			console.log("yeah");
			if($scope.homePenaltyScore == $scope.awayPenaltyScore){
				console.log("same");
				$scope.penaltyShootOut = $scope.penaltyShootOut + 1;
				$scope.homePenalty = 1;
				$scope.awayPenalty = 0;
				$scope.homePenalty1 = '';
				$scope.homePenalty2 = '';
				$scope.homePenalty3 = '';
				$scope.homePenalty4 = '';
				$scope.homePenalty5 = '';
				$scope.awayPenalty1 = '';
				$scope.awayPenalty2 = '';
				$scope.awayPenalty3 = '';
				$scope.awayPenalty4 = '';
				$scope.awayPenalty5 = '';
				$scope.penStatus = true;
			}
		}
	}


	// timer
	$scope.matchTimer = 0;

	$scope.getMatchById = function(){
		MatchService.getMatchById($stateParams.matchId).success(function(data){
			$scope.matchData = data;
			console.log($scope.matchData);
			console.log("analyst");
			if(localStorage.getItem("role") === 'Analyst' && data.match_status === 'finished'){
				clearInterval($scope.loadMatch);
				clearInterval($scope.loadTeamPossession);
				clearInterval($scope.loadTimer);
				$state.go('app.match_detail', {
					'matchId': $scope.matchData.id
				});
			}
		}).error(function(data){});
	};

	$scope.startTimer = function(){
		$scope.matchTimer = $scope.matchTimer + 1;
		// if($scope.matchData.timer_status === null || $scope.matchData.timer_status === 'started'){
			// console.log("afsd fsdf sdfsdf sdfsdf sf");
			$scope.timerData.timer = $scope.matchData.timer + 1;
			// $scope.timerData.timer_status = "halftime";
			MatchService.editMatchById($scope.matchData.id,$scope.timerData).success(function(data) {
				// console.log('qweqweqrer erwerwerrqwrqwrqwrqwr');
				$ionicLoading.hide();
				// $state.go('app.home');
			}).error(function(data) {
				$ionicLoading.hide();
			});
		// }	
	};

	// ball possession
	$scope.teamASecond = 0;
	$scope.teamBSecond = 0;
	$scope.timerTeamAStat = false;
	$scope.timerTeamBStat = false;

	$scope.startTeamATimer = function(){
		$scope.teamASecond = $scope.teamASecond + 1;
	};

	$scope.startTeamBTimer = function(){
		$scope.teamBSecond = $scope.teamBSecond + 1;
	};

	$scope.startTimerTeamA = function(){
		$scope.loadTimerTeamA = setInterval($scope.startTeamATimer, 1000);
		clearInterval($scope.loadTimerTeamB);
		$scope.timerTeamAStat = true;
		$scope.timerTeamBStat = false;
	};

	$scope.stopTimerAB = function(){
		clearInterval($scope.loadTimerTeamA);
		clearInterval($scope.loadTimerTeamB);
		$scope.timerTeamAStat = false;
		$scope.timerTeamBStat = false;
	};

	$scope.startTimerTeamB = function(){
		$scope.loadTimerTeamB = setInterval($scope.startTeamBTimer, 1000);
		clearInterval($scope.loadTimerTeamA);
		$scope.timerTeamBStat = true;
		$scope.timerTeamAStat = false;
	};


	$scope.possessionTeamAPercentage = 0;
	$scope.possessionTeamBPercentage = 0;
	$scope.totalSecond = 0;

	$scope.startTeamPossession = function() {
	
		if($scope.teamASecond != 0 && $scope.teamBSecond != 0){
			$scope.totalSecond = $scope.teamASecond + $scope.teamBSecond;
			$scope.possessionTeamAPercentage = parseInt($scope.teamASecond / $scope.totalSecond * 100);
			$scope.possessionTeamBPercentage = parseInt($scope.teamBSecond / $scope.totalSecond * 100);

			MatchService.getMatchById($stateParams.matchId).success(function(match){
		   		match.match_stats.homePossession = $scope.possessionTeamAPercentage;
		   		match.match_stats.awayPossession = $scope.possessionTeamBPercentage;

		   		MatchService.editMatchById($stateParams.matchId,match).success(function(data) {
					console.log(data);
					console.log("load possession");
					$ionicLoading.hide();
				}).error(function(data) {
					$ionicLoading.hide();
				});

			}).error(function(data){});

		}else{
			$scope.possessionTeamAPercentage = 0;
			$scope.possessionTeamBPercentage = 0;
		}
	};

	$scope.match = {};
	$scope.matchTime = [];
	$scope.countDown = "";
	console.log($stateParams.matchId);
	$scope.editMatchById = function() {
		// $scope.match.match_date = moment($scope.match.match_date).format('D MMM YYYY');
		$scope.match.match_date = new Date($scope.match.match_date);
		console.log($scope.match.match_date);

		$scope.matchTime = $scope.match.match_time.split(":");
		if($scope.matchTime[1] == "00"){
			$scope.countDown = ($scope.matchTime[0]-1) + ":59";
		}else if(($scope.matchTime[1]-1).toString().length == "1"){
			$scope.countDown = $scope.matchTime[0] + ":0" + ($scope.matchTime[1]-1);
		}else{
			$scope.countDown = $scope.matchTime[0] + ":" + ($scope.matchTime[1]-1);
		}
		$scope.match.match_countDown = $scope.countDown;
		MatchService.editMatchById($stateParams.matchId,localStorage.getItem("token"),$scope.match).success(function(data) {
			console.log(data);
			$state.go('app.fixture', {
				'id': localStorage.getItem("fixId")
			});
			// $ionicLoading.hide();
		}).error(function(data) {
			// $ionicLoading.hide();
		});
	};



	console.log($scope.timerData);
	$scope.loadTeamPossession = setInterval($scope.startTeamPossession, 10000);
    $scope.loadMatch = setInterval($scope.getMatchById, 1000);
    $scope.loadTimer = setInterval($scope.startTimer, 60000);

	$scope.playMatch = function() {
		$rootScope.showLoading();
		$scope.timerData.timer_status = localStorage.getItem("timerStatus");
		MatchService.editMatchById($scope.matchData.id,$scope.timerData).success(function(data) {
			console.log('qweqweqrer erwerwerrqwrqwrqwrqwr');	
			setTimeout(function(){
				$ionicLoading.hide();
			},1000);
			
		}).error(function(data) {
			setTimeout(function(){
				$ionicLoading.hide();
			},1000);
		});
		$scope.loadMatch = setInterval($scope.getMatchById, 1000);
		$scope.loadTimer = setInterval($scope.startTimer, 60000);
		console.log("sdfsdffsdfd kijdfs fhfasjha sdajsfha fj");
	};

	$scope.pauseMatch1stHalfStarted = function() {
		$rootScope.showLoading();
		// console.log(timerStatus);
		localStorage.setItem("timerStatus", '1st half started');
		$scope.timerData.timer_status = "paused";
		MatchService.editMatchById($scope.matchData.id,$scope.timerData).success(function(data) {
			console.log('qweqweqrer erwerwerrqwrqwrqwrqwr');
			setTimeout(function(){
				$ionicLoading.hide();
			},1000);
			// $state.go('app.home');
		}).error(function(data) {
			setTimeout(function(){
				$ionicLoading.hide();
			},1000);
		});
		// clearInterval($scope.loadMatch);
		clearInterval($scope.loadTimer);
		console.log("sdfsdffsdfd kijdfs fhfasjha sdajsfha fj");
	};

	$scope.pauseMatch2ndHalfStarted = function() {
		$rootScope.showLoading();
		// console.log(timerStatus);
		localStorage.setItem("timerStatus", '2nd half started');
		$scope.timerData.timer_status = "paused";
		MatchService.editMatchById($scope.matchData.id,$scope.timerData).success(function(data) {
			console.log('qweqweqrer erwerwerrqwrqwrqwrqwr');
			setTimeout(function(){
				$ionicLoading.hide();
			},1000);
			// $state.go('app.home');
		}).error(function(data) {
			setTimeout(function(){
				$ionicLoading.hide();
			},1000);
		});
		// clearInterval($scope.loadMatch);
		clearInterval($scope.loadTimer);
		console.log("sdfsdffsdfd kijdfs fhfasjha sdajsfha fj");
	};

	$scope.pauseMatch1stHalfStartedET = function() {
		$rootScope.showLoading();
		// console.log(timerStatus);
		localStorage.setItem("timerStatus", '1st half started (ET)');
		$scope.timerData.timer_status = "paused";
		MatchService.editMatchById($scope.matchData.id,$scope.timerData).success(function(data) {
			console.log('qweqweqrer erwerwerrqwrqwrqwrqwr');
			setTimeout(function(){
				$ionicLoading.hide();
			},1000);
			// $state.go('app.home');
		}).error(function(data) {
			setTimeout(function(){
				$ionicLoading.hide();
			},1000);
		});
		// clearInterval($scope.loadMatch);
		clearInterval($scope.loadTimer);
		console.log("sdfsdffsdfd kijdfs fhfasjha sdajsfha fj");
	};

	$scope.pauseMatch2ndHalfStartedET = function() {
		$rootScope.showLoading();
		// console.log(timerStatus);
		localStorage.setItem("timerStatus", '2nd half started (ET)');
		$scope.timerData.timer_status = "paused";
		MatchService.editMatchById($scope.matchData.id,$scope.timerData).success(function(data) {
			console.log('qweqweqrer erwerwerrqwrqwrqwrqwr');
			setTimeout(function(){
				$ionicLoading.hide();
			},1000);
			// $state.go('app.home');
		}).error(function(data) {
			setTimeout(function(){
				$ionicLoading.hide();
			},1000);
		});
		// clearInterval($scope.loadMatch);
		clearInterval($scope.loadTimer);
		console.log("sdfsdffsdfd kijdfs fhfasjha sdajsfha fj");
	};

	$scope.startFirstHalf = function() {
		$rootScope.showLoading();
		$scope.timerData.timer_status = "1st half started";
		$scope.timerData.live_status = true;
		MatchService.editMatchById($scope.matchData.id,$scope.timerData).success(function(data) {
			console.log('qweqweqrer erwerwerrqwrqwrqwrqwr');
			setTimeout(function(){
				$ionicLoading.hide();
			},1000);
			// $state.go('app.home');
		}).error(function(data) {
			setTimeout(function(){
				$ionicLoading.hide();
			},1000);
		});

		$scope.loadMatch = setInterval($scope.getMatchById, 1000);
		$scope.loadTimer = setInterval($scope.startTimer, 60000);

		// update player data
		var lineupHomeArr = $scope.matchData.match_homeTeamObj.lineup.split(",");
		var lineupAwayArr = $scope.matchData.match_awayTeamObj.lineup.split(",");

		for(var i = 0; i < lineupHomeArr.length; i++){
			LoginService.getUserByUsername(lineupHomeArr[i]).success(function(player){
				$scope.profileForm = {};
				$scope.profileForm.play = player.play + 1;

				LoginService.editUser(player.id, localStorage.getItem("token"), $scope.profileForm).success(function(data) {
					console.log(i);
					console.log(data);
	            }).error(function(data) {});

			}).error(function(data) {});

			LoginService.getUserByUsername(lineupAwayArr[i]).success(function(player){
				$scope.profileForm = {};
				$scope.profileForm.play = player.play + 1;

				LoginService.editUser(player.id, localStorage.getItem("token"), $scope.profileForm).success(function(data) {
					console.log(i);
					console.log(data);
	            }).error(function(data) {});

			}).error(function(data) {});
		}
	
		console.log("sdfsdffsdfd kijdfs fhfasjha sdajsfha fj");
	};

	$scope.startSecondHalf = function() {
		$rootScope.showLoading();
		$scope.timerData.timer_status = "2nd half started";
		MatchService.editMatchById($scope.matchData.id,$scope.timerData).success(function(data) {
			console.log('qweqweqrer erwerwerrqwrqwrqwrqwr');
			setTimeout(function(){
				$ionicLoading.hide();
			},1000);
			// $state.go('app.home');
		}).error(function(data) {
			setTimeout(function(){
				$ionicLoading.hide();
			},1000);
		});
		$scope.loadMatch = setInterval($scope.getMatchById, 1000);
		$scope.loadTimer = setInterval($scope.startTimer, 60000);
		console.log("sdfsdffsdfd kijdfs fhfasjha sdajsfha fj");
	};

	$scope.startFirstHalfET = function() {
		$rootScope.showLoading();
		$scope.timerData.timer_status = "1st half started (ET)";
		MatchService.editMatchById($scope.matchData.id,$scope.timerData).success(function(data) {
			console.log('qweqweqrer erwerwerrqwrqwrqwrqwr');
			setTimeout(function(){
				$ionicLoading.hide();
			},1000);
			// $state.go('app.home');
		}).error(function(data) {
			setTimeout(function(){
				$ionicLoading.hide();
			},1000);
		});
		$scope.loadMatch = setInterval($scope.getMatchById, 1000);
		$scope.loadTimer = setInterval($scope.startTimer, 60000);
		console.log("sdfsdffsdfd kijdfs fhfasjha sdajsfha fj");
	};

	$scope.startSecondHalfET = function() {
		$rootScope.showLoading();
		$scope.timerData.timer_status = "2nd half started (ET)";
		MatchService.editMatchById($scope.matchData.id,$scope.timerData).success(function(data) {
			console.log('qweqweqrer erwerwerrqwrqwrqwrqwr');
			setTimeout(function(){
				$ionicLoading.hide();
			},1000);
			// $state.go('app.home');
		}).error(function(data) {
			setTimeout(function(){
				$ionicLoading.hide();
			},1000);
		});
		$scope.loadMatch = setInterval($scope.getMatchById, 1000);
		$scope.loadTimer = setInterval($scope.startTimer, 60000);
		console.log("sdfsdffsdfd kijdfs fhfasjha sdajsfha fj");
	};

	$scope.startPenaltyShootout = function() {
		$rootScope.showLoading();
		$scope.timerData.timer_status = "penalty shootout started";
		MatchService.editMatchById($scope.matchData.id,$scope.timerData).success(function(data) {
			console.log('qweqweqrer erwerwerrqwrqwrqwrqwr');
			setTimeout(function(){
				$ionicLoading.hide();
			},1000);
			// $state.go('app.home');
		}).error(function(data) {
			setTimeout(function(){
				$ionicLoading.hide();
			},1000);
		});
		$scope.loadMatch = setInterval($scope.getMatchById, 1000);
		$scope.loadTimer = setInterval($scope.startTimer, 60000);
		console.log("sdfsdffsdfd kijdfs fhfasjha sdajsfha fj");
	};

	$scope.stopFirstHalf = function() {
		$rootScope.showLoading();
		$scope.timerData.timer_status = "1st half stopped";
		$scope.timerData.halfTime = {};
		$scope.timerData.halfTime.status = true;
		$scope.timerData.halfTime.homeTeamScore = $scope.matchData.match_homeTeamObj.score;
		$scope.timerData.halfTime.awayTeamScore = $scope.matchData.match_awayTeamObj.score;

		MatchService.editMatchById($scope.matchData.id,$scope.timerData).success(function(data) {
			console.log('qweqweqrer erwerwerrqwrqwrqwrqwr');
			setTimeout(function(){
				$ionicLoading.hide();
			},1000);
		}).error(function(data) {
			setTimeout(function(){
				$ionicLoading.hide();
			},1000);
		});
		// clearInterval($scope.loadMatch);
		clearInterval($scope.loadTimer);
		console.log("sdfsdffsdfd kijdfs fhfasjha sdajsfha fj");
	};

	$scope.stopSecondHalf = function() {
		// clearInterval($scope.loadMatch);
		clearInterval($scope.loadTimer);
		clearInterval($scope.loadTeamPossession);
		$rootScope.showLoading($ionicLoading);
		console.log("stop second half");
		console.log($scope.matchData.competition_id);

		if($scope.matchData.match_fixture.includes("fixture")){
			console.log("yeah ");
			$scope.timerData.timer_status = "2nd half stopped";
			$scope.timerData.match_status = "finished";
			$scope.timerData.live_status = false;
			$scope.timerData.fullTime = {};
			$scope.timerData.fullTime.status = true;
			$scope.timerData.fullTime.homeTeamScore = $scope.matchData.match_homeTeamObj.score;
			$scope.timerData.fullTime.awayTeamScore = $scope.matchData.match_awayTeamObj.score;

			if($scope.matchData.match_homeTeamObj.score === $scope.matchData.match_awayTeamObj.score){
				console.log("score sama");
				$scope.timerData.match_winner = '';
			}else if($scope.matchData.match_homeTeamObj.score > $scope.matchData.match_awayTeamObj.score){
				$scope.timerData.match_winner = $scope.matchData.match_homeTeam;
				$scope.timerData.match_loser = $scope.matchData.match_awayTeam;
				console.log("score tidak sama hometeam");

			}else{
				$scope.timerData.match_winner = $scope.matchData.match_awayTeam;
				$scope.timerData.match_loser = $scope.matchData.match_homeTeam;
				console.log("score tidak sama awayteam");

			}
			
			// update classement
			$scope.classementFormWin = {};
			$scope.classementFormDraw = {};
			$scope.classementFormLose = {};

			if($scope.timerData.match_winner !== ''){
				console.log($scope.matchData.competition_id);
				console.log($scope.timerData.match_winner);

				CompetitionService.getClassementByCompIdAndTeamName($scope.matchData.competition_id, $scope.timerData.match_winner).success(function(data) {
					console.log(data);
					$scope.classementFormWin = {};
					$scope.classementFormWin.play = parseInt(data.play) + 1;
					$scope.classementFormWin.point = parseInt(data.point) + 3;
					if($scope.matchData.match_homeTeam === $scope.timerData.match_winner){
						$scope.classementFormWin.goalAgainst = data.goalAgainst + $scope.matchData.match_awayTeamObj.score;
						$scope.classementFormWin.goalFor = data.goalFor + $scope.matchData.match_homeTeamObj.score;
					}else{
						$scope.classementFormWin.goalAgainst = data.goalAgainst + $scope.matchData.match_homeTeamObj.score;	
						$scope.classementFormWin.goalFor = data.goalFor + $scope.matchData.match_awayTeamObj.score;
					}
					$scope.classementFormWin.win = data.win + 1;
					$scope.classementFormWin.goalDifference = $scope.classementFormWin.goalFor - $scope.classementFormWin.goalAgainst;
					console.log($scope.classementFormWin);

					setTimeout(function(){

						// update classement data
						ClassementService.editClassementById(data.id,$scope.classementFormWin).success(function(data) {
							console.log(data);
							console.log("berhasil");
						}).error(function(data) {});

						// update team data
						TeamService.getTeamByName($scope.matchData.match_homeTeam).success(function(team){
							$scope.teamFormWin = {};
							$scope.teamFormWin.team_play = team.team_play + 1;
							$scope.teamFormWin.team_point = team.team_point + 3;
							$scope.teamFormWin.team_win = team.team_win + 1;
							if($scope.matchData.match_homeTeam === $scope.timerData.match_winner){
								$scope.teamFormWin.goalAgainst = team.team_goalAgainst + $scope.matchData.match_awayTeamObj.score;
								$scope.teamFormWin.goalFor = team.team_goalFor + $scope.matchData.match_homeTeamObj.score;
							}else{
								$scope.teamFormWin.goalAgainst = team.team_goalAgainst + $scope.matchData.match_homeTeamObj.score;	
								$scope.teamFormWin.goalFor = team.team_goalFor + $scope.matchData.match_awayTeamObj.score;
							}
							TeamService.editTeamById(team.id, $scope.teamFormWin).success(function(data) {
			            		console.log(data);
			                }).error(function(data) {});
						}).error(function(data) {
							$ionicLoading.hide();
						});

		                // update referee profile
		                LoginService.getUserByUsername($scope.matchData.match_referee).success(function(referee){
		                	$scope.refereeForm = {};
		                	$scope.refereeForm.matchManaged = referee.matchManaged + 1;
							LoginService.editUser(referee.id, localStorage.getItem("token"),$scope.refereeForm).success(function(data) {
	                    		console.log(data);
	                    	}).error(function(data) {});	
						}).error(function(data) {});

						// update analyst profile
		                LoginService.getUserByUsername($scope.matchData.match_analyst).success(function(analyst){
		                	$scope.analystForm = {};
		                	$scope.analystForm.matchManaged = analyst.matchManaged + 1;
							LoginService.editUser(analyst.id, localStorage.getItem("token"),$scope.analystForm).success(function(data) {
	                    		console.log(data);
	                    	}).error(function(data) {});	
						}).error(function(data) {});
					},1500);

				}).error(function(data) {
					console.log("gagal");
				});		

				CompetitionService.getClassementByCompIdAndTeamName($scope.matchData.competition_id, $scope.timerData.match_loser).success(function(data) {
					console.log(data);
					$scope.classementFormLose.play = parseInt(data.play) + 1;
					$scope.classementFormLose.lose = data.lose + 1;
					if($scope.matchData.match_homeTeam === $scope.timerData.match_loser){
						$scope.classementFormLose.goalAgainst = data.goalAgainst + $scope.matchData.match_awayTeamObj.score;
						$scope.classementFormLose.goalFor = data.goalFor + $scope.matchData.match_homeTeamObj.score;
					}else{
						$scope.classementFormLose.goalAgainst = data.goalAgainst + $scope.matchData.match_homeTeamObj.score;	
						$scope.classementFormLose.goalFor = data.goalFor + $scope.matchData.match_awayTeamObj.score;
					}
					$scope.classementFormLose.goalDifference = $scope.classementFormLose.goalFor - $scope.classementFormLose.goalAgainst;
					console.log($scope.classementFormLose);

					setTimeout(function(){
						// update classement data
						ClassementService.editClassementById(data.id,$scope.classementFormLose).success(function(data) {
							console.log(data);
							console.log("berhasil");

							// update team data
							TeamService.getTeamByName($scope.matchData.match_awayTeam).success(function(team){
								$scope.teamFormLose = {};
								$scope.teamFormLose.team_play = team.team_play + 1;
								$scope.teamFormLose.team_lose = team.team_lose + 1;
								if($scope.matchData.match_homeTeam === $scope.timerData.match_loser){
									$scope.teamFormLose.goalAgainst = team.team_goalAgainst + $scope.matchData.match_awayTeamObj.score;
									$scope.teamFormLose.goalFor = team.team_goalFor + $scope.matchData.match_homeTeamObj.score;
								}else{
									$scope.teamFormLose.goalAgainst = team.team_goalAgainst + $scope.matchData.match_homeTeamObj.score;	
									$scope.teamFormLose.goalFor = team.team_goalFor + $scope.matchData.match_awayTeamObj.score;
								}
								TeamService.editTeamById(team.id, $scope.teamFormLose).success(function(data) {
				            		console.log(data);
				                }).error(function(data) {});

							}).error(function(data) {
								$ionicLoading.hide();
							});
						
							// update match data
							MatchService.editMatchById($scope.matchData.id,$scope.timerData).success(function(data) {
								// setTimeout(function(){
									$ionicLoading.hide();
								// },1000);
								$state.go('app.match_detail', {
									'matchId': $scope.matchData.id
								});
							}).error(function(data) {});

						}).error(function(data) {});

					},2000);

				}).error(function(data) {
					console.log("gagal");
				});		
			}else{

				CompetitionService.getClassementByCompIdAndTeamName($scope.matchData.competition_id, $scope.matchData.match_homeTeam).success(function(data) {
					console.log(data);

					$scope.classementFormDraw.play = parseInt(data.play) + 1;
					$scope.classementFormDraw.point = parseInt(data.point) + 1;
					$scope.classementFormDraw.draw = parseInt(data.draw) + 1;
					$scope.classementFormDraw.goalAgainst = data.goalAgainst + $scope.matchData.match_awayTeamObj.score;
					$scope.classementFormDraw.goalFor = data.goalFor + $scope.matchData.match_homeTeamObj.score;
					$scope.classementFormDraw.goalDifference = $scope.classementFormDraw.goalFor - $scope.classementFormDraw.goalAgainst;
					console.log($scope.classementFormDraw);

					setTimeout(function(){
						// update classement data
						ClassementService.editClassementById(data.id,$scope.classementFormDraw).success(function(data) {
							console.log(data);
							console.log("berhasil");
						}).error(function(data) {});

						// update team data
						TeamService.getTeamByName($scope.matchData.match_homeTeam).success(function(team){
							$scope.teamFormDraw = {};
							$scope.teamFormDraw.team_play = team.team_play + 1;
							$scope.teamFormDraw.team_point = team.team_point + 1;
							$scope.teamFormDraw.team_draw = team.team_draw + 1;
							$scope.teamFormDraw.goalAgainst = team.team_goalAgainst + $scope.matchData.match_awayTeamObj.score;
							$scope.teamFormDraw.goalFor = team.team_goalFor + $scope.matchData.match_homeTeamObj.score;
							$scope.teamFormDraw.goalDifference = $scope.teamFormDraw.goalFor - $scope.teamFormDraw.goalAgainst;

							TeamService.editTeamById(team.id, $scope.teamFormDraw).success(function(data) {
			            		console.log(data);
			                }).error(function(data) {});

						}).error(function(data) {
							$ionicLoading.hide();
						});

		                // update referee profile
		                LoginService.getUserByUsername($scope.matchData.match_referee).success(function(referee){
		                	$scope.refereeForm = {};
		                	$scope.refereeForm.matchManaged = referee.matchManaged + 1;
							LoginService.editUser(referee.id, localStorage.getItem("token"),$scope.refereeForm).success(function(data) {
	                    		console.log(data);
	                    	}).error(function(data) {});	
						}).error(function(data) {});

						// update analyst profile
		                LoginService.getUserByUsername($scope.matchData.match_analyst).success(function(analyst){
		                	$scope.analystForm = {};
		                	$scope.analystForm.matchManaged = analyst.matchManaged + 1;
							LoginService.editUser(analyst.id, localStorage.getItem("token"),$scope.analystForm).success(function(data) {
	                    		console.log(data);
	                    	}).error(function(data) {});	
						}).error(function(data) {});
					},1500);

				}).error(function(data) {
					console.log("gagal");
				});		

				CompetitionService.getClassementByCompIdAndTeamName($scope.matchData.competition_id, $scope.matchData.match_awayTeam).success(function(data) {
					console.log(data);
					// $scope.classementFormDraw = {};
					$scope.classementFormDraw.play = parseInt(data.play) + 1;
					$scope.classementFormDraw.point = parseInt(data.point) + 1;
					$scope.classementFormDraw.draw = parseInt(data.draw) + 1;
					$scope.classementFormDraw.goalAgainst = data.goalAgainst + $scope.matchData.match_homeTeamObj.score;
					$scope.classementFormDraw.goalFor = data.goalFor + $scope.matchData.match_awayTeamObj.score;
					$scope.classementFormDraw.goalDifference = $scope.classementFormDraw.goalFor - $scope.classementFormDraw.goalAgainst;
					console.log($scope.classementFormDraw);

					setTimeout(function(){
						// update classement data
						ClassementService.editClassementById(data.id,$scope.classementFormDraw).success(function(data) {
							console.log(data);
							console.log("berhasil");

							// update team data
							TeamService.getTeamByName($scope.matchData.match_awayTeam).success(function(team){
								$scope.teamFormDraw = {};
								$scope.teamFormDraw.team_play = team.team_play + 1;
								$scope.teamFormDraw.team_point = team.team_point + 1;
								$scope.teamFormDraw.team_draw = team.team_draw + 1;
								$scope.teamFormDraw.goalAgainst = team.team_goalAgainst + $scope.matchData.match_homeTeamObj.score;
								$scope.teamFormDraw.goalFor = team.team_goalFor + $scope.matchData.match_awayTeamObj.score;
								$scope.teamFormDraw.goalDifference = $scope.teamFormDraw.goalFor - $scope.teamFormDraw.goalAgainst;

								TeamService.editTeamById(team.id, $scope.teamFormDraw).success(function(data) {
				            		console.log(data);
				                }).error(function(data) {});

							}).error(function(data) {
								$ionicLoading.hide();
							});
						
							// update match data
							MatchService.editMatchById($scope.matchData.id,$scope.timerData).success(function(data) {
								// setTimeout(function(){
									$ionicLoading.hide();
								// },1000);
								$state.go('app.match_detail', {
									'matchId': $scope.matchData.id
								});
							}).error(function(data) {});

						}).error(function(data) {});

					},2000);

				}).error(function(data) {
					console.log("gagal");
				});		
			}

		}else if($scope.matchData.match_homeTeamObj.score === $scope.matchData.match_awayTeamObj.score){
			console.log("nope");
			$scope.timerData.timer_status = "2nd half stopped";
			$scope.timerData.fullTime = {};
			$scope.timerData.fullTime.status = true;
			$scope.timerData.fullTime.homeTeamScore = $scope.matchData.match_homeTeamObj.score;
			$scope.timerData.fullTime.awayTeamScore = $scope.matchData.match_awayTeamObj.score;
			MatchService.editMatchById($scope.matchData.id,$scope.timerData).success(function(data) {
				setTimeout(function(){
					$ionicLoading.hide();
				},1000);
			}).error(function(data) {
				setTimeout(function(){
					$ionicLoading.hide();
				},1000);
			});

		}else{

			if($scope.matchData.match_homeTeamObj.score > $scope.matchData.match_awayTeamObj.score){
				$scope.timerData.match_winner = $scope.matchData.match_homeTeam;
				$scope.timerData.match_loser = $scope.matchData.match_awayTeam;
			}else{
				$scope.timerData.match_winner = $scope.matchData.match_awayTeam;
				$scope.timerData.match_loser = $scope.matchData.match_homeTeam;
			}
			$scope.timerData.match_status = "finished";
			$scope.timerData.timer_status = "2nd half stopped";
			$scope.timerData.live_status = false;
			$scope.timerData.fullTime = {};
			$scope.timerData.fullTime.status = true;
			$scope.timerData.fullTime.homeTeamScore = $scope.matchData.match_homeTeamObj.score;
			$scope.timerData.fullTime.awayTeamScore = $scope.matchData.match_awayTeamObj.score;

			console.log($scope.matchData.competition_id);
			console.log($scope.timerData.match_winner);

			// update next round match
			CompetitionService.getCompetitionById($scope.matchData.competition_id,localStorage.getItem("token")).success(function(comp) {
				console.log(comp);
				if($scope.matchData.match_fixture === 'play off'){
					console.log("play off");
					if(comp.comp_numOfTeam === 32){
						var fixture = 'round of 16';
						CompetitionService.getMatchByCompIdFixtureAndLastPair($scope.matchData.competition_id,fixture,$scope.matchData.match_pair).success(function(match) {
							match.forEach(function(m){
								console.log(m);
								if($scope.matchData.pair_status === 'home'){
									m.match_homeTeam = $scope.timerData.match_winner;
									m.match_homeTeamObj.team_name = $scope.timerData.match_winner;
								}else{
									m.match_awayTeam = $scope.timerData.match_winner;
									m.match_awayTeamObj.team_name = $scope.timerData.match_winner;
								}
								console.log(m);
								// update next round match data
								MatchService.editMatchById(m.id,m).success(function(data) {
									console.log(data);
								}).error(function(data) {});
							})
						}).error(function(data) {});
					}else if(comp.comp_numOfTeam === 16){
						var fixture = 'quarter final';
						CompetitionService.getMatchByCompIdFixtureAndLastPair($scope.matchData.competition_id,fixture,$scope.matchData.match_pair).success(function(match) {
							match.forEach(function(m){
								console.log(m);
								if($scope.matchData.pair_status === 'home'){
									m.match_homeTeam = $scope.timerData.match_winner;
									m.match_homeTeamObj.team_name = $scope.timerData.match_winner;
								}else{
									m.match_awayTeam = $scope.timerData.match_winner;
									m.match_awayTeamObj.team_name = $scope.timerData.match_winner;
								}
								console.log(m);
								// update next round match data
								MatchService.editMatchById(m.id,m).success(function(data) {
									console.log(data);
								}).error(function(data) {});
							})
						}).error(function(data) {});
					}else{
						var fixture = 'semi final';
						CompetitionService.getMatchByCompIdFixtureAndLastPair($scope.matchData.competition_id,fixture,$scope.matchData.match_pair).success(function(match) {
							match.forEach(function(m){
								console.log(m);
								if($scope.matchData.pair_status === 'home'){
									m.match_homeTeam = $scope.timerData.match_winner;
									m.match_homeTeamObj.team_name = $scope.timerData.match_winner;
								}else{
									m.match_awayTeam = $scope.timerData.match_winner;
									m.match_awayTeamObj.team_name = $scope.timerData.match_winner;
								}
								console.log(m);
								// update next round match data
								MatchService.editMatchById(m.id,m).success(function(data) {
									console.log(data);
								}).error(function(data) {});
							})
						}).error(function(data) {});
					}
				}else if($scope.matchData.match_fixture === 'round of 16'){
					var fixture = 'quarter final';
					CompetitionService.getMatchByCompIdFixtureAndLastPair($scope.matchData.competition_id,fixture,$scope.matchData.match_pair).success(function(match) {
						match.forEach(function(m){
							console.log(m);
							if($scope.matchData.pair_status === 'home'){
								m.match_homeTeam = $scope.timerData.match_winner;
								m.match_homeTeamObj.team_name = $scope.timerData.match_winner;
							}else{
								m.match_awayTeam = $scope.timerData.match_winner;
								m.match_awayTeamObj.team_name = $scope.timerData.match_winner;
							}
							console.log(m);
							// update next round match data
							MatchService.editMatchById(m.id,m).success(function(data) {
								console.log(data);
							}).error(function(data) {});
						})
					}).error(function(data) {});
				}else if($scope.matchData.match_fixture === 'quarter final'){
					var fixture = 'semi final';
					CompetitionService.getMatchByCompIdFixtureAndLastPair($scope.matchData.competition_id,fixture,$scope.matchData.match_pair).success(function(match) {
						match.forEach(function(m){
							console.log(m);
							if($scope.matchData.pair_status === 'home'){
								m.match_homeTeam = $scope.timerData.match_winner;
								m.match_homeTeamObj.team_name = $scope.timerData.match_winner;
							}else{
								m.match_awayTeam = $scope.timerData.match_winner;
								m.match_awayTeamObj.team_name = $scope.timerData.match_winner;
							}
							console.log(m);
							// update next round match data
							MatchService.editMatchById(m.id,m).success(function(data) {
								console.log(data);
							}).error(function(data) {});
						})
					}).error(function(data) {});
				}else if($scope.matchData.match_fixture === 'semi final'){
					var fixture = 'final';
					CompetitionService.getMatchesByMatchFixture($scope.matchData.competition_id,fixture,localStorage.getItem("token")).success(function(match) {
						match.forEach(function(m){
							console.log(m);
							if($scope.matchData.pair_status === 'home'){
								m.match_homeTeam = $scope.timerData.match_winner;
								m.match_homeTeamObj.team_name = $scope.timerData.match_winner;
							}else{
								m.match_awayTeam = $scope.timerData.match_winner;
								m.match_awayTeamObj.team_name = $scope.timerData.match_winner;
							}
							console.log(m);
							// update next round match data
							MatchService.editMatchById(m.id,m).success(function(data) {
								console.log(data);
							}).error(function(data) {});
						})
					}).error(function(data) {});
				}
			}).error(function(data) {});

				
			setTimeout(function(){
				// update team data
				TeamService.getTeamByName($scope.matchData.match_homeTeam).success(function(team){
					$scope.teamFormWin = {};
					$scope.teamFormWin.team_play = team.team_play + 1;
					$scope.teamFormWin.team_point = team.team_point + 3;
					$scope.teamFormWin.team_win = team.team_win + 1;
					if($scope.matchData.match_homeTeam === $scope.timerData.match_winner){
						$scope.teamFormWin.goalAgainst = team.team_goalAgainst + $scope.matchData.match_awayTeamObj.score;
						$scope.teamFormWin.goalFor = team.team_goalFor + $scope.matchData.match_homeTeamObj.score;
					}else{
						$scope.teamFormWin.goalAgainst = team.team_goalAgainst + $scope.matchData.match_homeTeamObj.score;	
						$scope.teamFormWin.goalFor = team.team_goalFor + $scope.matchData.match_awayTeamObj.score;
					}
					TeamService.editTeamById(team.id, $scope.teamFormWin).success(function(data) {
	            		console.log(data);
	                }).error(function(data) {});
				}).error(function(data) {
					$ionicLoading.hide();
				});

                // update referee profile
                LoginService.getUserByUsername($scope.matchData.match_referee).success(function(referee){
                	$scope.refereeForm = {};
                	$scope.refereeForm.matchManaged = referee.matchManaged + 1;
					LoginService.editUser(referee.id, localStorage.getItem("token"),$scope.refereeForm).success(function(data) {
                		console.log(data);
                	}).error(function(data) {});	
				}).error(function(data) {});

				// update analyst profile
                LoginService.getUserByUsername($scope.matchData.match_analyst).success(function(analyst){
                	$scope.analystForm = {};
                	$scope.analystForm.matchManaged = analyst.matchManaged + 1;
					LoginService.editUser(analyst.id, localStorage.getItem("token"),$scope.analystForm).success(function(data) {
                		console.log(data);
                	}).error(function(data) {});	
				}).error(function(data) {});
			},1500);

			setTimeout(function(){
				// update team data
				TeamService.getTeamByName($scope.matchData.match_awayTeam).success(function(team){
					$scope.teamFormLose = {};
					$scope.teamFormLose.team_play = team.team_play + 1;
					$scope.teamFormLose.team_lose = team.team_lose + 1;
					if($scope.matchData.match_homeTeam === $scope.timerData.match_loser){
						$scope.teamFormLose.goalAgainst = team.team_goalAgainst + $scope.matchData.match_awayTeamObj.score;
						$scope.teamFormLose.goalFor = team.team_goalFor + $scope.matchData.match_homeTeamObj.score;
					}else{
						$scope.teamFormLose.goalAgainst = team.team_goalAgainst + $scope.matchData.match_homeTeamObj.score;	
						$scope.teamFormLose.goalFor = team.team_goalFor + $scope.matchData.match_awayTeamObj.score;
					}
					TeamService.editTeamById(team.id, $scope.teamFormLose).success(function(data) {
	            		console.log(data);
	                }).error(function(data) {});
				}).error(function(data) {
					$ionicLoading.hide();
				});
			
				// update match data
				MatchService.editMatchById($scope.matchData.id,$scope.timerData).success(function(data) {
					$ionicLoading.hide();
					$state.go('app.match_detail', {
						'matchId': $scope.matchData.id
					});
				}).error(function(data) {});
			},2000);	
		}
	};

	$scope.stopFirstHalfET = function() {
		$rootScope.showLoading();
		$scope.timerData.timer_status = "1st half stopped (ET)";
		MatchService.editMatchById($scope.matchData.id,$scope.timerData).success(function(data) {
			setTimeout(function(){
				$ionicLoading.hide();
			},1000);
		}).error(function(data) {
			setTimeout(function(){
				$ionicLoading.hide();
			},1000);
		});
		// clearInterval($scope.loadMatch);
		clearInterval($scope.loadTimer);
	};

	$scope.stopSecondHalfET = function() {
		// clearInterval($scope.loadMatch);
		clearInterval($scope.loadTimer);
		clearInterval($scope.loadTeamPossession);
		$rootScope.showLoading($ionicLoading);
		console.log("stop second half (ET)");
		console.log($scope.matchData.competition_id);

		if($scope.matchData.match_fixture.includes("fixture")){
			console.log("yeah ");
			$scope.timerData.timer_status = "2nd half stopped (ET)";
			$scope.timerData.match_status = "finished";
			$scope.timerData.live_status = false;
			$scope.timerData.extraTime = {};
			$scope.timerData.extraTime.status = true;
			$scope.timerData.extraTime.homeTeamScore = $scope.matchData.match_homeTeamObj.score;
			$scope.timerData.extraTime.awayTeamScore = $scope.matchData.match_awayTeamObj.score;

			if($scope.matchData.match_homeTeamObj.score === $scope.matchData.match_awayTeamObj.score){
				console.log("score sama");
				$scope.timerData.match_winner = '';
			}else if($scope.matchData.match_homeTeamObj.score > $scope.matchData.match_awayTeamObj.score){
				$scope.timerData.match_winner = $scope.matchData.match_homeTeam;
				$scope.timerData.match_loser = $scope.matchData.match_awayTeam;
				console.log("score tidak sama hometeam");

			}else{
				$scope.timerData.match_winner = $scope.matchData.match_awayTeam;
				$scope.timerData.match_loser = $scope.matchData.match_homeTeam;
				console.log("score tidak sama awayteam");

			}
			
			// update classement
			$scope.classementFormWin = {};
			$scope.classementFormDraw = {};
			$scope.classementFormLose = {};

			if($scope.timerData.match_winner !== ''){
				console.log($scope.matchData.competition_id);
				console.log($scope.timerData.match_winner);

				CompetitionService.getClassementByCompIdAndTeamName($scope.matchData.competition_id, $scope.timerData.match_winner).success(function(data) {
					console.log(data);
					$scope.classementFormWin = {};
					$scope.classementFormWin.play = parseInt(data.play) + 1;
					$scope.classementFormWin.point = parseInt(data.point) + 3;
					if($scope.matchData.match_homeTeam === $scope.timerData.match_winner){
						$scope.classementFormWin.goalAgainst = data.goalAgainst + $scope.matchData.match_awayTeamObj.score;
						$scope.classementFormWin.goalFor = data.goalFor + $scope.matchData.match_homeTeamObj.score;
					}else{
						$scope.classementFormWin.goalAgainst = data.goalAgainst + $scope.matchData.match_homeTeamObj.score;	
						$scope.classementFormWin.goalFor = data.goalFor + $scope.matchData.match_awayTeamObj.score;
					}
					$scope.classementFormWin.win = data.win + 1;
					$scope.classementFormWin.goalDifference = $scope.classementFormWin.goalFor - $scope.classementFormWin.goalAgainst;
					console.log($scope.classementFormWin);

					setTimeout(function(){

						// update classement data
						ClassementService.editClassementById(data.id,$scope.classementFormWin).success(function(data) {
							console.log(data);
							console.log("berhasil");
						}).error(function(data) {});

						// update team data
						TeamService.getTeamByName($scope.matchData.match_homeTeam).success(function(team){
							$scope.teamFormWin = {};
							$scope.teamFormWin.team_play = team.team_play + 1;
							$scope.teamFormWin.team_point = team.team_point + 3;
							$scope.teamFormWin.team_win = team.team_win + 1;
							if($scope.matchData.match_homeTeam === $scope.timerData.match_winner){
								$scope.teamFormWin.goalAgainst = team.team_goalAgainst + $scope.matchData.match_awayTeamObj.score;
								$scope.teamFormWin.goalFor = team.team_goalFor + $scope.matchData.match_homeTeamObj.score;
							}else{
								$scope.teamFormWin.goalAgainst = team.team_goalAgainst + $scope.matchData.match_homeTeamObj.score;	
								$scope.teamFormWin.goalFor = team.team_goalFor + $scope.matchData.match_awayTeamObj.score;
							}
							TeamService.editTeamById(team.id, $scope.teamFormWin).success(function(data) {
			            		console.log(data);
			                }).error(function(data) {});
						}).error(function(data) {
							$ionicLoading.hide();
						});

		                // update referee profile
		                LoginService.getUserByUsername($scope.matchData.match_referee).success(function(referee){
		                	$scope.refereeForm = {};
		                	$scope.refereeForm.matchManaged = referee.matchManaged + 1;
							LoginService.editUser(referee.id, localStorage.getItem("token"),$scope.refereeForm).success(function(data) {
	                    		console.log(data);
	                    	}).error(function(data) {});	
						}).error(function(data) {});

						// update analyst profile
		                LoginService.getUserByUsername($scope.matchData.match_analyst).success(function(analyst){
		                	$scope.analystForm = {};
		                	$scope.analystForm.matchManaged = analyst.matchManaged + 1;
							LoginService.editUser(analyst.id, localStorage.getItem("token"),$scope.analystForm).success(function(data) {
	                    		console.log(data);
	                    	}).error(function(data) {});	
						}).error(function(data) {});
					},1500);

				}).error(function(data) {
					console.log("gagal");
				});		

				CompetitionService.getClassementByCompIdAndTeamName($scope.matchData.competition_id, $scope.timerData.match_loser).success(function(data) {
					console.log(data);
					$scope.classementFormLose.play = parseInt(data.play) + 1;
					$scope.classementFormLose.lose = data.lose + 1;
					if($scope.matchData.match_homeTeam === $scope.timerData.match_loser){
						$scope.classementFormLose.goalAgainst = data.goalAgainst + $scope.matchData.match_awayTeamObj.score;
						$scope.classementFormLose.goalFor = data.goalFor + $scope.matchData.match_homeTeamObj.score;
					}else{
						$scope.classementFormLose.goalAgainst = data.goalAgainst + $scope.matchData.match_homeTeamObj.score;	
						$scope.classementFormLose.goalFor = data.goalFor + $scope.matchData.match_awayTeamObj.score;
					}
					$scope.classementFormLose.goalDifference = $scope.classementFormLose.goalFor - $scope.classementFormLose.goalAgainst;
					console.log($scope.classementFormLose);

					setTimeout(function(){
						// update classement data
						ClassementService.editClassementById(data.id,$scope.classementFormLose).success(function(data) {
							console.log(data);
							console.log("berhasil");

							// update team data
							TeamService.getTeamByName($scope.matchData.match_awayTeam).success(function(team){
								$scope.teamFormLose = {};
								$scope.teamFormLose.team_play = team.team_play + 1;
								$scope.teamFormLose.team_lose = team.team_lose + 1;
								if($scope.matchData.match_homeTeam === $scope.timerData.match_loser){
									$scope.teamFormLose.goalAgainst = team.team_goalAgainst + $scope.matchData.match_awayTeamObj.score;
									$scope.teamFormLose.goalFor = team.team_goalFor + $scope.matchData.match_homeTeamObj.score;
								}else{
									$scope.teamFormLose.goalAgainst = team.team_goalAgainst + $scope.matchData.match_homeTeamObj.score;	
									$scope.teamFormLose.goalFor = team.team_goalFor + $scope.matchData.match_awayTeamObj.score;
								}
								TeamService.editTeamById(team.id, $scope.teamFormLose).success(function(data) {
				            		console.log(data);
				                }).error(function(data) {});

							}).error(function(data) {
								$ionicLoading.hide();
							});
						
							// update match data
							MatchService.editMatchById($scope.matchData.id,$scope.timerData).success(function(data) {
								// setTimeout(function(){
									$ionicLoading.hide();
								// },1000);
								$state.go('app.match_detail', {
									'matchId': $scope.matchData.id
								});
							}).error(function(data) {});

						}).error(function(data) {});

					},2000);

				}).error(function(data) {
					console.log("gagal");
				});		
			}else{

				CompetitionService.getClassementByCompIdAndTeamName($scope.matchData.competition_id, $scope.matchData.match_homeTeam).success(function(data) {
					console.log(data);

					$scope.classementFormDraw.play = parseInt(data.play) + 1;
					$scope.classementFormDraw.point = parseInt(data.point) + 1;
					$scope.classementFormDraw.draw = parseInt(data.draw) + 1;
					$scope.classementFormDraw.goalAgainst = data.goalAgainst + $scope.matchData.match_awayTeamObj.score;
					$scope.classementFormDraw.goalFor = data.goalFor + $scope.matchData.match_homeTeamObj.score;
					$scope.classementFormDraw.goalDifference = $scope.classementFormDraw.goalFor - $scope.classementFormDraw.goalAgainst;
					console.log($scope.classementFormDraw);

					setTimeout(function(){
						// update classement data
						ClassementService.editClassementById(data.id,$scope.classementFormDraw).success(function(data) {
							console.log(data);
							console.log("berhasil");
						}).error(function(data) {});

						// update team data
						TeamService.getTeamByName($scope.matchData.match_homeTeam).success(function(team){
							$scope.teamFormDraw = {};
							$scope.teamFormDraw.team_play = team.team_play + 1;
							$scope.teamFormDraw.team_point = team.team_point + 1;
							$scope.teamFormDraw.team_draw = team.team_draw + 1;
							$scope.teamFormDraw.goalAgainst = team.team_goalAgainst + $scope.matchData.match_awayTeamObj.score;
							$scope.teamFormDraw.goalFor = team.team_goalFor + $scope.matchData.match_homeTeamObj.score;
							$scope.teamFormDraw.goalDifference = $scope.teamFormDraw.goalFor - $scope.teamFormDraw.goalAgainst;

							TeamService.editTeamById(team.id, $scope.teamFormDraw).success(function(data) {
			            		console.log(data);
			                }).error(function(data) {});

						}).error(function(data) {
							$ionicLoading.hide();
						});

		                // update referee profile
		                LoginService.getUserByUsername($scope.matchData.match_referee).success(function(referee){
		                	$scope.refereeForm = {};
		                	$scope.refereeForm.matchManaged = referee.matchManaged + 1;
							LoginService.editUser(referee.id, localStorage.getItem("token"),$scope.refereeForm).success(function(data) {
	                    		console.log(data);
	                    	}).error(function(data) {});	
						}).error(function(data) {});

						// update analyst profile
		                LoginService.getUserByUsername($scope.matchData.match_analyst).success(function(analyst){
		                	$scope.analystForm = {};
		                	$scope.analystForm.matchManaged = analyst.matchManaged + 1;
							LoginService.editUser(analyst.id, localStorage.getItem("token"),$scope.analystForm).success(function(data) {
	                    		console.log(data);
	                    	}).error(function(data) {});	
						}).error(function(data) {});
					},1500);

				}).error(function(data) {
					console.log("gagal");
				});		

				CompetitionService.getClassementByCompIdAndTeamName($scope.matchData.competition_id, $scope.matchData.match_awayTeam).success(function(data) {
					console.log(data);
					// $scope.classementFormDraw = {};
					$scope.classementFormDraw.play = parseInt(data.play) + 1;
					$scope.classementFormDraw.point = parseInt(data.point) + 1;
					$scope.classementFormDraw.draw = parseInt(data.draw) + 1;
					$scope.classementFormDraw.goalAgainst = data.goalAgainst + $scope.matchData.match_homeTeamObj.score;
					$scope.classementFormDraw.goalFor = data.goalFor + $scope.matchData.match_awayTeamObj.score;
					$scope.classementFormDraw.goalDifference = $scope.classementFormDraw.goalFor - $scope.classementFormDraw.goalAgainst;
					console.log($scope.classementFormDraw);

					setTimeout(function(){
						// update classement data
						ClassementService.editClassementById(data.id,$scope.classementFormDraw).success(function(data) {
							console.log(data);
							console.log("berhasil");

							// update team data
							TeamService.getTeamByName($scope.matchData.match_awayTeam).success(function(team){
								$scope.teamFormDraw = {};
								$scope.teamFormDraw.team_play = team.team_play + 1;
								$scope.teamFormDraw.team_point = team.team_point + 1;
								$scope.teamFormDraw.team_draw = team.team_draw + 1;
								$scope.teamFormDraw.goalAgainst = team.team_goalAgainst + $scope.matchData.match_homeTeamObj.score;
								$scope.teamFormDraw.goalFor = team.team_goalFor + $scope.matchData.match_awayTeamObj.score;
								$scope.teamFormDraw.goalDifference = $scope.teamFormDraw.goalFor - $scope.teamFormDraw.goalAgainst;

								TeamService.editTeamById(team.id, $scope.teamFormDraw).success(function(data) {
				            		console.log(data);
				                }).error(function(data) {});

							}).error(function(data) {
								$ionicLoading.hide();
							});
						
							// update match data
							MatchService.editMatchById($scope.matchData.id,$scope.timerData).success(function(data) {
								// setTimeout(function(){
									$ionicLoading.hide();
								// },1000);
								$state.go('app.match_detail', {
									'matchId': $scope.matchData.id
								});
							}).error(function(data) {});

						}).error(function(data) {});

					},2000);

				}).error(function(data) {
					console.log("gagal");
				});		
			}

		}else if($scope.matchData.match_homeTeamObj.score === $scope.matchData.match_awayTeamObj.score){
			console.log("nope");
			$scope.timerData.timer_status = "2nd half stopped (ET)";
			$scope.timerData.extraTime = {};
			$scope.timerData.extraTime.status = true;
			$scope.timerData.extraTime.homeTeamScore = $scope.matchData.match_homeTeamObj.score;
			$scope.timerData.extraTime.awayTeamScore = $scope.matchData.match_awayTeamObj.score;
			MatchService.editMatchById($scope.matchData.id,$scope.timerData).success(function(data) {
				setTimeout(function(){
					$ionicLoading.hide();
				},1000);
			}).error(function(data) {
				setTimeout(function(){
					$ionicLoading.hide();
				},1000);
			});

		}else{
			if($scope.matchData.match_homeTeamObj.score > $scope.matchData.match_awayTeamObj.score){
				$scope.timerData.match_winner = $scope.matchData.match_homeTeam;
				$scope.timerData.match_loser = $scope.matchData.match_awayTeam;
			}else{
				$scope.timerData.match_winner = $scope.matchData.match_awayTeam;
				$scope.timerData.match_loser = $scope.matchData.match_homeTeam;
			}
			$scope.timerData.match_status = "finished";
			$scope.timerData.timer_status = "2nd half stopped (ET)";
			$scope.timerData.live_status = false;
			$scope.timerData.extraTime = {};
			$scope.timerData.extraTime.status = true;
			$scope.timerData.extraTime.homeTeamScore = $scope.matchData.match_homeTeamObj.score;
			$scope.timerData.extraTime.awayTeamScore = $scope.matchData.match_awayTeamObj.score;

			// update next round match
			CompetitionService.getCompetitionById($scope.matchData.competition_id,localStorage.getItem("token")).success(function(comp) {
				console.log(comp);
				if($scope.matchData.match_fixture === 'play off'){
					console.log("play off");
					if(comp.comp_numOfTeam === 32){
						var fixture = 'round of 16';
						CompetitionService.getMatchByCompIdFixtureAndLastPair($scope.matchData.competition_id,fixture,$scope.matchData.match_pair).success(function(match) {
							match.forEach(function(m){
								console.log(m);
								if($scope.matchData.pair_status === 'home'){
									m.match_homeTeam = $scope.timerData.match_winner;
									m.match_homeTeamObj.team_name = $scope.timerData.match_winner;
								}else{
									m.match_awayTeam = $scope.timerData.match_winner;
									m.match_awayTeamObj.team_name = $scope.timerData.match_winner;
								}
								console.log(m);
								// update next round match data
								MatchService.editMatchById(m.id,m).success(function(data) {
									console.log(data);
								}).error(function(data) {});
							})
						}).error(function(data) {});
					}else if(comp.comp_numOfTeam === 16){
						var fixture = 'quarter final';
						CompetitionService.getMatchByCompIdFixtureAndLastPair($scope.matchData.competition_id,fixture,$scope.matchData.match_pair).success(function(match) {
							match.forEach(function(m){
								console.log(m);
								if($scope.matchData.pair_status === 'home'){
									m.match_homeTeam = $scope.timerData.match_winner;
									m.match_homeTeamObj.team_name = $scope.timerData.match_winner;
								}else{
									m.match_awayTeam = $scope.timerData.match_winner;
									m.match_awayTeamObj.team_name = $scope.timerData.match_winner;
								}
								console.log(m);
								// update next round match data
								MatchService.editMatchById(m.id,m).success(function(data) {
									console.log(data);
								}).error(function(data) {});
							})
						}).error(function(data) {});
					}else{
						var fixture = 'semi final';
						CompetitionService.getMatchByCompIdFixtureAndLastPair($scope.matchData.competition_id,fixture,$scope.matchData.match_pair).success(function(match) {
							match.forEach(function(m){
								console.log(m);
								if($scope.matchData.pair_status === 'home'){
									m.match_homeTeam = $scope.timerData.match_winner;
									m.match_homeTeamObj.team_name = $scope.timerData.match_winner;
								}else{
									m.match_awayTeam = $scope.timerData.match_winner;
									m.match_awayTeamObj.team_name = $scope.timerData.match_winner;
								}
								console.log(m);
								// update next round match data
								MatchService.editMatchById(m.id,m).success(function(data) {
									console.log(data);
								}).error(function(data) {});
							})
						}).error(function(data) {});
					}
				}else if($scope.matchData.match_fixture === 'round of 16'){
					var fixture = 'quarter final';
					CompetitionService.getMatchByCompIdFixtureAndLastPair($scope.matchData.competition_id,fixture,$scope.matchData.match_pair).success(function(match) {
						match.forEach(function(m){
							console.log(m);
							if($scope.matchData.pair_status === 'home'){
								m.match_homeTeam = $scope.timerData.match_winner;
								m.match_homeTeamObj.team_name = $scope.timerData.match_winner;
							}else{
								m.match_awayTeam = $scope.timerData.match_winner;
								m.match_awayTeamObj.team_name = $scope.timerData.match_winner;
							}
							console.log(m);
							// update next round match data
							MatchService.editMatchById(m.id,m).success(function(data) {
								console.log(data);
							}).error(function(data) {});
						})
					}).error(function(data) {});
				}else if($scope.matchData.match_fixture === 'quarter final'){
					var fixture = 'semi final';
					CompetitionService.getMatchByCompIdFixtureAndLastPair($scope.matchData.competition_id,fixture,$scope.matchData.match_pair).success(function(match) {
						match.forEach(function(m){
							console.log(m);
							if($scope.matchData.pair_status === 'home'){
								m.match_homeTeam = $scope.timerData.match_winner;
								m.match_homeTeamObj.team_name = $scope.timerData.match_winner;
							}else{
								m.match_awayTeam = $scope.timerData.match_winner;
								m.match_awayTeamObj.team_name = $scope.timerData.match_winner;
							}
							console.log(m);
							// update next round match data
							MatchService.editMatchById(m.id,m).success(function(data) {
								console.log(data);
							}).error(function(data) {});
						})
					}).error(function(data) {});
				}else if($scope.matchData.match_fixture === 'semi final'){
					var fixture = 'final';
					CompetitionService.getMatchByCompIdFixtureAndLastPair($scope.matchData.competition_id,fixture,$scope.matchData.match_pair).success(function(match) {
						match.forEach(function(m){
							console.log(m);
							if($scope.matchData.pair_status === 'home'){
								m.match_homeTeam = $scope.timerData.match_winner;
								m.match_homeTeamObj.team_name = $scope.timerData.match_winner;
							}else{
								m.match_awayTeam = $scope.timerData.match_winner;
								m.match_awayTeamObj.team_name = $scope.timerData.match_winner;
							}
							console.log(m);
							// update next round match data
							MatchService.editMatchById(m.id,m).success(function(data) {
								console.log(data);
							}).error(function(data) {});
						})
					}).error(function(data) {});
				}
			}).error(function(data) {});

			console.log($scope.matchData.competition_id);
			console.log($scope.timerData.match_winner);

			setTimeout(function(){

				// update team data
				TeamService.getTeamByName($scope.matchData.match_homeTeam).success(function(team){
					$scope.teamFormWin = {};
					$scope.teamFormWin.team_play = team.team_play + 1;
					$scope.teamFormWin.team_point = team.team_point + 3;
					$scope.teamFormWin.team_win = team.team_win + 1;
					if($scope.matchData.match_homeTeam === $scope.timerData.match_winner){
						$scope.teamFormWin.goalAgainst = team.team_goalAgainst + $scope.matchData.match_awayTeamObj.score;
						$scope.teamFormWin.goalFor = team.team_goalFor + $scope.matchData.match_homeTeamObj.score;
					}else{
						$scope.teamFormWin.goalAgainst = team.team_goalAgainst + $scope.matchData.match_homeTeamObj.score;	
						$scope.teamFormWin.goalFor = team.team_goalFor + $scope.matchData.match_awayTeamObj.score;
					}
					TeamService.editTeamById(team.id, $scope.teamFormWin).success(function(data) {
	            		console.log(data);
	                }).error(function(data) {});
				}).error(function(data) {
					$ionicLoading.hide();
				});

                // update referee profile
                LoginService.getUserByUsername($scope.matchData.match_referee).success(function(referee){
                	$scope.refereeForm = {};
                	$scope.refereeForm.matchManaged = referee.matchManaged + 1;
					LoginService.editUser(referee.id, localStorage.getItem("token"),$scope.refereeForm).success(function(data) {
                		console.log(data);
                	}).error(function(data) {});	
				}).error(function(data) {});

				// update analyst profile
                LoginService.getUserByUsername($scope.matchData.match_analyst).success(function(analyst){
                	$scope.analystForm = {};
                	$scope.analystForm.matchManaged = analyst.matchManaged + 1;
					LoginService.editUser(analyst.id, localStorage.getItem("token"),$scope.analystForm).success(function(data) {
                		console.log(data);
                	}).error(function(data) {});	
				}).error(function(data) {});
			},1500);

			setTimeout(function(){

				// update team data
				TeamService.getTeamByName($scope.matchData.match_awayTeam).success(function(team){
					$scope.teamFormLose = {};
					$scope.teamFormLose.team_play = team.team_play + 1;
					$scope.teamFormLose.team_lose = team.team_lose + 1;
					if($scope.matchData.match_homeTeam === $scope.timerData.match_loser){
						$scope.teamFormLose.goalAgainst = team.team_goalAgainst + $scope.matchData.match_awayTeamObj.score;
						$scope.teamFormLose.goalFor = team.team_goalFor + $scope.matchData.match_homeTeamObj.score;
					}else{
						$scope.teamFormLose.goalAgainst = team.team_goalAgainst + $scope.matchData.match_homeTeamObj.score;	
						$scope.teamFormLose.goalFor = team.team_goalFor + $scope.matchData.match_awayTeamObj.score;
					}
					TeamService.editTeamById(team.id, $scope.teamFormLose).success(function(data) {
	            		console.log(data);
	                }).error(function(data) {});

				}).error(function(data) {
					$ionicLoading.hide();
				});
			
				// update match data
				MatchService.editMatchById($scope.matchData.id,$scope.timerData).success(function(data) {
					// setTimeout(function(){
						$ionicLoading.hide();
					// },1000);
					$state.go('app.match_detail', {
						'matchId': $scope.matchData.id
					});
				}).error(function(data) {});
			},2000);
		}
	};

	$scope.stopPenaltyShootout = function() {
		$rootScope.showLoading();
		$scope.timerData.timer_status = "penalty shootout stopped";
		$scope.timerData.match_status = "finished";
		$scope.timerData.live_status = false;
		MatchService.editMatchById($scope.matchData.id,$scope.timerData).success(function(data) {
			setTimeout(function(){
				$ionicLoading.hide();
			},1000);
			$state.go('app.match_detail', {
				'matchId': $scope.matchData.id
			});
		}).error(function(data) {
			setTimeout(function(){
				$ionicLoading.hide();
			},1000);
		});
		clearInterval($scope.loadMatch);
		clearInterval($scope.loadTimer);
	};

	$scope.homeScore = {};
	$scope.homeScore.match_homeTeamObj = {};
	$scope.homeScore.goalHome = {};
	$scope.awayScore = {};
	$scope.awayScore.match_awayTeamObj = {};
	$scope.awayScore.goalAway = {};
	$scope.homeAssist = {};
	$scope.homeAssist.assistHome = {};
	$scope.awayAssist = {};
	$scope.awayAssist.assistAway = {};
	$scope.homeYellow = {};
	$scope.homeYellow.yellowCardHome = {};
	$scope.homeYellow.match_homeTeamObj = {};
	$scope.awayYellow = {};
	$scope.awayYellow.yellowCardAway = {};
	$scope.awayYellow.match_awayTeamObj = {};
	$scope.homeRed = {};
	$scope.homeRed.redCardHome = {};
	$scope.homeRed.match_homeTeamObj = {};
	$scope.awayRed = {};
	$scope.awayRed.redCardAway = {};
	$scope.awayRed.match_awayTeamObj = {};
	$scope.homeSub = {};
	$scope.homeSub.substituteHome = {};
	$scope.homeSub.match_homeTeamObj = {};
	$scope.awaySub = {};
	$scope.awaySub.substituteAway = {};
	$scope.awaySub.match_awayTeamObj = {};
	$scope.selectedStatus = false;
	$scope.playerOutStatus = false;
	$scope.playerInStatus = false;


	$scope.showAssistPlayerHome = function(){
		var scorers = document.getElementsByName("scorer");
		var assist = document.getElementsByName("assist");
		$scope.selectedStatus = true;

		for (var a = 0; a < scorers.length; a++) {
	        if (scorers[a].checked) {
	            scorer = (scorers[a].value);
	            console.log(scorer);
	            break;
	        }
	    }

	    MatchService.getMatchById($stateParams.matchId).success(function(data){
			$scope.matchData = data;
			console.log($scope.matchData);
			$scope.assistPlayerArr = $scope.matchData.match_homeTeamObj.lastLineup.split(",");

			var index = $scope.assistPlayerArr.indexOf(scorer);

			$scope.assistPlayerArr.splice(index, 1);

			$ionicLoading.hide();

		}).error(function(data){
			$ionicLoading.hide();
		});
	};

	$scope.showAssistPlayerAway = function(){
		var scorers = document.getElementsByName("scorer");
		var assist = document.getElementsByName("assist");
		$scope.selectedStatus = true;

		for (var a = 0; a < scorers.length; a++) {
	        if (scorers[a].checked) {
	            scorer = (scorers[a].value);
	            console.log(scorer);
	            break;
	        }
	    }

	    MatchService.getMatchById($stateParams.matchId).success(function(data){
			$scope.matchData = data;
			console.log($scope.matchData);
			$scope.assistPlayerArr = $scope.matchData.match_awayTeamObj.lastLineup.split(",");

			var index = $scope.assistPlayerArr.indexOf(scorer);

			$scope.assistPlayerArr.splice(index, 1);

			$ionicLoading.hide();

		}).error(function(data){
			$ionicLoading.hide();
		});
	};

	$scope.showSelectedStatus = function(){
		$scope.selectedStatus = true;
	};

	$scope.setPlayerOutStatus = function(){
		$scope.playerOutStatus = true;
	};

	$scope.setPlayerInStatus = function(){
		$scope.playerInStatus = true;
	};

	$scope.addGoalHome = function() {
		var scorers = document.getElementsByName("scorer");
		var assists = document.getElementsByName("assist");
		
	    for (var s = 0; s < scorers.length; s++) {

	    	for (var a = 0; a < assists.length; a++) {
		        if (assists[a].checked) {
		            assist = (assists[a].value);
		            console.log(assist);
		            break;
		        }else{
		        	assist = 'no assist';
		        }
		    }

	        if (scorers[s].checked) {
	            scorer = (scorers[s].value);
	            console.log(scorer);
	            console.log(assist);
				MatchService.getMatchById($stateParams.matchId).success(function(data){
					$scope.matchData = data;
					console.log($scope.matchData);
					$ionicLoading.hide();
					$scope.homeScore.match_eventNumber = $scope.matchData.match_eventNumber + 1;
					$scope.homeScore.match_homeTeamObj.formation = $scope.matchData.match_homeTeamObj.formation;
					$scope.homeScore.match_homeTeamObj.lineup = $scope.matchData.match_homeTeamObj.lineup;
					$scope.homeScore.match_homeTeamObj.lastLineup = $scope.matchData.match_homeTeamObj.lastLineup;
					$scope.homeScore.match_homeTeamObj.player = $scope.matchData.match_homeTeamObj.player;
					$scope.homeScore.match_homeTeamObj.score = $scope.matchData.match_homeTeamObj.score + 1;
					$scope.homeScore.match_homeTeamObj.sub = $scope.matchData.match_homeTeamObj.sub;
					$scope.homeScore.match_homeTeamObj.lastSub = $scope.matchData.match_homeTeamObj.lastSub;
					$scope.homeScore.match_homeTeamObj.team_name = $scope.matchData.match_homeTeamObj.team_name;
					$scope.arrAway = [];
					$scope.lastArrAway = 0;
					$scope.arrHome = [];
					$scope.goalAwayDataArr = [];
					$scope.lastArrHome = 0;

					var scoreAway = $scope.matchData.goalAway.scoreAway;
					if(scoreAway == 0){
						console.log("0");
						$scope.lastAwayDataArr = 0;
					}else if(scoreAway.toString().indexOf(",") !== -1){
						console.log("Ga ada");
						$scope.goalAwayDataArr = $scope.matchData.goalAway.scoreAway.split(",");
						$scope.lastAwayDataArr = $scope.goalAwayDataArr.length;
					}else{
						$scope.lastAwayDataArr = 1;
					}
					
					
					console.log($scope.lastAwayDataArr);

					if($scope.matchData.goalHome.scoreAway !== ''){
						if($scope.matchData.goalHome.scoreAway.toString().indexOf(",") !== -1){
							$scope.arrAway = $scope.matchData.goalHome.scoreAway.split(',');
							$scope.lastArrAway = $scope.arrAway[$scope.arrAway.length-1];
							console.log($scope.lastArrAway);
							$scope.arrHome = $scope.matchData.goalHome.scoreHome.split(',');
							$scope.lastArrHome = $scope.arrHome[$scope.arrHome.length-1];
							console.log($scope.lastArrHome);
						}else{
							$scope.lastArrAway = $scope.matchData.goalHome.scoreAway;
							console.log($scope.lastArrAway);
							$scope.lastArrHome = $scope.matchData.goalHome.scoreHome;
							console.log($scope.lastArrHome);
						}
					}else{
						$scope.lastArrAway = $scope.matchData.goalHome = 0;
						$scope.lastArrHome = $scope.matchData.goalHome = 0;
						console.log($scope.lastArrAway);
						console.log($scope.lastArrHome);
					}	
					console.log("scorer");
					console.log($scope.matchData.goalHome.scorer);
					if($scope.matchData.goalHome.scorer !== ''){
						resultHome = parseInt($scope.lastArrHome,10);	
						console.log(resultHome);
						resultAway = parseInt($scope.lastAwayDataArr,10);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
						console.log(resultAway);
						$scope.homeScore.goalHome.scorer = $scope.matchData.goalHome.scorer + ',' + scorer;
						$scope.homeScore.goalHome.assist = $scope.matchData.goalHome.assist + ',' + assist;
						$scope.homeScore.goalHome.time = $scope.matchData.goalHome.time + ',' + $scope.matchData.timer;
						$scope.homeScore.goalHome.scoreHome = $scope.matchData.goalHome.scoreHome + ',' + (resultHome + 1);
						$scope.homeScore.goalHome.scoreAway = $scope.matchData.goalHome.scoreAway + ',' + resultAway;
						$scope.homeScore.goalHome.goalStatus = $scope.matchData.goalHome.goalStatus + ',' + 'goal';
						$scope.homeScore.goalHome.eventNumber = $scope.matchData.goalHome.eventNumber + ',' + $scope.matchData.match_eventNumber;
					}else{
						resultAway = parseInt($scope.lastAwayDataArr,10);   
						$scope.homeScore.goalHome.scorer = scorer;
						$scope.homeScore.goalHome.assist = assist;
						$scope.homeScore.goalHome.time = $scope.matchData.timer;
						$scope.homeScore.goalHome.scoreHome = 1;
						$scope.homeScore.goalHome.scoreAway = resultAway;
						$scope.homeScore.goalHome.goalStatus = 'goal';
						$scope.homeScore.goalHome.eventNumber = $scope.matchData.match_eventNumber;
					}
					console.log($scope.homeScore);

					// update match data
					MatchService.editMatchById($stateParams.matchId,$scope.homeScore).success(function(data) {
						console.log("sdfjh sdfjshfsjdhf sjdfhsdjfshdfjshdfs jkdfhskjfdh");
						// $ionicLoading.hide();
					}).error(function(data) {
						// $ionicLoading.hide();
					});

					// update player data
					LoginService.getUserByUsername(scorer).success(function(player){
						$scope.profileForm = {};
						$scope.profileForm.goal = player.goal + 1;

						LoginService.editUser(player.id, localStorage.getItem("token"), $scope.profileForm).success(function(data) {
							console.log(data);
	                    }).error(function(data) {});

					}).error(function(data) {});

					if(assist !== 'no assist'){
						LoginService.getUserByUsername(assist).success(function(player){
							$scope.profileForm = {};
							$scope.profileForm.assist = player.assist + 1;

							LoginService.editUser(player.id, localStorage.getItem("token"), $scope.profileForm).success(function(data) {
								console.log(data);
		                    }).error(function(data) {});

						}).error(function(data) {});
					}

					setTimeout(function(){
						$ionicLoading.hide();
						$scope.modal_goal.hide();
					},1500);

				}).error(function(data){
					$ionicLoading.hide();
				});
	            break;
	        }
	    }   
	};

	$scope.addGoalAway = function() {
		var scorers = document.getElementsByName("scorer");
		var assists = document.getElementsByName("assist");
		
	    for (var s = 0; s < scorers.length; s++) {

	    	for (var a = 0; a < assists.length; a++) {
		        if (assists[a].checked) {
		            assist = (assists[a].value);
		            console.log(assist);
		            break;
		        }else{
		        	assist = 'no assist';
		        }
		    }

	        if (scorers[s].checked) {
	            scorer = (scorers[s].value);
	            console.log(scorer);
				MatchService.getMatchById($stateParams.matchId).success(function(data){
					$scope.matchData = data;
					console.log($scope.matchData);
					$ionicLoading.hide();
					$scope.awayScore.match_eventNumber = $scope.matchData.match_eventNumber + 1;
					$scope.awayScore.match_awayTeamObj.formation = $scope.matchData.match_awayTeamObj.formation;
					$scope.awayScore.match_awayTeamObj.lineup = $scope.matchData.match_awayTeamObj.lineup;
					$scope.awayScore.match_awayTeamObj.lastLineup = $scope.matchData.match_awayTeamObj.lastLineup;
					$scope.awayScore.match_awayTeamObj.player = $scope.matchData.match_awayTeamObj.player;
					$scope.awayScore.match_awayTeamObj.score = $scope.matchData.match_awayTeamObj.score + 1;
					$scope.awayScore.match_awayTeamObj.sub = $scope.matchData.match_awayTeamObj.sub;
					$scope.awayScore.match_awayTeamObj.lastSub = $scope.matchData.match_awayTeamObj.lastSub;
					$scope.awayScore.match_awayTeamObj.team_name = $scope.matchData.match_awayTeamObj.team_name;
					$scope.arrAway = [];
					$scope.lastArrAway = 0;
					$scope.arrHome = [];
					$scope.lastArrHome = 0;
					$scope.goalHomeDataArr = [];
					
					var scoreHome = $scope.matchData.goalHome.scoreHome;
					if(scoreHome == 0){
						console.log("0");
						$scope.lastHomeDataArr = 0;
					}else if(scoreHome.toString().indexOf(",") !== -1){
						console.log("Ga ada");
						$scope.goalHomeDataArr = $scope.matchData.goalHome.scoreHome.split(",");
						$scope.lastHomeDataArr = $scope.goalHomeDataArr.length;
					}else{
						$scope.lastHomeDataArr = 1;
					}
					
					console.log($scope.lastHomeDataArr);

					if($scope.matchData.goalAway.scoreAway !== ''){
						if($scope.matchData.goalAway.scoreAway.toString().indexOf(",") !== -1){s
							$scope.arrAway = $scope.matchData.goalAway.scoreAway.split(',');
							$scope.lastArrAway = $scope.arrAway[$scope.arrAway.length-1];
							console.log($scope.lastArrAway);
							$scope.arrHome = $scope.matchData.goalAway.scoreHome.split(',');
							$scope.lastArrHome = $scope.arrHome[$scope.arrHome.length-1];
							console.log($scope.lastArrHome);
						}else{
							$scope.lastArrAway = $scope.matchData.goalAway.scoreAway;
							console.log($scope.lastArrAway);
							$scope.lastArrHome = $scope.matchData.goalAway.scoreHome;
							console.log($scope.lastArrHome);
						}
					}else{
						$scope.lastArrAway = $scope.matchData.goalAway = 0;
						$scope.lastArrHome = $scope.matchData.goalHome = 0;
						console.log($scope.lastArrAway);
						console.log($scope.lastArrHome);
					}	
					console.log("scorer");
					console.log($scope.matchData.goalAway.scorer);
					if($scope.matchData.goalAway.scorer !== ''){
						resultHome = parseInt($scope.lastHomeDataArr,10);	
						console.log(resultHome);
						resultAway = parseInt($scope.lastArrAway,10);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
						console.log(resultAway);
						$scope.awayScore.goalAway.scorer = $scope.matchData.goalAway.scorer + ',' + scorer;
						$scope.awayScore.goalAway.assist = $scope.matchData.goalAway.assist + ',' + assist;
						$scope.awayScore.goalAway.time = $scope.matchData.goalAway.time + ',' + $scope.matchData.timer;
						$scope.awayScore.goalAway.scoreAway = $scope.matchData.goalAway.scoreAway + ',' + (resultAway + 1);
						$scope.awayScore.goalAway.scoreHome = $scope.matchData.goalAway.scoreHome + ',' + resultHome;
						$scope.awayScore.goalAway.goalStatus = $scope.matchData.goalAway.goalStatus + ',' + 'goal';
						$scope.awayScore.goalAway.eventNumber = $scope.matchData.goalAway.eventNumber + ',' + $scope.matchData.match_eventNumber;
					}else{
						resultHome = parseInt($scope.lastHomeDataArr,10);	
						$scope.awayScore.goalAway.scorer = scorer;
						$scope.awayScore.goalAway.assist = assist;
						$scope.awayScore.goalAway.time = $scope.matchData.timer;
						$scope.awayScore.goalAway.scoreAway = 1;
						$scope.awayScore.goalAway.scoreHome = resultHome;
						$scope.awayScore.goalAway.goalStatus = 'goal';
						$scope.awayScore.goalAway.eventNumber = $scope.matchData.match_eventNumber;
					}
					console.log($scope.awayScore);

					// update match data
					MatchService.editMatchById($stateParams.matchId,$scope.awayScore).success(function(data) {
						console.log("sdfjh sdfjshfsjdhf sjdfhsdjfshdfjshdfs jkdfhskjfdh");
						// $ionicLoading.hide();
						// $scope.modal_goal.hide();
					}).error(function(data) {
						// $ionicLoading.hide();
					});

					// update player data
					LoginService.getUserByUsername(scorer).success(function(player){
						$scope.profileForm = {};
						$scope.profileForm.goal = player.goal + 1;

						LoginService.editUser(player.id, localStorage.getItem("token"), $scope.profileForm).success(function(data) {
	                    }).error(function(data) {});

					}).error(function(data) {});

					if(assist !== 'no assist'){
						LoginService.getUserByUsername(assist).success(function(player){
							$scope.profileForm = {};
							$scope.profileForm.assist = player.assist + 1;

							LoginService.editUser(player.id, localStorage.getItem("token"), $scope.profileForm).success(function(data) {
		                    }).error(function(data) {});

						}).error(function(data) {});
					}

					setTimeout(function(){
						$ionicLoading.hide();
						$scope.modal_goal.hide();
					},1500);

				}).error(function(data){
					$ionicLoading.hide();
				});
	            break;
	        }
	    }
	};

	$scope.addOwnGoalAway = function() {
		var scorers = document.getElementsByName("scorer");
		var assists = document.getElementsByName("assist");
		
	    for (var s = 0; s < scorers.length; s++) {

	    	assist = 'no assist';

	        if (scorers[s].checked) {
	            scorer = (scorers[s].value);
	            console.log(scorer);
				MatchService.getMatchById($stateParams.matchId).success(function(data){
					$scope.matchData = data;
					console.log($scope.matchData);
					$ionicLoading.hide();
					$scope.homeScore.match_eventNumber = $scope.matchData.match_eventNumber + 1;
					$scope.homeScore.match_homeTeamObj.formation = $scope.matchData.match_homeTeamObj.formation;
					$scope.homeScore.match_homeTeamObj.lineup = $scope.matchData.match_homeTeamObj.lineup;
					$scope.homeScore.match_homeTeamObj.lastLineup = $scope.matchData.match_homeTeamObj.lastLineup;
					$scope.homeScore.match_homeTeamObj.player = $scope.matchData.match_homeTeamObj.player;
					$scope.homeScore.match_homeTeamObj.score = $scope.matchData.match_homeTeamObj.score + 1;
					$scope.homeScore.match_homeTeamObj.sub = $scope.matchData.match_homeTeamObj.sub;
					$scope.homeScore.match_homeTeamObj.lastSub = $scope.matchData.match_homeTeamObj.lastSub;
					$scope.homeScore.match_homeTeamObj.team_name = $scope.matchData.match_homeTeamObj.team_name;
					$scope.arrAway = [];
					$scope.lastArrAway = 0;
					$scope.arrHome = [];
					$scope.lastArrHome = 0;
					$scope.goalAwayDataArr = [];

					var scoreAway = $scope.matchData.goalAway.scoreAway;
					if(scoreAway == 0){
						console.log("0");
						$scope.lastAwayDataArr = 0;
					}else if(scoreAway.toString().indexOf(",") !== -1){
						console.log("Ga ada");
						$scope.goalAwayDataArr = $scope.matchData.goalAway.scoreAway.split(",");
						$scope.lastAwayDataArr = $scope.goalAwayDataArr.length;
					}else{
						$scope.lastAwayDataArr = 1;
					}
					
					
					console.log($scope.lastAwayDataArr);

					if($scope.matchData.goalHome.scoreAway !== ''){
						if($scope.matchData.goalHome.scoreAway.toString().indexOf(",") !== -1){s
							$scope.arrAway = $scope.matchData.goalHome.scoreAway.split(',');
							$scope.lastArrAway = $scope.arrAway[$scope.arrAway.length-1];
							console.log($scope.lastArrAway);
							$scope.arrHome = $scope.matchData.goalHome.scoreHome.split(',');
							$scope.lastArrHome = $scope.arrHome[$scope.arrHome.length-1];
							console.log($scope.lastArrHome);
						}else{
							$scope.lastArrAway = $scope.matchData.goalHome.scoreAway;
							console.log($scope.lastArrAway);
							$scope.lastArrHome = $scope.matchData.goalHome.scoreHome;
							console.log($scope.lastArrHome);
						}
					}else{
						$scope.lastArrAway = $scope.matchData.goalHome = 0;
						$scope.lastArrHome = $scope.matchData.goalHome = 0;
						console.log($scope.lastArrAway);
						console.log($scope.lastArrHome);
					}	
					console.log("scorer");
					console.log($scope.matchData.goalHome.scorer);
					if($scope.matchData.goalHome.scorer !== ''){
						resultHome = parseInt($scope.lastArrHome,10);	
						console.log(resultHome);
						resultAway = parseInt($scope.lastAwayDataArr,10);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
						console.log(resultAway);
						$scope.homeScore.goalHome.scorer = $scope.matchData.goalHome.scorer + ',' + scorer;
						$scope.homeScore.goalHome.assist = $scope.matchData.goalHome.assist + ',' + assist;
						$scope.homeScore.goalHome.time = $scope.matchData.goalHome.time + ',' + $scope.matchData.timer;
						$scope.homeScore.goalHome.scoreHome = $scope.matchData.goalHome.scoreHome + ',' + (resultHome + 1);
						$scope.homeScore.goalHome.scoreAway = $scope.matchData.goalHome.scoreAway + ',' + resultAway;
						$scope.homeScore.goalHome.goalStatus = $scope.matchData.goalHome.goalStatus + ',' + 'own goal';
						$scope.homeScore.goalHome.eventNumber = $scope.matchData.goalHome.eventNumber + ',' + $scope.matchData.match_eventNumber;
					}else{
						resultAway = parseInt($scope.lastAwayDataArr,10);   
						$scope.homeScore.goalHome.scorer = scorer;
						$scope.homeScore.goalHome.assist = assist;
						$scope.homeScore.goalHome.time = $scope.matchData.timer;
						$scope.homeScore.goalHome.scoreHome = 1;
						$scope.homeScore.goalHome.scoreAway = resultAway;
						$scope.homeScore.goalHome.goalStatus = 'own goal';
						$scope.homeScore.goalHome.eventNumber = $scope.matchData.match_eventNumber;
					}
					console.log($scope.homeScore);
					MatchService.editMatchById($stateParams.matchId,$scope.homeScore).success(function(data) {
						console.log("sdfjh sdfjshfsjdhf sjdfhsdjfshdfjshdfs jkdfhskjfdh");
						$ionicLoading.hide();
						$scope.modal_goal.hide();
					}).error(function(data) {
						$ionicLoading.hide();
					});
				}).error(function(data){
					$ionicLoading.hide();
				});
	            break;
	        }
	    }
	};

	$scope.addOwnGoalHome = function() {
		var scorers = document.getElementsByName("scorer");
		var assists = document.getElementsByName("assist");
		
	    for (var s = 0; s < scorers.length; s++) {

	    	assist = 'no assist';

	        if (scorers[s].checked) {
	            scorer = (scorers[s].value);
	            console.log(scorer);
				MatchService.getMatchById($stateParams.matchId).success(function(data){
					$scope.matchData = data;
					console.log($scope.matchData);
					$ionicLoading.hide();
					$scope.awayScore.match_eventNumber = $scope.matchData.match_eventNumber + 1;
					$scope.awayScore.match_awayTeamObj.formation = $scope.matchData.match_awayTeamObj.formation;
					$scope.awayScore.match_awayTeamObj.lineup = $scope.matchData.match_awayTeamObj.lineup;
					$scope.awayScore.match_awayTeamObj.lastLineup = $scope.matchData.match_awayTeamObj.lastLineup;
					$scope.awayScore.match_awayTeamObj.player = $scope.matchData.match_awayTeamObj.player;
					$scope.awayScore.match_awayTeamObj.score = $scope.matchData.match_awayTeamObj.score + 1;
					$scope.awayScore.match_awayTeamObj.sub = $scope.matchData.match_awayTeamObj.sub;
					$scope.awayScore.match_awayTeamObj.lastSub = $scope.matchData.match_awayTeamObj.lastSub;
					$scope.awayScore.match_awayTeamObj.team_name = $scope.matchData.match_awayTeamObj.team_name;
					$scope.arrAway = [];
					$scope.lastArrAway = 0;
					$scope.arrHome = [];
					$scope.lastArrHome = 0;
					$scope.goalHomeDataArr = [];
					
					var scoreHome = $scope.matchData.goalHome.scoreHome;
					if(scoreHome == 0){
						console.log("0");
						$scope.lastHomeDataArr = 0;
					}else if(scoreHome.toString().indexOf(",") !== -1){
						console.log("Ga ada");
						$scope.goalHomeDataArr = $scope.matchData.goalHome.scoreHome.split(",");
						$scope.lastHomeDataArr = $scope.goalHomeDataArr.length;
					}else{
						$scope.lastHomeDataArr = 1;
					}
					
					
					console.log($scope.lastHomeDataArr);

					if($scope.matchData.goalAway.scoreAway !== ''){
						if($scope.matchData.goalAway.scoreAway.toString().indexOf(",") !== -1){s
							$scope.arrAway = $scope.matchData.goalAway.scoreAway.split(',');
							$scope.lastArrAway = $scope.arrAway[$scope.arrAway.length-1];
							console.log($scope.lastArrAway);
							$scope.arrHome = $scope.matchData.goalAway.scoreHome.split(',');
							$scope.lastArrHome = $scope.arrHome[$scope.arrHome.length-1];
							console.log($scope.lastArrHome);
						}else{
							$scope.lastArrAway = $scope.matchData.goalAway.scoreAway;
							console.log($scope.lastArrAway);
							$scope.lastArrHome = $scope.matchData.goalAway.scoreHome;
							console.log($scope.lastArrHome);
						}
					}else{
						$scope.lastArrAway = $scope.matchData.goalAway = 0;
						$scope.lastArrHome = $scope.matchData.goalHome = 0;
						console.log($scope.lastArrAway);
						console.log($scope.lastArrHome);
					}	
					console.log("scorer");
					console.log($scope.matchData.goalAway.scorer);
					if($scope.matchData.goalAway.scorer !== ''){
						resultHome = parseInt($scope.lastHomeDataArr,10);	
						console.log(resultHome);
						resultAway = parseInt($scope.lastArrAway,10);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
						console.log(resultAway);
						$scope.awayScore.goalAway.scorer = $scope.matchData.goalAway.scorer + ',' + scorer;
						$scope.awayScore.goalAway.assist = $scope.matchData.goalAway.assist + ',' + assist;
						$scope.awayScore.goalAway.time = $scope.matchData.goalAway.time + ',' + $scope.matchData.timer;
						$scope.awayScore.goalAway.scoreAway = $scope.matchData.goalAway.scoreAway + ',' + (resultAway + 1);
						$scope.awayScore.goalAway.scoreHome = $scope.matchData.goalAway.scoreHome + ',' + resultHome;
						$scope.awayScore.goalAway.goalStatus = $scope.matchData.goalAway.goalStatus + ',' + 'own goal';
						$scope.awayScore.goalAway.eventNumber = $scope.matchData.goalAway.eventNumber + ',' + $scope.matchData.match_eventNumber;
					}else{
						resultHome = parseInt($scope.lastHomeDataArr,10);	
						$scope.awayScore.goalAway.scorer = scorer;
						$scope.awayScore.goalAway.assist = assist;
						$scope.awayScore.goalAway.time = $scope.matchData.timer;
						$scope.awayScore.goalAway.scoreAway = 1;
						$scope.awayScore.goalAway.scoreHome = resultHome;
						$scope.awayScore.goalAway.goalStatus = 'own goal';
						$scope.awayScore.goalAway.eventNumber = $scope.matchData.match_eventNumber;
					}
					console.log($scope.awayScore);
					MatchService.editMatchById($stateParams.matchId,$scope.awayScore).success(function(data) {
						console.log("sdfjh sdfjshfsjdhf sjdfhsdjfshdfjshdfs jkdfhskjfdh");
						$ionicLoading.hide();
						$scope.modal_goal.hide();
					}).error(function(data) {
						$ionicLoading.hide();
					});
				}).error(function(data){
					$ionicLoading.hide();
				});
	            break;
	        }
	    }
	};

	$scope.addPenaltyGoalHome = function() {
		var scorers = document.getElementsByName("scorer");
		
	    for (var s = 0; s < scorers.length; s++) {

	    	assist = 'no assist';

	        if (scorers[s].checked) {
	            scorer = (scorers[s].value);
	            console.log(scorer);
	            console.log(assist);
				MatchService.getMatchById($stateParams.matchId).success(function(data){
					$scope.matchData = data;
					console.log($scope.matchData);
					$ionicLoading.hide();
					$scope.homeScore.match_eventNumber = $scope.matchData.match_eventNumber + 1;
					$scope.homeScore.match_homeTeamObj.formation = $scope.matchData.match_homeTeamObj.formation;
					$scope.homeScore.match_homeTeamObj.lineup = $scope.matchData.match_homeTeamObj.lineup;
					$scope.homeScore.match_homeTeamObj.lastLineup = $scope.matchData.match_homeTeamObj.lastLineup;
					$scope.homeScore.match_homeTeamObj.player = $scope.matchData.match_homeTeamObj.player;
					$scope.homeScore.match_homeTeamObj.score = $scope.matchData.match_homeTeamObj.score + 1;
					$scope.homeScore.match_homeTeamObj.sub = $scope.matchData.match_homeTeamObj.sub;
					$scope.homeScore.match_homeTeamObj.lastSub = $scope.matchData.match_homeTeamObj.lastSub;
					$scope.homeScore.match_homeTeamObj.team_name = $scope.matchData.match_homeTeamObj.team_name;
					$scope.arrAway = [];
					$scope.lastArrAway = 0;
					$scope.arrHome = [];
					$scope.lastArrHome = 0;
					$scope.goalAwayDataArr = [];
					
					var scoreAway = $scope.matchData.goalAway.scoreAway;
					if(scoreAway == 0){
						console.log("0");
						$scope.lastAwayDataArr = 0;
					}else if(scoreAway.toString().indexOf(",") !== -1){
						console.log("Ga ada");
						$scope.goalAwayDataArr = $scope.matchData.goalAway.scoreAway.split(",");
						$scope.lastAwayDataArr = $scope.goalAwayDataArr.length;
					}else{
						$scope.lastAwayDataArr = 1;
					}
					
					console.log($scope.lastAwayDataArr);

					if($scope.matchData.goalHome.scoreAway !== ''){
						if($scope.matchData.goalHome.scoreAway.toString().indexOf(",") !== -1){s
							$scope.arrAway = $scope.matchData.goalHome.scoreAway.split(',');
							$scope.lastArrAway = $scope.arrAway[$scope.arrAway.length-1];
							console.log($scope.lastArrAway);
							$scope.arrHome = $scope.matchData.goalHome.scoreHome.split(',');
							$scope.lastArrHome = $scope.arrHome[$scope.arrHome.length-1];
							console.log($scope.lastArrHome);
						}else{
							$scope.lastArrAway = $scope.matchData.goalHome.scoreAway;
							console.log($scope.lastArrAway);
							$scope.lastArrHome = $scope.matchData.goalHome.scoreHome;
							console.log($scope.lastArrHome);
						}
					}else{
						$scope.lastArrAway = $scope.matchData.goalHome = 0;
						$scope.lastArrHome = $scope.matchData.goalHome = 0;
						console.log($scope.lastArrAway);
						console.log($scope.lastArrHome);
					}	
					console.log("scorer");
					console.log($scope.matchData.goalHome.scorer);
					if($scope.matchData.goalHome.scorer !== ''){
						resultHome = parseInt($scope.lastArrHome,10);	
						console.log(resultHome);
						resultAway = parseInt($scope.lastAwayDataArr,10);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
						console.log(resultAway);
						$scope.homeScore.goalHome.scorer = $scope.matchData.goalHome.scorer + ',' + scorer;
						$scope.homeScore.goalHome.assist = $scope.matchData.goalHome.assist + ',' + assist;
						$scope.homeScore.goalHome.time = $scope.matchData.goalHome.time + ',' + $scope.matchData.timer;
						$scope.homeScore.goalHome.scoreHome = $scope.matchData.goalHome.scoreHome + ',' + (resultHome + 1);
						$scope.homeScore.goalHome.scoreAway = $scope.matchData.goalHome.scoreAway + ',' + resultAway;
						$scope.homeScore.goalHome.goalStatus = $scope.matchData.goalHome.goalStatus + ',' + 'penalty goal';
						$scope.homeScore.goalHome.eventNumber = $scope.matchData.goalHome.eventNumber + ',' + $scope.matchData.match_eventNumber;
					}else{
						resultAway = parseInt($scope.lastAwayDataArr,10);   
						$scope.homeScore.goalHome.scorer = scorer;
						$scope.homeScore.goalHome.assist = assist;
						$scope.homeScore.goalHome.time = $scope.matchData.timer;
						$scope.homeScore.goalHome.scoreHome = 1;
						$scope.homeScore.goalHome.scoreAway = resultAway;
						$scope.homeScore.goalHome.goalStatus = 'penalty goal';
						$scope.homeScore.goalHome.eventNumber = $scope.matchData.match_eventNumber;
					}
					console.log($scope.homeScore);

					// update match data
					MatchService.editMatchById($stateParams.matchId,$scope.homeScore).success(function(data) {
						console.log("sdfjh sdfjshfsjdhf sjdfhsdjfshdfjshdfs jkdfhskjfdh");
						// $ionicLoading.hide();
						// $scope.modal_goal.hide();
					}).error(function(data) {
						// $ionicLoading.hide();
					});

					// update player data
					LoginService.getUserByUsername(scorer).success(function(player){
						$scope.profileForm = {};
						$scope.profileForm.goal = player.goal + 1;

						LoginService.editUser(player.id, localStorage.getItem("token"), $scope.profileForm).success(function(data) {
							console.log(data);
	                    }).error(function(data) {});

					}).error(function(data) {});

					if(assist !== 'no assist'){
						LoginService.getUserByUsername(assist).success(function(player){
							$scope.profileForm = {};
							$scope.profileForm.assist = player.assist + 1;

							LoginService.editUser(player.id, localStorage.getItem("token"), $scope.profileForm).success(function(data) {
								console.log(data);
		                    }).error(function(data) {});

						}).error(function(data) {});
					}

					setTimeout(function(){
						$ionicLoading.hide();
						$scope.modal_goal.hide();
					},1500);

				}).error(function(data){
					$ionicLoading.hide();
				});
	            break;
	        }
	    }   
	};

	$scope.addPenaltyGoalAway = function() {
		var scorers = document.getElementsByName("scorer");
		
	    for (var s = 0; s < scorers.length; s++) {

	    	assist = 'no assist';

	        if (scorers[s].checked) {
	            scorer = (scorers[s].value);
	            console.log(scorer);
				MatchService.getMatchById($stateParams.matchId).success(function(data){
					$scope.matchData = data;
					console.log($scope.matchData);
					$ionicLoading.hide();
					$scope.awayScore.match_eventNumber = $scope.matchData.match_eventNumber + 1;
					$scope.awayScore.match_awayTeamObj.formation = $scope.matchData.match_awayTeamObj.formation;
					$scope.awayScore.match_awayTeamObj.lineup = $scope.matchData.match_awayTeamObj.lineup;
					$scope.awayScore.match_awayTeamObj.lastLineup = $scope.matchData.match_awayTeamObj.lastLineup;
					$scope.awayScore.match_awayTeamObj.player = $scope.matchData.match_awayTeamObj.player;
					$scope.awayScore.match_awayTeamObj.score = $scope.matchData.match_awayTeamObj.score + 1;
					$scope.awayScore.match_awayTeamObj.sub = $scope.matchData.match_awayTeamObj.sub;
					$scope.awayScore.match_awayTeamObj.lastSub = $scope.matchData.match_awayTeamObj.lastSub;
					$scope.awayScore.match_awayTeamObj.team_name = $scope.matchData.match_awayTeamObj.team_name;
					$scope.arrAway = [];
					$scope.lastArrAway = 0;
					$scope.arrHome = [];
					$scope.lastArrHome = 0;
					$scope.goalHomeDataArr = [];
		
					var scoreHome = $scope.matchData.goalHome.scoreHome;
					if(scoreHome == 0){
						console.log("0");
						$scope.lastHomeDataArr = 0;
					}else if(scoreHome.toString().indexOf(",") !== -1){
						console.log("Ga ada");
						$scope.goalHomeDataArr = $scope.matchData.goalHome.scoreHome.split(",");
						$scope.lastHomeDataArr = $scope.goalHomeDataArr.length;
					}else{
						$scope.lastHomeDataArr = 1;
					}
					
					
					console.log($scope.lastHomeDataArr);

					if($scope.matchData.goalAway.scoreAway !== ''){
						if($scope.matchData.goalAway.scoreAway.toString().indexOf(",") !== -1){s
							$scope.arrAway = $scope.matchData.goalAway.scoreAway.split(',');
							$scope.lastArrAway = $scope.arrAway[$scope.arrAway.length-1];
							console.log($scope.lastArrAway);
							$scope.arrHome = $scope.matchData.goalAway.scoreHome.split(',');
							$scope.lastArrHome = $scope.arrHome[$scope.arrHome.length-1];
							console.log($scope.lastArrHome);
						}else{
							$scope.lastArrAway = $scope.matchData.goalAway.scoreAway;
							console.log($scope.lastArrAway);
							$scope.lastArrHome = $scope.matchData.goalAway.scoreHome;
							console.log($scope.lastArrHome);
						}
					}else{
						$scope.lastArrAway = $scope.matchData.goalAway = 0;
						$scope.lastArrHome = $scope.matchData.goalHome = 0;
						console.log($scope.lastArrAway);
						console.log($scope.lastArrHome);
					}	
					console.log("scorer");
					console.log($scope.matchData.goalAway.scorer);
					if($scope.matchData.goalAway.scorer !== ''){
						resultHome = parseInt($scope.lastHomeDataArr,10);	
						console.log(resultHome);
						resultAway = parseInt($scope.lastArrAway,10);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
						console.log(resultAway);
						$scope.awayScore.goalAway.scorer = $scope.matchData.goalAway.scorer + ',' + scorer;
						$scope.awayScore.goalAway.assist = $scope.matchData.goalAway.assist + ',' + assist;
						$scope.awayScore.goalAway.time = $scope.matchData.goalAway.time + ',' + $scope.matchData.timer;
						$scope.awayScore.goalAway.scoreAway = $scope.matchData.goalAway.scoreAway + ',' + (resultAway + 1);
						$scope.awayScore.goalAway.scoreHome = $scope.matchData.goalAway.scoreHome + ',' + resultHome;
						$scope.awayScore.goalAway.goalStatus = $scope.matchData.goalAway.goalStatus + ',' + 'penalty goal';
						$scope.awayScore.goalAway.eventNumber = $scope.matchData.goalAway.eventNumber + ',' + $scope.matchData.match_eventNumber;
					}else{
						resultHome = parseInt($scope.lastHomeDataArr,10);	
						$scope.awayScore.goalAway.scorer = scorer;
						$scope.awayScore.goalAway.assist = assist;
						$scope.awayScore.goalAway.time = $scope.matchData.timer;
						$scope.awayScore.goalAway.scoreAway = 1;
						$scope.awayScore.goalAway.scoreHome = resultHome;
						$scope.awayScore.goalAway.goalStatus = 'penalty goal';
						$scope.awayScore.goalAway.eventNumber = $scope.matchData.match_eventNumber;
					}
					console.log($scope.awayScore);

					// update match data
					MatchService.editMatchById($stateParams.matchId,$scope.awayScore).success(function(data) {
						console.log("sdfjh sdfjshfsjdhf sjdfhsdjfshdfjshdfs jkdfhskjfdh");
						// $ionicLoading.hide();
						// $scope.modal_goal.hide();
					}).error(function(data) {
						// $ionicLoading.hide();
					});

					// update player data
					LoginService.getUserByUsername(scorer).success(function(player){
						$scope.profileForm = {};
						$scope.profileForm.goal = player.goal + 1;

						LoginService.editUser(player.id, localStorage.getItem("token"), $scope.profileForm).success(function(data) {
							console.log(data);
	                    }).error(function(data) {});

					}).error(function(data) {});

					if(assist !== 'no assist'){
						LoginService.getUserByUsername(assist).success(function(player){
							$scope.profileForm = {};
							$scope.profileForm.assist = player.assist + 1;

							LoginService.editUser(player.id, localStorage.getItem("token"), $scope.profileForm).success(function(data) {
								console.log(data);
		                    }).error(function(data) {});

						}).error(function(data) {});
					}

					setTimeout(function(){
						$ionicLoading.hide();
						$scope.modal_goal.hide();
					},1500);

				}).error(function(data){
					$ionicLoading.hide();
				});
	            break;
	        }
	    }
	};

	$scope.addYellowCardHome = function() {
		var players = document.getElementsByName("scorer");
		
	    for (var s = 0; s < players.length; s++) {

	        if (players[s].checked) {
	            player = (players[s].value);
	            console.log(player);
	            
				MatchService.getMatchById($stateParams.matchId).success(function(data){
					$scope.matchData = data;
					console.log($scope.matchData);

					// update match stats
					data.match_stats.homeYellowCard = data.match_stats.homeYellowCard + 1;
					MatchService.editMatchById($stateParams.matchId,data).success(function(data) {
						console.log("sdfjh sdfjshfsjdhf sjdfhsdjfshdfjshdfs jkdfhskjfdh");
					}).error(function(data) {});


					$ionicLoading.hide();
					// $scope.homeYellow.match_eventNumber = $scope.matchData.match_eventNumber + 1;
					$scope.homeYellow.match_eventNumber = $scope.matchData.match_eventNumber + 1;
					$scope.homeYellow.match_homeTeamObj.formation = $scope.matchData.match_homeTeamObj.formation;
					$scope.homeYellow.match_homeTeamObj.lineup = $scope.matchData.match_homeTeamObj.lineup;
					$scope.homeYellow.match_homeTeamObj.lastLineup = $scope.matchData.match_homeTeamObj.lastLineup;
					$scope.homeYellow.match_homeTeamObj.player = $scope.matchData.match_homeTeamObj.player;
					$scope.homeYellow.match_homeTeamObj.score = $scope.matchData.match_homeTeamObj.score;
					$scope.homeYellow.match_homeTeamObj.sub = $scope.matchData.match_homeTeamObj.sub;
					$scope.homeYellow.match_homeTeamObj.lastSub = $scope.matchData.match_homeTeamObj.lastSub;
					$scope.homeYellow.match_homeTeamObj.team_name = $scope.matchData.match_homeTeamObj.team_name;

					$scope.lastLineupDataArr = $scope.matchData.match_homeTeamObj.lastLineup.split(","); 	

					var yellowCardPlayerArr = $scope.matchData.yellowCardHome.player.split(",");
					if(yellowCardPlayerArr.indexOf(player) > -1){
						console.log("sudah di kartu kuning sekali");

						var index = $scope.lastLineupDataArr.indexOf(player);

						if(index > -1){
							console.log("ada eiii");
							$scope.lastLineupDataArr.splice(index, 1);
						}

						$scope.homeYellow.match_homeTeamObj.lastLineup = $scope.lastLineupDataArr.join(",");
						

						if($scope.matchData.yellowCardHome.player !== ''){
							$scope.homeYellow.yellowCardHome.player = $scope.matchData.yellowCardHome.player + ',' + player;
							$scope.homeYellow.yellowCardHome.time = $scope.matchData.yellowCardHome.time + ',' + $scope.matchData.timer;
							$scope.homeYellow.yellowCardHome.eventNumber = $scope.matchData.yellowCardHome.eventNumber + ',' + $scope.matchData.match_eventNumber;
							$scope.homeYellow.yellowCardHome.status = $scope.matchData.yellowCardHome.status + ',' + 'second yellow card';
						}else{
							$scope.homeYellow.yellowCardHome.player = player;
							$scope.homeYellow.yellowCardHome.time = $scope.matchData.timer;
							$scope.homeYellow.yellowCardHome.eventNumber = $scope.matchData.match_eventNumber;
							$scope.homeYellow.yellowCardHome.status = 'second yellow card';
						}
					}else{
						if($scope.matchData.yellowCardHome.player !== ''){
							$scope.homeYellow.yellowCardHome.player = $scope.matchData.yellowCardHome.player + ',' + player;
							$scope.homeYellow.yellowCardHome.time = $scope.matchData.yellowCardHome.time + ',' + $scope.matchData.timer;
							$scope.homeYellow.yellowCardHome.eventNumber = $scope.matchData.yellowCardHome.eventNumber + ',' + $scope.matchData.match_eventNumber;
							$scope.homeYellow.yellowCardHome.status = $scope.matchData.yellowCardHome.status + ',' + 'first yellow card';
						}else{
							$scope.homeYellow.yellowCardHome.player = player;
							$scope.homeYellow.yellowCardHome.time = $scope.matchData.timer;
							$scope.homeYellow.yellowCardHome.eventNumber = $scope.matchData.match_eventNumber;
							$scope.homeYellow.yellowCardHome.status = 'first yellow card';
						}
					}

					console.log($scope.homeYellow);

					// update match data
					MatchService.editMatchById($stateParams.matchId,$scope.homeYellow).success(function(data) {
						console.log("sdfjh sdfjshfsjdhf sjdfhsdjfshdfjshdfs jkdfhskjfdh");
						// $ionicLoading.hide();
						// $scope.modal_goal.hide();
					}).error(function(data) {
						// $ionicLoading.hide();
					});

					// update player data
					LoginService.getUserByUsername(player).success(function(player){
						$scope.profileForm = {};
						$scope.profileForm.yellowCard = player.yellowCard + 1;

						LoginService.editUser(player.id, localStorage.getItem("token"), $scope.profileForm).success(function(data) {
							console.log(data);
	                    }).error(function(data) {});

					}).error(function(data) {});

					setTimeout(function(){
						$ionicLoading.hide();
						$scope.modal_goal.hide();
					},1500);

				}).error(function(data){
					$ionicLoading.hide();
				});
	            break;
	        }
	    }   
	};

	$scope.addYellowCardAway = function() {
		var players = document.getElementsByName("scorer");
		
	    for (var s = 0; s < players.length; s++) {

	        if (players[s].checked) {
	            player = (players[s].value);
	            console.log(player);
	            
				MatchService.getMatchById($stateParams.matchId).success(function(data){
					$scope.matchData = data;
					console.log($scope.matchData);

					// update match stats
					data.match_stats.awayYellowCard = data.match_stats.awayYellowCard + 1;
					MatchService.editMatchById($stateParams.matchId,data).success(function(data) {
						console.log("sdfjh sdfjshfsjdhf sjdfhsdjfshdfjshdfs jkdfhskjfdh");
					}).error(function(data) {});

					$ionicLoading.hide();
					
					$scope.awayYellow.match_eventNumber = $scope.matchData.match_eventNumber + 1;
					$scope.awayYellow.match_awayTeamObj.formation = $scope.matchData.match_awayTeamObj.formation;
					$scope.awayYellow.match_awayTeamObj.lineup = $scope.matchData.match_awayTeamObj.lineup;
					$scope.awayYellow.match_awayTeamObj.lastLineup = $scope.matchData.match_awayTeamObj.lastLineup;
					$scope.awayYellow.match_awayTeamObj.player = $scope.matchData.match_awayTeamObj.player;
					$scope.awayYellow.match_awayTeamObj.score = $scope.matchData.match_awayTeamObj.score;
					$scope.awayYellow.match_awayTeamObj.sub = $scope.matchData.match_awayTeamObj.sub;
					$scope.awayYellow.match_awayTeamObj.lastSub = $scope.matchData.match_awayTeamObj.lastSub;
					$scope.awayYellow.match_awayTeamObj.team_name = $scope.matchData.match_awayTeamObj.team_name;

					$scope.lastLineupDataArr = $scope.matchData.match_awayTeamObj.lastLineup.split(",");

					var yellowCardPlayerArr = $scope.matchData.yellowCardAway.player.split(",");
					if(yellowCardPlayerArr.indexOf(player) > -1){
						console.log("sudah di kartu kuning sekali");

						var index = $scope.lastLineupDataArr.indexOf(player);

						if(index > -1){
							console.log("ada eiii");
							$scope.lastLineupDataArr.splice(index, 1);
						}

						$scope.awayYellow.match_awayTeamObj.lastLineup = $scope.lastLineupDataArr.join(",");

						if($scope.matchData.yellowCardAway.player !== ''){
							$scope.awayYellow.yellowCardAway.player = $scope.matchData.yellowCardAway.player + ',' + player;
							$scope.awayYellow.yellowCardAway.time = $scope.matchData.yellowCardAway.time + ',' + $scope.matchData.timer;
							$scope.awayYellow.yellowCardAway.status = $scope.matchData.yellowCardAway.status + ',' + 'second yellow card';
							$scope.awayYellow.yellowCardAway.eventNumber = $scope.matchData.yellowCardAway.eventNumber + ',' + $scope.matchData.match_eventNumber;
						}else{
							$scope.awayYellow.yellowCardAway.player = player;
							$scope.awayYellow.yellowCardAway.time = $scope.matchData.timer;
							$scope.awayYellow.yellowCardAway.status = 'second yellow card';
							$scope.awayYellow.yellowCardAway.eventNumber = $scope.matchData.match_eventNumber;
						}
					}else{
						if($scope.matchData.yellowCardAway.player !== ''){
							$scope.awayYellow.yellowCardAway.player = $scope.matchData.yellowCardAway.player + ',' + player;
							$scope.awayYellow.yellowCardAway.time = $scope.matchData.yellowCardAway.time + ',' + $scope.matchData.timer;
							$scope.awayYellow.yellowCardAway.status = $scope.matchData.yellowCardAway.status + ',' + 'first yellow card';
							$scope.awayYellow.yellowCardAway.eventNumber = $scope.matchData.yellowCardAway.eventNumber + ',' + $scope.matchData.match_eventNumber;
						}else{
							$scope.awayYellow.yellowCardAway.player = player;
							$scope.awayYellow.yellowCardAway.time = $scope.matchData.timer;
							$scope.awayYellow.yellowCardAway.status = 'first yellow card';
							$scope.awayYellow.yellowCardAway.eventNumber = $scope.matchData.match_eventNumber;
						}
					}
					
					console.log($scope.awayYellow);

					// update match data
					MatchService.editMatchById($stateParams.matchId,$scope.awayYellow).success(function(data) {
						console.log("sdfjh sdfjshfsjdhf sjdfhsdjfshdfjshdfs jkdfhskjfdh");
						// $ionicLoading.hide();
						// $scope.modal_goal.hide();
					}).error(function(data) {
						// $ionicLoading.hide();
					});

					// update player data
					LoginService.getUserByUsername(player).success(function(player){
						$scope.profileForm = {};
						$scope.profileForm.yellowCard = player.yellowCard + 1;

						LoginService.editUser(player.id, localStorage.getItem("token"), $scope.profileForm).success(function(data) {
							console.log(data);
	                    }).error(function(data) {});

					}).error(function(data) {});

					setTimeout(function(){
						$ionicLoading.hide();
						$scope.modal_goal.hide();
					},1500);

				}).error(function(data){
					$ionicLoading.hide();
				});
	            break;
	        }
	    }   
	};

	$scope.addRedCardHome = function() {
		var players = document.getElementsByName("scorer");
		
	    for (var s = 0; s < players.length; s++) {

	        if (players[s].checked) {
	            player = (players[s].value);
	            console.log(player);
	            
				MatchService.getMatchById($stateParams.matchId).success(function(data){
					$scope.matchData = data;
					console.log($scope.matchData);

					// update match stats
					data.match_stats.homeRedCard = data.match_stats.homeRedCard + 1;
					MatchService.editMatchById($stateParams.matchId,data).success(function(data) {
						console.log("sdfjh sdfjshfsjdhf sjdfhsdjfshdfjshdfs jkdfhskjfdh");
					}).error(function(data) {});


					$ionicLoading.hide();
					
					$scope.homeRed.match_eventNumber = $scope.matchData.match_eventNumber + 1;
					$scope.homeRed.match_homeTeamObj.formation = $scope.matchData.match_homeTeamObj.formation;
					$scope.homeRed.match_homeTeamObj.lineup = $scope.matchData.match_homeTeamObj.lineup;
					$scope.homeRed.match_homeTeamObj.lastLineup = $scope.matchData.match_homeTeamObj.lastLineup;
					$scope.homeRed.match_homeTeamObj.player = $scope.matchData.match_homeTeamObj.player;
					$scope.homeRed.match_homeTeamObj.score = $scope.matchData.match_homeTeamObj.score;
					$scope.homeRed.match_homeTeamObj.sub = $scope.matchData.match_homeTeamObj.sub;
					$scope.homeRed.match_homeTeamObj.lastSub = $scope.matchData.match_homeTeamObj.lastSub;
					$scope.homeRed.match_homeTeamObj.team_name = $scope.matchData.match_homeTeamObj.team_name;

					$scope.lastLineupDataArr = $scope.matchData.match_homeTeamObj.lastLineup.split(",");

					var index = $scope.lastLineupDataArr.indexOf(player);

					if(index > -1){
						console.log("ada eiii");
						$scope.lastLineupDataArr.splice(index, 1);
					}

					$scope.homeRed.match_homeTeamObj.lastLineup = $scope.lastLineupDataArr.join(",");
					

					if($scope.matchData.redCardHome.player !== ''){
						$scope.homeRed.redCardHome.player = $scope.matchData.redCardHome.player + ',' + player;
						$scope.homeRed.redCardHome.time = $scope.matchData.redCardHome.time + ',' + $scope.matchData.timer;
						$scope.homeRed.redCardHome.eventNumber = $scope.matchData.redCardHome.eventNumber + ',' + $scope.matchData.match_eventNumber;
					}else{
						$scope.homeRed.redCardHome.player = player;
						$scope.homeRed.redCardHome.time = $scope.matchData.timer;
						$scope.homeRed.redCardHome.eventNumber = $scope.matchData.match_eventNumber;
					}
					console.log($scope.homeRed);

					// update match data
					MatchService.editMatchById($stateParams.matchId,$scope.homeRed).success(function(data) {
						console.log("sdfjh sdfjshfsjdhf sjdfhsdjfshdfjshdfs jkdfhskjfdh");
						// $ionicLoading.hide();
						// $scope.modal_goal.hide();
					}).error(function(data) {
						// $ionicLoading.hide();
					});

					// update player data
					LoginService.getUserByUsername(player).success(function(player){
						$scope.profileForm = {};
						$scope.profileForm.redCard = player.redCard + 1;

						LoginService.editUser(player.id, localStorage.getItem("token"), $scope.profileForm).success(function(data) {
							console.log(data);
	                    }).error(function(data) {});

					}).error(function(data) {});

					setTimeout(function(){
						$ionicLoading.hide();
						$scope.modal_goal.hide();
					},1500);

				}).error(function(data){
					$ionicLoading.hide();
				});
	            break;
	        }
	    }   
	};

	$scope.addRedCardAway = function() {
		var players = document.getElementsByName("scorer");
		
	    for (var s = 0; s < players.length; s++) {

	        if (players[s].checked) {
	            player = (players[s].value);
	            console.log(player);
	            
				MatchService.getMatchById($stateParams.matchId).success(function(data){
					$scope.matchData = data;
					console.log($scope.matchData);

					// update match stats
					data.match_stats.awayRedCard = data.match_stats.awayRedCard + 1;
					MatchService.editMatchById($stateParams.matchId,data).success(function(data) {
						console.log("sdfjh sdfjshfsjdhf sjdfhsdjfshdfjshdfs jkdfhskjfdh");
					}).error(function(data) {});

					$ionicLoading.hide();
					
					$scope.awayRed.match_eventNumber = $scope.matchData.match_eventNumber + 1;
					$scope.awayRed.match_awayTeamObj.formation = $scope.matchData.match_awayTeamObj.formation;
					$scope.awayRed.match_awayTeamObj.lineup = $scope.matchData.match_awayTeamObj.lineup;
					$scope.awayRed.match_awayTeamObj.lastLineup = $scope.matchData.match_awayTeamObj.lastLineup;
					$scope.awayRed.match_awayTeamObj.player = $scope.matchData.match_awayTeamObj.player;
					$scope.awayRed.match_awayTeamObj.score = $scope.matchData.match_awayTeamObj.score;
					$scope.awayRed.match_awayTeamObj.sub = $scope.matchData.match_awayTeamObj.sub;
					$scope.awayRed.match_awayTeamObj.lastSub = $scope.matchData.match_awayTeamObj.lastSub;
					$scope.awayRed.match_awayTeamObj.team_name = $scope.matchData.match_awayTeamObj.team_name;

					$scope.lastLineupDataArr = $scope.matchData.match_awayTeamObj.lastLineup.split(",");
					var index = $scope.lastLineupDataArr.indexOf(player);

					if(index > -1){
						console.log("ada eiii");
						$scope.lastLineupDataArr.splice(index, 1);
					}

					$scope.awayRed.match_awayTeamObj.lastLineup = $scope.lastLineupDataArr.join(",");

					if($scope.matchData.redCardAway.player !== ''){
						$scope.awayRed.redCardAway.player = $scope.matchData.redCardAway.player + ',' + player;
						$scope.awayRed.redCardAway.time = $scope.matchData.redCardAway.time + ',' + $scope.matchData.timer;
						$scope.awayRed.redCardAway.eventNumber = $scope.matchData.redCardAway.eventNumber + ',' + $scope.matchData.match_eventNumber;					
					}else{
						$scope.awayRed.redCardAway.player = player;
						$scope.awayRed.redCardAway.time = $scope.matchData.timer;
						$scope.awayRed.redCardAway.eventNumber = $scope.matchData.match_eventNumber;
					}
					console.log($scope.awayRed);

					// update match data
					MatchService.editMatchById($stateParams.matchId,$scope.awayRed).success(function(data) {
						console.log("sdfjh sdfjshfsjdhf sjdfhsdjfshdfjshdfs jkdfhskjfdh");
						// $ionicLoading.hide();
						// $scope.modal_goal.hide();
					}).error(function(data) {
						// $ionicLoading.hide();
					});

					// update player data
					LoginService.getUserByUsername(player).success(function(player){
						$scope.profileForm = {};
						$scope.profileForm.redCard = player.redCard + 1;

						LoginService.editUser(player.id, localStorage.getItem("token"), $scope.profileForm).success(function(data) {
							console.log(data);
	                    }).error(function(data) {});

					}).error(function(data) {});

					setTimeout(function(){
						$ionicLoading.hide();
						$scope.modal_goal.hide();
					},1500);

				}).error(function(data){
					$ionicLoading.hide();
				});
	            break;
	        }
	    }   
	};

	$scope.addSubHome = function() {
		var playersIn = document.getElementsByName("playerIn");
		var playersOut = document.getElementsByName("playerOut");
		console.log("sub home");
		for (var o = 0; o < playersOut.length; o++) {
	        if (playersOut[o].checked) {
	            playerOut = (playersOut[o].value);
	            // console.log(assist);
	            break;
	        }
	    }

	    for (var i = 0; i < playersIn.length; i++) {

	        if (playersIn[i].checked) {
	            playerIn = (playersIn[i].value);
	            console.log(playerIn)
	            console.log(playerOut);
	            
				MatchService.getMatchById($stateParams.matchId).success(function(data){
					$scope.matchData = data;
					console.log($scope.matchData);	
					$ionicLoading.hide();
				
					$scope.homeSub.match_eventNumber = $scope.matchData.match_eventNumber + 1;
					$scope.homeSub.match_homeTeamObj.formation = $scope.matchData.match_homeTeamObj.formation;
					$scope.homeSub.match_homeTeamObj.lineup = $scope.matchData.match_homeTeamObj.lineup;
					$scope.homeSub.match_homeTeamObj.lastLineup = $scope.matchData.match_homeTeamObj.lastLineup;
					$scope.homeSub.match_homeTeamObj.player = $scope.matchData.match_homeTeamObj.player;
					$scope.homeSub.match_homeTeamObj.score = $scope.matchData.match_homeTeamObj.score;
					$scope.homeSub.match_homeTeamObj.sub = $scope.matchData.match_homeTeamObj.sub;
					$scope.homeSub.match_homeTeamObj.lastSub = $scope.matchData.match_homeTeamObj.lastSub;
					$scope.homeSub.match_homeTeamObj.team_name = $scope.matchData.match_homeTeamObj.team_name;

					$scope.lastLineupDataArr = $scope.matchData.match_homeTeamObj.lastLineup.split(",");
					$scope.lastSubDataArr = $scope.matchData.match_homeTeamObj.lastSub.split(",");

					var index = $scope.lastLineupDataArr.indexOf(playerOut);

					if(index > -1){
						console.log("ada eiii");
						$scope.lastLineupDataArr[index] = playerIn;
						$scope.homeSub.match_homeTeamObj.lastLineup = $scope.lastLineupDataArr.join(",");
					}

					var subIndex = $scope.lastSubDataArr.indexOf(playerIn);

					if(subIndex > -1){
						console.log("ada eiii");
						$scope.lastSubDataArr.splice(subIndex, 1);
						$scope.homeSub.match_homeTeamObj.lastSub = $scope.lastSubDataArr.join(",");
					}

										
					if($scope.matchData.substituteHome.in !== ''){
						$scope.homeSub.substituteHome.in = $scope.matchData.substituteHome.in + ',' + playerIn;
						$scope.homeSub.substituteHome.out = $scope.matchData.substituteHome.out + ',' + playerOut;
						$scope.homeSub.substituteHome.time = $scope.matchData.substituteHome.time + ',' + $scope.matchData.timer;
						$scope.homeSub.substituteHome.eventNumber = $scope.matchData.substituteHome.eventNumber + ',' + $scope.matchData.match_eventNumber;					
					}else{
						$scope.homeSub.substituteHome.in = playerIn;
						$scope.homeSub.substituteHome.out = playerOut;
						$scope.homeSub.substituteHome.time = $scope.matchData.timer;
						$scope.homeSub.substituteHome.eventNumber = $scope.matchData.match_eventNumber;
					}
					console.log($scope.homeSub);

					// update match data
					MatchService.editMatchById($stateParams.matchId,$scope.homeSub).success(function(data) {
						console.log("sdfjh sdfjshfsjdhf sjdfhsdjfshdfjshdfs jkdfhskjfdh");
						// $ionicLoading.hide();
						// $scope.modal_goal.hide();
					}).error(function(data) {
						// $ionicLoading.hide();
					});

					// update player data
					LoginService.getUserByUsername(playerIn).success(function(player){
						$scope.profileForm = {};
						$scope.profileForm.play = player.play + 1;

						LoginService.editUser(player.id, localStorage.getItem("token"), $scope.profileForm).success(function(data) {
							console.log(data);
	                    }).error(function(data) {});

					}).error(function(data) {});

					setTimeout(function(){
						$ionicLoading.hide();
						$scope.modal_goal.hide();
					},1500);

				}).error(function(data){
					$ionicLoading.hide();
				});
	            break;
	        }
	    }   
	};

	$scope.addSubAway = function() {
		var playersIn = document.getElementsByName("playerIn");
		var playersOut = document.getElementsByName("playerOut");
		console.log("sub away");
		for (var o = 0; o < playersOut.length; o++) {
	        if (playersOut[o].checked) {
	            playerOut = (playersOut[o].value);
	            // console.log(assist);
	            break;
	        }
	    }

	    for (var i = 0; i < playersIn.length; i++) {

	        if (playersIn[i].checked) {
	            playerIn = (playersIn[i].value);
	            console.log(playerIn)
	            console.log(playerOut);
	            
				MatchService.getMatchById($stateParams.matchId).success(function(data){
					$scope.matchData = data;
					console.log($scope.matchData);	
					$ionicLoading.hide();

					$scope.awaySub.match_eventNumber = $scope.matchData.match_eventNumber + 1;
					$scope.awaySub.match_awayTeamObj.formation = $scope.matchData.match_awayTeamObj.formation;
					$scope.awaySub.match_awayTeamObj.lineup = $scope.matchData.match_awayTeamObj.lineup;
					$scope.awaySub.match_awayTeamObj.lastLineup = $scope.matchData.match_awayTeamObj.lastLineup;
					$scope.awaySub.match_awayTeamObj.player = $scope.matchData.match_awayTeamObj.player;
					$scope.awaySub.match_awayTeamObj.score = $scope.matchData.match_awayTeamObj.score;
					$scope.awaySub.match_awayTeamObj.sub = $scope.matchData.match_awayTeamObj.sub;
					$scope.awaySub.match_awayTeamObj.lastSub = $scope.matchData.match_awayTeamObj.lastSub;
					$scope.awaySub.match_awayTeamObj.team_name = $scope.matchData.match_awayTeamObj.team_name;

					$scope.lastLineupDataArr = $scope.matchData.match_awayTeamObj.lastLineup.split(",");
					$scope.lastSubDataArr = $scope.matchData.match_awayTeamObj.lastSub.split(",");

					var index = $scope.lastLineupDataArr.indexOf(playerOut);

					if(index > -1){
						console.log("ada eiii");
						$scope.lastLineupDataArr[index] = playerIn;
						$scope.awaySub.match_awayTeamObj.lastLineup = $scope.lastLineupDataArr.join(",");
					}

					var subIndex = $scope.lastSubDataArr.indexOf(playerIn);

					if(subIndex > -1){
						console.log("ada eiii");
						$scope.lastSubDataArr.splice(subIndex, 1);
						$scope.awaySub.match_awayTeamObj.lastSub = $scope.lastSubDataArr.join(",");
					}
					

					if($scope.matchData.substituteAway.in !== ''){
						$scope.awaySub.substituteAway.in = $scope.matchData.substituteAway.in + ',' + playerIn;
						$scope.awaySub.substituteAway.out = $scope.matchData.substituteAway.out + ',' + playerOut;
						$scope.awaySub.substituteAway.time = $scope.matchData.substituteAway.time + ',' + $scope.matchData.timer;
						$scope.awaySub.substituteAway.eventNumber = $scope.matchData.substituteAway.eventNumber + ',' + $scope.matchData.match_eventNumber;					
					}else{
						$scope.awaySub.substituteAway.in = playerIn;
						$scope.awaySub.substituteAway.out = playerOut;
						$scope.awaySub.substituteAway.time = $scope.matchData.timer;
						$scope.awaySub.substituteAway.eventNumber = $scope.matchData.match_eventNumber;
					}
					console.log($scope.awaySub);

					// update match data
					MatchService.editMatchById($stateParams.matchId,$scope.awaySub).success(function(data) {
						console.log("sdfjh sdfjshfsjdhf sjdfhsdjfshdfjshdfs jkdfhskjfdh");
						// $ionicLoading.hide();
						// $scope.modal_goal.hide();
					}).error(function(data) {
						// $ionicLoading.hide();
					});

					// update player data
					LoginService.getUserByUsername(playerIn).success(function(player){
						$scope.profileForm = {};
						$scope.profileForm.play = player.play + 1;

						LoginService.editUser(player.id, localStorage.getItem("token"), $scope.profileForm).success(function(data) {
							console.log(data);
	                    }).error(function(data) {});

					}).error(function(data) {});

					setTimeout(function(){
						$ionicLoading.hide();
						$scope.modal_goal.hide();
					},1500);

				}).error(function(data){
					$ionicLoading.hide();
				});
	            break;
	        }
	    }   
	};

	// Modal
	$ionicModal.fromTemplateUrl('modals/modal.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal){
		$scope.modal = modal;
	});
	$scope.teamData = {};
	$scope.squadData = [];
	$scope.squadDataArr = [];

    $scope.openLineUpHome = function() {
		$ionicLoading.show({
			content: 'Login...',
			animation: 'fade-in',
			showBackdrop: true,
		});
	      $scope.modal.show();
	      console.log($scope.matchData);
	      TeamService.getTeamByName($scope.matchData.match_homeTeam).success(function(data){
				$scope.teamData = data;
				console.log($scope.teamData);
				// $ionicLoading.hide();
				$scope.squadData = $scope.teamData.team_squad.split(',');
				for(var i in $scope.squadData){
					LoginService.getUserByUsername($scope.squadData[i]).success(function(data){
						if(data !== null){
							$scope.squadDataArr.push(data);
						}
						console.log($scope.squadDataArr);
						$ionicLoading.hide();
					}).error(function(data) {
						$ionicLoading.hide();
					});
				}
			}).error(function(data) {
				$ionicLoading.hide();
			});
    };

    $scope.openLineUpAway = function() {
	 	$ionicLoading.show({
			content: 'Login...',
			animation: 'fade-in',
			showBackdrop: true,
		});
	      $scope.modal.show();
	      console.log($scope.matchData);
	      TeamService.getTeamByName($scope.matchData.match_awayTeam).success(function(data){
				$scope.teamData = data;
				console.log($scope.teamData);
				// $ionicLoading.hide();
				$scope.squadData = $scope.teamData.team_squad.split(',');
				for(var i in $scope.squadData){
					LoginService.getUserByUsername($scope.squadData[i]).success(function(data){
						if(data !== null){
							$scope.squadDataArr.push(data);
						}
						console.log($scope.squadDataArr);
						$ionicLoading.hide();
					}).error(function(data) {
						$ionicLoading.hide();
					});
				}
			}).error(function(data) {
				$ionicLoading.hide();
			});
    };
	
    $scope.closeModal = function() {
      $scope.modal.hide();
      $scope.squadDataArr = [];
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
    //Modal//
    //Modal Goal//
	$ionicModal.fromTemplateUrl('modals/modal_goal.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal_goal){
		$scope.modal_goal = modal_goal;
	});
	$scope.teamData = {};
	$scope.lineupData = [];
	$scope.lineupDataArr = [];
	$scope.status = "";
	$scope.redCardPlayerHome = [];
	$scope.redCardPlayerAway = [];
	$scope.firstYellowCardPlayerHome = [];
	$scope.secondYellowCardPlayerHome = [];
	$scope.firstYellowCardPlayerAway = [];
	$scope.secondYellowCardPlayerAway = [];

    $scope.goalHome = function() {
			$ionicLoading.show({
				content: 'Login...',
				animation: 'fade-in',
				showBackdrop: true,
			});
			$scope.assistPlayerArr = [];
			$scope.status = "goalHome";
		    $scope.modal_goal.show();

		   	MatchService.getMatchById($stateParams.matchId).success(function(data){
		   		var lineupArr = data.match_homeTeamObj.lineup.split(",");
		   		$scope.lineupDataArr = data.match_homeTeamObj.lastLineup.split(",");
		   		var yellowCardedStatusHomeArr = data.yellowCardHome.status.split(",");
		   		var yellowCardedPlayerHomeArr = data.yellowCardHome.player.split(",");

		   		if(data.redCardHome.player === ''){
		   			$scope.redCardedPlayerHome = [];
		   		}else{	
		   			if(data.redCardHome.player.toString().indexOf(",") === -1){
						$scope.redCardedPlayerHome = data.redCardHome.player;
		   			}else{
		   				$scope.redCardedPlayerHome = data.redCardHome.player.split(",");
		   			}
		   		}
				
				for(var p = 0; p < yellowCardedPlayerHomeArr.length; p++){
					if(yellowCardedStatusHomeArr[p] === 'second yellow card'){
						console.log("second yellow card : " + yellowCardedPlayerHomeArr[p])
						$scope.secondYellowCardPlayerHome.push(yellowCardedPlayerHomeArr[p]);
					}
				}

		   		// for(var l = 0; l < lineupArr.length; l++){
		   		// 	if($scope.lineupDataArr.indexOf(lineupArr[l]) === -1){
		   		// 		console.log(lineupArr[l]);
		   		// 		$scope.redCardPlayerHome.push(lineupArr[l]);
		   		// 	}
		   		// }
				$ionicLoading.hide();
			}).error(function(data){
				$ionicLoading.hide();
			});
	};  

    $scope.goalAway = function() {
	    // if($scope.matchData.timer_status === null || $scope.matchData.timer_status === 'started'){
		 	$ionicLoading.show({
				content: 'Login...',
				animation: 'fade-in',
				showBackdrop: true,
			});
			$scope.assistPlayerArr = [];
			$scope.status = "goalAway";
		    $scope.modal_goal.show();

		   	MatchService.getMatchById($stateParams.matchId).success(function(data){
		   		var lineupArr = data.match_awayTeamObj.lineup.split(",");
		   		$scope.lineupDataArr = data.match_awayTeamObj.lastLineup.split(",");
		   		var yellowCardedStatusAwayArr = data.yellowCardAway.status.split(",");
		   		var yellowCardedPlayerAwayArr = data.yellowCardAway.player.split(",");


		   		if(data.redCardAway.player === ''){
		   			$scope.redCardedPlayerAway = [];
		   		}else{	
		   			if(data.redCardAway.player.toString().indexOf(",") === -1){
						$scope.redCardedPlayerAway = data.redCardAway.player;
		   			}else{
		   				$scope.redCardedPlayerAway = data.redCardAway.player.split(",");
		   			}
		   		}
		   		
		
				for(var p = 0; p < yellowCardedPlayerAwayArr.length; p++){
					if(yellowCardedStatusAwayArr[p] === 'second yellow card'){
						console.log("second yellow card : " + yellowCardedPlayerAwayArr[p])
						$scope.secondYellowCardPlayerAway.push(yellowCardedPlayerAwayArr[p]);
					}
				}


		   		// for(var l = 0; l < lineupArr.length; l++){
		   		// 	if($scope.lineupDataArr.indexOf(lineupArr[l]) === -1){
		   		// 		console.log(lineupArr[l]);
		   		// 		$scope.redCardPlayerAway.push(lineupArr[l]);
		   		// 	}
		   		// }
				$ionicLoading.hide();
			}).error(function(data){
				$ionicLoading.hide();
			});
		// }	
	};

	$scope.ownGoalHome = function() {
	    // if($scope.matchData.timer_status === null || $scope.matchData.timer_status === 'started'){
			$ionicLoading.show({
				content: 'Login...',
				animation: 'fade-in',
				showBackdrop: true,
			});
			$scope.status = "ownGoalHome";
		    $scope.modal_goal.show();

		   	MatchService.getMatchById($stateParams.matchId).success(function(data){
		   		var lineupArr = data.match_homeTeamObj.lineup.split(",");
		   		$scope.lineupDataArr = data.match_homeTeamObj.lastLineup.split(",");
		   		var yellowCardedStatusHomeArr = data.yellowCardHome.status.split(",");
		   		var yellowCardedPlayerHomeArr = data.yellowCardHome.player.split(",");

		   		if(data.redCardHome.player === ''){
		   			$scope.redCardedPlayerHome = [];
		   		}else{	
		   			if(data.redCardHome.player.toString().indexOf(",") === -1){
						$scope.redCardedPlayerHome = data.redCardHome.player;
		   			}else{
		   				$scope.redCardedPlayerHome = data.redCardHome.player.split(",");
		   			}
		   		}
				
				for(var p = 0; p < yellowCardedPlayerHomeArr.length; p++){
					if(yellowCardedStatusHomeArr[p] === 'second yellow card'){
						console.log("second yellow card : " + yellowCardedPlayerHomeArr[p])
						$scope.secondYellowCardPlayerHome.push(yellowCardedPlayerHomeArr[p]);
					}
				}

		   		// for(var l = 0; l < lineupArr.length; l++){
		   		// 	if($scope.lineupDataArr.indexOf(lineupArr[l]) === -1){
		   		// 		console.log(lineupArr[l]);
		   		// 		$scope.redCardPlayerHome.push(lineupArr[l]);
		   		// 	}
		   		// }
				$ionicLoading.hide();
			}).error(function(data){
				$ionicLoading.hide();
			});
		// }
	};  

	$scope.ownGoalAway = function() {
	    // if($scope.matchData.timer_status === null || $scope.matchData.timer_status === 'started'){
			$ionicLoading.show({
				content: 'Login...',
				animation: 'fade-in',
				showBackdrop: true,
			});
			$scope.status = "ownGoalAway";
		    $scope.modal_goal.show();

		   	MatchService.getMatchById($stateParams.matchId).success(function(data){
		   		var lineupArr = data.match_awayTeamObj.lineup.split(",");
		   		$scope.lineupDataArr = data.match_awayTeamObj.lastLineup.split(",");
		   		var yellowCardedStatusAwayArr = data.yellowCardAway.status.split(",");
		   		var yellowCardedPlayerAwayArr = data.yellowCardAway.player.split(",");

		   		if(data.redCardAway.player === ''){
		   			$scope.redCardedPlayerAway = [];
		   		}else{	
		   			if(data.redCardAway.player.toString().indexOf(",") === -1){
						$scope.redCardedPlayerAway = data.redCardAway.player;
		   			}else{
		   				$scope.redCardedPlayerAway = data.redCardAway.player.split(",");
		   			}
		   		}
				
				for(var p = 0; p < yellowCardedPlayerAwayArr.length; p++){
					if(yellowCardedStatusAwayArr[p] === 'second yellow card'){
						console.log("second yellow card : " + yellowCardedPlayerAwayArr[p])
						$scope.secondYellowCardPlayerAway.push(yellowCardedPlayerAwayArr[p]);
					}
				}

		   		// for(var l = 0; l < lineupArr.length; l++){
		   		// 	if($scope.lineupDataArr.indexOf(lineupArr[l]) === -1){
		   		// 		console.log(lineupArr[l]);
		   		// 		$scope.redCardPlayerAway.push(lineupArr[l]);
		   		// 	}
		   		// }
				$ionicLoading.hide();
			}).error(function(data){
				$ionicLoading.hide();
			});
		// }
	};

	$scope.penaltyGoalHome = function() {
	    // if($scope.matchData.timer_status === null || $scope.matchData.timer_status === 'started'){
			$ionicLoading.show({
				content: 'Login...',
				animation: 'fade-in',
				showBackdrop: true,
			});
			$scope.status = "penaltyGoalHome";
		    $scope.modal_goal.show();

		   	MatchService.getMatchById($stateParams.matchId).success(function(data){
		   		var lineupArr = data.match_homeTeamObj.lineup.split(",");
		   		$scope.lineupDataArr = data.match_homeTeamObj.lastLineup.split(",");
		   		var yellowCardedStatusHomeArr = data.yellowCardHome.status.split(",");
		   		var yellowCardedPlayerHomeArr = data.yellowCardHome.player.split(",");

		   		if(data.redCardHome.player === ''){
		   			$scope.redCardedPlayerHome = [];
		   		}else{	
		   			if(data.redCardHome.player.toString().indexOf(",") === -1){
						$scope.redCardedPlayerHome = data.redCardHome.player;
		   			}else{
		   				$scope.redCardedPlayerHome = data.redCardHome.player.split(",");
		   			}
		   		}
				
				for(var p = 0; p < yellowCardedPlayerHomeArr.length; p++){
					if(yellowCardedStatusHomeArr[p] === 'second yellow card'){
						console.log("second yellow card : " + yellowCardedPlayerHomeArr[p])
						$scope.secondYellowCardPlayerHome.push(yellowCardedPlayerHomeArr[p]);
					}
				}

		   		// for(var l = 0; l < lineupArr.length; l++){
		   		// 	if($scope.lineupDataArr.indexOf(lineupArr[l]) === -1){
		   		// 		console.log(lineupArr[l]);
		   		// 		$scope.redCardPlayerHome.push(lineupArr[l]);
		   		// 	}
		   		// }
				$ionicLoading.hide();
			}).error(function(data){
				$ionicLoading.hide();
			});
		// }
	};  

    $scope.penaltyGoalAway = function() {
	    // if($scope.matchData.timer_status === null || $scope.matchData.timer_status === 'started'){
		 	$ionicLoading.show({
				content: 'Login...',
				animation: 'fade-in',
				showBackdrop: true,
			});
			$scope.status = "penaltyGoalAway";
		     $scope.modal_goal.show();
		    
		   	MatchService.getMatchById($stateParams.matchId).success(function(data){
		   		var lineupArr = data.match_awayTeamObj.lineup.split(",");
		   		$scope.lineupDataArr = data.match_awayTeamObj.lastLineup.split(",");
		   		var yellowCardedStatusAwayArr = data.yellowCardAway.status.split(",");
		   		var yellowCardedPlayerAwayArr = data.yellowCardAway.player.split(",");

		   		if(data.redCardAway.player === ''){
		   			$scope.redCardedPlayerAway = [];
		   		}else{	
		   			if(data.redCardAway.player.toString().indexOf(",") === -1){
						$scope.redCardedPlayerAway = data.redCardAway.player;
		   			}else{
		   				$scope.redCardedPlayerAway = data.redCardAway.player.split(",");
		   			}
		   		}
				
				for(var p = 0; p < yellowCardedPlayerAwayArr.length; p++){
					if(yellowCardedStatusAwayArr[p] === 'second yellow card'){
						console.log("second yellow card : " + yellowCardedPlayerAwayArr[p])
						$scope.secondYellowCardPlayerAway.push(yellowCardedPlayerAwayArr[p]);
					}
				}

		   		// for(var l = 0; l < lineupArr.length; l++){
		   		// 	if($scope.lineupDataArr.indexOf(lineupArr[l]) === -1){
		   		// 		console.log(lineupArr[l]);
		   		// 		$scope.redCardPlayerAway.push(lineupArr[l]);
		   		// 	}
		   		// }
				$ionicLoading.hide();
			}).error(function(data){
				$ionicLoading.hide();
			});
		// }	
	};

	$scope.yellowCardHome = function() {
	    // if($scope.matchData.timer_status === null || $scope.matchData.timer_status === 'started'){
			$ionicLoading.show({
				content: 'Login...',
				animation: 'fade-in',
				showBackdrop: true,
			});
			$scope.status = "yellowCardHome";
		    $scope.modal_goal.show();

		   	MatchService.getMatchById($stateParams.matchId).success(function(data){
		   		var lineupArr = data.match_homeTeamObj.lineup.split(",");
		   		$scope.lineupDataArr = data.match_homeTeamObj.lastLineup.split(",");
		   		var yellowCardedStatusHomeArr = data.yellowCardHome.status.split(",");
		   		var yellowCardedPlayerHomeArr = data.yellowCardHome.player.split(",");

		   		if(data.redCardHome.player === ''){
		   			$scope.redCardedPlayerHome = [];
		   		}else{	
		   			if(data.redCardHome.player.toString().indexOf(",") === -1){
						$scope.redCardedPlayerHome = data.redCardHome.player;
		   			}else{
		   				$scope.redCardedPlayerHome = data.redCardHome.player.split(",");
		   			}
		   		}
				
				for(var p = 0; p < yellowCardedPlayerHomeArr.length; p++){
					if(yellowCardedStatusHomeArr[p] === 'second yellow card'){
						console.log("second yellow card : " + yellowCardedPlayerHomeArr[p])
						$scope.secondYellowCardPlayerHome.push(yellowCardedPlayerHomeArr[p]);
					}
				}

		   		// for(var l = 0; l < lineupArr.length; l++){
		   		// 	if($scope.lineupDataArr.indexOf(lineupArr[l]) === -1){
		   		// 		console.log(lineupArr[l]);
		   		// 		$scope.redCardPlayerHome.push(lineupArr[l]);
		   		// 	}
		   		// }
				$ionicLoading.hide();
			}).error(function(data){
				$ionicLoading.hide();
			});
		// }
	};  

    $scope.yellowCardAway = function() {
	    // if($scope.matchData.timer_status === null || $scope.matchData.timer_status === 'started'){
		 	$ionicLoading.show({
				content: 'Login...',
				animation: 'fade-in',
				showBackdrop: true,
			});
			$scope.status = "yellowCardAway";
		    $scope.modal_goal.show();

		  	MatchService.getMatchById($stateParams.matchId).success(function(data){
		   		var lineupArr = data.match_awayTeamObj.lineup.split(",");
		   		$scope.lineupDataArr = data.match_awayTeamObj.lastLineup.split(",");
		   		var yellowCardedStatusAwayArr = data.yellowCardAway.status.split(",");
		   		var yellowCardedPlayerAwayArr = data.yellowCardAway.player.split(",");

		   		if(data.redCardAway.player === ''){
		   			$scope.redCardedPlayerAway = [];
		   		}else{	
		   			if(data.redCardAway.player.toString().indexOf(",") === -1){
						$scope.redCardedPlayerAway = data.redCardAway.player;
		   			}else{
		   				$scope.redCardedPlayerAway = data.redCardAway.player.split(",");
		   			}
		   		}
				
				for(var p = 0; p < yellowCardedPlayerAwayArr.length; p++){
					if(yellowCardedStatusAwayArr[p] === 'second yellow card'){
						console.log("second yellow card : " + yellowCardedPlayerAwayArr[p])
						$scope.secondYellowCardPlayerAway.push(yellowCardedPlayerAwayArr[p]);
					}
				}

		   		// for(var l = 0; l < lineupArr.length; l++){
		   		// 	if($scope.lineupDataArr.indexOf(lineupArr[l]) === -1){
		   		// 		console.log(lineupArr[l]);
		   		// 		$scope.redCardPlayerAway.push(lineupArr[l]);
		   		// 	}
		   		// }
				$ionicLoading.hide();
			}).error(function(data){
				$ionicLoading.hide();
			});
		// }	
	};

	$scope.redCardHome = function() {
	    // if($scope.matchData.timer_status === null || $scope.matchData.timer_status === 'started'){
			$ionicLoading.show({
				content: 'Login...',
				animation: 'fade-in',
				showBackdrop: true,
			});
			$scope.status = "redCardHome";
		    $scope.modal_goal.show();
		  
		   	MatchService.getMatchById($stateParams.matchId).success(function(data){
		   		var lineupArr = data.match_homeTeamObj.lineup.split(",");
		   		$scope.lineupDataArr = data.match_homeTeamObj.lastLineup.split(",");
		   		var yellowCardedStatusHomeArr = data.yellowCardHome.status.split(",");
		   		var yellowCardedPlayerHomeArr = data.yellowCardHome.player.split(",");

		   		if(data.redCardHome.player === ''){
		   			$scope.redCardedPlayerHome = [];
		   		}else{	
		   			if(data.redCardHome.player.toString().indexOf(",") === -1){
						$scope.redCardedPlayerHome = data.redCardHome.player;
		   			}else{
		   				$scope.redCardedPlayerHome = data.redCardHome.player.split(",");
		   			}
		   		}
				
				for(var p = 0; p < yellowCardedPlayerHomeArr.length; p++){
					if(yellowCardedStatusHomeArr[p] === 'second yellow card'){
						console.log("second yellow card : " + yellowCardedPlayerHomeArr[p])
						$scope.secondYellowCardPlayerHome.push(yellowCardedPlayerHomeArr[p]);
					}
				}

		   		// for(var l = 0; l < lineupArr.length; l++){
		   		// 	if($scope.lineupDataArr.indexOf(lineupArr[l]) === -1){
		   		// 		console.log(lineupArr[l]);
		   		// 		$scope.redCardPlayerHome.push(lineupArr[l]);
		   		// 	}
		   		// }
				$ionicLoading.hide();
			}).error(function(data){
				$ionicLoading.hide();
			});
		// }
	};  

    $scope.redCardAway = function() {
	    // if($scope.matchData.timer_status === null || $scope.matchData.timer_status === 'started'){
		 	$ionicLoading.show({
				content: 'Login...',
				animation: 'fade-in',
				showBackdrop: true,
			});
			$scope.status = "redCardAway";
		    $scope.modal_goal.show();
		   
		   	MatchService.getMatchById($stateParams.matchId).success(function(data){
		   		var lineupArr = data.match_awayTeamObj.lineup.split(",");
		   		$scope.lineupDataArr = data.match_awayTeamObj.lastLineup.split(",");
		   		var yellowCardedStatusAwayArr = data.yellowCardAway.status.split(",");
		   		var yellowCardedPlayerAwayArr = data.yellowCardAway.player.split(",");

		   		if(data.redCardAway.player === ''){
		   			$scope.redCardedPlayerAway = [];
		   		}else{	
		   			if(data.redCardAway.player.toString().indexOf(",") === -1){
						$scope.redCardedPlayerAway = data.redCardAway.player;
		   			}else{
		   				$scope.redCardedPlayerAway = data.redCardAway.player.split(",");
		   			}
		   		}
				
				for(var p = 0; p < yellowCardedPlayerAwayArr.length; p++){
					if(yellowCardedStatusAwayArr[p] === 'second yellow card'){
						console.log("second yellow card : " + yellowCardedPlayerAwayArr[p])
						$scope.secondYellowCardPlayerAway.push(yellowCardedPlayerAwayArr[p]);
					}
				}

		   		// for(var l = 0; l < lineupArr.length; l++){
		   		// 	if($scope.lineupDataArr.indexOf(lineupArr[l]) === -1){
		   		// 		console.log(lineupArr[l]);
		   		// 		$scope.redCardPlayerAway.push(lineupArr[l]);
		   		// 	}
		   		// }
				$ionicLoading.hide();
			}).error(function(data){
				$ionicLoading.hide();
			});
		// }	
	};

	$scope.subHome = function() {
	    // if($scope.matchData.timer_status === null || $scope.matchData.timer_status === 'started'){
			$ionicLoading.show({
				content: 'Login...',
				animation: 'fade-in',
				showBackdrop: true,
			});
			$scope.status = "subHome";
		    $scope.modal_goal.show();

		   	MatchService.getMatchById($stateParams.matchId).success(function(data){
		   		var lineupArr = data.match_homeTeamObj.lineup.split(",");
		   		$scope.lineupDataArr = data.match_homeTeamObj.lastLineup.split(",");
		   		var yellowCardedStatusHomeArr = data.yellowCardHome.status.split(",");
		   		var yellowCardedPlayerHomeArr = data.yellowCardHome.player.split(",");

		   		if(data.redCardHome.player === ''){
		   			$scope.redCardedPlayerHome = [];
		   		}else{	
		   			if(data.redCardHome.player.toString().indexOf(",") === -1){
						$scope.redCardedPlayerHome = data.redCardHome.player;
		   			}else{
		   				$scope.redCardedPlayerHome = data.redCardHome.player.split(",");
		   			}
		   		}
				
				for(var p = 0; p < yellowCardedPlayerHomeArr.length; p++){
					if(yellowCardedStatusHomeArr[p] === 'second yellow card'){
						console.log("second yellow card : " + yellowCardedPlayerHomeArr[p])
						$scope.secondYellowCardPlayerHome.push(yellowCardedPlayerHomeArr[p]);
					}
				}

		   		// for(var l = 0; l < lineupArr.length; l++){
		   		// 	if($scope.lineupDataArr.indexOf(lineupArr[l]) === -1){
		   		// 		console.log(lineupArr[l]);
		   		// 		$scope.redCardPlayerHome.push(lineupArr[l]);
		   		// 	}
		   		// }
		   		
		   		$scope.subDataArr = data.match_homeTeamObj.lastSub.split(",");
				$ionicLoading.hide();
			}).error(function(data){
				$ionicLoading.hide();
			});
		// }
	};  

    $scope.subAway = function() {
	    // if($scope.matchData.timer_status === null || $scope.matchData.timer_status === 'started'){
		 	$ionicLoading.show({
				content: 'Login...',
				animation: 'fade-in',
				showBackdrop: true,
			});
			$scope.status = "subAway";
		    $scope.modal_goal.show();
		   
		   	MatchService.getMatchById($stateParams.matchId).success(function(data){
		   		var lineupArr = data.match_awayTeamObj.lineup.split(",");
		   		$scope.lineupDataArr = data.match_awayTeamObj.lastLineup.split(",");
		   		var yellowCardedStatusAwayArr = data.yellowCardAway.status.split(",");
		   		var yellowCardedPlayerAwayArr = data.yellowCardAway.player.split(",");

		   		if(data.redCardAway.player === ''){
		   			$scope.redCardedPlayerAway = [];
		   		}else{	
		   			if(data.redCardAway.player.toString().indexOf(",") === -1){
						$scope.redCardedPlayerAway = data.redCardAway.player;
		   			}else{
		   				$scope.redCardedPlayerAway = data.redCardAway.player.split(",");
		   			}
		   		}
				
				for(var p = 0; p < yellowCardedPlayerAwayArr.length; p++){
					if(yellowCardedStatusAwayArr[p] === 'second yellow card'){
						console.log("second yellow card : " + yellowCardedPlayerAwayArr[p])
						$scope.secondYellowCardPlayerAway.push(yellowCardedPlayerAwayArr[p]);
					}
				}

		   		// for(var l = 0; l < lineupArr.length; l++){
		   		// 	if($scope.lineupDataArr.indexOf(lineupArr[l]) === -1){
		   		// 		console.log(lineupArr[l]);
		   		// 		$scope.redCardPlayerAway.push(lineupArr[l]);
		   		// 	}
		   		// }
		   		
		   		$scope.subDataArr = data.match_awayTeamObj.lastSub.split(",");
				$ionicLoading.hide();
			}).error(function(data){
				$ionicLoading.hide();
			});
		// }	
	};

	// Analyze Match 
	$scope.shotOnTargetHome = function() {
		$ionicLoading.show({
			content: 'Login...',
			animation: 'fade-in',
			showBackdrop: true,
		});

		clearInterval($scope.loadTimerTeamA);
		clearInterval($scope.loadTimerTeamB);
		$scope.timerTeamAStat = false;
		$scope.timerTeamBStat = false;
		
		MatchService.getMatchById($stateParams.matchId).success(function(match){
	   		match.match_stats.homeShotOnTarget = match.match_stats.homeShotOnTarget + 1;
	   		match.match_stats.homeTotalShots = match.match_stats.homeTotalShots + 1;

	   		MatchService.editMatchById($stateParams.matchId,match).success(function(data) {
				console.log(data);
				$ionicLoading.hide();
			}).error(function(data) {
				$ionicLoading.hide();
			});

		}).error(function(data){});
	};

	$scope.shotOnTargetAway = function() {
		$ionicLoading.show({
			content: 'Login...',
			animation: 'fade-in',
			showBackdrop: true,
		});

		clearInterval($scope.loadTimerTeamA);
		clearInterval($scope.loadTimerTeamB);
		$scope.timerTeamAStat = false;
		$scope.timerTeamBStat = false;
		
		MatchService.getMatchById($stateParams.matchId).success(function(match){
	   		match.match_stats.awayShotOnTarget = match.match_stats.awayShotOnTarget + 1;
	   		match.match_stats.awayTotalShots = match.match_stats.awayTotalShots + 1;

	   		MatchService.editMatchById($stateParams.matchId,match).success(function(data) {
				console.log(data);
				$ionicLoading.hide();
			}).error(function(data) {
				$ionicLoading.hide();
			});

		}).error(function(data){});
	};

	$scope.shotOffTargetHome = function() {
		$ionicLoading.show({
			content: 'Login...',
			animation: 'fade-in',
			showBackdrop: true,
		});

		clearInterval($scope.loadTimerTeamA);
		clearInterval($scope.loadTimerTeamB);
		$scope.timerTeamAStat = false;
		$scope.timerTeamBStat = false;
		
		MatchService.getMatchById($stateParams.matchId).success(function(match){
	   		match.match_stats.homeShotOffTarget = match.match_stats.homeShotOffTarget + 1;
	   		match.match_stats.homeTotalShots = match.match_stats.homeTotalShots + 1;

	   		MatchService.editMatchById($stateParams.matchId,match).success(function(data) {
				console.log(data);
				$ionicLoading.hide();
			}).error(function(data) {
				$ionicLoading.hide();
			});

		}).error(function(data){});
	};

	$scope.shotOffTargetAway = function() {
		$ionicLoading.show({
			content: 'Login...',
			animation: 'fade-in',
			showBackdrop: true,
		});

		clearInterval($scope.loadTimerTeamA);
		clearInterval($scope.loadTimerTeamB);
		$scope.timerTeamAStat = false;
		$scope.timerTeamBStat = false;
		
		MatchService.getMatchById($stateParams.matchId).success(function(match){
	   		match.match_stats.awayShotOffTarget = match.match_stats.awayShotOffTarget + 1;
	   		match.match_stats.awayTotalShots = match.match_stats.awayTotalShots + 1;

	   		MatchService.editMatchById($stateParams.matchId,match).success(function(data) {
				console.log(data);
				$ionicLoading.hide();
			}).error(function(data) {
				$ionicLoading.hide();
			});

		}).error(function(data){});
	};

	$scope.cornerKickHome = function() {
		$ionicLoading.show({
			content: 'Login...',
			animation: 'fade-in',
			showBackdrop: true,
		});

		clearInterval($scope.loadTimerTeamA);
		clearInterval($scope.loadTimerTeamB);
		$scope.timerTeamAStat = false;
		$scope.timerTeamBStat = false;
		
		MatchService.getMatchById($stateParams.matchId).success(function(match){
	   		match.match_stats.homeCornerKicks = match.match_stats.homeCornerKicks + 1;

	   		MatchService.editMatchById($stateParams.matchId,match).success(function(data) {
				console.log(data);
				$ionicLoading.hide();
			}).error(function(data) {
				$ionicLoading.hide();
			});

		}).error(function(data){});
	};

	$scope.cornerKickAway = function() {
		$ionicLoading.show({
			content: 'Login...',
			animation: 'fade-in',
			showBackdrop: true,
		});

		clearInterval($scope.loadTimerTeamA);
		clearInterval($scope.loadTimerTeamB);
		$scope.timerTeamAStat = false;
		$scope.timerTeamBStat = false;
		
		MatchService.getMatchById($stateParams.matchId).success(function(match){
	   		match.match_stats.awayCornerKicks = match.match_stats.awayCornerKicks + 1;

	   		MatchService.editMatchById($stateParams.matchId,match).success(function(data) {
				console.log(data);
				$ionicLoading.hide();
			}).error(function(data) {
				$ionicLoading.hide();
			});

		}).error(function(data){});
	};

	$scope.foulHome = function() {
		$ionicLoading.show({
			content: 'Login...',
			animation: 'fade-in',
			showBackdrop: true,
		});

		clearInterval($scope.loadTimerTeamA);
		clearInterval($scope.loadTimerTeamB);
		$scope.timerTeamAStat = false;
		$scope.timerTeamBStat = false;
		
		MatchService.getMatchById($stateParams.matchId).success(function(match){
	   		match.match_stats.homeFouls = match.match_stats.homeFouls + 1;

	   		MatchService.editMatchById($stateParams.matchId,match).success(function(data) {
				console.log(data);
				$ionicLoading.hide();
			}).error(function(data) {
				$ionicLoading.hide();
			});

		}).error(function(data){});
	};

	$scope.foulAway = function() {
		$ionicLoading.show({
			content: 'Login...',
			animation: 'fade-in',
			showBackdrop: true,
		});

		clearInterval($scope.loadTimerTeamA);
		clearInterval($scope.loadTimerTeamB);
		$scope.timerTeamAStat = false;
		$scope.timerTeamBStat = false;
		
		MatchService.getMatchById($stateParams.matchId).success(function(match){
	   		match.match_stats.awayFouls = match.match_stats.awayFouls + 1;

	   		MatchService.editMatchById($stateParams.matchId,match).success(function(data) {
				console.log(data);
				$ionicLoading.hide();
			}).error(function(data) {
				$ionicLoading.hide();
			});

		}).error(function(data){});
	};
	// End Of Analyze Match Function

    $scope.closeModalGoal = function() {
	  	$scope.modal_goal.hide();
	  	$scope.squadDataArr = [];
	  	$scope.selectedStatus = false;
	  	$scope.playerOutStatus = false;
	  	$scope.playerInStatus = false;
	  	$scope.status = "";
		$scope.redCardPlayerHome = [];
		$scope.redCardPlayerAway = [];
		$scope.firstYellowCardPlayerHome = [];
		$scope.secondYellowCardPlayerHome = [];
		$scope.firstYellowCardPlayerAway = [];
		$scope.secondYellowCardPlayerAway = [];

      	var scorers = document.getElementsByName("scorer");

		for (var a = 0; a < scorers.length; a++) {
	        if (scorers[a].checked) {
	            scorers[a].checked = false;
	            break;
	        }
	    }

	    var playersIn = document.getElementsByName("playerIn");
		var playersOut = document.getElementsByName("playerOut");
		console.log("sub home");
		for (var o = 0; o < playersOut.length; o++) {
	        if (playersOut[o].checked) {
	            playersOut[o].checked = false;
	            break;
	        }
	    }

	    for (var i = 0; i < playersIn.length; i++) {
	        if (playersIn[i].checked) {
	            playersIn[i].checked = false;
	            break;
	        }
	    }
    };
    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modal_goal.remove();
    });
    // Modal Goal
    $scope.fixtureId = localStorage.getItem("fixId");
    $scope.backToFixture = function(id) { // kembali ke halaman home
		$state.go('app.fixture', {
			'id': id
		});
		clearInterval($scope.loadMatch);
		clearInterval($scope.loadTimer);
	};
})

.controller('CompetitionCtrl', function($scope, $rootScope, $state, $stateParams, $ionicPopup, $ionicPlatform, $ionicLoading, ProfileService, MatchService, CompetitionService, ionicMaterialInk, ionicMaterialMotion, $cordovaSocialSharing, $compile, NgMap) {
	
	$ionicLoading.show({
		content: 'Login...',
		animation: 'fade-in',
		showBackdrop: true,
	});

	$scope.cities = ["Jakarta Pusat", "Jakarta Barat", "Jakarta Selatan", "Jakarta Timur", "Jakarta Utara"];

	// Jakarta Pusat
	$scope.venueInJakartaPusat = [
		{nama: "Nirwana Futsal", alamat: "pasar sawah besar Lt.2, Jakarta Pusat", telepon: " 021-91479199"},
		{nama: "Planet Futsal Plaza Kenari Mas", alamat: "Jl Kramat Raya No. 101 P6 A-B jak-Pus 10440", telepon: " 021-39845995"},
		{nama: "Maestro", alamat: "Pasar Mobil Kemayoran", telepon: " 021-92409488"},
		{nama: "Senayan Trade Center", alamat: "Jl. Asia Afrika Pintu IX, Gelora Senayan, Jakarta Pusat 10270", telepon: " 021-57932008"}
	]

	// Jakarta Barat
	$scope.venueInJakartaBarat = [
		{nama: "Lucky Futsal", alamat: "Jalan Strategi III/57 Kav.Hankam Joglo Kembangan RT017/RW 02", telepon: "02193320730"},
		{nama: "Batavia Futsal", alamat: "Jl. Pahlawan No.66, Sukabumi Selatan - Kebon Jeruk", telepon: "  02153652321"},
		{nama: "Indo Futsal", alamat: "Jl. Palmerah Barat No. 4, Jakarta Pusat", telepon: " 0215483311"},
		{nama: "Futsal One", alamat: "Jl. Kedoya Raya No. 100 Jakarta, Kebon Jeruk, Jakarta Barat 11520", telepon: " 02171790176"},
		{nama: "Total Futsal Arena", alamat: "Jl. Arjuna Selatan No. 11, Kebon Jeruk", telepon: " 02168680232"},
		{nama: "GOR Pertamina Simprug", alamat: "Jl. Teuku Nyak Arif, Simprug", telepon: "0217261830"},
		{nama: "Star Futsal", alamat: "Jl, Kavling Polri Blok A No. 39", telepon: " 0215661786"},
		{nama: "Copa Futsal", alamat: "Jl. Taman Semanan Indah", telepon: " 02154390188"},
		{nama: "Moi Futsal", alamat: "Jl. Pesanggrahan Raya No. 54 B", telepon: ""},
		{nama: "Centor Futsal", alamat: "Jl. Lingkar Luar Rawabuaya No.9A", telepon: " 02192297271"}
	]

	// Jakarta Selatan
	$scope.venueInJakartaSelatan = [
		{nama: "Kick Sport", alamat: "Jl. Kuningan Barat No. 8 Mampang Prapatan", telepon: ""},
		{nama: "Kuningan Village Futsal", alamat: "Jl. Karbela Timur No. 1, Setiabudi", telepon: " (021) 52903131"},
		{nama: "Kemang Futsal", alamat: "Jl. Kemang Utara Raya No. 1 Mampang Prapatan", telepon: " (021) 7195014"},
		{nama: "Frog Bread Club", alamat: "Jl. Pejaten Barat III No. 34, Pasar Minggu, Jakarta Selatan 12510", telepon: "(021) 71790176"},
		{nama: "The Fiq's Futsal", alamat: "Jl. Jagakarsa", telepon: "(021) 95910444"},
		{nama: "The Futsal 1919", alamat: "Jl. Mohammad Kahfi 1 No. 99, Ciganjur, Jagakarsa", telepon: "(021) 70324087"},
		{nama: "Pro Arena Futsal Pondok Indah", alamat: "Jl. Metro Pondok Indah Kav 3 Kebayoran", telepon: ""},
		{nama: "Futsal Plaza Nagari Pakubuwono", alamat: "Plaza Nagari Pakubuwono Jl. Kyai Maja No. 63 Kebayoran Lama", telepon: ""},
		{nama: "Tanjung Barat Futsal", alamat: "Jl. Raya Tanjung Barat No. 85, Pol Tangan, Jakarta Selatan", telepon: "021-7806606"},
		{nama: "Champion Futsal", alamat: "Jl. Ampera Raya No.99, Jaksel", telepon: "021-7815015"},
		{nama: "Pejaten Futsal", alamat: "Jl. Pejaten Barat III/34, Jakarta Selatan", telepon: "021-71790176"},	
		{nama: "Goals", alamat: "Jl. Lebak Bulus 1 No 19 RJ Jaksel", telepon: "021-75901313"},
		{nama: "Hanggar IBM Futsal", alamat: "Jl. Gatot Subroto Kav. 72 (Pancoran)", telepon: "021-7973688"},
		{nama: "My Futsal", alamat: "Jl. Raya Kebayoran Baru (Komplek Hankam), Jakarta Selatan", telepon: "021-7263030"},
		{nama: "The Planet Futsal", alamat: "Klub Rasuna, Jl. HR Rasuna Said Cav C-22, Jakarta 12920", telepon: "021-70995456"},	
		{nama: "Kick Off", alamat: "Bintaro Jaya Sektor 9 seberang Mc’Donald dan sebelah Anita Salon", telepon: " 021-99991270"},
		{nama: "Samba Futsal", alamat: "Jl. Tentara Pelajar No.37 (Arteri Pejompongan), Jakarta Selatan", telepon: "021-53652690"},
		{nama: "Grand Futsal Kuningan", alamat: "Jl. Karet Pedurenan Mesjid No. 45 Setiabudi", telepon: ""},
		{nama: "Bros Futsal", alamat: "Gd. Ex Golden Truly Blok M (Samping Terminal Blok M)", telepon: "021-7227362"},
		{nama: "Buncit Futsal", alamat: "Jl. Taman Margasatwa No. 12, Mampang Perapatan", telepon: ""},
		{nama: "Football Matches", alamat: "Jl. Suryo No. 20, Kebayoran Baru", telepon: ""},
		{nama: "Bintang Futsal", alamat: "Kemang I Kav. 70-81 Splash Area", telepon: " 021-7190249"},
		{nama: "Hall Voli Senayan", alamat: "Jl. Asia Afrika (samping hotel Mulia)", telepon: ""},
		{nama: "Metro Futsal", alamat: "Jl. Tanah Kusir IV No. 36", telepon: " 021-7293366"},
		{nama: "BTC Futsal", alamat: "Bintaro Trade Center Jl. Bintaro Utama Sektor 7", telepon: "(021) 7455577"}		
	]

	// Jakarta Timur
	$scope.venueInJakartaTimur = [
		{nama: "Jengki Futsal", alamat: "Jl. Jengki cipinang asem", telepon: ""},
		{nama: "Green futsal", alamat: "Jl. Raya Bambu Apus Blok B 11 no. 6", telepon: "021 849 92 392"},
		{nama: "de King's Futsal", alamat: "Jalan Manunggal 17, Jakarta Timur 13810", telepon: " (021) 8406505"},
		{nama: "Zy Futsal", alamat: "Jl. Raden Inten No. 79, Duren Sawit", telepon: " 021-86606009"},	
		{nama: "Gudang Futsal Kalimalang", alamat: "Jl. Raya Kalimalang No. 3A", telepon: ""},	
		{nama: "Tifosi Futsal Raden Inten", alamat: "Jl. Raden Inten II No. 46, Duren Sawit", telepon: " (021) 8626087"}
	]

	// Jakarta Utara
	$scope.venueInJakartaUtara = [
		{nama: "Tango Futsal", alamat: "Jl. Teluk Gong Raya, Penjaringan", telepon: ""},
		{nama: "Cometa Arena", alamat: "Jalan Pluit Selatan Raya, Jakarta 14450", telepon: " (021) 6625421"},
		{nama: "Grand Futsal", alamat: "Jl. Pluit Selatan Raya Blok S No. 5 F", telepon: " 021-6606431"},
		{nama: "Salvo Futsal", alamat: "Jl. Danau Sunter Selatan Blok M2", telepon: " 6530 7706"},	
		{nama: "Cosmo Futsal", alamat: "Jl. Pelepah Raya 31-32 Komplek Gudang Bulog, Kelapa Gading", telepon: "021-4516124"},
		{nama: "The Planet Futsal", alamat: "Jl. Danau Sunter Barat, Blok A4 No. 8-10, Jakarta Utara", telepon: " 021-65831072"},
		{nama: "Futsal Kick Off", alamat: "Jl. Arteri Utara Yos Sudarso Tanah Mas", telepon: ""},
		{nama: "Galaxy Sport Ancol", alamat: "Jl. Lodan Raya No. 103, Ancol 14430", telepon: " 021-6918920"}
	]

	var stringlength = 15;
	var stringArray = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
	var rndString = "";
	// build a string with random characters
	for(var i = 1; i < stringlength; i++){
		var rndNum = Math.ceil(Math.random() * stringArray.length) - 1;
		rndString = rndString + stringArray[rndNum];
	}
	$scope.data = {};
	$scope.data.register = "";
	$scope.data.id = "C"+rndString;
	$scope.registered = [];
	$scope.data.comp_address = {
		city: "",
		venue: ""
	};
	$scope.day = {};

	$scope.minDate = moment(new Date()).add(8, 'days').format('YYYY-MM-DD');

	CompetitionService.getAllCompetition().success(function(data) {
		$ionicLoading.hide();
		$scope.competition = {};
		$scope.competition = data;
		console.log(localStorage.getItem("userid"));
		data.forEach(function(entry){
			if(entry.registeredTeam != null){
				$scope.registerArr = entry.registeredTeam.split(',');
				var a = $scope.registerArr.indexOf(localStorage.getItem("team"));
				if(a != -1){
					$scope.registered[entry.id] = true;
				}else{
					$scope.registered[entry.id] = false;
				}
			}else{
				$scope.registered[entry.id] = false;
			}
			console.log($scope.registered[entry.id]);
		});
	}).error(function(data) {
		$ionicLoading.hide();
	});
	$scope.status = "";

	window.myFunction = function() {
	    var x = document.getElementById("mySelect").value;
	    console.log(x);
	    if (x=="GroupStage") {
	    	$scope.status = "GroupStage";
	    }else if (x=="KnockoutSystem") {
	    	$scope.status = "KnockoutSystem";
	    }else {
			$scope.status = "Combination";
	    }
	    // document.getElementById("demo").innerHTML = "You selected: " + x;
	};

	console.log($scope.data.comp_start);
	$scope.data.organizer = localStorage.getItem("username");

	// restrict input data for number of teams
	$('.numOfTeamValidation').on('keyup', function(e){
		// if input less than 4
		console.log($(this).val());
        if ($(this).val() < 4
        		&& e.keyCode != 46 // delete
        		&& e.keyCode != 8 // backspace
           ) {
           		e.preventDefault();     
           		$(this).val(4);
        }
        // if input more than 20
        if ($(this).val() > 20
           		&& e.keyCode != 46 // delete
        		&& e.keyCode != 8 // backspace
           ) {
          		e.preventDefault();     
          		$(this).val(20);
        }
    });

    $('.compFeeValidation').on('keyup keydown', function(e){
  		// 1.
		var selection = window.getSelection().toString();
		if(selection !== ''){
			return;
		}

		// 2.
		if($.inArray(e.keyCode, [38,40,37,39]) !== -1){
			return;
		}

		// 3.
		var $this = $(this);
		var input = $this.val();

		// 4.
		var input = input.replace(/[\D\s\._\-]+/g, "");

		// 5.
		input = input ? parseInt(input, 10) : 0;

		// 6.
		$this.val(function(){
			return (input === 0) ? "" : input.toLocaleString("id-ID");
		});
    });

    $('.firstPlaceRewardValidation').on('keyup keydown', function(e){
     	// 1.
		var selection = window.getSelection().toString();
		if(selection !== ''){
			return;
		}

		// 2.
		if($.inArray(e.keyCode, [38,40,37,39]) !== -1){
			return;
		}

		// 3.
		var $this = $(this);
		var input = $this.val();

		// 4.
		var input = input.replace(/[\D\s\._\-]+/g, "");

		// 5.
		input = input ? parseInt(input, 10) : 0;

		// 6.
		$this.val(function(){
			return (input === 0) ? "" : input.toLocaleString("id-ID");
		});
    });

    $('.secondPlaceRewardValidation').on('keyup keydown', function(e){
		// 1.
		var selection = window.getSelection().toString();
		if(selection !== ''){
			return;
		}

		// 2.
		if($.inArray(e.keyCode, [38,40,37,39]) !== -1){
			return;
		}

		// 3.
		var $this = $(this);
		var input = $this.val();

		// 4.
		var input = input.replace(/[\D\s\._\-]+/g, "");

		// 5.
		input = input ? parseInt(input, 10) : 0;

		// 6.
		$this.val(function(){
			return (input === 0) ? "" : input.toLocaleString("id-ID");
		});
    });

    $('.thirdPlaceRewardValidation').on('keyup', function(e){
		// 1.
		var selection = window.getSelection().toString();
		if(selection !== ''){
			return;
		}

		// 2.
		if($.inArray(e.keyCode, [38,40,37,39]) !== -1){
			return;
		}

		// 3.
		var $this = $(this);
		var input = $this.val();

		// 4.
		var input = input.replace(/[\D\s\._\-]+/g, "");

		// 5.
		input = input ? parseInt(input, 10) : 0;

		// 6.
		$this.val(function(){
			return (input === 0) ? "" : input.toLocaleString("id-ID");
		});
    });

    $scope.fee = { checked: false };

    $scope.feeChange = function() {
		console.log('Fee Change', $scope.fee.checked);
		$scope.data.comp_fee = "";
	};

	$scope.profileData = {};
	$scope.profileData.createdCompetition = {};
	$scope.breakBetweenFixture = ["no break",1,2,3,4,5,6,7];
	$scope.numberOfDays = [7,14,21];
	$scope.numberOfDays8 = [7,14];

	console.log($scope.data.comp_start);
	$scope.compEndDate = $scope.data.comp_start;

	$scope.addCompetition = function() {
		console.log($scope.menuProfile);
		$scope.profileData.createdCompetition.active = "";
		$scope.profileData.createdCompetition.completed = "";

		if($scope.menuProfile.createdCompetition !== ''){
			console.log("createdCompetition not null");
			if($scope.menuProfile.createdCompetition.active === ''){
				console.log("active null");
				$scope.profileData.createdCompetition.active = $scope.data.comp_name;
			}else{
				console.log("active not null");
				$scope.profileData.createdCompetition.active = $scope.menuProfile.createdCompetition.active + "," + $scope.data.comp_name;
			}
		}else{	
			$scope.profileData.createdCompetition.active = $scope.data.comp_name;
		}

		console.log($scope.data.comp_finish);
		console.log($scope.data.comp_start);
		console.log($scope.data.fixture_break);

		if($scope.data.comp_type == 'GroupStage'){
			$scope.day.numberOfDays = 0;
			if($scope.data.comp_start != null){

			    var fixture = $scope.data.comp_numOfTeam - 1;

			    if($scope.data.fixture_break !== 'no break'){
			    	var numOfBreak = ($scope.data.comp_numOfTeam - 2) * $scope.data.fixture_break;

				    // var counter = fixture * $scope.data.fixture_break;
				    var numOfDays = (fixture + numOfBreak) - 1;

				    var compFinishDate = moment(new Date($scope.data.comp_start)).add(numOfDays, 'days');

			    	$scope.data.comp_finish = moment(compFinishDate).toISOString();

			    	console.log($scope.data.comp_finish);
			    }else{
				    var numOfDays = ($scope.data.comp_numOfTeam - 2);
				    var compFinishDate = moment(new Date($scope.data.comp_start)).add(numOfDays, 'days');
			    	$scope.data.comp_finish = moment(compFinishDate).toISOString();
			    	$scope.data.fixture_break = 0;

			    	console.log($scope.data.comp_finish);
			    }
			   
			}
		}

		if($scope.data.comp_type != 'GroupStage'){
			if($scope.data.comp_start != null){

				var numOfDays = $scope.day.numberOfDays - 1;
                var compFinishDate = moment(new Date($scope.data.comp_start)).add(numOfDays, 'days');

		    	$scope.data.comp_finish = moment(compFinishDate).toISOString();

		    	console.log($scope.data.comp_finish);
			}
		}
		 
		console.log($scope.fee.checked);

		if ($scope.data.comp_name === undefined && $scope.data.comp_type === undefined && $scope.data.comp_location === undefined && $scope.data.comp_numOfTeam === undefined && $scope.data.comp_start === undefined && $scope.data.comp_finish === undefined) {
			$rootScope.showPopup($ionicPopup,'Create Competition failed!','Please fill all the fields', 'popup-error');
		} else if ($scope.data.comp_name === undefined || $scope.data.comp_name === "") {
			$rootScope.showPopup($ionicPopup,'Create Competition failed!','Competition name is required !', 'popup-error');
		} else if ($scope.data.comp_type === undefined || $scope.data.comp_type === "") {
			$rootScope.showPopup($ionicPopup,'Create Competition failed!','Competition type is required !', 'popup-error');
		} else if ($scope.data.comp_numOfTeam === undefined || $scope.data.comp_numOfTeam === "") {
			$rootScope.showPopup($ionicPopup,'Create Competition failed!','Number of teams is required !', 'popup-error');
		} else if ($scope.fee.checked == true && ($scope.data.comp_fee === undefined || $scope.data.comp_fee === "")) {
			$rootScope.showPopup($ionicPopup,'Create Competition failed!','registration fee is required !', 'popup-error');
		} else if ($scope.data.comp_address.city === undefined || $scope.data.comp_address.city === "") {
			$rootScope.showPopup($ionicPopup,'Create Competition failed!','city is required !', 'popup-error');
		} else if ($scope.data.comp_address.venue === undefined || $scope.data.comp_address.venue === "") {
			$rootScope.showPopup($ionicPopup,'Create Competition failed!','venue is required !', 'popup-error'); 
		} else if ($scope.data.comp_start === undefined || $scope.data.comp_start === "") {
			$rootScope.showPopup($ionicPopup,'Create Competition failed!','start date is required !', 'popup-error');
		} else if ($scope.day.numberOfDays === undefined || $scope.day.numberOfDays === "") {
			$rootScope.showPopup($ionicPopup,'Create Competition failed!','number of day is required !', 'popup-error');
		} else if ($scope.data.comp_name !== null && $scope.data.comp_type !== null && $scope.data.comp_numOfTeam !== null && $scope.data.comp_location !== null && $scope.data.comp_start !== null && $scope.data.comp_finish !== null) {
			console.log($scope.data);
			CompetitionService.addCompetition($scope.data).success(function(data) {
				$ionicLoading.hide();
				var alertPopup = $ionicPopup.alert({
					title: 'Success!',
					template: 'Berhasil Membuat Kompetisi'
				});
				$state.go('app.home');

			}).error(function(data) {
				$ionicLoading.hide();
				var alertPopup = $ionicPopup.alert({
					title: 'Post Data Failed!',
					template: 'Gagal Membuat Kompetisi, Silahkan coba beberapa saat lagi...'
				});
			});	
			console.log($scope.profileData);
		 	ProfileService.editProfileById(localStorage.getItem("userid"), localStorage.getItem("token"), $scope.profileData).success(function(data) {
				console.log("berhasil");
			}).error(function(data) {});
		}
	};

	$scope.more = function(id) {
		$state.go('app.competition_detail', {
			'competitionId': id
		});
	};

	$scope.createCompetition = function(){
		$state.go('app.create_competition');
	};

	$scope.registerTeam = function(id) {
		$state.go('app.register_team', {
			'competitionId': id
		});
	};

	$scope.backToCompetition = function() {
		$state.go('app.competition');
	};

	$scope.backToHome = function() {
		$state.go('app.home');
	};
})

.controller('CompetitionDetailCtrl', function(NgMap, $scope, $state, $stateParams, $ionicPopup, $ionicPlatform, $ionicLoading, TeamService, MatchService, PostService, CompetitionService, ionicMaterialInk, ionicMaterialMotion, $cordovaSocialSharing) {
	$ionicLoading.show({
		content: 'Login...',
		animation: 'fade-in',
		showBackdrop: true,
	});

	$scope.competition = {};
	$scope.registerTeam = [];
	$scope.rTeamLength = 0;
	$scope.registerStatus = "";
	console.log($stateParams.competitionId);

	$scope.$on('$ionicView.enter', function(){
		CompetitionService.getCompetitionById($stateParams.competitionId,localStorage.getItem("token")).success(function(data) {
			$scope.competition = data;
			$ionicLoading.hide();
			console.log($scope.competition);
			if($scope.competition.registeredTeam !== null){
				$scope.registeredTeam = $scope.competition.registeredTeam.split(',');
				$scope.rTeamLength = $scope.registeredTeam.length;
				console.log($scope.rTeamLength);

				//Check if registered or not
				var a = $scope.registeredTeam.indexOf(localStorage.getItem("team"));
				if(a != -1){
					$scope.registered = true;
				}else{
					$scope.registered = false;
				}
				//Check if registered or not
				if($scope.rTeamLength == data.comp_numOfTeam){
					$scope.registerStatus = "full";
				}
			}

		}).error(function(data) {});
	})

	$scope.registerCompetition = function() {

		var confirmPopup = $ionicPopup.confirm({
			title: 'Register Competition',
			template: 'Are you sure?'
		});

		confirmPopup.then(function(res) {
	         if(res) {
	            console.log('Sure!');
		        var teamCoach = localStorage.getItem("myTeamCoach");
				var teamSquad = localStorage.getItem("myTeamSquad").split(",");
				var teamSquadLength = teamSquad.length;

				if(localStorage.getItem("team") === ''){
					var confirmPopup = $ionicPopup.alert({
						title: 'Register Competition Failed',
						template: 'You must have a team before you can register into any competition!'
					});

				} else if(teamCoach !== null && teamSquadLength >= 8){
					// Register competition

					$scope.formCompetition = {};
					$scope.formCompetition.TeamName = localStorage.getItem("team");
					$scope.formCompetition.CompetitionId = $stateParams.competitionId;
					$scope.formCompetition.schedule_status = 'On Queue';
					
					console.log($scope.formCompetition);
					$scope.formTeam = {};
					$scope.formTeam.CompId = $stateParams.competitionId;
					$scope.formTeam.TeamId = localStorage.getItem("myTeamId");
					if($scope.menuProfile.team === '' || $scope.menuProfile.team === null){
						var confirmPopup = $ionicPopup.alert({
							title: 'Register Competition Failed',
							template: 'You must join a team before you can register into any competition!'
						});
					}else{
						console.log("register competition");
						// CompetitionService.registerTeam(localStorage.getItem("myTeamId"),localStorage.getItem("token"),$scope.formTeam).success(function(data){
						// 	$ionicLoading.hide();
						// 	$state.go('app.competition');
						// }).error(function(data){
						// 	$ionicLoading.hide();
						// });

						TeamService.addCompetition($scope.formTeam).success(function(data){
							$ionicLoading.hide();
							$state.go($state.current, {}, {
				                reload: true
				            });
						}).error(function(data){
							$ionicLoading.hide();
						}); 

						CompetitionService.addRegister($scope.formCompetition).success(function(data){
							$ionicLoading.hide();
							$state.go($state.current, {}, {
				                reload: true
				            });
						}).error(function(data){
							$ionicLoading.hide();
						});     
					}

				}else if(teamCoach === null){
					// show an alert
					$rootScope.showPopup($ionicPopup,'Register Failed!','Your team must have a coach', 'popup-error');
				}else if(teamSquadLength <= 8){
					// show an alert
					$rootScope.showPopup($ionicPopup,'Register Failed!','Your team members must be more than 7 peoples', 'popup-error');
				}
	         } else {
	            console.log('Not sure!');
	         }
	    });
	};

	$scope.backToCompetition = function() {
		$state.go('app.competition');
	};
	$scope.backToHome = function() {
		$state.go('app.home');
	};
	$scope.goToEditCompetition = function() {
		$state.go('app.edit_competition', {
			'competitionId': $stateParams.competitionId
		});
	};
	$scope.delCompetition = function() {
		var confirmPopup = $ionicPopup.confirm({
			title: 'Delete Competition',
			template: 'Are you sure?'
		});
		confirmPopup.then(function(res) {
	        if(res) {
	            console.log('Sure!');
	            CompetitionService.delCompetition($stateParams.competitionId).success(function(data) {
					$ionicLoading.hide();
					var alertPopup = $ionicPopup.alert({
						title: 'Success!',
						template: 'Berhasil Hapus Kompetisi'
					});
					$state.go('app.home');
				}).error(function(data) {
					$ionicLoading.hide();
					var alertPopup = $ionicPopup.alert({
						title: 'Failed!',
						template: 'Gagal Hapus Kompetisi'
					});
				});
	         } else {
	            console.log('Not sure!');
	         }
	    });
	};
	$scope.goToCompetitionSchedule = function(id) {
		$state.go('app.competition_schedule', {
			'competitionId': id
		});
	};
})

.controller('EditCompetitionCtrl', function(NgMap, $scope, $rootScope, $state, $stateParams, $ionicPopup, $ionicPlatform, $ionicLoading, ProfileService, MatchService, PostService, CompetitionService, ionicMaterialInk, ionicMaterialMotion, $cordovaSocialSharing) {
	$ionicLoading.show({
		content: 'Login...',
		animation: 'fade-in',
		showBackdrop: true,
	});

	$scope.cities = ["Jakarta Pusat", "Jakarta Barat", "Jakarta Selatan", "Jakarta Timur", "Jakarta Utara"];

	// Jakarta Pusat
	$scope.venueInJakartaPusat = ["Nirwana Futsal", "Planet Futsal Plaza Kenari Mas", "Maestro", "Senayan Trade Center"];

	// Jakarta Barat
	$scope.venueInJakartaBarat = ["Lucky Futsal",	"Batavia Futsal", "Indo Futsal", "Futsal One", "Total Futsal Arena", "GOR Pertamina Simprug", "Star Futsal", "Copa Futsal", "Moi Futsal", "Centor Futsal"]

	// Jakarta Selatan
	$scope.venueInJakartaSelatan = ["Kick Sport", "Kuningan Village Futsal", "Kemang Futsal", "Frog Bread Club", "The Fiq's Futsal", "The Futsal 1919", 
	"Pro Arena Futsal Pondok Indah", "Futsal Plaza Nagari Pakubuwono", "Tanjung Barat Futsal", "Champion Futsal", 
	"Pejaten Futsal", "Goals", "Hanggar IBM Futsal", "My Futsal", "The Planet Futsal", "Kick Off", "Samba Futsal", "Grand Futsal Kuningan", "Bros Futsal", "Buncit Futsal", "Football Matches", "Bintang Futsal", "Hall Voli Senayan", "Metro Futsal", "BTC Futsal"		
	]

	// Jakarta Timur
	$scope.venueInJakartaTimur = ["Jengki Futsal", "Green futsal", "de King's Futsal", "Zy Futsal", "Gudang Futsal Kalimalang", "Tifosi Futsal Raden Inten"]

	// Jakarta Utara
	$scope.venueInJakartaUtara = ["Tango Futsal", "Cometa Arena", "Grand Futsal", "Salvo Futsal", "Cosmo Futsal", "The Planet Futsal", "Futsal Kick Off", "Galaxy Sport Ancol"]

	$scope.feeChange = function() {
		console.log('Fee Change', $scope.fee.checked);
		$scope.competition.comp_fee = "";
	};
	  
	$scope.fee = { checked: false };

	window.myFunction = function() {
	    var x = document.getElementById("mySelect").value;
	    console.log(x);
	    if (x=="GroupStage") {
	    	$scope.status = "GroupStage";
	    }else if (x=="KnockoutSystem") {
	    	$scope.status = "KnockoutSystem";
	    }else {
			$scope.status = "Combination";
	    }
	};

	// restrict input data for number of teams
	$('.numOfTeamValidation').on('keyup', function(e){
		// if input less than 4
		console.log($(this).val());
        if ($(this).val() < 4
        		&& e.keyCode != 46 // delete
        		&& e.keyCode != 8 // backspace
           ) {
           		e.preventDefault();     
           		$(this).val(4);
        }
        // if input more than 20
        if ($(this).val() > 20
           		&& e.keyCode != 46 // delete
        		&& e.keyCode != 8 // backspace
           ) {
          		e.preventDefault();     
          		$(this).val(20);
        }
    });

    $('.compFeeValidation').on('keyup keydown', function(e){
		// if input less than 0
		// console.log($(this).val());
  //       if ($(this).val() <= 0
  //       		&& e.keyCode != 46 // delete
  //       		&& e.keyCode != 8 // backspace
  //          ) {
  //          		console.log("kurang");
  //          		e.preventDefault();     
  //          		$(this).val();
  //       }
  		// 1.
		var selection = window.getSelection().toString();
		if(selection !== ''){
			return;
		}

		// 2.
		if($.inArray(e.keyCode, [38,40,37,39]) !== -1){
			return;
		}

		// 3.
		var $this = $(this);
		var input = $this.val();

		// 4.
		var input = input.replace(/[\D\s\._\-]+/g, "");

		// 5.
		input = input ? parseInt(input, 10) : 0;

		// 6.
		$this.val(function(){
			return (input === 0) ? "" : input.toLocaleString("id-ID");
		});
    });

    $('.firstPlaceRewardValidation').on('keyup keydown', function(e){
     	// 1.
		var selection = window.getSelection().toString();
		if(selection !== ''){
			return;
		}

		// 2.
		if($.inArray(e.keyCode, [38,40,37,39]) !== -1){
			return;
		}

		// 3.
		var $this = $(this);
		var input = $this.val();

		// 4.
		var input = input.replace(/[\D\s\._\-]+/g, "");

		// 5.
		input = input ? parseInt(input, 10) : 0;

		// 6.
		$this.val(function(){
			return (input === 0) ? "" : input.toLocaleString("id-ID");
		});
    });

    $('.secondPlaceRewardValidation').on('keyup keydown', function(e){
		// 1.
		var selection = window.getSelection().toString();
		if(selection !== ''){
			return;
		}

		// 2.
		if($.inArray(e.keyCode, [38,40,37,39]) !== -1){
			return;
		}

		// 3.
		var $this = $(this);
		var input = $this.val();

		// 4.
		var input = input.replace(/[\D\s\._\-]+/g, "");

		// 5.
		input = input ? parseInt(input, 10) : 0;

		// 6.
		$this.val(function(){
			return (input === 0) ? "" : input.toLocaleString("id-ID");
		});
    });

    $('.thirdPlaceRewardValidation').on('keyup', function(e){
		// 1.
		var selection = window.getSelection().toString();
		if(selection !== ''){
			return;
		}

		// 2.
		if($.inArray(e.keyCode, [38,40,37,39]) !== -1){
			return;
		}

		// 3.
		var $this = $(this);
		var input = $this.val();

		// 4.
		var input = input.replace(/[\D\s\._\-]+/g, "");

		// 5.
		input = input ? parseInt(input, 10) : 0;

		// 6.
		$this.val(function(){
			return (input === 0) ? "" : input.toLocaleString("id-ID");
		});
    });

	$scope.competition = {};

	$scope.numOfTeamOption = [32,16,8];

	console.log($stateParams.competitionId);
	CompetitionService.getCompetitionById($stateParams.competitionId,localStorage.getItem("token")).success(function(data) {
		data.comp_start = new Date(data.comp_start);
		data.comp_finish = new Date(data.comp_finish);

		localStorage.setItem('competitionObj', JSON.stringify(data));
		$scope.competition = data;
		$scope.status = data.comp_type;
		$ionicLoading.hide();
		console.log($scope.competition.comp_numOfTeam);
		if($scope.competition.comp_fee !== ""){
			console.log("not null");
			$scope.fee = { checked: true };
		}
	}).error(function(data) {});

	var competitionObj = localStorage.getItem('competitionObj');
	var competitionObjData = JSON.parse(competitionObj);
	console.log(competitionObjData);
	console.log($scope.menuProfile.createdCompetition.active);
	var activeCompetitionArr = $scope.menuProfile.createdCompetition.active.split(",");
	$scope.profileData = {};
	$scope.profileData.createdCompetition = {};
	$scope.profileData.createdCompetition.active = "";
	$scope.profileData.createdCompetition.completed = $scope.menuProfile.createdCompetition.completed;
	$scope.activeCompetitionArr = [];

	$scope.editCompetition = function() {
		// $scope.competition.comp_start = moment($scope.competition.comp_start).format('YYYY-MM-DD');
		// console.log($scope.competition.comp_start);
		// $scope.competition.comp_finish = moment($scope.competition.comp_finish).format('YYYY-MM-DD');
		// console.log($scope.competition.comp_finish);

		// console.log(isEquivalent($scope.competition, $scope.oldCompetition));


		// CompetitionService.getCompetitionById($stateParams.competitionId,localStorage.getItem("token")).success(function(data) {
			
			if($scope.competition.comp_name !== competitionObjData.comp_name){
				console.log("tidak sama");
				activeCompetitionArr.forEach(function(comp){
					if(comp === competitionObjData.comp_name){
						console.log("sama");
						$scope.activeCompetitionArr.push($scope.competition.comp_name); 
					}else{
						$scope.activeCompetitionArr.push(comp);
					}
				});
			}else{
				console.log("sama");
			}
			$scope.profileData.createdCompetition.active = $scope.activeCompetitionArr.join(",");
			console.log($scope.profileData.createdCompetition.active);


			$scope.competition.comp_start = new Date($scope.competition.comp_start);
			$scope.competition.comp_finish = new Date($scope.competition.comp_finish);

			console.log($scope.competition.comp_start);
			console.log(competitionObjData);
			console.log($scope.competition.comp_start.getDate());

			console.log(JSON.stringify($scope.competition) === JSON.stringify(competitionObjData));

			if($scope.fee.checked === false){
				console.log("false");
				$scope.competition.comp_fee = "";
			}


			if(JSON.stringify($scope.competition) === JSON.stringify(competitionObjData) === true){
				console.log("tidak ada perubahan data");
				var alertPopup = $ionicPopup.alert({
					title: 'Info',
					template: 'Tidak Ada Perubahan Data'
				});
			}else{
				console.log("ada data yang diubah");

				console.log($scope.competition.comp_start);

		if($scope.competition.comp_start != null){
			console.log($scope.competition.comp_start.getDate());

			var minStartDate = new Date();
			console.log(minStartDate.getDate());
			minStartDate.setDate(minStartDate.getDate() + 14);

			var maxStartDate = new Date();
			maxStartDate.setDate(maxStartDate.getDate() + 21);

			var minEndDate = new Date($scope.competition.comp_start);
			minEndDate.setDate(minEndDate.getDate() + 7);

			var maxEndDate = new Date($scope.competition.comp_start);
			maxEndDate.setDate(maxEndDate.getDate() + 30);

			console.log($scope.competition.comp_start);
			console.log(minStartDate);
			console.log(maxStartDate);
			console.log(minEndDate);
			console.log(maxEndDate);

			var isStartDateValid = true;
			var isEndDateValid = true;

			if ($scope.competition.comp_start < minStartDate || $scope.competition.comp_start > maxStartDate) {
		       	console.log("start date must be between 14 and 21 day next to the day the competition is created");
		       	isStartDateValid = false;
		    } else {
		    	isStartDateValid = true;
		    }

		    if ($scope.competition.comp_finish < minEndDate || $scope.competition.comp_finish > maxEndDate) {
		       	console.log("end date must be between 7 and 30 day next to the competition start date");
		       	isEndDateValid = false;
		    } else {
		    	isEndDateValid = true;
		    }
		}

		console.log($scope.fee.checked);

		if ($scope.competition.comp_name === undefined && $scope.competition.comp_type === undefined && $scope.competition.comp_location === undefined && $scope.competition.comp_numOfTeam === undefined && $scope.competition.comp_start === undefined && $scope.competition.comp_finish === undefined) {
			$rootScope.showPopup($ionicPopup,'Create Competition failed!','Please fill all the fields', 'popup-error');
		} else if ($scope.competition.comp_name === undefined || $scope.competition.comp_name === "") {
			$rootScope.showPopup($ionicPopup,'Create Competition failed!','Competition name is required !', 'popup-error');
		} else if ($scope.competition.comp_type === undefined || $scope.competition.comp_type === "") {
			$rootScope.showPopup($ionicPopup,'Create Competition failed!','Competition type is required !', 'popup-error');
		} else if ($scope.competition.comp_numOfTeam === undefined || $scope.competition.comp_numOfTeam === "") {
			$rootScope.showPopup($ionicPopup,'Create Competition failed!','Number of teams is required !', 'popup-error');
		} else if ($scope.fee.checked == true && $scope.competition.comp_fee === undefined || $scope.competition.comp_fee === "") {
			$rootScope.showPopup($ionicPopup,'Create Competition failed!','registration fee is required !', 'popup-error');
		} else if ($scope.competition.comp_address.city === undefined || $scope.competition.comp_address.city === "") {
			$rootScope.showPopup($ionicPopup,'Create Competition failed!','city is required !', 'popup-error');
		} else if ($scope.competition.comp_address.venue === undefined || $scope.competition.comp_address.venue === "") {
			$rootScope.showPopup($ionicPopup,'Create Competition failed!','venue is required !', 'popup-error'); 
		} else if ($scope.competition.comp_start === undefined || $scope.competition.comp_start === "") {
			$rootScope.showPopup($ionicPopup,'Create Competition failed!','start date is required !', 'popup-error');
		} else if (isStartDateValid === false) {
			$rootScope.showPopup($ionicPopup,'Create Competition failed!','start date is not valid (must be minimal 14 day next to the day the competition is created)', 'popup-error');
		} else if ($scope.competition.comp_finish === undefined || $scope.competition.comp_finish === "") {
			$rootScope.showPopup($ionicPopup,'Create Competition failed!','end date is required !', 'popup-error');
		} else if (isEndDateValid === false) {
			$rootScope.showPopup($ionicPopup,'Create Competition failed!','end date is not valid (must be between 7 and 30 day next to the competition start date)', 'popup-error');
		} else if ($scope.competition.comp_name !== null && $scope.competition.comp_type !== null && $scope.competition.comp_numOfTeam !== null && $scope.competition.comp_start !== null && $scope.competition.comp_finish !== null) {
			console.log($scope.competition);

				CompetitionService.editCompetition($stateParams.competitionId, localStorage.getItem("token"), $scope.competition).success(function(data) {
					$ionicLoading.hide();
					var alertPopup = $ionicPopup.alert({
						title: 'Success',
						template: 'Berhasil Melakukan Perubahan Data Kompetisi'
					});
				}).error(function(data) {
					$ionicLoading.hide();
					var alertPopup = $ionicPopup.alert({
						title: 'Failed',
						template: 'Gagal Melakukan Perubahan Data Kompetisi'
					});
				});

				console.log($scope.profileData);
			 	ProfileService.editProfileById(localStorage.getItem("userid"), localStorage.getItem("token"), $scope.profileData).success(function(data) {
					console.log("berhasil");
					$state.go('app.home');
				}).error(function(data) {});

			}
		}
	// }).error(function(data) {});


		

		
		// if(isEquivalent($scope.competition, $scope.oldCompetition) === true){
		// 	console.log("tidak ada perubahan data");
		// 	var alertPopup = $ionicPopup.alert({
		// 		title: 'Gagal!',
		// 		template: 'Tidak Ada Perubahan Data'
		// 	});
		// }else{
		// 	console.log("ada data yang diubah");
		// }
		// CompetitionService.editCompetition($stateParams.competitionId, localStorage.getItem("token"), $scope.newCompetition).success(function(data) {
		// 	$ionicLoading.hide();
		// 	var alertPopup = $ionicPopup.alert({
		// 		title: 'Success!',
		// 		template: 'Berhasil Edit Kompetisi'
		// 	});
		// 	$state.go('app.home');
		// }).error(function(data) {
		// 	$ionicLoading.hide();
		// 	var alertPopup = $ionicPopup.alert({
		// 		title: 'Failed!',
		// 		template: 'Gagal Edit Kompetisi'
		// 	});
		// });
	};

	function isEquivalent(a, b) {
	    // Create arrays of property names
	    var aProps = Object.getOwnPropertyNames(a);
	    var bProps = Object.getOwnPropertyNames(b);

	    // If number of properties is different,
	    // objects are not equivalent
	    if (aProps.length != bProps.length) {
	        return false;
	    }

	    for (var i = 0; i < aProps.length; i++) {
	        var propName = aProps[i];

	        // If values of same property are not equal,
	        // objects are not equivalent
	        if (a[propName] !== b[propName]) {
	            return false;
	        }
	    }

	    // If we made it this far, objects
	    // are considered equivalent
	    return true;
	}

	$scope.backToCompetition = function() {
		$state.go('app.competition');
	};
	$scope.backToHome = function() {
		$state.go('app.home');
	};
})

.controller('RegisterTeamCtrl', function($scope, $state, $stateParams, $ionicPopup, $ionicPlatform, $ionicLoading, LoginService, MatchService, CompetitionService, ionicMaterialInk, ionicMaterialMotion, $cordovaSocialSharing, $compile, NgMap) {
	$ionicLoading.show({
		content: 'Login...',
		animation: 'fade-in',
		showBackdrop: true,
	});
	console.log($stateParams.competitionId);
	TeamService.getTeamByName($scope.menuProfile.team).success(function(data){
		console.log(data);
		$ionicLoading.hide();
		$scope.teamInvitationArr.push(data);
		console.log($scope.teamInvitationArr);
	}).error(function(data) {
		$ionicLoading.hide();
	});
		$scope.registered = false;
		$scope.registerArr = [];
		$scope.formTeam = {};
		$scope.formCompetition = {};
		$scope.formCompetition.CompetitionId = $stateParams.competitionId;
		$scope.formCompetition.UserId = localStorage.getItem("userid");
		console.log($scope.formCompetition.UserId);

		$scope.registerTeam = function(){
			$scope.formTeam.competitionId = $stateParams.competitionId;
			console.log( $scope.formTeam.competitionId);
			CompetitionService.registerTeam($scope.formTeam).success(function(data){
				$ionicLoading.hide();
				$state.go('app.competition');
			}).error(function(data){
				$ionicLoading.hide();
			});

			CompetitionService.addRegister($scope.formCompetition).success(function(data){
				$ionicLoading.hide();
				$state.go('app.competition');
			}).error(function(data){
				$ionicLoading.hide();
			});        
		};

		$scope.backToCompetition = function() {
			$state.go('app.competition');
		};
})

.controller('MyTeamCtrl', function($scope, $rootScope, $state, $stateParams, $ionicPopup, $ionicPlatform, $ionicLoading, $ionicModal, TeamService, LoginService, MatchService, PostService, ProfileService, CompetitionService, TrainingService, ionicMaterialInk, ionicMaterialMotion, $cordovaSocialSharing) {
	$scope.team = {};
	$scope.myTeam = {};
	$scope.myTeamData = {};
	$scope.teamAcronym = '';
	$scope.myTeamArr = [];
	$scope.teamAlreadyExist = false;
	$scope.NoInvitation = false;
	$scope.requestedTeamStatus = false;
	$scope.requestedTeamArr = [];
	$scope.joinTeam = false;
	$scope.haveMemberStatus = false;
	$scope.haveTeamStatus = false;
	$scope.teamInvitationStatus = false;
	$scope.teamInvitation = [];
	// $scope.showme = 1;
	$scope.coachTab = 1;
	$scope.counter = true;
	$scope.userProfile = {};

	// utk sementara di comment dlu
	// $ionicLoading.show({
	// 	content: 'Login...',
	// 	animation: 'fade-in',
	// 	showBackdrop: true,
	// });
	// bug stlh create team, loading tidak mau berhenti

	if(localStorage.getItem("showme") !== 1){
		$scope.showme = localStorage.getItem("showme");
	}else{
		$scope.showme = 1;
		localStorage.setItem("showme", 1);
	}
	
	// Get user profile data
	LoginService.getUserById(localStorage.getItem("userid")).success(function(data) {
		$scope.userProfile = data;
		$scope.teamInvitationStatus = false;
		$scope.requestedTeamStatus = false;
		
		// if($scope.userProfile.team !== null){
		// 	$scope.haveTeamStatus = true;
		// }
		if(localStorage.getItem("team") !== ''){
			$scope.haveTeamStatus = true;
		}
		if($scope.userProfile.teamRequested !== ""){
			$scope.requestedTeamStatus = true;
		}
		if($scope.userProfile.teamInvitation !== ""){
			$scope.teamInvitationStatus = true;
		}
		if($scope.userProfile.team === ''){
			$ionicLoading.hide();
		}
		console.log($scope.userProfile);
		
		// Manager 
		if($scope.userProfile.role === 'Manager'){
			// $ionicLoading.hide(); // utk sementara 
			$scope.createdTeam = {};
			$scope.joinedMember = [];
			$scope.joinedMemberData = [];
			$scope.invitedMember = [];
			$scope.invitedMemberData = [];
			$scope.coachRequest = [];
			$scope.coachRequestData = [];
			$scope.playerRequest = [];
			$scope.playerRequestData = [];
			$scope.userRequestData = [];
			$scope.goalKeeperData = {};
			$scope.defenderData = {};
			$scope.midfielderData = {};
			$scope.attackerData = {};
			
			if($scope.userProfile.team !== ''){
					TeamService.getTeamByName($scope.userProfile.team).success(function(data){

						$scope.createdTeam = data;

						if($scope.createdTeam.team_logo !== null){
							$scope.imgLoadCompleted = false;
							objImg = new Image();
							objImg.src = $scope.createdTeam.team_logo;
							objImg.onload = function(){
								console.log("alelele");
							    $scope.myTeamLogo = objImg.src;
							    $scope.imgLoadCompleted = true;
							    // $ionicLoading.hide();
							};
						}else{
							// $ionicLoading.hide();
						}


						if($scope.createdTeam.team_squad !== null){
							$scope.joinedMember = $scope.createdTeam.team_squad.split(",");

							console.log($scope.joinedMember);
							for(var i = 0; i < $scope.joinedMember.length; i++){
								LoginService.getUserByUsername($scope.joinedMember[i]).success(function(data){
									console.log(data);
									if(data !== null){
										$scope.joinedMemberData.push(data);
									}
								}).error(function(data) {
									// $ionicLoading.hide();
								});
							}

						}
						if($scope.createdTeam.invited_member !== null){
							$scope.invitedMember = $scope.createdTeam.invited_member.split(",");

							console.log($scope.invitedMember);
							var im = 0;
							function getInvitedMemberData() {
								$rootScope.showLoading();
							    LoginService.getUserByUsername($scope.invitedMember[im]).success(function(data){
									console.log(data);
									if(data !== null){
										$scope.invitedMemberData.push(data);
									}
								}).error(function(data) {
									// $ionicLoading.hide();
								});
							    im++;
							    if(im == $scope.invitedMember.length){
							    	$ionicLoading.hide();
							    }
							    if( im < $scope.invitedMember.length){
							        setTimeout( getInvitedMemberData, 500);
							    }
							}
							getInvitedMemberData();
							console.log($scope.invitedMemberData);
						}
						if($scope.createdTeam.coach_request !== null){
							$scope.coachRequest = $scope.createdTeam.coach_request.split(",");

							var cr = 0;
							function getCoachRequestData() {
							    LoginService.getUserByUsername($scope.coachRequest[cr]).success(function(data){
									console.log(data);
									if(data !== null){
										$scope.coachRequestData.push(data);
										$scope.userRequestData.push(data);
									}
								}).error(function(data) {
									// $ionicLoading.hide();
								});
							    cr++;
							    if(cr == $scope.coachRequest.length){
							    	// $ionicLoading.hide();
							    }
							    if(cr < $scope.coachRequest.length){
							        setTimeout( getCoachRequestData, 1000 );
							    }
							}
							getCoachRequestData();
							console.log($scope.coachRequestData);
						}
						if($scope.createdTeam.player_request !== null){
							$scope.playerRequest = $scope.createdTeam.player_request.split(",");

							var pr = 0;
							function getPlayerRequestData() {
							    LoginService.getUserByUsername($scope.playerRequest[pr]).success(function(data){
									console.log(data);
									if(data !== null){
										$scope.playerRequestData.push(data);
										$scope.userRequestData.push(data);
									}
								}).error(function(data) {
									// $ionicLoading.hide();
								});
							    pr++;
							    if(pr == $scope.playerRequest.length){
							    	// $ionicLoading.hide();
							    }
							    if(pr < $scope.playerRequest.length){
							        setTimeout( getPlayerRequestData, 1000 );
							    }
							}
							getPlayerRequestData();
							console.log($scope.playerRequestData);
							console.log($scope.userRequestData);
						}




						// Invited Members
						$scope.invitedMemberObj = [];
						$scope.invitedMembersArr = [];
						if($scope.createdTeam.invited_members === null || $scope.createdTeam.invited_members === '' || $scope.createdTeam.invited_members.name === undefined){
						
						}else{
							if($scope.createdTeam.invited_members.name.includes(",")){
								console.log("ada");
								$scope.invitedMemberName = $scope.createdTeam.invited_members.name.split(',');
								$scope.invitedMemberRole = $scope.createdTeam.invited_members.role.split(',');
								$scope.invitedMemberNumber = $scope.createdTeam.invited_members.invite_number.split(',');
								
							}else if($scope.createdTeam.invited_members.name !== ''){
								console.log("tidak ada");
								$scope.invitedMemberName = $scope.createdTeam.invited_members.name.toString();
								$scope.invitedMemberRole = $scope.createdTeam.invited_members.role.toString();
								$scope.invitedMemberNumber = $scope.createdTeam.invited_members.invite_number.toString();
							}

							if($scope.createdTeam.invited_members.name.includes(",")){
								for(var h = 0; h < $scope.invitedMemberName.length; h++){
									$scope.invitedMemberObj[h] = {};
									$scope.invitedMemberObj[h].name = $scope.invitedMemberName[h];
									$scope.invitedMemberObj[h].role = $scope.invitedMemberRole[h];
									$scope.invitedMemberObj[h].invite_number = $scope.invitedMemberNumber[h];
								}
							}else if($scope.createdTeam.invited_members.name !== ''){
								$scope.invitedMemberObj[0] = {};
								$scope.invitedMemberObj[0].name = $scope.invitedMemberName;
								$scope.invitedMemberObj[0].role = $scope.invitedMemberRole;
								$scope.invitedMemberObj[0].invite_number = $scope.invitedMemberNumber;
							}

							
							setTimeout(function(){
								$rootScope.showLoading();
								for(var item in $scope.invitedMemberObj){
									$scope.invitedMembersArr.push($scope.invitedMemberObj[item]);
								}
								console.log($scope.invitedMembersArr);
								setTimeout(function(){
									$ionicLoading.hide();
								},1000);
								console.log($scope.invitedMembersArr)
							},400);
						}
						
							

						

						// var jm = 0;
						// function getJoinedMemberData() {
						//     LoginService.getUserByUsername($scope.joinedMember[jm]).success(function(data){
						// 		console.log(data);
						// 		if(data !== null){
						// 			$scope.joinedMemberData.push(data);
						// 		}
						// 	}).error(function(data) {
						// 		// $ionicLoading.hide();
						// 	});
						//     jm++;
						//     if(jm == $scope.joinedMember.length){
						//     	// $ionicLoading.hide();
						//     }
						//     if(jm < $scope.joinedMember.length){
						//         setTimeout( getJoinedMemberData, 1000 );
						//     }
						// }
						// getJoinedMemberData();
						// console.log($scope.joinedMemberData);

					}).error(function(data) {});

					// Get data goalkeeper, defender, midfielder, and attacker
					console.log(localStorage.getItem("team"));
					
					// $scope.getGoalKeeper = function(){
						TeamService.getGoalkeeperByTeamName(localStorage.getItem("team")).success(function(data){
							console.log(data);
							if(data.length !== 0){
								console.log("tidak nol");
								$scope.goalkeeperData = data;
								clearInterval($scope.getGoalKeeperTimer);
							}
							// }else{
							// 	console.log("nol");
							// 	TeamService.getGoalkeeperByTeamName($scope.userProfile.team).success(function(data){
							// 		console.log(data);
							// 		$scope.goalkeeperData = data;
							// 	}).error(function(data) {});
							// }
						}).error(function(data) {});
					// };	
					// $scope.getGoalKeeperTimer = setInterval($scope.getGoalKeeper, 1000);

					TeamService.getDefenderByTeamName(localStorage.getItem("team")).success(function(data){
						console.log(data);
						if(data.length !== 0){
							console.log("tidak nol");
							$scope.defenderData = data;
						}else{
							console.log("nol");
							TeamService.getDefenderByTeamName(localStorage.getItem("team")).success(function(data){
								console.log(data);
								$scope.defenderData = data;
							}).error(function(data) {});
						}
					}).error(function(data) {});

					TeamService.getMidfielderByTeamName(localStorage.getItem("team")).success(function(data){
						console.log(data);
						if(data.length !== 0){
							console.log("tidak nol");
							$scope.midfielderData = data;
						}else{
							console.log("nol");
							TeamService.getMidfielderByTeamName(localStorage.getItem("team")).success(function(data){
								console.log(data);
								$scope.midfielderData = data;
							}).error(function(data) {});
						}
					}).error(function(data) {});

					TeamService.getAttackerByTeamName(localStorage.getItem("team")).success(function(data){
						console.log(data);
						if(data.length !== 0){
							console.log("tidak nol");
							$scope.attackerData = data;
						}else{
							console.log("nol");
							TeamService.getAttackerByTeamName(localStorage.getItem("team")).success(function(data){
								console.log(data);
								$scope.attackerData = data;
							}).error(function(data) {});
						}
					}).error(function(data) {});
					// Get data goalkeeper, defender, midfielder, and attacker

			}
		}

		// Coach and Player
		if($scope.userProfile.role === 'Player' || $scope.userProfile.role === 'Coach'){
			$scope.joinedMember = [];
			$scope.joinedMemberData = [];
			$scope.trainingData = [];
			$scope.lineupData = ['a','b'];
			$scope.teamInvitationData = [];
			$scope.teamInvitationDataArr = [];
			$scope.teamInvitationDataCount = 0;


			// function to get team invitation and the timer to reload data invitation
			// if($scope.teamInvitationStatus == true){
			// 	$scope.teamInvitationData = $scope.userProfile.teamInvitation.split(",");
				
			// 	for(var t = 0; t < $scope.teamInvitationData.length; t++){
			// 		TeamService.getTeamByName($scope.teamInvitationData[t]).success(function(data){
						
			// 			$scope.teamInvitationDataArr.push(data);
			// 			$scope.teamInvitationDataCount += 1;
			// 		}).error(function(data) {});
			// 	}

			// 	console.log($scope.teamInvitationDataArr);
			// }

			$scope.getTeamInvitation = function(){

				$scope.teamInvitationDataArr = [];
				if($scope.teamInvitationStatus == true){

					LoginService.getUserById(localStorage.getItem("userid")).success(function(data){
						console.log(data.teamInvitation);
						if(data.teamInvitation !== ""){
							$scope.teamInvitationData = data.teamInvitation.split(",");
						}else{
							$scope.teamInvitationData = [];
						}

						console.log($scope.teamInvitationData);

						if($scope.teamInvitationData.length != 0){
							for(var t = 0; t < $scope.teamInvitationData.length; t++){
								TeamService.getTeamByName($scope.teamInvitationData[t]).success(function(data){
									$scope.teamInvitationDataArr.push(data);
									$scope.teamInvitationDataCount += 1;
								}).error(function(data) {});

								// if(t == $scope.teamInvitationData.length - 1){
									// clearInterval($scope.getTeamInvitationTimer);
								// }
							}
							clearInterval($scope.getTeamInvitationTimer);
							console.log($scope.teamInvitationDataArr);
						}else{
							$scope.teamInvitationDataArr = [];
							clearInterval($scope.getTeamInvitationTimer);
						}

					}).error(function(data) {});					
				}
			};
			$scope.getTeamInvitationTimer = setInterval($scope.getTeamInvitation, 2000);
			// function to get team invitation and the timer to reload data invitation
			

			if($scope.userProfile.team !== ''){
				TeamService.getTeamByName($scope.userProfile.team).success(function(data){
					$ionicLoading.show({
						content: 'Login...',
						animation: 'fade-in',
						showBackdrop: true,
					});
					console.log(data);
					$scope.myTeamData = data;
					$scope.joinedMember = $scope.myTeamData.team_squad.split(",");
						console.log($scope.joinedMember);
						for(var i = 0; i < $scope.joinedMember.length; i++){
							LoginService.getUserByUsername($scope.joinedMember[i]).success(function(data){
								console.log(data);
								if(data !== null){
									$scope.joinedMemberData.push(data);
								}else{
									LoginService.getUserByUsername($scope.joinedMember[i]).success(function(data){
										console.log("masukkkk");
										if(data !== null){
											$scope.joinedMemberData.push(data);
										}
									}).error(function(data) {
										// $ionicLoading.hide();
									});
								}
							}).error(function(data) {
								// $ionicLoading.hide();
							});
						}
						console.log($scope.joinedMemberData);
						$ionicLoading.hide();

				}).error(function(data) {});
			}
			console.log("coasjafhgisg");

			if($scope.userProfile.teamRequested === null || $scope.userProfile.teamRequested === ''){
				console.log("dsfsdfsd");
			}else{
				console.log("ajsdlifkh flksh");
				$scope.requestedTeamArr = $scope.userProfile.teamRequested.split(',');
				console.log($scope.requestedTeamArr);

				$scope.requestedTeamDataArr = [];
				for(var t = 0; t < $scope.requestedTeamArr.length; t++){
					TeamService.getTeamByName($scope.requestedTeamArr[t]).success(function(data){
						console.log(data);
						$scope.requestedTeamDataArr.push(data);
					}).error(function(data) {});
				}
				console.log($scope.requestedTeamDataArr);
			}

			// Get All Training Data
			$scope.trainingDataArr = [];
			$scope.comingCounter = [];
			$scope.notComingCounter = [];
			$scope.unconfirmedCounter = [];

			TrainingService.getTraining(localStorage.getItem("myTeamId")).success(function(data){
				console.log(data);
				$scope.trainingDataArr = data;

				data.forEach(function(entry){
					console.log(entry);
					// coming counter
					if(entry.coming !== ""){
						$scope.comingArr = entry.coming.split(",");
						$scope.comingCounter[entry.id] = $scope.comingArr.length;
					}else{
						$scope.comingCounter[entry.id] = 0;
					}
					// not coming counter
					if(entry.not_coming !== ""){
						$scope.notComingArr = entry.not_coming.split(",");
						$scope.notComingCounter[entry.id] = $scope.notComingArr.length;
					}else{
						$scope.notComingCounter[entry.id] = 0;
					}
					// unconfirmed counter
					if(entry.unconfirmed !== ""){
						$scope.unconfirmedArr = entry.unconfirmed.split(",");
						$scope.unconfirmedCounter[entry.id] = $scope.unconfirmedArr.length;
					}else{
						$scope.unconfirmedCounter[entry.id] = 0;
					}
					
					console.log($scope.comingCounter[entry.id]);
				});
			}).error(function(data) {});

			$ionicModal.fromTemplateUrl('modals/modal_training.html', {
				scope: $scope,
				animation: 'slide-in-up'
			}).then(function(modal_training){
				$scope.modal_training = modal_training;
			});

			$scope.showModalTraining = function(id){
				$scope.modal_training.show();
				console.log(id);
				$scope.trainingData = {};
				$scope.comingCount = 0;
				$scope.notComingCount = 0;
				$scope.unconfirmedCount = 0;
				$scope.comingArr = [];
				$scope.notComingArr = [];
				$scope.unconfirmedArr = [];

				TrainingService.getTrainingById(id).success(function(data){
					console.log(data);
					$scope.trainingData = data;

					if($scope.trainingData.coming !== ""){
						$scope.comingArr = $scope.trainingData.coming.split(",");
						$scope.comingCount = $scope.comingArr.length;
					}else{
						$scope.comingCount = 0;
					}

					if($scope.trainingData.not_coming !== ""){
						$scope.notComingArr = $scope.trainingData.not_coming.split(",");
						$scope.notComingCount = $scope.notComingArr.length;
					}else{
						$scope.notComingCount = 0;
					}

					if($scope.trainingData.unconfirmed !== ""){
						$scope.unconfirmedArr = $scope.trainingData.unconfirmed.split(",");
						$scope.unconfirmedCount = $scope.unconfirmedArr.length;
					}else{
						$scope.unconfirmedCount = 0;
					}
					

				}).error(function(data) {});
			};

			$scope.coming = function(){

				console.log("coming");
				console.log($scope.trainingData.id);

				$scope.trainingForm = {};
				$scope.notComingArr = [];

				if($scope.trainingData.not_coming.includes(",")){
					$scope.notComingArr = $scope.trainingData.not_coming.split(",");
				}else{
					$scope.notComingArr.push($scope.trainingData.not_coming);
				}
				
				if($scope.trainingData.unconfirmed.includes(",")){
					$scope.unconfirmedArr = $scope.trainingData.unconfirmed.split(",");
				}else{
					$scope.unconfirmedArr.push($scope.trainingData.unconfirmed);
				}

				if($scope.trainingData.coming === ''){
					// Coming Data
					$scope.trainingForm.coming = $scope.menuProfile.username;
					// Not Coming Data
					if($scope.notComingArr.indexOf($scope.menuProfile.username) !== -1){
						console.log("asafa");
			            $scope.notComingArr.splice($scope.notComingArr.indexOf($scope.menuProfile.username), 1);
			            console.log($scope.notComingArr);
			            if($scope.notComingArr.length === 0){
					        $scope.trainingForm.not_coming = "";
					        console.log("0");
					    }else{
					       $scope.trainingForm.not_coming = $scope.notComingArr.join(",");
					    }
					}
					// Unconfirmed Data
					if($scope.unconfirmedArr.indexOf($scope.menuProfile.username) !== -1){
						console.log("asafsdsdsda");
			            $scope.unconfirmedArr.splice($scope.unconfirmedArr.indexOf($scope.menuProfile.username), 1);
			            console.log($scope.unconfirmedArr);
			            $scope.trainingForm.unconfirmed = $scope.unconfirmedArr.join(",");
					}
				}else if($scope.trainingData.coming.includes($scope.menuProfile.username)){
					console.log("you are already confirmed!");
				}else{
					// Coming Data
					$scope.trainingForm.coming = $scope.menuProfile.username + "," + $scope.trainingData.coming;
					// Not Coming Data
					if($scope.notComingArr.indexOf($scope.menuProfile.username) !== -1){
						console.log("asafa");
			            $scope.notComingArr.splice($scope.notComingArr.indexOf($scope.menuProfile.username), 1);
			            console.log($scope.notComingArr);
			            $scope.trainingForm.not_coming = $scope.notComingArr.join(",");
					}
					// Unconfirmed Data
					if($scope.unconfirmedArr.indexOf($scope.menuProfile.username) !== -1){
						console.log("asafsdsdsda");
			            $scope.unconfirmedArr.splice($scope.unconfirmedArr.indexOf($scope.menuProfile.username), 1);
			            console.log($scope.unconfirmedArr);
			            $scope.trainingForm.unconfirmed = $scope.unconfirmedArr.join(",");
					}
				}
				console.log($scope.trainingForm);
				TrainingService.editTrainingById($scope.trainingData.id,$scope.trainingForm).success(function(data) {
					console.log(data);
					console.log("berhasil");
					$scope.modal_training.hide();
		            $state.go($state.current, {}, {
		                reload: true
		            });
		             $scope.showme = 2;
				}).error(function(data) {});

			};

			$scope.notComing = function(){

				console.log("not coming");
				console.log($scope.trainingData.id);

				$scope.trainingForm = {};
				$scope.comingArr = [];

				if($scope.trainingData.coming.includes(",")){
					$scope.comingArr = $scope.trainingData.coming.split(",");
				}else{
					$scope.comingArr.push($scope.trainingData.coming);
				}
				console.log($scope.comingArr);

				if($scope.trainingData.unconfirmed.includes(",")){
					$scope.unconfirmedArr = $scope.trainingData.unconfirmed.split(",");
				}else{
					$scope.unconfirmedArr.push($scope.trainingData.unconfirmed);
				}
				console.log($scope.unconfirmedArr);

				if($scope.trainingData.not_coming === ''){
					// Not Coming Data
					$scope.trainingForm.not_coming = $scope.menuProfile.username;
					// Coming Data
					if($scope.comingArr.indexOf($scope.menuProfile.username) !== -1){
						console.log("asafa");
			            $scope.comingArr.splice($scope.comingArr.indexOf($scope.menuProfile.username), 1);
			            console.log($scope.comingArr);
			            if($scope.comingArr.length === 0){
					        $scope.trainingForm.coming = "";
					        console.log("0");
					    }else{
					        $scope.trainingForm.coming = $scope.comingArr.join(",");
					    }
					}
					// Unconfirmed Data
					if($scope.unconfirmedArr.indexOf($scope.menuProfile.username) !== -1){
						console.log("asafsdsdsda");
			            $scope.unconfirmedArr.splice($scope.unconfirmedArr.indexOf($scope.menuProfile.username), 1);
			            console.log($scope.unconfirmedArr);
			            $scope.trainingForm.unconfirmed = $scope.unconfirmedArr.join(",");
					}
				}else if($scope.trainingData.not_coming.includes($scope.menuProfile.username)){
					console.log("you are already confirmed!");
				}else{
					// Not Coming Data
					$scope.trainingForm.not_coming = $scope.menuProfile.username + "," + $scope.trainingData.not_coming;
					// Coming Data
					if($scope.comingArr.indexOf($scope.menuProfile.username) !== -1){
						console.log("asafa");
			            $scope.comingArr.splice($scope.comingArr.indexOf($scope.menuProfile.username), 1);
			            console.log($scope.comingArr);
			            $scope.trainingForm.coming = $scope.comingArr.join(",");
					}
					// Unconfirmed Data
					if($scope.unconfirmedArr.indexOf($scope.menuProfile.username) !== -1){
						console.log("asafsdsdsda");
			            $scope.unconfirmedArr.splice($scope.unconfirmedArr.indexOf($scope.menuProfile.username), 1);
			            console.log($scope.unconfirmedArr);
			            $scope.trainingForm.unconfirmed = $scope.unconfirmedArr.join(",");
					}
				}
				console.log($scope.trainingForm);
				TrainingService.editTrainingById($scope.trainingData.id,$scope.trainingForm).success(function(data) {
					console.log(data);
					console.log("berhasil");
		            $scope.modal_training.hide();
		            $state.go($state.current, {}, {
		                reload: true
		            });
		            $scope.showme = 2;
				}).error(function(data) {});
			};


			$ionicModal.fromTemplateUrl('modals/modal_coming.html', {
				scope: $scope,
				animation: 'slide-in-up'
			}).then(function(modal_coming){
				$scope.modal_coming = modal_coming;
			});

			$ionicModal.fromTemplateUrl('modals/modal_not_coming.html', {
				scope: $scope,
				animation: 'slide-in-up'
			}).then(function(modal_not_coming){
				$scope.modal_not_coming = modal_not_coming;
			});

			$ionicModal.fromTemplateUrl('modals/modal_unconfirmed.html', {
				scope: $scope,
				animation: 'slide-in-up'
			}).then(function(modal_unconfirmed){
				$scope.modal_unconfirmed = modal_unconfirmed;
			});

			$scope.showComingDetail = function(id){
				$scope.modal_coming.show();
				console.log(id);
				$scope.trainingData = {};
				$scope.comingArr = [];
				$scope.comingDataArr = [];
				TrainingService.getTrainingById(id).success(function(data){
					console.log(data);
					$scope.trainingData = data;
					$scope.comingArr = $scope.trainingData.coming.split(",");
					for(var i = 0; i < $scope.comingArr.length; i++){
						LoginService.getUserByUsername($scope.comingArr[i]).success(function(data){
							console.log(data);
							$ionicLoading.hide();
							if(data !== null){
								$scope.comingDataArr.push(data);
								console.log($scope.comingDataArr);
							}
						}).error(function(data) {
							$ionicLoading.hide();
						});
					}
				}).error(function(data) {});
			};

			$scope.showNotComingDetail = function(id){
				$scope.modal_not_coming.show();
				console.log(id);
				$scope.trainingData = {};
				$scope.notComingArr = [];
				$scope.notComingDataArr = [];
				TrainingService.getTrainingById(id).success(function(data){
					console.log(data);
					$scope.trainingData = data;
					$scope.notComingArr = $scope.trainingData.not_coming.split(",");
					for(var i = 0; i < $scope.notComingArr.length; i++){
						LoginService.getUserByUsername($scope.notComingArr[i]).success(function(data){
							console.log(data);
							$ionicLoading.hide();
							if(data !== null){
								$scope.notComingDataArr.push(data);
								console.log($scope.notComingDataArr);
							}
						}).error(function(data) {
							$ionicLoading.hide();
						});
					}
				}).error(function(data) {});
			};

			$scope.showUnconfirmedDetail = function(id){
				$scope.modal_unconfirmed.show();
				console.log(id);
				$scope.trainingData = {};
				$scope.unconfirmedArr = [];
				$scope.unconfirmedDataArr = [];
				TrainingService.getTrainingById(id).success(function(data){
					console.log(data);
					$scope.trainingData = data;
					$scope.unconfirmedArr = $scope.trainingData.unconfirmed.split(",");
					for(var i = 0; i < $scope.unconfirmedArr.length; i++){
						LoginService.getUserByUsername($scope.unconfirmedArr[i]).success(function(data){
							console.log(data);
							$ionicLoading.hide();
							if(data !== null){
								$scope.unconfirmedDataArr.push(data);
								console.log($scope.unconfirmedDataArr);
							}
						}).error(function(data) {
							$ionicLoading.hide();
						});
					}
				}).error(function(data) {});
			};
			// Get Training Data

			// Get Lineup Data
			$scope.lineupData = {};
			MatchService.getMatchesByTeam(localStorage.getItem("team")).success(function(data){
				console.log(data);
				$scope.lineupData = data;
				$scope.lineupStatus = [];
				$scope.compName = [];

				data.forEach(function(entry){
					CompetitionService.getCompetitionName(entry.competition_id).success(function(data) {
						$scope.compName[entry.id] = data;					
					}).error(function(data) {});


					if(entry.match_homeTeam === localStorage.getItem("team")){
						console.log("hometeam");
						if(entry.match_homeTeamObj !== null){
							if(entry.match_homeTeamObj.lineup !== ''){
								$scope.lineupStatus[entry.id] = localStorage.getItem("team");
							}else{
								$scope.lineupStatus[entry.id] = false;
							}
						}
						
					}else{
						console.log("awayTeam");
						if(entry.match_awayTeamObj !== null){
							if(entry.match_awayTeamObj.lineup !== ''){
								$scope.lineupStatus[entry.id] = localStorage.getItem("team");
							}else{
								$scope.lineupStatus[entry.id] = false;
							}
						}
					
					}

				});

			}).error(function(data) {});
			// Get Lineup Data
			
		}
	}).error(function(data) {});

	console.log(localStorage.getItem("isCoach"));
	console.log($scope.menuProfile);
	$scope.userTeam = localStorage.getItem("team");
	console.log($scope.userTeam);

	$scope.tab1 = function(){
		$scope.showme = 1;
	};
	$scope.tab2 = function(){
		$scope.showme = 2;
	};
	$scope.tab3 = function(){
		$scope.showme = 3;
	};
	$scope.coachTab1 = function(){
		$scope.coachTab = 1;
	};
	$scope.coachTab2 = function(){
		$scope.coachTab = 2;
		// $scope.counter = false;
	};
	$scope.coachTab3 = function(){
		$scope.coachTab = 3;
		$scope.counter = false;
	};

	console.log($scope.menuProfile.teamRequested);

	$scope.myTeamData = {};
	$scope.invited_member = [];
	$scope.playerRequest = '';
	$scope.coachRequest = '';
	
	if($scope.menuProfile.team !== '' || $scope.menuProfile.team !== null){
		$scope.joinTeam = true;
		console.log("already joining a team");
	}

	if($scope.menuProfile.teamRequested !== '' || $scope.menuProfile.teamRequested !== null){
		$scope.requestedTeam = true;
		console.log("requested a team");
	}else{
		$scope.requestedTeam = false;
		console.log("not requested a team");
	}

	if($scope.menuProfile.teamInvitation !== '' || $scope.menuProfile.teamInvitation !== null){
		$scope.teamInvited = true;
	}else{
		$scope.teamInvited = false;
	}

	TeamService.getTeam(localStorage.getItem("token")).success(function(data) {
		console.log(data);
		$scope.team = data;
		// $ionicLoading.hide();
		console.log(localStorage.getItem("userid"));
		console.log($scope.team);
		for(var i = 0; i < $scope.team.length; i++){
			console.log($scope.team[i].coach_id);
			if($scope.team[i].coach_id == localStorage.getItem("userid")){
				console.log("team exist");
				$scope.myTeam = $scope.team[i];
				$scope.teamAlreadyExist = true;
				console.log($scope.myTeam);
				console.log($scope.teamAlreadyExist);
			}
		}

	$scope.teamSquadArr = [];
	if($scope.menuProfile.team !== null){
		TeamService.getTeamSquad($scope.menuProfile.team).success(function(data){
			console.log("sdfsdf dfsdfs dfsfdsdf");
			// $ionicLoading.hide();
			$scope.teamSquadArr = data;
			console.log($scope.teamSquadArr);
		}).error(function(data) {
			// $ionicLoading.hide();
		});
	}
	}).error(function(data) {
		// $ionicLoading.hide();
	});

	$scope.coachData = {};
	$scope.playerData = {};
	$scope.acceptPlayerRequest = function(username) {	
		var confirmPopup = $ionicPopup.confirm({
			title: 'Accept Player Request',
			template: 'Are you sure?'
		});
		LoginService.getUserByUsername(username).success(function(data){
			$scope.playerData = data;
			$ionicLoading.hide();

		confirmPopup.then(function(res) {
	        if(res) {
	        
				$scope.squadData = {};
				$scope.squadData.Member = username;
				$scope.squadData.TeamName = $scope.menuProfile.team;
				console.log($scope.squadData);
				TeamService.addMemberByName($scope.squadData).success(function(data){
					// $ionicLoading.hide();
					console.log("sukses wuhuhuhu");
					// $state.go('app.team');
				}).error(function(data){
					// $ionicLoading.hide();
				});

				$scope.userSquad = {};
				$scope.userSquad.TeamName = $scope.menuProfile.team;
				$scope.userSquad.UserId = $scope.playerData.id;
				console.log($scope.userSquad);
				TeamService.addTeamToUser($scope.userSquad).success(function(data){
					// $ionicLoading.hide();
					console.log("sukses wahahah");
					// $state.go('app.team');
				}).error(function(data){
					// $ionicLoading.hide();
				});


				$scope.delRequest = {};
				$scope.delRequest.TeamName = $scope.menuProfile.team;
				$scope.delRequest.playerRequest = username;
				console.log($scope.delRequest);
				TeamService.delPlayerRequest($scope.delRequest).success(function(data){
					// $ionicLoading.hide();
					console.log("sukses alelele");
					// $state.go('app.team');
				}).error(function(data){
					// $ionicLoading.hide();
				});

				$scope.delRequestedTeam = {};
				$scope.delRequestedTeam.Username = username;
				$scope.delRequestedTeam.teamRequested = $scope.menuProfile.team;
				console.log($scope.delRequestedTeam);
				TeamService.delRequestedTeam($scope.delRequestedTeam).success(function(data){
					// $ionicLoading.hide();
					console.log("sukses ulelele");
					// $state.go('app.team');
				}).error(function(data){
					// $ionicLoading.hide();
				});

				setTimeout(function(){
					$state.go($state.current, {}, {
	                    reload: true
	                });
				},4000);
            	
            	
	        } else {
	            console.log('Not sure!');
	        }
	    }); 

		}).error(function(data) {
			$ionicLoading.hide();
		});
	};
	$scope.acceptCoachRequest = function(username) {	
		LoginService.getUserByUsername(username).success(function(data){
			$scope.playerData = data;
			$ionicLoading.hide();

		var confirmPopup = $ionicPopup.confirm({
			title: 'Accept Coach Request',
			template: 'Are you sure?'
		});

		confirmPopup.then(function(res) {
	        if(res) {
	        
				$scope.squadData = {};
				$scope.squadData.Member = username;
				$scope.squadData.TeamName = $scope.menuProfile.team;
				console.log($scope.squadData);
				TeamService.addMemberByName($scope.squadData).success(function(data){
					// $ionicLoading.hide();
					console.log("sukses wuhuhuhu");
					// $state.go('app.team');
				}).error(function(data){
					// $ionicLoading.hide();
				});

				$scope.userSquad = {};
				$scope.userSquad.TeamName = $scope.menuProfile.team;
				$scope.userSquad.UserId = $scope.playerData.id;
				console.log($scope.userSquad);
				TeamService.addTeamToUser($scope.userSquad).success(function(data){
					// $ionicLoading.hide();
					console.log("sukses wahahah");
					// $state.go('app.team');
				}).error(function(data){
					// $ionicLoading.hide();
				});


				$scope.teamInfo = {};
				$scope.teamInfo.team_coach = username;
				TeamService.editTeamById(localStorage.getItem("myTeamId"), $scope.teamInfo).success(function(data) {
            		console.log(data);
                }).error(function(data) {});


				$scope.delRequest = {};
				$scope.delRequest.TeamName = $scope.menuProfile.team;
				$scope.delRequest.playerRequest = username;
				console.log($scope.delRequest);
				TeamService.delPlayerRequest($scope.delRequest).success(function(data){
					// $ionicLoading.hide();
					console.log("sukses alelele");
					// $state.go('app.team');
				}).error(function(data){
					// $ionicLoading.hide();
				});

				$scope.delRequestedTeam = {};
				$scope.delRequestedTeam.Username = username;
				$scope.delRequestedTeam.teamRequested = $scope.menuProfile.team;
				console.log($scope.delRequestedTeam);
				TeamService.delRequestedTeam($scope.delRequestedTeam).success(function(data){
					// $ionicLoading.hide();
					console.log("sukses ulelele");
					// $state.go('app.team');
				}).error(function(data){
					// $ionicLoading.hide();
				});

				setTimeout(function(){
					$state.go($state.current, {}, {
	                    reload: true
	                });
				},4000);
            	
            	
	        } else {
	            console.log('Not sure!');
	        }
	    }); 

		}).error(function(data) {
			$ionicLoading.hide();
		});
	};
	$scope.acceptTeamInvitation = function(teamName,teamId) {	
		var confirmPopup = $ionicPopup.confirm({
			title: 'Accept Team Invitation',
			template: 'Are you sure?'
		});

		$scope.squadData = {};
		$scope.squadData.Member = $scope.menuProfile.username;
		$scope.squadData.TeamName = teamName;

		$scope.userSquad = {};
		$scope.userSquad.TeamName = teamName;
		$scope.userSquad.UserId = $scope.menuProfile.id;

		$scope.teamInfo = {};
		$scope.teamInfo.team_coach = $scope.menuProfile.username;

		$scope.delInvitation = {};
		$scope.delInvitation.UserName = $scope.menuProfile.username;
		$scope.delInvitation.teamInvite = teamName;

		$scope.delInvitedMember = {};
		$scope.delInvitedMember.TeamName = teamName;
		$scope.delInvitedMember.userInvited = $scope.menuProfile.username;

		console.log($scope.squadData);
		console.log($scope.userSquad);
		console.log($scope.teamInfo);
		console.log($scope.delInvitation);
		console.log($scope.delInvitedMember);

		confirmPopup.then(function(res) {
	        if(res) {

	        	TeamService.editTeamById(teamId, $scope.teamInfo).success(function(data) {
            		console.log(data);
                }).error(function(data) {});

	        
				TeamService.addMemberByName($scope.squadData).success(function(data){
					// $ionicLoading.hide();
					console.log("sukses wuhuhuhu");
					// $state.go('app.team');
				}).error(function(data){
					// $ionicLoading.hide();
				});

				TeamService.addTeamToUser($scope.userSquad).success(function(data){
					// $ionicLoading.hide();
					console.log("sukses wahahah");
					// $state.go('app.team');
				}).error(function(data){
					// $ionicLoading.hide();
				});

				TeamService.delTeamInvitation($scope.delInvitation).success(function(data){
					// $ionicLoading.hide();
					console.log(data);
					// $state.go('app.team');
				}).error(function(data){
					// $ionicLoading.hide();
				});


				TeamService.delInvitedMember($scope.delInvitedMember).success(function(data){
					// $ionicLoading.hide();
					console.log("sukses ulelele");
					// $state.go('app.team');
				}).error(function(data){
					// $ionicLoading.hide();
				});
				// $state.go('app.my_team');   

				setTimeout(function(){
					$state.go($state.current, {}, {
	                    reload: true
	                });
				},4000);
            	
            	
	        } else {
	            console.log('Not sure!');
	        }
	    }); 
	};
	$scope.declinePlayerRequest = function(username) {	
	
		var confirmPopup = $ionicPopup.confirm({
			title: 'Decline Player Request',
			template: 'Are you sure?'
		});

		confirmPopup.then(function(res) {
	        if(res) {
	        
				$scope.delRequest = {};
				$scope.delRequest.TeamName = $scope.menuProfile.team;
				$scope.delRequest.playerRequest = username;
				console.log($scope.delRequest);
				TeamService.delPlayerRequest($scope.delRequest).success(function(data){
					// $ionicLoading.hide();
					console.log("sukses alelele");
					// $state.go('app.team');
				}).error(function(data){
					// $ionicLoading.hide();
				});

				$scope.delRequestedTeam = {};
				$scope.delRequestedTeam.Username = username;
				$scope.delRequestedTeam.teamRequested = $scope.menuProfile.team;
				console.log($scope.delRequestedTeam);
				TeamService.delRequestedTeam($scope.delRequestedTeam).success(function(data){
					// $ionicLoading.hide();
					console.log("sukses ulelele");
					// $state.go('app.team');
				}).error(function(data){
					// $ionicLoading.hide();
				});

				setTimeout(function(){
					$state.go($state.current, {}, {
	                    reload: true
	                });
				},4000);
            	
            	
	        } else {
	            console.log('Not sure!');
	        }
	    });     
	};
	$scope.declineCoachRequest = function(username) {	
	
		var confirmPopup = $ionicPopup.confirm({
			title: 'Decline Coach Request',
			template: 'Are you sure?'
		});

		confirmPopup.then(function(res) {
	        if(res) {
	        
				$scope.delRequest = {};
				$scope.delRequest.TeamName = $scope.menuProfile.team;
				$scope.delRequest.coachRequest = username;
				console.log($scope.delRequest);
				TeamService.delPlayerRequest($scope.delRequest).success(function(data){
					// $ionicLoading.hide();
					console.log("sukses alelele");
					// $state.go('app.team');
				}).error(function(data){
					// $ionicLoading.hide();
				});

				$scope.delRequestedTeam = {};
				$scope.delRequestedTeam.Username = username;
				$scope.delRequestedTeam.teamRequested = $scope.menuProfile.team;
				console.log($scope.delRequestedTeam);
				TeamService.delRequestedTeam($scope.delRequestedTeam).success(function(data){
					// $ionicLoading.hide();
					console.log("sukses ulelele");
					// $state.go('app.team');
				}).error(function(data){
					// $ionicLoading.hide();
				});

				setTimeout(function(){
					$state.go($state.current, {}, {
	                    reload: true
	                });
				},4000);
            	
            	
	        } else {
	            console.log('Not sure!');
	        }
	    });     
	};
	$scope.declineTeamInvitation = function(teamName,teamId) {	
	
		var confirmPopup = $ionicPopup.confirm({
			title: 'Decline Team Invitation',
			template: 'Are you sure?'
		});
		$scope.invitedMemberForm = {};
		$scope.invitedMemberForm.invited_members = {};

		TeamService.getTeamByName(teamName).success(function(data){
			var invitedMemberName = data.invited_members.name.split(",");
			var invitedMemberRole = data.invited_members.role.split(",");
			var invitedMemberInviteNumber = data.invited_members.invite_number.split(",");

			var index = invitedMemberName.indexOf($scope.menuProfile.username);

			invitedMemberName.splice(index, 1);
			invitedMemberRole.splice(index, 1);
			invitedMemberInviteNumber.splice(index, 1);

			$scope.invitedMemberForm.invited_members.name = invitedMemberName.join(",");
			$scope.invitedMemberForm.invited_members.role = invitedMemberRole.join(",");
			$scope.invitedMemberForm.invited_members.invite_number = invitedMemberInviteNumber.join(",");

		}).error(function(data) {});	

		console.log($scope.invitedMemberForm);

		confirmPopup.then(function(res) {
	        if(res) {
	        	$rootScope.showLoading($ionicLoading);
				console.log(teamName);
				$scope.delInvitation = {};
				$scope.delInvitation.UserName = $scope.menuProfile.username;
				$scope.delInvitation.teamInvite = teamName;
				TeamService.delTeamInvitation($scope.delInvitation).success(function(data){
					// $ionicLoading.hide();
					console.log("sukses alelele");
					// $state.go('app.team');
				}).error(function(data){
					// $ionicLoading.hide();
				});

				TeamService.editTeamById(teamId, $scope.invitedMemberForm).success(function(data) {
            		console.log(data);
                }).error(function(data) {});

				$scope.delInvitedMember = {};
				$scope.delInvitedMember.TeamName = teamName;
				$scope.delInvitedMember.userInvited = $scope.menuProfile.username;
				TeamService.delInvitedMember($scope.delInvitedMember).success(function(data){
					console.log("sukses ulelele");
					// $state.go('app.team');
				}).error(function(data){
					// $ionicLoading.hide();
				});

				setTimeout(function(){
					$ionicLoading.hide();
					$state.go($state.current, {}, {
	                    reload: true
	                });
				},2000);
            	
            	
	        } else {
	            console.log('Not sure!');
	        }
	    });     
	};



	// $scope.addCoachToTeam = function(username) {	
	// 	LoginService.getUserByUsername(username).success(function(data){
	// 		console.log(data);
	// 		$ionicLoading.hide();
	// 		$scope.coachData = data;
	// 		console.log($scope.coachData);
	// 		$scope.squadData = {};

	// 	$scope.squadData.Member = username;
	// 	$scope.squadData.TeamName = $scope.menuProfile.team;

	// 	TeamService.addMemberByName($scope.squadData).success(function(data){
	// 		// $ionicLoading.hide();
	// 		console.log("sukses wuhuhuhu");
	// 		// $state.go('app.team');
	// 	}).error(function(data){
	// 		// $ionicLoading.hide();
	// 	});

	// 	$scope.userSquad = {};
	// 	$scope.userSquad.TeamName = $scope.menuProfile.team;
	// 	$scope.userSquad.UserId = $scope.coachData.id;
	// 	TeamService.addTeamToUser($scope.userSquad).success(function(data){
	// 		// $ionicLoading.hide();
	// 		console.log("sukses wahahah");
	// 		// $state.go('app.team');
	// 	}).error(function(data){
	// 		// $ionicLoading.hide();
	// 	});


	// 	$scope.delInvitation = {};
	// 	$scope.delInvitation.UserName = username;
	// 	$scope.delInvitation.teamInvite = $scope.menuProfile.team;
	// 	TeamService.delTeamInvitation($scope.delInvitation).success(function(data){
	// 		// $ionicLoading.hide();
	// 		console.log("sukses alelele");
	// 		// $state.go('app.team');
	// 	}).error(function(data){
	// 		// $ionicLoading.hide();
	// 	});

	// 	$scope.delInvitedMember = {};
	// 	$scope.delInvitedMember.TeamName = username;
	// 	$scope.delInvitedMember.userInvited = $scope.menuProfile.team;
	// 	TeamService.delInvitedMember($scope.delInvitedMember).success(function(data){
	// 		// $ionicLoading.hide();
	// 		console.log("sukses ulelele");
	// 		// $state.go('app.team');
	// 	}).error(function(data){
	// 		// $ionicLoading.hide();
	// 	});

	// 	}).error(function(data) {
	// 		$ionicLoading.hide();
	// 	});
	// };
	// $scope.delCoachRequest = function(username) {
	// 		console.log("hqweiq2yei uqwguqwteuiqe");
	// 		console.log(username);
	// 		$scope.delInvitation = {};
	// 		$scope.delInvitation.UserName = username;
	// 		$scope.delInvitation.teamInvite = $scope.menuProfile.team;
	// 		TeamService.delTeamInvitation($scope.delInvitation).success(function(data){
	// 			// $ionicLoading.hide();
	// 			console.log("sukses alelele");
	// 			// $state.go('app.team');
	// 		}).error(function(data){
	// 			// $ionicLoading.hide();
	// 		});

	// 		$scope.delInvitedMember = {};
	// 		$scope.delInvitedMember.TeamName = $scope.menuProfile.team;
	// 		$scope.delInvitedMember.userInvited = username;
	// 		TeamService.delInvitedMember($scope.delInvitedMember).success(function(data){
	// 			// $ionicLoading.hide();
	// 			console.log("sukses ulelele");
	// 			// $state.go('app.team');
	// 		}).error(function(data){
	// 			// $ionicLoading.hide();
	// 		});
	// };
	// $scope.addUserToTeamSquad = function(teamName,teamId) {

	// 	console.log(teamName);
	// 	console.log(teamId);

	// 	var confirmPopup = $ionicPopup.confirm({
	// 		title: 'Accept Invitation',
	// 		template: 'Are you sure?'
	// 	});
	// 	confirmPopup.then(function(res) {
	//         if(res) {
	//         	$scope.squadData = {};
	// 			$scope.squadData.Member = $scope.menuProfile.username;
	// 			$scope.squadData.TeamName = teamName;

	// 			TeamService.addMemberByName($scope.squadData).success(function(data){
	// 				// $ionicLoading.hide();
	// 				console.log("sukses wuhuhuhu");
	// 				// $state.go('app.team');
	// 			}).error(function(data){
	// 				// $ionicLoading.hide();
	// 			});

	// 			$scope.userSquad = {};
	// 			$scope.userSquad.TeamName = teamName;
	// 			$scope.userSquad.UserId = $scope.menuProfile.id;
	// 			TeamService.addTeamToUser($scope.userSquad).success(function(data){
	// 				// $ionicLoading.hide();
	// 				console.log("sukses wahahah");
	// 				// $state.go('app.team');
	// 			}).error(function(data){
	// 				// $ionicLoading.hide();
	// 			});

	// 			$scope.teamInfo = {};
	// 			$scope.teamInfo.team_coach = $scope.menuProfile.username;
	// 			TeamService.editTeamById(teamId, $scope.teamInfo).success(function(data) {
 //            		console.log(data);
 //                }).error(function(data) {});

	// 			$scope.delInvitation = {};
	// 			$scope.delInvitation.UserName = $scope.menuProfile.username;
	// 			$scope.delInvitation.teamInvite = teamName;
	// 			TeamService.delTeamInvitation($scope.delInvitation).success(function(data){
	// 				// $ionicLoading.hide();
	// 				console.log(data);
	// 				// $state.go('app.team');
	// 			}).error(function(data){
	// 				// $ionicLoading.hide();
	// 			});

	// 			$scope.delInvitedMember = {};
	// 			$scope.delInvitedMember.TeamName = teamName;
	// 			$scope.delInvitedMember.userInvited = $scope.menuProfile.username;
	// 			TeamService.delInvitedMember($scope.delInvitedMember).success(function(data){
	// 				// $ionicLoading.hide();
	// 				console.log("sukses ulelele");
	// 				// $state.go('app.team');
	// 			}).error(function(data){
	// 				// $ionicLoading.hide();
	// 			});
	// 			// $state.go('app.my_team');   
				
 //            	$state.go($state.current, {}, {
 //                    reload: true
 //                });
            	
	//         } else {
	//             console.log('Not sure!');
	//         }
	//     });   
	// };
	// $scope.delTeamInvitation = function(teamName) {

	// 	console.log(teamName);

	// 	var confirmPopup = $ionicPopup.confirm({
	// 		title: 'Decline Invitation',
	// 		template: 'Are you sure?'
	// 	});
	// 	confirmPopup.then(function(res) {
	//         if(res) {
	//         	$scope.delInvitation = {};
	// 			$scope.delInvitation.UserName = $scope.menuProfile.username;
	// 			$scope.delInvitation.teamInvite = teamName;
	// 			TeamService.delTeamInvitation($scope.delInvitation).success(function(data){
	// 				// $ionicLoading.hide();
	// 				console.log("sukses alelele");
	// 				// $state.go('app.team');
	// 			}).error(function(data){
	// 				// $ionicLoading.hide();
	// 			});

	// 			$scope.delInvitedMember = {};
	// 			$scope.delInvitedMember.TeamName = teamName;
	// 			$scope.delInvitedMember.userInvited = $scope.menuProfile.username;
	// 			TeamService.delInvitedMember($scope.delInvitedMember).success(function(data){
	// 				// $ionicLoading.hide();
	// 				console.log("sukses ulelele");
	// 				// $state.go('app.team');
	// 			}).error(function(data){
	// 				// $ionicLoading.hide();
	// 			});
	// 			// $state.go('app.my_team'); 
	// 			$state.go($state.current, {}, {
 //                    reload: true
 //                });
	// 			$scope.getTeamInvitationTimer = setInterval($scope.getTeamInvitation, 1000);
	//         } else {
	//             console.log('Not sure!');
	//         }
	//     });   
	// };
	// $scope.delUserFromInvitedMember = function(teamName) {
	// 	console.log(teamName);
	// 	$scope.delInvitation = {};
	// 	$scope.delInvitation.UserName = $scope.menuProfile.username;
	// 	$scope.delInvitation.teamInvite = teamName;
	// 	TeamService.delTeamInvitation($scope.delInvitation).success(function(data){
	// 		// $ionicLoading.hide();
	// 		console.log("sukses alelele");
	// 		// $state.go('app.team');
	// 	}).error(function(data){
	// 		// $ionicLoading.hide();
	// 	});

	// 	$scope.delInvitedMember = {};
	// 	$scope.delInvitedMember.TeamName = teamName;
	// 	$scope.delInvitedMember.userInvited = $scope.menuProfile.username;
	// 	TeamService.delInvitedMember($scope.delInvitedMember).success(function(data){
	// 		// $ionicLoading.hide();
	// 		console.log("sukses ulelele");
	// 		// $state.go('app.team');
	// 	}).error(function(data){
	// 		// $ionicLoading.hide();
	// 	});
	// };
	$scope.goToMemberDetail = function(id) {
		$state.go('app.member_profile', {
			'userID': id
		});
	};
	$scope.goToTeamDetail = function(id) {
		$state.go('app.team_detail', {
			'teamId': id
		});
	};
	$scope.goToChatDetail = function(username) {
		$state.go('app.chat_detail', {
			'username': username
		});
	};
	$scope.createTeam = function() {
		$state.go('app.create_team');
	};
	$scope.goToCreateTraining = function(){
		$state.go('app.create_training');
	};
	$scope.searchTeam = function() {
		$state.go('app.searchTeam');
	};
	$scope.searchCoach = function() {
		$scope.searchedPlayerStatus = false;
    	localStorage.setItem("searchedPlayerName", "");
    	localStorage.setItem("searchedPlayerInviteStat", "");
		localStorage.setItem("searchedPlayerJoinStat", "");  
	   	localStorage.setItem("searchedPlayerPhoto", "");
		localStorage.setItem("searchedPlayerEmail", "");
		localStorage.setItem("formInvitedMembers", "");
		localStorage.setItem("formTeam", "");
		$state.go('app.searchCoach');
	};
	$scope.searchPlayer = function() {
		$scope.searchedPlayerStatus = false;
    	localStorage.setItem("searchedPlayerName", "");
    	localStorage.setItem("searchedPlayerInviteStat", "");
		localStorage.setItem("searchedPlayerJoinStat", "");  
	   	localStorage.setItem("searchedPlayerPhoto", "");
		localStorage.setItem("searchedPlayerEmail", "");
		localStorage.setItem("formInvitedMembers", "");
		localStorage.setItem("formTeam", "");
		$state.go('app.searchPlayer');
	};
	$scope.searchCompetition = function() {
		$state.go('app.home');
	};
	// $scope.chooseLineup = function() { 
	// 	$state.go('app.lineup_detail');
	// };
	$scope.chooseLineup = function(id) { 
		$state.go('app.lineup_detail', {
			'matchId': id
		});
	};

	$scope.viewLineup = function(id) { 
		$state.go('app.lineup_detail', {
			'matchId': id
		});
	};
})

.controller('TeamDetailCtrl', function(NgMap, $scope, $state, $stateParams, $ionicPopup, $ionicPlatform, $ionicLoading, TeamService, LoginService, ionicMaterialInk, ionicMaterialMotion, $cordovaSocialSharing) {
	$ionicLoading.show({
		content: 'Login...',
		animation: 'fade-in',
		showBackdrop: true,
	});

	$scope.team = {};
	$scope.invited_member = [];
	$scope.userRequest = [];
	$scope.haveMember = false;
	$scope.userRequestExist = false;
	console.log($stateParams.teamId);
	localStorage.setItem("teamId", $stateParams.teamId);
	TeamService.getTeamById($stateParams.teamId,localStorage.getItem("token")).success(function(data) {
		console.log(data);
		$ionicLoading.hide();
		$scope.team = data;

		if($scope.team.invited_member.length !== 0){
			$scope.haveMember = true;
		}

		if($scope.team.user_request !== ''){
			$scope.userRequestExist = true;
			console.log("asdafa s asdasdada");
		}
		
		$scope.invited_member = $scope.team.invited_member.split(',');
		$scope.userRequest = $scope.team.user_request.split(',');
		console.log($scope.invited_member);
		console.log($scope.userRequest);
		console.log($scope.haveMember);
		console.log($scope.team);

		$scope.userRequestArr = [];
		for(var i in $scope.userRequest){
			LoginService.getUserByUsername($scope.userRequest[i]).success(function(data){
				console.log(data);
				$ionicLoading.hide();
				$scope.userRequestArr.push(data);
				console.log($scope.userRequestArr);
			}).error(function(data) {
				$ionicLoading.hide();
			});
		}

		$scope.addUserToTeamSquad = function(userName) {
			$scope.squadData = {};
			$scope.squadData.Team = $scope.team.team_name;
			$scope.squadData.Username = userName;

			TeamService.addTeamByName($scope.squadData).success(function(data){
				$ionicLoading.hide();
				console.log("sukses wuhuhuhu");
				// $state.go('app.team');
			}).error(function(data){
				$ionicLoading.hide();
			});

			$scope.userSquad = {};
			$scope.userSquad.Username = userName;
			$scope.userSquad.TeamId = $scope.team.id;
			TeamService.addMemberToTeam($scope.userSquad).success(function(data){
				$ionicLoading.hide();
				console.log("sukses wahahah");
				// $state.go('app.team');
			}).error(function(data){
				$ionicLoading.hide();
			});


			$scope.delRequest = {};
			$scope.delRequest.TeamName = $scope.team.team_name;
			$scope.delRequest.userRequest = userName;
			TeamService.delUserRequest($scope.delRequest).success(function(data){
				$ionicLoading.hide();
				console.log("sukses alelele");
				// $state.go('app.team');
			}).error(function(data){
				$ionicLoading.hide();
			});

			$scope.delRequestedTeam = {};
			$scope.delRequestedTeam.Username = userName;
			$scope.delRequestedTeam.teamRequested = $scope.team.team_name;
			TeamService.delRequestedTeam($scope.delRequestedTeam).success(function(data){
				$ionicLoading.hide();
				console.log("sukses ulelele");
				// $state.go('app.team');
			}).error(function(data){
				$ionicLoading.hide();
			});
		};

		$scope.delTeamFromRequestedTeam = function(userName) {
			$scope.delRequest = {};
			$scope.delRequest.TeamName = $scope.team.team_name;
			$scope.delRequest.userRequest = userName;
			TeamService.delUserRequest($scope.delRequest).success(function(data){
				$ionicLoading.hide();
				console.log("sukses alelele");
				// $state.go('app.team');
			}).error(function(data){
				$ionicLoading.hide();
			});

			$scope.delRequestedTeam = {};
			$scope.delRequestedTeam.Username = userName;
			$scope.delRequestedTeam.teamRequested = $scope.team.team_name;
			TeamService.delRequestedTeam($scope.delRequestedTeam).success(function(data){
				$ionicLoading.hide();
				console.log("sukses ulelele");
				// $state.go('app.team');
			}).error(function(data){
				$ionicLoading.hide();
			});
		};


	}).error(function(data) {});

	$scope.backToMyTeam = function() {
		$state.go('app.my_team');
	};
	$scope.goToSearch = function() {
		$state.go('app.search');
	};
})

.controller('TeamCtrl', function(NgMap, $scope, $state, $stateParams, $ionicPopup, $ionicPlatform, $ionicLoading, LoginService, ProfileService, TeamService, ionicMaterialInk, ionicMaterialMotion, $cordovaSocialSharing) {
	$ionicLoading.show({
		content: 'Login...',
		animation: 'fade-in',
		showBackdrop: true,
	});
	console.log($scope.matchData);

	$scope.teamsData = {};
	$scope.profile = {};
	$scope.teamInfo = {};
	$scope.editedProfile = {};

	TeamService.getTeamByName(localStorage.getItem("team")).success(function(data) {
		$scope.teamInfo = data;
		$ionicLoading.hide();

		$scope.editTeam = function() {
			$ionicLoading.hide();
            // $scope.teamInfo = data;
            $scope.editedProfile.team = $scope.teamInfo.team_name;

            // Image upload processing
            var fileInput = document.getElementById('file-upload');
            var file = fileInput.files[0];
            if (file === undefined) {
            	if($scope.teamInfo.team_logo !== ''){
	                // Add data to database
	                TeamService.editTeamById(localStorage.getItem("myTeamId"), $scope.teamInfo).success(function(data) {
	                    $scope.teamInfo = data;
	                    $state.go('app.my_team');
	                    $ionicLoading.hide();

	                    ProfileService.editProfileById(localStorage.getItem("userid"), localStorage.getItem("token"), $scope.editedProfile).success(function(data) {
							console.log("berhasil");
						}).error(function(data) {});


	                }).error(function(data) {
	                    $ionicLoading.hide();
	                });
            	}else{
            		console.log($scope.teamInfo);
	                $scope.teamInfo.team_logo = '';
	                // Add data to database
	                TeamService.editTeamById(localStorage.getItem("myTeamId"), $scope.teamInfo).success(function(data) {
	                    $scope.teamInfo = data;
	                    $state.go('app.my_team');
	                    $ionicLoading.hide();

	                    ProfileService.editProfileById(localStorage.getItem("userid"), localStorage.getItem("token"), $scope.editedProfile).success(function(data) {
							console.log("berhasil");
						}).error(function(data) {});


	                }).error(function(data) {
	                    $ionicLoading.hide();
	                });
            	}
            } else {
                ProfileService.uploadImage(file, '/' + file.name).success(function(data) {
                    var params = {
                        "path": '/' + file.name
                    };
                    LoginService.uploadImage(file, '/' + file.name).success(function(data) {
                        var params = {
                            "path": '/' + file.name
                        };
                        LoginService.getImageLink(params).success(function(data2) {
                            var temp = data2.url;
                            var url = temp.replace("?dl=0", "?dl=1");
                            $scope.teamInfo.team_logo = url;
                            TeamService.editTeamById(localStorage.getItem("myTeamId"), $scope.teamInfo).success(function(data) {
                                $scope.teamInfo = data;
                                $state.go('app.my_team');
                                $ionicLoading.hide();

                                ProfileService.editProfileById(localStorage.getItem("userid"), localStorage.getItem("token"), $scope.editedProfile).success(function(data) {
									console.log("berhasil");
								}).error(function(data) {});

                			}).error(function(data) {})
                        .error(function(data) {});
                        }).error(function(data2) {});
                    }).error(function(data) {});
                }).error(function(data) {});
            }
        };


	}).error(function(data) {});

	$scope.uploadImage = function() {
		document.getElementById('file-upload').click();
	};
	$scope.showPreviewImage = function(x) {
		var fReader = new FileReader();
		fReader.readAsDataURL(x);
		fReader.onload = function(event) {
			var img = document.getElementById("file-upload");
			$scope.image = event.target.result;
			$scope.$apply();
		};
	};

	$scope.addTeam = function() {
		$scope.teamsData.team_manager = localStorage.getItem("username");
		$scope.teamsData.team_squad = [];
		$scope.teamsData.competitionId = '';
		$scope.teamsData.team_play = 0;
		$scope.teamsData.team_win = 0;
		$scope.teamsData.team_draw = 0;
		$scope.teamsData.team_lose = 0;
		$scope.teamsData.team_point = 0;
		$scope.profile.team = $scope.teamsData.team_name;
		localStorage.setItem("team", $scope.teamsData.team_name);

		ProfileService.editProfileById(localStorage.getItem("userid"), localStorage.getItem("token"), $scope.profile).success(function(data) {
			console.log("berhasil");
		}).error(function(data) {
		});

		// Image upload processing
        var fileInput = document.getElementById('file-upload');
        var file = fileInput.files[0];
        if (file === undefined) {
            $scope.teamsData.team_logo = '';
            // Add data to database
			TeamService.addTeam($scope.teamsData).success(function(data) {
				$ionicLoading.hide();
				var alertPopup = $ionicPopup.alert({
					title: 'Success!',
					template: 'Berhasil Membuat Tim'
				});
				$state.go('app.my_team');
			}).error(function(data) {
				$ionicLoading.hide();
				var alertPopup = $ionicPopup.alert({
					title: 'Post Data Failed!',
					template: 'Gagal Membuat Tim'
				});
			});
		} else {
	        ProfileService.uploadImage(file, '/' + file.name).success(function(data) {
	            var params = {
	                "path": '/' + file.name
	            };
	            LoginService.uploadImage(file, '/' + file.name).success(function(data) {
	                var params = {
	                    "path": '/' + file.name
	                };
	                LoginService.getImageLink(params).success(function(data2) {
	                    var temp = data2.url;
	                    var url = temp.replace("?dl=0", "?dl=1");
	                    $scope.teamsData.team_logo = url;
	                    // Add data to database
						TeamService.addTeam($scope.teamsData).success(function(data) {
							$ionicLoading.hide();
							var alertPopup = $ionicPopup.alert({
								title: 'Success!',
								template: 'Berhasil Membuat Tim'
							});
							$state.go('app.my_team');
						}).error(function(data) {
							$ionicLoading.hide();
							var alertPopup = $ionicPopup.alert({
								title: 'Post Data Failed!',
								template: 'Gagal Membuat Tim'
							});
						});
					}).error(function(data2) {});
                }).error(function(data) {});
            }).error(function(data) {});		
	    }
	};    
	$ionicLoading.hide();

	$scope.backToMyTeam = function() {
		$state.go('app.my_team');
	};
})

.controller('MemberProfileCtrl', function(NgMap, $scope, $state, $stateParams, $ionicPopup, $ionicPlatform, $ionicLoading, MatchService, PostService, CompetitionService, ionicMaterialInk, ionicMaterialMotion, $cordovaSocialSharing) {
	$ionicLoading.show({
		content: 'Login...',
		animation: 'fade-in',
		showBackdrop: true,
	});

	$scope.competition = {};
	console.log($stateParams.competitionId);
	CompetitionService.getCompetitionById($stateParams.competitionId,localStorage.getItem("token")).success(function(data) {
		console.log(data);
		$ionicLoading.hide();
		$scope.competition = data;
	}).error(function(data) {});

	$scope.more = function(id) {
		$state.go('app.competition_detail', {
			'competitionId': id
		});
	};
})

.controller('SearchCtrl', function($scope, $rootScope, $state, $ionicPopup, $ionicPlatform, $ionicLoading, TeamService, $stateParams) {
        $scope.doRefresh = function() {
            $scope.$broadcast('scroll.refreshComplete');
            setTimeout(function() {
                $state.go($state.current, {}, {
                    reload: true
                });
            }, 500);
        };
        $scope.search = {};
        $scope.team = {};
    	$scope.formMember = {};
    	$scope.formInvitedMembers = {};
    	$scope.formInvitedMembers.invited_members = {};
		$scope.formTeam = {};
		$scope.dataMember = {};
		$scope.dataTeam = {};
		$scope.searchedPlayerStatus = false;
		$scope.inviteStatus = false;
        $scope.joinStatus = false;

		console.log(localStorage.getItem("searchedPlayerName"));
		console.log($scope.searchedPlayerStatus);
        if(localStorage.getItem("searchedPlayerName") !== ''){
        	console.log("true");
        	$scope.searchedPlayerStatus = true;
        	$scope.playerObj = {};
        	$scope.playerObj.photo = localStorage.getItem("searchedPlayerPhoto");
        	$scope.playerObj.username = localStorage.getItem("searchedPlayerName");
        	$scope.playerObj.email = localStorage.getItem("searchedPlayerEmail");
        	$scope.playerObj.inviteStatus = localStorage.getItem("searchedPlayerInviteStat");
        	$scope.playerObj.joinStatus = localStorage.getItem("searchedPlayerJoinStat");

        	var formInvitedMembersObj = localStorage.getItem('formInvitedMembers');
			var formInvitedMembersObjData = JSON.parse(formInvitedMembersObj);
			console.log(formInvitedMembersObjData);
			var formTeamObj = localStorage.getItem('formTeam');
			var formTeamObjData = JSON.parse(formTeamObj);
			console.log(formTeamObjData);
        }
        console.log($scope.playerObj);

        $scope.searchData = function() {
        	$scope.searchedPlayerStatus = false;
        	localStorage.setItem("searchedPlayerName", "");
        	localStorage.setItem("searchedPlayerInviteStat", "");
			localStorage.setItem("searchedPlayerJoinStat", "");  
		   	localStorage.setItem("searchedPlayerPhoto", "");
			localStorage.setItem("searchedPlayerEmail", "");
			localStorage.setItem("formInvitedMembers", "");
			localStorage.setItem("formTeam", "");

            $ionicLoading.show({
                content: 'Login...',
                animation: 'fade-in',
                showBackdrop: true,
            });
            TeamService.searchData($scope.search.nama).success(function(data) {
                $scope.search = data;
                $scope.teamArr = [];
                $scope.playerArr = [];
                $scope.coachArr = [];
               

                console.log($scope.search);

                for (var player in $scope.search.player) {
                    $scope.playerArr.push($scope.search.player[player]);
                   	$scope.formMember.Username = $scope.search.player[player].username;
                   	$scope.formTeam.UserId = $scope.search.player[player].id;

                   	TeamService.getTeamById(localStorage.getItem("myTeamId"),localStorage.getItem("token")).success(function(data) {	
						console.log(data);
						$ionicLoading.hide();
						$scope.team = data;
						$scope.teamId = data.id;
						$scope.invitedMember = $scope.team.invited_members.name.split(",");
						$scope.joinedMember = $scope.team.team_squad.split(",");

						var inviteNumber = data.invited_members.invite_number.toString();

						if(inviteNumber !== ''){
							if(inviteNumber.indexOf(',') === -1){
								// console.log("tidak ad koma");
								var lastInviteNumber = parseInt(inviteNumber);
							}else{
								// console.log("baru ad satu data");
								var inviteNumberArr = inviteNumber.split(",");
								var lastInviteNumber = parseInt(inviteNumber[0]);
							}
						}


						if(data.invited_members.name === ''){
							$scope.formInvitedMembers.invited_members.name = $scope.search.player[player].username;
							$scope.formInvitedMembers.invited_members.role = "Player";
							$scope.formInvitedMembers.invited_members.invite_number = 1;
						}else{
							$scope.formInvitedMembers.invited_members.name = $scope.search.player[player].username + "," + data.invited_members.name;
							$scope.formInvitedMembers.invited_members.role = "Player" + "," + data.invited_members.role;
							$scope.formInvitedMembers.invited_members.invite_number = (lastInviteNumber + 1) + "," + data.invited_members.invite_number;
						}


						for(var i = 0; i < $scope.invitedMember.length; i++){
							if($scope.search.player[player].username == $scope.invitedMember[i]){
								$scope.inviteStatus = true;
								console.log("invited");
							}
						}
						for(var j = 0; j < $scope.joinedMember.length; j++){
							if($scope.search.player[player].username == $scope.joinedMember[j]){
								$scope.joinStatus = true;
								console.log("joined");
							}
						}
						$scope.formMember.TeamId = $scope.team.id;
                   		$scope.formTeam.TeamName = $scope.team.team_name;

                   		console.log($scope.formMember);
                   		console.log($scope.formTeam);

					}).error(function(data) {
						$ionicLoading.hide();
					});
                }

                for (var coach in $scope.search.coach) {
                    $scope.coachArr.push($scope.search.coach[coach]);
                   	$scope.formMember.Username = $scope.search.coach[coach].username;
                   	$scope.formTeam.UserId = $scope.search.coach[coach].id;

                   	TeamService.getTeamById(localStorage.getItem("myTeamId"),localStorage.getItem("token")).success(function(data) {
						console.log(data.invited_members.name);
						$ionicLoading.hide();
						$scope.team = data;
						$scope.teamId = data.id;
						$scope.joinedMember = $scope.team.team_coach;

						if(data.invited_members.name !== undefined){
							$scope.invitedMember = $scope.team.invited_members.name.split(",");
							var inviteNumber = data.invited_members.invite_number.toString();

							if(inviteNumber !== ''){
								if(inviteNumber.indexOf(',') === -1){
									// console.log("tidak ad koma");
									var lastInviteNumber = parseInt(inviteNumber);
								}else{
									// console.log("baru ad satu data");
									var inviteNumberArr = inviteNumber.split(",");
									var lastInviteNumber = parseInt(inviteNumber[0]);
								}
							}

							for(var i = 0; i < $scope.invitedMember.length; i++){
								if($scope.search.coach[coach].username == $scope.invitedMember[i]){
									$scope.inviteStatus = true;
									console.log("invited");
								}
							}
						}

						
						console.log($scope.joinedMember);
						console.log($scope.invitedMember);


						if(data.invited_members.name === '' || data.invited_members.name === undefined){
							$scope.formInvitedMembers.invited_members.name = $scope.search.coach[coach].username;
							$scope.formInvitedMembers.invited_members.role = "Coach";
							$scope.formInvitedMembers.invited_members.invite_number = 1;
						}else{
							$scope.formInvitedMembers.invited_members.name = $scope.search.coach[coach].username + "," + data.invited_members.name;
							$scope.formInvitedMembers.invited_members.role = "Coach" + "," + data.invited_members.role;
							$scope.formInvitedMembers.invited_members.invite_number = (lastInviteNumber + 1) + "," + data.invited_members.invite_number;
						}


						
						if($scope.joinedMember !== null){
							for(var j = 0; j < $scope.joinedMember.length; j++){
								if($scope.search.coach[coach].username == $scope.joinedMember[j]){
									$scope.joinStatus = true;
									console.log("joined");
								}
							}
						}
						$scope.formMember.TeamId = $scope.team.id;
                   		$scope.formTeam.TeamName = $scope.team.team_name;

					}).error(function(data) {
						$ionicLoading.hide();
					});
                }

              	for (var item in $scope.search.team) {
	                $scope.teamArr.push($scope.search.team[item]);
	                $scope.dataMember.TeamId = $scope.search.team[item].id;
	                $scope.dataTeam.TeamName = $scope.search.team[item].team_name;
                }
                $scope.dataMember.Username = $scope.menuProfile.username;
	            $scope.dataTeam.UserId = $scope.menuProfile.id;

	          

            	$scope.inviteMember = function(){
					console.log($scope.formMember);
                   	console.log($scope.formTeam);
                   	console.log($scope.formInvitedMembers);

					var confirmPopup = $ionicPopup.confirm({
						title: 'Invite Members',
						template: 'Are you sure?'
					});
					confirmPopup.then(function(res) {
				        if(res) {
				            console.log('Sure!');
				            TeamService.addInvitedMember($scope.formMember).success(function(data){
				            	console.log(data);
								// $ionicLoading.hide();
								console.log("sukses yataa");
								// $state.go('app.team');
							}).error(function(data){
								// $ionicLoading.hide();
							});

							TeamService.editTeamById($scope.teamId, $scope.formInvitedMembers).success(function(data) {
			            		console.log(data);
			                }).error(function(data) {});

							TeamService.addTeamInvitation($scope.formTeam).success(function(data){
								// $ionicLoading.hide();
								console.log("berhasil wahuuu");
								// $state.go('app.team');
							}).error(function(data){
								// $ionicLoading.hide();
							});
							$state.go('app.my_team');
							localStorage.setItem("showme", 2);    
				         } else {
				            console.log('Not sure!');
				         }
				    });               
				};

				$scope.JoinTeam = function(){
					console.log($scope.dataMember);
                   	console.log($scope.dataTeam);
                   	$scope.teamData = {};
                   	TeamService.getTeamById($scope.dataMember.TeamId,localStorage.getItem("token")).success(function(data) {
						$scope.teamData = data;
						console.log($scope.teamData.availableJerseyNumber);
						$ionicLoading.hide();
					}).error(function(data) {
						$ionicLoading.hide();
					});

                   	var confirmPopup = $ionicPopup.confirm({
						title: 'Join Team',
						template: 'Are you sure?'
					});
					confirmPopup.then(function(res) {
				        if(res) {
				            console.log('Sure!');
				            $rootScope.showLoading();
				            TeamService.addRequestedTeam($scope.dataTeam).success(function(data){
								// $ionicLoading.hide();
								console.log("sukses yataa");
								// $state.go('app.team');
							}).error(function(data){
								// $ionicLoading.hide();
							});

							TeamService.addPlayerRequest($scope.dataMember).success(function(data){
								// $ionicLoading.hide();
								console.log("berhasil wahuuu");
								// $state.go('app.team');
							}).error(function(data){
								// $ionicLoading.hide();
							});  

							setTimeout(function(){
								$ionicLoading.hide();
								var alertPopup = $ionicPopup.alert({
				                    title: 'Join Team',
				                    template: 'Your request has been send, please wait while the manager review it'
				                });   
				                $state.go('app.my_team'); 
							},2000);
							            
				        } else {
				            console.log('Not sure!');
				        }
				    }); 
				};

				$scope.ManageTeam = function(){
					console.log($scope.dataMember);
                   	console.log($scope.dataTeam);
                   	TeamService.addRequestedTeam($scope.dataTeam).success(function(data){
						$ionicLoading.hide();
						console.log("sukses yataa");
						console.log(data);
						// $state.go('app.team');
					}).error(function(data){
						$ionicLoading.hide();
					});

					TeamService.addCoachRequest($scope.dataMember).success(function(data){
						$ionicLoading.hide();
						console.log("berhasil wahuuu");
						console.log(data);
						// $state.go('app.team');
					}).error(function(data){
						$ionicLoading.hide();
					});                 
					var alertPopup = $ionicPopup.alert({
	                    title: 'Request Team To Manage',
	                    template: 'Your request has been send, please wait while the manager review it'
	                });   
	                $state.go('app.my_team');
				};

                $ionicLoading.hide();
            }).error(function(data) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Search failed!',
                    template: 'Failed to search data'
                });
            });
        };

  //       $scope.topPlayerData = [];
  //       $scope.highestPoint = 0;
  //       $scope.index = 0;
  //       $scope.playerData = [];

  //       TeamService.getPlayer().success(function(data){
		// 	$scope.playerData = data;

		// 	while($scope.playerData.length != 0){
		// 	    for(var i = 0; i < $scope.playerData.length; i++){
		// 	    	if($scope.playerData[i].goal == null || $scope.playerData[i].assist == null){
		// 	    		console.log("null");
		// 	    	}else{
		// 		        if(parseInt($scope.playerData[i].goal) + parseInt($scope.playerData[i].assist) > $scope.highestPoint){
		// 		            $scope.highestPoint = parseInt($scope.playerData[i].goal) + parseInt($scope.playerData[i].assist);
		// 		            $scope.index = i;
		// 		        }
		// 		    }    
		// 	    }
		// 	    $scope.topPlayerData.push($scope.playerData[$scope.index]);
		// 	    $scope.playerData.splice($scope.index,1);
		// 	    console.log($scope.playerData.length);
		// 	    $scope.highestPoint = 0;
		// 	}
		// 	$scope.topPlayerData.length = Math.min($scope.topPlayerData.length, 5)
		// 	console.log($scope.topPlayerData);

		// }).error(function(data){});

		$scope.userDetail = function(photo,username,email) {
        	console.log(username);
        	console.log($scope.inviteStatus);
        	console.log($scope.joinStatus);
        	console.log($scope.formInvitedMembers);
        	console.log($scope.formTeam);
        	if(localStorage.getItem("searchedPlayerInviteStat") !== ''){
        		console.log("tidak null");
        		localStorage.setItem("searchedPlayerInviteStat", localStorage.getItem("searchedPlayerInviteStat"));
        		localStorage.setItem("searchedPlayerJoinStat", localStorage.getItem("searchedPlayerJoinStat"));
        	}else{
        		localStorage.setItem("searchedPlayerInviteStat", $scope.inviteStatus);
				localStorage.setItem("searchedPlayerJoinStat", $scope.joinStatus);
				localStorage.setItem('formInvitedMembers', JSON.stringify($scope.formInvitedMembers));
				localStorage.setItem('formTeam', JSON.stringify($scope.formTeam));
        	}
        	localStorage.setItem("searchedPlayerPhoto", photo);
        	localStorage.setItem("searchedPlayerName", username);
			localStorage.setItem("searchedPlayerEmail", email);
			
			
	    	// Go to user detail page
	        $state.go('app.userDetail', {
	            'username': username
	        });
	    };

	    $scope.inviteMembers = function(){
			console.log(formInvitedMembersObjData);
           	console.log(formTeamObjData);

			var confirmPopup = $ionicPopup.confirm({
				title: 'Invite Members',
				template: 'Are you sure?'
			});
			confirmPopup.then(function(res) {
		        if(res) {
		            console.log('Sure!');
		
					TeamService.editTeamById(localStorage.getItem("myTeamId"), formInvitedMembersObjData).success(function(data) {
	            		console.log(data);
	                }).error(function(data) {});

					TeamService.addTeamInvitation(formTeamObjData).success(function(data){
						// $ionicLoading.hide();
						console.log("berhasil wahuuu");
						// $state.go('app.team');
					}).error(function(data){
						// $ionicLoading.hide();
					});
					$state.go('app.my_team');
					localStorage.setItem("showme", 2);    
		         } else {
		            console.log('Not sure!');
		         }
		    });               
		};

        $scope.backToMyTeam = function(){
        	$scope.searchedPlayerStatus = false;
        	localStorage.setItem("searchedPlayerName", "");
        	localStorage.setItem("searchedPlayerInviteStat", "");
			localStorage.setItem("searchedPlayerJoinStat", "");  
		   	localStorage.setItem("searchedPlayerPhoto", "");
			localStorage.setItem("searchedPlayerEmail", "");
			localStorage.setItem("formInvitedMembers", "");
			localStorage.setItem("formTeam", "");
			localStorage.setItem("showme", 1);
        	$state.go('app.my_team');
        }
})

.controller('ChatCtrl', function($scope, $state, $ionicPlatform, $ionicLoading, LoginService, TeamService, MessageService) {
    localStorage.setItem("readStatus", "false");
    // flag var for tab chat and contact
    $scope.isActive = false;

    // Get list of chats
    MessageService.getMessageBySender($scope.menuProfile.username).success(function(data) {
    	console.log(data);
        $scope.recentMessage = data;
        $scope.newMessageCounterArr = [];

        for(var i = $scope.recentMessage.length - 1; i >= 0; i--) {
            if($scope.recentMessage[i].receiver == $scope.menuProfile.username) {
                $scope.recentMessage[i].receiver = $scope.recentMessage[i].sender;
            }
  
            MessageService.getNewMessageCounter($scope.menuProfile.username, $scope.recentMessage[i].sender).success(function(data) {
		       $scope.newMessageCounterArr.push(data);
		    }).error(function(data) {});

        }
        console.log($scope.newMessageCounterArr);
    }).error(function(data) {});	
    
    var chatCounter = 0;
	$scope.getChatList = function(){
	    MessageService.getUnreadMessage("false", $scope.menuProfile.username).success(function(data) {
	       $scope.unreadMessage = data;
	       console.log($scope.unreadMessage.length);
	       if(chatCounter !== $scope.unreadMessage.length){
	       		chatCounter = $scope.unreadMessage.length;
	       		// Get list of chats
			    MessageService.getMessageBySender($scope.menuProfile.username).success(function(data) {
			    	console.log(data);
			        $scope.recentMessage = data;
			        $scope.newMessageCounterArr = [];

			        for(var i = $scope.recentMessage.length - 1; i >= 0; i--) {
			            if($scope.recentMessage[i].receiver == $scope.menuProfile.username) {
			                $scope.recentMessage[i].receiver = $scope.recentMessage[i].sender;
			            }

			            MessageService.getNewMessageCounter($scope.menuProfile.username, $scope.recentMessage[i].sender).success(function(data) {
					       $scope.newMessageCounterArr.push(data);
					    }).error(function(data) {});

			        }
			        console.log($scope.newMessageCounterArr);
			    }).error(function(data) {});	
	       }
	    }).error(function(data) {});
    }

    // getChatList timer
    $scope.getChatListTimer = setInterval($scope.getChatList, 1000);

    // Get list of contacts
    $scope.teamManager = {};
    $scope.teamCoach = {};
    $scope.teamSquadArr = [];

    if($scope.menuProfile.team !== ''){
		TeamService.getTeamSquad($scope.menuProfile.team).success(function(data){
			data.forEach(function(item){
				console.log(item.username);
				if(item.role === 'Manager'){
					console.log(item);
					$scope.teamManager = item;
				}
				if(item.role === 'Coach'){
					console.log(item);
					$scope.teamCoach = item;
				}
				if(item.role === 'Player'){
					if(item.username !== localStorage.getItem("username")){
						$scope.teamSquadArr.push(item);
					}
				}
				
			})
		}).error(function(data) {});
	} else{
		$scope.teamSquadArr = [];
	}	


    // go to chat detail
    $scope.goToChatDetail = function(username) {
    	clearInterval($scope.getChatListTimer);
		$state.go('app.chat_detail', {
			'username': username
		});
	};

	// read message 
	$scope.readMessage = function(username, sender, receiver) {
        // Add reader for status has been read
        clearInterval($scope.getChatListTimer);
        $scope.message = {};
        $scope.message.read = receiver;
        MessageService.readMessage(username, sender, $scope.message).success(function(data) {
        	console.log("read");
        }).error(function(data) {});
        // Go to message detail page
        if(sender === $scope.menuProfile.username){
        	console.log(receiver);
        	$state.go('app.chat_detail', {
	            'username': receiver
	        });
        }else if(sender !== $scope.menuProfile.username){
        	console.log(receiver);
        	$state.go('app.chat_detail', {
	            'username': sender
	        });
        }
    };

    // back to home
    $scope.back = function() { 
    	// remove getChatList timer
		clearInterval($scope.getChatListTimer);
		// go to home
		$state.go('app.home');
	};

	// create team
	$scope.createTeam = function(){
		// go to create team page
		$state.go('app.create_team');
	}

	// search coach
	$scope.searchCoach = function(){
		$scope.searchedPlayerStatus = false;
    	localStorage.setItem("searchedPlayerName", "");
    	localStorage.setItem("searchedPlayerInviteStat", "");
		localStorage.setItem("searchedPlayerJoinStat", "");  
	   	localStorage.setItem("searchedPlayerPhoto", "");
		localStorage.setItem("searchedPlayerEmail", "");
		localStorage.setItem("formInvitedMembers", "");
		localStorage.setItem("formTeam", "");
		$state.go('app.searchCoach');
	}

	// search player
	$scope.searchPlayer = function(){
		$scope.searchedPlayerStatus = false;
    	localStorage.setItem("searchedPlayerName", "");
    	localStorage.setItem("searchedPlayerInviteStat", "");
		localStorage.setItem("searchedPlayerJoinStat", "");  
	   	localStorage.setItem("searchedPlayerPhoto", "");
		localStorage.setItem("searchedPlayerEmail", "");
		localStorage.setItem("formInvitedMembers", "");
		localStorage.setItem("formTeam", "");
		$state.go('app.searchPlayer');
	}
})

.controller('ChatDetailCtrl', function($scope, $state, $stateParams, $ionicPopup, $ionicPlatform, $ionicLoading, MessageService, LoginService, CompetitionService, ionicMaterialInk, ionicMaterialMotion, $cordovaSocialSharing, $timeout) {
	
	// Variables
	var stringlength = 15;
	var stringArray = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
	var rndString = "";
	$scope.loadingCompleted = false;
	$scope.Message = {};
	$scope.chatData = {};
    $scope.otherProfile = {};
    $scope.profile = {};
    $scope.dataMessage = {};
    $scope.glued = true;
    $scope.messageData = [];
    $scope.newMessage = [];
	// build a string with random characters
	for(var i = 1; i < stringlength; i++){
		var rndNum = Math.ceil(Math.random() * stringArray.length) - 1;
		rndString = rndString + stringArray[rndNum];
	} 

	console.log($stateParams.username);


    LoginService.getUserById(localStorage.getItem("userid"), localStorage.getItem("token")).success(function(data) {
        $scope.profile = data;
        LoginService.getUserByUsername($stateParams.username).success(function(data) {
            $scope.otherProfile = data;
            console.log($scope.otherProfile);
            console.log($scope.profile.username);
            console.log($stateParams.username);

            $scope.addMessage = function() {
                $scope.newMessage.push($scope.dataMessage);
                $scope.dataMessage.id = rndString;
                $scope.dataMessage.sender = $scope.profile.username;
                $scope.dataMessage.receiver = $scope.otherProfile.username;
                $scope.dataMessage.sender_name = $scope.profile.username;
                $scope.dataMessage.receiver_name = $scope.otherProfile.username;
           		$scope.dataMessage.sender_photo = $scope.profile.photo;
                $scope.dataMessage.receiver_photo = $scope.otherProfile.photo;
                $scope.dataMessage.date = moment().format();
                $scope.dataMessage.read = "false";
                console.log($scope.dataMessage);
                MessageService.addMessage($scope.dataMessage).success(function(data) {
                    // Reset input text message to null
                    for(var i = 1; i < stringlength; i++){
						var rndNum = Math.ceil(Math.random() * stringArray.length) - 1;
						rndString = rndString + stringArray[rndNum];
					}
                    console.log("berhassississisisis");
                    console.log(data);
                    $scope.dataMessage.content = '';
                    $ionicLoading.hide();
                }).error(function(data) {});
            };
            localStorage.setItem("readStatus", "true");
            $scope.readMessage = function() {
		        // Add reader for status has been read
		        if(localStorage.getItem("readStatus") === "true"){
			        $scope.message = {};
			        $scope.message.read = $scope.profile.username;
			        MessageService.readMessage($scope.profile.username, $scope.otherProfile.username, $scope.message).success(function(data) {
			        	console.log("read");
			        }).error(function(data) {});
			    }    
		    };
            $scope.getMessage = function() { 
            	$scope.messageData = [];
            	MessageService.getMessageBySenderAndReceiver($scope.profile.username, $scope.otherProfile.username).success(function(data) {
	                $scope.Message = data;

	                console.log($scope.Message);
	                $ionicLoading.hide();
	                for(m = 0; m < $scope.Message.length; m++){
			        	$scope.messageData[m] = {};
			        }
	                data.sort(function(a, b) {
	                    var dateA = new Date(a.date),
	                        dateB = new Date(b.date);
	                    return dateA - dateB;//sort by date ascending
	                });
	                $scope.newMessage = data;
	               
                $scope.chatDate = [];
                $scope.todayDate = [];
                $scope.yesterdayDate = [];
                $scope.chatDateExist = [];
                $scope.chatData = $scope.Message;
                $scope.todayDateExist = false;
                $scope.yesterdayDateExist = false;
                $scope.chatDateData = "";
                $scope.chatTimeData = "";
                $scope.dateofChat = [];

                $scope.chatData.forEach(function(entry){
                	var currentDate = moment().format('DD/MM/YYYY');
                	var yesterdayDate = moment().add(-1, 'days').format('DD/MM/YYYY');
					if(moment(entry.date).format('DD/MM/YYYY') == currentDate){
						if($scope.todayDateExist == false){
							console.log("today");
							$scope.todayDate[entry.id] = true;
							$scope.todayDateExist = true;
						}
					}else if(moment(entry.date).format('DD/MM/YYYY') == yesterdayDate){
						if($scope.yesterdayDateExist == false){
							$scope.yesterdayDate[entry.id] = true;
							$scope.yesterdayDateExist = true;
						}	
					}else {
						if($scope.chatDateData == ""){
							$scope.chatDateData = moment(entry.date).format('DD/MM/YYYY');
							$scope.chatTimeData = moment(entry.date).format('LTS');
							$scope.chatDate[entry.id] = true;
							$scope.dateofChat[entry.id] = moment(entry.date).format("ddd, MMM Do");
						}
						if(moment(entry.date).format('DD/MM/YYYY') != $scope.chatDateData){
							$scope.chatDateData = moment(entry.date).format('DD/MM/YYYY');
							$scope.chatDate[entry.id] = true;
							$scope.dateofChat[entry.id] = moment(entry.date).format("ddd, MMM Do");
						}
					}
				});

            	}).error(function(data) {});
            };
            window.onload = $scope.getMessage;
            $scope.myVar = setInterval($scope.getMessage, 1000);
            window.onload = $scope.readMessage;
            $scope.readMessageVar = setInterval($scope.readMessage, 1000);
        }).error(function(data) {});
    }).error(function(data) {});

	// Functions 
    $scope.back = function() { // kembali ke halaman home
		clearInterval($scope.myVar);
		clearInterval($scope.readMessageVar);
		localStorage.setItem("readStatus", "false");
		$state.go('app.chat');
	};
})

.controller('ScheduleCtrl', function($scope, $stateParams, $ionicPopup, $ionicTabsDelegate, $ionicLoading, $ionicPopover, $state, TeamService,FixtureService, MatchService, CompetitionService) {
	$scope.team = {};
	$scope.myCompetition = [];
	$scope.myCompetitionData = [];
	console.log(localStorage.getItem("role"));
	if(localStorage.getItem("role") !== 'Organizer'){
		TeamService.getTeamByName(localStorage.getItem("team")).success(function(data){
			console.log(data);
			$scope.team = data;
			
			if($scope.team.competitionId !== ''){
				$scope.myCompetition = $scope.team.competitionId.split(',');
				console.log($scope.myCompetition);

				for(var c = 0; c < $scope.myCompetition.length; c++){
					CompetitionService.getCompetitionById($scope.myCompetition[c],localStorage.getItem("token")).success(function(data) {
						$scope.myCompetitionData.push(data);
						$ionicLoading.hide();
					}).error(function(data) {
						$ionicLoading.hide();
					});
				}
				console.log($scope.myCompetitionData);
			}			
		}).error(function(data) {	 
			$ionicLoading.hide();
		});
	}else{
		console.log("organizer");
		CompetitionService.getCompetitionByOrganizerAndSchedule(localStorage.getItem("username")).success(function(data) {
			$scope.myCompetitionData = data;
			console.log($scope.myCompetitionData);
			$ionicLoading.hide();
		}).error(function(data) {
			$ionicLoading.hide();
		});
	}
	
 	$scope.goToScheduleDetail = function(id){
 		localStorage.setItem("backStatus", 'schedule');
 		$state.go('app.competition_schedule', {
			'competitionId': id
		});
 	}
})

.controller('ScheduleDetailCtrl', function($scope, $stateParams, $ionicPopup, $ionicTabsDelegate, $ionicLoading, $ionicPopover, $state, FixtureService, MatchService, CompetitionService) {
 	var ls = localStorage;

 	console.log($stateParams.competitionId);
 	ls.setItem("compId", $stateParams.competitionId);
 	$scope.competition = {};
 	$scope.numOfFixtures = 0;
 	$scope.fixturesArr = [];
 	CompetitionService.getCompetitionById($stateParams.competitionId,ls.getItem("token")).success(function(data) {
		$scope.competition = data;
		ls.setItem("compName", $scope.competition.comp_name);
		ls.setItem("compType", $scope.competition.comp_type);
		ls.setItem("compNumOfTeam", $scope.competition.comp_numOfTeam);
		$ionicLoading.hide();
		if($scope.competition.comp_numOfTeam % 2 == 0){
			$scope.numOfFixtures = $scope.competition.comp_numOfTeam - 1;
		}else{
			$scope.numOfFixtures = $scope.competition.comp_numOfTeam;
		}
		console.log($scope.numOfFixtures);
		$scope.fixtureData = [];
		$scope.fixtures = {};
		$scope.formCompetition = {};
		FixtureService.getFixturesByCompetition(ls.getItem("compId"),ls.getItem("token")).success(function(data) {
			$scope.fixtures = data;
			$ionicLoading.hide();
			console.log($scope.fixtures.length);
			console.log($scope.fixtures.every(allMatchFilled));
			$scope.allFixtureFilled = $scope.fixtures.every(allMatchFilled);
			if($scope.allFixtureFilled == true){
				console.log("Schedule Completed");
				$scope.formCompetition.schedule_status = "Completed";
				console.log($scope.formCompetition);
				CompetitionService.editCompetition(ls.getItem("compId"), ls.getItem("token"), $scope.formCompetition).success(function(data) {
					$ionicLoading.hide();
					console.log("berhasil");
				}).error(function(data) {
					$ionicLoading.hide();
					console.log("gagal");
				});
			}

			for(var f = 1; f <= $scope.numOfFixtures; f++){
				$scope.fixturesArr.push(f);
			}
			if($scope.fixtures.length == 0){
				for(var f = 1; f <= $scope.numOfFixtures; f++){
					$scope.fixturesArr.push(f);
					$scope.fixtureData[f] = {};
					$scope.fixtureData[f].fixture_number = f;
					$scope.fixtureData[f].allMatchFilled = false;
					$scope.fixtureData[f].competitionId = $scope.competition.id;
					
					//insert data to database
					FixtureService.addFixture($scope.fixtureData[f]).success(function(data){
						console.log(data);
						console.log("berhasil add fixture");
						$ionicLoading.hide();
					}).error(function(data){
						$ionicLoading.hide();
					});
					//insert data to database
				}
				console.log($scope.fixturesArr);
			}
		}).error(function(data) {
			console.log("gagal");
		});

	}).error(function(data) {});

	$scope.backToSchedule = function(id) { // kembali ke halaman home
		$state.go('app.schedule', {
			'competitionId': id
		});
	};
	// $scope.matches = {};
 	$scope.getMatchesByFixture = function(fixture) {
		$state.go('app.fixture', {
            'id': fixture
        });
    };
    $scope.backToSchedule = function(){
 		$state.go('app.schedule');
 	}

    function allMatchFilled(el,index,arr) {
	    // Do not test the first array element, as you have nothing to compare to
	    if (index === 0){
	        return true;
	    }
	    else {
	    //do each array element value match the value of the previous array element
	        return (el.allMatchFilled == true);
	    }
	}
})

.controller('CompleteSchedulingCtrl', function($scope, $state,  $stateParams, $rootScope, $ionicPopup, $ionicPlatform, $ionicLoading, CompetitionService, FixtureService, MatchService) {
	//implement logic here
	$ionicLoading.show({
		content: 'Login...',
		animation: 'fade-in',
		showBackdrop: true,
	});

	$scope.competition = {};
	$scope.numOfFixtures = 0;
	$scope.fixturesArr = [];
	var ls = localStorage;
	console.log($stateParams.competitionId);
	ls.setItem("compId",$stateParams.competitionId);

	CompetitionService.getCompetitionById($stateParams.competitionId,localStorage.getItem("token")).success(function(data) {
		$scope.competition = data;
		ls.setItem("compName",$scope.competition.comp_name);
		ls.setItem("compType",$scope.competition.comp_type);
		ls.setItem("compNumOfTeam",$scope.competition.comp_numOfTeam);
		if($scope.competition.comp_type === 'GroupStage'){
			if($scope.competition.comp_numOfTeam % 2 == 0){
				$scope.numOfFixtures = $scope.competition.comp_numOfTeam - 1;
			}else{
				$scope.numOfFixtures = $scope.competition.comp_numOfTeam;
			}
		}else if($scope.competition.comp_type === 'Combination'){
			$scope.numOfFixtures = 3;
		}
		
		$ionicLoading.hide();
		console.log($scope.competition);

		for(var f = 1; f <= $scope.numOfFixtures; f++){
			$scope.fixturesArr.push(f);
		}
		console.log($scope.fixturesArr);
	
	}).error(function(data) {});

	$scope.goToFixtureDetail = function(fixtureNumber){
		$state.go('app.fixture', {
			'id': fixtureNumber
		});
	}
	$scope.back = function(){
		$state.go('app.home');
	}		
})

.controller('FixtureCtrl', function($scope, $state,  $stateParams, $rootScope, $ionicPopup, $ionicPlatform, $ionicLoading, CompetitionService, FixtureService, MatchService) {
	//implement logic here
	var ls = localStorage;
	$rootScope.showLoading($ionicLoading);
	console.log($stateParams.id);
	$scope.fixtureId = $stateParams.id;
	console.log(ls.getItem("compId"));
	console.log($scope.fixtureId);
	ls.setItem("fixId", $scope.fixtureId);
	console.log(ls.getItem("fixId"));
	$scope.matches = {};
	$scope.fixture = {};
	$scope.competition = ls.getItem("compId");
	$scope.compName = ls.getItem("compName");
	$scope.compType = ls.getItem("compType");
	$scope.compNumOfTeam = ls.getItem("compNumOfTeam");
	console.log($scope.compName);
	$scope.matches = [];

	MatchService.getMatchesByCompetitionAndFixture(ls.getItem("compId"),$scope.fixtureId).success(function(data){
		console.log(data);
		$scope.matches = data;
		$ionicLoading.hide();
	}).error(function(data){});

	// get matches by competition id
	CompetitionService.getMatchesByCompetition(ls.getItem("compId"),ls.getItem("token")).success(function(data){
		console.log(data);
		data.forEach(function(entry){
			console.log(entry.match_date);
			if(entry.match_date === null){
				console.log("msh ad yg kosong");
			}else{
				$scope.scheduleStatus = "completed";
			}	
		})

		console.log("change schedule status to completed");
		$scope.formCompetition = {};
		$scope.formCompetition.schedule_status = "Completed";
		
		CompetitionService.editCompetition(ls.getItem("compId"), ls.getItem("token"), $scope.formCompetition).success(function(data) {
			$ionicLoading.hide();
			console.log("berhasil");
		}).error(function(data) {
			$ionicLoading.hide();
			console.log("gagal");
		});
	
	}).error(function(data){});

 // 	CompetitionService.getMatchesByFixture(ls.getItem("compId"),$scope.fixtureId,ls.getItem("token")).success(function(data) {
	// 	$scope.matches = data;
	// 	// $ionicLoading.hide();
	// 	console.log($scope.matches);
	// 	for(var m = 0; m < $scope.matches.length; m++){
	// 		$scope.matches[m].match_date = new Date($scope.matches[m].match_date);
	// 		console.log($scope.matches[m].match_date);
	// 	}
	// 	console.log($scope.matches.every(isNotNull));
	// 	$scope.allMatchFilled = $scope.matches.every(isNotNull);

	// 	FixtureService.getFixture(ls.getItem("compId"),$scope.fixtureId,ls.getItem("token")).success(function(data) {
	// 		$scope.fixture = data;
	// 		// $ionicLoading.hide();
	// 		console.log($scope.fixture.id);

	// 		if($scope.allMatchFilled == true){
	// 			console.log($scope.fixtureId);
	// 			console.log("All matches filled");
	// 			$scope.fixtureForm = {};
	// 			$scope.fixtureForm.allMatchFilled = true;
	// 			//ganti fixture id dengan id fixture 
	// 			FixtureService.editFixtureById($scope.fixture.id,ls.getItem("token"),$scope.fixtureForm).success(function(data) {
	// 				console.log(data);
	// 				// $state.go('app.fixture', {
	// 				// 	'id': localStorage.getItem("fixId")
	// 				// });
	// 				// $ionicLoading.hide();
	// 			}).error(function(data) {
	// 				// $ionicLoading.hide();
	// 			});
	// 		}
	// 	}).error(function(data) {
	// 		console.log("gagal");
	// 	});
	// }).error(function(data) {
	// 	console.log("gagal");
	// });

	$scope.backToSchedule = function(id) { 
		$state.go('app.complete_scheduling', {
			'competitionId': id
		});
	};
	$scope.editMatch = function(id) { 
		$state.go('app.edit_match', {
			'matchId': id
		});
	};

	function isNotNull(el,index,arr) {
	    // Do not test the first array element, as you have nothing to compare to
	    if (index === 0){
	        return true;
	    }
	    else {
	    //do each array element value match the value of the previous array element
	        return (el.match_date !== null);
	    }
	}
})

.controller('LineUpCtrl', function($scope, $stateParams, $ionicPopup, $ionicTabsDelegate, $ionicLoading, $ionicPopover, $state, MatchService, CompetitionService) {
	$scope.chooseLineup = function(id) { // kembali ke halaman home
		$state.go('app.lineup_detail', {
			'matchId': id
		});
	};
	$scope.backToHome = function() { // kembali ke halaman home
		$state.go('app.home');
	};
})

.controller('LineUpDetailCtrl', function($scope, $stateParams, $ionicPopup, $ionicTabsDelegate, $ionicLoading, $ionicPopover, $state, TeamService, MatchService, CompetitionService) {
	console.log($stateParams.matchId);

	$scope.matchData = {};
	MatchService.getMatchById($stateParams.matchId,localStorage.getItem("token")).success(function(data){
		console.log(data);
		console.log(localStorage.getItem("team"));
		if(data.match_homeTeam.toLowerCase() === localStorage.getItem("team").toLowerCase()){
			console.log("Home");
			localStorage.setItem('teamStatus', "Home");
			$scope.choosedFormationData = data.match_homeTeamObj.formation;
			$scope.choosedLineupData = data.match_homeTeamObj.lineup.split(",");
			$scope.choosedSubData = data.match_homeTeamObj.sub.split(",");
		}else{
			console.log("Away");
			localStorage.setItem('teamStatus', "Away");
			$scope.choosedFormationData = data.match_awayTeamObj.formation;
			$scope.choosedLineupData = data.match_awayTeamObj.lineup.split(",");
			$scope.choosedSubData = data.match_awayTeamObj.sub.split(",");
		}

		console.log($scope.choosedLineupData);
		console.log($scope.choosedSubData);
		// $scope.matchData = data;
		// console.log($scope.matchData);
		$ionicLoading.hide();
	}).error(function(data){
		$ionicLoading.hide();
	});


	$scope.lineup = {};
	$scope.lineup.formation = "";
	$scope.lineup121 = {};
	$scope.lineup112 = {};
	$scope.lineup211 = {};
	
	// TeamService.getGoalkeeperByTeamName(localStorage.getItem("team")).success(function(data){
	// 	console.log(data);
	// 	$scope.goalkeeperData = data;
	// }).error(function(data) {});

	// TeamService.getDefenderByTeamName(localStorage.getItem("team")).success(function(data){
	// 	console.log(data);
	// 	$scope.defenderData = data;
	// }).error(function(data) {});

	// TeamService.getMidfielderByTeamName(localStorage.getItem("team")).success(function(data){
	// 	console.log(data);
	// 	$scope.midfielderData = data;
	// }).error(function(data) {});

	// TeamService.getAttackerByTeamName(localStorage.getItem("team")).success(function(data){
	// 	console.log(data);
	// 	$scope.attackerData = data;
	// }).error(function(data) {});

	// Get data goalkeeper, defender, midfielder, and attacker
	$scope.getGoalKeeper = function(){
		TeamService.getGoalkeeperByTeamName(localStorage.getItem("team")).success(function(data){
			console.log(data);
			if(data.length !== 0){
				console.log("tidak nol");
				$scope.goalkeeperData = data;
				clearInterval($scope.getGoalKeeperTimer);
			}
			// }else{
			// 	console.log("nol");
			// 	TeamService.getGoalkeeperByTeamName($scope.userProfile.team).success(function(data){
			// 		console.log(data);
			// 		$scope.goalkeeperData = data;
			// 	}).error(function(data) {});
			// }
		}).error(function(data) {});
	};	
	$scope.getGoalKeeperTimer = setInterval($scope.getGoalKeeper, 1000);

					// TeamService.getGoalkeeperByTeamName(localStorage.getItem("team")).success(function(data){
					// 	console.log(data);
					// 	if(data.length !== 0){
					// 		console.log("tidak nol");
					// 		$scope.goalkeeperData = data;
					// 	}else{
					// 		console.log("nol");
					// 		TeamService.getGoalkeeperByTeamName(localStorage.getItem("team")).success(function(data){
					// 			console.log(data);
					// 			$scope.goalkeeperData = data;
					// 		}).error(function(data) {});
					// 	}
					// }).error(function(data) {});

					TeamService.getDefenderByTeamName(localStorage.getItem("team")).success(function(data){
						console.log(data);
						if(data.length !== 0){
							console.log("tidak nol");
							$scope.defenderData = data;
						}else{
							console.log("nol");
							TeamService.getDefenderByTeamName(localStorage.getItem("team")).success(function(data){
								console.log(data);
								$scope.defenderData = data;
							}).error(function(data) {});
						}
					}).error(function(data) {});

					TeamService.getMidfielderByTeamName(localStorage.getItem("team")).success(function(data){
						console.log(data);
						if(data.length !== 0){
							console.log("tidak nol");
							$scope.midfielderData = data;
						}else{
							console.log("nol");
							TeamService.getMidfielderByTeamName(localStorage.getItem("team")).success(function(data){
								console.log(data);
								$scope.midfielderData = data;
							}).error(function(data) {});
						}
					}).error(function(data) {});

					TeamService.getAttackerByTeamName(localStorage.getItem("team")).success(function(data){
						console.log(data);
						if(data.length !== 0){
							console.log("tidak nol");
							$scope.attackerData = data;
						}else{
							console.log("nol");
							TeamService.getAttackerByTeamName(localStorage.getItem("team")).success(function(data){
								console.log(data);
								$scope.attackerData = data;
							}).error(function(data) {});
						}
					}).error(function(data) {});

    $(document).ready(function(){

		$('select[name=select121]').on('change', function(event ) {
		   var prevValue = $(this).data('previous');
		$('select[name=select121]').not(this).find('option[value="'+prevValue+'"]').show();    
		   var value = $(this).val();
		  $(this).data('previous',value); $('select[name=select121]').not(this).find('option[value="'+value+'"]').hide();
		});

		$('select[name=select112]').on('change', function(event ) {
		   var prevValue = $(this).data('previous');
		$('select[name=select112]').not(this).find('option[value="'+prevValue+'"]').show();    
		   var value = $(this).val();
		  $(this).data('previous',value); $('select[name=select112]').not(this).find('option[value="'+value+'"]').hide();
		});

		$('select[name=select211]').on('change', function(event ) {
		   var prevValue = $(this).data('previous');
		$('select[name=select211]').not(this).find('option[value="'+prevValue+'"]').show();    
		   var value = $(this).val();
		  $(this).data('previous',value); $('select[name=select211]').not(this).find('option[value="'+value+'"]').hide();
		});

	});


	$scope.next = function() { // kembali ke halaman home
		switch($scope.lineup.formation){
		case '1-2-1':
			$scope.lineup112.goalkeeper = "";
			$scope.lineup112.defender = "";
			$scope.lineup112.midfielder = "";
			$scope.lineup112.leftAttacker = "";
			$scope.lineup112.rightAttacker = "";
		
			$scope.lineup211.goalkeeper = "";
			$scope.lineup211.leftDefender = "";
			$scope.lineup211.rightDefender = "";
			$scope.lineup211.midfielder = "";
			$scope.lineup211.attacker = "";
			console.log($scope.lineup121);
			console.log($scope.lineup112);
			console.log($scope.lineup211);

			// Put the object into storage
			localStorage.setItem('lineup', JSON.stringify($scope.lineup121));
			localStorage.setItem('formation', $scope.lineup.formation);
			// $state.go('app.substitute_players');
			$state.go('app.substitute_players', {
				'matchId': $stateParams.matchId
			});
			break;
		case '1-1-2':
			$scope.lineup121.goalkeeper = "";
			$scope.lineup121.defender = "";
			$scope.lineup121.leftMidfielder = "";
			$scope.lineup121.rightMidfielder = "";
			$scope.lineup121.attacker = "";
		
			$scope.lineup211.goalkeeper = "";
			$scope.lineup211.leftDefender = "";
			$scope.lineup211.rightDefender = "";
			$scope.lineup211.midfielder = "";
			$scope.lineup211.attacker = "";
			console.log($scope.lineup112);
			console.log($scope.lineup121);
			console.log($scope.lineup211);

			// Put the object into storage
			localStorage.setItem('lineup', JSON.stringify($scope.lineup112));
			localStorage.setItem('formation', $scope.lineup.formation);
			// $state.go('app.substitute_players');
			$state.go('app.substitute_players', {
				'matchId': $stateParams.matchId
			});
			break;
		case '2-1-1':
			$scope.lineup112.goalkeeper = "";
			$scope.lineup112.defender = "";
			$scope.lineup112.midfielder = "";
			$scope.lineup112.leftAttacker = "";
			$scope.lineup112.rightAttacker = "";
		
			$scope.lineup121.goalkeeper = "";
			$scope.lineup121.defender = "";
			$scope.lineup121.leftMidfielder = "";
			$scope.lineup121.rightMidfielder = "";
			$scope.lineup121.attacker = "";
			console.log($scope.lineup211);
			console.log($scope.lineup121);
			console.log($scope.lineup112);

			// Put the object into storage
			localStorage.setItem('lineup', JSON.stringify($scope.lineup211));
			localStorage.setItem('formation', $scope.lineup.formation);
			// $state.go('app.substitute_players');
			$state.go('app.substitute_players', {
				'matchId': $stateParams.matchId
			});
			break;
	}
	};
	$scope.chooseLineup = function() { // kembali ke halaman home
		$state.go('app.lineup_detail');
	};
	$scope.backToMyTeam = function() { // kembali ke halaman home
		$state.go('app.my_team');
	};
})

.controller('SubstituteCtrl', function($scope, $stateParams, $ionicPopup, $ionicTabsDelegate, $ionicLoading, $ionicPopover, $state, TeamService, MatchService, CompetitionService) {
	console.log($stateParams.matchId);
	// Retrieve the object from storage
	var lineupObj = localStorage.getItem('lineup');
	var lineupObjData = JSON.parse(lineupObj);
	console.log(localStorage.getItem("formation"));
	console.log(lineupObjData);

	var lineupArr = [];
	var teamSquadObj = {};
	var teamSquadArr = [];
	$scope.substituteData = [];
	$scope.substitute = {};

	switch(localStorage.getItem("formation")){
		case '1-2-1':

			lineupArr.push(lineupObjData.goalkeeper.username);
			lineupArr.push(lineupObjData.defender.username);
			lineupArr.push(lineupObjData.leftMidfielder.username);
			lineupArr.push(lineupObjData.rightMidfielder.username);
			lineupArr.push(lineupObjData.attacker.username);
			
			TeamService.getTeamSquad(localStorage.getItem("team")).success(function(data){
				teamSquadObj = data;
				for(var i = 0; i < teamSquadObj.length; i++){
					if(teamSquadObj[i].role === 'Player'){
						console.log("player");	
						teamSquadArr.push(teamSquadObj[i].username);
					}
				}

				$scope.substituteData = teamSquadArr.filter( function ( elem ) {
				    return lineupArr.indexOf( elem ) === -1;
				});

				console.log($scope.substituteData);

				// MatchService.editMatchById($scope.matchData.id,localStorage.getItem("token"),$scope.timerData).success(function(data) {
				// 	console.log('qweqweqrer erwerwerrqwrqwrqwrqwr');
				// 	$ionicLoading.hide();
				// 	// $state.go('app.home');
				// }).error(function(data) {
				// 	$ionicLoading.hide();
				// });
				
			}).error(function(data) {});

			$(document).ready(function(){
				$('select[name=sub]').on('change', function(event ) {
				   var prevValue = $(this).data('previous');
				$('select[name=sub]').not(this).find('option[value="'+prevValue+'"]').show();    
				   var value = $(this).val();
				  $(this).data('previous',value); $('select[name=sub]').not(this).find('option[value="'+value+'"]').hide();
				});
			});	
			break;

		case '1-1-2':
			lineupArr.push(lineupObjData.goalkeeper.username);
			lineupArr.push(lineupObjData.defender.username);
			lineupArr.push(lineupObjData.midfielder.username);
			lineupArr.push(lineupObjData.leftAttacker.username);
			lineupArr.push(lineupObjData.rightAttacker.username);
			
			TeamService.getTeamSquad($scope.menuProfile.team).success(function(data){
				teamSquadObj = data;
				for(var i = 0; i < teamSquadObj.length; i++){
					if(teamSquadObj[i].role === 'Player'){
						console.log("player");	
						teamSquadArr.push(teamSquadObj[i].username);
					}
				}

				$scope.substituteData = teamSquadArr.filter( function ( elem ) {
				    return lineupArr.indexOf( elem ) === -1;
				});

				console.log($scope.substituteData);

			}).error(function(data) {});

			$(document).ready(function(){
				$('select[name=sub]').on('change', function(event ) {
				   var prevValue = $(this).data('previous');
				$('select[name=sub]').not(this).find('option[value="'+prevValue+'"]').show();    
				   var value = $(this).val();
				  $(this).data('previous',value); $('select[name=sub]').not(this).find('option[value="'+value+'"]').hide();
				});
			});	
			break;

		case '2-1-1':
			lineupArr.push(lineupObjData.goalkeeper.username);
			lineupArr.push(lineupObjData.leftDefender.username);
			lineupArr.push(lineupObjData.rightDefender.username);
			lineupArr.push(lineupObjData.midfielder.username);
			lineupArr.push(lineupObjData.attacker.username);
			
			TeamService.getTeamSquad($scope.menuProfile.team).success(function(data){
				teamSquadObj = data;
				for(var i = 0; i < teamSquadObj.length; i++){
					if(teamSquadObj[i].role === 'Player'){
						console.log("player");	
						teamSquadArr.push(teamSquadObj[i].username);
					}
				}

				$scope.substituteData = teamSquadArr.filter( function ( elem ) {
				    return lineupArr.indexOf( elem ) === -1;
				});

				console.log($scope.substituteData);

			}).error(function(data) {});

			$(document).ready(function(){
				$('select[name=sub]').on('change', function(event ) {
				   var prevValue = $(this).data('previous');
				$('select[name=sub]').not(this).find('option[value="'+prevValue+'"]').show();    
				   var value = $(this).val();
				  $(this).data('previous',value); $('select[name=sub]').not(this).find('option[value="'+value+'"]').hide();
				});
			});	
			break;
	}

	$scope.submitLineup = function() { 

		console.log(localStorage.getItem("formation"));
		console.log(lineupArr);
		console.log($scope.substitute);
		var subArr = [];
		var sub = Object.values($scope.substitute);
		console.log(sub);

		for(var i = 0; i < sub.length; i++){
			if(sub[i] !== undefined){
				subArr.push(sub[i]);
			}
		}

		var subArray = subArr.join(",");
		console.log(subArray);

		$scope.lineupData = {};

		if(localStorage.getItem("teamStatus") === "Home"){
			$scope.lineupData.match_homeTeamObj = {};
			$scope.lineupData.match_homeTeamObj.team_name = localStorage.getItem("team");
			$scope.lineupData.match_homeTeamObj.formation = localStorage.getItem("formation");
			$scope.lineupData.match_homeTeamObj.lineup = lineupArr.join(",");
			$scope.lineupData.match_homeTeamObj.lastLineup = lineupArr.join(",");
			$scope.lineupData.match_homeTeamObj.player = lineupArr.join(",");
			$scope.lineupData.match_homeTeamObj.sub = subArray;
			$scope.lineupData.match_homeTeamObj.lastSub = subArray;
			$scope.lineupData.match_homeTeamObj.score = 0;
		}else{
			$scope.lineupData.match_awayTeamObj = {};
			$scope.lineupData.match_awayTeamObj.team_name = localStorage.getItem("team");
			$scope.lineupData.match_awayTeamObj.formation = localStorage.getItem("formation");
			$scope.lineupData.match_awayTeamObj.lineup = lineupArr.join(",");;
			$scope.lineupData.match_awayTeamObj.lastLineup = lineupArr.join(",");;
			// pas substitute, player in ditambah ke data player
			$scope.lineupData.match_awayTeamObj.player = lineupArr.join(",");;
			// pas substitute, player in ditambah ke data player
			$scope.lineupData.match_awayTeamObj.sub = subArray;
			$scope.lineupData.match_awayTeamObj.lastSub = subArray;
			$scope.lineupData.match_awayTeamObj.score = 0;
		}
		
		MatchService.editMatchById($stateParams.matchId,$scope.lineupData).success(function(data) {
			console.log('qweqweqrer erwerwerrqwrqwrqwrqwr');
			console.log(data);
			$ionicLoading.hide();
			var alertPopup = $ionicPopup.alert({
				title: 'Success!',
				template: 'Berhasil menyimpan data lineup'
			});
			$state.go('app.my_team');
		}).error(function(data) {
			$ionicLoading.hide();
			var alertPopup = $ionicPopup.alert({
				title: 'Failed!',
				template: 'Gagal menyimpan data lineup'
			});
			$state.go('app.my_team');
		});

	};

	$scope.backToLineupDetail = function() { 
		$state.go('app.lineup_detail');
	};
})

.controller('TeamInfoCtrl', function($scope, $stateParams, $ionicPopup, $ionicTabsDelegate, $ionicLoading, $ionicPopover, $state, MatchService, CompetitionService) {
	$scope.chooseLineup = function() { // kembali ke halaman home
		$state.go('app.lineup_detail');
	};
})

.controller('LiveScoreCtrl', function($scope, $stateParams, $ionicPopup, $rootScope, $ionicTabsDelegate, $ionicLoading, $ionicPopover, $state, MatchService, CompetitionService) {

	var ls = localStorage;
	var date = new Date();
	$scope.day = date.getDate();
	$scope.month = date.getMonth();
	$scope.monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	$scope.monthName = $scope.monthNames[$scope.month];
    $scope.year = date.getFullYear();

    $scope.thisDay = date.getDate();
	$scope.thisMonth = date.getMonth();
	$scope.thisMonthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	$scope.thisMonthName = $scope.monthNames[$scope.month];
    $scope.thisYear = date.getFullYear();


    var lastDay = new Date($scope.year, $scope.month + 1, 0);
	var ld = lastDay.getDate();

	console.log($scope.day);
	console.log(ld);
	$scope.competition = {};
	$scope.matchDate = $scope.day + " " + $scope.monthName + " " + $scope.year;
	$scope.matchDate = new Date($scope.matchDate);
	$scope.matchDate = moment($scope.matchDate).toISOString();
	console.log($scope.matchDate);
	console.log(ls.getItem("myCompetitionId"));

	if(ls.getItem("role") !== 'Referee'){
		
		if(ls.getItem("myCompetitionId") !== ''){
			$scope.myCompetitionId = ls.getItem("myCompetitionId");
			$scope.myCompetitionArr = ls.getItem("myCompetitionId").split(",");
			// get live matches
			$scope.allLiveMatchesObj = {
				"competition_name": [],
				"matches": []
			}
			// var liveMatchLoop = 1;
			var compName = "";
			$scope.liveMatchCount = 0;
			$scope.competitionsArr = [];
			// fungsi ini harus di looping terus karena datanya akan ditampilkan secara real-time
			// bikin interval waktu utk looping fungsi ini
			// $scope.loadLiveMatches = function(){
				$scope.myCompetitionArr.forEach(function(competition,index){
					$ionicLoading.show();
					// CompetitionService.getCompetitionName(competition).success(function(data) {
					// 	compName = data;
					// 	console.log(compName);
						
					// }).error(function(data) {});

					CompetitionService.getCompetitionByCompIdAndLiveStat(competition,ls.getItem("token")).success(function(data) {
						// $scope.liveCompetitions = data;
						// console.log($scope.liveCompetitions);
						console.log(data);
						$scope.liveMatchCount = $scope.liveMatchCount + data.length;
						if(data.length !== 0){
							console.log("data length is not 0");
							CompetitionService.getCompetitionName(competition).success(function(name) {
								$scope.allLiveMatchesObj.competition_name.push(name);
								$scope.allLiveMatchesObj.matches.push(data);

								$scope.competitionsArr[index] = {};
								$scope.competitionsArr[index].competition_name = name;
								$scope.competitionsArr[index].matches = data;	
							}).error(function(data) {

							});
						}else{
							console.log("data length is 0");
						}

						console.log($scope.allLiveMatchesObj);
						console.log($scope.competitionsArr);
					}).error(function(data) {});
					// liveMatchLoop++;
					// if(liveMatchLoop === $scope.myCompetitionArr.length){
						setTimeout(function() {
							console.log("hide loading");
				            $ionicLoading.hide();
				        }, 4000);				
					// }
				});


			// }
			// setTimeout(function(){
				$scope.liveMatchData = [];
				$scope.loadCompetition1 = function(){
					console.log($scope.competitionsArr);
					$scope.competitionsArr.forEach(function(competition){
						competition.matches.forEach(function(match){
							console.log(match);
							MatchService.getMatchById(match.id).success(function(data){
								$scope.liveMatchData[match.id] = data;
								// console.log($scope.liveMatchData);
								// $ionicLoading.hide();
							}).error(function(data){
								// $ionicLoading.hide();
							});
						});
					})
					
					// $scope.competitionsArr[1].matches.forEach(function(match){
					// 	console.log(match);
					// 	MatchService.getMatchById(match.id).success(function(data){
					// 		$scope.liveMatchData[match.id] = data;
					// 		// console.log($scope.liveMatchData);
					// 		$ionicLoading.hide();
					// 	}).error(function(data){
					// 		$ionicLoading.hide();
					// 	});
					// });
					// $scope.competitionsArr[2].matches.forEach(function(match){
					// 	console.log(match);
					// 	MatchService.getMatchById(match.id).success(function(data){
					// 		$scope.liveMatchData[match.id] = data;
					// 		// console.log($scope.liveMatchData);
					// 		$ionicLoading.hide();
					// 	}).error(function(data){
					// 		$ionicLoading.hide();
					// 	});
					// });
				}
			// },1000);
			$scope.showme = 1;
			// if($scope.showme == 1){
				
			// }else if($scope.showme == 2){
			// 	clearInterval(window.loadCompetition1);
			// }

			setTimeout(function(){
				window.loadCompetition1 = setInterval($scope.loadCompetition1, 1000);
			},2000);

			$scope.showme1 = function(){
				setTimeout(function(){
					window.loadCompetition1 = setInterval($scope.loadCompetition1, 1000);
				},1000);
				$scope.showme = 1;
				console.log(1);
			}

			$scope.showme2 = function(){
				$scope.showme = 2;
				console.log('2');
				clearInterval(window.loadCompetition1);
			}
				
			
			
			// clearInterval(window.loadLiveMatches);
			// window.loadLiveMatches = setInterval($scope.loadLiveMatches, 1000);

			console.log("masukk");
			console.log($scope.myCompetitionArr);
			$scope.myCompetitionArr.forEach(function(competition){
				CompetitionService.getCompetitionById(competition,ls.getItem("token")).success(function(data) {
					$scope.competition = data;
					console.log($scope.competition);
				}).error(function(data) {});
			});

			var loop = 1;
			$scope.allMatchesObj = {
				"competition_name": [],
				"matches": []
			}

			$rootScope.showLoading($ionicLoading);
			// get today mathes    
			$scope.myCompetitionArr.forEach(function(competition){

				CompetitionService.getCompetitionByDate(competition,$scope.matchDate,ls.getItem("token")).success(function(data) {

					if(data.length !== 0){
						CompetitionService.getCompetitionName(competition).success(function(name) {
							$scope.allMatchesObj.competition_name.push(name);
							$scope.allMatchesObj.matches.push(data);
						}).error(function(data) {

						});
					}
					
					console.log($scope.allMatchesObj);

				}).error(function(data) {
					console.log("gagal");
				});

				loop++
				if(loop === $scope.myCompetitionArr.length){
					setTimeout(function() {
			             $ionicLoading.hide();
			        }, 4000);				
				}
			});

		}else if (ls.getItem("myCompetitionId") === '') { 
			$ionicLoading.hide();
			$scope.competitionStatus = false;

			$scope.showme = 1;

			$scope.showme1 = function(){
				$scope.showme = 1;
				console.log(1);
			}

			$scope.showme2 = function(){
				$scope.showme = 2;
				console.log('2');
			}
		}
	}	
	
	$scope.next = function(){
		// $scope.competitionStatus = false;
		$rootScope.showLoading($ionicLoading);

		$scope.showme = 2;
		$scope.allMatchesObj = {
			"competition_name": [],
			"matches": []
		}
		
		var lastDay = new Date($scope.year, $scope.month + 1, 0);
		var ld = lastDay.getDate();

		if($scope.day == ld){
			$scope.day = 1;
			$scope.month += 1;
			$scope.monthName = $scope.monthNames[$scope.month];
			if($scope.month == 12){
				$scope.month = 0;
				$scope.monthName = $scope.monthNames[$scope.month];
				$scope.year += 1;
			}
		}else{
			$scope.day += 1;
		}

		$scope.matchDate = $scope.day + " " + $scope.monthName + " " + $scope.year;
		$scope.matchDate = new Date($scope.matchDate);
		$scope.matchDate = moment($scope.matchDate).toISOString();
		
		var nextLoop = 1;

		if(ls.getItem("myCompetitionId") !== ''){
			// get matches by date
			$scope.myCompetitionArr.forEach(function(competition){

				CompetitionService.getCompetitionByDate(competition,$scope.matchDate,ls.getItem("token")).success(function(data) {

					if(data.length !== 0){
						CompetitionService.getCompetitionName(competition).success(function(name) {
							$scope.allMatchesObj.competition_name.push(name);
							$scope.allMatchesObj.matches.push(data);
						}).error(function(data) {

						});
					}
					
					console.log($scope.allMatchesObj);

				}).error(function(data) {
					console.log("gagal");
				});

				nextLoop++
				if(nextLoop === $scope.myCompetitionArr.length){
					setTimeout(function() {
			             $ionicLoading.hide();
			        }, 1500);				
				}
			});
		}else{
			$scope.competitionStatus = false;
			$ionicLoading.hide();
		}
	};

	$scope.prev = function(){
		$scope.competitionStatus = false;
		$rootScope.showLoading($ionicLoading);

		$scope.showme = 2;
		$scope.allMatchesObj = {
			"competition_name": [],
			"matches": []
		}
		
		if($scope.day == 1){
			$scope.month -= 1;
			$scope.monthName = $scope.monthNames[$scope.month];
			var lastDay = new Date($scope.year, $scope.month + 1, 0);
			var ld = lastDay.getDate();
			$scope.day = ld;
			if($scope.month == -1){
				$scope.month = 11;
				$scope.monthName = $scope.monthNames[$scope.month];
				$scope.year -= 1;
			}
		}else{
			$scope.day -= 1;
		}

		$scope.matchDate = $scope.day + " " + $scope.monthName + " " + $scope.year;
		$scope.matchDate = new Date($scope.matchDate);
		$scope.matchDate = moment($scope.matchDate).toISOString();

		var prevLoop = 0;
		
		if(ls.getItem("myCompetitionId") !== ''){
			$scope.myCompetitionArr.forEach(function(competition){

				CompetitionService.getCompetitionByDate(competition,$scope.matchDate,ls.getItem("token")).success(function(data) {

					if(data.length !== 0){
						CompetitionService.getCompetitionName(competition).success(function(name) {
							$scope.allMatchesObj.competition_name.push(name);
							$scope.allMatchesObj.matches.push(data);
						}).error(function(data) {

						});
					}
					
					console.log($scope.allMatchesObj);

				}).error(function(data) {
					console.log("gagal");
				});

				prevLoop++
				if(prevLoop === $scope.myCompetitionArr.length){
					setTimeout(function() {
			             $ionicLoading.hide();
			        }, 1500);				
				}
			});
		}else{
			$scope.competitionStatus = false;
			$ionicLoading.hide();
		}	
	};

	$scope.backToHome = function(){
		$state.go('app.home');
		clearInterval(window.loadCompetition1);
	};
	// go to match detail page
	$scope.viewMatchResult = function(id) { 
		localStorage.setItem("matchResultBackStatus", "livescore");
		$state.go('app.match_detail', {
			'matchId': id
		});
	};
})

.controller('CompetitionScheduleCtrl', function($scope, $stateParams, $rootScope, $ionicPopup, $ionicTabsDelegate, $ionicLoading, $ionicPopover, $state, MatchService, ClassementService, TeamService, FixtureService, CompetitionService) {
	var ls = localStorage;
	$rootScope.showLoading($ionicLoading);
	
	console.log(localStorage.getItem("backStatus"));
	// build a string with random characters
	// for(var i = 1; i < stringlength; i++){
	// 	var rndNum = Math.ceil(Math.random() * stringArray.length) - 1;
	// 	rndString = rndString + stringArray[rndNum];
	// }	

	$scope.classementsDataObj = {};
	// $scope.numOfGroups = 0;
	// $scope.groupArr = [];
	$scope.groupA = [];
	$scope.groupB = [];
	$scope.groupC = [];
	$scope.groupD = [];
	$scope.groupE = [];
	$scope.groupF = [];
	$scope.groupG = [];
	$scope.groupH = [];
	$scope.classementDataArr = [];

	ClassementService.getClassementsByCompetitionId($stateParams.competitionId,ls.getItem("token")).success(function(data) {
		$scope.classementsDataObj = data;

		$scope.classementsDataObj.forEach(function(entry){
			if(entry.group == "A"){
				$scope.groupA.push(entry);
			}else if(entry.group == "B"){
				$scope.groupB.push(entry);
			}else if(entry.group == "C"){
				$scope.groupC.push(entry);
			}else if(entry.group == "D"){
				$scope.groupD.push(entry);
			}else if(entry.group == "E"){
				$scope.groupE.push(entry);
			}else if(entry.group == "F"){
				$scope.groupF.push(entry);
			}else if(entry.group == "G"){
				$scope.groupG.push(entry);
			}else if(entry.group == "H"){
				$scope.groupH.push(entry);
			}else{
				$scope.classementDataArr.push(entry)
			}	
		})
	}).error(function(data) {});

	console.log($stateParams.competitionId);
 	$scope.competition = {};
 	$scope.numOfFixtures = 0;
 	$scope.fixturesArr = [];
 	$scope.firstFixture = 0;
 	$scope.lastFixture = 0;
 	$scope.matches = {};
 	$scope.knockoutMatches = {};
 	$scope.kmLength = "";
 	$scope.matchFixture = 'play off';

	$scope.$on('$ionicView.enter', function(){
	 	CompetitionService.getCompetitionById($stateParams.competitionId,ls.getItem("token")).success(function(data) {
			$scope.competition = data;
			if($scope.competition.comp_type === 'GroupStage'){
				if($scope.competition.comp_numOfTeam % 2 == 0){
					$scope.numOfFixtures = $scope.competition.comp_numOfTeam - 1;
				}else{
					$scope.numOfFixtures = $scope.competition.comp_numOfTeam;
				}
			}else if($scope.competition.comp_type === 'Combination'){
				$scope.numOfFixtures = 3;
			}
			
			console.log($scope.numOfFixtures);
			console.log($scope.competition.registeredTeam);
			$scope.compTeam = $scope.competition.registeredTeam.split(',');
			console.log($scope.compTeam);
			$scope.team = {};
			$scope.classementForm = {};
			$scope.classements = {};
			var teamPosition = "0";
			for(var i = 1; i < $scope.compTeam.length; i++){
				teamPosition += ",0";
			}
			console.log(teamPosition);
			$ionicLoading.hide();

			for(var f = 1; f <= $scope.numOfFixtures; f++){
				$scope.fixturesArr.push(f);
			}
			console.log($scope.fixturesArr);
			$scope.firstFixture = $scope.fixturesArr[0];
			$scope.lastFixture = $scope.numOfFixtures;
			console.log($scope.firstFixture);
			console.log($scope.lastFixture);

			$scope.nextStatus = true;
		 	$scope.prevStatus = false;
		 	$scope.fixtureNumber = 1;
		 	$scope.match_status = 'Play Off';

		 	// Group Stage
		 	$scope.matchesArr = [];
		 	if($scope.competition.comp_type == 'GroupStage'){
			 	CompetitionService.getMatchesByFixture($stateParams.competitionId,$scope.fixtureNumber,ls.getItem("token")).success(function(data) {
					$scope.matchesArr = data;
					console.log($scope.matchesArr);
					for(var m = 0; m < $scope.matchesArr.length; m++){
						$scope.matchesArr[m].match_date = new Date($scope.matchesArr[m].match_date);
						console.log($scope.matchesArr[m].match_date);
					}
					// $ionicLoading.hide();
				}).error(function(data) {
					console.log("gagal");
				});
			}
			// Group Stage	

			// Knockout System
			$scope.knockoutMatchesArr = [];
			if($scope.competition.comp_type == 'KnockoutSystem'){
				$scope.matchFixture = 'play off';
				$scope.finishedMatchLength = 0;
				var pair = 1;
				$scope.roundOf16FixtureObj = [];
				var pair1Status = false;
				$scope.knockoutRoundCompletedStatus = false;
				CompetitionService.getMatchesByMatchFixture($stateParams.competitionId,$scope.matchFixture,ls.getItem("token")).success(function(data) {
					$scope.knockoutMatchesArr = data;
					console.log($scope.knockoutMatchesArr);

					for(var m = 0; m < $scope.knockoutMatchesArr.length; m++){
						$scope.knockoutMatchesArr[m].match_date = new Date($scope.knockoutMatchesArr[m].match_date);
						console.log($scope.knockoutMatchesArr[m].match_date);

						if($scope.knockoutMatchesArr[m].match_winner !== ''){
							console.log($scope.knockoutMatchesArr[m]);
							$scope.finishedMatchLength++;
						}

						if($scope.finishedMatchLength == $scope.knockoutMatchesArr.length){
							console.log("all matches is finished");
							$scope.knockoutRoundCompletedStatus = true;
						}else{
							console.log("the match is not finished yet");
						}
					}
					$ionicLoading.hide();
				}).error(function(data) {
					console.log("gagal");
				});
			}
			// Knockout System

			// Combination
			$scope.matchesArr = [];
		 	if($scope.competition.comp_type == 'Combination'){
			 	CompetitionService.getMatchesByFixture($stateParams.competitionId,$scope.fixtureNumber,ls.getItem("token")).success(function(data) {
					// $scope.matches = data;
					$scope.matchesArr = data;
					console.log($scope.matchesArr);
					for(var m = 0; m < $scope.matches.length; m++){
						$scope.matches[m].match_date = new Date($scope.matches[m].match_date);
						console.log($scope.matches[m].match_date);
					}
					// $ionicLoading.hide();
				}).error(function(data) {
					console.log("gagal");
				});
			}
			// Combination	

			// Group Stage
			$scope.knockoutStatus = "false";
			$scope.next = function(){
				$rootScope.showLoading($ionicLoading);
				$scope.fixtureNumber += 1;
				if($scope.fixtureNumber > $scope.firstFixture){
					$scope.prevStatus = true;
				}
				if($scope.competition.comp_type === 'GroupStage'){
					if($scope.fixtureNumber === $scope.lastFixture){
						$scope.nextStatus = false;
					}
				}
				if($scope.fixtureNumber > $scope.lastFixture){	
					if($scope.competition.comp_type === 'Combination'){
						$scope.knockoutStatus = "true";
						if($scope.competition.comp_numOfTeam == 32){
							if($scope.matchFixture == 'play off'){
								$scope.matchFixture = 'round of 16';
							}else if($scope.matchFixture == 'round of 16'){
								$scope.matchFixture = 'quarter final';
							}else if($scope.matchFixture == 'quarter final'){
								$scope.matchFixture = 'semi final';
							}else if($scope.matchFixture == 'semi final'){
								$scope.matchFixture = 'third place';
							}else if($scope.matchFixture = 'third place'){
								$scope.matchFixture = 'final';
								$scope.nextStatus = false;
							}
						}else if($scope.competition.comp_numOfTeam == 16){
							if($scope.matchFixture == 'play off'){
								$scope.matchFixture = 'quarter final';
							}else if($scope.matchFixture == 'quarter final'){
								$scope.matchFixture = 'semi final';
							}else if($scope.matchFixture == 'semi final'){
								$scope.matchFixture = 'third place';
							}else if($scope.matchFixture == 'third place'){
								$scope.matchFixture = 'final';
								$scope.nextStatus = false;
							}
						}else if($scope.competition.comp_numOfTeam == 8){
							if($scope.matchFixture == 'play off'){
								$scope.matchFixture = 'semi final';
							}else if($scope.matchFixture == 'semi final'){
								$scope.matchFixture = 'third place';
							}else if($scope.matchFixture == 'third place'){
								$scope.matchFixture = 'final';
								$scope.nextStatus = false;
							}
						}
					}
					
					CompetitionService.getMatchesByMatchFixture($stateParams.competitionId,$scope.matchFixture,ls.getItem("token")).success(function(data) {
						$scope.matchesArr = data;
						console.log($scope.matchesArr);
						for(var m = 0; m < $scope.matchesArr.length; m++){
							$scope.matchesArr[m].match_date = new Date($scope.matchesArr[m].match_date);
							console.log($scope.matchesArr[m].match_date);
						}
						$ionicLoading.hide();
					}).error(function(data) {
						console.log("gagal");
					});
					
				}else{
					CompetitionService.getMatchesByFixture($stateParams.competitionId,$scope.fixtureNumber,ls.getItem("token")).success(function(data) {
						$scope.matchesArr = data;
						console.log($scope.fixtureNumber);
						console.log($scope.lastFixture);
						for(var m = 0; m < $scope.matchesArr.length; m++){
							if($scope.fixtureNumber === $scope.lastFixture){
								// if($scope.matchesArr[m].fullTime === false){
								// 	console.log("false");
								// 	// $scope.knockoutPhase = false;
								// 	$scope.nextStatus = false;
								// }
								if($scope.competition.comp_type == 'Combination'){
									if($scope.matchesArr[m].match_status !== 'finished'){
										$scope.nextStatus = false;
									}
								}
							}
							$scope.matchesArr[m].match_date = new Date($scope.matchesArr[m].match_date);
							console.log($scope.matchesArr[m].match_date);
						}
						$ionicLoading.hide();
					}).error(function(data) {
						console.log("gagal");
					});
				}	
				
			};
			$scope.prev = function(){
				$rootScope.showLoading($ionicLoading);
				$scope.fixtureNumber -= 1;
				if($scope.fixtureNumber <= $scope.firstFixture){
					$scope.prevStatus = false;
				}
				if($scope.fixtureNumber < $scope.lastFixture){
					$scope.nextStatus = true;
				}
				console.log($scope.fixtureNumber);
				if($scope.matchFixture == 'play off'){
					console.log("asasdasda");
					CompetitionService.getMatchesByFixture($stateParams.competitionId,$scope.fixtureNumber,ls.getItem("token")).success(function(data) {
						$scope.matchesArr = data;
						console.log($scope.matches);
						for(var m = 0; m < $scope.matches.length; m++){
							$scope.matches[m].match_date = new Date($scope.matches[m].match_date);
							console.log($scope.matches[m].match_date);
						}
						$ionicLoading.hide();
					}).error(function(data) {
						console.log("gagal");
					});
				}
				
				if($scope.competition.comp_numOfTeam == 32){
					if($scope.matchFixture == 'final'){
						$scope.matchFixture = 'third place';
						$scope.nextStatus = true;

						CompetitionService.getMatchesByMatchFixture($stateParams.competitionId,$scope.matchFixture,ls.getItem("token")).success(function(data) {
							$scope.matchesArr = data;
							console.log($scope.matches);
							$ionicLoading.hide();
						}).error(function(data) {
							console.log("gagal");
						});

					}else if($scope.matchFixture == 'third place'){
						$scope.matchFixture = 'semi final';

						CompetitionService.getMatchesByMatchFixture($stateParams.competitionId,$scope.matchFixture,ls.getItem("token")).success(function(data) {
							$scope.matchesArr = data;
							console.log($scope.matches);
							$ionicLoading.hide();
						}).error(function(data) {
							console.log("gagal");
						});
					}else if($scope.matchFixture == 'semi final'){
						$scope.matchFixture = 'quarter final';

						CompetitionService.getMatchesByMatchFixture($stateParams.competitionId,$scope.matchFixture,ls.getItem("token")).success(function(data) {
							$scope.matchesArr = data;
							console.log($scope.matches);
							$ionicLoading.hide();
						}).error(function(data) {
							console.log("gagal");
						});
					}else if($scope.matchFixture == 'quarter final'){
						$scope.matchFixture = 'round of 16';

						CompetitionService.getMatchesByMatchFixture($stateParams.competitionId,$scope.matchFixture,ls.getItem("token")).success(function(data) {
							$scope.matchesArr = data;
							console.log($scope.matches);
							$ionicLoading.hide();
						}).error(function(data) {
							console.log("gagal");
						});
					}else if($scope.matchFixture == 'round of 16'){
						$scope.matchFixture = 'play off';
						$scope.knockoutStatus = "false";
						$scope.fixtureNumber = $scope.lastFixture;

						CompetitionService.getMatchesByFixture($stateParams.competitionId,$scope.fixtureNumber,ls.getItem("token")).success(function(data) {
							$scope.matchesArr = data;
							console.log($scope.matches);
							for(var m = 0; m < $scope.matches.length; m++){
								$scope.matches[m].match_date = new Date($scope.matches[m].match_date);
								console.log($scope.matches[m].match_date);
							}
							$ionicLoading.hide();
						}).error(function(data) {
							console.log("gagal");
						});
					}
				}else if($scope.competition.comp_numOfTeam == 16){
					if($scope.matchFixture == 'final'){
						$scope.matchFixture = 'third place';
						$scope.nextStatus = true;

						CompetitionService.getMatchesByMatchFixture($stateParams.competitionId,$scope.matchFixture,ls.getItem("token")).success(function(data) {
							$scope.matchesArr = data;
							console.log($scope.matches);
							$ionicLoading.hide();
						}).error(function(data) {
							console.log("gagal");
						});

					}else if($scope.matchFixture == 'third place'){
						$scope.matchFixture = 'semi final';

						CompetitionService.getMatchesByMatchFixture($stateParams.competitionId,$scope.matchFixture,ls.getItem("token")).success(function(data) {
							$scope.matchesArr = data;
							console.log($scope.matches);
							$ionicLoading.hide();
						}).error(function(data) {
							console.log("gagal");
						});
					}else if($scope.matchFixture == 'semi final'){
						$scope.matchFixture = 'quarter final';

						CompetitionService.getMatchesByMatchFixture($stateParams.competitionId,$scope.matchFixture,ls.getItem("token")).success(function(data) {
							$scope.matchesArr = data;
							console.log($scope.matches);
							$ionicLoading.hide();
						}).error(function(data) {
							console.log("gagal");
						});
					}else if($scope.matchFixture == 'quarter final'){
						$scope.matchFixture = 'play off';
						$scope.knockoutStatus = "false";
						$scope.fixtureNumber = $scope.lastFixture;
						CompetitionService.getMatchesByFixture($stateParams.competitionId,$scope.fixtureNumber,ls.getItem("token")).success(function(data) {
							$scope.matchesArr = data;
							console.log($scope.matches);
							$ionicLoading.hide();
						}).error(function(data) {
							console.log("gagal");
						});
					}
				}else if($scope.competition.comp_numOfTeam == 8){
					if($scope.matchFixture == 'final'){
						$scope.matchFixture = 'third place';
						$scope.nextStatus = true;

						CompetitionService.getMatchesByMatchFixture($stateParams.competitionId,$scope.matchFixture,ls.getItem("token")).success(function(data) {
							$scope.matchesArr = data;
							console.log($scope.matches);
							$ionicLoading.hide();
						}).error(function(data) {
							console.log("gagal");
						});

					}else if($scope.matchFixture == 'third place'){
						$scope.matchFixture = 'semi final';

						CompetitionService.getMatchesByMatchFixture($stateParams.competitionId,$scope.matchFixture,ls.getItem("token")).success(function(data) {
							$scope.matchesArr = data;
							console.log($scope.matches);
							$ionicLoading.hide();
						}).error(function(data) {
							console.log("gagal");
						});
					}else if($scope.matchFixture == 'semi final'){
						$scope.matchFixture = 'play off';
						$scope.knockoutStatus = "false";
						$scope.fixtureNumber = $scope.lastFixture;
						CompetitionService.getMatchesByFixture($stateParams.competitionId,$scope.fixtureNumber,ls.getItem("token")).success(function(data) {
							$scope.matchesArr = data;
							console.log($scope.matches);
							$ionicLoading.hide();
						}).error(function(data) {
							console.log("gagal");
						});
					}
				}
			};
			// Group Stage

			// Knockout System
			$scope.knockoutNext = function(){
				$rootScope.showLoading($ionicLoading);
				if($scope.competition.comp_numOfTeam == 32){
					if($scope.matchFixture == 'play off'){
						$scope.matchFixture = 'round of 16';
						$scope.prevStatus = true;
						$scope.finishedMatchLength = 0;
						$scope.knockoutRoundCompletedStatus = false;
						CompetitionService.getMatchesByMatchFixture($stateParams.competitionId,$scope.matchFixture,ls.getItem("token")).success(function(data) {
							$scope.knockoutMatchesArr = data;
							console.log($scope.knockoutMatchesArr);

							for(var m = 0; m < $scope.knockoutMatchesArr.length; m++){
								$scope.knockoutMatchesArr[m].match_date = new Date($scope.knockoutMatchesArr[m].match_date);
								console.log($scope.knockoutMatchesArr[m].match_date);

								if($scope.knockoutMatchesArr[m].match_winner !== ''){
									console.log($scope.knockoutMatchesArr[m]);
									$scope.finishedMatchLength++;
								}

								if($scope.finishedMatchLength == $scope.knockoutMatchesArr.length){
									console.log("all matches is finished");
									$scope.knockoutRoundCompletedStatus = true;
								}else{
									console.log("the match is not finished yet");
								}
							}
							$ionicLoading.hide();
						}).error(function(data) {
							console.log("gagal");
						});
					}else if($scope.matchFixture == 'round of 16'){
						$scope.matchFixture = 'quarter final';
						$scope.finishedMatchLength = 0;
						$scope.knockoutRoundCompletedStatus = false;
						CompetitionService.getMatchesByMatchFixture($stateParams.competitionId,$scope.matchFixture,ls.getItem("token")).success(function(data) {
							$scope.knockoutMatchesArr = data;
							console.log($scope.knockoutMatchesArr);

							for(var m = 0; m < $scope.knockoutMatchesArr.length; m++){
								$scope.knockoutMatchesArr[m].match_date = new Date($scope.knockoutMatchesArr[m].match_date);
								console.log($scope.knockoutMatchesArr[m].match_date);

								if($scope.knockoutMatchesArr[m].match_winner !== ''){
									console.log($scope.knockoutMatchesArr[m]);
									$scope.finishedMatchLength++;
								}

								if($scope.finishedMatchLength == $scope.knockoutMatchesArr.length){
									console.log("all matches is finished");
									$scope.knockoutRoundCompletedStatus = true;
								}else{
									console.log("the match is not finished yet");
								}
							}
							$ionicLoading.hide();
						}).error(function(data) {
							console.log("gagal");
						});
					}else if($scope.matchFixture == 'quarter final'){
						$scope.matchFixture = 'semi final';
						$scope.finishedMatchLength = 0;
						$scope.knockoutRoundCompletedStatus = false;
						CompetitionService.getMatchesByMatchFixture($stateParams.competitionId,$scope.matchFixture,ls.getItem("token")).success(function(data) {
							$scope.knockoutMatchesArr = data;
							console.log($scope.knockoutMatchesArr);

							for(var m = 0; m < $scope.knockoutMatchesArr.length; m++){
								$scope.knockoutMatchesArr[m].match_date = new Date($scope.knockoutMatchesArr[m].match_date);
								console.log($scope.knockoutMatchesArr[m].match_date);

								if($scope.knockoutMatchesArr[m].match_winner !== ''){
									console.log($scope.knockoutMatchesArr[m]);
									$scope.finishedMatchLength++;
								}

								if($scope.finishedMatchLength == $scope.knockoutMatchesArr.length){
									console.log("all matches is finished");
									$scope.knockoutRoundCompletedStatus = true;
								}else{
									console.log("the match is not finished yet");
								}
							}
							$ionicLoading.hide();
						}).error(function(data) {
							console.log("gagal");
						});
					}else if($scope.matchFixture == 'semi final'){
						$scope.matchFixture = 'final';
						$scope.nextStatus = false;
						$scope.finishedMatchLength = 0;
						$scope.knockoutRoundCompletedStatus = false;
						CompetitionService.getMatchesByMatchFixture($stateParams.competitionId,$scope.matchFixture,ls.getItem("token")).success(function(data) {
							$scope.knockoutMatchesArr = data;
							console.log($scope.knockoutMatchesArr);

							for(var m = 0; m < $scope.knockoutMatchesArr.length; m++){
								$scope.knockoutMatchesArr[m].match_date = new Date($scope.knockoutMatchesArr[m].match_date);
								console.log($scope.knockoutMatchesArr[m].match_date);

								if($scope.knockoutMatchesArr[m].match_winner !== ''){
									console.log($scope.knockoutMatchesArr[m]);
									$scope.finishedMatchLength++;
								}

								if($scope.finishedMatchLength == $scope.knockoutMatchesArr.length){
									console.log("all matches is finished");
									$scope.knockoutRoundCompletedStatus = true;
								}else{
									console.log("the match is not finished yet");
								}
							}
							$ionicLoading.hide();
						}).error(function(data) {
							console.log("gagal");
						});
					}
				}else
				if($scope.competition.comp_numOfTeam == 16){
					if($scope.matchFixture == 'play off'){
						$scope.matchFixture = 'quarter final';
						$scope.prevStatus = true;
						$scope.finishedMatchLength = 0;
						$scope.knockoutRoundCompletedStatus = false;
						CompetitionService.getMatchesByMatchFixture($stateParams.competitionId,$scope.matchFixture,ls.getItem("token")).success(function(data) {
							$scope.knockoutMatchesArr = data;
							console.log($scope.knockoutMatchesArr);

							for(var m = 0; m < $scope.knockoutMatchesArr.length; m++){
								$scope.knockoutMatchesArr[m].match_date = new Date($scope.knockoutMatchesArr[m].match_date);
								console.log($scope.knockoutMatchesArr[m].match_date);

								if($scope.knockoutMatchesArr[m].match_winner !== ''){
									console.log($scope.knockoutMatchesArr[m]);
									$scope.finishedMatchLength++;
								}

								if($scope.finishedMatchLength == $scope.knockoutMatchesArr.length){
									console.log("all matches is finished");
									$scope.knockoutRoundCompletedStatus = true;
								}else{
									console.log("the match is not finished yet");
								}
							}
							$ionicLoading.hide();
						}).error(function(data) {
							console.log("gagal");
						});
					}else if($scope.matchFixture == 'quarter final'){
						$scope.matchFixture = 'semi final';
						$scope.finishedMatchLength = 0;
						$scope.knockoutRoundCompletedStatus = false;
						CompetitionService.getMatchesByMatchFixture($stateParams.competitionId,$scope.matchFixture,ls.getItem("token")).success(function(data) {
							$scope.knockoutMatchesArr = data;
							console.log($scope.knockoutMatchesArr);

							for(var m = 0; m < $scope.knockoutMatchesArr.length; m++){
								$scope.knockoutMatchesArr[m].match_date = new Date($scope.knockoutMatchesArr[m].match_date);
								console.log($scope.knockoutMatchesArr[m].match_date);

								if($scope.knockoutMatchesArr[m].match_winner !== ''){
									console.log($scope.knockoutMatchesArr[m]);
									$scope.finishedMatchLength++;
								}

								if($scope.finishedMatchLength == $scope.knockoutMatchesArr.length){
									console.log("all matches is finished");
									$scope.knockoutRoundCompletedStatus = true;
								}else{
									console.log("the match is not finished yet");
								}
							}
							$ionicLoading.hide();
						}).error(function(data) {
							console.log("gagal");
						});
					}else if($scope.matchFixture == 'semi final'){
						$scope.matchFixture = 'final';
						$scope.nextStatus = false;
						$scope.finishedMatchLength = 0;
						$scope.knockoutRoundCompletedStatus = false;
						CompetitionService.getMatchesByMatchFixture($stateParams.competitionId,$scope.matchFixture,ls.getItem("token")).success(function(data) {
							$scope.knockoutMatchesArr = data;
							console.log($scope.knockoutMatchesArr);

							for(var m = 0; m < $scope.knockoutMatchesArr.length; m++){
								$scope.knockoutMatchesArr[m].match_date = new Date($scope.knockoutMatchesArr[m].match_date);
								console.log($scope.knockoutMatchesArr[m].match_date);

								if($scope.knockoutMatchesArr[m].match_winner !== ''){
									console.log($scope.knockoutMatchesArr[m]);
									$scope.finishedMatchLength++;
								}

								if($scope.finishedMatchLength == $scope.knockoutMatchesArr.length){
									console.log("all matches is finished");
									$scope.knockoutRoundCompletedStatus = true;
								}else{
									console.log("the match is not finished yet");
								}
							}
							$ionicLoading.hide();
						}).error(function(data) {
							console.log("gagal");
						});
					}
				}else
				if($scope.competition.comp_numOfTeam == 8){
					if($scope.matchFixture == 'play off'){
						$scope.matchFixture = 'semi final';
						$scope.prevStatus = true;
						$scope.finishedMatchLength = 0;
						$scope.knockoutRoundCompletedStatus = false;
						CompetitionService.getMatchesByMatchFixture($stateParams.competitionId,$scope.matchFixture,ls.getItem("token")).success(function(data) {
							$scope.knockoutMatchesArr = data;
							console.log($scope.knockoutMatchesArr);

							for(var m = 0; m < $scope.knockoutMatchesArr.length; m++){
								$scope.knockoutMatchesArr[m].match_date = new Date($scope.knockoutMatchesArr[m].match_date);
								console.log($scope.knockoutMatchesArr[m].match_date);

								if($scope.knockoutMatchesArr[m].match_winner !== ''){
									console.log($scope.knockoutMatchesArr[m]);
									$scope.finishedMatchLength++;
								}

								if($scope.finishedMatchLength == $scope.knockoutMatchesArr.length){
									console.log("all matches is finished");
									$scope.knockoutRoundCompletedStatus = true;
								}else{
									console.log("the match is not finished yet");
								}
							}
							$ionicLoading.hide();
						}).error(function(data) {
							console.log("gagal");
						});
					}else if($scope.matchFixture == 'semi final'){
						$scope.matchFixture = 'final'
						$scope.nextStatus = false;
						$scope.finishedMatchLength = 0;
						$scope.knockoutRoundCompletedStatus = false;
						CompetitionService.getMatchesByMatchFixture($stateParams.competitionId,$scope.matchFixture,ls.getItem("token")).success(function(data) {
							$scope.knockoutMatchesArr = data;
							console.log($scope.knockoutMatchesArr);

							for(var m = 0; m < $scope.knockoutMatchesArr.length; m++){
								$scope.knockoutMatchesArr[m].match_date = new Date($scope.knockoutMatchesArr[m].match_date);
								console.log($scope.knockoutMatchesArr[m].match_date);

								if($scope.knockoutMatchesArr[m].match_winner !== ''){
									console.log($scope.knockoutMatchesArr[m]);
									$scope.finishedMatchLength++;
								}

								if($scope.finishedMatchLength == $scope.knockoutMatchesArr.length){
									console.log("all matches is finished");
									$scope.knockoutRoundCompletedStatus = true;
								}else{
									console.log("the match is not finished yet");
								}
							}
							$ionicLoading.hide();
						}).error(function(data) {
							console.log("gagal");
						});
					}
				}
				CompetitionService.getMatchesByMatchFixture($stateParams.competitionId,$scope.matchFixture,ls.getItem("token")).success(function(data) {
					$scope.knockoutMatchesArr = data;
					console.log($scope.knockoutMatchesArr);
					for(var m = 0; m < $scope.knockoutMatchesArr.length; m++){
						$scope.knockoutMatchesArr[m].match_date = new Date($scope.knockoutMatchesArr[m].match_date);
						console.log($scope.knockoutMatchesArr[m].match_date);
					}
					$ionicLoading.hide();
				}).error(function(data) {
					console.log("gagal");
				});
			};

			$scope.knockoutPrev = function(){
				$rootScope.showLoading($ionicLoading);
				if($scope.competition.comp_numOfTeam == 32){
					if($scope.matchFixture == 'final'){
						$scope.matchFixture = 'semi final';
						$scope.nextStatus = true;
						$scope.finishedMatchLength = 0;
						$scope.knockoutRoundCompletedStatus = false;
						CompetitionService.getMatchesByMatchFixture($stateParams.competitionId,$scope.matchFixture,ls.getItem("token")).success(function(data) {
							$scope.knockoutMatchesArr = data;
							console.log($scope.knockoutMatchesArr);

							for(var m = 0; m < $scope.knockoutMatchesArr.length; m++){
								$scope.knockoutMatchesArr[m].match_date = new Date($scope.knockoutMatchesArr[m].match_date);
								console.log($scope.knockoutMatchesArr[m].match_date);

								if($scope.knockoutMatchesArr[m].match_winner !== ''){
									console.log($scope.knockoutMatchesArr[m]);
									$scope.finishedMatchLength++;
								}

								if($scope.finishedMatchLength == $scope.knockoutMatchesArr.length){
									console.log("all matches is finished");
									$scope.knockoutRoundCompletedStatus = true;
								}else{
									console.log("the match is not finished yet");
								}
							}
							$ionicLoading.hide();
						}).error(function(data) {
							console.log("gagal");
						});
					}else if($scope.matchFixture == 'semi final'){
						$scope.matchFixture = 'quarter final';
						$scope.finishedMatchLength = 0;
						$scope.knockoutRoundCompletedStatus = false;
						CompetitionService.getMatchesByMatchFixture($stateParams.competitionId,$scope.matchFixture,ls.getItem("token")).success(function(data) {
							$scope.knockoutMatchesArr = data;
							console.log($scope.knockoutMatchesArr);

							for(var m = 0; m < $scope.knockoutMatchesArr.length; m++){
								$scope.knockoutMatchesArr[m].match_date = new Date($scope.knockoutMatchesArr[m].match_date);
								console.log($scope.knockoutMatchesArr[m].match_date);

								if($scope.knockoutMatchesArr[m].match_winner !== ''){
									console.log($scope.knockoutMatchesArr[m]);
									$scope.finishedMatchLength++;
								}

								if($scope.finishedMatchLength == $scope.knockoutMatchesArr.length){
									console.log("all matches is finished");
									$scope.knockoutRoundCompletedStatus = true;
								}else{
									console.log("the match is not finished yet");
								}
							}
							$ionicLoading.hide();
						}).error(function(data) {
							console.log("gagal");
						});
					}else if($scope.matchFixture == 'quarter final'){
						$scope.matchFixture = 'round of 16';
						$scope.finishedMatchLength = 0;
						$scope.knockoutRoundCompletedStatus = false;
						CompetitionService.getMatchesByMatchFixture($stateParams.competitionId,$scope.matchFixture,ls.getItem("token")).success(function(data) {
							$scope.knockoutMatchesArr = data;
							console.log($scope.knockoutMatchesArr);

							for(var m = 0; m < $scope.knockoutMatchesArr.length; m++){
								$scope.knockoutMatchesArr[m].match_date = new Date($scope.knockoutMatchesArr[m].match_date);
								console.log($scope.knockoutMatchesArr[m].match_date);

								if($scope.knockoutMatchesArr[m].match_winner !== ''){
									console.log($scope.knockoutMatchesArr[m]);
									$scope.finishedMatchLength++;
								}

								if($scope.finishedMatchLength == $scope.knockoutMatchesArr.length){
									console.log("all matches is finished");
									$scope.knockoutRoundCompletedStatus = true;
								}else{
									console.log("the match is not finished yet");
								}
							}
							$ionicLoading.hide();
						}).error(function(data) {
							console.log("gagal");
						});
					}else if($scope.matchFixture == 'round of 16'){
						$scope.matchFixture = 'play off';
						$scope.prevStatus = false;
						$scope.finishedMatchLength = 0;
						$scope.knockoutRoundCompletedStatus = false;
						CompetitionService.getMatchesByMatchFixture($stateParams.competitionId,$scope.matchFixture,ls.getItem("token")).success(function(data) {
							$scope.knockoutMatchesArr = data;
							console.log($scope.knockoutMatchesArr);

							for(var m = 0; m < $scope.knockoutMatchesArr.length; m++){
								$scope.knockoutMatchesArr[m].match_date = new Date($scope.knockoutMatchesArr[m].match_date);
								console.log($scope.knockoutMatchesArr[m].match_date);

								if($scope.knockoutMatchesArr[m].match_winner !== ''){
									console.log($scope.knockoutMatchesArr[m]);
									$scope.finishedMatchLength++;
								}

								if($scope.finishedMatchLength == $scope.knockoutMatchesArr.length){
									console.log("all matches is finished");
									$scope.knockoutRoundCompletedStatus = true;
								}else{
									console.log("the match is not finished yet");
								}
							}
							$ionicLoading.hide();
						}).error(function(data) {
							console.log("gagal");
						});
					}
				}else
				if($scope.competition.comp_numOfTeam == 16){
					if($scope.matchFixture == 'final'){
						$scope.matchFixture = 'semi final';
						$scope.nextStatus = true;
						$scope.finishedMatchLength = 0;
						$scope.knockoutRoundCompletedStatus = false;
						CompetitionService.getMatchesByMatchFixture($stateParams.competitionId,$scope.matchFixture,ls.getItem("token")).success(function(data) {
							$scope.knockoutMatchesArr = data;
							console.log($scope.knockoutMatchesArr);

							for(var m = 0; m < $scope.knockoutMatchesArr.length; m++){
								$scope.knockoutMatchesArr[m].match_date = new Date($scope.knockoutMatchesArr[m].match_date);
								console.log($scope.knockoutMatchesArr[m].match_date);

								if($scope.knockoutMatchesArr[m].match_winner !== ''){
									console.log($scope.knockoutMatchesArr[m]);
									$scope.finishedMatchLength++;
								}

								if($scope.finishedMatchLength == $scope.knockoutMatchesArr.length){
									console.log("all matches is finished");
									$scope.knockoutRoundCompletedStatus = true;
								}else{
									console.log("the match is not finished yet");
								}
							}
							$ionicLoading.hide();
						}).error(function(data) {
							console.log("gagal");
						});
					}else if($scope.matchFixture == 'semi final'){
						$scope.matchFixture = 'quarter final';
						$scope.finishedMatchLength = 0;
						$scope.knockoutRoundCompletedStatus = false;
						CompetitionService.getMatchesByMatchFixture($stateParams.competitionId,$scope.matchFixture,ls.getItem("token")).success(function(data) {
							$scope.knockoutMatchesArr = data;
							console.log($scope.knockoutMatchesArr);

							for(var m = 0; m < $scope.knockoutMatchesArr.length; m++){
								$scope.knockoutMatchesArr[m].match_date = new Date($scope.knockoutMatchesArr[m].match_date);
								console.log($scope.knockoutMatchesArr[m].match_date);

								if($scope.knockoutMatchesArr[m].match_winner !== ''){
									console.log($scope.knockoutMatchesArr[m]);
									$scope.finishedMatchLength++;
								}

								if($scope.finishedMatchLength == $scope.knockoutMatchesArr.length){
									console.log("all matches is finished");
									$scope.knockoutRoundCompletedStatus = true;
								}else{
									console.log("the match is not finished yet");
								}
							}
							$ionicLoading.hide();
						}).error(function(data) {
							console.log("gagal");
						});
					}else if($scope.matchFixture == 'quarter final'){
						$scope.matchFixture = 'play off';
						$scope.prevStatus = false;
						$scope.finishedMatchLength = 0;
						$scope.knockoutRoundCompletedStatus = false;
						CompetitionService.getMatchesByMatchFixture($stateParams.competitionId,$scope.matchFixture,ls.getItem("token")).success(function(data) {
							$scope.knockoutMatchesArr = data;
							console.log($scope.knockoutMatchesArr);

							for(var m = 0; m < $scope.knockoutMatchesArr.length; m++){
								$scope.knockoutMatchesArr[m].match_date = new Date($scope.knockoutMatchesArr[m].match_date);
								console.log($scope.knockoutMatchesArr[m].match_date);

								if($scope.knockoutMatchesArr[m].match_winner !== ''){
									console.log($scope.knockoutMatchesArr[m]);
									$scope.finishedMatchLength++;
								}

								if($scope.finishedMatchLength == $scope.knockoutMatchesArr.length){
									console.log("all matches is finished");
									$scope.knockoutRoundCompletedStatus = true;
								}else{
									console.log("the match is not finished yet");
								}
							}
							$ionicLoading.hide();
						}).error(function(data) {
							console.log("gagal");
						});
					}
				}
				if($scope.competition.comp_numOfTeam == 8){
					if($scope.matchFixture == 'final'){
						$scope.matchFixture = 'semi final';
						$scope.nextStatus = true;
						$scope.finishedMatchLength = 0;
						$scope.knockoutRoundCompletedStatus = false;
						CompetitionService.getMatchesByMatchFixture($stateParams.competitionId,$scope.matchFixture,ls.getItem("token")).success(function(data) {
							$scope.knockoutMatchesArr = data;
							console.log($scope.knockoutMatchesArr);

							for(var m = 0; m < $scope.knockoutMatchesArr.length; m++){
								$scope.knockoutMatchesArr[m].match_date = new Date($scope.knockoutMatchesArr[m].match_date);
								console.log($scope.knockoutMatchesArr[m].match_date);

								if($scope.knockoutMatchesArr[m].match_winner !== ''){
									console.log($scope.knockoutMatchesArr[m]);
									$scope.finishedMatchLength++;
								}

								if($scope.finishedMatchLength == $scope.knockoutMatchesArr.length){
									console.log("all matches is finished");
									$scope.knockoutRoundCompletedStatus = true;
								}else{
									console.log("the match is not finished yet");
								}
							}
							$ionicLoading.hide();
						}).error(function(data) {
							console.log("gagal");
						});
					}else if($scope.matchFixture == 'semi final'){
						$scope.matchFixture = 'play off';
						$scope.prevStatus = false;
						$scope.finishedMatchLength = 0;
						$scope.knockoutRoundCompletedStatus = false;
						CompetitionService.getMatchesByMatchFixture($stateParams.competitionId,$scope.matchFixture,ls.getItem("token")).success(function(data) {
							$scope.knockoutMatchesArr = data;
							console.log($scope.knockoutMatchesArr);

							for(var m = 0; m < $scope.knockoutMatchesArr.length; m++){
								$scope.knockoutMatchesArr[m].match_date = new Date($scope.knockoutMatchesArr[m].match_date);
								console.log($scope.knockoutMatchesArr[m].match_date);

								if($scope.knockoutMatchesArr[m].match_winner !== ''){
									console.log($scope.knockoutMatchesArr[m]);
									$scope.finishedMatchLength++;
								}

								if($scope.finishedMatchLength == $scope.knockoutMatchesArr.length){
									console.log("all matches is finished");
									$scope.knockoutRoundCompletedStatus = true;
								}else{
									console.log("the match is not finished yet");
								}
							}
							$ionicLoading.hide();
						}).error(function(data) {
							console.log("gagal");
						});
					}
				}
				CompetitionService.getMatchesByMatchFixture($stateParams.competitionId,$scope.matchFixture,ls.getItem("token")).success(function(data) {
					$scope.knockoutMatchesArr = data;
					console.log($scope.knockoutMatchesArr);
					for(var m = 0; m < $scope.knockoutMatchesArr.length; m++){
						$scope.knockoutMatchesArr[m].match_date = new Date($scope.knockoutMatchesArr[m].match_date);
						console.log($scope.knockoutMatchesArr[m].match_date);
					}
					$ionicLoading.hide();
				}).error(function(data) {
					console.log("gagal");
				});
			};
			// Knockout System

			// // Combination System 
			// $scope.combinationNext = function(){
			// 	$rootScope.showLoading($ionicLoading);
			// 	if($scope.competition.comp_numOfTeam == 32){
			// 		if($scope.match_status == 'Play Off'){
			// 			$scope.match_status = 'Eighth Final';
			// 			$scope.prevStatus = true;
			// 		}else if($scope.match_status == 'Eighth Final'){
			// 			$scope.match_status = 'quarter final';
			// 		}else if($scope.match_status == 'Quarter Final'){
			// 			$scope.match_status = 'Semi Final';
			// 		}else if($scope.match_status == 'Semi Final'){
			// 			$scope.match_status = 'Final';
			// 			$scope.nextStatus = false;
			// 		}
			// 	}else
			// 	if($scope.competition.comp_numOfTeam == 16){
			// 		if($scope.match_status == 'Play Off'){
			// 			$scope.match_status = 'Quarter Final';
			// 			$scope.prevStatus = true;
			// 		}else if($scope.match_status == 'Quarter Final'){
			// 			$scope.match_status = 'Semi Final';
			// 		}else if($scope.match_status == 'Semi Final'){
			// 			$scope.match_status = 'Final';
			// 			$scope.nextStatus = false;
			// 		}
			// 	}else
			// 	if($scope.competition.comp_numOfTeam == 8){
			// 		if($scope.match_status == 'Play Off'){
			// 			$scope.match_status = 'Semi Final';
			// 			$scope.prevStatus = true;
			// 		}else if($scope.match_status == 'Semi Final'){
			// 			$scope.match_status = 'Final'
			// 			$scope.nextStatus = false;
			// 		}
			// 	}
			// 	CompetitionService.getMatchesByMatchStatus($stateParams.competitionId,$scope.match_status,ls.getItem("token")).success(function(data) {
			// 		$scope.knockoutMatches = data;
			// 		$scope.kmLength = $scope.knockoutMatches.length;
			// 		console.log($scope.kmLength);
			// 		for(var m = 0; m < $scope.knockoutMatches.length; m++){
			// 			$scope.knockoutMatches[m].match_date = new Date($scope.knockoutMatches[m].match_date);
			// 			console.log($scope.knockoutMatches[m].match_date);
			// 		}
			// 		$ionicLoading.hide();
			// 	}).error(function(data) {
			// 		console.log("gagal");
			// 	});
			// };
			// $scope.combinationPrev = function(){
			// 	$rootScope.showLoading($ionicLoading);
			// 	if($scope.competition.comp_numOfTeam == 32){
			// 		if($scope.match_status == 'Final'){
			// 			$scope.match_status = 'Semi Final';
			// 			$scope.nextStatus = true;
			// 		}else if($scope.match_status == 'Semi Final'){
			// 			$scope.match_status = 'Quarter Final';
			// 		}else if($scope.match_status == 'Quarter Final'){
			// 			$scope.match_status = 'Eighth Final';
			// 		}else if($scope.match_status == 'Eighth Final'){
			// 			$scope.match_status = 'Play Off';
			// 			$scope.prevStatus = false;
			// 		}
			// 	}else
			// 	if($scope.competition.comp_numOfTeam == 16){
			// 		if($scope.match_status == 'Final'){
			// 			$scope.match_status = 'Semi Final';
			// 			$scope.nextStatus = true;
			// 		}else if($scope.match_status == 'Semi Final'){
			// 			$scope.match_status = 'Quarter Final';
			// 		}else if($scope.match_status == 'Quarter Final'){
			// 			$scope.match_status = 'Play Off';
			// 			$scope.prevStatus = false;
			// 		}
			// 	}
			// 	if($scope.competition.comp_numOfTeam == 8){
			// 		if($scope.match_status == 'Final'){
			// 			$scope.match_status = 'Semi Final';
			// 			$scope.nextStatus = true;
			// 		}else if($scope.match_status == 'Semi Final'){
			// 			$scope.match_status = 'Play Off';
			// 			$scope.prevStatus = false;
			// 		}
			// 	}
			// 	CompetitionService.getMatchesByMatchStatus($stateParams.competitionId,$scope.match_status,ls.getItem("token")).success(function(data) {
			// 		$scope.knockoutMatches = data;
			// 		console.log($scope.knockoutMatches);
			// 		$scope.kmLength = $scope.knockoutMatches.length;
			// 		console.log($scope.kmLength);
			// 		for(var m = 0; m < $scope.knockoutMatches.length; m++){
			// 			$scope.knockoutMatches[m].match_date = new Date($scope.knockoutMatches[m].match_date);
			// 			console.log($scope.knockoutMatches[m].match_date);
			// 		}
			// 		$ionicLoading.hide();
			// 	}).error(function(data) {
			// 		console.log("gagal");
			// 	});
			// };
			// Combination system
		}).error(function(data) {});
	});
	
	$scope.completedMatchesArr = [];
	$scope.winnerTeamId = [];
	$scope.drawTeamId = [];
	$scope.loserTeamId = [];
	$scope.winnerTeamArr = [];
	$scope.loserTeamArr = [];
	$scope.drawTeamArr = [];

	$scope.back = function(){
		if(localStorage.getItem("backStatus") == 'home'){
			$state.go('app.home');
		}else{
			$state.go('app.schedule');
		}
		
	}
	$scope.editMatch = function(matchId,compId) { 
		console.log(matchId);
		console.log(compId);
		localStorage.setItem("compIdForEditMatch", compId);
		$state.go('app.edit_match', {
			'matchId': matchId
		});
	};
})

.controller('MatchCtrl', function($scope, $rootScope, $state, $stateParams, $ionicPopup, $ionicPlatform, $ionicLoading, CompetitionService, MatchService) {
	//implement logic here
	$rootScope.showLoading($ionicLoading);
	$scope.matchData = {};
	$scope.currentMatchData = {};
	var timeArr = ["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00"];
	var fieldArr = [1,2,3];

	// Retrieve the object from storage
	var avMonRefObj = localStorage.getItem('avMonRef');
	var avMonRefObjData = JSON.parse(avMonRefObj);
	var avMonAnalystObj = localStorage.getItem('avMonAnalysts');
	var avMonAnalystObjData = JSON.parse(avMonAnalystObj);

	var avTueRefObj = localStorage.getItem('avTueRef');
	var avTueRefObjData = JSON.parse(avTueRefObj);
	var avTueAnalystObj = localStorage.getItem('avTueAnalysts');
	var avTueAnalystObjData = JSON.parse(avTueAnalystObj);

	var avWedRefObj = localStorage.getItem('avWedRef');
	var avWedRefObjData = JSON.parse(avWedRefObj);
	var avWedAnalystObj = localStorage.getItem('avWedAnalysts');
	var avWedAnalystObjData = JSON.parse(avWedAnalystObj);

	var avThuRefObj = localStorage.getItem('avThuRef');
	var avThuRefObjData = JSON.parse(avThuRefObj);
	var avThuAnalystObj = localStorage.getItem('avThuAnalysts');
	var avThuAnalystObjData = JSON.parse(avThuAnalystObj);

	var avFriRefObj = localStorage.getItem('avFriRef');
	var avFriRefObjData = JSON.parse(avFriRefObj);
	var avFriAnalystObj = localStorage.getItem('avFriAnalysts');
	var avFriAnalystObjData = JSON.parse(avFriAnalystObj);

	var avSatRefObj = localStorage.getItem('avSatRef');
	var avSatRefObjData = JSON.parse(avSatRefObj);
	var avSatAnalystObj = localStorage.getItem('avSatAnalysts');
	var avSatAnalystObjData = JSON.parse(avSatAnalystObj);

	var avSunRefObj = localStorage.getItem('avSunRef');
	var avSunRefObjData = JSON.parse(avSunRefObj);
	var avSunAnalystObj = localStorage.getItem('avSunAnalysts');
	var avSunAnalystObjData = JSON.parse(avSunAnalystObj);

	MatchService.getMatchById($stateParams.matchId).success(function(data){
		$scope.currentMatchData = data;
		console.log($scope.currentMatchData);

		CompetitionService.getCompetitionById(data.competition_id).success(function(comp) {
			var startDate = moment(comp.comp_start).add(1, 'days').format('YYYY-MM-DD');
			var counter = moment().diff(startDate, 'days');

			console.log(counter);
			if(counter > 0){
				$scope.minDate = moment().format('YYYY-MM-DD');
			}else{
				$scope.minDate = moment(comp.comp_start).format('YYYY-MM-DD');
			}

			$scope.maxDate = moment(comp.comp_finish).add(1, 'days').format('YYYY-MM-DD');
		}).error(function(data) {
			$ionicLoading.hide();
		});

		$scope.availableTimeArr = {};
		$scope.availableFieldArr = {};
		var matchDate = moment(data.match_date).toISOString();

		CompetitionService.getMatchesByCompetitionAndDate(data.competition_id, matchDate).success(function(match) {
			console.log(match);
			match.forEach(function(m){
				if(timeArr.indexOf(m.match_time) !== -1){
					var timeIndex = timeArr.indexOf(m.match_time);
					timeArr.splice(timeIndex,1);
				}
				if(fieldArr.indexOf(m.match_field) !== -1){
					var fieldIndex = fieldArr.indexOf(m.match_field);
					fieldArr.splice(fieldIndex,1);
				}
			});
			$ionicLoading.hide();
			$scope.availableTimeArr = timeArr;
			$scope.availableFieldArr = fieldArr;
		}).error(function(data) {
			$ionicLoading.hide();
		});


		$scope.changeDate = function(date){
			console.log(date);
			$scope.availableTimeArr = {};
			$scope.availableFieldArr = {};
			var matchDate = moment(date).toISOString();
			$rootScope.showLoading($ionicLoading);

			CompetitionService.getMatchesByCompetitionAndDate(data.competition_id, matchDate).success(function(match) {
				console.log(match);
				match.forEach(function(m){
					if(timeArr.indexOf(m.match_time) !== -1){
						var timeIndex = timeArr.indexOf(m.match_time);
						timeArr.splice(timeIndex,1);
					}
					if(fieldArr.indexOf(m.match_field) !== -1){
						var fieldIndex = fieldArr.indexOf(m.match_field);
						fieldArr.splice(fieldIndex,1);
					}
				});
				$ionicLoading.hide();
				$scope.availableTimeArr = timeArr;
				$scope.availableFieldArr = fieldArr;
			}).error(function(data) {});
		}
		
	}).error(function(data){
		$ionicLoading.hide();
	});


	$scope.editMatchById = function() {

		console.log($scope.matchData);
		console.log($scope.currentMatchData);

		if ($scope.matchData.match_date === undefined && $scope.matchData.match_time === undefined && $scope.matchData.match_field === undefined) {
			$rootScope.showPopup($ionicPopup,'Edit Match failed!','Please fill all the fields', 'popup-error');
		} else if ($scope.matchData.match_date === undefined || $scope.matchData.match_date === "" || $scope.matchData.match_date === null) {
			$rootScope.showPopup($ionicPopup,'Edit Match failed!','Match date is required !', 'popup-error');
		} else if ($scope.matchData.match_time === undefined || $scope.matchData.match_time === "" || $scope.matchData.match_time === null) {
			$rootScope.showPopup($ionicPopup,'Edit Match failed!','Match time is required !', 'popup-error');
		} else if ($scope.matchData.match_field === undefined || $scope.matchData.match_field === "" || $scope.matchData.match_field === null) {
			$rootScope.showPopup($ionicPopup,'Edit Match failed!','Match field is required !', 'popup-error');
		} else if ($scope.matchData.match_date !== null && $scope.matchData.match_time !== null && $scope.matchData.match_field !== null) {


			var timeIndex = timeArr.indexOf($scope.matchData.match_time);
			var fieldIndex = fieldArr.indexOf($scope.matchData.match_field);

			if(moment($scope.matchData.match_date).format('dddd') === 'Monday'){	
				$scope.matchData.match_referee = avMonRefObjData[timeIndex][fieldIndex];
				$scope.matchData.match_analyst = avMonAnalystObjData[timeIndex][fieldIndex];
			}else if(moment($scope.matchData.match_date).format('dddd') === 'Tuesday'){
				$scope.matchData.match_referee = avTueRefObjData[timeIndex][fieldIndex];
				$scope.matchData.match_analyst = avTueAnalystObjData[timeIndex][fieldIndex];
			}else if(moment($scope.matchData.match_date).format('dddd') === 'Wednesday'){
				$scope.matchData.match_referee = avWedRefObjData[timeIndex][fieldIndex];
				$scope.matchData.match_analyst = avWedAnalystObjData[timeIndex][fieldIndex];
			}else if(moment($scope.matchData.match_date).format('dddd') === 'Thursday'){
				$scope.matchData.match_referee = avThuRefObjData[timeIndex][fieldIndex];
				$scope.matchData.match_analyst = avThuAnalystObjData[timeIndex][fieldIndex];
			}else if(moment($scope.matchData.match_date).format('dddd') === 'Friday'){
				$scope.matchData.match_referee = avFriRefObjData[timeIndex][fieldIndex];
				$scope.matchData.match_analyst = avFriAnalystObjData[timeIndex][fieldIndex];
			}else if(moment($scope.matchData.match_date).format('dddd') === 'Saturday'){
				$scope.matchData.match_referee = avSatRefObjData[timeIndex][fieldIndex];
				$scope.matchData.match_analyst = avSatAnalystObjData[timeIndex][fieldIndex];
			}else if(moment($scope.matchData.match_date).format('dddd') === 'Sunday'){
				$scope.matchData.match_referee = avSunRefObjData[timeIndex][fieldIndex];
				$scope.matchData.match_analyst = avSunAnalystObjData[timeIndex][fieldIndex];
			}

			$scope.currentMatchData.match_date = moment($scope.matchData.match_date).toISOString();
			$scope.currentMatchData.match_time = $scope.matchData.match_time;
			$scope.currentMatchData.match_field = $scope.matchData.match_field;
			$scope.currentMatchData.match_referee = $scope.matchData.match_referee.username;
			$scope.currentMatchData.match_analyst = $scope.matchData.match_analyst.username;


			console.log($scope.currentMatchData);
			MatchService.editMatchById($stateParams.matchId,$scope.currentMatchData).success(function(data) {
				$ionicLoading.hide();
				console.log(data);
				var alertPopup = $ionicPopup.alert({
					title: 'Success!',
					template: 'Berhasil Edit Jadwal Pertandingan'
				});
				$state.go('app.competition_schedule', {
					'competitionId': localStorage.getItem("compIdForEditMatch")
				});
			}).error(function(data) {
				$ionicLoading.hide();
				var alertPopup = $ionicPopup.alert({
					title: 'Failed!',
					template: 'Gagal Edit Jadwal Pertandingan'
				});
			});
		}
	};

	$scope.backToCompetitionSchedule = function() { 
		$state.go('app.competition_schedule', {
			'competitionId': localStorage.getItem("compIdForEditMatch")
		});
	};
})

.controller('ClassementCtrl', function($scope, $state,  $stateParams, $ionicPopup, $ionicPlatform, $ionicLoading, CompetitionService, MatchService) {
	//implement logic here
	$scope.goToClassementDetail = function() { 
		$state.go('app.classement_detail');
	};
})

.controller('ClassementDetailCtrl', function($scope, $state,  $stateParams, $ionicPopup, $ionicPlatform, $ionicLoading, CompetitionService, MatchService) {
	//implement logic here
	$scope.backToClassement = function() { // kembali ke halaman home
		$state.go('app.classement');
	};
	$scope.goToTeamInfo = function() { // kembali ke halaman home
		$state.go('app.team_info');
	};
})

.controller('TrainingCtrl', function($scope, $state,  $stateParams, $rootScope, $ionicPopup, $ionicPlatform, $ionicLoading, TeamService, TrainingService) {
	// implement logic here
	$scope.trainingData = {};
	$scope.trainingData.id = "T" + $rootScope.randomString;
	$scope.trainingData.coach = localStorage.getItem("username")
	$scope.trainingData.team_id = localStorage.getItem("myTeamId");
	$scope.trainingData.team_name = localStorage.getItem("team");
	$scope.trainingData.coming = "";
	$scope.trainingData.not_coming = "";

	$scope.teamSquadObj = {};
	$scope.teamSquadArr = [];
	TeamService.getTeamSquad($scope.menuProfile.team).success(function(data){
		$scope.teamSquadObj = data;
		console.log($scope.teamSquadObj);
		for(var i = 0; i < $scope.teamSquadObj.length; i++){
			if($scope.teamSquadObj[i].role === 'Player'){
				console.log("player");	
				$scope.teamSquadArr.push($scope.teamSquadObj[i].username);
			}
		}
		console.log($scope.teamSquadArr.length);
		$scope.trainingData.unconfirmed = $scope.teamSquadArr;
	}).error(function(data) {});


	$scope.createTraining = function(){
		TrainingService.addTraining($scope.trainingData).success(function(data) {
			$ionicLoading.hide();
			var alertPopup = $ionicPopup.alert({
				title: 'Success!',
				template: 'Berhasil membuat jadwal latihan'
			});
			$state.go('app.my_team');
		}).error(function(data) {
			$ionicLoading.hide();
			var alertPopup = $ionicPopup.alert({
				title: 'Post Data Failed!',
				template: 'Gagal Membuat jadwal latihan'
			});
		});
	};
	$scope.backToMyTeam = function(){
		$state.go('app.my_team');
	};
})

// done
.filter('kDateAddFromDateISO8601', [function() {
  return function(isoDateString, days, teams) {

    var date;
    var fixture;
    var numOfDays;
    var counter;
    var numOfBreak;
   
    days = days || 0;
    teams = teams || 0;
  
    date = new Date(isoDateString);

    fixture = teams - 1;
    numOfBreak = (teams - 2) * days;

    if(days === 'no break'){
	 	numOfDays = fixture - 1;
    }else{
    	numOfDays = (fixture + numOfBreak) - 1;
    }
   
    if (days) {
      date.setDate(date.getDate() + numOfDays);
    }
    
    return date;
  };
}])

.filter('addEndDate', [function() {
  return function(isoDateString, days) {

  	var date;
  	var numOfDays = days - 1;

  	date = new Date(isoDateString);
  	date.setDate(date.getDate() + numOfDays);

    return date;
  };
}]);
