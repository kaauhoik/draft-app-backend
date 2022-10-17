
const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors())
app.use(express.json());

let pelaajat = [
    { id: 1, lipukkeet: 5, nimi: 'Kalle' },
    { id: 2, lipukkeet: 10, nimi: 'Bombasto' },
    { id: 3, lipukkeet: 15, nimi: 'Celeritas' },
    { id: 4, lipukkeet: 20, nimi: 'Magneta' },
    { id: 5, lipukkeet: 25, nimi: 'RubberMan' },
    { id: 6, lipukkeet: 30, nimi: 'Dynama' },
    { id: 7, lipukkeet: 35, nimi: 'Dr. IQ' },
    { id: 8, lipukkeet: 40, nimi: 'Magma' },
    { id: 9, lipukkeet: 45, nimi: 'Tornado' }

];

let arvotutPelaajat = [];

const generateId = () => {
    const maxId = pelaajat.length > 0
        ? Math.max(...pelaajat.map(n => n.id))
        : 0
    return maxId + 1
}

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/api/pelaajat', (req, res) => {
    res.json(pelaajat)
})

app.get('/api/pelaajat/:id', (request, response) => {
    const id = Number(request.params.id)
    const pelaaja = pelaajat.find(pelaaja => pelaaja.id === id)
    if (pelaaja) {
        response.json(pelaaja)
    } else {
        response.status(404).end()
    }
})

app.post('/api/pelaajat', (request, response) => {
    const body = request.body

    if (!body.nimi || !body.lipukkeet) {
        return response.status(400).json({
            error: 'nimi or lipukkeet missing'
        })
    }

    if (pelaajat.find(p => p.nimi === body.nimi)) {
        return response.status(400).json({
            error: 'player with the same name already exists.'
        })
    }

    const pelaaja = {
        id: generateId(),
        nimi: body.nimi,
        lipukkeet: body.lipukkeet
    }

    pelaajat = pelaajat.concat(pelaaja)

    response.json(pelaaja)
})

app.delete('/api/pelaajat/:id', (request, response) => {
    const id = Number(request.params.id)
    pelaajat = pelaajat.filter(pelaaja => pelaaja.id !== id)
    response.status(204).end()
})

app.get('/api/arvonta', (req, res) => {
    res.json(arvotutPelaajat)
})

app.get('/api/arvonta/:id', (request, response) => {
    const id = Number(request.params.id)
    const pelaaja = arvotutPelaajat.find(pelaaja => pelaaja.id === id)
    if (pelaaja) {
        response.json(pelaaja)
    } else {
        response.status(404).end()
    }
})


app.delete('/api/arvonta/', (request, response) => {
    
    arvotutPelaajat = [];
    response.status(204).end()
})

app.post('/api/arvonta', (req, res) => {
    const pelaajat = req.body;

    if (!pelaajat) {
        return res.status(400).json({
            error: 'content missing'
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
    arvotutPelaajat = arvotutPelaajat.concat({...arvottu, jarjestys: arvotutPelaajat.length +1});
    console.log(arvotutPelaajat);
    res.json(arvottu);

})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})