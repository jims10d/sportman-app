angular.module('starter.services', [])

.value('PARSE_CREDENTIALS', {
	APP_ID: 'xhTpJiNedJ7mmDj3LTTBUePqSVegcJHzEbh70Y0Q',
	REST_API_KEY: 'XCfQDPODgNB1HqmaCQgKLPWGxQ0lCUxqffzzURJY'
})

.value('BACKEND', {
	// Fill backend url here
	URL: 'https://sportman-loopback.mybluemix.net/api/'
})

.service('LoginService', function($http, PARSE_CREDENTIALS, BACKEND, $q) {
		return {
			loginUser: function(username, password) {
				var deferred = $q.defer();
				var promise = deferred.promise;
				var data = "username=" + username + "&password=" + password;
				$http.post(BACKEND.URL + 'users/login', data, {
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				}).success(function(response) {
					deferred.resolve(response);
				}).error(function(response, error) {
					if (error == 500) {
						deferred.reject('Periksa kembali username dan password anda.');
					} else {
						deferred.reject('Harap coba kembali beberapa saat lagi.');
					}
				});
				promise.success = function(fn) {
					promise.then(fn);
					return promise;
				};
				promise.error = function(fn) {
					promise.then(null, fn);
					return promise;
				};
				return promise;
			},
			getUser: function(id, token) {
				var deferred = $q.defer();
				var promise = deferred.promise;
				$http.get(BACKEND.URL + '/users/' + id + '?access_token=' + token).success(function(response) {
					deferred.resolve(response);
				}).error(function(response) {
					deferred.reject(response);
				});
				promise.success = function(fn) {
					promise.then(fn);
					return promise;
				};
				promise.error = function(fn) {
					promise.then(null, fn);
					return promise;
				};
				return promise;
			},
			getUserByUsername: function(username) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http.get(BACKEND.URL + '/users/getUser?username=' + username).success(function(response) {
                    deferred.resolve(response);
                }).error(function(response) {
                    deferred.reject(response);
                });
                promise.success = function(fn) {
                    promise.then(fn);
                    return promise;
                };
                promise.error = function(fn) {
                    promise.then(null, fn);
                    return promise;
                };
                return promise;
            },
			editPassword: function(id, token, data) {
				var deferred = $q.defer();
				var promise = deferred.promise;
				$http.put(BACKEND.URL + '/users/' + id + '?access_token=' + token, data, {
					headers: {
						'Content-Type': 'application/json'
					}
				}).success(function(response) {
					deferred.resolve(response);
				}).error(function(response, error) {
					if (error == 500) {
						deferred.reject(error);
					} else {
						deferred.reject(error);
					}
				});

				promise.success = function(fn) {
					promise.then(fn);
					return promise;
				};

				promise.error = function(fn) {
					promise.then(null, fn);
					return promise;
				};

				return promise;
			},
			changePassword: function(token, data) {
				var deferred = $q.defer();
				var promise = deferred.promise;
				$http.put(BACKEND.URL + 'users/updatePassword?access_token=' + token, data, {
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				}).success(function(response) {
					deferred.resolve(response);
				}).error(function(response, error) {
					if (error == 500) {
						deferred.reject(error);
					} else {
						deferred.reject(error);
					}
				});
				promise.success = function(fn) {
					promise.then(fn);
					return promise;
				};

				promise.error = function(fn) {
					promise.then(null, fn);
					return promise;
				};

				return promise;
			},
			editUser: function(id, token, data) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http.put(BACKEND.URL + '/users/' + id + '?access_token=' + token, data, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).success(function(response) {
                    deferred.resolve(response);
                }).error(function(response, error) {
                    if (error == 500) {
                        deferred.reject(error);
                    } else {
                        deferred.reject(error);
                    }
                });

                promise.success = function(fn) {
                    promise.then(fn);
                    return promise;
                };

                promise.error = function(fn) {
                    promise.then(null, fn);
                    return promise;
                };

                return promise;
            },
			uploadImage: function(data, path) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http.post('https://content.dropboxapi.com/2/files/upload', data, {
                    headers: {
                        'Content-Type': 'application/octet-stream',
                        'Authorization': 'Bearer THFdq05i5bIAAAAAAABcHFiqHtMgHgUnUuUvP185PVWh1kpXFuBojaGPCjCv4knn',
                        'Dropbox-API-Arg': '{"path":"' + path + '","mode":{".tag":"overwrite"}}'
                    }
                }).success(function(response) {
                    deferred.resolve(response);
                }).error(function(response, error) {

                    if (error == 500) {

                        deferred.reject(response);
                    } else {

                        deferred.reject(response);
                    }
                });
                promise.success = function(fn) {
                    promise.then(fn);
                    return promise;
                };
                promise.error = function(fn) {
                    promise.then(null, fn);
                    return promise;
                };
                return promise;
            },
            getImageLink: function(data) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http.post('https://api.dropboxapi.com/2/sharing/create_shared_link', data, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer THFdq05i5bIAAAAAAABcHFiqHtMgHgUnUuUvP185PVWh1kpXFuBojaGPCjCv4knn'
                    }
                }).success(function(response) {
                    deferred.resolve(response);
                }).error(function(response, error) {

                    if (error == 500) {

                        deferred.reject(response);
                    } else {

                        deferred.reject(response);
                    }
                });
                promise.success = function(fn) {
                    promise.then(fn);
                    return promise;
                };
                promise.error = function(fn) {
                    promise.then(null, fn);
                    return promise;
                };
                return promise;
            }
		};
})

