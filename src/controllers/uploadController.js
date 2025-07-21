  import minioClient from '../services/minioClient.js';
  import Cliente from '../models/Cliente.js';
  import path from 'path';

  export const uploadFotoCliente = async (req, res) => {
    try {
      const { email } = req.body;
      const file = req.file;

      if (!email || !file) {
        return res.status(400).json({ 
          error: 'Email e imagem são obrigatórios' 
        });
      }

      const objectName = `clientes/${email.replace(/[@.]/g, '_')}_${Date.now()}${path.extname(file.originalname)}`;

      await minioClient.putObject(
        'users',
        objectName,
        file.buffer,
        file.size,
        {
          'Content-Type': file.mimetype,
          'Cache-Control': 'public, max-age=31536000'
        }
      );

      const fotoUrl = `http://34.151.235.1:9000/users/${objectName}`;
      console.log('fotoUrl:', fotoUrl);

      await Cliente.update(
        { foto_url: fotoUrl },
        { where: { email } }
      );

      res.json({ 
        success: true,
        message: 'Upload realizado com sucesso',
        fotoUrl 
      });

    } catch (error) {
      console.error('Erro no upload:', error);
      res.status(500).json({ 
        error: 'Falha no upload da imagem',
        details: error.message 
      });
    }
  };