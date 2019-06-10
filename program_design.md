# [Step 8-2 Mission] 기획서 및 설계도

---



### 1. 프로젝트 명
TCP 소켓 모듈을 이용한 실시간 채팅 서비스



### 2. 기획 의도
Slack, KakaoTalk 대표적인 회사를 비롯하여 실시간 채팅서비스는 어떻게 동작되는걸까? 궁금증이 생겨서 채팅 서비스 프로그램을 만들게 되었습니다.



### 3. 구현할 기능
1. 로그인 기능
2. 회원가입 기능
3. 사용자가 채팅할 수 있는 공간을 만드는 기능
4. 옵션) 사용자가 채팅 내용을 파일 형태로 저장하는 기능



### 4. Use Case 다이어 그램



![image-20190531165212354](https://github.com/bestdevhyo1225/image_repository/blob/master/image-20190531165212354.png?raw=true)



### 5. 시스템 구조



![image-20190531203714826](https://github.com/bestdevhyo1225/image_repository/blob/master/image-20190531215806176.png?raw=true)



### 6. 구현 모듈

#### app.js
- 사용자 인터페이스 모듈이다.
- 로그인, 회원 가입, 채팅하기 목록이 존재한다.

#### chat_client.js
- 채팅을 관리하는 client 모듈이다.
- 서버에게 데이터를 송수신 한다.

#### chat_server.js
- 채팅을 관리하는 server 모듈이다.
- 클라이언트에게 데이터를 송수신 한다.

#### file_manager.js
- 회원 정보를 관리하는 server와 file 사이에서 데이터를 전달하는 모듈이다.
- 회원 가입 기능 (존재하는 ID 체크)
- 회원 가입 경우, PW를 암호화 하는 기능
- 로그인 기능 (ID 와 PW 확인)

#### member_client.js
- 회원 정보를 관리하는 client 모듈이다.
- 회원 가입이 가능한지를 판단하는 기능
- 존재하는 회원이 로그인 했는지 체크하는 기능

#### member_server.js
- 회원 정보를 관리하는 server 모듈이다.
- 회원 정보와 관련된 데이터를 송수신 한다.

#### utility.js
- 사용자 입력을 위한 모듈