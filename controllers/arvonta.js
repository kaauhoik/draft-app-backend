const arvontaRouter = require('express').Router()



let arvotutPelaajat = [];



//GET arvonta
arvontaRouter.get('/', (req, res) => {
    res.json(arvotutPelaajat)
})

//GET arvonta/{id}
arvontaRouter.get('//:id', (request, response) => {
    const id = Number(request.params.id)
    const pelaaja = arvotutPelaajat.find(pelaaja => pelaaja.id === id)
    if (pelaaja) {
        response.json(pelaaja)
    } else {
        response.status(404).end()
    }
})

//DELETE arvonta
arvontaRouter.delete('/', (request, response) => {

    arvotutPelaajat = [];
    response.status(204).end()
})
//POST arvonta
arvontaRouter.post('/', (req, res) => {
    const pelaajat = req.body;

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

    console.log(arvonta);
    const next = arvonta[Math.floor(Math.random() * arvonta.length)];
    const arvottu = pelaajat.find(p => p.id === next);
    arvotutPelaajat = arvotutPelaajat.concat({ ...arvottu, jarjestys: arvotutPelaajat.length + 1 });
    console.log(arvotutPelaajat);
    res.json(arvottu);

})
module.exports = arvontaRouter