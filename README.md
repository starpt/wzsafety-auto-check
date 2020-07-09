## 温州安全生产网络排查系统自动检查

#### 下载并安装Node.js
http://nodejs.org/
下载并安装Node.js，安装先项选默认即可。
运行命令cmd，在cmd窗口输入：node -v，显示node版本号即安装node成功。

#### 下载并安装tesseract
https://digi.bib.uni-mannheim.de/tesseract/
在这页面下载适合版本的tesseract，用于验证码识别。安装完成以后，请在 高级系统属性 设置环境变量 Path 增加tesseract的安装目录，默认是：C:\Program Files\Tesseract-OCR，设置完成后并重启系统。
运行命令cmd，在cmd窗口输入： tesseract -v，显示tesseract版本号即安装设置tesseract成功。

### 安装自动检查程序
运行cmd命令，切换cmd目录致本程序所在目录，然后在cmd窗口输入：npm i
等待安装完成，无报错既安装成功。如果没有成功，删除目录下的node_modules文件夹后再次安装。

### 运行检查程序
运行cmd命令，切换cmd目录致本程序所在目录，然后在cmd窗口输入：node app
等待cmd窗口显示运行结果。

### 用户登录名和密码设置
打开本目录下的user.txt文件，一行一个用户名（即密码）。如果用户想用excel打开，请和程序开发人员联系！

### 联系我们
starpt@gmail.com
