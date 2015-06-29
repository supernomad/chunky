[![GitHub license](https://img.shields.io/badge/license-GPL--3.0-green.svg)]()
[![GitHub version](https://badge.fury.io/gh/supernomad%2Fchunky.svg)](http://badge.fury.io/gh/supernomad%2Fchunky)
[![Codacy Badge](https://www.codacy.com/project/badge/92a9c19ff3474abeaaf0e869317da1a3)](https://www.codacy.com/app/csaide/chunky)
[![Coverage Status](https://coveralls.io/repos/Supernomad/chunky/badge.svg?branch=master)](https://coveralls.io/r/Supernomad/chunky?branch=master)
[![Build Status](https://travis-ci.org/Supernomad/chunky.svg?branch=master)](https://travis-ci.org/Supernomad/chunky)

[![NPM](https://nodei.co/npm/chunkyjs.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/chunkyjs/)
# chunkyjs
An async upload/download node library leveraging express.js, which provides chunked transfer api's. This library was designed to abstract away the intricacies of providing a chunked transfer api. 
 
### Installation
Installation is the same as any other module, however expressjs is currently required to use the library.
```
	npm install chunkyjs
```
### Usage
Basic usage of chunkyjs is as simple as requiring the module and passing it into the expressjs app's `use` funtion
``` js
	var express = require('express'),
		app = express(),
		chunky = require('chunkyjs');
	
	app.use(chunky.chunked());
	app.listen(8080);
```

### Caching
There is currently only support for caching transfer data locally. This uses `node-cache` under the hood for now, but in an upcoming release there will be support for both `redis` and `mongoDb`.

### Options
``` js
	{
		debug: false
	}
```