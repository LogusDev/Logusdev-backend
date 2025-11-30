import BaseGuincho from '../models/BaseGuincho.js'; 

export const buscaBaseGuinchos = async (req, res) => {
    try {
        const baseGuinchos = await BaseGuincho.findAll();
        return res.status(200).json(baseGuinchos);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const buscaBaseGuinchoPorId = async (req, res) => {
    try {
        const baseGuincho = await BaseGuincho.findByPk(req.params.id);
        if (!baseGuincho) return res.status(404).json({ error: 'Guincho base não encontrado' });
        return res.status(200).json(baseGuincho);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const buscaBaseGuinchosPorMarca = async (req, res) => {
    try {
        const { marca } = req.params;
        const baseGuinchos = await BaseGuincho.findAll({ 
            where: { marca },
            order: [['modelo', 'ASC']]
        });
        return res.status(200).json(baseGuinchos);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const buscaBaseGuinchosPorModelo = async (req, res) => {
    try {
        const { marca, modelo } = req.params;
        const baseGuinchos = await BaseGuincho.findAll({ 
            where: { marca, modelo },
            order: [['ano_fabricacao', 'DESC']]
        });
        return res.status(200).json(baseGuinchos);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};




