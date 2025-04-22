# Course backend
- Create
- Read
- Update
- Delete

---

- we don't use database we will use static data in our app

```js
const courses = [
    { id: 1, title: 'JavaScript Basics' , price : 1000},
    { id: 2, title: 'Node.js Fundamentals', price : 800 },
    { id: 3, title: 'Express.js for Beginners', price : 1200 }
]
```

- we will make api when we will send json only not need to eg(html, buffer , ...)

```js
app.get('/api/courses', (req, res) => {
    res.json(courses);
});
```

- if you want variable in api you should put `:` before variable name

```js
app.get('/api/courses/:id'
```

- to access this variable 

```js
req.params.id
```

```js
app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id == req.params.id);
    if (!course) return res.status(404).json('Course not found');
    res.json(course);
});
```

- `return` keyword to don't continue execute the function

- any thing come from url is string

- to convert from string to int there was three ways 

```js
// 1
let str = "123";
let num = Number(str);

// 2
let str = "123";
let num = parseInt(str); // 123

// 2.1
let str = "123.45";
let num = parseFloat(str); // 123.45


// 3
let str = "123";
let num = +str;
```

- how we can access body ? to put method to create ammm

```js
app.post('/api/courses', (req, res) => {
    console.log(req.body);
    res.json();
});
```

- take care to put `res.json();` to end request 

- this will log `undefine` :(

- to make express can pars the body you should put middleware `express.json() or bodyParser.json()`

```js
app.use(express.json()); // Middleware to parse JSON request body
```

- if you want use `bodyParser.json()` you must require it 

```js
const bodyParser = require('body-parser');
app.use(bodyParser.json());
```

- but in express 4 and up `bodyParser` is used in `express.json()` without need to import from you :)


- for validation of inputs 
```js
app.post('/api/courses', (req, res) => {
    const title = req.body.title;
    const price = req.body.price;
    if (!title || !price) return res.status(400).json({err : 'Title and price are required'});
    const new_id = courses.length ? courses[courses.length - 1].id + 1 : 1;
    const course = { id: new_id, title , price : +price };
    courses.push(course);
    res.status(201).location(`/api/courses/${course.id}`).json(course);
});
```

- there is no easier way ?
- amm in express no ... but there is modules ya sa7byy :)

```js
npm i express-validator
```

- and there is more than one module made same thing
- with `express-validator`

```js
const {body, validationResult} = require('express-validator');

app.post('/api/courses',
    body('title')
        .isString()
        .notEmpty()
        .withMessage('Title is required').isLength({min: 3, max: 100})
        .withMessage('Title must be between 3 and 100 characters'),
    body('price')
        .isNumeric()
        .withMessage('Price is required')
        .isFloat({gt: 0})
        .withMessage('Price must be a positive number'),
    (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const title = req.body.title;
    const price = req.body.price;
    const new_id = courses.length ? courses[courses.length - 1].id + 1 : 1;
    const course = { id: new_id, title , price : +price };
    courses.push(course);
    res.status(201).location(`/api/courses/${course.id}`).json(course);
});
```

```js
app.post('/api/courses',
    body('title')
        .isString()
        .notEmpty()
        .withMessage('Title is required').isLength({min: 3, max: 100})
        .withMessage('Title must be between 3 and 100 characters'),
    body('price')
        .isNumeric()
        .withMessage('Price is required')
        .isFloat({gt: 0})
        .withMessage('Price must be a positive number'),
    (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const new_id = courses.length ? courses[courses.length - 1].id + 1 : 1;
    const course = { id: new_id, ...req.body };
    courses.push(course);
    res.status(201).location(`/api/courses/${course.id}`).json(course);
});
```


- you can put middle wares (functions) as you want before `(req,res)=>{}` function

- express will execute one by one

- we can put all middle wares in array
```js
// create a new course
app.post('/api/courses',
    [
        body('title')
            .isString()
            .notEmpty()
            .withMessage('Title is required').isLength({min: 3, max:100})
            .withMessage('Title must be between 3 and 100 characters'),
        body('price')
            .isNumeric()
            .withMessage('Price is required')
            .isFloat({gt: 0})
            .withMessage('Price must be a positive number'),
    ],
    (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const title = req.body.title;
    const price = req.body.price;
    const new_id = courses.length ? courses[courses.length - 1].id + 1 : 1;
    const course = { id: new_id, title, price : +price};
    courses.push(course);
    res.status(201).location(`/api/courses/${course.id}`).json(course);
});
```


- what is the different between `put, patch` 
    - `put` `->` make new one and replace two objects
    - `patch` `->` update properties you send


```js
const express = require('express');
let courseController = require('../controllers/controllers'); // Import courses data
const validations = require('../errorHandling/errorHandler'); // Import validation rules

const router = express.Router();

router.get('/api/courses', courseController.getAllCourses);

router.get('/api/courses/:id', courseController.getSingleCourse);

router.post('/api/courses', validations, courseController.createCourse);

router.patch('/api/courses/:id', courseController.updateCourse);

router.delete('/api/courses/:id', courseController.deleteCourse);


module.exports = router;
```

- router is mini app

- wil use as follow

```js
app.use('/', router);
```

- as a middle ware if you route start with `/` go to router and continue routes

- best practice

```js
const express = require('express');
const router = require('./routes/routes');

const app = express();
const port = 3000;

app.use(express.json());


app.use('/api/courses', router);


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
```

```js
const express = require('express');
let courseController = require('../controllers/controllers'); // Import courses data
const validations = require('../errorHandling/errorHandler'); // Import validation rules

const router = express.Router();

router.get('/', courseController.getAllCourses);

router.get('/:id', courseController.getSingleCourse);

router.post('/', validations, courseController.createCourse);

router.patch('/:id', courseController.updateCourse);

router.delete('/:id', courseController.deleteCourse);


module.exports = router;
```


- if the route url is equal but methods not we can do this 

```js
router.route('/') // if route is ('/')
        .get(courseController.getAllCourses) // if method is get
        .post(validations, courseController.createCourse); // if methode is post

router.route('/:id')
        .get(courseController.getSingleCourse)
        .patch(courseController.updateCourse)
        .delete(courseController.deleteCourse);
```