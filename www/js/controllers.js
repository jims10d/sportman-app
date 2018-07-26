angular.module('starter.controllers', ['ngCordova', 'ionic', 'ngMap', 'luegg.directives', 'cleave.js'])

.controller('LoginCtrl', function($scope, ionicMaterialInk, $window, LoginService, $ionicPopup, $ionicLoading, $state, $rootScope) {
	
	var ls = localStorage;
	$scope.data = {}; // Declare variabel utk menyimpan data input dari user pada saat login

	// $ionicLoading.hide();
	// ionicMaterialInk.displayEffect();
	$ionicLoading.hide();
	$scope.login = function() { // Fungsi login
	// utk menampilkan efek loading pada saat app dibuka
	// $rootScope.showLoading($ionicLoading);

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
			console.log(data);
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
					$state.go('app.home');
					// $ionicLoading.hide();
				}else if($scope.profile.role === "Player"){
					if($scope.profile.profileCompleted === "" || $scope.profile.profileCompleted === null){
						$scope.profileCompleted = false;
						console.log("profile completed false");
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
			console.log(data);
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
		$scope.ktpArr = ["1029394923924","12345678910","1022392423498","","5239395923924","2320304923924"];
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
		$scope.ktpArr = ["1029394923924","1022392423498","","5239395923924","2320304923924"];
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

	$scope.registerReferee = function() {
		$scope.userData = localStorage.getItem('userData');
		$scope.userDataParse = JSON.parse($scope.userData);
		$scope.userDataParse.availableDayAndTime = {};
		
		if($scope.monday !== {}){
			$scope.userDataParse.availableDayAndTime.monday = Object.keys($scope.monday);
		}
		if($scope.tuesday !== {}){
			$scope.userDataParse.availableDayAndTime.tuesday = Object.keys($scope.tuesday);
		}
		if($scope.wednesday !== {}){
			$scope.userDataParse.availableDayAndTime.wednesday = Object.keys($scope.wednesday);
		}
		if($scope.thursday !== {}){
			$scope.userDataParse.availableDayAndTime.thursday = Object.keys($scope.thursday);
		}
		if($scope.friday !== {}){
			$scope.userDataParse.availableDayAndTime.friday = Object.keys($scope.friday);
		}
		if($scope.saturday !== {}){
			$scope.userDataParse.availableDayAndTime.saturday = Object.keys($scope.saturday);
		}
		if($scope.sunday !== {}){
			$scope.userDataParse.availableDayAndTime.sunday = Object.keys($scope.sunday);
		}

		console.log($scope.userDataParse);

		RegisterService.tambahUser($scope.userDataParse).success(function(data) {
			$ionicLoading.hide();
			$rootScope.showPopup($ionicPopup,'Success!','Berhasil register', 'popup-success');
			ls.removeItem("userData");
			$state.go('login');
		}).error(function(data) {
			$rootScope.showPopup($ionicPopup,'Post Data Failed!','Gagal register, username sudah ada', 'popup-error');
		});
	};

})

.controller('MainCtrl', function($scope, $ionicPopup, $ionicTabsDelegate, $ionicLoading, $ionicPopover, $state, LoginService, ProfileService, TeamService, $rootScope) {
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
				if(data.team !== ""){
					ls.setItem("team", data.team);
				}

				if(ls.getItem("role")==='Player' || ls.getItem("role")==='Coach' || ls.getItem("role")==='Manager'){
					if(data.team !== ""){
						
						TeamService.getTeamByName(data.team).success(function(data){
							
							$scope.myTeam = data;
							ls.setItem("myTeamId", $scope.myTeam.id);
							ls.setItem("myCompetitionId", $scope.myTeam.competitionId);

							if($scope.myTeam.team_coach !== null){
								ls.setItem("myTeamCoach", $scope.myTeam.team_coach);
							}
							
							if($scope.myTeam.team_squad !== null){
								ls.setItem("myTeamSquad", $scope.myTeam.team_squad);
							}
							
						}).error(function(data) {});
					}			
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
		$scope.logout = function() { // fungsi utk logout
			ls.removeItem("userid"); // menghapus data user id
			ls.removeItem("token"); // menghapus data token
			ls.removeItem("compName"); // menghapus data user id
			ls.removeItem("compId"); // menghapus data token
			ls.removeItem("fixId"); // menghapus data user id
			ls.removeItem("role"); // menghapus data user id
			ls.removeItem("team"); // menghapus data user id
			ls.removeItem("myTeamId"); // menghapus data user id
			ls.removeItem("username"); // menghapus data user id
			ls.removeItem("myCompetitionId"); // menghapus data user id
			ls.removeItem("myTeamCoach");
			ls.removeItem("myTeamSquad");
			ls.removeItem("firstRoundMatchesStatus"); // menghapus data user id
			ls.removeItem("secondRoundMatchesStatus");
			ls.removeItem("thirdRoundMatchesStatus");
			ls.removeItem("knockoutSchedulingStat");
			$scope.isOrganizer = false;
			$state.go('login'); // menampilkan halaman login
		};
})

.controller('HomeCtrl', function($scope, $compile, $state, $stateParams, $rootScope, $ionicPopup, $ionicPlatform, $ionicLoading, ClassementService, TeamService, CompetitionService, MatchService, PostService, $cordovaSocialSharing, $window, $ionicModal) {
		
	var ls = localStorage;
	$rootScope.showLoading();

	// for closing the complete profile card
	$scope.closeDiv = function() {
	    var x = document.getElementById("profileDiv");
	    if (x.style.display === "none") {
	        x.style.display = "block";
	    } else {
	        x.style.display = "none";
	    }
	};

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
				$scope.competition = {};
				$scope.competition = data;
				// $ionicLoading.hide();
				
				// check if there are any competition created by the organizer
				$scope.hasCompetition = "";
				if ($scope.competition.length !== 0) { $scope.hasCompetition = true; } 
				else { $scope.hasCompetition = false; }


				$scope.rteamLength = []; // the number of registered team
				data.forEach(function(entry){
					// check if the registered team is not null
					if(entry.registeredTeam !== null){	
						$scope.registerArr = entry.registeredTeam.split(',');
						$scope.rteamLength[entry.id] = $scope.registerArr.length;

						if(entry.schedule_status === 'On Queue' && $scope.registerArr.length === entry.comp_numOfTeam){
							console.log("do the scheduling");
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
										console.log($scope.classementForm);
										
										$scope.classementArr.push($scope.classementForm);
									},5000);
								});

								setTimeout(function(){
									console.log($scope.classementArr);

									$scope.classementArr.forEach(function(classement){
										addClassementDelay(classement);
									});

									function addClassementDelay(classement){
										setTimeout(function(){
											//insert data to database
											ClassementService.addClassement(classement).success(function(data){
												// $ionicLoading.hide();
												console.log("create classement");
												console.log(data);
											}).error(function(data){
												// $ionicLoading.hide();
											});
											//insert data to database
										},15000);
									}
								},6000);
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
									console.log($scope.registerArrLength);
									for(p = 0; p < $scope.registerArrLength; p++){
										fixtureNumber++;
										
										$scope.fixture[p] = [];
										for(u = 0; u < $scope.matchPerDay; u++){
											$scope.fixtureObj[u].fixture_number = fixtureNumber;
											$scope.fixtureObj[u].competition_id = entry.id;
											$scope.fixture[p].push($scope.fixtureObj[u]);
										}
										$scope.fixtureObj.splice(0,$scope.matchPerDay);
										console.log($scope.fixture[p]);
									
										// check if the schedule status is on queue
										if(entry.schedule_status === 'On Queue'){
										// 	if true save the data to database
											console.log("save data to database");

											$scope.savedEntryArr = [];
											$scope.fixture[p].forEach(function(entry){
												addMatchDelay(entry);
											});

										// 	set timer to addMatch function to minimize the number of request per second to prevent failed request
											function addMatchDelay(entry){
												setTimeout(function(){
													//insert data to database
													MatchService.addMatch(entry).success(function(data){
														// $ionicLoading.hide();
														console.log("add match");
														console.log(data);
													}).error(function(data){
														// $ionicLoading.hide();
													});
													//insert data to database
												},15000);
											}
										}											
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
											}).error(function(data) {
												// $ionicLoading.hide();
												console.log("gagal");
											});
										}	
									},20000);
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

								if(localStorage.getItem("knockoutSchedulingStat") === 'On Progress'){
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
								        $scope.matchArr[2].match_homeTeam = $scope.registerArr[2];
								        $scope.matchArr[2].match_awayTeam = $scope.registerArr[3];
								        $scope.matchArr[2].match_pair = i;
								       
								        $scope.matchesArr.push($scope.matchArr[1]);
								        $scope.matchesArr.push($scope.matchArr[2]);
									    
									    $scope.registerArr.splice(0, 4);
									}
								}
								localStorage.setItem("knockoutSchedulingStat", "Completed");


								console.log($scope.matchesArr);
								$scope.matchesArr.forEach(function(match){
									console.log(match);
								});

								// check if the schedule status is on queue
								if(entry.schedule_status === 'On Queue'){

									//	if true save the data to database
									console.log("save data to database");

									$scope.matchesArr.forEach(function(entry){
										addMatchDelay(entry);
									});

									//	set timer to addMatch function to minimize the number of request per second to prevent failed request
									function addMatchDelay(entry){
										setTimeout(function(){
											//insert data to database
											MatchService.addMatch(entry).success(function(data){
												// $ionicLoading.hide();
												console.log("add match");
												console.log(data);
											}).error(function(data){
												// $ionicLoading.hide();
											});
											//insert data to database
										},15000);
									}
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
								    }else
								    if(item.group == "B"){
								        // console.log("B");
								        $scope.teamsArr[2].push(item.team);
								    }else
								    if(item.group == "C"){
								        // console.log("C");
								        $scope.teamsArr[3].push(item.team);
								    }else
								    if(item.group == "D"){
								        // console.log("D");
								        $scope.teamsArr[4].push(item.team);
								    }else
								    if(item.group == "E"){
								        // console.log("E");
								        $scope.teamsArr[5].push(item.team);
								    }else
								    if(item.group == "F"){
								        // console.log("F");
								        $scope.teamsArr[6].push(item.team);
								    }else
								    if(item.group == "G"){
								        // console.log("G");
								        $scope.teamsArr[7].push(item.team);
								    }else
								    if(item.group == "H"){
								        // console.log("H");
								        $scope.teamsArr[8].push(item.team);
								    }
								});

						
							$scope.classementArr = [];
							$scope.matchesGroupA = [];
							$scope.matchesGroupB = [];
							$scope.matchesGroupC = [];
							$scope.matchesGroupD = [];
							$scope.matchesGroupE = [];
							$scope.matchesGroupF = [];
							$scope.matchesGroupG = [];
							$scope.matchesGroupH = [];

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

								if(entry.classement_status === 'On Progress'){
									setTimeout(function(){
										$scope.classementArr.forEach(function(classement){
											addClassementDelay(classement);
										});

										function addClassementDelay(classement){
											setTimeout(function(){
												//insert data to database
												ClassementService.addClassement(classement).success(function(data){
													// $ionicLoading.hide();
													console.log("create classement");
													console.log(data);
												}).error(function(data){
													// $ionicLoading.hide();
												});
												//insert data to database
											},15000);
										}
									},6000);
								}

								if(entry.classement_status === 'On Progress'){
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
									},10000);
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
							        	$scope.matchesGroupA.push(match);
							        }else if(j === 2){
							        	console.log("Group B matches");
							        	$scope.matchesGroupB.push(match);
							        }else if(j === 3){
							        	console.log("Group C matches");
							        	$scope.matchesGroupC.push(match);
							        }else if(j === 4){
							        	console.log("Group D matches");
							        	$scope.matchesGroupD.push(match);
							        }else if(j === 5){
							        	console.log("Group E matches");
							        	$scope.matchesGroupE.push(match);
							        }else if(j === 6){
							        	console.log("Group F matches");
							        	$scope.matchesGroupF.push(match);
							        }else if(j === 7){
							        	console.log("Group G matches");
							        	$scope.matchesGroupG.push(match);
							        }else if(j === 8){
							        	console.log("Group H matches");
							        	$scope.matchesGroupH.push(match);
							        }
							        //rotate array
							        $scope.teamsArr[j] = arrayRotateEven(newTeams, true);
							        match = [];
							        var fixture = round + 1;
							        // console.log("Round " + fixture + " : " + $scope.matches[round]);
							    }

							}
							console.log($scope.classementArr);
							console.log($scope.matchesGroupA);
							console.log($scope.matchesGroupB);

							$scope.firstRoundMatches = [];
							$scope.firstRoundHomeTeam = [];
							$scope.firstRoundAwayTeam = [];
							$scope.firstRoundFixtureObj = [];

							$scope.secondRoundMatches = [];
							$scope.secondRoundHomeTeam = [];
							$scope.secondRoundAwayTeam = [];
							$scope.secondRoundFixtureObj = [];

							$scope.thirdRoundMatches = [];
							$scope.thirdRoundHomeTeam = [];
							$scope.thirdRoundAwayTeam = [];
							$scope.thirdRoundFixtureObj = [];


							// First Round Matches
							if($scope.matchesGroupA.length !== 0){
								$scope.firstRoundMatches.push($scope.matchesGroupA[0]);
							}
							if($scope.matchesGroupB.length !== 0){
								$scope.firstRoundMatches.push($scope.matchesGroupB[0]);
							}
							if($scope.matchesGroupC.length !== 0){
								$scope.firstRoundMatches.push($scope.matchesGroupC[0]);
							}
							if($scope.matchesGroupD.length !== 0){
								$scope.firstRoundMatches.push($scope.matchesGroupD[0]);
							}
							if($scope.matchesGroupE.length !== 0){
								$scope.firstRoundMatches.push($scope.matchesGroupE[0]);
							}
							if($scope.matchesGroupF.length !== 0){
								$scope.firstRoundMatches.push($scope.matchesGroupF[0]);
							}
							if($scope.matchesGroupG.length !== 0){
								$scope.firstRoundMatches.push($scope.matchesGroupG[0]);
							}
							if($scope.matchesGroupH.length !== 0){
								$scope.firstRoundMatches.push($scope.matchesGroupH[0]);
							}


							// Second Round Matches
							if($scope.matchesGroupA.length !== 0){
								$scope.secondRoundMatches.push($scope.matchesGroupA[1]);
							}
							if($scope.matchesGroupB.length !== 0){
								$scope.secondRoundMatches.push($scope.matchesGroupB[1]);
							}
							if($scope.matchesGroupC.length !== 0){
								$scope.secondRoundMatches.push($scope.matchesGroupC[1]);
							}
							if($scope.matchesGroupD.length !== 0){
								$scope.secondRoundMatches.push($scope.matchesGroupD[1]);
							}
							if($scope.matchesGroupE.length !== 0){
								$scope.secondRoundMatches.push($scope.matchesGroupE[1]);
							}
							if($scope.matchesGroupF.length !== 0){
								$scope.secondRoundMatches.push($scope.matchesGroupF[1]);
							}
							if($scope.matchesGroupG.length !== 0){
								$scope.secondRoundMatches.push($scope.matchesGroupG[1]);
							}
							if($scope.matchesGroupH.length !== 0){
								$scope.secondRoundMatches.push($scope.matchesGroupH[1]);
							}
							

							// Third Round Matches 
							if($scope.matchesGroupA.length !== 0){
								$scope.thirdRoundMatches.push($scope.matchesGroupA[2]);
							}
							if($scope.matchesGroupB.length !== 0){
								$scope.thirdRoundMatches.push($scope.matchesGroupB[2]);
							}
							if($scope.matchesGroupC.length !== 0){
								$scope.thirdRoundMatches.push($scope.matchesGroupC[2]);
							}
							if($scope.matchesGroupD.length !== 0){
								$scope.thirdRoundMatches.push($scope.matchesGroupD[2]);
							}
							if($scope.matchesGroupE.length !== 0){
								$scope.thirdRoundMatches.push($scope.matchesGroupE[2]);
							}
							if($scope.matchesGroupF.length !== 0){
								$scope.thirdRoundMatches.push($scope.matchesGroupF[2]);
							}
							if($scope.matchesGroupG.length !== 0){
								$scope.thirdRoundMatches.push($scope.matchesGroupG[2]);
							}
							if($scope.matchesGroupH.length !== 0){
								$scope.thirdRoundMatches.push($scope.matchesGroupH[2]);
							}


							console.log($scope.firstRoundMatches);
							console.log($scope.secondRoundMatches);
							console.log($scope.thirdRoundMatches);
						
						
							$scope.firstRoundMatches.forEach(function(match){
								for(var m = 0; m < match.length; m++){
									// console.log(match[m]);
									if(m % 2 === 0){
										$scope.firstRoundHomeTeam.push(match[m]);
									}else{
										$scope.firstRoundAwayTeam.push(match[m]);
									}
								}

								for(t = 0; t < $scope.firstRoundHomeTeam.length; t++){
									
									$scope.firstRoundFixtureObj[t] = {};
									$scope.firstRoundFixtureObj[t].match_homeTeam = $scope.firstRoundHomeTeam[t];
									$scope.firstRoundFixtureObj[t].match_awayTeam = $scope.firstRoundAwayTeam[t];
									$scope.firstRoundFixtureObj[t].match_time = "";
									$scope.firstRoundFixtureObj[t].match_started = "";
									$scope.firstRoundFixtureObj[t].fixture_number = 1;
									$scope.firstRoundFixtureObj[t].competition_id = entry.id;
								}
							});
							console.log($scope.firstRoundFixtureObj);

							$scope.secondRoundMatches.forEach(function(match){
								for(var m = 0; m < match.length; m++){
									// console.log(match[m]);
									if(m % 2 === 0){
										$scope.secondRoundHomeTeam.push(match[m]);
									}else{
										$scope.secondRoundAwayTeam.push(match[m]);
									}
								}

								for(t = 0; t < $scope.secondRoundHomeTeam.length; t++){
									
									$scope.secondRoundFixtureObj[t] = {};
									$scope.secondRoundFixtureObj[t].match_homeTeam = $scope.secondRoundHomeTeam[t];
									$scope.secondRoundFixtureObj[t].match_awayTeam = $scope.secondRoundAwayTeam[t];
									$scope.secondRoundFixtureObj[t].match_time = "";
									$scope.secondRoundFixtureObj[t].match_started = "";
									$scope.secondRoundFixtureObj[t].fixture_number = 2;
									$scope.secondRoundFixtureObj[t].competition_id = entry.id;
								}
							});
							console.log($scope.secondRoundFixtureObj);

							$scope.thirdRoundMatches.forEach(function(match){
								for(var m = 0; m < match.length; m++){
									// console.log(match[m]);
									if(m % 2 === 0){
										$scope.thirdRoundHomeTeam.push(match[m]);
									}else{
										$scope.thirdRoundAwayTeam.push(match[m]);
									}
								}

								for(t = 0; t < $scope.thirdRoundHomeTeam.length; t++){
									
									$scope.thirdRoundFixtureObj[t] = {};
									$scope.thirdRoundFixtureObj[t].match_homeTeam = $scope.thirdRoundHomeTeam[t];
									$scope.thirdRoundFixtureObj[t].match_awayTeam = $scope.thirdRoundAwayTeam[t];
									$scope.thirdRoundFixtureObj[t].match_time = "";
									$scope.thirdRoundFixtureObj[t].match_started = "";
									$scope.thirdRoundFixtureObj[t].fixture_number = 3;
									$scope.thirdRoundFixtureObj[t].competition_id = entry.id;
								}
							});
							console.log($scope.thirdRoundFixtureObj);


							// Save matches to database
							
							if(entry.schedule_status === 'On Queue'){
								if(localStorage.getItem("firstRoundMatchesStatus") === 'On Progress'){
									$scope.firstRoundFixtureObj.forEach(function(entry){
										addMatchDelay(entry);
									});

									// 	set timer to addMatch function to minimize the number of request per second to prevent failed request
									function addMatchDelay(entry){
										setTimeout(function(){
											//insert data to database
											MatchService.addMatch(entry).success(function(data){
												// $ionicLoading.hide();
												console.log("add match");
												console.log(data);
											}).error(function(data){
												// $ionicLoading.hide();
											});
											//insert data to database
										},15000);
									}
									localStorage.setItem("firstRoundMatchesStatus", "Completed");
								}
								if(localStorage.getItem("secondRoundMatchesStatus") === 'On Progress'){
									$scope.secondRoundFixtureObj.forEach(function(entry){
										addMatchDelay(entry);
									});

									// 	set timer to addMatch function to minimize the number of request per second to prevent failed request
									function addMatchDelay(entry){
										setTimeout(function(){
											//insert data to database
											MatchService.addMatch(entry).success(function(data){
												// $ionicLoading.hide();
												console.log("add match");
												console.log(data);
											}).error(function(data){
												// $ionicLoading.hide();
											});
											//insert data to database
										},15000);
									}
									localStorage.setItem("secondRoundMatchesStatus", "Completed");
								}
								if(localStorage.getItem("thirdRoundMatchesStatus") === 'On Progress'){
									$scope.thirdRoundFixtureObj.forEach(function(entry){
										addMatchDelay(entry);
									});

									// 	set timer to addMatch function to minimize the number of request per second to prevent failed request
									function addMatchDelay(entry){
										setTimeout(function(){
											//insert data to database
											MatchService.addMatch(entry).success(function(data){
												// $ionicLoading.hide();
												console.log("add match");
												console.log(data);
											}).error(function(data){
												// $ionicLoading.hide();
											});
											//insert data to database
										},15000);
									}
									localStorage.setItem("thirdRoundMatchesStatus", "Completed");
								}
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
									}).error(function(data) {
										// $ionicLoading.hide();
										console.log("gagal");
									});
								}	
							},50000);


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
							// bikin array utk menampung wasit-wasit yang available pada tanggal dan waktu pertandingan tertentu
							var avRefArr = [];

							// bikin function utk cari / get wasit-wasit yang available pada tgl dan waktu pertandingan tertentu
							var date = "2010-10-20";
							var time = "4:30";
							var singleDate = date + " " + time;

							console.log(singleDate);
							
							// get day based on date
							console.log(moment(date).format('dddd')); 

							// bikin function utk get wasit yg available berdasarkan tgl dan waktu pertandingan tertentu
							$scope.getAvRefByDayAndTime = function(day, time){
								// bikin service / api utk get av ref where available_day === day && available_time === time
							};

					}
				});
				if($scope.competition !== null){
					clearInterval($scope.loadCompetition);
					$ionicLoading.hide();
				}
				$scope.competitionLoaded = true;
				$ionicLoading.hide();

			}).error(function(data) {});
		}
	};
	
	$scope.loadCompetition = setInterval($scope.getCompetitionByOrganizer, 1000);
		

	console.log(ls.getItem("role"));
	// $scope.loadOnProgressMatches = setInterval($scope.getOnProgressMatches, 1000);
	// $scope.loadAcceptedMatches = setInterval($scope.getAcceptedMatches, 1000);
	$scope.availableLoaded = false;
	$scope.onProgressLoaded = false;
	$scope.acceptedLoaded = false;

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

	// bedakan nama variable untuk today, next, dan prev 
	// supaya datanya tidak bentrokan


	console.log("today");
	$rootScope.showLoading($ionicLoading);

	$scope.matchDate = $scope.thisDay + " " + $scope.thisMonthName + " " + $scope.thisYear;
	$scope.matchDate = new Date($scope.matchDate);
	$scope.matchDate = moment($scope.matchDate).toISOString();
	console.log($scope.matchDate);
	
	var index = -1;
	$scope.getMatchesByRefereeAndDate = function() {
		MatchService.getMatchesByRefereeAndDate(ls.getItem("username"),$scope.matchDate).success(function(data) {
			// console.log(data);

			data.forEach(function(match){
				if($scope.refMatchesByDateObj.competition.indexOf(match.competition_id) !== -1){

				}else{
					index++;
					$scope.refMatchesByDateObj.competition.push(match.competition_id);
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
			clearInterval($scope.loadMatchesByRefereeAndDate);
		}).error(function(data) {
			console.log("gagal");
		});
	};
	$scope.loadMatchesByRefereeAndDate = setInterval($scope.getMatchesByRefereeAndDate, 1000);


	$scope.day = date.getDate();
	$scope.month = date.getMonth();
	$scope.monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	$scope.monthName = $scope.monthNames[$scope.month];
    $scope.year = date.getFullYear();
 
    $scope.next = function(){
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
					$scope.refMatchesByDateObj.competition.push(match.competition_id);
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
        	}, 10000);

		}).error(function(data) {
			console.log("gagal");
		});
	};

	$scope.prev = function(){
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
					$scope.refMatchesByDateObj.competition.push(match.competition_id);
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

		}).error(function(data) {
			console.log("gagal");
		});
	};

	$scope.refMatches = {};
	$scope.allRefMatchesObj = {
		"date": [],
		"matches": [],
		"matchId": []
	};

	$scope.getMatchesByReferee = function(){
		if(ls.getItem("role") === 'Referee'){
			$ionicLoading.hide();
			MatchService.getMatchesByReferee(localStorage.getItem("username")).success(function(data) {
				// console.log("berhasil");
				// console.log(data.length);
				$scope.refMatches = data;
				// console.log($scope.refMatches);
				var index = -1;
				$scope.refMatches.forEach(function(match){

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
					

					// console.log($scope.allRefMatchesObj);

					// console.log(match);
					// console.log(moment().format('MM/DD/YYYY'));
					// console.log(moment().format('kk:mm'));
					// console.log(moment(match.match_date).format('MM/DD/YYYY'));
					$scope.countDownData = {};
					if(moment(match.match_date).format('MM/DD/YYYY') == moment().format('MM/DD/YYYY') && match.match_countDown == moment().format('kk:mm')){
						// console.log("start countdown");
						$scope.countDownData.countDownStarted = true; 
		        		$scope.countDownData.countDownTimer = 59;
		        		clearInterval($scope.loadRefMatches);
		        		MatchService.editMatchById(match.id,localStorage.getItem("token"),$scope.countDownData).success(function(data) {
							// console.log('countDowncountdowncountdown');
							$scope.countDown = setInterval($scope.startCountDown, 1000);
							$ionicLoading.hide();
							// $state.go('app.home');
						}).error(function(data) {
							$ionicLoading.hide();
						});
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

	$scope.loadRefMatches = setInterval($scope.getMatchesByReferee, 1000);

	$scope.countDownTimer = {};   
   	$scope.startCountDown = function() {
		MatchService.getMatchesByReferee(localStorage.getItem("username")).success(function(data) {
	        console.log(data);
	        $scope.refMatches = data;

	        $scope.refMatches.forEach(function(match){
	        	if(match.countDownStarted == "true" && match.countDownTimer > 0){
	        		// console.log("xcvx cvx vxvxcvxvx vxvxvxvcxv");
	        		$scope.countDownTimer.countDownTimer = match.countDownTimer - 1;
					console.log($scope.countDownTimer.countDownTimer);
					if($scope.countDownTimer.countDownTimer === 0){
						clearInterval($scope.countDown);
						// $scope.myVar = setInterval($scope.getMatchesByFixture, 1000);
					}
					MatchService.editMatchById(match.id,localStorage.getItem("token"),$scope.countDownTimer).success(function(data) {
						console.log('startcountdownstartcountdown');
						// $ionicLoading.hide();
						// $state.go('app.home');
					}).error(function(data) {
						// $ionicLoading.hide();
					});
	        	}
	        });
		}).error(function(data) {});
	};

	// $scope.countDown = setInterval($scope.startCountDown, 1000);

	// go to track score page
	$scope.goToTrackScore = function(id) { 
		$state.go('app.track_score', {
			'matchId': id
		});
	};

	// go to analyze match page
	$scope.goToAnalyzeMatch = function(id) { 
		$state.go('app.analyze_match', {
			'matchId': id
		});
	};

	// go to match detail page
	$scope.goToMatchDetail = function(id) { 
		$state.go('app.match_detail', {
			'matchId': id
		});
	};

	// utk sementara pake hide loading dlu
	// $ionicLoading.hide();
		
	var currentDate = new Date();
	currentDate.setDate(currentDate.getDate() + 1);
	currentDate = moment(currentDate).format('DD/MM/YYYY');
	console.log(currentDate);		
	$scope.availableMatches = {};
	$scope.onProgressMatches = {};
	$scope.acceptedMatches = {};
	$scope.getAvailableMatches = function(){
		MatchService.getAvailableMatches(currentDate).success(function(data) {
			$scope.availableMatches = data;
			console.log($scope.availableMatches);
			console.log("berhasil");
			clearInterval($scope.loadAvailableMatches);
			$scope.availableLoaded = true;
			// $ionicLoading.hide();
		}).error(function(data) {
			console.log("gagal");
			clearInterval($scope.loadAvailableMatches);
		});
	};

	if($scope.availableLoaded === false){
		$scope.loadAvailableMatches = setInterval($scope.getAvailableMatches, 2000);
	}

	$scope.getOnProgressMatches = function(){
		MatchService.getOnProgressMatches(ls.getItem("username"),currentDate).success(function(data) {
			$scope.onProgressMatches = data;
			console.log($scope.onProgressMatches);
			console.log("berhasil");
			clearInterval($scope.loadOnProgressMatches);
			$scope.onProgressLoaded = true;
			// $ionicLoading.hide();
		}).error(function(data) {
			console.log("gagal");
			clearInterval($scope.loadOnProgressMatches);
		});
	};

	if($scope.onProgressLoaded === false){
		$scope.loadOnProgressMatches = setInterval($scope.getOnProgressMatches, 2000);
	}

	$scope.getAcceptedMatches = function(){
		MatchService.getAcceptedMatches(ls.getItem("username"),$scope.matchDate).success(function(data) {
			$scope.acceptedMatches = data;
			console.log($scope.acceptedMatches);
			console.log("berhasil");
			clearInterval($scope.loadAcceptedMatches);
			$scope.acceptedLoaded = true;
			// $ionicLoading.hide();
		}).error(function(data) {
			console.log("gagal");
			clearInterval($scope.loadAcceptedMatches);
		});
	};

	if($scope.acceptedLoaded === false){
		$scope.loadAcceptedMatches = setInterval($scope.getAcceptedMatches, 2000);
	}
	// }	

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
	$scope.loadAllCompetition = setInterval($scope.getAllCompetition, 5000);

	$scope.editMatch = function(id) { 
		$state.go('app.edit_match', {
			'matchId': id
		});
	};
	$scope.goToMatchDetail = function(id) {
		$state.go('app.match_detail', {
			'matchId': id
		});
	};
	$scope.liveScore = function(id) { 
		$state.go('app.live_score', {
			'matchId': id
		});
	};
	$scope.trackScore = function(id) {
		$state.go('app.track_score', {
			'matchId': id
		});
	};
	$scope.viewMatches = function(id) { 
		$state.go('app.schedule', {
			'competitionId': id
		});
	};
	$scope.createCompetition = function(){
		$state.go('app.create_competition');
	};
	$scope.more = function(id) {
		$state.go('app.competition_detail', {
			'competitionId': id
		});
	};
	$scope.completeScheduling = function(id) {
		$state.go('app.complete_scheduling', {
			'competitionId': id
		});
	};
	$scope.viewMatchDetail = function(id) {
		$state.go('app.match_information', {
			'matchId': id
		});
	};
	$scope.viewMatchInfo = function(id) {
		$state.go('app.match_info', {
			'matchId': id
		});
	};
	$scope.goToEditCompetition = function(id) {
		$state.go('app.edit_competition', {
			'competitionId': id
		});
	};
	$scope.goToCompleteProfile = function() {
		$state.go('app.complete_profile');
	};
	$scope.goToClassement = function(){
		$state.go('app.classement');
	};
	$scope.goToCompetitionSchedule = function(id) {
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
		var confirmPopup = $ionicPopup.confirm({
			title: 'Delete Competition',
			template: 'Are you sure?'
		});
		confirmPopup.then(function(res) {
	        if(res) {
	            console.log('Sure!');
	            CompetitionService.delCompetition(id).success(function(data) {
		            $scope.loadCompetition = setInterval($scope.getCompetitionByOrganizer, 100);
				}).error(function(data) {
					// $ionicLoading.hide();
				});
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

				if(teamCoach !== null && teamSquadLength >= 8){
					// Register competition

					$scope.formCompetition = {};
					$scope.formCompetition.TeamName = localStorage.getItem("team");
					$scope.formCompetition.CompetitionId = id;
					// $scope.formCompetition.schedule_status = 'On Queue';
					console.log($scope.formCompetition);

					$scope.formTeam = {};
					$scope.formTeam.CompId = id;
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

.controller('ProfileCtrl', function($scope, $state, $ionicPopup, $ionicPlatform, $ionicLoading, LoginService, TeamService, PostService, ProfileService, $cordovaImagePicker, $cordovaCamera) {
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
			$scope.profile = {};
			$scope.profile = data;
			$scope.loadCompleted = true;
			$ionicLoading.hide();
			$scope.editProfil = function() {
                // Loading
                $ionicLoading.show({
                    content: 'Loading',
                    animation: 'fade-in',
                    showBackdrop: true,
                });
                $scope.profile = data;
                // Image upload processing
                var fileInput = document.getElementById('file-upload');
                var file = fileInput.files[0];
                if (file === undefined) {
                    $scope.profile.photo = '';
                    // Add data to database
                    LoginService.editUser(localStorage.getItem("userid"), localStorage.getItem("token"), $scope.profile).success(function(data) {
                        $scope.profile = data;
                        $state.go('app.profile');
                        $ionicLoading.hide();
                    }).error(function(data) {
                        $ionicLoading.hide();
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
                                    $state.go('app.profile');
                                    $ionicLoading.hide();
                    			}).error(function(data) {})
                            .error(function(data) {});
                            }).error(function(data2) {});
                        }).error(function(data) {});
                    }).error(function(data) {});
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

		$scope.teamData = {};
		TeamService.getTeamById(localStorage.getItem("myTeamId"),localStorage.getItem("token")).success(function(data) {
			$scope.teamData = data;
			$ionicLoading.hide();
		}).error(function(data) {
			$ionicLoading.hide();
		});
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

.controller('RefereeRatingCtrl', function($scope, $state, $ionicPopup, $ionicPlatform, $ionicLoading, RatingService) {

	 $scope.fairnessStar = 0;
	 $scope.decisionStar = 0;
	 $scope.disciplineStar = 0;
	 $scope.fairnessrated = false;
	 $scope.decisionrated = false;
	 $scope.disciplinerated = false;

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
   
   	
 	 $scope.submitRating = function() {
	    var result = parseInt($scope.fairnessStar) + parseInt($scope.decisionStar) + parseInt($scope.disciplineStar);

	    $scope.refRatingData = {};
	    $scope.refRatingData.home_teamObj = {};
	    $scope.refRatingData.home_teamObj.referee_rating = {};
	    $scope.refRatingData.away_teamObj = {};
	    $scope.refRatingData.away_teamObj.referee_rating = {};

	    // if home team == localstorage.getitem("team")
	    $scope.refRatingData.id = "Rdfdfkjghdfkgh121sgdfgdsfsdf21";
	    $scope.refRatingData.id_competition = "C121sdsfsdf21";
	    $scope.refRatingData.id_match = "M13129434934";
	    $scope.refRatingData.home_teamObj.referee_rating.referee_name = "Referee12121221";
	    $scope.refRatingData.home_teamObj.referee_rating.fairness = $scope.fairnessStar;
	    $scope.refRatingData.home_teamObj.referee_rating.decision = $scope.decisionStar;
	    $scope.refRatingData.home_teamObj.referee_rating.discipline = $scope.disciplineStar;

	    RatingService.saveRefereeRating($scope.refRatingData).success(function(data){
			// $ionicLoading.hide();
			console.log(data);
			console.log("sukses wuhuhuhu");

			alertPopup = $ionicPopup.alert({
				title: 'Success!',
				template: 'Your respond has been submitted ' + result
			});

			$state.go('app.home');
		}).error(function(data){
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

.controller('HistoryCtrl', function($scope, $state, $ionicPopup, $ionicPlatform, $ionicLoading, LoginService, ProfileService) {     
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

.controller('MatchDetailCtrl', function($scope, $state, $stateParams, $ionicPopup, $ionicPlatform, $ionicLoading, MatchService, PostService, ionicMaterialInk, ionicMaterialMotion, $cordovaSocialSharing) {
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
	MatchService.getMatchById($stateParams.matchId).success(function(data) {
		$ionicLoading.hide();
		$scope.match = data;
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

		$scope.goalsArr.goalHome
		console.log($scope.goalsArr);

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

.controller('MatchInfoCtrl', function($scope, $state, $stateParams, $ionicPopup, $ionicPlatform, $ionicLoading, MatchService, PostService, ionicMaterialInk, ionicMaterialMotion, $cordovaSocialSharing) {
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
	MatchService.getMatchById($stateParams.matchId).success(function(data) {
		$ionicLoading.hide();
		$scope.match = data;
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

.controller('EditMatchCtrl', function($ionicModal, NgMap, $scope, $state, $stateParams, $ionicPopup, $ionicPlatform, $ionicLoading, TeamService, MatchService, PostService, LoginService, CompetitionService, ionicMaterialInk, ionicMaterialMotion, $cordovaSocialSharing) {
	$ionicLoading.show({
		content: 'Login...',
		animation: 'fade-in',
		showBackdrop: true,
	});

	$scope.liveData = {};
	$scope.liveData.live_status = "true";
	MatchService.editMatchById($stateParams.matchId,localStorage.getItem("token"),$scope.liveData).success(function(data) {
		console.log('change live status to true');
		$ionicLoading.hide();
	}).error(function(data) {
		$ionicLoading.hide();
	});


	$scope.matchData = {};
	$scope.timerData = {};
	MatchService.getMatchById($stateParams.matchId,localStorage.getItem("token")).success(function(data){
		$scope.matchData = data;
		console.log($scope.matchData);
		$ionicLoading.hide();
		// if($scope.matchData.timer_status === null){
			$scope.startTimer = function(){
				if($scope.matchData.timer_status === null){
					console.log("afsd fsdf sdfsdf sdfsdf sf");
					$scope.timerData.timer = $scope.matchData.timer + 1;
					// $scope.timerData.timer_status = "halftime";
					MatchService.editMatchById($scope.matchData.id,localStorage.getItem("token"),$scope.timerData).success(function(data) {
						console.log('qweqweqrer erwerwerrqwrqwrqwrqwr');
						$ionicLoading.hide();
						// $state.go('app.home');
					}).error(function(data) {
						$ionicLoading.hide();
					});
				}
			};

	}).error(function(data){
		$ionicLoading.hide();
	});
	//timer//
	$scope.getMatchById = function(){
		MatchService.getMatchById($stateParams.matchId,localStorage.getItem("token")).success(function(data){
			$scope.matchData = data;
			console.log($scope.matchData);
			$ionicLoading.hide();
				$scope.startTimer = function(){
					if($scope.matchData.timer_status === null){
						console.log("afsd fsdf sdfsdf sdfsdf sf");
						$scope.timerData.timer = $scope.matchData.timer + 1;
						// $scope.timerData.timer_status = "halftime";
						MatchService.editMatchById($scope.matchData.id,localStorage.getItem("token"),$scope.timerData).success(function(data) {
							console.log('qweqweqrer erwerwerrqwrqwrqwrqwr');
							$ionicLoading.hide();
							// $state.go('app.home');
						}).error(function(data) {
							$ionicLoading.hide();
						});
					}	
				};
		}).error(function(data){
			$ionicLoading.hide();
		});
	};

	$scope.startTimer = function(){
		if($scope.matchData.timer_status === null || $scope.matchData.timer_status === 'started'){
			console.log("afsd fsdf sdfsdf sdfsdf sf");
			$scope.timerData.timer = $scope.matchData.timer + 1;
			// $scope.timerData.timer_status = "halftime";
			MatchService.editMatchById($scope.matchData.id,localStorage.getItem("token"),$scope.timerData).success(function(data) {
				console.log('qweqweqrer erwerwerrqwrqwrqwrqwr');
				$ionicLoading.hide();
				// $state.go('app.home');
			}).error(function(data) {
				$ionicLoading.hide();
			});
		}	
	};

	$scope.teamASecond = 0;
	// $scope.teamAMinute = 0;
	$scope.teamBSecond = 0;
	// $scope.teamBMinute = 0;
	$scope.timerTeamAStat = false;
	$scope.timerTeamBStat = false;

	$scope.startTeamATimer = function(){
		console.log("afsd fsdf sdfsdf sdfsdf sf");
		$scope.teamASecond = $scope.teamASecond + 1;
		// if($scope.teamASecond == 59){
		// 	$scope.teamASecond = 0;
		// 	$scope.teamAMinute = $scope.teamAMinute + 1;
		// }
	};

	$scope.startTeamBTimer = function(){
		console.log("afsd fsdf sdfsdf sdfsdf sf");
		$scope.teamBSecond = $scope.teamBSecond + 1;
		// if($scope.teamBSecond == 59){
		// 	$scope.teamBSecond = 0;
		// 	$scope.teamBMinute = $scope.teamBMinute + 1;
		// }
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
	// $scope.totalMinute = 0;
	$scope.totalSecond = 0;
	// console.log($scope.teamAMinute);


	// to do 
	// change total into second
	// load team possession when teamASecond != 0 && teamBSecond != 0

	$scope.startTeamPossession = function() {
		console.log($scope.teamASecond);
		console.log($scope.teamBSecond);
	// if (($scope.teamAMinute == 0) && ($scope.teamBMinute == 0)) {
	// 	console.log("team a minute 0");
	// 	if(($scope.teamASecond != 0) && ($scope.teamBSecond != 0)){
	// 		$scope.totalSecond = $scope.teamASecond + $scope.teamBSecond;
	// 		$scope.possessionTeamAPercentage = parseInt($scope.teamASecond / $scope.totalSecond * 100);
	// 		$scope.possessionTeamBPercentage = parseInt($scope.teamBSecond / $scope.totalSecond * 100); 
	// 	}else{
	// 		console.log("team a second 0");
	// 	}
	// } else {
	// 	// $scope.totalMinute = $scope.teamAMinute + $scope.teamBMinute;	
	// 	// $scope.possessionTeamAPercentage = $scope.teamAMinute / $scope.totalMinute * 100;
	// 	// $scope.possessionTeamBPercentage = $scope.teamBMinute / $scope.totalMinute * 100;

	// }
		if($scope.teamASecond != 0 && $scope.teamBSecond != 0){
			$scope.totalSecond = $scope.teamASecond + $scope.teamBSecond;
			$scope.possessionTeamAPercentage = parseInt($scope.teamASecond / $scope.totalSecond * 100);
			$scope.possessionTeamBPercentage = parseInt($scope.teamBSecond / $scope.totalSecond * 100);
		}else{
			$scope.possessionTeamAPercentage = 0;
			$scope.possessionTeamBPercentage = 0;
		}

	};


	$scope.loadTeamPossession = setInterval($scope.startTeamPossession, 10000);




	// window.onload = $scope.getMatchById;
    $scope.loadMatch = setInterval($scope.getMatchById, 1000);
 //    window.onload = $scope.startTimer;
    $scope.loadTimer = setInterval($scope.startTimer, 60000);
	//timer//

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

	$scope.halfTime = function() {
		$scope.timerData.timer_status = "halftime";
		MatchService.editMatchById($scope.matchData.id,localStorage.getItem("token"),$scope.timerData).success(function(data) {
			console.log('qweqweqrer erwerwerrqwrqwrqwrqwr');
			$ionicLoading.hide();
			// $state.go('app.home');
		}).error(function(data) {
			$ionicLoading.hide();
		});
		clearInterval($scope.loadMatch);
		clearInterval($scope.loadTimer);
		console.log("sdfsdffsdfd kijdfs fhfasjha sdajsfha fj");
	};

	$scope.startTime = function() {
		$scope.timerData.timer_status = "started";
		MatchService.editMatchById($scope.matchData.id,localStorage.getItem("token"),$scope.timerData).success(function(data) {
			console.log('qweqweqrer erwerwerrqwrqwrqwrqwr');
			$ionicLoading.hide();
			// $state.go('app.home');
		}).error(function(data) {
			$ionicLoading.hide();
		});
		$scope.loadMatch = setInterval($scope.getMatchById, 1000);
		$scope.loadTimer = setInterval($scope.startTimer, 60000);
		console.log("sdfsdffsdfd kijdfs fhfasjha sdajsfha fj");
	};
	
	$scope.fullTime = function() {
		$scope.timerData.timer_status = "fulltime";
		MatchService.editMatchById($scope.matchData.id,localStorage.getItem("token"),$scope.timerData).success(function(data) {
			console.log('qweqweqrer erwerwerrqwrqwrqwrqwr');
			$ionicLoading.hide();
			// $state.go('app.home');
		}).error(function(data) {
			$ionicLoading.hide();
		});
		clearInterval($scope.loadMatch);
		clearInterval($scope.loadTimer);
		console.log("sdfsdffsdfd kijdfs fhfasjha sdajsfha fj");
	};

	$scope.homeScore = {};
	$scope.homeScore.goalHome = {};
	$scope.awayScore = {};
	$scope.awayScore.goalAway = {};
	$scope.awayScore.goalHome = {};
	$scope.homeAssist = {};
	$scope.homeAssist.assistHome = {};
	$scope.awayAssist = {};
	$scope.awayAssist.assistAway = {};
	$scope.homeYellow = {};
	$scope.homeYellow.yellowCardHome = {};
	$scope.awayYellow = {};
	$scope.awayYellow.yellowCardAway = {};
	$scope.homeRed = {};
	$scope.homeRed.redCardHome = {};
	$scope.awayRed = {};
	$scope.awayRed.redCardAway = {};
	$scope.homeSub = {};
	$scope.homeSub.substituteHome = {};
	$scope.awaySub = {};
	$scope.awaySub.substituteAway = {};

	$scope.addGoalHome = function() {
		var scorers = document.getElementsByName("scorer");
		var assists = document.getElementsByName("assist");
	    for (var s = 0; s < scorers.length; s++) {
	        if (scorers[s].checked) {
	            scorer = (scorers[s].value);
	            console.log(scorer);
				MatchService.getMatchById($stateParams.matchId,localStorage.getItem("token")).success(function(data){
					$scope.matchData = data;
					console.log($scope.matchData);
					$ionicLoading.hide();
					$scope.homeScore.match_homeScore = $scope.matchData.match_homeScore + 1;
					$scope.arrAway = [];
					$scope.lastArrAway = 0;
					$scope.arrHome = [];
					$scope.lastArrHome = 0;
					// if($scope.matchData.goalHome.scoreAway !== 0){
					// 	$scope.arrAway = $scope.matchData.goalHome.scoreAway.split(',');
					// 	$scope.lastArrAway = $scope.arrAway[$scope.arrAway.length-1];
					// 	console.log($scope.lastArrAway);
					// 	$scope.arrHome = $scope.matchData.goalHome.scoreHome.split(',');
					// 	$scope.lastArrHome = $scope.arrHome[$scope.arrHome.length-1];
					// 	console.log($scope.lastArrHome);
					// }else{
					// 	$scope.lastArrAway = $scope.matchData.goalHome.scoreAway;
					// 	$scope.lastArrHome = $scope.matchData.goalHome.scoreHome;
					// }	
					// if($scope.matchData.goalHome.scorer !== null){
					// 	resultHome = parseInt($scope.lastArrHome,10);	
					// 	console.log(resultHome);
					// 	resultAway = parseInt($scope.lastArrAway,10);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
					// 	console.log(resultAway);
					// 	$scope.homeScore.goalHome.scorer = $scope.matchData.goalHome.scorer + ',' + scorer;
					// 	$scope.homeScore.goalHome.time = $scope.matchData.goalHome.time + ',' + $scope.matchData.timer;
					// 	$scope.homeScore.goalHome.scoreHome = $scope.matchData.goalHome.scoreHome + ',' + (resultHome + 1);
					// 	$scope.homeScore.goalHome.scoreAway = $scope.matchData.goalHome.scoreAway + ',' + resultAway;
					// }else{
					// 	$scope.homeScore.goalHome.scorer = scorer;
					// 	$scope.homeScore.goalHome.time = $scope.matchData.timer;
					// 	$scope.homeScore.goalHome.scoreHome = $scope.matchData.goalHome.scoreHome + 1;
					// 	$scope.homeScore.goalHome.scoreAway = $scope.matchData.goalHome.scoreAway;
					// }
					MatchService.editMatchById($stateParams.matchId,localStorage.getItem("token"),$scope.homeScore).success(function(data) {
						console.log("sdfjh sdfjshfsjdhf sjdfhsdjfshdfjshdfs jkdfhskjfdh");
						$ionicLoading.hide();
						$state.go('app.live_score', {
							'matchId': $stateParams.matchId
						});
					}).error(function(data) {
						$ionicLoading.hide();
					});
				}).error(function(data){
					$ionicLoading.hide();
				});
	            break;
	        }
	    }
	    for (var a = 0; a < assists.length; a++) {
	        if (assists[a].checked) {
	            assist = (assists[a].value);
	            console.log(assist);
	            break;
	        }
	    }
	};

	//goal//
	$scope.addScoreHome = function(player) {
		var confirmPopup = $ionicPopup.confirm({
			title: 'Scorer',
			template: 'Are you sure?'
		});
		confirmPopup.then(function(res) {
	         if(res) {
	            console.log('Sure!');
		        console.log(player);
				MatchService.getMatchById($stateParams.matchId,localStorage.getItem("token")).success(function(data){
					$scope.matchData = data;
					console.log($scope.matchData);
					$ionicLoading.hide();
					$scope.homeScore.match_homeScore = $scope.matchData.match_homeScore + 1;
					$scope.arrAway = [];
					$scope.lastArrAway = 0;
					$scope.arrHome = [];
					$scope.lastArrHome = 0;
					if($scope.matchData.goalHome.scoreAway !== 0){
						$scope.arrAway = $scope.matchData.goalHome.scoreAway.split(',');
						$scope.lastArrAway = $scope.arrAway[$scope.arrAway.length-1];
						console.log($scope.lastArrAway);
						$scope.arrHome = $scope.matchData.goalHome.scoreHome.split(',');
						$scope.lastArrHome = $scope.arrHome[$scope.arrHome.length-1];
						console.log($scope.lastArrHome);
					}else{
						$scope.lastArrAway = $scope.matchData.goalHome.scoreAway;
						$scope.lastArrHome = $scope.matchData.goalHome.scoreHome;
					}	
					if($scope.matchData.goalHome.scorer !== null){
						resultHome = parseInt($scope.lastArrHome,10);	
						console.log(resultHome);
						resultAway = parseInt($scope.lastArrAway,10);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
						console.log(resultAway);
						$scope.homeScore.goalHome.scorer = $scope.matchData.goalHome.scorer + ',' + player;
						$scope.homeScore.goalHome.time = $scope.matchData.goalHome.time + ',' + $scope.matchData.timer;
						$scope.homeScore.goalHome.scoreHome = $scope.matchData.goalHome.scoreHome + ',' + (resultHome + 1);
						$scope.homeScore.goalHome.scoreAway = $scope.matchData.goalHome.scoreAway + ',' + resultAway;
					}else{
						$scope.homeScore.goalHome.scorer = player;
						$scope.homeScore.goalHome.time = $scope.matchData.timer;
						$scope.homeScore.goalHome.scoreHome = $scope.matchData.goalHome.scoreHome + 1;
						$scope.homeScore.goalHome.scoreAway = $scope.matchData.goalHome.scoreAway;
					}
					MatchService.editMatchById($stateParams.matchId,localStorage.getItem("token"),$scope.homeScore).success(function(data) {
						console.log("sdfjh sdfjshfsjdhf sjdfhsdjfshdfjshdfs jkdfhskjfdh");
						$ionicLoading.hide();
						// $state.go('app.live_score', {
						// 	'matchId': $stateParams.matchId
						// });
					}).error(function(data) {
						$ionicLoading.hide();
					});
				}).error(function(data){
					$ionicLoading.hide();
				});
	         } else {
	            console.log('Not sure!');
	         }
	    });
	};
	$scope.addScoreAway = function(player) {
		MatchService.getMatchById($stateParams.matchId,localStorage.getItem("token")).success(function(data){
			$scope.matchData = data;
			console.log($scope.matchData);
			$ionicLoading.hide();
			$scope.awayScore.match_awayScore = $scope.matchData.match_awayScore + 1;
			$scope.arrAway = [];
			$scope.lastArrAway = 0;
			$scope.arrHome = [];
			$scope.lastArrHome = 0;
			if($scope.matchData.goalHome.scoreAway !== 0){
				$scope.arrAway = $scope.matchData.goalHome.scoreAway.split(',');
				$scope.lastArrAway = $scope.arrAway[$scope.arrAway.length-1];
				console.log($scope.lastArrAway);
				$scope.arrHome = $scope.matchData.goalHome.scoreHome.split(',');
				$scope.lastArrHome = $scope.arrHome[$scope.arrHome.length-1];
				console.log($scope.lastArrHome);
			}else{
				$scope.lastArrAway = $scope.matchData.goalHome.scoreAway;
				$scope.lastArrHome = $scope.matchData.goalHome.scoreHome;
			}	
			if($scope.matchData.goalAway.scorer !== null){
				resultHome = parseInt($scope.lastArrHome,10);	
				console.log(resultHome);
				resultAway = parseInt($scope.lastArrAway,10);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
				console.log(resultAway);
				$scope.awayScore.goalAway.scorer = $scope.matchData.goalAway.scorer + ',' + player;
				$scope.awayScore.goalAway.time = $scope.matchData.goalAway.time + ',' + $scope.matchData.timer;
				$scope.awayScore.goalHome.scoreHome = $scope.matchData.goalHome.scoreHome + ',' + resultHome;
				$scope.awayScore.goalHome.scoreAway = $scope.matchData.goalHome.scoreAway + ',' + (resultAway+1);
			}else{
				$scope.awayScore.goalAway.scorer = player;
				$scope.awayScore.goalAway.time = $scope.matchData.timer;
				$scope.awayScore.goalHome.scoreAway = $scope.matchData.goalHome.scoreAway + 1;
				$scope.awayScore.goalHome.scoreHome = $scope.matchData.goalHome.scoreHome;
			}
			MatchService.editMatchById($stateParams.matchId,localStorage.getItem("token"),$scope.awayScore).success(function(data) {
				console.log("sdfjh sdfjshfsjdhf sjdfhsdjfshdfjshdfs jkdfhskjfdh");
				$ionicLoading.hide();
			}).error(function(data) {
				$ionicLoading.hide();
			});
		}).error(function(data){
			$ionicLoading.hide();
		});
		$scope.modal_goal.hide();
      	$scope.squadDataArr = [];
	};
	//goal//
	//assist//
	$scope.addAssistHome = function(player) {
		MatchService.getMatchById($stateParams.matchId,localStorage.getItem("token")).success(function(data){
			$scope.matchData = data;
			console.log($scope.matchData);
			$ionicLoading.hide();
			// $scope.homeAssist.match_homeAssist = $scope.matchData.match_homeScore + 1;
			if($scope.matchData.assistHome.assister !== null){
				$scope.homeAssist.assistHome.assister = $scope.matchData.assistHome.assister + ',' + player;
				$scope.homeAssist.assistHome.time = $scope.matchData.assistHome.time + ',' + $scope.matchData.timer;
			}else{
				$scope.homeAssist.assistHome.assister = player;
				$scope.homeAssist.assistHome.time = $scope.matchData.timer;
			}
			MatchService.editMatchById($stateParams.matchId,localStorage.getItem("token"),$scope.homeAssist).success(function(data) {
				console.log("sdfjh sdfjshfsjdhf sjdfhsdjfshdfjshdfs jkdfhskjfdh");
				$ionicLoading.hide();
			}).error(function(data) {
				$ionicLoading.hide();
			});
		}).error(function(data){
			$ionicLoading.hide();
		});
		$scope.modal_goal.hide();
      	$scope.squadDataArr = [];
	};
	$scope.addAssistAway = function(player) {
		MatchService.getMatchById($stateParams.matchId,localStorage.getItem("token")).success(function(data){
			$scope.matchData = data;
			console.log($scope.matchData);
			$ionicLoading.hide();
			// $scope.awayAssist.match_awayScore = $scope.matchData.match_awayScore + 1;
			if($scope.matchData.assistAway.scorer !== null){
				$scope.awayAssist.assistAway.assister = $scope.matchData.assistAway.assister + ',' + player;
				$scope.awayAssist.assistAway.time = $scope.matchData.assistAway.time + ',' + $scope.matchData.timer;
			}else{
				$scope.awayAssist.assistAway.assister = player;
				$scope.awayAssist.assistAway.time = $scope.matchData.timer;
			}
			MatchService.editMatchById($stateParams.matchId,localStorage.getItem("token"),$scope.awayAssist).success(function(data) {
				console.log("sdfjh sdfjshfsjdhf sjdfhsdjfshdfjshdfs jkdfhskjfdh");
				$ionicLoading.hide();
			}).error(function(data) {
				$ionicLoading.hide();
			});
		}).error(function(data){
			$ionicLoading.hide();
		});
		$scope.modal_goal.hide();
      	$scope.squadDataArr = [];
	};
	//assist//
	//yellow card//
	$scope.addYelCardHome = function(player) {
		MatchService.getMatchById($stateParams.matchId,localStorage.getItem("token")).success(function(data){
			$scope.matchData = data;
			console.log($scope.matchData);
			$ionicLoading.hide();
			// $scope.homeAssist.match_homeAssist = $scope.matchData.match_homeScore + 1;
			if($scope.matchData.yellowCardHome.player !== null){
				$scope.homeYellow.yellowCardHome.player = $scope.matchData.yellowCardHome.player + ',' + player;
				$scope.homeYellow.yellowCardHome.time = $scope.matchData.yellowCardHome.time + ',' + $scope.matchData.timer;
			}else{
				$scope.homeYellow.yellowCardHome.player = player;
				$scope.homeYellow.yellowCardHome.time = $scope.matchData.timer;
			}
			MatchService.editMatchById($stateParams.matchId,localStorage.getItem("token"),$scope.homeYellow).success(function(data) {
				console.log("sdfjh sdfjshfsjdhf sjdfhsdjfshdfjshdfs jkdfhskjfdh");
				$ionicLoading.hide();
			}).error(function(data) {
				$ionicLoading.hide();
			});
		}).error(function(data){
			$ionicLoading.hide();
		});
		$scope.modal_goal.hide();
      	$scope.squadDataArr = [];
	};
	$scope.addYelCardAway = function(player) {
		MatchService.getMatchById($stateParams.matchId,localStorage.getItem("token")).success(function(data){
			$scope.matchData = data;
			console.log($scope.matchData);
			$ionicLoading.hide();
			// $scope.awayAssist.match_awayScore = $scope.matchData.match_awayScore + 1;
			if($scope.matchData.yellowCardAway.player !== null){
				$scope.awayYellow.yellowCardAway.player = $scope.matchData.yellowCardAway.player + ',' + player;
				$scope.awayYellow.yellowCardAway.time = $scope.matchData.yellowCardAway.time + ',' + $scope.matchData.timer;
			}else{
				$scope.awayYellow.yellowCardAway.player = player;
				$scope.awayYellow.yellowCardAway.time = $scope.matchData.timer;
			}
			MatchService.editMatchById($stateParams.matchId,localStorage.getItem("token"),$scope.awayYellow).success(function(data) {
				console.log("sdfjh sdfjshfsjdhf sjdfhsdjfshdfjshdfs jkdfhskjfdh");
				$ionicLoading.hide();
			}).error(function(data) {
				$ionicLoading.hide();
			});
		}).error(function(data){
			$ionicLoading.hide();
		});
		$scope.modal_goal.hide();
      	$scope.squadDataArr = [];
	};
	//yellow card//
	//red card//
	$scope.addRedCardHome = function(player) {
		MatchService.getMatchById($stateParams.matchId,localStorage.getItem("token")).success(function(data){
			$scope.matchData = data;
			console.log($scope.matchData);
			$ionicLoading.hide();
			// $scope.homeAssist.match_homeAssist = $scope.matchData.match_homeScore + 1;
			if($scope.matchData.redCardHome.player !== null){
				$scope.homeRed.redCardHome.player = $scope.matchData.redCardHome.player + ',' + player;
				$scope.homeRed.redCardHome.time = $scope.matchData.redCardHome.time + ',' + $scope.matchData.timer;
			}else{
				$scope.homeRed.redCardHome.player = player;
				$scope.homeRed.redCardHome.time = $scope.matchData.timer;
			}
			MatchService.editMatchById($stateParams.matchId,localStorage.getItem("token"),$scope.homeRed).success(function(data) {
				console.log("sdfjh sdfjshfsjdhf sjdfhsdjfshdfjshdfs jkdfhskjfdh");
				$ionicLoading.hide();
			}).error(function(data) {
				$ionicLoading.hide();
			});
		}).error(function(data){
			$ionicLoading.hide();
		});
		$scope.modal_goal.hide();
      	$scope.squadDataArr = [];
	};
	$scope.addRedCardAway = function(player) {
		MatchService.getMatchById($stateParams.matchId,localStorage.getItem("token")).success(function(data){
			$scope.matchData = data;
			console.log($scope.matchData);
			$ionicLoading.hide();
			// $scope.awayAssist.match_awayScore = $scope.matchData.match_awayScore + 1;
			if($scope.matchData.redCardAway.player !== null){
				$scope.awayRed.redCardAway.player = $scope.matchData.redCardAway.player + ',' + player;
				$scope.awayRed.redCardAway.time = $scope.matchData.redCardAway.time + ',' + $scope.matchData.timer;
			}else{
				$scope.awayRed.redCardAway.player = player;
				$scope.awayRed.redCardAway.time = $scope.matchData.timer;
			}
			MatchService.editMatchById($stateParams.matchId,localStorage.getItem("token"),$scope.awayRed).success(function(data) {
				console.log("sdfjh sdfjshfsjdhf sjdfhsdjfshdfjshdfs jkdfhskjfdh");
				$ionicLoading.hide();
			}).error(function(data) {
				$ionicLoading.hide();
			});
		}).error(function(data){
			$ionicLoading.hide();
		});
		$scope.modal_goal.hide();
      	$scope.squadDataArr = [];
	};
	//red card//
	//substitute//
	$scope.addSubHome = function(player1, player2) {
		MatchService.getMatchById($stateParams.matchId,localStorage.getItem("token")).success(function(data){
			$scope.matchData = data;
			console.log($scope.matchData);
			$ionicLoading.hide();
			// $scope.homeAssist.match_homeAssist = $scope.matchData.match_homeScore + 1;
			if($scope.matchData.substituteHome.in !== null){
				$scope.homeSub.substituteHome.in = $scope.matchData.substituteHome.in + ',' + player1;
				$scope.homeSub.substituteHome.out = $scope.matchData.substituteHome.out + ',' + player2;
				$scope.homeSub.substituteHome.time = $scope.matchData.substituteHome.time + ',' + $scope.matchData.timer;
			}else{
				$scope.homeSub.substituteHome.in = player1;
				$scope.homeSub.substituteHome.out = player2;
				$scope.homeSub.substituteHome.time = $scope.matchData.timer;
			}
			MatchService.editMatchById($stateParams.matchId,localStorage.getItem("token"),$scope.homeSub).success(function(data) {
				console.log("sdfjh sdfjshfsjdhf sjdfhsdjfshdfjshdfs jkdfhskjfdh");
				$ionicLoading.hide();
			}).error(function(data) {
				$ionicLoading.hide();
			});
		}).error(function(data){
			$ionicLoading.hide();
		});
		$scope.modal_goal.hide();
      	$scope.squadDataArr = [];
	};
	$scope.addSubAway = function(player1, player2) {
		MatchService.getMatchById($stateParams.matchId,localStorage.getItem("token")).success(function(data){
			$scope.matchData = data;
			console.log($scope.matchData);
			$ionicLoading.hide();
			// $scope.awayAssist.match_awayScore = $scope.matchData.match_awayScore + 1;
			if($scope.matchData.substituteAway.in !== null){
				$scope.awaySub.substituteAway.in = $scope.matchData.substituteAway.in + ',' + player1;
				$scope.awaySub.substituteAway.out = $scope.matchData.substituteAway.out + ',' + player2;
				$scope.awaySub.substituteAway.time = $scope.matchData.substituteAway.time + ',' + $scope.matchData.timer;
			}else{
				$scope.awaySub.substituteAway.in = player1;
				$scope.awaySub.substituteAway.out = player2;
				$scope.awaySub.substituteAway.time = $scope.matchData.timer;
			}
			MatchService.editMatchById($stateParams.matchId,localStorage.getItem("token"),$scope.awaySub).success(function(data) {
				console.log("sdfjh sdfjshfsjdhf sjdfhsdjfshdfjshdfs jkdfhskjfdh");
				$ionicLoading.hide();
			}).error(function(data) {
				$ionicLoading.hide();
			});
		}).error(function(data){
			$ionicLoading.hide();
		});
		$scope.modal_goal.hide();
      	$scope.squadDataArr = [];
	};
	//substitute//
	//Modal//
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
	$scope.squadData = [];
	$scope.squadDataArr = [];
	$scope.status = "";
    $scope.goalHome = function() {
    if($scope.matchData.timer_status === null || $scope.matchData.timer_status === 'started'){
		$ionicLoading.show({
			content: 'Login...',
			animation: 'fade-in',
			showBackdrop: true,
		});
		$scope.status = "goalHome";
	      $scope.modal_goal.show();
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
		}
	};  

    $scope.goalAway = function() {
    if($scope.matchData.timer_status === null || $scope.matchData.timer_status === 'started'){
	 	$ionicLoading.show({
			content: 'Login...',
			animation: 'fade-in',
			showBackdrop: true,
		});
		$scope.status = "goalAway";
	      $scope.modal_goal.show();
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
		}	
	};

    $scope.assistHome = function() {
    if($scope.matchData.timer_status === null || $scope.matchData.timer_status === 'started'){	
		$ionicLoading.show({
			content: 'Login...',
			animation: 'fade-in',
			showBackdrop: true,
		});
		$scope.status = "assistHome";
	      $scope.modal_goal.show();
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
		}	
    };

    $scope.assistAway = function() {
    if($scope.matchData.timer_status === null || $scope.matchData.timer_status === 'started'){	
	 	$ionicLoading.show({
			content: 'Login...',
			animation: 'fade-in',
			showBackdrop: true,
		});
		$scope.status = "assistAway";
	      $scope.modal_goal.show();
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
		}	
    };

    $scope.yelCardHome = function() {
    if($scope.matchData.timer_status === null || $scope.matchData.timer_status === 'started'){	
		$ionicLoading.show({
			content: 'Login...',
			animation: 'fade-in',
			showBackdrop: true,
		});
		$scope.status = "yelCardHome";
	      $scope.modal_goal.show();
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
		}	
    };

    $scope.yelCardAway = function() {
    if($scope.matchData.timer_status === null || $scope.matchData.timer_status === 'started'){	
	 	$ionicLoading.show({
			content: 'Login...',
			animation: 'fade-in',
			showBackdrop: true,
		});
		$scope.status = "yelCardAway";
	      $scope.modal_goal.show();
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
		}	
    };

    $scope.redCardHome = function() {
    if($scope.matchData.timer_status === null || $scope.matchData.timer_status === 'started'){	
		$ionicLoading.show({
			content: 'Login...',
			animation: 'fade-in',
			showBackdrop: true,
		});
		$scope.status = "redCardHome";
	      $scope.modal_goal.show();
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
		}	
    };

    $scope.redCardAway = function() {
    if($scope.matchData.timer_status === null || $scope.matchData.timer_status === 'started'){	
	 	$ionicLoading.show({
			content: 'Login...',
			animation: 'fade-in',
			showBackdrop: true,
		});
		$scope.status = "redCardAway";
	      $scope.modal_goal.show();
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
		}	
    };

    $scope.subHome = function() {
    if($scope.matchData.timer_status === null || $scope.matchData.timer_status === 'started'){	
		$ionicLoading.show({
			content: 'Login...',
			animation: 'fade-in',
			showBackdrop: true,
		});
		$scope.status = "subHome";
	      $scope.modal_goal.show();
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
		}	
    };

    $scope.subAway = function() {
    if($scope.matchData.timer_status === null || $scope.matchData.timer_status === 'started'){	
	 	$ionicLoading.show({
			content: 'Login...',
			animation: 'fade-in',
			showBackdrop: true,
		});
		$scope.status = "subAway";
	      $scope.modal_goal.show();
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
		}	
    };
	
    $scope.closeModalGoal = function() {
      $scope.modal_goal.hide();
      $scope.squadDataArr = [];
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modal_goal.remove();
    });
    //Modal Goal//
    $scope.fixtureId = localStorage.getItem("fixId");
    $scope.backToFixture = function(id) { // kembali ke halaman home
		$state.go('app.fixture', {
			'id': id
		});
		clearInterval($scope.loadMatch);
		clearInterval($scope.loadTimer);
	};
})

.controller('CompetitionCtrl', function($scope, $rootScope, $state, $stateParams, $ionicPopup, $ionicPlatform, $ionicLoading, MatchService, CompetitionService, ionicMaterialInk, ionicMaterialMotion, $cordovaSocialSharing, $compile, NgMap) {
	
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
		{nama: "Maestro", alamat: "Samping PRJ / samping Pasar Mobil Kemayoran", telepon: " 021-92409488"},
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

	// format input data when typing for competition fee
   	// $scope.data = {
    // 	comp_fee: '',
    // 	firstplace_reward: '',
    // 	secondplace_reward: ''
    // };

    // $scope.options = {
    //     numeral: {
    //         numeral: true
    //     }
    // };


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
	// $scope.showHide = function(value) {
	//     if (value==="GroupStage"){
	//     	$scope.status = "GroupStage";
	//     }
	//     else
	//         document.getElementById('divShow').style.display = 'block';
	// };

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
	$scope.data.organizer = $scope.menuProfile.username;

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

	$scope.addCompetition = function() {

		// validasi start date
		// var todayDate = new Date();
		// var numberOfDaysToAdd = 14;
		// todayDate.setDate(todayDate.getDate() + numberOfDaysToAdd); 
		// var dd = todayDate.getDate();
		// var mm = todayDate.getMonth() + 1;
		// var y = todayDate.getFullYear();

		// var someFormattedDate = dd + '/'+ mm + '/'+ y;
		console.log($scope.data.comp_start);
		if($scope.data.comp_start != null){
			console.log($scope.data.comp_start.getDate());

			var minStartDate = new Date();
			console.log(minStartDate.getDate());
			minStartDate.setDate(minStartDate.getDate() + 14);

			var maxStartDate = new Date();
			maxStartDate.setDate(maxStartDate.getDate() + 21);

			var minEndDate = new Date($scope.data.comp_start);
			minEndDate.setDate(minEndDate.getDate() + 7);

			var maxEndDate = new Date($scope.data.comp_start);
			maxEndDate.setDate(maxEndDate.getDate() + 30);

			console.log($scope.data.comp_start);
			console.log(minStartDate);
			console.log(maxStartDate);
			console.log(minEndDate);
			console.log(maxEndDate);

			var isStartDateValid = true;
			var isEndDateValid = true;

			if ($scope.data.comp_start < minStartDate || $scope.data.comp_start > maxStartDate) {
		       	console.log("start date must be between 14 and 21 day next to the day the competition is created");
		       	isStartDateValid = false;
		    } else {
		    	isStartDateValid = true;
		    }

		    if ($scope.data.comp_finish < minEndDate || $scope.data.comp_finish > maxEndDate) {
		       	console.log("end date must be between 7 and 30 day next to the competition start date");
		       	isEndDateValid = false;
		    } else {
		    	isEndDateValid = true;
		    }
		}

		if ($scope.data.comp_name === undefined && $scope.data.comp_type === undefined && $scope.data.comp_location === undefined && $scope.data.comp_numOfTeam === undefined && $scope.data.comp_start === undefined && $scope.data.comp_finish === undefined) {
			$rootScope.showPopup($ionicPopup,'Create Competition failed!','Please fill all the fields', 'popup-error');
		} else if ($scope.data.comp_name === undefined || $scope.data.comp_name === "") {
			$rootScope.showPopup($ionicPopup,'Create Competition failed!','Competition name is required !', 'popup-error');
		} else if ($scope.data.comp_type === undefined || $scope.data.comp_type === "") {
			$rootScope.showPopup($ionicPopup,'Create Competition failed!','Competition type is required !', 'popup-error');
		} else if ($scope.data.comp_numOfTeam === undefined || $scope.data.comp_numOfTeam === "") {
			$rootScope.showPopup($ionicPopup,'Create Competition failed!','Number of teams is required !', 'popup-error');
		} else if ($scope.data.comp_start === undefined || $scope.data.comp_start === "") {
			$rootScope.showPopup($ionicPopup,'Create Competition failed!','start date is required !', 'popup-error');
		} else if (isStartDateValid === false) {
			$rootScope.showPopup($ionicPopup,'Create Competition failed!','start date is not valid (must be minimal 14 day next to the day the competition is created)', 'popup-error');
		} else if ($scope.data.comp_finish === undefined || $scope.data.comp_finish === "") {
			$rootScope.showPopup($ionicPopup,'Create Competition failed!','end date is required !', 'popup-error');
		} else if (isEndDateValid === false) {
			$rootScope.showPopup($ionicPopup,'Create Competition failed!','end date is not valid (must be between 7 and 30 day next to the competition start date)', 'popup-error');
		} else if ($scope.data.comp_name !== null && $scope.data.comp_type !== null && $scope.data.comp_numOfTeam !== null && $scope.data.comp_location !== null && $scope.data.comp_start !== null && $scope.data.comp_finish !== null) {
			console.log($scope.data);
			CompetitionService.addCompetition($scope.data).success(function(data) {
				// $ionicLoading.hide();
				// var alertPopup = $ionicPopup.alert({
				// 	title: 'Success!',
				// 	template: 'Berhasil Membuat Kompetisi'
				// });
				$state.go('app.home');

			}).error(function(data) {
				// $ionicLoading.hide();
				// var alertPopup = $ionicPopup.alert({
				// 	title: 'Post Data Failed!',
				// 	template: 'Gagal Membuat Kompetisi'
				// });
			});	
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

				if(teamCoach !== null && teamSquadLength >= 8){
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

.controller('EditCompetitionCtrl', function(NgMap, $scope, $state, $stateParams, $ionicPopup, $ionicPlatform, $ionicLoading, MatchService, PostService, CompetitionService, ionicMaterialInk, ionicMaterialMotion, $cordovaSocialSharing) {
	$ionicLoading.show({
		content: 'Login...',
		animation: 'fade-in',
		showBackdrop: true,
	});

	$scope.competition = {};
	console.log($stateParams.competitionId);
	CompetitionService.getCompetitionById($stateParams.competitionId,localStorage.getItem("token")).success(function(data) {
		$scope.competition = data;
		$ionicLoading.hide();
		console.log($scope.competition);
	}).error(function(data) {});

	$scope.editCompetition = function() {
	$scope.competition.comp_start = moment($scope.competition.comp_start).format('YYYY-MM-DD');
	console.log($scope.competition.comp_start);
	$scope.competition.comp_finish = moment($scope.competition.comp_finish).format('YYYY-MM-DD');
	console.log($scope.competition.comp_finish);
	CompetitionService.editCompetition($stateParams.competitionId, localStorage.getItem("token"), $scope.competition).success(function(data) {
		$ionicLoading.hide();
		var alertPopup = $ionicPopup.alert({
			title: 'Success!',
			template: 'Berhasil Edit Kompetisi'
		});
		$state.go('app.home');
	}).error(function(data) {
		$ionicLoading.hide();
		var alertPopup = $ionicPopup.alert({
			title: 'Failed!',
			template: 'Gagal Edit Kompetisi'
		});
	});
	};

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

.controller('MyTeamCtrl', function($scope, $state, $stateParams, $ionicPopup, $ionicPlatform, $ionicLoading, $ionicModal, TeamService, LoginService, MatchService, PostService, ProfileService, CompetitionService, TrainingService, ionicMaterialInk, ionicMaterialMotion, $cordovaSocialSharing) {
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
	$scope.showme = 1;
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

	// Get user profile data
	LoginService.getUserById(localStorage.getItem("userid")).success(function(data) {
		$scope.userProfile = data;
		$scope.teamInvitationStatus = false;
		$scope.requestedTeamStatus = false;
		
		// if($scope.userProfile.team !== null){
		// 	$scope.haveTeamStatus = true;
		// }
		if(localStorage.getItem("team") !== null){
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
						}
						if($scope.createdTeam.invited_member !== null){
							$scope.invitedMember = $scope.createdTeam.invited_member.split(",");
						}
						if($scope.createdTeam.coach_request !== null){
							$scope.coachRequest = $scope.createdTeam.coach_request.split(",");
						}
						if($scope.createdTeam.player_request !== null){
							$scope.playerRequest = $scope.createdTeam.player_request.split(",");
						}

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
						console.log($scope.joinedMemberData);

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


						var im = 0;
						function getInvitedMemberData() {
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
						        setTimeout( getInvitedMemberData, 2700 );
						    }
						}
						getInvitedMemberData();
						console.log($scope.invitedMemberData);

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

					}).error(function(data) {});

					// Get data goalkeeper, defender, midfielder, and attacker
					console.log(localStorage.getItem("team"));
					
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

								if(t == $scope.teamInvitationData.length - 1){
									clearInterval($scope.getTeamInvitationTimer);
								}
							}
							console.log($scope.teamInvitationDataArr);
						}else{
							$scope.teamInvitationDataArr = [];
							clearInterval($scope.getTeamInvitationTimer);
						}

					}).error(function(data) {});					
				}
			};
			$scope.getTeamInvitationTimer = setInterval($scope.getTeamInvitation, 1000);
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
					$scope.notComingArr = $scope.trainingData.coming.split(",");
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

				data.forEach(function(entry){
					if(entry.match_homeTeam === localStorage.getItem("team")){
						if(entry.match_homeTeamObj !== null){
							$scope.lineupStatus[entry.id] = true;
						}else{
							$scope.lineupStatus[entry.id] = false;
						}
					}else{
						if(entry.match_awayTeamObj !== null){
							$scope.lineupStatus[entry.id] = true;
						}else{
							$scope.lineupStatus[entry.id] = false;
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
	$scope.addCoachToTeam = function(username) {	
		LoginService.getUserByUsername(username).success(function(data){
			console.log(data);
			$ionicLoading.hide();
			$scope.coachData = data;
			console.log($scope.coachData);
			$scope.squadData = {};

		$scope.squadData.Member = username;
		$scope.squadData.TeamName = $scope.menuProfile.team;

		TeamService.addMemberByName($scope.squadData).success(function(data){
			// $ionicLoading.hide();
			console.log("sukses wuhuhuhu");
			// $state.go('app.team');
		}).error(function(data){
			// $ionicLoading.hide();
		});

		$scope.userSquad = {};
		$scope.userSquad.TeamName = $scope.menuProfile.team;
		$scope.userSquad.UserId = $scope.coachData.id;
		TeamService.addTeamToUser($scope.userSquad).success(function(data){
			// $ionicLoading.hide();
			console.log("sukses wahahah");
			// $state.go('app.team');
		}).error(function(data){
			// $ionicLoading.hide();
		});


		$scope.delInvitation = {};
		$scope.delInvitation.UserName = username;
		$scope.delInvitation.teamInvite = $scope.menuProfile.team;
		TeamService.delTeamInvitation($scope.delInvitation).success(function(data){
			// $ionicLoading.hide();
			console.log("sukses alelele");
			// $state.go('app.team');
		}).error(function(data){
			// $ionicLoading.hide();
		});

		$scope.delInvitedMember = {};
		$scope.delInvitedMember.TeamName = username;
		$scope.delInvitedMember.userInvited = $scope.menuProfile.team;
		TeamService.delInvitedMember($scope.delInvitedMember).success(function(data){
			// $ionicLoading.hide();
			console.log("sukses ulelele");
			// $state.go('app.team');
		}).error(function(data){
			// $ionicLoading.hide();
		});

		}).error(function(data) {
			$ionicLoading.hide();
		});
	};
	$scope.delCoachRequest = function(username) {
			console.log("hqweiq2yei uqwguqwteuiqe");
			console.log(username);
			$scope.delInvitation = {};
			$scope.delInvitation.UserName = username;
			$scope.delInvitation.teamInvite = $scope.menuProfile.team;
			TeamService.delTeamInvitation($scope.delInvitation).success(function(data){
				// $ionicLoading.hide();
				console.log("sukses alelele");
				// $state.go('app.team');
			}).error(function(data){
				// $ionicLoading.hide();
			});

			$scope.delInvitedMember = {};
			$scope.delInvitedMember.TeamName = $scope.menuProfile.team;
			$scope.delInvitedMember.userInvited = username;
			TeamService.delInvitedMember($scope.delInvitedMember).success(function(data){
				// $ionicLoading.hide();
				console.log("sukses ulelele");
				// $state.go('app.team');
			}).error(function(data){
				// $ionicLoading.hide();
			});
	};
	$scope.addUserToTeamSquad = function(teamName,teamId) {

		console.log(teamName);
		console.log(teamId);

		var confirmPopup = $ionicPopup.confirm({
			title: 'Accept Invitation',
			template: 'Are you sure?'
		});
		confirmPopup.then(function(res) {
	        if(res) {
	        	$scope.squadData = {};
				$scope.squadData.Member = $scope.menuProfile.username;
				$scope.squadData.TeamName = teamName;

				TeamService.addMemberByName($scope.squadData).success(function(data){
					// $ionicLoading.hide();
					console.log("sukses wuhuhuhu");
					// $state.go('app.team');
				}).error(function(data){
					// $ionicLoading.hide();
				});

				$scope.userSquad = {};
				$scope.userSquad.TeamName = teamName;
				$scope.userSquad.UserId = $scope.menuProfile.id;
				TeamService.addTeamToUser($scope.userSquad).success(function(data){
					// $ionicLoading.hide();
					console.log("sukses wahahah");
					// $state.go('app.team');
				}).error(function(data){
					// $ionicLoading.hide();
				});

				$scope.teamInfo = {};
				$scope.teamInfo.team_coach = $scope.menuProfile.username;
				TeamService.editTeamById(teamId, $scope.teamInfo).success(function(data) {
            		console.log(data);
                }).error(function(data) {});

				$scope.delInvitation = {};
				$scope.delInvitation.UserName = $scope.menuProfile.username;
				$scope.delInvitation.teamInvite = teamName;
				TeamService.delTeamInvitation($scope.delInvitation).success(function(data){
					// $ionicLoading.hide();
					console.log(data);
					// $state.go('app.team');
				}).error(function(data){
					// $ionicLoading.hide();
				});

				$scope.delInvitedMember = {};
				$scope.delInvitedMember.TeamName = teamName;
				$scope.delInvitedMember.userInvited = $scope.menuProfile.username;
				TeamService.delInvitedMember($scope.delInvitedMember).success(function(data){
					// $ionicLoading.hide();
					console.log("sukses ulelele");
					// $state.go('app.team');
				}).error(function(data){
					// $ionicLoading.hide();
				});
				// $state.go('app.my_team');   
				
            	$state.go($state.current, {}, {
                    reload: true
                });
            	
	        } else {
	            console.log('Not sure!');
	        }
	    });   
	};
	$scope.delTeamInvitation = function(teamName) {

		console.log(teamName);

		var confirmPopup = $ionicPopup.confirm({
			title: 'Decline Invitation',
			template: 'Are you sure?'
		});
		confirmPopup.then(function(res) {
	        if(res) {
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

				$scope.delInvitedMember = {};
				$scope.delInvitedMember.TeamName = teamName;
				$scope.delInvitedMember.userInvited = $scope.menuProfile.username;
				TeamService.delInvitedMember($scope.delInvitedMember).success(function(data){
					// $ionicLoading.hide();
					console.log("sukses ulelele");
					// $state.go('app.team');
				}).error(function(data){
					// $ionicLoading.hide();
				});
				// $state.go('app.my_team'); 
				$state.go($state.current, {}, {
                    reload: true
                });
				$scope.getTeamInvitationTimer = setInterval($scope.getTeamInvitation, 1000);
	        } else {
	            console.log('Not sure!');
	        }
	    });   
	};
	$scope.delUserFromInvitedMember = function(teamName) {
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

		$scope.delInvitedMember = {};
		$scope.delInvitedMember.TeamName = teamName;
		$scope.delInvitedMember.userInvited = $scope.menuProfile.username;
		TeamService.delInvitedMember($scope.delInvitedMember).success(function(data){
			// $ionicLoading.hide();
			console.log("sukses ulelele");
			// $state.go('app.team');
		}).error(function(data){
			// $ionicLoading.hide();
		});
	};
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
		$state.go('app.searchCoach');
	};
	$scope.searchPlayer = function() {
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

.controller('SearchCtrl', function($scope, $state, $ionicPopup, $ionicPlatform, $ionicLoading, TeamService, $stateParams) {
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
		$scope.formTeam = {};
		$scope.dataMember = {};
		$scope.dataTeam = {};

        $scope.searchData = function() {
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
                $scope.inviteStatus = false;
                $scope.joinStatus = false;
                for (var item in $scope.search.player) {
                    $scope.playerArr.push($scope.search.player[item]);
                   	$scope.formMember.Username = $scope.search.player[item].username;
                   	$scope.formTeam.UserId = $scope.search.player[item].id;

                   	TeamService.getTeamById(localStorage.getItem("myTeamId"),localStorage.getItem("token")).success(function(data) {
						console.log(data);
						$ionicLoading.hide();
						$scope.team = data;
						$scope.invitedMember = $scope.team.invited_member.split(",");
						$scope.joinedMember = $scope.team.team_squad.split(",");
						for(var i = 0; i < $scope.invitedMember.length; i++){
							if($scope.search.player[item].username == $scope.invitedMember[i]){
								$scope.inviteStatus = true;
								console.log("invited");
							}
						}
						for(var j = 0; j < $scope.joinedMember.length; j++){
							if($scope.search.player[item].username == $scope.joinedMember[j]){
								$scope.joinStatus = true;
								console.log("joined");
							}
						}
						$scope.formMember.TeamId = $scope.team.id;
                   		$scope.formTeam.TeamName = $scope.team.team_name;

					}).error(function(data) {
						$ionicLoading.hide();
					});
                }

                for (var item in $scope.search.coach) {
                    $scope.coachArr.push($scope.search.coach[item]);
                   	$scope.formMember.Username = $scope.search.coach[item].username;
                   	$scope.formTeam.UserId = $scope.search.coach[item].id;

                   	TeamService.getTeamById(localStorage.getItem("myTeamId"),localStorage.getItem("token")).success(function(data) {
						console.log(data);
						$ionicLoading.hide();
						$scope.team = data;
						$scope.invitedMember = $scope.team.invited_member.split(",");
						$scope.joinedMember = $scope.team.team_coach;
						for(var i = 0; i < $scope.invitedMember.length; i++){
							if($scope.search.coach[item].username == $scope.invitedMember[i]){
								$scope.inviteStatus = true;
								console.log("invited");
							}
						}
						for(var j = 0; j < $scope.joinedMember.length; j++){
							if($scope.search.coach[item].username == $scope.joinedMember[j]){
								$scope.joinStatus = true;
								console.log("joined");
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

					var confirmPopup = $ionicPopup.confirm({
						title: 'Invite Memberss',
						template: 'Are you sure?'
					});
					confirmPopup.then(function(res) {
				        if(res) {
				            console.log('Sure!');
				            TeamService.addInvitedMember($scope.formMember).success(function(data){
								// $ionicLoading.hide();
								console.log("sukses yataa");
								// $state.go('app.team');
							}).error(function(data){
								// $ionicLoading.hide();
							});

							TeamService.addTeamInvitation($scope.formTeam).success(function(data){
								// $ionicLoading.hide();
								console.log("berhasil wahuuu");
								// $state.go('app.team');
							}).error(function(data){
								// $ionicLoading.hide();
							});
							$state.go('app.my_team');    
				         } else {
				            console.log('Not sure!');
				         }
				    });               
				};

				$scope.JoinTeam = function(){
					console.log($scope.dataMember);
                   	console.log($scope.dataTeam);

                   	var confirmPopup = $ionicPopup.confirm({
						title: 'Join Team',
						template: 'Are you sure?'
					});
					confirmPopup.then(function(res) {
				        if(res) {
				            console.log('Sure!');
				            TeamService.addRequestedTeam($scope.dataTeam).success(function(data){
								$ionicLoading.hide();
								console.log("sukses yataa");
								// $state.go('app.team');
							}).error(function(data){
								$ionicLoading.hide();
							});

							TeamService.addPlayerRequest($scope.dataMember).success(function(data){
								$ionicLoading.hide();
								console.log("berhasil wahuuu");
								// $state.go('app.team');
							}).error(function(data){
								$ionicLoading.hide();
							});       
				        } else {
				            console.log('Not sure!');
				        }
				    }); 
				    var alertPopup = $ionicPopup.alert({
	                    title: 'Request Team To Join',
	                    template: 'Your request has been send, please wait while the manager review it'
	                });   
	                $state.go('app.my_team');                  
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

        $scope.topPlayerData = [];
        $scope.highestPoint = 0;
        $scope.index = 0;
        $scope.playerData = [];

        TeamService.getPlayer().success(function(data){
			$scope.playerData = data;

			while($scope.playerData.length != 0){
			    for(var i = 0; i < $scope.playerData.length; i++){
			    	if($scope.playerData[i].goal == null || $scope.playerData[i].assist == null){
			    		console.log("null");
			    	}else{
				        if(parseInt($scope.playerData[i].goal) + parseInt($scope.playerData[i].assist) > $scope.highestPoint){
				            $scope.highestPoint = parseInt($scope.playerData[i].goal) + parseInt($scope.playerData[i].assist);
				            $scope.index = i;
				        }
				    }    
			    }
			    $scope.topPlayerData.push($scope.playerData[$scope.index]);
			    $scope.playerData.splice($scope.index,1);
			    console.log($scope.playerData.length);
			    $scope.highestPoint = 0;
			}
			$scope.topPlayerData.length = Math.min($scope.topPlayerData.length, 5)
			console.log($scope.topPlayerData);

		}).error(function(data){});

        $scope.backToMyTeam = function(){
        	$state.go('app.my_team');
        }
        $scope.userDetail = function(username) {
	    // Go to user detail page
	        $state.go('app.userDetail', {
	            'username': username
	        });
	    };
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
    $scope.teamSquadArr = [];

    if($scope.menuProfile.team !== ''){
		TeamService.getTeamSquad($scope.menuProfile.team).success(function(data){
			data.forEach(function(item){
				console.log(item.username);
				if(item.username !== localStorage.getItem("username")){
					$scope.teamSquadArr.push(item);
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
		// go to search coach page
		$state.go('app.searchCoach');
	}

	// search player
	$scope.searchPlayer = function(){
		// go to search coach page
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

	// build a string with random characters
	for(var i = 1; i < stringlength; i++){
		var rndNum = Math.ceil(Math.random() * stringArray.length) - 1;
		rndString = rndString + stringArray[rndNum];
	} 


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
	TeamService.getTeamByName(localStorage.getItem("team")).success(function(data){
		console.log(data);
		$scope.team = data;
		
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
	}).error(function(data) {	 
		$ionicLoading.hide();
	});

 	$scope.goToScheduleDetail = function(id){
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

	$scope.backToSchedule = function(id) { // kembali ke halaman home
		$state.go('app.complete_scheduling', {
			'competitionId': id
		});
	};
	$scope.editMatch = function(id) { // kembali ke halaman home
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
		if(data.match_homeTeam === localStorage.getItem("team")){
			console.log("Home");
			localStorage.setItem('teamStatus', "Home");
		}else{
			console.log("Away");
			localStorage.setItem('teamStatus', "Away");
		}
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

		$scope.lineupData = {};

		if(localStorage.getItem("teamStatus") === "Home"){
			$scope.lineupData.match_homeTeamObj = {};
			$scope.lineupData.match_homeTeamObj.team_name = localStorage.getItem("team");
			$scope.lineupData.match_homeTeamObj.formation = localStorage.getItem("formation");
			$scope.lineupData.match_homeTeamObj.lineup = lineupArr;
			$scope.lineupData.match_homeTeamObj.player = lineupArr;
			$scope.lineupData.match_homeTeamObj.sub = $scope.substitute;
		}else{
			$scope.lineupData.match_awayTeamObj = {};
			$scope.lineupData.match_awayTeamObj.team_name = localStorage.getItem("team");
			$scope.lineupData.match_awayTeamObj.formation = localStorage.getItem("formation");
			$scope.lineupData.match_awayTeamObj.lineup = lineupArr;
			// pas substitute, player in ditambah ke data player
			$scope.lineupData.match_awayTeamObj.player = lineupArr;
			// pas substitute, player in ditambah ke data player
			$scope.lineupData.match_awayTeamObj.sub = $scope.substitute;
		}
		
		MatchService.editMatchById($stateParams.matchId,localStorage.getItem("token"),$scope.lineupData).success(function(data) {
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
	// $ionicLoading.show({
	// 	content: 'Login...',
	// 	animation: 'fade-in',
	// 	showBackdrop: true,
	// });
	var ls = localStorage;
	var date = new Date();
	$scope.day = date.getDate();
	$scope.month = date.getMonth();
	$scope.monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	$scope.monthName = $scope.monthNames[$scope.month];
    $scope.year = date.getFullYear();
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
	$scope.myCompetitionId = ls.getItem("myCompetitionId");

	$scope.myCompetitionArr = ls.getItem("myCompetitionId").split(",");

	if(ls.getItem("myCompetitionId") !== 'null'){

		// get live matches
		// $scope.liveCompetitions = {};
		$scope.liveMatchArr = [];
		$scope.allLiveMatchesArr = [];
		$scope.allLiveMatchesObj = {
			"competition_name": [],
			"matches": []
		}
		var liveMatchLoop = 1;
		// fungsi ini harus di looping terus karena datanya akan ditampilkan secara real-time
		// bikin interval waktu utk looping fungsi ini
		$scope.myCompetitionArr.forEach(function(competition){
			$ionicLoading.show();
			CompetitionService.getCompetitionByCompIdAndLiveStat(competition,ls.getItem("token")).success(function(data) {
				// $scope.liveCompetitions = data;
				// console.log($scope.liveCompetitions);
				console.log(data);
				if(data.length !== 0){
					// $scope.allLiveMatchesArr = $scope.liveMatchArr.concat(data);
					if($scope.allLiveMatchesObj.competition_name.indexOf(competition) !== -1){

					}else{
						$scope.allLiveMatchesObj.competition_name.push(competition);
					}
					// $scope.allLiveMatchesObj.matches = $scope.matchesArr.concat(data);
					$scope.allLiveMatchesObj.matches.push(data);
				}

				console.log($scope.allLiveMatchesObj);
			}).error(function(data) {});
			liveMatchLoop++;
			if(liveMatchLoop === $scope.myCompetitionArr.length){
				setTimeout(function() {
		             $ionicLoading.hide();
		        }, 2000);				
			}
		});

		console.log("masukk");
		console.log($scope.myCompetitionArr);
		$scope.myCompetitionArr.forEach(function(competition){
			CompetitionService.getCompetitionById(competition,ls.getItem("token")).success(function(data) {
				$scope.competition = data;
				console.log($scope.competition);
			}).error(function(data) {});
		});

		$scope.matchesArr = [];
		$scope.allMatches = [];
		var loop = 1;
		$scope.allMatchesObj = {
			"competition_name": [],
			"matches": []
		}
		$scope.myCompetitionArr.forEach(function(competition){
			$ionicLoading.show();
			CompetitionService.getCompetitionByDate(competition,$scope.matchDate,ls.getItem("token")).success(function(data) {
				// $scope.matches = data;
				// console.log(data);
				// if(data.length !== 0){
				// 	$scope.allMatches = $scope.matchesArr.concat(data);	
				// }
				
				// console.log($scope.allMatches);
				// console.log("berhasil");

				if(data.length !== 0){
					// $scope.allMatches = $scope.matchesArr.concat(data);
					if($scope.allMatchesObj.competition_name.indexOf(competition) !== -1){

					}else{
						$scope.allMatchesObj.competition_name.push(competition);
					}
					// $scope.allMatchesObj.matches = $scope.matchesArr.concat(data);
					$scope.allMatchesObj.matches.push(data);
				}
				
				console.log($scope.allMatchesObj);

				console.log("berhasil");
				for(var m = 0; m < $scope.allMatchesObj.length; m++){
					$scope.allMatchesObj[m].match_date = new Date($scope.allMatchesObj[m].match_date);
					console.log($scope.allMatchesObj[m].match_date);
				}
				$ionicLoading.hide();
			}).error(function(data) {
				console.log("gagal");
			});
			loop++
			if(loop === $scope.myCompetitionArr.length){
				setTimeout(function() {
		             $ionicLoading.hide();
		        }, 2000);				
			}
		});

	}else if (ls.getItem("myCompetitionId") === 'null') { 
		$ionicLoading.hide();
	}	


	$scope.backToHome = function(){
		$state.go('app.home');
	}
	
		$scope.next = function(){
			console.log("next");
			$scope.showme = 2;
			// $rootScope.showLoading($ionicLoading);
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
			console.log(localStorage.getItem("myCompetitionId"));
			console.log($scope.myCompetitionArr);

			$scope.matchesArr = [];
			$scope.allMatches = [];
			var nextLoop = 1;
			$scope.allMatchesObj = {
				"competition_name": [],
				"matches": []
			}

			$scope.myCompetitionArr.forEach(function(competition){
				$ionicLoading.show();
				CompetitionService.getCompetitionByDate(competition,$scope.matchDate,ls.getItem("token")).success(function(data) {
					// $scope.matches = data
					console.log(data);

					// create algorithm to sort the data by property match_time
					//
					//
					//

					if(data.length !== 0){
						// $scope.allMatches = $scope.matchesArr.concat(data);
						if($scope.allMatchesObj.competition_name.indexOf(competition) !== -1){

						}else{
							$scope.allMatchesObj.competition_name.push(competition);
						}
						// $scope.allMatchesObj.matches = $scope.matchesArr.concat(data);
						$scope.allMatchesObj.matches.push(data);
					}
					
					console.log($scope.allMatchesObj);

					// for(var i = 0; i < $scope.allMatchesObj.matches.length; i++){
					// 	console.log($scope.allMatchesObj.matches[i]);
					// 	$scope.allMatchesObj.matches[i].forEach(function(m1){
					// 		console.log(m1.match_time);
					// 	})	
					// }

					// $scope.allMatchesObj.matches.forEach(function(m){
					// 	console.log(m);
					// 	// find algorithm to sort two or more different competition matches by it's match_time
					// 	// how ???????
					// 	// there are two completely different array and then there are outside array that depend on the inside array 
					// 	// ...
					// 	// ga usah aja
					// 	// sort berdasarkan kompetisi aja
					// })

					console.log("berhasil");
					for(var m = 0; m < $scope.allMatchesObj.length; m++){
						$scope.allMatchesObj[m].match_date = new Date($scope.allMatchesObj[m].match_date);
						console.log($scope.allMatchesObj[m].match_date);
					}
					$ionicLoading.hide();
				}).error(function(data) {
					console.log("gagal");
				});
				nextLoop++
				if(nextLoop === $scope.myCompetitionArr.length){
					setTimeout(function() {
			             $ionicLoading.hide();
			        }, 2000);			
				}
			});

		};

		$scope.prev = function(){
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
			console.log(ls.getItem("myCompetitionId"));

			$scope.matchesArr = [];
			$scope.allMatches = [];
			var prevLoop = 0;
			$scope.myCompetitionArr.forEach(function(competition){
				$ionicLoading.show();
				CompetitionService.getCompetitionByDate(competition,$scope.matchDate,ls.getItem("token")).success(function(data) {
					// $scope.matches = data;
					// console.log(data);
					// if(data.length !== 0){
					// 	$scope.allMatches = $scope.matchesArr.concat(data);	
					// }
					
					// console.log($scope.allMatches);
					// console.log("berhasil");
					// for(var m = 0; m < $scope.allMatches.length; m++){
					// 	$scope.allMatches[m].match_date = new Date($scope.allMatches[m].match_date);
					// 	console.log($scope.allMatches[m].match_date);
					// }

				if(data.length !== 0){
					// $scope.allMatches = $scope.matchesArr.concat(data);
					if($scope.allMatchesObj.competition_name.indexOf(competition) !== -1){

					}else{
						$scope.allMatchesObj.competition_name.push(competition);
					}
					// $scope.allMatchesObj.matches = $scope.matchesArr.concat(data);
					$scope.allMatchesObj.matches.push(data);
				}
				
				console.log($scope.allMatchesObj);

				console.log("berhasil");
				for(var m = 0; m < $scope.allMatchesObj.length; m++){
					$scope.allMatchesObj[m].match_date = new Date($scope.allMatchesObj[m].match_date);
					console.log($scope.allMatchesObj[m].match_date);
				}
				$ionicLoading.hide();
				}).error(function(data) {
					console.log("gagal");
				});
				prevLoop++
				if(prevLoop === $scope.myCompetitionArr.length){
					setTimeout(function() {
			             $ionicLoading.hide();
			        }, 1200);				
				}
				console.log($scope.myCompetitionArr.length);
				console.log(prevLoop);
			});

		};
})
.controller('CompetitionScheduleCtrl', function($scope, $stateParams, $rootScope, $ionicPopup, $ionicTabsDelegate, $ionicLoading, $ionicPopover, $state, MatchService, ClassementService, TeamService, FixtureService, CompetitionService) {
	var ls = localStorage;
	$rootScope.showLoading($ionicLoading);
	
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

	ClassementService.getClassementsByCompetitionId($stateParams.competitionId,ls.getItem("token")).success(function(data) {
		$scope.classementsDataObj = data;
		// $scope.numOfGroups = data.length / 4;
		// console.log($scope.numOfGroups);

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
			}
		})

		// for(var i = 0; i < $scope.numOfGroups; i++){
		// 	var chr = String.fromCharCode(65 + (i));	
		// 	$scope.groupArr.push(chr);
		// }
		// console.log($scope.groupArr);

		// console.log($scope.groupA);

	}).error(function(data) {});

	// $scope.group = 'A';
	// $scope.changeGroup = function(group){
	// 	console.log(group);
	// 	$scope.group = group;
	// }

	// classement data (hard code)
	$scope.classementsArr = [
		{position: "1", teamName: "Team 001", play: "0", win: "0", draw: "0", lose: "0", goalDiff: "0", points: "0"},
		{position: "2", teamName: "Team 002", play: "0", win: "0", draw: "0", lose: "0", goalDiff: "0", points: "0"},
		{position: "3", teamName: "Team 003", play: "0", win: "0", draw: "0", lose: "0", goalDiff: "0", points: "0"},
		{position: "4", teamName: "Team 004", play: "0", win: "0", draw: "0", lose: "0", goalDiff: "0", points: "0"},
		{position: "5", teamName: "Team 005", play: "0", win: "0", draw: "0", lose: "0", goalDiff: "0", points: "0"},
		{position: "6", teamName: "Team 006", play: "0", win: "0", draw: "0", lose: "0", goalDiff: "0", points: "0"},
		{position: "7", teamName: "Team 007", play: "0", win: "0", draw: "0", lose: "0", goalDiff: "0", points: "0"},
	];
	console.log($scope.classementsArr[0].teamName);
	// classement data (from database)
	// get data team by competition
	// ??????
	// create function to get team detail (position, play, win, draw, lose, gf, point, etc) by competition id

	console.log($stateParams.competitionId);
 	$scope.competition = {};
 	$scope.numOfFixtures = 0;
 	$scope.fixturesArr = [];
 	$scope.firstFixture = 0;
 	$scope.lastFixture = 0;
 	$scope.matches = {};
 	$scope.knockoutMatches = {};
 	$scope.kmLength = "";

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

		// $scope.classementForm.id = "CL" + rndString;
		// $scope.classementForm.position = $scope.team.team_position;
		// $scope.classementForm.team = $scope.team.team_name;
		// $scope.classementForm.play = $scope.team.team_play;
		// $scope.classementForm.win = $scope.team.team_win;
		// $scope.classementForm.draw = $scope.team.team_draw;
		// $scope.classementForm.lose = $scope.team.team_lose;
		// $scope.classementForm.goalDifference = $scope.team.goalFor - $scope.team.goalAgainst;
		// $scope.classementForm.points = $scope.team.team_point;
		// $scope.classementForm.competition_id = $stateParams.competitionId;
		// $scope.classementForm.status = "Created";
		// ClassementService.addClassement($scope.classementForm).success(function(data) {
		// 	$ionicLoading.hide();
		// 	console.log(data);
		// 	$rootScope.showPopup($ionicPopup,'Success!','Berhasil Membuat Klasemen');
		// }).error(function(data) {
		// 	$ionicLoading.hide();
		// 	$rootScope.showPopup($ionicPopup,'Post Data Failed!','Gagal Membuat Klasemen');
		// });

		// ClassementService.getClassementsByCompetition($stateParams.competitionId,ls.getItem("token")).success(function(data) {
		// 	$scope.classements = data;
		// 	$ionicLoading.hide();
		// 	console.log($scope.classements);

		// 	for(var t = 0; t < $scope.compTeam.length; t++){
		// 		console.log($scope.compTeam[t]);
		// 		TeamService.getTeamByName($scope.compTeam[t]).success(function(data){
		// 			console.log(data);
		// 			$scope.team = data;
		// 		// insert to classement
		// 		if($scope.classements.status == "" || $scope.classements.status === null){
		// 			if($scope.team !== null){
		// 				$scope.classementForm.id = "CL" + rndString;
		// 				$scope.classementForm.position = $scope.team.team_position;
		// 				$scope.classementForm.team = $scope.team.team_name;
		// 				$scope.classementForm.play = $scope.team.team_play;
		// 				$scope.classementForm.win = $scope.team.team_win;
		// 				$scope.classementForm.draw = $scope.team.team_draw;
		// 				$scope.classementForm.lose = $scope.team.team_lose;
		// 				$scope.classementForm.goalDifference = $scope.team.goalFor - $scope.team.goalAgainst;
		// 				$scope.classementForm.points = $scope.team.team_point;
		// 				$scope.classementForm.competition_id = $stateParams.competitionId;
		// 				$scope.classementForm.status = "Created";

		// 				ClassementService.addClassement($scope.classementForm).success(function(data) {
		// 					$ionicLoading.hide();
		// 					console.log(data);
		// 					$rootScope.showPopup($ionicPopup,'Success!','Berhasil Membuat Klasemen');
		// 				}).error(function(data) {
		// 					$ionicLoading.hide();
		// 					$rootScope.showPopup($ionicPopup,'Post Data Failed!','Gagal Membuat Klasemen');
		// 				});
		// 			}
		// 		}	
		// 		console.log($scope.classementForm);	
		// 			// insert to classement
		// 			// $ionicLoading.hide();
		// 		}).error(function(data) {
		// 			// $ionicLoading.hide();
		// 		});
		// 	}

		// }).error(function(data) {
		// 	console.log("gagal");
			$ionicLoading.hide();
		// });	

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
	 	if($scope.competition.comp_type == 'GroupStage'){
		 	CompetitionService.getMatchesByFixture($stateParams.competitionId,$scope.fixtureNumber,ls.getItem("token")).success(function(data) {
				$scope.matches = data;
				console.log($scope.matches);
				for(var m = 0; m < $scope.matches.length; m++){
					$scope.matches[m].match_date = new Date($scope.matches[m].match_date);
					console.log($scope.matches[m].match_date);
				}
				// $ionicLoading.hide();
			}).error(function(data) {
				console.log("gagal");
			});
		}
		// Group Stage	

		// Knockout System
		if($scope.competition.comp_type == 'KnockoutSystem'){
			CompetitionService.getMatchesByMatchStatus($stateParams.competitionId,$scope.match_status,ls.getItem("token")).success(function(data) {
				$scope.knockoutMatches = data;
				console.log($scope.knockoutMatches);
				for(var m = 0; m < $scope.knockoutMatches.length; m++){
					$scope.knockoutMatches[m].match_date = new Date($scope.knockoutMatches[m].match_date);
					console.log($scope.knockoutMatches[m].match_date);
				}
				// $ionicLoading.hide();
			}).error(function(data) {
				console.log("gagal");
			});
		}
		// Knockout System

		// Combination
	 	if($scope.competition.comp_type == 'Combination'){
		 	CompetitionService.getMatchesByFixture($stateParams.competitionId,$scope.fixtureNumber,ls.getItem("token")).success(function(data) {
				$scope.matches = data;
				console.log($scope.matches);
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
		$scope.next = function(){
			$rootScope.showLoading($ionicLoading);
			$scope.fixtureNumber += 1;
			if($scope.fixtureNumber > $scope.firstFixture){
				$scope.prevStatus = true;
			}
			if($scope.fixtureNumber >= $scope.lastFixture){
				$scope.nextStatus = false;
			}
			CompetitionService.getMatchesByFixture($stateParams.competitionId,$scope.fixtureNumber,ls.getItem("token")).success(function(data) {
				$scope.matches = data;
				console.log($scope.matches);
				for(var m = 0; m < $scope.matches.length; m++){
					$scope.matches[m].match_date = new Date($scope.matches[m].match_date);
					console.log($scope.matches[m].match_date);
				}
				$ionicLoading.hide();
			}).error(function(data) {
				console.log("gagal");
			});
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
			CompetitionService.getMatchesByFixture($stateParams.competitionId,$scope.fixtureNumber,ls.getItem("token")).success(function(data) {
				$scope.matches = data;
				console.log($scope.matches);
				for(var m = 0; m < $scope.matches.length; m++){
					$scope.matches[m].match_date = new Date($scope.matches[m].match_date);
					console.log($scope.matches[m].match_date);
				}
				$ionicLoading.hide();
			}).error(function(data) {
				console.log("gagal");
			});
		};
		// Group Stage

		// Knockout System
		$scope.knockoutNext = function(){
			$rootScope.showLoading($ionicLoading);
			if($scope.competition.comp_numOfTeam == 32){
				if($scope.match_status == 'Play Off'){
					$scope.match_status = 'Eighth Final';
					$scope.prevStatus = true;
				}else if($scope.match_status == 'Eighth Final'){
					$scope.match_status = 'Quarter Final';
				}else if($scope.match_status == 'Quarter Final'){
					$scope.match_status = 'Semi Final';
				}else if($scope.match_status == 'Semi Final'){
					$scope.match_status = 'Final';
					$scope.nextStatus = false;
				}
			}else
			if($scope.competition.comp_numOfTeam == 16){
				if($scope.match_status == 'Play Off'){
					$scope.match_status = 'Quarter Final';
					$scope.prevStatus = true;
				}else if($scope.match_status == 'Quarter Final'){
					$scope.match_status = 'Semi Final';
				}else if($scope.match_status == 'Semi Final'){
					$scope.match_status = 'Final';
					$scope.nextStatus = false;
				}
			}else
			if($scope.competition.comp_numOfTeam == 8){
				if($scope.match_status == 'Play Off'){
					$scope.match_status = 'Semi Final';
					$scope.prevStatus = true;
				}else if($scope.match_status == 'Semi Final'){
					$scope.match_status = 'Final'
					$scope.nextStatus = false;
				}
			}
			CompetitionService.getMatchesByMatchStatus($stateParams.competitionId,$scope.match_status,ls.getItem("token")).success(function(data) {
				$scope.knockoutMatches = data;
				$scope.kmLength = $scope.knockoutMatches.length;
				console.log($scope.kmLength);
				for(var m = 0; m < $scope.knockoutMatches.length; m++){
					$scope.knockoutMatches[m].match_date = new Date($scope.knockoutMatches[m].match_date);
					console.log($scope.knockoutMatches[m].match_date);
				}
				$ionicLoading.hide();
			}).error(function(data) {
				console.log("gagal");
			});
		};
		$scope.knockoutPrev = function(){
			$rootScope.showLoading($ionicLoading);
			if($scope.competition.comp_numOfTeam == 32){
				if($scope.match_status == 'Final'){
					$scope.match_status = 'Semi Final';
					$scope.nextStatus = true;
				}else if($scope.match_status == 'Semi Final'){
					$scope.match_status = 'Quarter Final';
				}else if($scope.match_status == 'Quarter Final'){
					$scope.match_status = 'Eighth Final';
				}else if($scope.match_status == 'Eighth Final'){
					$scope.match_status = 'Play Off';
					$scope.prevStatus = false;
				}
			}else
			if($scope.competition.comp_numOfTeam == 16){
				if($scope.match_status == 'Final'){
					$scope.match_status = 'Semi Final';
					$scope.nextStatus = true;
				}else if($scope.match_status == 'Semi Final'){
					$scope.match_status = 'Quarter Final';
				}else if($scope.match_status == 'Quarter Final'){
					$scope.match_status = 'Play Off';
					$scope.prevStatus = false;
				}
			}
			if($scope.competition.comp_numOfTeam == 8){
				if($scope.match_status == 'Final'){
					$scope.match_status = 'Semi Final';
					$scope.nextStatus = true;
				}else if($scope.match_status == 'Semi Final'){
					$scope.match_status = 'Play Off';
					$scope.prevStatus = false;
				}
			}
			CompetitionService.getMatchesByMatchStatus($stateParams.competitionId,$scope.match_status,ls.getItem("token")).success(function(data) {
				$scope.knockoutMatches = data;
				console.log($scope.knockoutMatches);
				$scope.kmLength = $scope.knockoutMatches.length;
				console.log($scope.kmLength);
				for(var m = 0; m < $scope.knockoutMatches.length; m++){
					$scope.knockoutMatches[m].match_date = new Date($scope.knockoutMatches[m].match_date);
					console.log($scope.knockoutMatches[m].match_date);
				}
				$ionicLoading.hide();
			}).error(function(data) {
				console.log("gagal");
			});
		};
		// Knockout System
	}).error(function(data) {});
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