# vyron-cli
just for work convenient and fast



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
│   ├── util		// 一系列工具函数
│   │   ├── index.js
└── yarn-error.log



commander，获取命令行传参。

download-git-repo，下载git仓库，通常用来下载模板和配置文件

colors，命令行带颜色输出，比如error输出红色，success输出绿色提示。

fs-extra，在nodejs的fs基础上增加了一些新的方法，更好用，可以直接替代fs。

ora，加载中状态表示的时候一个loading怎么够，再在前面加个小圈圈转起来，成功了console一个success怎么够，前面还可以给他加个小钩钩，ora就是做这个的。

inquirer，命令行交互的时候你需要填project name等一系列信息，这个时候inquirer就可以用起来啦。