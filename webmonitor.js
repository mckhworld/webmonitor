class webmonitor {
/*
	options = {
		protocol : ''       // 'http' or 'https' 
		,host : ''          // host name of the URL 
		,path : ''          // path of the URL (should start with '/')
		,port : 0           // port number (optional, 80 or 443 or otherwise)
		,headers : {}       // headers (optional) {name1: value1, name2: value2...}
		,search : /regex/g  // regex pattern to extract data from the response
	};
*/
	constructor(options) {
		// settings
		this.options = options;
		if (this.options.port==null && this.options.protocol=='http') this.options.port = 80;
		if (this.options.port==null && this.options.protocol=='https') this.options.port = 443;
		//console.log('webmonitor: constructor: options',options);
		// result
		this.response = {}; // response from http request
		this.match = []; // regex match with the options.search pattern
	}

	// @param ms : delay msec before checking web site
	checkAfterMax(ms) {
		return new Promise((resolve,reject)=>{
			setTimeout(()=>
				{
					this.checkNow()
					.then((value)=>{
						resolve(value);
					})
					.catch((reason)=>{
						reject(reason);
					})
					;
				}
				,
				Math.floor(Math.random()*ms)
			); // setTimeout()
		}); // new Promise()
	};

	checkNow() {
		return new Promise((resolve,reject)=>{
			const httpoptions = {
				protocol: this.options.protocol,
				host: this.options.host,
				port: this.options.port,
				path: this.options.path,
				headers: this.options.headers
			}

			const httpTimeoutDone = false;
			const httpTimeout=setTimeout(
				()=>{
					console.log(`Error: HTTP request timeout. ${this.options.protocol}://${this.options.host}:${this.options.port}${this.options.path}`);
					reject(`Error: HTTP request timeout. ${this.options.protocol}://${this.options.host}:${this.options.port}${this.options.path}`);
				}, 
				10000
				); // setTimeout()
			this.httpget(httpoptions, (err,result)=>{
				clearTimeout(httpTimeout);
				if (err) {
					console.log(`Error: HTTP error. ${this.options.protocol}://${this.options.host}:${this.options.port}${this.options.path}:`,err);
					reject(`Error: HTTP error. ${this.options.protocol}://${this.options.host}:${this.options.port}${this.options.path}: ${err}`);
				} else {
					//console.log(`httpget success: processing`);
					this.response = result.resData;
					let search = this.options.search;
					search.lastIndex = 0; // reset the regex state from previous search
					this.search = search; // output the searching regex back to caller
					this.match = null; // reset match, prepare for search again
					if (search!==null)	{
						//console.log(`httpget success: searching`);
						this.match = search.exec(this.response);
					}
					resolve(this);
				}
			}); // getStatus()
		});// new Promise()
	}

	httpget(httpoptions, callback) {
		// result to be passed to callback function's 2nd parameter
		let returnValue = {
			resData: {} // http response data
		};

		let httpx; // either http or https, depends on the protocol in the options
		if (httpoptions.protocol=='http') {
			//console.log('http');
			httpx = require('http');
		} else if (httpoptions.protocol=='https') {
			//console.log('https');
			httpx = require('https');
		} else {
			callback('Error: unsupported protocol '+httpoptions.protocol, null);
		}

		let options={
			host: httpoptions.host,
			port: httpoptions.port,
			path: httpoptions.path,
			headers: httpoptions.headers
		}

		try {
			httpx.get(options, (res)=>{
				let resdata='';
				res.on('data',(chunk)=>{
					resdata+=chunk;
				})
				res.on('end',()=>{
					returnValue.resData = resdata;
					callback(null,returnValue);
				})
				res.on('error',(err)=>{
					callback(err,null);
				})
			});
		} catch (e) {
			callback(e,null);
		}
	}

};

//===============================================================================================================
// Send message to Telegram: "https://api.telegram.org/<bot_id>:<api_token>/sendMessage?chat_id=@<channel_name>&text=" & $msg
function sendMsg(msg) {
	var telegramSecret = require("./telegramSecret");
	
	const https = require('https');
	const options = {
		host: 'api.telegram.org',
		path: `/${telegramSecret.botId}:${telegramSecret.apiToken}/sendMessage?chat_id=${telegramSecret.channelId}&text=${encodeURI(msg)}`,
		headers: {
		}
	}
	https.get(options, (res)=>{
		res.on('error',()=>{
			console.log('sendMsg(): error:',res);
		});
	});
}

//===============================================================================================================

exports.webmonitor = webmonitor ;
exports.sendMsg = sendMsg ;
