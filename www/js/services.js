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
					if (error == 500 || error == 502 || error == 404) {
						// deferred.reject('Harap coba kembali beberapa saat lagi.');
						deferred.reject('Error 500');
						// deferred.reject('There was an error. Please try again later...');
					} else {
						deferred.reject('Please check again your username and password');
						// deferred.reject('Periksa kembali username dan password anda.');
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
			login: function(username, password) {
				var deferred = $q.defer();
				var promise = deferred.promise;
				var data = "username=" + username + "&password=" + password;
				$http.post(BACKEND.URL + 'users/loginUser', data, {
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				}).success(function(response) {
					deferred.resolve(response);
				}).error(function(response, error) {
					if (error == 500 || error == 502 || error == 404) {
						// deferred.reject('Harap coba kembali beberapa saat lagi.');
						deferred.reject('Error 500');
						// deferred.reject('There was an error. Please try again later...');
					} else {
						deferred.reject('Please check again your username and password');
						// deferred.reject('Periksa kembali username dan password anda.');
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
			getUser: function(id) {
				var deferred = $q.defer();
				var promise = deferred.promise;
				$http.get(BACKEND.URL + '/users/' + id).success(function(response) {
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
            getAllReferees: function() {
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http.get(BACKEND.URL + '/users/getAllReferees').success(function(response) {
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
             getAllAnalysts: function() {
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http.get(BACKEND.URL + '/users/getAllAnalysts').success(function(response) {
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
            getUserById: function(userId) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http.get(BACKEND.URL + '/users/getUserById?userId=' + userId).success(function(response) {
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
            addBookedDate: function(data) {
				var deferred = $q.defer();
				var promise = deferred.promise;
				$http.put(BACKEND.URL + 'users/addBookedDate', data, {
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
		editTeamById: function(teamId, data) {
			var deferred = $q.defer();
			var promise = deferred.promise;
			$http.put(BACKEND.URL + '/teams/' + teamId, data, {
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
		getGoalkeeperByTeamName: function(team_name) {
			var deferred = $q.defer();
			var promise = deferred.promise;
			$http.get(BACKEND.URL + 'users/getGoalKeeperByTeam?teamName=' + team_name).success(function(response) {
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
		getDefenderByTeamName: function(team_name) {
			var deferred = $q.defer();
			var promise = deferred.promise;
			$http.get(BACKEND.URL + 'users/getDefenderByTeam?teamName=' + team_name).success(function(response) {
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
		getMidfielderByTeamName: function(team_name) {
			var deferred = $q.defer();
			var promise = deferred.promise;
			$http.get(BACKEND.URL + 'users/getMidfielderByTeam?teamName=' + team_name).success(function(response) {
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
		getAttackerByTeamName: function(team_name) {
			var deferred = $q.defer();
			var promise = deferred.promise;
			$http.get(BACKEND.URL + 'users/getAttackerByTeam?teamName=' + team_name).success(function(response) {
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
        getPlayer: function() {
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.get(BACKEND.URL + 'users/getTopPlayer').success(function(response) {
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
		delPlayerRequest: function(data) {
				var deferred = $q.defer();
				var promise = deferred.promise;
				$http.put(BACKEND.URL + '/teams/delPlayerRequest', data, {
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
				$http.put(BACKEND.URL + 'teams/addCompetition', data, {
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
				$http.get(BACKEND.URL + 'competitions?filter=%7B%22order%22%3A%22comp_start%20DESC%22%7D').success(function(response) {
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
				$http.get(BACKEND.URL + 'competitions?filter=%7B%22where%22%3A%7B%22organizer%22%3A%22' + organizer + '%22%7D%2C%22order%22%3A%22comp_start%20DESC%22%7D').success(function(response) {
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
			getCompetitionId: function(compName) {
				var deferred = $q.defer();
				var promise = deferred.promise;
				$http.get(BACKEND.URL + '/competitions/getCompetitionId?competitionName=' + compName).success(function(response) {
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
			getCompetitionName: function(compId) {
				var deferred = $q.defer();
				var promise = deferred.promise;
				$http.get(BACKEND.URL + '/competitions/getCompetitionName?competitionId=' + compId).success(function(response) {
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
			getMatchesByCompetitionAndDate: function(compId, matchDate) {
				var deferred = $q.defer();
				var promise = deferred.promise;
				$http.get(BACKEND.URL + '/competitions/' + compId + '/matches?filter=%7B%22where%22%3A%7B%22match_date%22%3A%22' + matchDate + '%22%7D%2C%20%22order%22%3A%22match_time%22%7D').success(function(response) {
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
			getMatchesByMatchFixture: function(compId,matchFixture,tokens) {
				var deferred = $q.defer();
				var promise = deferred.promise;
				$http.get(BACKEND.URL + 'competitions/'+ compId +'/matches?filter=%7B%22where%22%3A%7B%22match_fixture%22%3A%22'+ matchFixture + '%22%7D%2C%20%22order%22%3A%22match_date%22%7D&access_token=' + tokens).success(function(response) {
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
			getCompetitionByOrganizerAndSchedule: function(organizer) {
				var deferred = $q.defer();
				var promise = deferred.promise;
				$http.get(BACKEND.URL + '/competitions?filter=%7B%22where%22%3A%7B%22organizer%22%3A%22' + organizer + '%22%2C%22schedule_status%22%3A%22On%20Progress%22%7D%7D').success(function(response) {
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
			getFinishedMatch: function(compId) {
				var deferred = $q.defer();
				var promise = deferred.promise;
				$http.get(BACKEND.URL + 'competitions/' + compId + '/matches?filter=%7B%22where%22%3A%7B%22match_status%22%3A%20%22finished%22%2C%22referee_ratingStatus%22%3A%20false%7D%7D').success(function(response) {
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
			getCompletedMatchesByCompId: function(compId) {
				var deferred = $q.defer();
				var promise = deferred.promise;
				$http.get(BACKEND.URL + 'competitions/' + compId + '/matches?filter=%7B%22where%22%3A%7B%22fullTime%22%3Atrue%7D%7D').success(function(response) {
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
			getClassementByCompIdAndTeam: function(compId,team) {
				var deferred = $q.defer();
				var promise = deferred.promise;
				$http.get(BACKEND.URL + 'competitions/' + compId + '/classements?filter=%7B%22where%22%3A%7B%22team%22%3A%22' + team + '%22%7D%7D').success(function(response) {
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
			getClassementByCompIdAndTeamName: function(compId,teamName) {
				var deferred = $q.defer();
				var promise = deferred.promise;
				$http.get(BACKEND.URL + 'classements/getClassementByCompIdAndTeamName?compId=' + compId + '&teamName=' + teamName).success(function(response) {
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
				$http.get(BACKEND.URL + 'competitions/' + compId + '/matches?filter=%7B%22where%22%3A%7B%22match_date%22%3A%22' + date + '%22%7D%2C%22order%22%3A%22match_time%20ASC%22%7D&access_token=' + token).success(function(response) {
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
			getCompetitionByCompIdAndLiveStat: function(compId, token) {
				var deferred = $q.defer();
				var promise = deferred.promise;
				$http.get(BACKEND.URL + 'competitions/' + compId + '/matches?filter=%7B%22where%22%3A%7B%22live_status%22%3A%22true%22%7D%7D&access_token=' + token).success(function(response) {
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
			getMatchByCompIdFixtureAndLastPair: function(compId, fixture, lastPair) {
				var deferred = $q.defer();
				var promise = deferred.promise;
				$http.get(BACKEND.URL + 'competitions/' + compId + '/matches?filter=%7B%22where%22%3A%7B%22match_fixture%22%3A%22' + fixture + '%22%2C%22last_pair%22%3A%20%22' + lastPair + '%22%7D%7D').success(function(response) {
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
				$http.put(BACKEND.URL + 'competitions/addRegister', data, {
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
        	},
        	getClassementsByCompetitionId: function(competitionId, token) {
	            var deferred = $q.defer();
	            var promise = deferred.promise;
	            $http.get(BACKEND.URL + 'classements?filter=%7B%22where%22%3A%7B%22competition_id%22%3A%22' + competitionId + '%22%7D%7D&access_token=' + token).success(function(response) {
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
        	editClassementById: function(classementId, data) {
				var deferred = $q.defer();
				var promise = deferred.promise;
				$http.put(BACKEND.URL + '/classements/' + classementId, data, {
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

.service('TrainingService', function($http, PARSE_CREDENTIALS, BACKEND, $q) {
		return {
			addTraining: function(data) {
			var deferred = $q.defer();
			var promise = deferred.promise;

			$http.post(BACKEND.URL + 'trainings', data, {
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
			getTraining: function(team_id) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.get(BACKEND.URL + 'trainings?filter=%7B%22where%22%3A%7B%22team_id%22%3A%22' + team_id + '%22%7D%2C%22order%22%3A%22training_date%20ASC%22%7D').success(function(response) {
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
        	getTrainingById: function(id) {
				var deferred = $q.defer();
				var promise = deferred.promise;
				$http.get(BACKEND.URL + '/trainings/' + id).success(function(response) {
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
			editTrainingById: function(trainingId, data) {
				var deferred = $q.defer();
				var promise = deferred.promise;
				$http.put(BACKEND.URL + '/trainings/' + trainingId, data, {
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
        	getMatchById: function(id) {
				var deferred = $q.defer();
				var promise = deferred.promise;
				$http.get(BACKEND.URL + 'matches/' + id).success(function(response) {
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
			getMatchesByTeam: function(team, token) {
				var deferred = $q.defer();
				var promise = deferred.promise;
				$http.get(BACKEND.URL + 'matches/getMatchByTeam?team=' + team).success(function(response) {
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
		        $http.get(BACKEND.URL + '/matches?filter=%7B%22where%22%3A%7B%22fixture_number%22%3A%22' + fixtureNumber + '%22%2C%20%22').success(function(response) {
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
        	getMatchesByCompetitionAndFixture: function(compId,fixtureNumber) {
		        var deferred = $q.defer();
		        var promise = deferred.promise;
		        $http.get(BACKEND.URL + '/matches?filter=%7B%22where%22%3A%7B%22fixture_number%22%3A%22' + fixtureNumber + '%22%2C%20%22competition_id%22%3A%22' + compId + '%22%7D%7D').success(function(response) {
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
        	getMatchesByCompetitionIdAndDate: function(compId,matchDate) {
		        var deferred = $q.defer();
		        var promise = deferred.promise;
		        $http.get(BACKEND.URL + '/matches?filter=%7B%22where%22%3A%20%7B%22competition_id%22%3A%22' + compId + '%22%2C%20%22match_date%22%3A%22' + matchDate + '%22%7D%7D').success(function(response) {
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
        	getMatchesByReferee: function(referee) {
	            var deferred = $q.defer();
	            var promise = deferred.promise;
	            $http.get(BACKEND.URL + '/matches?filter=%7B%22where%22%3A%7B%22match_referee%22%3A%22' + referee + '%22%7D%7D').success(function(response) {
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
        	getCompletedMatchesByRef: function(referee) {
	            var deferred = $q.defer();
	            var promise = deferred.promise;
	            $http.get(BACKEND.URL + 'matches?filter=%7B%22where%22%3A%7B%22match_referee%22%3A%20%22' + referee + '%22%2C%20%22match_status%22%3A%20%22finished%22%7D%7D').success(function(response) {
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
        	getCompletedMatchesByAnalyst: function(analyst) {
	            var deferred = $q.defer();
	            var promise = deferred.promise;
	            $http.get(BACKEND.URL + 'matches?filter=%7B%22where%22%3A%7B%22match_analyst%22%3A%20%22' + analyst + '%22%2C%20%22match_status%22%3A%20%22finished%22%7D%7D').success(function(response) {
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
        	getMatchesByAnalyst: function(analyst) {
	            var deferred = $q.defer();
	            var promise = deferred.promise;
	            $http.get(BACKEND.URL + '/matches?filter=%7B%22where%22%3A%7B%22match_analyst%22%3A%22' + analyst + '%22%7D%7D').success(function(response) {
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
        	getMatchesByRefereeAndDate: function(referee, date) {
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
        	getMatchesByAnalystAndDate: function(analyst, date) {
	            var deferred = $q.defer();
	            var promise = deferred.promise;
	            $http.get(BACKEND.URL + '/matches?filter=%7B%22where%22%3A%7B%22match_analyst%22%3A%22' + analyst + '%22%2C%20%22match_date%22%3A%22' + date + '%22%7D%2C%20%22order%22%3A%22match_date%22%7D').success(function(response) {
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
        	editMatchById: function(matchId, data) {
				var deferred = $q.defer();
				var promise = deferred.promise;
				$http.put(BACKEND.URL + 'matches/' + matchId, data, {
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

.service('RatingService', function($http, PARSE_CREDENTIALS, BACKEND, $q) {
	return {
		saveRefereeRating: function(data) {
			var deferred = $q.defer();
			var promise = deferred.promise;

			$http.post(BACKEND.URL + 'ratings', data, {
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
		addRefereeRating: function(data) {
			var deferred = $q.defer();
			var promise = deferred.promise;
			$http.put(BACKEND.URL + 'users/addRefereeRating', data, {
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
		addRefereeRatingById: function(userId, data) {
			var deferred = $q.defer();
			var promise = deferred.promise;
			$http.put(BACKEND.URL + 'users/' + userId, data, {
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
        getMessageBySenderAndReceiver: function(sender, receiver) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.get(BACKEND.URL + 'messages?filter=%7B%22where%22%3A%7B%22or%22%3A%5B%7B%22sender%22%3A%22' + sender + '%22%2C%20%22receiver%22%3A%22' + receiver + '%22%7D%2C%20%7B%22sender%22%3A%22' + receiver + '%22%2C%20%22receiver%22%3A%22' + sender + '%22%7D%5D%7D%7D').success(function(response) {
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
        readMessage: function(receiver, sender, data) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.post(BACKEND.URL + '/messages/update?where=%7B%22read%22%3A%22false%22%2C%20%22receiver%22%3A%22' + receiver + '%22%2C%20%22sender%22%3A%22' + sender + '%22%7D', data, {
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
    	},
    	getNewMessageCounter: function(receiver, sender) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.get(BACKEND.URL + '/messages/newMessageCounter?receiver=' + receiver + '&sender=' + sender).success(function(response) {
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
    };
});
