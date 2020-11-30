const NodeGeocoder=require('node-geocoder')

const options={
    provider:'mapquest',
    httpAdapter:'https',
    apiKey:'1UF4xNeXM1YdSmhpVn9Rm4K2O5G9S1wl',
    formatter:null
}
const geocoder=NodeGeocoder(options)

module.exports=geocoder
