const { dolls } = require('girlsfrontline-core');

const unit = dolls.find(({codename}) => codename === 'G36');
if (unit)
	console.log(unit);
else
	console.log('could not find unit!')