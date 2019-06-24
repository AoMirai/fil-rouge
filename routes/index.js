const { Router } = require('express');

const router = Router();
const connection = require('../conf');

router.get('/', (req, res) => {
  res.json({
    title: 'Express'
  });
});

router.get('/api/pokemon', (req, res) => {
  if (req.query.name) {
    const { name } = req.query;
    connection.query(`SELECT id, name, date from pokemon where name='${name}'`, (err, results) => {
      if (err) {
        res.status(500).send('Erreur lors de la récupération des pokemon');
      } else {
        res.json(results);
      }
    });
  } else if (req.query.contains) {
    const { contains } = req.query;
    connection.query(`SELECT id, name from pokemon where name like '%${contains}%'`, (err, results) => {
      if (err) {
        res.status(500).send('Erreur lors de la récupération des pokemon');
      } else {
        res.json(results);
      }
    });
  } else if (req.query.start) {
    const { start } = req.query;
    connection.query(`SELECT id, name from pokemon where name like '${start}%'`, (err, results) => {
      if (err) {
        res.status(500).send('Erreur lors de la récupération des pokemon');
      } else {
        res.json(results);
      }
    });
  } else if (req.query.date_capture) {
    const { date } = req.query;
    connection.query(`SELECT name from pokemon where date> '${date}'`, (err, results) => {
      if (err) {
        res.status(500).send('Erreur lors de la récupération des pokemon');
      } else {
        res.json(results);
      }
    });
  } else if (req.query.order) {
    const { order } = req.query;
    connection.query(`SELECT * from pokemon ORDER BY date ${order}`, (err, results) => {
      if (err) {
        res.status(500).send('Erreur lors de la récupération des pokemon');
      } else {
        res.json(results);
      }
    });
  } else {
    connection.query('SELECT * from pokemon', (err, results) => {
      if (err) {
        res.status(500).send('Erreur lors de la récupération des pokemon');
      } else {
        res.json(results);
      }
    });
  }
});

router.get('api/pokemon/light', (req, res) => {
  connection.query('SELECT name, type, PC FROM pokemon', (err, results) => {
    if (err) {
      res.status(500).send('Erreur lors de la récupération des pokemon');
    } else {
      res.json(results);
    }
  });
});

router.post('/api/pokemon', (req, res) => {
  const formData = req.body;
  connection.query('INSERT INTO pokemon SET ?', formData, () => {
    res.sendStatus(200);
  });
});

router.put('/api/pokemon', (req, res) => {
  const idPokemon = req.body.id;
  const formData = req.body;
  connection.query('UPDATE pokemon SET ? WHERE id = ?', [formData, idPokemon], (err) => {
    if (err) {
      res.status(500).send("Erreur lors de la modification d'un film");
    } else {
      res.sendStatus(200);
    }
  });
});

router.put('/api/pokemon/alive/:id', (req, res) => {
  const idPokemon = req.params.id;
  const formData = req.body;
  connection.query(`UPDATE pokemon SET is_alive = !is_KO WHERE id = ${idPokemon}`, formData, (err) => {
    if (err) {
      res.status(500).send("Erreur lors de la modification d'un film");
    } else {
      res.sendStatus(200);
    }
  });
});

router.delete('/api/pokemon/:id', (req, res) => {
  const idPokemon = req.params.id;
  connection.query('DELETE FROM pokemon WHERE id = ?', [idPokemon], (err) => {
    if (err) {
      res.status(500).send("Erreur lors de la suppression d'un film");
    } else {
      res.sendStatus(200);
    }
  });
});

router.delete('/api/pokemon/dead', (req, res) => {
  connection.query('DELETE FROM pokemon WHERE is_alive = 0', (err) => {
    if (err) {
      res.status(500).send("Erreur lors de la suppression d'un film");
    } else {
      res.sendStatus(200);
    }
  });
});

module.exports = router;
