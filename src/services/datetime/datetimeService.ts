import { DateTime } from "luxon";

function todayInUtc(): string {
    return DateTime.utc().toISODate();
}

export { todayInUtc };