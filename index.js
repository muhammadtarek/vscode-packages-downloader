const Fs = require('fs');
const Path = require('path');
const Axios = require('axios');

const packages = require('./config/extensions.json');

async function downloadPackage(url, name) {
  const path = Path.resolve(__dirname, 'packages', `${name}.VSIX`);
  const writer = Fs.createWriteStream(path);

  const response = await Axios({
    url,
    method: 'GET',
    responseType: 'stream',
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}

async function downloadAllPackages() {
  for (const vsPackage of packages) {
    const url = `http://${vsPackage.publisher}.gallery.vsassets.io/_apis/public/gallery/publisher/${
      vsPackage.publisher
    }/extension/${vsPackage.name}/${vsPackage.version}/assetbyname/Microsoft.VisualStudio.Services.VSIXPackage`;

    await downloadPackage(url, vsPackage.name); // eslint-disable-line
  }
}

downloadAllPackages();
