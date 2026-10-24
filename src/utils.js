export const escapeHTML = (str) =>
    String(str).replace(/[&<>"']/g, (c) =>
        ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c])

export const toForecastDays = ({
                                   time = [],
                                   temperature_2m_max = [],
                                   temperature_2m_min = [],
                                   precipitation_sum = [],
                               } = {}) =>
    time.map((date, i) => ({
        date,
        max: temperature_2m_max[i] ?? null,
        min: temperature_2m_min[i] ?? null,
        rain: precipitation_sum[i] ?? 0,
    }))