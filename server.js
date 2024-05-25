const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const app = express();
const PORT = 3000;


const getFormattedDate = () => {
  const date = new Date();
  const month = date.toLocaleString('en-US', { month: 'long' });
  const hour = String(date.getHours()).padStart(2, '0');
  return `${month}-${hour}`;
};



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folderName = req.body.folderName;
    const dateFolder = getFormattedDate();
    const uploadPath = path.join(__dirname, 'uploads', folderName, dateFolder);
    fs.mkdir(uploadPath, { recursive: true }, (err) => {
      if (err) {
        console.error('Erro ao criar a pasta:', err);
        cb(err, null);
      } else {
        cb(null, uploadPath);
      }
    });
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'image-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage });


app.use(express.static(path.join(__dirname, 'public')));


app.get('/uploads/:folderName/:dateFolder/:imageName', (req, res) => {
  const { folderName, dateFolder, imageName } = req.params;
  const imagePath = path.join(__dirname, 'uploads', folderName, dateFolder, imageName);
  res.sendFile(imagePath);
});


app.get('/uploads/:folderName/:dateFolder', (req, res) => {
  const { folderName, dateFolder } = req.params;
  const htmlFilePath = path.join(__dirname, 'uploads', folderName, dateFolder, 'index.html');
  res.sendFile(htmlFilePath);
});


app.post('/uploads', upload.single('image'), (req, res) => {
  const folderName = req.body.folderName;
  if (!folderName) {
    return res.status(400).send('O nome da pasta é obrigatório');
  }

  const dateFolder = getFormattedDate();
  const imageName = req.file.filename;
  const imagePath = imageName;


  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <!--
    ─╔══╗─╔═╗╔═╗─╔═══╗─╔═══╗─╔═══╗
    ─╚╣╠╝─║║╚╝║║─║╔═╗║─║╔═╗║─║╔══╝
    ──║║──║╔╗╔╗║─║║─║║─║║─╚╝─║╚══╗
    ──║║──║║║║║║─║╚═╝║─║║╔═╗─║╔══╝
    ─╔╣╠╗─║║║║║║─║╔═╗║─║╚╩═║─║╚══╗
    ─╚══╝─╚╝╚╝╚╝─╚╝─╚╝─╚═══╝─╚═══╝
    -->
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="description" content="mileque.io Uploads - Image Publishing"/>
      <meta name="og:description" content="mileque.io Uploads - Image Publishing"/>
      <meta name="og:url" content="https://mileque.onrender.com"/>
      <meta name="og:title" content="${folderName}"/>
      <meta name="og:image" content="https://mileque.onrender.com/uploads/${folderName}/${dateFolder}/${imagePath}">
      <meta property="og:image" content="https://mileque.onrender.com/uploads/${folderName}/${dateFolder}/${imagePath}" />
      <meta property="og:image:secure_url" content="https://mileque.onrender.com/uploads/${folderName}/${dateFolder}/${imagePath}" />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:width" content="400" />
      <meta property="og:image:height" content="300" />
      <meta property="og:image:alt" content="Not for Drugs" />
      <title>mileque.io</title>
    </head>
    <style>
    *{
      margin: 0;
      padding: 0;
      box-sizing: border-box;
  }

    :root{
      --font: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  }

    body {
      justify-content: center;
      text-align: center;
      display: flex;
      flex-direction: column;
      font-family: var(--font);
      background-color: hsl(0, 0%, 0%);
      color: #ffffff;
      font-weight: 500;
      font-size: 20px;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    h1{
      font-weight:500;
    }

    img {
      margin-top: 20px;
      max-width: 100%;
      max-height: 400px;
      border: 1px solid #ddd;
      padding: 5px;
      background-color: #000000;
    }

    @media(max-width:999px){
      img{
        width:90%;
      }
    }

    #datetime{
      color:#828282;
      font-seize:12px;
      margin-top:10px;
    }
    </style>
    <body>
      <h1>${folderName}</h1>
      <img src="./${imagePath}" alt="Imagem Salva">
      <p id="datetime"></p>

      <script>
          function updateDateTime() {
              const now = new Date();
              const options = {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: false
              };
              const formattedDateTime = now.toLocaleDateString('en-US', options);
              document.getElementById('datetime').textContent = formattedDateTime;
          }
  
          setInterval(updateDateTime, 1000);
          updateDateTime();
      </script>
      <br>
      <br>
      <button class="copy" onclick="copyText()">Copy URL</button>
      <style>
        .copy{
          background-color: #ffffff;
          color: #000000;
          font-size: 20px;
          border-radius: 50px;
          width: 450px;
          padding: 10px 40px;
          border: none;
          transition: 0.5s;
          cursor: pointer;
          margin: 0 auto 10px;
          font-family:var(--font);
          font-weight:600;
        }
        .copy:hover{
          background-color: #aaaaaa;
          transition: 0.5s;
        }
    
        @media(max-width:999px){
        .copy{
          width: 80%;
          margin: 0 auto 10px;
        }
        }
      </style>

      <script>
      function copyText() {
      var textToCopy = "https://mileque.onrender.com/uploads/${folderName}/${dateFolder}/${imagePath}";
      navigator.clipboard.writeText(textToCopy)
        .then(function() {
          const copy = document.querySelector('.copy');
          copy.innerText = "Copied!";
          copy.classList.add("coped", "centered");
          copy.classList.add("coped");
      
        })
        .catch(function() {
          copy.innerText = "Erro.";
          copy.classList.add("coped", "centered");
          copy.classList.add("coped");
      
        });
      }
      </script>
    </body>
    </html>
  `;


  const htmlFilePath = path.join(__dirname, 'uploads', folderName, dateFolder, 'index.html');


  fs.writeFile(htmlFilePath, htmlContent, (err) => {
    if (err) {
      console.error('Erro ao criar o arquivo HTML:', err);
      res.status(500).send('Erro ao criar o arquivo HTML');
    } else {
      console.log('Arquivo HTML criado com sucesso:', htmlFilePath);
      res.send('Imagem salva com sucesso! <a href="/uoloads/' + folderName + '/' + dateFolder + '">Ver Imagem</a>');
    }
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
