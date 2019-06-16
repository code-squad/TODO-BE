
class Template {
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
            <h1>hello world!</h1>
        </body>

        </html>
        `
    }
}

module.exports = Template;