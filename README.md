# BETIM - Generating CSS codes using natural utterances
Betim is a use case implementation of OpenAI' s GPT-3. Using GPT-3, betim application creates CSS statements from natural utterances.

#### ▶️ Running the application:
Betim is an ElectronJS application. The following requirements needs to be met on the system:
 * node
 * npm
 * electonJs (You can install electron simply by running `npm install --save electon` command.)

For generating CSS codes, Betim uses GPT-3 from OpenAI.
Therefore, an API key is required for using OpenAI API. 
You can visit https://beta.openai.com/ for obtaining an API key.

Once you had the API key, set your API key through secrets.json file.

You can start the application using `npm start` command.

#### 💬 Prompt Tips:

In order to use betim, it is recommended to describe the target element and properties of the css rule. You can find some examples below:

1. `“Make body background black”`
```
.body {
    background: black
}
```

2. `“Make headings white”`
```
.h1, h2, h3, h4, h5, h6 {
    color: white
}
```

#### 🖥 Tech Stack:

For developing Betim, following technologies are used:
* Electron JS (NodeJS, JavaScript)
* PureCSS (CSS3)
* HTML
* Jquery
* GPT-3

#### 📜 Research Paper

You can find more detailed information about this study by reading our research paper.

Link: https://dergipark.org.tr/en/pub/jsr-a/issue/70909/1085183
