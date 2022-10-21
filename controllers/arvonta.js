const arvontaRouter = require('express').Router()
const Arvonta = require('../models/arvonta')


//GET arvonta
arvontaRouter.get('/', async (req, res) => {
    const ip = req.headers.ip
    const arvotut = await Arvonta.find({ip: ip})
    res.json(arvotut)
})

//GET arvonta/{id}
arvontaRouter.get('/:id', (request, response,next) => {
    const id = request.params.id || 0
    if (!ObjectId.isValid(id)) return response.status(404).end()
    try {
        Arvonta.findById(id).then(pelaaja => {
            if (pelaaja) {
                response.json(pelaaja)
            } else {    
                response.status(404).end()
            }
        })
    } catch (error) {
        next(error)   
    }
})

//DELETE arvonta
arvontaRouter.delete('/', async (request, response) => {
    const ip = request.headers.ip
    console.log(ip)
    if (ip) {
        await Arvonta.deleteMany({ip: ip})
    }
    response.status(204).end()
})
//POST arvonta
arvontaRouter.post('/', async (req, res, next) => {
    const pelaajat = req.body;
    const ip = req.headers.ip

    if (!pelaajat) {
        return res.status(400).json({
            error: 'Content missing.'
        })
    }
    let arvonta = [];
    pelaajat.forEach(p => {
        for (i = 0; i < p.lipukkeet; i++) {
            arvonta = arvonta.concat(p.id);
        };
    });

    console.log(arvonta.length);
    const nextP = arvonta[Math.floor(Math.random() * arvonta.length)];
    const arvottu = pelaajat.find(p => p.id === nextP);
    try {
        //arvotutPelaajat = arvotutPelaajat.concat({ ...arvottu, jarjestys: arvotutPelaajat.length + 1 });
        const jarjestysNo  = await Arvonta.countDocuments({ip: ip}) + 1
        const dbArvottu = new Arvonta({
            nimi: arvottu.nimi,
            jarjestys: jarjestysNo,
            id: arvottu.id,
            ip: ip
        })
        await dbArvottu.save()
        res.json(arvottu);

    } catch (error) {
        next(error)
    }


})
module.exports = arvontaRouter