const fs = require('fs');
const files = [
  'app/store/userService.js', 
  'app/store/teamService.js', 
  'app/store/serviceService.js', 
  'app/store/projectService.js', 
  'app/store/packageService.js', 
  'app/store/authService.js'
];

files.forEach(f => {
  try {
    const content = fs.readFileSync(f, 'utf8');
    const newContent = content.replace(/'http:\/\/localhost:5000\/api'/g, 'process.env.NEXT_PUBLIC_API_URL || \'http://localhost:5000/api\'');
    fs.writeFileSync(f, newContent);
    console.log('Updated ' + f);
  } catch (err) {
    console.log('Error processing ' + f, err);
  }
});

// Also update next.config.mjs
const nextConfigPath = 'next.config.mjs';
try {
  let nextConfig = fs.readFileSync(nextConfigPath, 'utf8');
  nextConfig = nextConfig.replace(/'http:\/\/localhost:5000\/api\/:path\*'/g, 'process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/:path*` : \'http://localhost:5000/api/:path*\'');
  fs.writeFileSync(nextConfigPath, nextConfig);
  console.log('Updated next.config.mjs');
} catch (err) {
  console.log('Error updating next.config.mjs', err);
}
