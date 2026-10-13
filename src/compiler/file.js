const fs = require("fs");
const path = require("path"); 
class file{
    rfile(relativePath) {
        return fs.readFileSync(path.join(__dirname, relativePath), 'utf8');
    }
    wfile(relativePath, data) {
        const absolutePath = path.join(__dirname, relativePath);
        fs.writeFileSync(absolutePath, data, 'utf8');
    }
}
export default file;