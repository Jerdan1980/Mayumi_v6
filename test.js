const { dolls } = require('girlsfrontline-core');
const gfcore = require('girlsfrontline-core/build/i18n/en-US/gfcore.json');

const unit = dolls.find(({codename}) => codename === 'Jill');
if (unit) {
	console.log(unit);
	let str = []
	//console.log(JSON.stringify(unit.effect.gridEffect))
	for (const [key, value] of Object.entries(unit.effect.gridEffect)) {
		str.push(`${value}% ${key}`)
	}
	console.log(str.join(', '))
	console.log(gfcore[unit.skill1.detail])
} else
	console.log('could not find unit!')

var today = new Date();
console.log(today.getDay());

console.log(-1 % 3)