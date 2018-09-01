import path from 'path'
import fs from 'fs'

import mime from 'mime-types'

/**
 * opts {
 * spa: boolean
 * showHidden: boolean
 * }
 */
export default async (sitePath, targetPath, opts) => {
	const options = {
		dotfiles: opts.showHidden ? 'allow': 'deny'
	}

	let out = {
		status: 400,
		path: '',
		options: options,
		type: null
	}

	try {
		const target = path.join(sitePath, targetPath)
		const stat = await fs.statSync(target)
		if(stat.isFile()) {
			if(!mime.lookup(target)){
				out.type = 'text/plain'
			}
			out.status = 200
			out.path = target
			return out
		}
		throw Error()
	} catch(err) {
		if(opts.spa == true) {
			out.status = 200
			out.path = path.join(sitePath, `index.html`)
			return out
		}
		const targetHtml = path.join(sitePath, `${targetPath}.html`)
		if(fs.existsSync(targetHtml)) {
			out.status = 200
			out.path = targetHtml
			return out
		}
		if(fs.existsSync(path.join(sitePath, targetPath, 'index.html'))) {
			out.status = 200
			out.path = path.join(sitePath, targetPath, 'index.html')
			return out
		}
		return out
	}
}