const fs = require('fs');
const path = require('path');

// Leer el archivo db.json
const dbPath = path.join(__dirname, '..', 'server', 'db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Agregar availableCoaches a las courts que faltan
const courtCoachRelations = {
  "4": ["1", "3"],
  "5": ["1", "5"],
  "6": ["2", "4"],
  "7": ["2", "4"],
  "8": ["2", "4"],
  "9": ["2", "4"],
  "10": ["2", "4"],
  "11": ["3"],
  "12": ["3"],
  "13": ["4"],
  "14": ["4"],
  "15": ["5"],
  "16": ["5"],
  "17": ["1", "3", "5"],
  "18": ["1", "2"],
  "19": ["2", "3"],
  "20": ["1", "4", "5"]
};

// Actualizar las courts
db.courts.forEach(court => {
  if (courtCoachRelations[court.id] && !court.availableCoaches) {
    court.availableCoaches = courtCoachRelations[court.id];
  }
});

// Escribir el archivo actualizado
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log('Relaciones de canchas y entrenadores agregadas exitosamente');
