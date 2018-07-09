angular.module('starter', ['ionic', 'ionic-material', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform,$rootScope,$ionicLoading) {
	$ionicPlatform.ready(function() {
		if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
			cordova.plugins.Keyboard.disableScroll(true);
		}
		if (window.StatusBar) {
			StatusBar.styleLightContent();
		}
	});
	$rootScope.showLoading = function() {
       	$ionicLoading.show({
			content: 'Login...',animation: 'fade-in',showBackdrop: true,
		});
    };
    $rootScope.showPopup = function(p,title,template,cssClass) {
       	p.alert({
			title: title,template: template,cssClass: cssClass 
		});
    };
    $rootScope.reload = function(state,scope) {
    	setTimeout(function() {
    		state.go(state.current, {}, {
    			reload: true
    		});
    	}, 500);
    	console.log("refresh");
    	scope.$broadcast('scroll.refreshComplete');
    };
    // generate random strings
    var stringlength = 15,
		stringArray = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
		rndString = "";

    $rootScope.generateRandomString = function(){
		var rndNum = Math.ceil(Math.random() * stringArray.length) - 1;
		rndString = rndString + stringArray[rndNum];
		  
		return rndString.substring(0,stringlength); // membatasi panjang string
	};
	$rootScope.randomString = stringArray.reduce($rootScope.generateRandomString);
	// generate random strings
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider,$compileProvider, $sceDelegateProvider) {
	$compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):|data:image\//);
	$sceDelegateProvider.resourceUrlWhitelist([
		// Allow same origin resource loads.
		'self',
		// Allow loading from our assets domain.  Notice the difference between * and **.
		'https://www.dropbox.com/**'
	]);
	$ionicConfigProvider.tabs.position('bottom');