.service('RegisterService', function($http, PARSE_CREDENTIALS, BACKEND, $q) {
	return {
		tambahUser: function(data) {
			var deferred = $q.defer();
			var promise = deferred.promise;

			$http.post(BACKEND.URL + 'users', data, {
				headers: {
					'Content-Type': 'application/json'
				}
			}).success(function(response) {
				deferred.resolve(response);
			}).error(function(response, error) {
				if (error == 500) {
					deferred.reject(response);
				} else {
					deferred.reject(response);
				}
			});
			promise.success = function(fn) {
				promise.then(fn);
				return promise;
			};
			promise.error = function(fn) {
				promise.then(null, fn);
				return promise;
			};
			return promise;
		}
	};
})

.service('ProfileService', function($http, PARSE_CREDENTIALS, BACKEND, $q) {
		return {
			getProfile: function(id, token) {
				var deferred = $q.defer();
				var promise = deferred.promise;
				$http.get(BACKEND.URL + '/users/' + id + '?access_token=' + token).success(function(response) {
					deferred.resolve(response);
				}).error(function(response) {
					deferred.reject(response);
				});
				promise.success = function(fn) {
					promise.then(fn);
					return promise;
				};
				promise.error = function(fn) {
					promise.then(null, fn);
					return promise;
				};
				return promise;
			},
			editProfileById: function(id, token, data) {
				var deferred = $q.defer();
				var promise = deferred.promise;
				$http.put(BACKEND.URL + '/users/' + id + '?access_token=' + token, data, {
					headers: {
						'Content-Type': 'application/json'
					}
				}).success(function(response) {
					deferred.resolve(response);
				}).error(function(response, error) {
					if (error == 500) {
						deferred.reject(error);
					} else {
						deferred.reject(error);
					}
				});

				promise.success = function(fn) {
					promise.then(fn);
					return promise;
				};

				promise.error = function(fn) {
					promise.then(null, fn);
					return promise;
				};

				return promise;
			},
			uploadImage: function(data, path) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http.post('https://content.dropboxapi.com/2/files/upload', data, {
                    headers: {
                        'Content-Type': 'application/octet-stream',
                        'Authorization': 'Bearer THFdq05i5bIAAAAAAABcHFiqHtMgHgUnUuUvP185PVWh1kpXFuBojaGPCjCv4knn',
                        'Dropbox-API-Arg': '{"path":"' + path + '","mode":{".tag":"overwrite"}}'
                    }
                }).success(function(response) {
                    deferred.resolve(response);
                }).error(function(response, error) {

                    if (error == 500) {

                        deferred.reject(response);
                    } else {

                        deferred.reject(response);
                    }
                });
                promise.success = function(fn) {
                    promise.then(fn);
                    return promise;
                };
                promise.error = function(fn) {
                    promise.then(null, fn);
                    return promise;
                };
                return promise;
            },
            getImageLink: function(data) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http.post('https://api.dropboxapi.com/2/sharing/create_shared_link', data, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer THFdq05i5bIAAAAAAABcHFiqHtMgHgUnUuUvP185PVWh1kpXFuBojaGPCjCv4knn'
                    }
                }).success(function(response) {
                    deferred.resolve(response);
                }).error(function(response, error) {

                    if (error == 500) {

                        deferred.reject(response);
                    } else {

                        deferred.reject(response);
                    }
                });
                promise.success = function(fn) {
                    promise.then(fn);
                    return promise;
                };
                promise.error = function(fn) {
                    promise.then(null, fn);
                    return promise;
                };
                return promise;
            }
		};
})

