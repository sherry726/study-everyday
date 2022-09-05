安装所有依赖
yarn  或者  yarn install  或者 npm install
PS:前后端代码都需要安装依赖

启动frontend
yarn serve

下载及安装mongodb
CSDN:https://blog.csdn.net/qq_26427777/article/details/120767605

启动mongodb
mongod -dbpath 数据存放的路径

启动backend
yarn dev
PS:后端代码一定要在数据库启动的情况下才可以启动


-----------------------------------------------

技术栈
vue vue-router vuex

脚手架
vue-cli

请求库
axios

后端服务
nodejs

------------------------------------------------
安装vue-cli
https://cli.vuejs.org/zh/guide/installation.html
npm install -g @vue/cli     //安装vue-cli命令
vue --version               //查看vue-cli是否安装成功
vue create <project-name>   //创建项目


vue.config.js：与webpack相关的配置信息；这个文件在vue-cli3版本中才出现的

vue-cli2版本是有webpack配置的，会在项目里有一个webpack.config.js文件