import * as MockDate from "../../../utils/mockDate";

import { todayInUtc } from "../../../../src/services/datetime/datetimeService";

const UTC_PLUS_9_TIMEZONE = "09:00";

describe("today", function () {
    afterEach(function () {
        MockDate.reset();
    });

    it("should get today formatted in string (in YYYY-MM-DD by default)", function () {
        // given
        const year = "2018", month = "08", day = "10";
        const timezone = UTC_PLUS_9_TIMEZONE;
        const mockToday = `${year}-${month}-${day}T00:08:00.000+${timezone}`;
        MockDate.set(mockToday);

        // when
        const actual = todayInUtc();

        // then
        const expected = "2018-08-09";
        expect(actual).toEqual(expected);
    });
});