.service('TeamService', function($http, PARSE_CREDENTIALS, BACKEND, $q) {
	return {
		addTeam: function(data) {
			var deferred = $q.defer();
			var promise = deferred.promise;

			$http.post(BACKEND.URL + 'teams/addTeam', data, {
				headers: {
					'Content-Type': 'application/json'
				}
			}).success(function(response) {
				deferred.resolve(response);
			}).error(function(response, error) {
				if (error == 500) {
					deferred.reject(response);
				} else {
					deferred.reject(response);
				}
			});
			promise.success = function(fn) {
				promise.then(fn);
				return promise;
			};
			promise.error = function(fn) {
				promise.then(null, fn);
				return promise;
			};
			return promise;
		},
		getTeam: function(token) {
			var deferred = $q.defer();
			var promise = deferred.promise;
			$http.get(BACKEND.URL + 'teams?access_token=' + token).success(function(response) {
				deferred.resolve(response);
			}).error(function(response) {
				deferred.reject(response);
			});
			promise.success = function(fn) {
				promise.then(fn);
				return promise;
			};
			promise.error = function(fn) {
				promise.then(null, fn);
				return promise;
			};
			return promise;
		},
		getTeamById: function(id, token) {
			var deferred = $q.defer();
			var promise = deferred.promise;
			$http.get(BACKEND.URL + '/teams/' + id + '?access_token=' + token).success(function(response) {
				deferred.resolve(response);
			}).error(function(response) {
				deferred.reject(response);
			});
			promise.success = function(fn) {
				promise.then(fn);
				return promise;
			};
			promise.error = function(fn) {
				promise.then(null, fn);
				return promise;
			};
			return promise;
		},
		getTeamByName: function(team_name) {
			var deferred = $q.defer();
			var promise = deferred.promise;
			$http.get(BACKEND.URL + '/teams/getTeamByName?teamName=' + team_name).success(function(response) {
				deferred.resolve(response);
			}).error(function(response) {
				deferred.reject(response);
			});
			promise.success = function(fn) {
				promise.then(fn);
				return promise;
			};
			promise.error = function(fn) {
				promise.then(null, fn);
				return promise;
			};
			return promise;
		},
		getTeamSquad: function(team_name) {
			var deferred = $q.defer();
			var promise = deferred.promise;
			$http.get(BACKEND.URL + '/users/getTeamSquad?team=' + team_name).success(function(response) {
				deferred.resolve(response);
			}).error(function(response) {
				deferred.reject(response);
			});
			promise.success = function(fn) {
				promise.then(fn);
				return promise;
			};
			promise.error = function(fn) {
				promise.then(null, fn);
				return promise;
			};
			return promise;
		},
	    searchData: function(input) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.get(BACKEND.URL + '/teams/search?input=' + input).success(function(response) {
                deferred.resolve(response);
            }).error(function(response) {
                deferred.reject(response);
            });
            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            };
            return promise;
        },
        addInvitedMember: function(data) {
				var deferred = $q.defer();
				var promise = deferred.promise;
				$http.put(BACKEND.URL + '/teams/addInvitedMember', data, {
					headers: {
						'Content-Type': 'application/json'
					}
				}).success(function(response) {
					deferred.resolve(response);
				}).error(function(response, error) {
					if (error == 500) {
						deferred.reject(error);
					} else {

						deferred.reject(error);
					}
				});
				promise.success = function(fn) {
					promise.then(fn);
					return promise;
				};
				promise.error = function(fn) {
					promise.then(null, fn);
					return promise;
				};
				return promise;
		},
		addTeamInvitation: function(data) {
				var deferred = $q.defer();
				var promise = deferred.promise;
				$http.put(BACKEND.URL + '/users/addTeamInvitation', data, {
					headers: {
						'Content-Type': 'application/json'
					}
				}).success(function(response) {
					deferred.resolve(response);
				}).error(function(response, error) {
					if (error == 500) {
						deferred.reject(error);
					} else {

						deferred.reject(error);
					}
				});
				promise.success = function(fn) {
					promise.then(fn);
					return promise;
				};
				promise.error = function(fn) {
					promise.then(null, fn);
					return promise;
				};
				return promise;
		},
		addTeamToUser: function(data) {
				var deferred = $q.defer();
				var promise = deferred.promise;
				$http.put(BACKEND.URL + '/users/addTeam', data, {
					headers: {
						'Content-Type': 'application/json'
					}
				}).success(function(response) {
					deferred.resolve(response);
				}).error(function(response, error) {
					if (error == 500) {
						deferred.reject(error);
					} else {

						deferred.reject(error);
					}
				});
				promise.success = function(fn) {
					promise.then(fn);
					return promise;
				};
				promise.error = function(fn) {
					promise.then(null, fn);
					return promise;
				};
				return promise;
		},
		delTeamInvitation: function(data) {
				var deferred = $q.defer();
				var promise = deferred.promise;
				$http.put(BACKEND.URL + '/users/delTeamInvitation', data, {
					headers: {
						'Content-Type': 'application/json'
					}
				}).success(function(response) {
					deferred.resolve(response);
				}).error(function(response, error) {
					if (error == 500) {
						deferred.reject(error);
					} else {

						deferred.reject(error);
					}
				});
				promise.success = function(fn) {
					promise.then(fn);
					return promise;
				};
				promise.error = function(fn) {
					promise.then(null, fn);
					return promise;
				};
				return promise;
		},
		delInvitedMember: function(data) {
				var deferred = $q.defer();
				var promise = deferred.promise;
				$http.put(BACKEND.URL + '/teams/delInvitedMember', data, {
					headers: {
						'Content-Type': 'application/json'
					}
				}).success(function(response) {
					deferred.resolve(response);
				}).error(function(response, error) {
					if (error == 500) {
						deferred.reject(error);
					} else {

						deferred.reject(error);
					}
				});
				promise.success = function(fn) {
					promise.then(fn);
					return promise;
				};
				promise.error = function(fn) {
					promise.then(null, fn);
					return promise;
				};
				return promise;
		},
		addMemberByName: function(data) {
				var deferred = $q.defer();
				var promise = deferred.promise;
				$http.put(BACKEND.URL + '/teams/addMemberByName', data, {
					headers: {
						'Content-Type': 'application/json'
					}
				}).success(function(response) {
					deferred.resolve(response);
				}).error(function(response, error) {
					if (error == 500) {
						deferred.reject(error);
					} else {

						deferred.reject(error);
					}
				});
				promise.success = function(fn) {
					promise.then(fn);
					return promise;
				};
				promise.error = function(fn) {
					promise.then(null, fn);
					return promise;
				};
				return promise;
		},
		addRequestedTeam: function(data) {
				var deferred = $q.defer();
				var promise = deferred.promise;
				$http.put(BACKEND.URL + '/users/addRequestedTeam', data, {
					headers: {
						'Content-Type': 'application/json'
					}
				}).success(function(response) {
					deferred.resolve(response);
				}).error(function(response, error) {
					if (error == 500) {
						deferred.reject(error);
					} else {

						deferred.reject(error);
					}
				});
				promise.success = function(fn) {
					promise.then(fn);
					return promise;
				};
				promise.error = function(fn) {
					promise.then(null, fn);
					return promise;
				};
				return promise;
		},
		addPlayerRequest: function(data) {
				var deferred = $q.defer();
				var promise = deferred.promise;
				$http.put(BACKEND.URL + '/teams/addPlayerRequest', data, {
					headers: {
						'Content-Type': 'application/json'
					}
				}).success(function(response) {
					deferred.resolve(response);
				}).error(function(response, error) {
					if (error == 500) {
						deferred.reject(error);
					} else {

						deferred.reject(error);
					}
				});
				promise.success = function(fn) {
					promise.then(fn);
					return promise;
				};
				promise.error = function(fn) {
					promise.then(null, fn);
					return promise;
				};
				return promise;
		},
		addCoachRequest: function(data) {
				var deferred = $q.defer();
				var promise = deferred.promise;
				$http.put(BACKEND.URL + '/teams/addCoachRequest', data, {
					headers: {
						'Content-Type': 'application/json'
					}
				}).success(function(response) {
					deferred.resolve(response);
				}).error(function(response, error) {
					if (error == 500) {
						deferred.reject(error);
					} else {

						deferred.reject(error);
					}
				});
				promise.success = function(fn) {
					promise.then(fn);
					return promise;
				};
				promise.error = function(fn) {
					promise.then(null, fn);
					return promise;
				};
				return promise;
		},
		addMemberToTeam: function(data) {
				var deferred = $q.defer();
				var promise = deferred.promise;
				$http.put(BACKEND.URL + '/teams/addMember', data, {
					headers: {
						'Content-Type': 'application/json'
					}
				}).success(function(response) {
					deferred.resolve(response);
				}).error(function(response, error) {
					if (error == 500) {
						deferred.reject(error);
					} else {

						deferred.reject(error);
					}
				});
				promise.success = function(fn) {
					promise.then(fn);
					return promise;
				};
				promise.error = function(fn) {
					promise.then(null, fn);
					return promise;
				};
				return promise;
		},
		delUserRequest: function(data) {
				var deferred = $q.defer();
				var promise = deferred.promise;
				$http.put(BACKEND.URL + '/teams/delUserRequest', data, {
					headers: {
						'Content-Type': 'application/json'
					}
				}).success(function(response) {
					deferred.resolve(response);
				}).error(function(response, error) {
					if (error == 500) {
						deferred.reject(error);
					} else {

						deferred.reject(error);
					}
				});
				promise.success = function(fn) {
					promise.then(fn);
					return promise;
				};
				promise.error = function(fn) {
					promise.then(null, fn);
					return promise;
				};
				return promise;
		},
		delRequestedTeam: function(data) {
				var deferred = $q.defer();
				var promise = deferred.promise;
				$http.put(BACKEND.URL + '/users/delRequestedTeam', data, {
					headers: {
						'Content-Type': 'application/json'
					}
				}).success(function(response) {
					deferred.resolve(response);
				}).error(function(response, error) {
					if (error == 500) {
						deferred.reject(error);
					} else {

						deferred.reject(error);
					}
				});
				promise.success = function(fn) {
					promise.then(fn);
					return promise;
				};
				promise.error = function(fn) {
					promise.then(null, fn);
					return promise;
				};
				return promise;
		},
		addTeamByName: function(data) {
				var deferred = $q.defer();
				var promise = deferred.promise;
				$http.put(BACKEND.URL + '/users/addTeamByName', data, {
					headers: {
						'Content-Type': 'application/json'
					}
				}).success(function(response) {
					deferred.resolve(response);
				}).error(function(response, error) {
					if (error == 500) {
						deferred.reject(error);
					} else {

						deferred.reject(error);
					}
				});
				promise.success = function(fn) {
					promise.then(fn);
					return promise;
				};
				promise.error = function(fn) {
					promise.then(null, fn);
					return promise;
				};
				return promise;
		},
		addCompetition: function(data) {
				var deferred = $q.defer();
				var promise = deferred.promise;
				$http.put(BACKEND.URL + '/teams/addCompetition', data, {
					headers: {
						'Content-Type': 'application/json'
					}
				}).success(function(response) {
					deferred.resolve(response);
				}).error(function(response, error) {
					if (error == 500) {
						deferred.reject(error);
					} else {

						deferred.reject(error);
					}
				});
				promise.success = function(fn) {
					promise.then(fn);
					return promise;
				};
				promise.error = function(fn) {
					promise.then(null, fn);
					return promise;
				};
				return promise;
		}
	};
})

