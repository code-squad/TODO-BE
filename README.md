# Todo APP - Console Version

> JS 웹 백엔드 Step 8

## 기획

### what

- CLI TODO APP : 할 일 목록 콘솔 앱

### why

- 페어프로그래밍으로 만들 었던 것을 혼자서도 만들어 보고 싶었음

- 브라우저 버전으로 만드려고 시도했으나 http, html,css 등을 다루는 게 미숙해 일단은 콘솔 버전을 먼저 만들기로 결정

- 추후 http를 이용해 브라우저 버전으로 만들 예정

### How

- **기능 소개**
    
    - 회원가입 & 로그인
    
    - 할 일 목록 : 추가 수정 삭제 조회

    - 멀티 유저 프로그램
    
        - 아이디 별로 유저 구분
        
        - 객체 형태로 유저 정보를 DB에 저장
        
        - 로그인 시 해당 유저의 정보에만 접근해서 데이터 출력

    - 데이터 저장
    
        - json 파일로 저장
        
        - 외부 모듈 `lowdb` 사용
    
    - 서버, 클라이언트 분리
    
        - 내장 모듈 `net` 사용


## 구현 계획

### 1. 서버, 클라이언트 분리

#### Server

- **server**
    - 클라이언트에서 보낸 로직 구분 후 **dataHandler**와 **userManager**에 전달

- **dataHandler**
    
    - DB에 접근하는 로직 처리
    
        - 할 일 목록 추가, 수정, 삭제, 조회
        
        - 아이디, 패스워드 체크 등

- **userManager**
    
    - 회원 가입, 로그인 처리
    
    - 클라이언트에서 보낸 데이터 파싱

#### Client

- **login**

    - 서버에 로그인 정보(아이디, 패스워드) 전송
    
    - 서버로부터 로그인 성공/실패 응답 받음

- **register**

    - 서버에 회원가입 정보(아이디, 패스워드) 전송
    
    - 서버로부터 회원가입 성공/실패 응답 받음

- **todo**

    - todo 주요 기능 관리
    
    - 어플의 전체 실행 흐름 관리
  
    - **(회원가입) -> 로그인 -> todo 명령어**
    
    - 회원가입
        - register 모듈 실행
    
    - 로그인
        - login 모듈 실행
    
    - todo 명령어
        - 입력받은 todo 명령어를 command 모듈에서 실행

- **utils**

    - 각종 필요한 기능을 지원
        
        - 서버에서 보낸 데이터 받기
        - 에러 메시지 출력
        - 사용자 입력을 받기 위한 프롬프트 창 생성

- **command**
    
    - todo 명령어 처리
    
    - 추가, 수정, 삭제, 조회, 도움말

- **db.json**
    
    - json 파일에 사용자 정보 관리
    
    - 배열에 사용자 객체를 넣어 관리
    
        - `key 값` : 아이디, 패스워드, todo list 

