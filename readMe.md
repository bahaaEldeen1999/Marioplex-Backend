## pre-requisites installation instraction
### frist Node.js 
>Open source, cross-platform runtime environment for developing server-side web applications. Node.js includes the npm command line tool.
> download https://nodejs.org
### download mongodb
>it is a no SQL database
>if you work in online conection string you do not need to download mongodb onely create connection string online
>but if you need to connect  to localhost connection you should download and run server by create folder named data create folder in data named  db in c:\ and write in cmd  in data "C:\Program Files\MongoDB\Server\3.4\bin\mongod.exe" 
> download https://www.mongodb.com/download-center
### optional download mongodb compass
> to see data in tables
> write connection string  in it 
>download https://www.mongodb.com/download-center/compass
### then download npm packages 
>which we use in package.json
## install packages 
### to install our packages and you have package.json
> use command line in project folder -> npm install
### we use packages 
#### bcrypt
> download by command line -> npm i bcrypt
 
#### body-parser
> download by command line -> npm i body-parser
#### cookie-parser
> download by command line -> npm i body-parser
#### cors
> download by command line -> npm i cors
#### ejs
> download by command line -> npm i ejs
#### express
> download by command line -> npm i express
#### express-session
> download by command line -> npm i express-session
#### express-validator
> download by command line -> npm i express-validator
#### fuzzy-search
> download by command line -> npm i fuzzy-search
#### gridfs
> download by command line -> npm i gridfs
#### gridfs-stream
> download by command line -> npm i gridfs-stream
#### is-empty
> download by command line -> npm i is-empty
#### joi
> download by command line -> npm i joi
#### jsdoc
> download by command line -> npm install -g jsdoc
> to funcational documentation 
#### jsonwebtoken
> download by command line -> npm i jsonwebtoken
#### mongoose
> download by command line -> npm i mongoose
#### mongoose-fuzzy-searching
> download by command line -> npm i mongoose-fuzzy-searching
#### morgan
> download by command line -> npm i morgan
#### multer
> download by command line -> npm i multer
#### multer-gridfs-storage
> download by command line -> npm i multer-gridfs-storage
#### node-mongo-seeds
> download by command line -> npm install -g node-mongo-seeds
>to run seeds code 
#### nodemailer
> download by command line -> npm i nodemailer
>to send email 
#### passport
> download by command line -> npm i passport
#### jest
> download by command line -> npm i jest
#### passport-facebook
> download by command line -> npm i passport-facebook
#### passport-jwt
> download by command line -> npm i  passport-jwt
#### validator
> download by command line -> npm i validator
#### winston
> download by command line -> npm i winston
### to more information about any package 
>if has any problem when install by npm install delete package-lock.json & node-modules
> if need download package package and have problem get the link of it can found anthor way which can help you
> https://www.npmjs.com/package/{packageName}
## to run unit test 
> npm run test -> which run all unit tests 
> using jest package 
## run for developers <br/>
### first install the devDependencies and dependencies by running
> npm install
### then set node enviroment to be running in development , if you are on  linux run
> export NODE_ENV=development
### if you are on windows run
> set NODE_ENV=development
### then run the nodeJS seerver <br/>
> node server.js

## run for production

### first install only the dependecies by running
> npm install --only=prod
### then set node enviroment to be running in production , if you are on  linux run
> export NODE_ENV=production
### if you are on windows run
> set NODE_ENV=production
### then run the nodeJS seerver <br/>
> node server.js

## generate seeds

### first install node-mongo-seeds globally by running
> npm install -g node-mongo-seeds
### then generate the seeds on the default database by running
> seed