# Installation

1. `npm install`

# Configuration

  This configuration is optional, if no configuration is provided a test SMTP service account from [ethereal.email](https://ethereal.email/) will be used.

1. Make a copy of `config.json.example` and name it `config.json`
2. Write your personal configuration into `config.json`

# Usage

1. Write your code in `src/index.html` and your styles in `src/styles.css` (reference the stylesheet from within the HTML using a <link> tag)
2. Run `npm start` to inline your styles in the HTML and output the result to the `build` folder
3. Run `npm run email` to inline your styles in the HTML, output the result to the `build` folder and send the HTML email
