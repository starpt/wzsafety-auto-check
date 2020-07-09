const exec = require('child_process').exec
const http = require('http')
const fs = require('fs')
const superagent = require('superagent') //一个的请求代理模块api，可处理get,post,put,delete,head请求
const md5 = require('md5')
const colors = require('colors')

let codeUrl = 'http://wgpc.wzsafety.gov.cn/ValidataImage.aspx' //验证码网址
let loginUrl = 'http://wgpc.wzsafety.gov.cn/Ajax/login_qydl.ashx' //登录网址
let checkUrl = 'http://wgpc.wzsafety.gov.cn/Commpany/Ajax/Handler104_2.ashx' //检查网址

let getCode = (callback) => {
	http.get(codeUrl, (res) => {
		let chunks = [] //用于保存网络请求不断加载传输的缓冲数据
		let size = 0   //保存缓冲数据的总长度
		res.on('data', (chunk) => {
			chunks.push(chunk)
			size += chunk.length
		})
		res.on('end', () => {
			let cookie = res.headers ? res.headers['set-cookie'] : null
			let data = Buffer.concat(chunks, size)
			fs.writeFile('cache.png', data, 'binary', () => {
				exec('tesseract cache.png cache --psm 7', () => {
					fs.readFile('cache.txt', 'utf-8', (err, data) => {
						if (err) {
							getCode(callback)
						} else {
							data = data.replace(/[\W_]/g, '')
							if (cookie && data.length == 4) {
								callback(cookie, data)
							} else {
								getCode(callback)
							}
						}
					})
				})
			})
		})
	})
}

let login = (cookie, params, callback) => {
	superagent(loginUrl)
		.type('form')
		.set({ Cookie: cookie.toString() })
		.send(params)
		.then((res) => {
			let json = res ? res.text : ''
			json = JSON.parse(json)
			if (json && json.ID) {
				params.CID = json.ID
				params.name = json['企业名称']
				superagent(checkUrl).type('form').send(params).then((res) => {
					let log = res.text.replace(/(<([^>]*)>)/g, '')
					if (/本季度完成上报隐患/.test(log)) {
						console.log(params.name + ' ' + log.green)
					} else {
						console.log(params.name + ' ' + log.red)
					}
					params.log = log
					callback()
				})
			} else if (json.Message == '验证码错误！！') {
				console.log(params.uid + ' ' + json.Message.cyan)
				callback()
			} else {
				params.log = json.Message
				console.log(params.uid + ' ' + json.Message.yellow)
				callback()
			}
		})
}

let getUser = () => {
	return new Promise((resolve, reject) => {
		fs.readFile('user.txt', 'utf-8', (err, data) => {
			let arr = []
			if (!err) data = data.split(/[\r\n]+/)
			for (let i of data) {
				if (/^\w+$/.test(i)) {
					arr.push({
						uid: i,
						pwd: md5(i)
					})
				}
			}
			resolve(arr)
		})
	})
}

let start = new Date()
let check = (user) => {
	if (user && user.length) {
		let log = ''
		for (let self of user) {
			if (!self.log) {
				getCode((cookie, code) => {
					self.htmvalidatainfo = code
					login(cookie, self, () => {
						check(user)
					})
				})
				return
			}
			log += (self.name || self.uid) + ' ' + self.log + '\r\n'
		}
		if (log) {
			console.log(('自动检查结束，总共运行时间:' + (new Date() - start) / 1000 + '秒').blue)
		}
	} else {
		getUser().then(result => {
			check(result)
		})
	}
}
check()
