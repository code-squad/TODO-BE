# [Step 8-2 Mission] 기획서 및 설계도

---



### 프로젝트 명
TCP 소켓 모듈을 이용한 실시간 채팅 서비스



### 기획 의도
Slack, KakaoTalk 대표적인 회사를 비롯하여 실시간 채팅서비스는 어떻게 동작되는걸까? 궁금증이 생겨서 채팅 서비스 프로그램을 만들게 되었습니다.



### 구현할 기능
1. 로그인 기능
2. 회원가입 기능
3. 사용자가 채팅할 수 있는 공간을 만드는 기능
4. 옵션) 사용자가 채팅 내용을 파일 형태로 저장하는 기능



### Use Case 다이어 그램



![image-20190531165212354](https://github.com/bestdevhyo1225/image_repository/blob/master/image-20190531165212354.png?raw=true)



### 시스템 구조



![image-20190531203714826](https://github.com/bestdevhyo1225/image_repository/blob/master/image-20190531215806176.png?raw=true)

* Client        : 사용자를 의미한다.
* Room          : 채팅방을 의미한다.
* RoomManager   : 채팅방을 관리한다.
* Server        : 전체적인 시스템을 관리한다. (회원정보, 채팅)
* FileManager   : 회원정보를 저장하고 관리한다.