.service('PostService', function($http, PARSE_CREDENTIALS, BACKEND, $q) {
		return {
			getAll: function(token) {
				var deferred = $q.defer();
				var promise = deferred.promise;
				$http.get(BACKEND.URL + 'teams?access_token=' + token).success(function(response) {
					deferred.resolve(response);
				}).error(function(response) {
					deferred.reject(response);
				});
				promise.success = function(fn) {
					promise.then(fn);
					return promise;
				};
				promise.error = function(fn) {
					promise.then(null, fn);
					return promise;
				};
				return promise;
			}
		};
})

.service('CompetitionService', function($http, PARSE_CREDENTIALS, BACKEND, $q) {
		return {
			addCompetition: function(data) {
			var deferred = $q.defer();
			var promise = deferred.promise;

			$http.post(BACKEND.URL + 'competitions', data, {
				headers: {
					'Content-Type': 'application/json'
				}
			}).success(function(response) {
				deferred.resolve(response);
			}).error(function(response, error) {
				if (error == 500) {
					deferred.reject(response);
				} else {
					deferred.reject(response);
				}
			});
			promise.success = function(fn) {
				promise.then(fn);
				return promise;
			};
			promise.error = function(fn) {
				promise.then(null, fn);
				return promise;
			};
			return promise;
			},
			getAllCompetition: function() {
				var deferred = $q.defer();
				var promise = deferred.promise;
				$http.get(BACKEND.URL + 'competitions?filter=%7B%22order%22%3A%22comp_start%20ASC%22%7D').success(function(response) {
					deferred.resolve(response);
				}).error(function(response) {
					deferred.reject(response);
				});
				promise.success = function(fn) {
					promise.then(fn);
					return promise;
				};
				promise.error = function(fn) {
					promise.then(null, fn);
					return promise;
				};
				return promise;
			},
			getCompetitionByOrganizer: function(organizer) {
				var deferred = $q.defer();
				var promise = deferred.promise;
				$http.get(BACKEND.URL + 'competitions?filter=%7B%22where%22%3A%7B%22organizer%22%3A%22' + organizer + '%22%7D%2C%22order%22%3A%22comp_start%20ASC%22%7D').success(function(response) {
					deferred.resolve(response);
				}).error(function(response) {
					deferred.reject(response);
				});
				promise.success = function(fn) {
					promise.then(fn);
					return promise;
				};
				promise.error = function(fn) {
					promise.then(null, fn);
					return promise;
				};
				return promise;
			},
			getMatchesByCompetition: function(compId,tokens) {
				var deferred = $q.defer();
				var promise = deferred.promise;
				$http.get(BACKEND.URL + 'competitions/' + compId + '/matches?access_token=' + tokens).success(function(response) {
					deferred.resolve(response);
				}).error(function(response) {
					deferred.reject(response);
				});
				promise.success = function(fn) {
					promise.then(fn);
					return promise;
				};
				promise.error = function(fn) {
					promise.then(null, fn);
					return promise;
				};
				return promise;
			},
			getMatchesByFixture: function(compId,fixtureNum,tokens) {
				var deferred = $q.defer();
				var promise = deferred.promise;
				$http.get(BACKEND.URL + 'competitions/'+ compId +'/matches?filter=%7B%22where%22%3A%7B%22fixture_number%22%3A%22'+ fixtureNum + '%22%7D%2C%20%22order%22%3A%22match_date%22%7D&access_token=' + tokens).success(function(response) {
					deferred.resolve(response);
				}).error(function(response) {
					deferred.reject(response);
				});
				promise.success = function(fn) {
					promise.then(fn);
					return promise;
				};
				promise.error = function(fn) {
					promise.then(null, fn);
					return promise;
				};
				return promise;
			},
			getMatchesByMatchStatus: function(compId,matchStat,tokens) {
				var deferred = $q.defer();
				var promise = deferred.promise;
				$http.get(BACKEND.URL + 'competitions/'+ compId +'/matches?filter=%7B%22where%22%3A%7B%22match_status%22%3A%22'+ matchStat + '%22%7D%2C%20%22order%22%3A%22match_date%22%7D&access_token=' + tokens).success(function(response) {
					deferred.resolve(response);
				}).error(function(response) {
					deferred.reject(response);
				});
				promise.success = function(fn) {
					promise.then(fn);
					return promise;
				};
				promise.error = function(fn) {
					promise.then(null, fn);
					return promise;
				};
				return promise;
			},
			getCompetitionById: function(id, token) {
				var deferred = $q.defer();
				var promise = deferred.promise;
				$http.get(BACKEND.URL + '/competitions/' + id + '?access_token=' + token).success(function(response) {
					deferred.resolve(response);
				}).error(function(response) {
					deferred.reject(response);
				});
				promise.success = function(fn) {
					promise.then(fn);
					return promise;
				};
				promise.error = function(fn) {
					promise.then(null, fn);
					return promise;
				};
				return promise;
			},
			getCompetitionByDate: function(compId, date, token) {
				var deferred = $q.defer();
				var promise = deferred.promise;
				$http.get(BACKEND.URL + 'competitions/' + compId + '/matches?filter=%7B%22where%22%3A%7B%22match_date%22%3A%22' + date + '%22%7D%7D&access_token=' + token).success(function(response) {
					deferred.resolve(response);
				}).error(function(response) {
					deferred.reject(response);
				});
				promise.success = function(fn) {
					promise.then(fn);
					return promise;
				};
				promise.error = function(fn) {
					promise.then(null, fn);
					return promise;
				};
				return promise;
			},
			delCompetition: function(id, token) {
					var deferred = $q.defer();
					var promise = deferred.promise;
					$http.delete(BACKEND.URL + 'competitions/' + id + '?access_token=' + token).success(function(response) {
						deferred.resolve(response);
					}).error(function(response) {
						deferred.reject(response);
					});
					promise.success = function(fn) {
						promise.then(fn);
						return promise;
					};
					promise.error = function(fn) {
						promise.then(null, fn);
						return promise;
					};
					return promise;
			},
			editCompetition: function(id, token, data) {
				var deferred = $q.defer();
				var promise = deferred.promise;
				$http.put(BACKEND.URL + '/competitions/' + id + '?access_token=' + token, data, {
					headers: {
						'Content-Type': 'application/json'
					}
				}).success(function(response) {
					deferred.resolve(response);
				}).error(function(response, error) {
					if (error == 500) {
						deferred.reject(error);
					} else {
						deferred.reject(error);
					}
				});

				promise.success = function(fn) {
					promise.then(fn);
					return promise;
				};

				promise.error = function(fn) {
					promise.then(null, fn);
					return promise;
				};

				return promise;
			},
			// registerTeam: function(data) {
			// 	var deferred = $q.defer();
			// 	var promise = deferred.promise;
			// 	$http.put(BACKEND.URL + '/teams', data, {
			// 		headers: {
			// 			'Content-Type': 'application/json'
			// 		}
			// 	}).success(function(response) {
			// 		deferred.resolve(response);
			// 	}).error(function(response, error) {
			// 		if (error == 500) {
			// 			deferred.reject(error);
			// 		} else {
			// 			deferred.reject(error);
			// 		}
			// 	});

			// 	promise.success = function(fn) {
			// 		promise.then(fn);
			// 		return promise;
			// 	};
			// 	promise.error = function(fn) {
			// 		promise.then(null, fn);
			// 		return promise;
			// 	};
			// 	return promise;
			// },
			registerTeam: function(teamId, token, data) {
				var deferred = $q.defer();
				var promise = deferred.promise;
				$http.put(BACKEND.URL + '/teams/' + teamId + '?access_token=' + token, data, {
					headers: {
						'Content-Type': 'application/json'
					}
				}).success(function(response) {
					deferred.resolve(response);
				}).error(function(response, error) {
					if (error == 500) {
						deferred.reject(error);
					} else {

						deferred.reject(error);
					}
				});
				promise.success = function(fn) {
					promise.then(fn);
					return promise;
				};
				promise.error = function(fn) {
					promise.then(null, fn);
					return promise;
				};
				return promise;
			},
			addRegister: function(data) {
				var deferred = $q.defer();
				var promise = deferred.promise;
				$http.put(BACKEND.URL + '/competitions/addRegister', data, {
					headers: {
						'Content-Type': 'application/json'
					}
				}).success(function(response) {
					deferred.resolve(response);
				}).error(function(response, error) {
					if (error == 500) {
						deferred.reject(error);
					} else {

						deferred.reject(error);
					}
				});
				promise.success = function(fn) {
					promise.then(fn);
					return promise;
				};
				promise.error = function(fn) {
					promise.then(null, fn);
					return promise;
				};
				return promise;
			},

		};
})

