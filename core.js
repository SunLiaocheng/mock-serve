/**
 * @param type: [string, number, object, array, boolean, date]
 * @description {
 *    'name | mockfunc': template
 * }
 *       |        |         |
 *       v        v         v
 *     参数名   使用方法    模板数据（模板类型）
 * @param 特殊参数名，自动生成参数值： url, email, ip, province, city, county, id, date, time, datetime
 */

const fs = require('fs-extra')
const path = require('path')

const Handler = require('mockjs/src/mock/handler')
const Random = require('mockjs/src/mock/random')

const reg = {
    expression: /{{(.*?)}}/g,
    pipe: /\s*\|\s*/,
    json: /^[^_].*\.json$/,
    js: /.+\.js$/,
}

function parseResponse(resp) {
    const specialKey = [
        'url',
        'email',
        'ip',
        'province',
        'city',
        'county',
        'id',
        'date',
        'time',
        'datetime',
    ]
    const respLeft = Object.keys(resp)
    let reVal = null
    let keys = []
    let rules = []
    let result = {}
    respLeft.forEach(el => {
        keys.push(el.split(reg.pipe)[0])
        rules.push(el.split(reg.pipe)[1])
    })

    respLeft.forEach((key, index) => {
        reVal = null
        if (typeof resp[key] === 'object') {
            result = Object.assign({ [key]: parseResponse(resp[key]) }, result)
            return
        }
        specialKey.some(el => {
            if (el === rules[index]) {
                reVal = Random[el]()
            }
        })
        reVal ? reVal : (reVal = Handler.gen(resp[key]))
        result = Object.assign(result, { [keys[index]]: reVal })
    })
    return result
}

function readAPIs(app, config) {
    const status = config.status
    fs.readdirSync(path.resolve(__dirname, config.path)).forEach(file => {
        const filePath = path.resolve(__dirname, config.path) + '/' + file
        const stat = fs.statSync(filePath)
        const isJson = file.match(reg.json) !== null
        const isJs = file.match(reg.js) !== null
        let apis = require(filePath)

        if (stat.isFile() && (isJs || isJson)) {
            if (!Array.isArray(apis)) {
                apis = [apis]
            }

            apis.forEach(api => {
                const apiStatus = api.status
                app[api.method](api.url, function(req, res, next) {
                    let result = {}
                    let list = []
                    if (status !== 200 || (apiStatus !== 200 && apiStatus)) {
                        res.send(
                            JSON.stringify({
                                code: api.code,
                                data: null,
                                message: api.response.errMsg || '异常错误',
                            })
                        )
                    }
                    const param = api.method === 'get' ? req.query : req.body
                    console.log(param)
                    const pagination = {
                        page: param.page,
                        pageSize: param.pageSize || 1,
                    }
                    if (pagination.page) {
                        for (let i = 0; i < pagination.pageSize; i++) {
                            list.push(parseResponse(api.response))
                        }
                        result = Object.assign(list, pagination)
                    } else {
                        result = parseResponse(api.response)
                    }
                    res.send(
                        JSON.stringify({ code: 0, data: result, message: '' })
                    )
                })
            })
        } else if (stat.isDirectory()) {
            readAPIs(app, filePath)
        } else {
            throw new Error('文件读取错误')
        }
    })
}

module.exports = readAPIs
