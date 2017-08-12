
var webmonitor = require("./webmonitor").webmonitor;
var sendMsg = require("./webmonitor").sendMsg;


var fireworkMon = new webmonitor({
		protocol : 'https'       // 'http' or 'https' 
		,host : 'www.london.gov.uk'          // host name of the URL 
		,path : '/events/2017-12-31/london-new-years-eve-fireworks-2017'          // path of the URL (should start with '/')
		,headers : { // if the web site does not requires headers, you can ignore it
			'accept-language': 'zh-TW,zh;q=0.8,en-GB;q=0.6,en;q=0.4,en-US;q=0.2,zh-CN;q=0.2'
			,'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36'
			,'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
			,'cache-control': 'max-age=0'
			,'authority': 'www.london.gov.uk'
		}
		,search : /(ticket.+?)<\/span>/ig  // RegEx to extract data from the web site response, matching groups are returned in result.match[] in .then(result)
});

try {
	let lastResult = '';
	setInterval(()=>{
		console.log('Checking London New Year Fireworks ticketing web page...');
		fireworkMon.checkNow()
		.then((result)=>{
			try {
				console.log('** Match: ',result.match[1]);
				//console.log('Result: ',result.response);
				if (result.match[1]!==lastResult) {
					console.log('** Changed!');
					sendMsg(`Web Monitor - change detected:\n** Current: ${result.match[1]}\n** Previous: ${lastResult}\n** URL: ${result.options.protocol}://${result.options.host}:${result.options.port}${result.options.path}`);
				}
				lastResult = result.match[1];
			} catch (e) {
				throw 'No match is found in the web page. '+e;
			}
		})
		.catch((err)=>{
			console.log('Error: '+err);
		})
		;
	},10000);
} catch (e) {
	console.log('Unexpected error... '+e);
	sendMsg(`Web Monitor - unexpected error!!!  Stopped!!!`);
}
