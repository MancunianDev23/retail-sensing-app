var connString = function createConnectionUri(db) {
	var prefix = 'mongodb://Peter:biodata01@cluster0-shard-00-00-4isud.mongodb.net:27017,cluster0-shard-00-01-4isud.mongodb.net:27017,cluster0-shard-00-02-4isud.mongodb.net:27017/';
	//var prefix = 'mongodb://tomplumpton:Biodata01*@cluster0-shard-00-00-7kwa9.mongodb.net:27017,cluster0-shard-00-01-7kwa9.mongodb.net:27017,cluster0-shard-00-02-7kwa9.mongodb.net:27017/';
    var suffix = '?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin';
	return prefix + db + suffix;
}

module.exports = {
    'RetailSensing' : connString('RetailSensing'),
    'acuitis' : connString('acuitis'),
    'admin': connString('admin'),
    'bents_garden' : connString('bents_garden'),
    'blackheath_lib' : connString('blackheath_lib'),
    'clasohlson' : connString('clasohlson'),
    'connString': connString
}