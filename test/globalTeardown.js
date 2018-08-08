module.exports = async function() {
    const mongod = global.__MONGOD__;
    if (mongod){
        await mongod.stop();
    }
};