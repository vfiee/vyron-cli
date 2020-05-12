## vyron-cli  
   为工作方便搭建的cli工具  

├── bin	// 命令行  
│   ├── vyron		// vyron 命令  
│   ├── vyron-build		// vyron build 命令  
│   ├── vyron-update		// vyron update 命令  
│   └── vyron-init		// vyron init 命令  
├── package.json  
├── node_modules  
├── src  
│   ├── config  
│   │   ├── babel.js	// Babel 配置  
│   │   ├── index.js		// 目录名及入口文件名相关配置  
│   │   └── uglify.js  
│   ├── creator.js  
│   ├── util		// 一系列工具函数类  
│   │   ├── index.js  
└── yarn-error.log  



commande 获取命令行传参。  

download-git-repo  下载git仓库，用来下载模板和配置文件  

fs-extra 在nodejs的fs基础上增加了一些新的方法，可以直接替代fs。  

ora  加载中状态表示的时候一个loading怎么够，再在前面加个小圈圈转起来。

inquirer 命令行交互的时候你需要填project name等一系列信息，这个时候inquirer就可以用起来啦。

child_process 执行终端命令行工具  

chalk  打印有颜色的log  


## 版本号格式  
使用 （major.minor.patch-stage.num） 的形式  
    stage 一般选用：alpha、beta、rc。  

### 递增一个修订号
npm version patch  

### 递增一个次版本号
npm version minor  

### 递增一个主版本号
npm version major  