// Enable Native Scrolling on Android
$ionicConfigProvider.platform.android.scrolling.jsScrolling(false);
$stateProvider
.state('login', {
	url: '/login',
	templateUrl: 'templates/Profile/login.html',
	controller: 'LoginCtrl'
})
.state('register', {
	url: '/register',
	templateUrl: 'templates/Profile/register.html',
	controller: 'RegisterCtrl'
})
.state('register2', {
	url: '/register2',
	templateUrl: 'templates/Profile/register2.html',
	controller: 'RegisterCtrl'
})
// setup an abstract state for the side menu directive
.state('app', {
	url: '/app',
	abstract: true,
	templateUrl: 'templates/Main/tabs.html',
	controller: 'MainCtrl'
})
// Each tab has its own nav history stack:
.state('app.home', {
	url: '/home',
	views: {
		'home': {
			templateUrl: 'templates/Main/home.html',
			controller: 'HomeCtrl'
		}
	}
})
.state('app.training', {
	url: '/training',
	views: {
		'home': {
			templateUrl: 'templates/Training/training.html',
			controller: 'TrainingCtrl'
		}
	}
})
.state('app.competition', {
	url: '/competition',
	views: {
		'home': {
			templateUrl: 'templates/Competition/competition.html',
			controller: 'CompetitionCtrl'
		}
	}
})
.state('app.competition_detail', {
	url: '/competition_detail/:competitionId',
	views: {
		'home': {
			templateUrl: 'templates/Competition/competition_detail.html',
			controller: 'CompetitionDetailCtrl'
		}
	}
})
.state('app.create_competition', {
	url: '/create_competition',
	views: {
		'home': {
			templateUrl: 'templates/Competition/create_competition.html',
			controller: 'CompetitionCtrl'
		}
	}
})
.state('app.create_training', {
	url: '/create_training',
	views: {
		'home': {
			templateUrl: 'templates/Training/create_training.html',
			controller: 'TrainingCtrl'
		}
	}
})
.state('app.edit_competition', {
	url: '/edit_competition/:competitionId',
	views: {
		'home': {
			templateUrl: 'templates/Competition/edit_competition.html',
			controller: 'EditCompetitionCtrl'
		}
	}
})
.state('app.create_team', {
	url: '/create_team',
	views: {
		'home': {
			templateUrl: 'templates/Team/create_team.html',
			controller: 'TeamCtrl'
		}
	}
})
.state('app.edit_team', {
	url: '/edit_team',
	views: {
		'home': {
			templateUrl: 'templates/Team/edit_team.html',
			controller: 'TeamCtrl'
		}
	}
})
.state('app.register_team', {
	url: '/register_team/:competitionId',
	views: {
		'home': {
			templateUrl: 'templates/Competition/register_team.html',
			controller: 'RegisterTeamCtrl'
		}
	}
})
.state('app.my_team', {
	url: '/my_team',
	views: {
		'home': {
			templateUrl: 'templates/Team/my_team.html',
			controller: 'MyTeamCtrl'
		}
	}
})
.state('app.schedule', {
	url: '/schedule',
	views: {
		'home': {
			templateUrl: 'templates/Schedule/schedule.html',
			controller: 'ScheduleCtrl'
		}
	}
})
.state('app.schedule_detail', {
	url: '/schedule_detail',
	views: {
		'home': {
			templateUrl: 'templates/Schedule/schedule_detail.html',
			controller: 'ScheduleDetailCtrl'
		}
	}
})
.state('app.complete_scheduling', {
	url: '/complete_scheduling/:competitionId',
	views: {
		'home': {
			templateUrl: 'templates/Schedule/complete_scheduling.html',
			controller: 'CompleteSchedulingCtrl'
		}
	}
})
.state('app.competition_schedule', {
	url: '/competition_schedule/:competitionId',
	views: {
		'home': {
			templateUrl: 'templates/Competition/competition_schedule.html',
			controller: 'CompetitionScheduleCtrl'
		}
	}
})
.state('app.fixture', {
	url: '/fixture/:id',
	views: {
		'home': {
			templateUrl: 'templates/Schedule/fixture.html',
			controller: 'FixtureCtrl'
		}
	}
})
.state('app.lineup', {
	url: '/lineup',
	views: {
		'home': {
			templateUrl: 'templates/Team/lineup.html',
			controller: 'LineUpCtrl'
		}
	}
})
.state('app.lineup_detail', {
	url: '/lineup_detail/:matchId',
	views: {
		'home': {
			templateUrl: 'templates/Team/lineup_detail.html',
			controller: 'LineUpDetailCtrl'
		}
	}
})
.state('app.substitute_players', {
	url: '/substitute_players/:matchId',
	views: {
		'home': {
			templateUrl: 'templates/Team/substitute_players.html',
			controller: 'SubstituteCtrl'
		}
	}
})
.state('app.classement', {
	url: '/classement',
	views: {
		'home': {
			templateUrl: 'templates/Classement/classement.html',
			controller: 'ClassementCtrl'
		}
	}
})
.state('app.classement_detail', {
	url: '/classement_detail',
	views: {
		'home': {
			templateUrl: 'templates/Classement/classement_detail.html',
			controller: 'ClassementDetailCtrl'
		}
	}
})
.state('app.team_detail', {
	url: '/team_detail/:teamId',
	views: {
		'home': {
			templateUrl: 'templates/Team/team_detail.html',
			controller: 'TeamDetailCtrl'
		}
	}
})
.state('app.team_info', {
	url: '/team_info',
	views: {
		'home': {
			templateUrl: 'templates/Team/team_info.html',
			controller: 'TeamInfoCtrl'
		}
	}
})
.state('app.leaderboard', {
  url: '/leaderboard',
  views: {
    'home': {
      templateUrl: 'templates/Profile/leaderboard.html',
      controller: 'LeaderboardCtrl'
    }
  }
})
.state('app.history', {
  url: '/history',
  views: {
    'home': {
      templateUrl: 'templates/Match/history.html',
      controller: 'HistoryCtrl'
    }
  }
})
.state('app.member_profile', {
	url: '/member_profile/:userId',
	views: {
		'home': {
			templateUrl: 'templates/Team/member_profile.html',
			controller: 'MemberProfileCtrl'
		}
	}
})
.state('app.chat', {
  url: '/chat',
  views: {
    'home': {
      templateUrl: 'templates/Chat/chat.html',
      controller: 'ChatCtrl'
    }
  }
})
.state('app.chat_detail', {
	url: '/chat_detail/:username',
	views: {
		'home': {
			templateUrl: 'templates/Chat/chat_detail.html',
			controller: 'ChatDetailCtrl'
		}
	}
})
.state('app.userDetail', {
	url: '/userDetail/:username',
	views: {
		'home': {
			templateUrl: 'templates/Profile/userDetail.html',
			controller: 'UserDetailCtrl'
		}
	}
})
.state('app.match_detail', {
	url: '/match_detail/:matchId',
	views: {
		'home': {
			templateUrl: 'templates/Match/match_detail.html',
			controller: 'MatchDetailCtrl'
		}
	}
})
.state('app.match_info', {
	url: '/match_info/:matchId',
	views: {
		'home': {
			templateUrl: 'templates/Match/match_info.html',
			controller: 'MatchInfoCtrl'
		}
	}
})
.state('app.track_score', {
	url: '/track_score/:matchId',
	views: {
		'home': {
			templateUrl: 'templates/Match/track_score.html',
			controller: 'EditMatchCtrl'
		}
	}
})
.state('app.live_score', {
	url: '/live_score',
	views: {
		'home': {
			templateUrl: 'templates/Match/live_score.html',
			controller: 'LiveScoreCtrl'
		}
	}
})
.state('app.edit_match', {
	url: '/edit_match/:matchId',
	views: {
		'home': {
			templateUrl: 'templates/Match/edit_match.html',
			controller: 'EditMatchCtrl'
		}
	}
})
.state('app.referee_rating', {
	url: '/referee_rating',
	views: {
		'home': {
			templateUrl: 'templates/Match/referee_rating.html',
			controller: 'RefereeRatingCtrl'
		}
	}
})
.state('app.player_rating', {
	url: '/player_rating',
	views: {
		'home': {
			templateUrl: 'templates/Match/player_rating.html',
			controller: 'PlayerRatingCtrl'
		}
	}
})
.state('app.profile', {
	url: '/profile',
	views: {
		'home': {
			templateUrl: 'templates/Profile/profile.html',
			controller: 'ProfileCtrl'
		}
	}
})
.state('app.edit_profile', {
	url: '/edit_profile',
	views: {
		'home': {
			templateUrl: 'templates/Profile/edit_profile.html',
			controller: 'ProfileCtrl'
		}
	}
})
.state('app.complete_profile', {
	url: '/complete_profile',
	views: {
		'home': {
			templateUrl: 'templates/Profile/complete_profile.html',
			controller: 'CompleteProfileCtrl'
		}
	}
})
.state('app.forgot_password', {
	url: '/forgot_password',
	views: {
		'home': {
			templateUrl: 'templates/Profile/forgot_password.html',
			controller: 'Forgot_passwordCtrl'
		}
	}
})
.state('app.change_password', {
	url: '/change_password',
	views: {
		'home': {
			templateUrl: 'templates/Profile/change_password.html',
			controller: 'ProfileCtrl'
		}
	}
})
// .state('app.modal', {
//   url: '/modal',
//   views: {
//     'home': {
//       templateUrl: 'templates/modal.html',
//       controller: 'TeamCtrl'
//     }
//   }
// })
.state('app.searchPlayer', {
  url: '/searchPlayer',
  views: {
    'home': {
      templateUrl: 'templates/Team/searchPlayer.html',
      controller: 'SearchCtrl'
    }
  }
})
.state('app.searchCoach', {
  url: '/searchCoach',
  views: {
    'home': {
      templateUrl: 'templates/Team/searchCoach.html',
      controller: 'SearchCtrl'
    }
  }
})
.state('app.searchTeam', {
  url: '/searchTeam',
  views: {
    'home': {
      templateUrl: 'templates/Team/searchTeam.html',
      controller: 'SearchCtrl'
    }
  }
})
.state('app.about', {
	url: '/about',
	views: {
		'home': {
			templateUrl: 'templates/About/about.html',
			controller: 'MainCtrl'
		}
	}
});
// if none of the above states are matched, use this as the fallback
$urlRouterProvider.otherwise('/app/home');
});
