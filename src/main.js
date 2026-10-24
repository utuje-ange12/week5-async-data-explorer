import "./style.css"
import { CITIES, getAllForecasts, getCityForecast } from "./api.js"
import { render } from "./render.js"
import { toForecastDays } from "./utils.js"

const idleDetail = { status: "idle", city: null, days: [], error: null }

const state = {
    items: [],
    failed: [],
    status: "loading",
    error: null,
    query: "",
    filter: "all",
    sort: "default",
    detail: idleDetail,
}

async function load() {
    state.status = "loading"
    state.failed = []
    render(state)
    try {
        const { loaded, failed } = await getAllForecasts(CITIES)
        if (loaded.length === 0) throw new Error("All requests failed")
        state.items = loaded.map(({ daily, ...city }) => ({
            ...city,
            days: toForecastDays(daily),
        }))
        state.failed = failed
        state.status = "success"
    } catch (err) {
        state.status = "error"
        state.error = err.message
    } finally {
        render(state)
    }
}

async function openDetails(name) {
    const city = state.items.find((item) => item.name === name)
    if (!city) return

    state.detail = { status: "loading", city, days: [], error: null }
    render(state)

    try {
        const data = await getCityForecast(city)
        if (state.detail.city !== city) return
        state.detail = { ...state.detail, status: "success", days: toForecastDays(data.daily) }
    } catch (err) {
        if (state.detail.city !== city) return
        state.detail = { ...state.detail, status: "error", error: err.message }
    }
    render(state)
}

function closeDetails() {
    state.detail = idleDetail
    render(state)
}

document.querySelector("#search").addEventListener("input", (event) => {
    state.query = event.target.value
    render(state)
})

document.querySelector("#filter").addEventListener("change", (event) => {
    state.filter = event.target.value
    render(state)
})

document.querySelector("#sort").addEventListener("change", (event) => {
    state.sort = event.target.value
    render(state)
})

document.querySelector("#app").addEventListener("click", (event) => {
    if (event.target.closest('[data-action="retry"]')) load()
    const cityButton = event.target.closest("[data-city]")
    if (cityButton) openDetails(cityButton.dataset.city)
})

const dialog = document.querySelector("#details")

dialog.addEventListener("click", (event) => {
    if (event.target === dialog || event.target.closest('[data-action="close-details"]')) {
        closeDetails()
    }
})

dialog.addEventListener("close", () => {
    if (state.detail.status !== "idle") closeDetails()
})

load()