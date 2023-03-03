var EnvChannel = {
	DEVELOPMENT: 0, //开发环境
	PRODUCTION: 1 //生产环境
}

// 设置环境，更改参数可改变当前运行所用环境以及参数
const ENV_CHANNEL = 1;
let ENV_CONFIG = null;

if (ENV_CHANNEL == EnvChannel.DEVELOPMENT) {
	// 开发环境
	ENV_CONFIG = require('./env.dev.js');
} else {
	//生产环境
	ENV_CONFIG = require('./env.prod.js');
}

// 给环境变量process.uniEnv赋值
if (ENV_CONFIG) {
	process.uniEnv = {};
	for (let key in ENV_CONFIG) {
		process.uniEnv[key] = ENV_CONFIG[key];
	}
}

