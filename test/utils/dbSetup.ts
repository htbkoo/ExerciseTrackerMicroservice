if (!process.env.USE_REAL_DB_IN_TESTS) {
    jest.mock("../../src/external/database/MongoDbConnector");
}
