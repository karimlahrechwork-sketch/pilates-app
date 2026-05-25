const fs = require('fs')

function makeSVG(size) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="#7a9e7e"/>
  <text x="50%" y="54%" font-family="serif" font-size="${size * 0.52}" fill="white" text-anchor="middle" dominant-baseline="middle">✦</text>
</svg>`
}

fs.writeFileSync('public/icon-192.png', makeSVG(192))
fs.writeFileSync('public/icon-512.png', makeSVG(512))
console.log('Icons generated (SVG as placeholder — replace with real PNGs for production)')
