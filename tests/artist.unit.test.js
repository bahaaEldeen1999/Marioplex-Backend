const mongoose = require('mongoose');
mockArtist=require('../public-api/artist-api');
const dbHandler = require('./db-handler');

/**
 * Connect to a new in-memory database before running any tests.
 */
beforeAll(async () => {
    await dbHandler.connect();
});
/**
 * Clear all test data after every test.
 */
afterEach(async () => {
    await dbHandler.clearDatabase();
});
/**
 * Remove and close the db and server.
 */
afterAll(async () => {
    await dbHandler.closeDatabase();
});

const user={
    id:"1"
}

test('Create Artist',async ()=>{
    artistCreated=await mockArtist.createArtist(user,"this is me","NADA",["DANCE"]);
    expect(Array(...artistCreated.genre)).toEqual(  
        ['DANCE']
      );
 })

 
 