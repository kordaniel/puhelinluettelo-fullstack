
console.log('user: ', process.env.ATLAS_USER)
console.log('pass: ', process.env.ATLAS_PASS)
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load()
}
console.log(process.argv)
//console.log(process.argv[2])
//console.log(process.argv[3])
console.log(process.env.NODE_ENV)
console.log('bye bye')

console.log('user: ', process.env.ATLAS_USER)
console.log('pass: ', process.env.ATLAS_PASS)
