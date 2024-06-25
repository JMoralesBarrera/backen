const mongoose = require('mongoose');

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.DB_CNN, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
           
        }); 

        console.log('DB Online');
    } catch (error) {
        console.error('Error al inicializar BD', error);
        throw new Error('Error al inicializar BD');
    }
};

module.exports = {
    dbConnection,
};
