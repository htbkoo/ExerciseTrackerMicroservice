if (!process.env.USE_REAL_DB_IN_TESTS) {
    console.debug("mocking MongoDbConnector using jest.mock");
    jest.mock("../../src/external/database/MongoDbConnector");
}
