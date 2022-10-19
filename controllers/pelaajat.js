const pelaajatRouter = require('express').Router()
const Pelaaja = require('../models/pelaaja')
const ObjectId = require('mongodb').ObjectId;


// GET pelaajat
pelaajatRouter.get('/', (req, res) => {
    Pelaaja.find({}).then(pelaajat =>
        res.json(pelaajat)
    )
})
// GET pelaajat/{id}
pelaajatRouter.get('/:id', (request, response) => {
    const id = request.params.id
    
    try {
        Pelaaja.findById(id).then(pelaaja => {
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

//PUT pelaajat/{id}
pelaajatRouter.put('/:id', async (request, response) => {
    const id = request.params.id
    const body = request.body;
    const o_id = new ObjectId(id);
    
    try {
        if (body.nimi) {
            const sameNameDiffId = await Pelaaja.find({ nimi: body.nimi }).where({ _id: { $ne: o_id } })
            console.log(sameNameDiffId)
            if (sameNameDiffId.length > 0) {
                return response.status(400).json({
                    error: 'A player with the same name already exists.'
                })
            }
        }
        const pelaaja = {
            nimi: body.nimi,
            lipukkeet: body.lipukkeet
        }
        const updatedPelaaja = await Pelaaja.findByIdAndUpdate(id, pelaaja, { new: true, runValidators: true, context: 'query' })
        if (!updatedPelaaja) return response.status(404).end()
        response.json(updatedPelaaja);
    }
    catch (error) {
        next(error)
    }

})

//POST pelaajat
pelaajatRouter.post('/', async (request, response) => {
    const body = request.body

    if (!body.nimi || !body.lipukkeet) {
        return response.status(400).json({
            error: 'Nimi or Lipukkeet was missing.'
        })
    }
    const results = await Pelaaja.findOne({ nimi: body.nimi })
    if (results.length > 0) {
        return response.status(400).json({
            error: 'A player with the same name already exists.'
        })
    } else {
        const pelaaja = new Pelaaja({
            nimi: body.nimi,
            lipukkeet: body.lipukkeet
        });
        try {
            const savedPelaaja = await pelaaja.save()
            response.json(savedPelaaja)
        }
        catch (error) {
            next(error)
        }

    }
})

//DELETE pelaajat/{id}
pelaajatRouter.delete('/:id', async (request, response) => {
    const id = request.params.id
    try {
        await Pelaaja.findByIdAndDelete(id)
        response.status(204).end()
    }
    catch {
        next(error)
    }
        
})
module.exports = pelaajatRouter
