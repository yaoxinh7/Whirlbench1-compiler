## Whirlbench1 Compiler
一个将scratch编译为纯js 脱离vm运行时的编译器

## 声明
Whirlbench与scratch,scratch基金会或Turbowarp无任何关联 它是一个纯新项目
Scratch 是 Scratch 基金会的一个项目。可在 https://scratch.org/ 免费使用。
Turbowarp 是 由社区维护的一个项目。可在 https://turbowarp.org/ 免费使用。

### 项目状态
由于[scratch](https://github.com/scratchfoundation)很多历史遗留问题 此项目已停止开发 开发中心已转向Whirlglide(目前暂未公开)
我们原本打算基于其旧的BSD版本 并将此编译器接入 但最后由于我是一人独立开发 导致无力继续维护 现在已经转向为重写 编辑器那边可能在我理清许可证问题后再提交
现在这个编译器参考了scratch的公开存档格式(sb3) 其他代码基本由我初学js时独自完成 使用大语言模型编写了几个工具函数 由于是初学时期 代码质量不高 见谅
如果你还没被吓跑的话 那就开始赤吧:))

### 使用
```bash
#克隆
git clone git@github.com:yaoxinh7/Whirlbench1-compiler.git
cd Whirlbench1-compiler
#安装依赖
bun install
#编译 
bun run dist
```
然后 在dist-compiler中 产生whirl.cjs
然后将`src/compiler/extjs复制到你的whirl.cjs目录下

然后 克隆[vm]()

然后 require('whirl.cjs') 获取到Whirlbench类 
```javascript
const whirl=new Whirlbench()
//传入目标路径+project.json反序列化后的实例 为每个角色生成一个js类
whirl.gen(path,projectJsonObj)
//构建单js文件
whirl.dist(path)
```
最后 将编译好的js文件 作为main.js 放到Runtime(git@github.com:yaoxinh7/WhirlbenchRuntime.git)的src/中 然后运行就可以了:)

### 性能
这个编译器产物不依赖scratchvm js语义(无cast) 所以在兼容的前提下 可以跑出很优秀的成绩(部分情况下反超Turbowarp) 但与部分scratch作品和所有Turbowarp拓展不兼容(因为无vm)

### 许可
采用GPLv3协议确保当前版本自由传播;详情请见[LICENSE](./LICENSE)

### 注意
此项目目前已经基本停止维护 我无法确保:issue会修,PR会审,如果你想使用这个项目 建议克隆+建立新仓库