.service('ClassementService', function($http, PARSE_CREDENTIALS, BACKEND, $q) {
		return {
			addClassement: function(data) {
			var deferred = $q.defer();
			var promise = deferred.promise;

			$http.post(BACKEND.URL + 'classements', data, {
				headers: {
					'Content-Type': 'application/json'
				}
			}).success(function(response) {
				deferred.resolve(response);
			}).error(function(response, error) {
				if (error == 500) {
					deferred.reject(response);
				} else {
					deferred.reject(response);
				}
			});
			promise.success = function(fn) {
				promise.then(fn);
				return promise;
			};
			promise.error = function(fn) {
				promise.then(null, fn);
				return promise;
			};
			return promise;
			},
			getClassementsByCompetition: function(competitionId, token) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.get(BACKEND.URL + '/competitions/' + competitionId + '/classements?filter=%7B%22order%22%3A%position%22%7D&access_token=' + token).success(function(response) {
                deferred.resolve(response);
            }).error(function(response) {
                deferred.reject(response);
            });
            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            };
            return promise;
        	}
		};
})

.service('TrainingService', function($http, PARSE_CREDENTIALS, BACKEND, $q) {
		return {
			addClassement: function(data) {
			var deferred = $q.defer();
			var promise = deferred.promise;

			$http.post(BACKEND.URL + 'classements', data, {
				headers: {
					'Content-Type': 'application/json'
				}
			}).success(function(response) {
				deferred.resolve(response);
			}).error(function(response, error) {
				if (error == 500) {
					deferred.reject(response);
				} else {
					deferred.reject(response);
				}
			});
			promise.success = function(fn) {
				promise.then(fn);
				return promise;
			};
			promise.error = function(fn) {
				promise.then(null, fn);
				return promise;
			};
			return promise;
			},
			getClassementsByCompetition: function(competitionId, token) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.get(BACKEND.URL + '/competitions/' + competitionId + '/classements?filter=%7B%22order%22%3A%position%22%7D&access_token=' + token).success(function(response) {
                deferred.resolve(response);
            }).error(function(response) {
                deferred.reject(response);
            });
            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            };
            return promise;
        	}
		};
})

