'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _mimeTypes = require('mime-types');

var _mimeTypes2 = _interopRequireDefault(_mimeTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = _express2.default.Router();

/**
 * opts {
 * spa: boolean
 * showHidden: boolean
 * }
 */

exports.default = (sitePath, opts) => {
	const options = {
		dotfiles: opts.showHidden ? 'allow' : 'deny'
	};

	router.get('*', async (req, res) => {
		const targetPath = req.originalUrl.split('?')[0];
		try {
			const target = _path2.default.join(sitePath, targetPath);
			const stat = await _fs2.default.statSync(target);
			if (stat.isFile()) {
				if (!_mimeTypes2.default.lookup(target)) {
					res.type('text/plain');
				}
				return res.sendFile(target, options);
			} else {
				if (_fs2.default.existsSync(_path2.default.join(sitePath, targetPath, 'index.html'))) {
					return res.sendfile(_path2.default.join(sitePath, targetPath, 'index.html'));
				}
				return res.sendFile(_path2.default.join(sitePath, `${targetPath}.html`), err => {
					if (err) {
						return res.status(404).send(404);
					}
				});
			}
		} catch (err) {
			if (opts.spa == true) {
				return res.sendFile(_path2.default.join(sitePath, `index.html`));
			}
			if (err.errno == -2) {
				return res.status(404).send(404);
			}
			return res.send(err);
		}
	});

	return router;
};
//# sourceMappingURL=index.js.map