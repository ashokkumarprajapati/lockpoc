## Demo Scripts

### Scenario 1

1. Find yourself (always possible since we have full ldap access)
2. No profile data=>[Please connect your LinkedIN profile](http://)

### Scenario 2

1. Search/Browse for certain profiles
2. Check out details
3. Visualize the semantic graph


## Configure ElasticSearch
### Reset all indices

```
curl -XPUT 'localhost:9200/mydocs/' -d '{}'
```

### Create Index, mapping and analyzer


```
curl -XPUT "http://localhost:9200/lockpoc/" -d '{
  "settings": {
    "number_of_shards": 5,
    "number_of_replicas": 1,
    "analysis": {
      "analyzer": {
        "auto_complete": {
          "type": "custom",
          "tokenizer": "whitespace",
          "filter": [
            "stop",
            "standard",
            "custom_ngram"
          ]
        }
      },
      "filter": {
        "custom_ngram": {
          "type": "nGram",
          "min_gram": 2,
          "max_gram": 10
        }
      }
    }
  },
  "mappings": {
    "profiles": {
      "properties": {
        "auto_complete": {
          "type": "string",
          "store": "no",
          "include_in_all": "false",
          "index_analyzer": "auto_complete",
          "search_analyzer": "standard"
        },
        "_rev": {
          "type": "string"
        },
        "linkedin": {
          "dynamic": "true",
          "properties": {
            "connections": {
              "dynamic": "true",
              "properties": {
                "_total": {
                  "type": "long"
                },
                "publish": {
                  "type": "boolean"
                },
                "values": {
                  "dynamic": "true",
                  "properties": {
                    "apiStandardProfileRequest": {
                      "dynamic": "true",
                      "properties": {
                        "headers": {
                          "dynamic": "true",
                          "properties": {
                            "_total": {
                              "type": "long"
                            },
                            "values": {
                              "dynamic": "true",
                              "properties": {
                                "name": {
                                  "type": "string"
                                },
                                "value": {
                                  "type": "string"
                                }
                              }
                            }
                          }
                        },
                        "url": {
                          "type": "string"
                        }
                      }
                    },
                    "firstName": {
                      "type": "string"
                    },
                    "headline": {
                      "type": "string"
                    },
                    "id": {
                      "type": "string"
                    },
                    "industry": {
                      "type": "string"
                    },
                    "lastName": {
                      "type": "string"
                    },
                    "location": {
                      "dynamic": "true",
                      "properties": {
                        "country": {
                          "dynamic": "true",
                          "properties": {
                            "code": {
                              "type": "string"
                            }
                          }
                        },
                        "name": {
                          "type": "string"
                        }
                      }
                    },
                    "pictureUrl": {
                      "type": "string"
                    },
                    "siteStandardProfileRequest": {
                      "dynamic": "true",
                      "properties": {
                        "url": {
                          "type": "string"
                        }
                      }
                    }
                  }
                }
              }
            },
            "currentShare": {
              "dynamic": "true",
              "properties": {
                "author": {
                  "dynamic": "true",
                  "properties": {
                    "firstName": {
                      "type": "string"
                    },
                    "id": {
                      "type": "string"
                    },
                    "lastName": {
                      "type": "string"
                    }
                  }
                },
                "comment": {
                  "type": "string"
                },
                "id": {
                  "type": "string"
                },
                "publish": {
                  "type": "boolean"
                },
                "source": {
                  "dynamic": "true",
                  "properties": {
                    "serviceProvider": {
                      "dynamic": "true",
                      "properties": {
                        "name": {
                          "type": "string"
                        }
                      }
                    }
                  }
                },
                "timestamp": {
                  "type": "long"
                },
                "visibility": {
                  "dynamic": "true",
                  "properties": {
                    "code": {
                      "type": "string"
                    }
                  }
                }
              }
            },
            "educations": {
              "dynamic": "true",
              "properties": {
                "_total": {
                  "type": "long"
                },
                "values": {
                  "dynamic": "true",
                  "properties": {
                    "degree": {
                      "type": "string"
                    },
                    "endDate": {
                      "dynamic": "true",
                      "properties": {
                        "year": {
                          "type": "long"
                        }
                      }
                    },
                    "fieldOfStudy": {
                      "type": "string"
                    },
                    "id": {
                      "type": "long"
                    },
                    "publish": {
                      "type": "boolean"
                    },
                    "schoolName": {
                      "type": "string"
                    },
                    "startDate": {
                      "dynamic": "true",
                      "properties": {
                        "year": {
                          "type": "long"
                        }
                      }
                    }
                  }
                }
              }
            },
            "firstName": {
              "dynamic": "true",
              "properties": {
                "publish": {
                  "type": "boolean"
                },
                "value": {
                  "type": "string"
                }
              }
            },
            "headline": {
              "dynamic": "true",
              "properties": {
                "publish": {
                  "type": "boolean"
                },
                "value": {
                  "type": "string"
                }
              }
            },
            "industry": {
              "dynamic": "true",
              "properties": {
                "publish": {
                  "type": "boolean"
                },
                "value": {
                  "type": "string"
                }
              }
            },
            "interests": {
              "dynamic": "true",
              "properties": {
                "publish": {
                  "type": "boolean"
                },
                "value": {
                  "type": "string"
                }
              }
            },
            "lastName": {
              "dynamic": "true",
              "properties": {
                "publish": {
                  "type": "boolean"
                },
                "value": {
                  "type": "string"
                }
              }
            },
            "location": {
              "dynamic": "true",
              "properties": {
                "country": {
                  "dynamic": "true",
                  "properties": {
                    "code": {
                      "type": "string"
                    }
                  }
                },
                "name": {
                  "type": "multi_field",
                  "fields": {
                    "name": {
                      "type": "string",
                      "index": "analyzed"
                    },
                    "untouched": {
                      "type": "string",
                      "index": "not_analyzed"
                    }
                  }
                },
                "publish": {
                  "type": "boolean"
                }
              }
            },
            "pictureUrl": {
              "dynamic": "true",
              "properties": {
                "publish": {
                  "type": "boolean"
                },
                "value": {
                  "type": "string"
                }
              }
            },
            "positions": {
              "dynamic": "true",
              "properties": {
                "_total": {
                  "type": "long"
                },
                "values": {
                  "dynamic": "true",
                  "properties": {
                    "company": {
                      "dynamic": "true",
                      "properties": {
                        "id": {
                          "type": "long"
                        },
                        "industry": {
                          "type": "string"
                        },
                        "name": {
                          "type": "string"
                        },
                        "size": {
                          "type": "string"
                        },
                        "ticker": {
                          "type": "string"
                        },
                        "type": {
                          "type": "string"
                        }
                      }
                    },
                    "endDate": {
                      "dynamic": "true",
                      "properties": {
                        "month": {
                          "type": "long"
                        },
                        "year": {
                          "type": "long"
                        }
                      }
                    },
                    "id": {
                      "type": "long"
                    },
                    "isCurrent": {
                      "type": "boolean"
                    },
                    "publish": {
                      "type": "boolean"
                    },
                    "startDate": {
                      "dynamic": "true",
                      "properties": {
                        "month": {
                          "type": "long"
                        },
                        "year": {
                          "type": "long"
                        }
                      }
                    },
                    "summary": {
                      "type": "string"
                    },
                    "title": {
                      "type": "multi_field",
                      "fields": {
                        "title": {
                          "type": "string",
                          "index": "analyzed"
                        },
                        "untouched": {
                          "type": "string",
                          "index": "not_analyzed"
                        }
                      }
                    }
                  }
                }
              }
            },
            "publicProfileUrl": {
              "dynamic": "true",
              "properties": {
                "publish": {
                  "type": "boolean"
                },
                "value": {
                  "type": "string"
                }
              }
            },
            "recommendationsReceived": {
              "dynamic": "true",
              "properties": {
                "_total": {
                  "type": "long"
                },
                "values": {
                  "dynamic": "true",
                  "properties": {
                    "id": {
                      "type": "long"
                    },
                    "publish": {
                      "type": "boolean"
                    },
                    "recommendationText": {
                      "type": "string"
                    },
                    "recommendationType": {
                      "dynamic": "true",
                      "properties": {
                        "code": {
                          "type": "string"
                        }
                      }
                    },
                    "recommender": {
                      "dynamic": "true",
                      "properties": {
                        "firstName": {
                          "type": "string"
                        },
                        "id": {
                          "type": "string"
                        },
                        "lastName": {
                          "type": "string"
                        }
                      }
                    }
                  }
                }
              }
            },
            "skills": {
              "dynamic": "true",
              "properties": {
                "_total": {
                  "type": "long"
                },
                "values": {
                  "dynamic": "true",
                  "properties": {
                    "id": {
                      "type": "long"
                    },
                    "publish": {
                      "type": "boolean"
                    },
                    "skill": {
                      "dynamic": "true",
                      "properties": {
                        "name": {
                          "type": "multi_field",
                          "fields": {
                            "name": {
                              "type": "string",
                              "index": "analyzed"
                            },
                            "untouched": {
                              "type": "string",
                              "index": "not_analyzed"
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            "specialties": {
              "dynamic": "true",
              "properties": {
                "publish": {
                  "type": "boolean"
                },
                "value": {
                  "type": "string"
                }
              }
            },
            "summary": {
              "dynamic": "true",
              "properties": {
                "publish": {
                  "type": "boolean"
                },
                "value": {
                  "type": "string"
                }
              }
            }
          }
        },
        "sap": {
          "dynamic": "true",
          "properties": {
            "Corporate Email": {
              "type": "string"
            },
            "Cost Center": {
              "type": "string"
            },
            "DOJ": {
              "type": "string"
            },
            "Date of Birth": {
              "type": "string"
            },
            "Emp Code": {
              "type": "string"
            },
            "External Person ID": {
              "type": "string"
            },
            "Gender Key": {
              "type": "string"
            },
            "Job Area Name": {
              "type": "string"
            },
            "Job Family": {
              "type": "string"
            },
            "Job Family Name": {
              "type": "string"
            },
            "Job ID": {
              "type": "string"
            },
            "Job Name / Job Role": {
              "type": "string"
            },
            "Location": {
              "type": "string"
            },
            "Name": {
              "type": "string"
            },
            "Name of superior OM": {
              "type": "string"
            },
            "Org. Units Name": {
              "type": "string"
            },
            "Org.Units Abbreviation": {
              "type": "string"
            },
            "Organizational Unit Key Value": {
              "type": "string"
            },
            "Pers.no of superior OM": {
              "type": "string"
            },
            "Personnel Number": {
              "type": "string"
            },
            "Position ID": {
              "type": "string"
            },
            "Position Name": {
              "type": "string"
            },
            "Signums": {
              "type": "string"
            }
          }
        },
        "signum": {
          "type": "string"
        }
      }
    }
  }
}'

```

### Create river

#### File system

```
curl -XPUT 'localhost:9200/_river/profile_db/_meta' -d '{
  "type": "fs",
  "fs": {
        "name": "public profiles",
        "url": "/tmp",
        "update_rate": 900000,
        "includes": "*.doc,*.pdf",
        "excludes": "resume"
  }
}
```

#### CouchDB

```
`curl -XPUT 'localhost:9200/_river/profile_db/_meta' -d '{
    "type" : "couchdb",
    "couchdb" : {
        "host" : "localhost",
        "port" : 8084,
        "db" : "profiles",
        "filter" : null,
        "user" : "admin",
        "password" : "ikea",
	"ignore_attachments":true
    },
    "index" : {
        "index" : "lockpoc",
        "type" : "profiles",
        "bulk_size" : "100",
        "bulk_timeout" : "10ms"
    }
}'
```


