const fs = require('fs');
const path = require('path');

// Leer el archivo db.json
const dbPath = path.join(__dirname, '../server/db.json');
const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Crear directorio api en public si no existe
const apiDir = path.join(__dirname, '../public/api');
if (!fs.existsSync(apiDir)) {
  fs.mkdirSync(apiDir, { recursive: true });
}

// Generar archivos JSON para cada endpoint
fs.writeFileSync(path.join(apiDir, 'users.json'), JSON.stringify(data.users, null, 2));
fs.writeFileSync(path.join(apiDir, 'courts.json'), JSON.stringify(data.courts, null, 2));
fs.writeFileSync(path.join(apiDir, 'coaches.json'), JSON.stringify(data.coaches, null, 2));
fs.writeFileSync(path.join(apiDir, 'bookings.json'), JSON.stringify(data.bookings, null, 2));

// Generar archivos individuales para cada usuario, court, coach
data.users.forEach(user => {
  fs.writeFileSync(path.join(apiDir, `users-${user.id}.json`), JSON.stringify(user, null, 2));
});

data.courts.forEach(court => {
  fs.writeFileSync(path.join(apiDir, `courts-${court.id}.json`), JSON.stringify(court, null, 2));
});

data.coaches.forEach(coach => {
  fs.writeFileSync(path.join(apiDir, `coaches-${coach.id}.json`), JSON.stringify(coach, null, 2));
});

data.bookings.forEach(booking => {
  fs.writeFileSync(path.join(apiDir, `bookings-${booking.id}.json`), JSON.stringify(booking, null, 2));
});

console.log('✅ Static API files generated in public/api/');
