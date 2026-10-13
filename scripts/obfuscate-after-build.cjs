const fs = require('fs');
const JavaScriptObfuscator = require('javascript-obfuscator');

const inputPath = './dist-compiler/whirl.cjs';
const outputPath = './dist-compiler/whirlbench.cjs'; // 或覆盖原文件

const sourceCode = fs.readFileSync(inputPath, 'utf8');

const obfuscationResult = JavaScriptObfuscator.obfuscate(sourceCode, {
  // 下面配置详细解释
  compact: true,                     // 压缩输出（一行）
  target: 'node',                    // 针对 Node.js 环境
  identifierNamesGenerator: 'hexadecimal', // 变量名、函数名 → _0xabc123 形式
  renameGlobals: false,              // 不重命名全局变量（避免破坏模块导出）
  renameProperties: false,            // 【字段名混淆】将对象属性名也重命名
  renamePropertiesMode: 'safe',      // 安全模式，跳过内置属性
  numbersToExpressions: true,        // 数字混淆（例如 1234 → 0x4d2 或表达式）
  
  // 字符串处理：放入数组 + Unicode 十六进制转义
  stringArray: true,                 // 启用字符串数组（封包）
  stringArrayEncoding: [],           // 不额外 base64/rc4 编码（保持简单）
  unicodeEscapeSequence: true,       // 将字符串转为 \uXXXX 十六进制形式
  stringArrayThreshold: 1,           // 所有字符串都进数组
  stringArrayRotate: true,           // 随机旋转数组位置
  stringArrayShuffle: true,          // 打乱数组顺序
  
  // 控制流简单混淆（轻度）
  controlFlowFlattening: true,       // 启用控制流扁平化
  controlFlowFlatteningThreshold: 1, 
  
  // 避免过度混淆（提高性能、避免错误）
  deadCodeInjection: false,
  debugProtection: true,
  selfDefending: false,
  simplify: true,                    // 保留简单优化
  splitStrings: false,
  transformObjectKeys: true,
  
  // 保留一些关键字，避免破坏模块机制
  reservedNames: ['require', 'exports', 'module', '__filename', '__dirname', 'export'],
  reservedStrings: [],
});

const obfuscatedCode = obfuscationResult.getObfuscatedCode();
fs.writeFileSync(outputPath, obfuscatedCode, 'utf8');
console.log(`Obfuscated file saved to ${outputPath}`);