.service('FixtureService', function($http, PARSE_CREDENTIALS, BACKEND, $q) {
		return {
			addFixture: function(data) {
			var deferred = $q.defer();
			var promise = deferred.promise;

			$http.post(BACKEND.URL + 'fixtures', data, {
				headers: {
					'Content-Type': 'application/json'
				}
			}).success(function(response) {
				deferred.resolve(response);
			}).error(function(response, error) {
				if (error == 500) {
					deferred.reject(response);
				} else {
					deferred.reject(response);
				}
			});
			promise.success = function(fn) {
				promise.then(fn);
				return promise;
			};
			promise.error = function(fn) {
				promise.then(null, fn);
				return promise;
			};
			return promise;
			},
			getFixturesByCompetition: function(competitionId, token) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.get(BACKEND.URL + '/competitions/' + competitionId + '/fixtures?filter=%7B%22order%22%3A%22fixture_number%22%7D&access_token=' + token).success(function(response) {
                deferred.resolve(response);
            }).error(function(response) {
                deferred.reject(response);
            });
            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            };
            return promise;
        	},
        	editFixtureById: function(fixtureId, token, data) {
				var deferred = $q.defer();
				var promise = deferred.promise;
				$http.put(BACKEND.URL + '/fixtures/' + fixtureId + '?access_token=' + token, data, {
					headers: {
						'Content-Type': 'application/json'
					}
				}).success(function(response) {
					deferred.resolve(response);
				}).error(function(response, error) {
					if (error == 500) {
						deferred.reject(error);
					} else {

						deferred.reject(error);
					}
				});
				promise.success = function(fn) {
					promise.then(fn);
					return promise;
				};
				promise.error = function(fn) {
					promise.then(null, fn);
					return promise;
				};
				return promise;
			},
			getFixture: function(compId, fixtureNum, token) {
	            var deferred = $q.defer();
	            var promise = deferred.promise;
	            $http.get(BACKEND.URL + 'fixtures/getFixture?competitionId=' + compId + '&fixtureNumber=' + fixtureNum + '&access_token=' + token).success(function(response) {
	                deferred.resolve(response);
	            }).error(function(response) {
	                deferred.reject(response);
	            });
	            promise.success = function(fn) {
	                promise.then(fn);
	                return promise;
	            };
	            promise.error = function(fn) {
	                promise.then(null, fn);
	                return promise;
	            };
	            return promise;
        	}
		};
})

