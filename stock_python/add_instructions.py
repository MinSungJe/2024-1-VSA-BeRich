from flask import Flask

app = Flask(__name__)

@app.route('/')
def add_content_to_md_file(additional_content='text'):
    with open('instructions.md', 'r', encoding='utf-8') as file:
        content = file.read()

    content += '\n' + additional_content

    with open('instructions.md', 'w', encoding='utf-8') as file:
        file.write(content)
    
    return content


if __name__ == '__main__':
    app.run(debug=True)