import express from 'express'
import path from 'path'
import fs from 'fs'

import mime from 'mime-types'

const router = express.Router()

/**
 * opts {
 * spa: boolean
 * 
 * showHidden: boolean
 * }
 */
export default (sitePath, opts) => {
	const options = {
		dotfiles: opts.showHidden ? 'allow': 'deny'
	}

	router.get('*', async (req, res) => {
		const targetPath = req.originalUrl.split('?')[0]
		try {
			const target = path.join(sitePath, targetPath)
			const stat = await fs.statSync(target)
			if(stat.isFile()) {
				if(!mime.lookup(target)){
					res.type('text/plain')
				}
				return res.sendFile(target, options)
			}
			else{
				if(fs.existsSync(path.join(sitePath, targetPath, 'index.html'))) {
					return res.sendFile(path.join(sitePath, targetPath, 'index.html'))
				}
				throw '404'
			}
		} catch(err) {
			const targetHtml = path.join(sitePath, `${targetPath}.html`)
			if(opts.spa == true) {
				return res.sendFile(path.join(sitePath, `index.html`))
			}
			if(fs.existsSync(targetHtml)) {
				return res.sendFile(targetHtml)
			}
			return res.status(404).send('404')
		}
	})

	return router
}