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

export const getProvinces = (items) =>
    [...new Set(items.map(({ province }) => province))].sort()

const firstDay = ({ days }) => days?.[0] ?? {}

export function getVisibleItems({ items, query, filter, sort }) {
    const q = query.trim().toLowerCase()
    const filtered = items
        .filter(({ name }) => name.toLowerCase().includes(q))
        .filter(({ province }) => filter === "all" || province === filter)

    const sorters = {
        name: (a, b) => a.name.localeCompare(b.name),
        hottest: (a, b) => (firstDay(b).max ?? 0) - (firstDay(a).max ?? 0),
        rainiest: (a, b) => (firstDay(b).rain ?? 0) - (firstDay(a).rain ?? 0),
    }
    return sorters[sort] ? filtered.toSorted(sorters[sort]) : filtered
}

export function getStats(items) {
    const count = items.length
    const totalMax = items.reduce((sum, city) => sum + (firstDay(city).max ?? 0), 0)
    const totalRain = items.reduce((sum, city) => sum + (firstDay(city).rain ?? 0), 0)
    return { count, avgMax: count ? totalMax / count : null, totalRain }
}

export const debounce = (fn, delay = 300) => {
    let timer
    return (...args) => {
        clearTimeout(timer)
        timer = setTimeout(() => fn(...args), delay)
    }
}