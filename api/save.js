module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  var secret = req.body && req.body.secret;
  var content = req.body && req.body.content;

  if (!secret || secret !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: 'Não autorizado' });
  }
  if (!content) {
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
  var headers = {
    'Authorization': 'Bearer ' + token,
    'Accept': 'application/vnd.github.v3+json',
    'X-GitHub-Api-Version': '2022-11-28'
  };

  try {
    // 1. Obter SHA do index.html
    var getRes = await fetch(apiUrl + '?ref=' + branch, { headers: headers });
    if (!getRes.ok) {
      return res.status(500).json({ error: 'Erro ao buscar arquivo no GitHub', details: await getRes.text() });
    }
    var fileData = await getRes.json();
    var currentSha = fileData.sha;

    // 2. Preparar novo conteúdo
    var contentBase64 = Buffer.from(content, 'utf-8').toString('base64');

    // 3. Atualizar o arquivo
    var putRes = await fetch(apiUrl, {
      method: 'PUT',
      headers: Object.assign({}, headers, { 'Content-Type': 'application/json' }),
      body: JSON.stringify({
        message: '✏️ Atualização via Painel Admin',
        content: contentBase64,
        sha: currentSha,
        branch: branch
      })
    });

    if (!putRes.ok) {
      var errData = await putRes.json().catch(function() { return {}; });
      return res.status(500).json({ 
        error: 'Erro ao salvar no GitHub', 
        details: errData.message || putRes.statusText 
      });
    }

    var result = await putRes.json();
    return res.status(200).json({ 
      success: true, 
      commitSha: result.commit ? result.commit.sha : 'ok'
    });

  } catch (err) {
    return res.status(500).json({ error: 'Erro interno', details: err.message });
  }
};