.service('MatchService', function($http, PARSE_CREDENTIALS, BACKEND, $q) {
		return {
			addMatch: function(data) {
			var deferred = $q.defer();
			var promise = deferred.promise;

			$http.post(BACKEND.URL + 'matches', data, {
				headers: {
					'Content-Type': 'application/json'
				}
			}).success(function(response) {
				deferred.resolve(response);
			}).error(function(response, error) {
				if (error == 500) {
					deferred.reject(response);
				} else {
					deferred.reject(response);
				}
			});
			promise.success = function(fn) {
				promise.then(fn);
				return promise;
			};
			promise.error = function(fn) {
				promise.then(null, fn);
				return promise;
			};
			return promise;
			},
			getMatches: function(token) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.get(BACKEND.URL + '/matches?access_token=' + token).success(function(response) {
                deferred.resolve(response);
            }).error(function(response) {
                deferred.reject(response);
            });
            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            };
            return promise;
        	},
        	getMatchById: function(id, token) {
				var deferred = $q.defer();
				var promise = deferred.promise;
				$http.get(BACKEND.URL + '/matches/' + id + '?access_token=' + token).success(function(response) {
					deferred.resolve(response);
				}).error(function(response) {
					deferred.reject(response);
				});
				promise.success = function(fn) {
					promise.then(fn);
					return promise;
				};
				promise.error = function(fn) {
					promise.then(null, fn);
					return promise;
				};
				return promise;
			},
        	getMatchesByFixture: function(fixtureNumber) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.get(BACKEND.URL + '/matches?filter=%7B%22where%22%3A%7B%22fixture_number%22%3A%22' + fixtureNumber + '%22%7D%7D').success(function(response) {
                deferred.resolve(response);
            }).error(function(response) {
                deferred.reject(response);
            });
            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            };
            return promise;
        	},
        	getMatchesByReferee: function(referee, date) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.get(BACKEND.URL + '/matches?filter=%7B%22where%22%3A%7B%22match_referee%22%3A%22' + referee + '%22%2C%20%22match_date%22%3A%22' + date + '%22%7D%2C%20%22order%22%3A%22match_date%22%7D').success(function(response) {
                deferred.resolve(response);
            }).error(function(response) {
                deferred.reject(response);
            });
            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            };
            return promise;
        	},
        	getAvailableMatches: function(date) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.get(BACKEND.URL + '/matches?filter=%7B%22where%22%3A%7B%22match_referee%22%3A%22%22%2C%20%22match_date%22%3A%22' + date + '%22%7D%2C%20%22order%22%3A%22match_time%22%7D').success(function(response) {
                deferred.resolve(response);
            }).error(function(response) {
                deferred.reject(response);
            });
            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            };
            return promise;
        	},
        	getOnProgressMatches: function(referee, date) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.get(BACKEND.URL + '/matches?filter=%7B%22where%22%3A%7B%22match_referee%22%3A%22' + referee + '%22%2C%22referee_status%22%3A%22onprogress%22%2C%20%22match_date%22%3A%22' + date + '%22%7D%2C%20%22order%22%3A%22match_time%22%7D').success(function(response) {
                deferred.resolve(response);
            }).error(function(response) {
                deferred.reject(response);
            });
            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            };
            return promise;
        	},
        	getAcceptedMatches: function(referee, date) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.get(BACKEND.URL + '/matches?filter=%7B%22where%22%3A%7B%22match_referee%22%3A%22' + referee + '%22%2C%22referee_status%22%3A%22accepted%22%2C%20%22match_date%22%3A%22' + date + '%22%7D%2C%20%22order%22%3A%22match_time%22%7D').success(function(response) {
                deferred.resolve(response);
            }).error(function(response) {
                deferred.reject(response);
            });
            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            };
            return promise;
        	},
        	getMatchesByCompetitionId: function(compId, fixtureNum, token) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.get(BACKEND.URL + '/competitions/'+compId+'/matches?filter=%7B%22where%22%3A%7B%22fixture_number%22%3A%22'+fixtureNum+'%22%7D%7D&access_token=' + token).success(function(response) {
                deferred.resolve(response);
            }).error(function(response) {
                deferred.reject(response);
            });
            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            };
            return promise;
        	},
        	editMatchById: function(matchId, token, data) {
				var deferred = $q.defer();
				var promise = deferred.promise;
				$http.put(BACKEND.URL + '/matches/' + matchId + '?access_token=' + token, data, {
					headers: {
						'Content-Type': 'application/json'
					}
				}).success(function(response) {
					deferred.resolve(response);
				}).error(function(response, error) {
					if (error == 500) {
						deferred.reject(error);
					} else {

						deferred.reject(error);
					}
				});
				promise.success = function(fn) {
					promise.then(fn);
					return promise;
				};
				promise.error = function(fn) {
					promise.then(null, fn);
					return promise;
				};
				return promise;
			},
			request: function(id, token, data) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http.put(BACKEND.URL + '/matches/' + id + '?access_token=' + token, data, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).success(function(response) {
                    deferred.resolve(response);
                }).error(function(response, error) {
                    if (error == 500) {
                        deferred.reject(error);
                    } else {
                        deferred.reject(error);
                    }
                });

                promise.success = function(fn) {
                    promise.then(fn);
                    return promise;
                };

                promise.error = function(fn) {
                    promise.then(null, fn);
                    return promise;
                };

                return promise;
            }
		};
})

