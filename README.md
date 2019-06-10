# Todo-List

- Todolist without express and database

M: Fetching and Processing Data
V: Displaying Content to User
C: Communicaes Between The Model and View

### Controller: index.js
-Router로 전송될 get, post 되는 URL 정보를 명시했습니다.

### Model: manageData.js

1. DoubleCheck: 이미 등록된 계정인지 확인하는 함수입니다.

2. storeSignupData: DoubleCheck을 하고 등록되어있지 않다는게 판명되면 등록한 정보를 user.json파일에 붙여주는 함수입니다.

3. checkLoginData: 로그인시 user.json에 등록된 계정인지 아닌지 확인하는 함수입니다.

4. storeUser: user.json에 등록된 유저의 아이디를 배열에 담는 함수입니다.

5. storeTodoData: Todo list에 추가한 내용을 user.json에 추가/삭제를 위해 사용하는 함수입니다.

6. getStoredTodoData: 로그인시 이전에 작성한 Todolist가 있다면 그것을 로그인과 동시에 화면에 출력해주는기능을 하는 함수입니다.

### Model: user.json
user라는 프로퍼티에 배열을 주고 그안에 유저 한 명의 정보당 한 객체로 저장된 형태의 DB역할을 하는 파일

### View: homepage.html

- XMLHttpRequest로 유저가 로그인한 정보를 post하는데 이때 객체형태로 index.js의 '/' (homepage) port로 전송하고, 그 후 index.js의 app.post가 req.on data로 이 값을 받고, checkLoginData에 값을 주고, 만약에 회원정보와 일치하면, true 아니면 false. 그리고 이 값은 라우터로 들어가서 true면 다음 페이지로 넘어가고 아니면, 에러를 발생하는 방식으로 동작하게했습니다.

### View: singup.html

- XMLHttpRequest로 회원가입한 정보를 index.js의 singup을 url로 가지는 post에 전송하고, 위의 방식과 동일하게 중복체크를하는 방식으로, true or false를 리턴하고 true인 경우 회원가입한 정보를 user.json에 붙여줍니다.

### View: todolist.html

- 위 두 view와 동일하게, XMLHttpRequest를 사용하는데, 이 과정에서 user.json에 각 유저의 todolist에 값을 붙일때, 붙이는 방법으로 documnet.url을 이용해 url을 가지고오고, 로그인시 유저의 아이디가 url의 제일 마지막에 붙기때문에, url을 가져와 배열에.split를 이용해 slash 기준으로 쪼개고 배열의 제일 마지막 인덱스 값을 post할 때 같이 보내주는 방식으로 저장했습니다.

### Router: router.js

라우터는, get과 post로 나뉘어지고, index.js에 등록한 get, post 정보를 객체 형태(method, route, handler 순서로)로 담아서 routes라는 배열에 모두다 담아주고, 서버에서 요청한 url이 routes 배열에 존재하면, 그 요청에 따라 실행시키는데, index.js의 res값이 html로 끝나면 html값을 writehead에 출력해주도록 변환을 해주었고, 나머지는 모두 그냥 text파일로 간주해서 writehead에 출력해주는 방식을 이용했고. 이때 url에 '/' 다음에 어떤 값이 존재한다면, 그 값을 params이라는 것으로 간주하도록 했습니다.

### 동작방식의 요약

처음 동작을 시키면,

1. Homepage.html이 response값으로 화면에 출력됩니다.

2. signup 키를 클릭하면, signup.html로 넘어가고

3. signup 정보를 형식에 적합하게 모두 입력하고, submit을 눌렀을때, 그 정보가 이전에 등록된 정보와 중복되지 않는다면, 성공적으로 등록되었다는 alert창과함께 singup된 정보는 user.json 파일에 붙여지고, homepage로 넘어가게됩니다.

4. 이제 등록한 계정으로 로그인을하면, 이 정보를 user.json에 있는 정보와 일치하는지 확인하고, 일치한다면, /로그인계정의 url로 넘어가게됩니다.

5. todolist.html에 response로 넘어오고, todolist를 추가 및 삭제 후 save 버튼을 누르면, 해당 url의 값을 배열에 담아 split('/')로 쪼개고 배열에 담았을때, 제일 마지막 값이 로그인한 유저의 id가 되기때문에 이 값을 XMLHttpRequest로 보내주고 user.json에 해당하는 id의 유저의 todolist에 값을 등록하는 방식으로 동작합니다.

6. 마지막으로, logout을하고, 다시 로그인하면, 이전에 등록했던 todolist가 존재하면 그 값을 접속과 동시에 todolist항목에 붙여줍니다.
