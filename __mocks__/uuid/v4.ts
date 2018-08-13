const mockUuid = "mocked uuid v4";

const fn = jest.fn(() => mockUuid);
Object.defineProperty(fn, "mockUuidV4", {
    get: function () {
        return mockUuid;
    }
});
module.exports = fn;