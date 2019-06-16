
class Template {
    loginPage() {
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

    home() {
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
            <p>circus님 어서오세요</p>
            <form action="/logout" ><input type="submit" value="로그아웃"></form><form action="/makeworldcup" ><input type="submit" value="나만의 월드컵 만들기"></form>
            <h1>마음에드는 월드컵에 참가해보세요!</h1>
        </body>

        </html>
        `
    }
}

module.exports = Template;