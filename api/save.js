module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  var secret = req.body && req.body.secret;
  var rootHTML = req.body && req.body.rootHTML;

  if (!secret || secret !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  if (!rootHTML) {
    return res.status(400).json({ error: 'Conteúdo vazio' });
  }

  var token = process.env.GITHUB_TOKEN;
  var branch = process.env.GITHUB_BRANCH || 'master';
  var repo = 'ttu360063-hash/joalidigital';
  var filePath = 'index.html';

  if (!token) {
    return res.status(500).json({ error: 'GITHUB_TOKEN não configurado' });
  }

  var apiUrl = 'https://api.github.com/repos/' + repo + '/contents/' + filePath;

  try {
    // 1. Obter arquivo atual do GitHub
    var getRes = await fetch(apiUrl + '?ref=' + branch, {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Accept': 'application/vnd.github.v3+json',
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    if (!getRes.ok) {
      var errData1 = await getRes.json().catch(function() { return {}; });
      return res.status(500).json({ 
        error: 'Erro ao buscar arquivo no GitHub', 
        details: errData1.message || getRes.statusText 
      });
    }

    var fileData = await getRes.json();
    var currentSha = fileData.sha;

    // 2. Decodificar o conteúdo atual do arquivo
    var currentContent = Buffer.from(fileData.content, 'base64').toString('utf-8');

    // 3. Substituir apenas o conteúdo do #root
    // Encontrar a tag de abertura do root: <div id="root">
    var rootOpenRegex = /<div\s+id="root"[^>]*>/;
    var rootMatch = currentContent.match(rootOpenRegex);

    if (!rootMatch) {
      return res.status(500).json({ error: 'Não encontrei <div id="root"> no arquivo' });
    }

    var rootOpenTag = rootMatch[0]; // ex: '<div id="root">'
    var rootStartIdx = currentContent.indexOf(rootOpenTag);
    var contentStartIdx = rootStartIdx + rootOpenTag.length;

    // Encontrar onde o conteúdo do root termina (antes do primeiro <script após root)
    var scriptIdx = currentContent.indexOf('<script', contentStartIdx);
    if (scriptIdx === -1) {
      scriptIdx = currentContent.indexOf('</body>', contentStartIdx);
    }

    if (scriptIdx === -1) {
      return res.status(500).json({ error: 'Não encontrei </body> ou <script> após root' });
    }

    // Voltar a partir do script para encontrar o fechamento </div> do root
    // O root fecha com </div></div> (root + wrapper interno)
    // Precisamos encontrar o ponto exato antes dos scripts
    var beforeScripts = currentContent.substring(contentStartIdx, scriptIdx);
    // Remover whitespace no final
    var trimmedEnd = beforeScripts.replace(/\s+$/, '');

    // O conteúdo do root vai do contentStartIdx até contentStartIdx + trimmedEnd.length
    var contentEndIdx = contentStartIdx + trimmedEnd.length;

    // 4. Montar o novo conteúdo do arquivo
    var newFileContent = currentContent.substring(0, contentStartIdx) 
      + rootHTML 
      + currentContent.substring(contentEndIdx);

    // 5. Fazer commit
    var contentBase64 = Buffer.from(newFileContent, 'utf-8').toString('base64');

    var putRes = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28'
      },
      body: JSON.stringify({
        message: '✏️ Atualização via Painel Admin',
        content: contentBase64,
        sha: currentSha,
        branch: branch
      })
    });

    if (!putRes.ok) {
      var errData2 = await putRes.json().catch(function() { return {}; });
      return res.status(500).json({ 
        error: 'Erro ao fazer commit no GitHub', 
        details: errData2.message || putRes.statusText 
      });
    }

    var result = await putRes.json();

    return res.status(200).json({ 
      success: true, 
      commitSha: result.commit ? result.commit.sha : 'ok',
      message: 'Alterações publicadas com sucesso!'
    });

  } catch (err) {
    return res.status(500).json({ 
      error: 'Erro interno', 
      details: err.message 
    });
  }
};
