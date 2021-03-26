# REST API example with NodeJS and MongoDB

This code is an example of REST server, backend for any modern web app.

## Steps to set up and build the project

1. Checkout the code

2. Use npm install to resolve dependencies

  #####
    npm install

3. Go to the root of this project and start the docker image of mongo

  #####
    docker-compose up -d

4. Once the docker image is up, we can start the server.

  #####
    npm start

## Important inclusions in this example to consider

#### 1. Mongoose library and connection with MongoDB

  ###### app.js

    mongoose
    .connect(
        'mongodb://localhost:27017/restExample?authSource=admin', {
            useNewUrlParser: true,
            user: 'root',
            pass: 'example'
        }
    )
    .then(result => {
        app.listen(8080);
    })
    .catch(err => {
        console.log('Cant connect to MongoDB');
        console.log(err);
    });

  ###### Data models example - post.js
    const mongoose = require('mongoose');
    const Schema = mongoose.Schema;

    const postSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        imageUrl: {
            type: String,
            required: false
        },
        ...
    },
    
    {timestamps: true});

    module.exports = mongoose.model('Post', postSchema);

#### 2. Authentication filter and its usage
  ###### is-auth.js
    const jwt = require('jsonwebtoken');

    module.exports = (req, res, next) => {
        const authHeader = req.get('Authorization');
        if (!authHeader) {
            const error = new Error('Not authenticated.');
            error.statusCode = 401;
            throw error;
        }
        const token = authHeader.split(' ')[1];
        let decodedToken;
        try {
            decodedToken = jwt.verify(token, 'somesupersecretsecret');
        } catch (err) {
            err.statusCode = 500;
            throw err;
        }   
        if (!decodedToken) {
            const error = new Error('Not authenticated.');
            error.statusCode = 401;
         throw error;
        }
        req.userId = decodedToken.userId;
        next();
    };

  ###### routes/post.js
    ...
    router.get('/', isAuth, postController.getPosts);
    ...

#### 3. File Operations 
  ###### app.js
    ...
    const path = require('path');
    const multer = require('multer');
    const { v4 : uuidv4 } = require('uuid');
    ...
    const fileStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'images');
        },
        filename: (req, file, cb) => {
            cb(null, uuidv4()+"-"+file.originalname);
        }
    });

    const fileFilter = (req, file, cb) => {
        if (
            file.mimetype === 'image/png' ||
            file.mimetype === 'image/jpg' ||
            file.mimetype === 'image/jpeg'
        ) {
            cb(null, true);
        } else {
            cb(null, false);
        }
    };
    ...
    app.use(
        multer({storage: fileStorage, fileFilter: fileFilter}).single('image')
    );
    app.use('/images', express.static(path.join(__dirname, 'images')));
    ...


#### 4. CORS Fixes 
  ###### app.js 
    ...
    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader(
            'Access-Control-Allow-Methods',
            'OPTIONS, GET, POST, PUT, PATCH, DELETE'
        );
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        next();
    });
    ...

#### 5. Generic error handler
  ###### app.js
    ...
    app.use((error, req, res, next) => {
        console.log(error);
        const status = error.statusCode || 500;
        const message = error.message;
        const data = error.data;
        res.status(status).json({message: message, data: data});
    });
    ...