.service('MessageService', function($http, PARSE_CREDENTIALS, BACKEND, $q) {
    return {
        getMessage: function(sender, receiver) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.get(BACKEND.URL + '/messages/getMessage?sender=' + sender + '&receiver=' + receiver).success(function(response) {
                deferred.resolve(response);
            }).error(function(response) {
                deferred.reject(response);
            });
            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            };
            return promise;
        },
        getContacts: function(token) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.get(BACKEND.URL + '/Employees/getContacts?access_token=' + token).success(function(response) {
                deferred.resolve(response);
            }).error(function(response) {
                deferred.reject(response);
            });
            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            };
            return promise;
        },
        getMessageBySender: function(idLogin) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.get(BACKEND.URL + '/messages/recentChats?id=' + idLogin).success(function(response) {
                deferred.resolve(response);
            }).error(function(response) {
                deferred.reject(response);
            });
            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            };
            return promise;
        },
     	addMessage: function(data) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.post(BACKEND.URL + '/messages/addMessage', data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).success(function(response) {
                deferred.resolve(response);
            }).error(function(response, error) {
                if (error == 500) {
                    deferred.reject(error);
                } else {
                    deferred.reject(error);
                }
            });
            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            };
            return promise;
        },
        addReader: function(idMessage, reader) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.get(BACKEND.URL + '/messages/addReader?id=' + idMessage + '&receiver=' + reader).success(function(response) {
                deferred.resolve(response);
            }).error(function(response) {
                deferred.reject(response);
            });
            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            };
            return promise;
        },
        editMessageById: function(messageId, token, data) {
			var deferred = $q.defer();
			var promise = deferred.promise;
			$http.put(BACKEND.URL + '/messages/' + messageId + '?access_token=' + token, data, {
				headers: {
					'Content-Type': 'application/json'
				}
			}).success(function(response) {
				deferred.resolve(response);
			}).error(function(response, error) {
				if (error == 500) {
					deferred.reject(error);
				} else {

					deferred.reject(error);
				}
			});
			promise.success = function(fn) {
				promise.then(fn);
				return promise;
			};
			promise.error = function(fn) {
				promise.then(null, fn);
				return promise;
			};
			return promise;
		},
		getUnreadMessage: function(read, receiver) {
	        var deferred = $q.defer();
	        var promise = deferred.promise;
	        $http.get(BACKEND.URL + 'messages/getUnreadMessage?read=' + read + '&receiver=' + receiver).success(function(response) {
	            deferred.resolve(response);
	        }).error(function(response) {
	            deferred.reject(response);
	        });
	        promise.success = function(fn) {
	            promise.then(fn);
	            return promise;
	        };
	        promise.error = function(fn) {
	            promise.then(null, fn);
	            return promise;
	        };
	        return promise;
    	}
    };
});
