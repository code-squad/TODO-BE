
class Template {
    loginPage(message) {
        return `
        <!DOCTYPE html>
        <html>

        <head>
            <meta charset="UTF-8">
            <title>Login</title>
            <style>
                h1 {
                    text-align: center;
                }
            </style>
            <script>
                function warning(note) {
                    if (note !== 'undefined') {
                        alert(note);

                    }
                }
                warning('${message}');
            </script>
        </head>

        <body>
            <h1>로그인하세요</h1>
            <form action="/login">
                <fieldset>
                    <legend>로그인</legend>
                    아이디 : <input type="text" name="id"> <br>
                    비밀번호 : <input type="password" name="pwd">
                    <input type="submit" value="로그인">
                </fieldset>
            </form>
            <h1>회원가입하세요</h1>
            <form action="/signup">
                <fieldset>
                    <legend>회원가입</legend>
                    아이디 : <input type="text" name="id"> <br>
                    비밀번호 : <input type="password" name="pwd">
                    <input type="submit" value="가입">
                </fieldset>
            </form>

        </body>

        </html>
        `
    }

    home({ userID, worldcups }) {
        function makeList(worldcups) {
            if (worldcups === undefined) return '';
            var list = '';
            var i = 0;
            while (i < worldcups.length) {
                list = list + `
                <form action ="/participation">
                <input type="hidden" name="title" value="${worldcups[i].title}">
                <input type="image" src="${worldcups[i].mainImg}" width="200" height="200" alt="${worldcups[i].title}">
                <p>${worldcups[i].title} 참가하기</p>
                </form>
                `;
                i = i + 1;
            }
            return list;
        }

        let list = makeList(worldcups);
        return `
        <!DOCTYPE html>
        <html>

        <head>
            <meta charset="UTF-8">
            <title>HomePage</title>
            <style>
                h1 {
                    text-align: center;
                }
            </style>
            
        </head>

        <body>
            <h1>이상형 월드컵</h1>
            <p>${userID}님 어서오세요</p>
            <form action="/logout" ><input type="submit" value="로그아웃"></form><form action="/usersworldcup" ><input type="submit" value="나만의 월드컵 만들기"></form>
            <h1>마음에드는 월드컵에 참가해보세요!</h1>
            ${list}
        </body>

        </html>
        `
    }

    participateWorldCup({ player1, player2, rounds }) {
        return `
        <!DOCTYPE html>
        <html>

        <head>
            <meta charset="UTF-8">
            <title>worldcup</title>
            <style>
                form {
                    display: contents;
                }
                div {
                    display: contents;
                }
                h1 {
                    text-align: center;
                }
            </style>
        </head>

        <body>
            <h1>${rounds}강</h1>
            <form action="/foodworldcup">
            <input type="hidden" name="name" value="${player1.name}">
            <input type="hidden" name="img" value="${player1.img}">
            <input type="image" src="${player1.img}" width="500" height="500" alt="${player1.name}">
            <div>${player1.name}</div>
            </form>

            <form action="/foodworldcup">
            <input type="hidden" name="name" value="${player2.name}">
            <input type="hidden" name="img" value="${player2.img}">
            <input type="image" src="${player2.img}" width="500" height="500" alt="${player2.name}">
            <div>${player2.name}</div>
            </form>
        </body>

        </html>
        `
    }

    usersWorldCup({ userID, message, worldcups }) {
        function makeList(worldcups) {
            if (worldcups === undefined) return '';
            var list = '';
            var i = 0;
            while (i < worldcups.length) {
                list = list + `
                <form action ="/playermanagement">
                <input type="hidden" name="title" value="${worldcups[i][0]}">
                <input type="image" src="${worldcups[i][1].mainImg}" width="200" height="200" alt="${worldcups[i][0]}">
                <p>${worldcups[i][0]} 관리하러가기</p>
                </form><form action="deleteworldcup"><input type="hidden" name="title" value="${worldcups[i][0]}"><input type="submit" value="삭제"></form>
                `;
                i = i + 1;
            }
            return list;
        }

        let list = makeList(worldcups)
        return `
        <!DOCTYPE html>
        <html>

        <head>
            <meta charset="UTF-8">
            <title>나만의 월드컵만들기</title>
            <style>
                h1 {
                    text-align: center;
                }
            </style>
            <script>
                function warning(note){
                    if(note !== 'undefined'){
                        alert(note);    

                    }
                }
                warning('${message}');
            </script>
        </head>

        <body>
            <h1>${userID}님만의 월드컵을 만드세요</h1>
            <form action="/home">
                <input type="submit" value="홈으로">
            </form>
            <form action="/createworldcup">
                <fieldset>
                    <legend>creater</legend>
                    <tr>
                        <td>월드컵이름 : </td>
                        <td><input type="text" name="worldcupName"></td>
                    </tr>
                    <tr>
                        <td>메인이미지URL : </td>
                        <td><input type="text" name="mainImg"></td>
                    </tr>
                    <input type="submit" value="만들기">
                </fieldset>
            </form>
            ${list}

        </body>

        </html>
        `
    }

    playerManagement({ userID, worldcup, message }) {
        function makeList(worldcup) {
            if (worldcup === undefined) return '';
            var list = '';
            var i = 0;
            while (i < worldcup.players.length) {
                list = list + `
                <form action="/exitplayer">
                <img src="${worldcup.players[i].img}" width="100" height="100" alt="${worldcup.players[i].name}">
                <p>${worldcup.players[i].name}</p>
                <input type="hidden" name="title" value="${worldcup.title}">
                <input type="hidden" name="name" value="${worldcup.players[i].name}">
                <input type="submit" value="퇴장">
                </form>
                `;
                i = i + 1;
            }
            return list;
        }
        let list = makeList(worldcup)
        return `
        <!DOCTYPE html>
        <html>

        <head>
            <meta charset="UTF-8">
            <title>월드컵관리</title>
            <script>
                function warning(note){
                    if(note !== 'undefined'){
                        alert(note);

                    }
                }
                warning('${message}');
            </script>
            <style>
                form {
                    display: contents;
                }
                p {
                    display: contents;
                }
                h1 {
                    text-align: center;
                }
            </style>
        </head>

        <body>
            <h1>${userID}님의 ${worldcup.title}</h1>
            <img src="${worldcup.mainImg}" width="300" height="300" alt="${worldcup.title}">
            <form action="/usersworldcup">
                <input type="submit" value="뒤로가기">
            </form>
            <form action="/heldworldcup">
                <input type="hidden" name="title" value="${worldcup.title}">
                <input type="submit" value="개최하기">
            </form>
            <form action="/registerplayer">    
            <fieldset>
                    <legend>register</legend>
                    <tr>
                        <td>이름 : </td>
                        <td><input type="text" name="name" /></td>
                    </tr>
                    <tr>
                        <td>이미지URL : </td>
                        <td><input type="text" name="imgURL" /></td>
                    </tr>
                    <input type="hidden" name="title" value="${worldcup.title}">
                    <input type="submit" value="등록">
                </fieldset>
            </form>
            ${list}

        </body>

        </html>
        `
    }
}

module.exports = Template;