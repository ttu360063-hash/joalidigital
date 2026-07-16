export default async function handler(req, res) {
  // Apenas POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { secret, content } = req.body;

  // Validar senha admin
  if (!secret || secret !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  if (!content) {
    return res.status(400).json({ error: 'Conteúdo vazio' });
  }

  const token = process.env.GITHUB_TOKEN;
  const branch = process.env.GITHUB_BRANCH || 'master';
  const repo = 'ttu360063-hash/joalidigital';
  const filePath = 'index.html';

  if (!token) {
    return res.status(500).json({ error: 'GITHUB_TOKEN não configurado' });
  }

  const apiUrl = `https://api.github.com/repos/${repo}/contents/${filePath}`;

  try {
    // 1. Obter SHA atual do arquivo
    const getRes = await fetch(apiUrl + '?ref=' + branch, {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Accept': 'application/vnd.github.v3+json',
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    if (!getRes.ok) {
      const errData = await getRes.json().catch(() => ({}));
      return res.status(500).json({ 
        error: 'Erro ao buscar arquivo no GitHub', 
        details: errData.message || getRes.statusText 
      });
    }

    const fileData = await getRes.json();
    const currentSha = fileData.sha;

    // 2. Fazer commit com o conteúdo atualizado
    const contentBase64 = Buffer.from(content, 'utf-8').toString('base64');

    const putRes = await fetch(apiUrl, {
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
      const errData = await putRes.json().catch(() => ({}));
      return res.status(500).json({ 
        error: 'Erro ao fazer commit no GitHub', 
        details: errData.message || putRes.statusText 
      });
    }

    const result = await putRes.json();

    return res.status(200).json({ 
      success: true, 
      commitSha: result.commit ? result.commit.sha : 'ok',
      message: 'Alterações publicadas! O site será atualizado em ~30-60 segundos.'
    });

  } catch (err) {
    return res.status(500).json({ 
      error: 'Erro interno', 
      details: err.message 
    });
  }
}
