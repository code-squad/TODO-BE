const router = require('../Router/router');
const app = router();
const port = 4000;
const manageData = require('../Model/manageData');

// Post Homepage
app.post('/', (req, res) => {
  req.on('data', async function (data) {
    const loginData = JSON.parse(data);
    const loginResult = await manageData.checkLoginData(loginData);

    if (loginResult) {
      res.send(JSON.stringify(true));
    } else {
      res.send(JSON.stringify(false));
    }
  });
});

// Post Singup-Page
app.post('/signup', (req, res) => {
  req.on('data', async function (input_from_signup) {
    const input_data = JSON.parse(input_from_signup);
    const singupResult = await manageData.storeSignupData(input_data);

    if (singupResult) {
      res.send(JSON.stringify(true));
    } else {
      res.send(JSON.stringify(false));
    }

  });
});

// Post Get UserId from parameters
app.post('/:userId', (req, res) => {
  req.on('data', async function (userTodoData) {
    const userIDlist = await manageData.storeUser();
    const user = userIDlist.find(user => user.userId === req.params.userId);

    const params = JSON.parse(userTodoData);

    if (params == 'getStoredData') {
      let getStoredTodoData = await manageData.getStoredTodoData(user.userId);
      res.send(JSON.stringify(getStoredTodoData));

    } else {
      const userIDlist = await manageData.storeUser();
      const user = userIDlist.find(user => user.userId === req.params.userId);
      const storeTodoData = await manageData.storeTodoData(userTodoData, user.userId)

      res.send(JSON.stringify(storeTodoData));
    }
  });
});

// Get Signup-Page
app.get('/signup', (req, res) => {

  res.send('../View/signup.html');
});

// Get todolist-Page
app.get('/todolist', (req, res) => {
  res.send('../View/todolist.html');
});

// Get Homepage
app.get('/', (req, res) => {
  res.send('../View/homepage.html');
});

// Get UserId from parameters
app.get('/:userId', async function (req, res) {
  const userIDlist = await manageData.storeUser();
  const user = userIDlist.find(user => user.userId === req.params.userId);

  res.send('../view/todolist.html');
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`));