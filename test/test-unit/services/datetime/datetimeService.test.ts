import MockDate from "mockdate";

import { todayInUtc } from "../../../../src/services/datetime/datetimeService";

const UTC = "z", UTC_PLUS_9_TIMEZONE = "+09:00", UTC_MINUS_9_TIMEZONE = "-09:00";

describe("todayInUtc", function () {
    afterEach(function () {
        MockDate.reset();
    });

    [
        {year: "2018", month: "08", day: "10", hour: "08", timezone: UTC, expected: "2018-08-10"},
        {year: "2018", month: "08", day: "01", hour: "01", timezone: UTC, expected: "2018-08-01"},
        {year: "2018", month: "08", day: "11", hour: "11", timezone: UTC_MINUS_9_TIMEZONE, expected: "2018-08-11"},
        {year: "2017", month: "12", day: "31", hour: "15", timezone: UTC_MINUS_9_TIMEZONE, expected: "2018-01-01"},
        {year: "2018", month: "08", day: "10", hour: "08", timezone: UTC_PLUS_9_TIMEZONE, expected: "2018-08-09"},
        {year: "2018", month: "08", day: "08", hour: "10", timezone: UTC_PLUS_9_TIMEZONE, expected: "2018-08-08"}
    ].forEach(({year, month, day, hour, timezone, expected}) =>
        it(`should get today formatted in ISODate format - "${expected}"`, function () {
            // given
            const mockToday = `${year}-${month}-${day}T${hour}:00:00.000${timezone}`;
            MockDate.set(mockToday);

            // when
            const actual = todayInUtc();

            // then
            expect(actual).toEqual(expected);
        })
    );
});