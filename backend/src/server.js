require ('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server corriendo en http://localhost:${PORT}`);
});